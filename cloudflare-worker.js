/**
 * ==============================================================================================
 * SUBA VALLI VILAS JEWELLERY - CLOUDFLARE WORKER GATEWAY (ULTRA-FAST DIRECT SHEETS API V4)
 * ==============================================================================================
 * Architecture: Google Sheet (API v4) <---> Cloudflare Worker Gateway <---> Web App / GitHub Pages
 * Features:
 *   1. Direct Google Sheets API v4 using Service Account (Zero Google Apps Script intermediate).
 *   2. Batch Range Fetching (values:batchGet) — pulls all 7 sheet tabs in 1 single HTTP request!
 *   3. In-Memory Edge Caching (15s TTL) with instant purge on any write (sub-20ms reads).
 *   4. Open ranges for all tables (A:K, A:AB, etc.) — zero row truncation.
 *   5. High-speed JSON response with CORS & Cache-Control headers.
 * ==============================================================================================
 */

const DEFAULT_SHEET_ID = "1KIaNXXZvjMVFbdQVI0KAmH7lS4Xm_jLsD3I5wzUyJ9U";

let cachedToken = null;
let tokenExpiresAt = 0;

// In-Memory Edge Cache for ultra-fast pulls
let pullCache = null;
let pullCacheTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds fresh cache

function invalidateCache() {
  pullCache = null;
  pullCacheTime = 0;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const sheetId = (env && env.SPREADSHEET_ID) || DEFAULT_SHEET_ID;

    // Health check
    if (path === "/" || path === "/api/health") {
      return sendJson({
        status: "online",
        service: "SVV CRM Cloudflare Gateway",
        version: "4.0-direct-batch",
        mode: "DIRECT_SHEETS_API_V4",
        sheetId: sheetId,
        cachedRecordsAvailable: pullCache !== null,
        timestamp: new Date().toISOString()
      });
    }

    if (!env || !env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return sendJson({
        status: "ERROR",
        message: "Missing GOOGLE_SERVICE_ACCOUNT_JSON secret in Cloudflare Worker environment. Please configure it in Cloudflare Dashboard -> Settings -> Variables & Secrets."
      }, 500);
    }

    try {
      const sa = typeof env.GOOGLE_SERVICE_ACCOUNT_JSON === "string" 
        ? JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) 
        : env.GOOGLE_SERVICE_ACCOUNT_JSON;

      const token = await getAccessToken(sa);

      // GET: Pull All CRM Data (BATCHED SINGLE-REQUEST FETCH + IN-MEMORY CACHE)
      if (method === "GET" && (path === "/api/pull" || path === "/api/data")) {
        const now = Date.now();
        const forceFresh = url.searchParams.get("fresh") === "true";

        if (!forceFresh && pullCache && (now - pullCacheTime < CACHE_TTL_MS)) {
          return sendJson({ ...pullCache, cached: true }, 200, {
            "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
            "X-Data-Source": "Edge-Memory-Cache"
          });
        }

        const ranges = [
          "FEEDBACK_QUESTIONS!A:M",
          "DIVERT_QUESTIONS!A:H",
          "USER_CREATION!A:L",
          "FEEDBACK_RESPONSES!A:AB",
          "CUSTOMER_DIVERTS!A:S",
          "FOOTFALL_LOG!A:K",
          "TELECALLER_LOGS!A:I"
        ];

        let fb = [], div = [], u = [], resp = [], diverts = [], ff = [], calls = [];

        try {
          [fb, div, u, resp, diverts, ff, calls] = await batchReadSheets(token, sheetId, ranges);
        } catch (batchErr) {
          console.warn("Batch read fallback to parallel:", batchErr);
          const [rFb, rDiv, rU, rResp, rDivs, rFf, rCalls] = await Promise.all([
            readSheet(token, sheetId, "FEEDBACK_QUESTIONS!A:M"),
            readSheet(token, sheetId, "DIVERT_QUESTIONS!A:H"),
            readSheet(token, sheetId, "USER_CREATION!A:L"),
            readSheet(token, sheetId, "FEEDBACK_RESPONSES!A:AB"),
            readSheet(token, sheetId, "CUSTOMER_DIVERTS!A:S"),
            readSheet(token, sheetId, "FOOTFALL_LOG!A:K"),
            readSheet(token, sheetId, "TELECALLER_LOGS!A:I")
          ]);
          fb = rFb; div = rDiv; u = rU; resp = rResp; diverts = rDivs; ff = rFf; calls = rCalls;
        }

        const payload = {
          status: "SUCCESS",
          feedbackQuestions: toObjects(fb),
          divertQuestions: toObjects(div),
          users: toObjects(u),
          feedbacks: toObjects(resp),
          diverts: toObjects(diverts),
          footfall: toObjects(ff),
          calls: toObjects(calls),
          timestamp: new Date().toISOString()
        };

        // Cache for subsequent instant responses
        pullCache = payload;
        pullCacheTime = Date.now();

        return sendJson(payload, 200, {
          "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
          "X-Data-Source": "Google-Sheets-Direct-Batch"
        });
      }

      // GET: Questions Schema
      if (method === "GET" && (path === "/api/questions" || path === "/api/schema")) {
        const [fb, div] = await batchReadSheets(token, sheetId, [
          "FEEDBACK_QUESTIONS!A:M",
          "DIVERT_QUESTIONS!A:H"
        ]);
        return sendJson({
          status: "SUCCESS",
          action: "GET_QUESTIONS",
          feedbackQuestions: toObjects(fb),
          divertQuestions: toObjects(div),
          timestamp: new Date().toISOString()
        });
      }

      // GET: Users
      if (method === "GET" && path === "/api/users") {
        const rows = await readSheet(token, sheetId, "USER_CREATION!A:L");
        return sendJson({
          status: "SUCCESS",
          action: "GET_USERS",
          users: toObjects(rows),
          timestamp: new Date().toISOString()
        });
      }

      // GET: Masters (Users + Questions)
      if (method === "GET" && path === "/api/masters") {
        const [u, fb, div] = await batchReadSheets(token, sheetId, [
          "USER_CREATION!A:L",
          "FEEDBACK_QUESTIONS!A:M",
          "DIVERT_QUESTIONS!A:H"
        ]);
        const users = toObjects(u);
        return sendJson({
          status: "SUCCESS",
          action: "GET_MASTERS",
          users: users,
          feedbackQuestions: toObjects(fb),
          divertQuestions: toObjects(div),
          derivedMasters: {
            branches: [...new Set(users.map(x => x.Branch).filter(Boolean))],
            staffNames: users.filter(x => ["Staff", "Manager", "Admin"].includes(x.Role)).map(x => x.Full_Name),
            roles: [...new Set(users.map(x => x.Role).filter(Boolean))]
          }
        });
      }

      // GET: Align 28 Column Feedback Headers
      if (path === "/api/setup-headers" || path === "/api/align-headers") {
        const feedbackHeaders = [
          "Feedback_ID", "Timestamp", "Date", "Branch", "Source", "Status",
          "Customer_Name", "Mobile_Number", "City", "Occupation", "Staff_Name",
          "Rating_10", "Mood", "Customer_Remarks", "Staff_Action_Remarks",
          "Q0_Frequency", "Q1_Heard_About", "Q2_Store_Experience", "Q3_Staff_Service",
          "Q4_Occasion", "Occasion_Date", "Q5_Chit_Awareness", "Q6_Jewellery_Interest",
          "Q7_Recommend", "Overall_Shopping_Experience", "Invoice_No",
          "Section_Zone", "Updated_At"
        ];
        await updateRange(token, sheetId, "FEEDBACK_RESPONSES!A1:AB1", [feedbackHeaders]);
        invalidateCache();
        return sendJson({ status: "SUCCESS", action: "SETUP_HEADERS", headers: feedbackHeaders });
      }

      // ================= POST MUTATION ENDPOINTS (DIRECT SHEETS API) =================
      if (method === "POST") {
        const body = await request.json().catch(() => ({}));
        const data = body.data || body;
        const action = body.action || "";

        // 1. ADD_FEEDBACK
        if (path === "/api/feedback" || action === "ADD_FEEDBACK") {
          try {
            const headCheck = await readSheet(token, sheetId, "FEEDBACK_RESPONSES!AA1:AB1");
            if (!headCheck || !headCheck.length || !headCheck[0] || !headCheck[0][0]) {
              const feedbackHeaders = [
                "Feedback_ID", "Timestamp", "Date", "Branch", "Source", "Status",
                "Customer_Name", "Mobile_Number", "City", "Occupation", "Staff_Name",
                "Rating_10", "Mood", "Customer_Remarks", "Staff_Action_Remarks",
                "Q0_Frequency", "Q1_Heard_About", "Q2_Store_Experience", "Q3_Staff_Service",
                "Q4_Occasion", "Occasion_Date", "Q5_Chit_Awareness", "Q6_Jewellery_Interest",
                "Q7_Recommend", "Overall_Shopping_Experience", "Invoice_No",
                "Section_Zone", "Updated_At"
              ];
              await updateRange(token, sheetId, "FEEDBACK_RESPONSES!A1:AB1", [feedbackHeaders]);
            }
          } catch (_) {}

          const id = data.id || data.Feedback_ID || ("SVV-FB-" + Date.now());
          const ratingVal = Number(data.rating !== undefined ? data.rating : (data.Rating_10 !== undefined ? data.Rating_10 : (data.q7 || 10))) || 10;
          const customerName = data.customerName || data.Customer_Name || data.name || "";
          const mobile = data.mobile || data.Mobile_Number || data.phone || "";
          const row = [
            id,
            data.timestamp || data.Timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            data.date || data.Date || new Date().toISOString().split("T")[0],
            data.branch || data.Branch || "Cuddalore (Main Branch)",
            data.source || data.Source || "Staff",
            data.status || data.Status || "NEW",
            customerName,
            mobile,
            data.city || data.City || "",
            data.occupation || data.Occupation || "",
            data.staffName || data.Staff_Name || data.staff || "",
            ratingVal,
            data.mood || data.Mood || (ratingVal >= 9 ? "Appreciation" : (ratingVal <= 6 ? "Concern" : "Feedback")),
            data.remarks || data.Customer_Remarks || data.customerRemarks || data.feedbackComment || "",
            data.actionRemark || data.Staff_Action_Remarks || data.staffActionRemarks || "",
            data.q0 || data.Q0_Frequency || data.frequency || "",
            data.q1 || data.Q1_Heard_About || data.heardAbout || "",
            data.q2 || data.Q2_Store_Experience || data.storeExperience || "",
            data.q3 || data.Q3_Staff_Service || data.staffService || "",
            data.q4 || data.Q4_Occasion || data.occasion || "",
            data.occasionDate || data.Occasion_Date || "",
            data.q5 || data.Q5_Chit_Awareness || data.chitAwareness || "",
            data.q6 || data.Q6_Jewellery_Interest || data.jewelleryInterest || "",
            data.q7 || data.Q7_Recommend || data.recommendationChoice || String(ratingVal),
            data.overallShoppingExperience || data.Overall_Shopping_Experience || data.overallExperience || data.q8 || (ratingVal >= 9 ? "Excellent" : "Good"),
            data.invoiceNo || data.Invoice_No || data.invoice || "SVV-COUNTER",
            data.section || data.Section_Zone || data.sectionZone || data.counter || "Showroom Floor",
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          ];
          await appendRow(token, sheetId, "FEEDBACK_RESPONSES!A:AB", row);
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "ADD_FEEDBACK", id: id, version: "4.0-direct" });
        }

        // 2. UPDATE_FEEDBACK_STATUS
        if (path === "/api/feedback/status" || action === "UPDATE_FEEDBACK_STATUS") {
          const targetId = String(data.id || "").trim();
          const newStatus = (data.status || "REVIEWED").toUpperCase();
          const actionRemark = data.actionRemark || data.staffActionRemarks || "";
          
          const rows = await readSheet(token, sheetId, "FEEDBACK_RESPONSES!A:A");
          let updateRow = -1;
          if (Array.isArray(rows)) {
            for (let i = 1; i < rows.length; i++) {
              if (rows[i] && String(rows[i][0]).trim() === targetId) {
                updateRow = i + 1;
                break;
              }
            }
          }
          if (updateRow !== -1) {
            await updateRange(token, sheetId, `FEEDBACK_RESPONSES!F${updateRow}`, [[newStatus]]);
            if (actionRemark) {
              await updateRange(token, sheetId, `FEEDBACK_RESPONSES!O${updateRow}`, [[actionRemark]]);
            }
            invalidateCache();
            return sendJson({ status: "SUCCESS", action: "UPDATE_FEEDBACK_STATUS", id: targetId, newStatus: newStatus });
          }
          return sendJson({ status: "ERROR", message: "Feedback record not found: " + targetId }, 404);
        }

        // 3. ADD_DIVERT
        if (path === "/api/divert" || action === "ADD_DIVERT") {
          const id = data.id || ("SVV-DIV-" + Date.now());
          const row = [
            id,
            data.timestamp || new Date().toISOString(),
            data.date || new Date().toLocaleDateString("en-GB"),
            data.branch || "Cuddalore (Main Branch)",
            data.customerName || "",
            data.mobile || "",
            data.section || "",
            data.counter || "",
            data.reason || "",
            data.product || "",
            data.design || "",
            data.size || "",
            data.gramRange || "",
            data.purpose || "",
            data.attendedStaff || data.employee || "",
            data.priority || "MEDIUM",
            data.otherReason || "",
            data.status || "LOGGED",
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          ];
          await appendRow(token, sheetId, "CUSTOMER_DIVERTS!A:S", row);
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "ADD_DIVERT", id: id });
        }

        // 4. FOOTFALL, DAY-END BILLS & PAST DAY AUDITS
        if (path === "/api/footfall" || action === "UPDATE_FOOTFALL" || action === "SAVE_DAY_END_BILLS" || action === "SAVE_PAST_DAY_AUDIT") {
          const slotRanges = [
            "10:00 AM – 11:00 AM",
            "11:00 AM – 12:00 PM",
            "12:00 PM – 01:00 PM",
            "01:00 PM – 02:00 PM",
            "02:00 PM – 03:00 PM",
            "03:00 PM – 04:00 PM",
            "04:00 PM – 05:00 PM",
            "05:00 PM – 06:00 PM",
            "06:00 PM – 07:00 PM",
            "07:00 PM – 08:00 PM",
            "08:00 PM – 09:00 PM",
            "09:00 PM – 10:00 PM"
          ];
          const date = data.date || new Date().toISOString().split("T")[0];
          const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
          const branch = data.branch || "Cuddalore (Main Branch)";
          const loggedBy = data.loggedBy || "Admin";

          const updateDerSummaryRow = async (totalFf, totalB, convPct, peakH, auditStatus) => {
            try {
              const derRows = await readSheet(token, sheetId, "DER_SUMMARY!A:A");
              let derRowIdx = -1;
              if (Array.isArray(derRows)) {
                for (let i = 1; i < derRows.length; i++) {
                  if (derRows[i] && String(derRows[i][0]).trim() === date) {
                    derRowIdx = i + 1;
                    break;
                  }
                }
              }
              const derRow = [
                date,
                branch,
                String(totalFf),
                String(totalB),
                convPct,
                data.npsScore || "+96",
                data.csiScore || "97%",
                String(data.divertCount || 0),
                data.divertPct || "0%",
                peakH || "05:00 PM - 06:00 PM",
                "Wedding / Bridal",
                auditStatus || "Verified"
              ];
              if (derRowIdx !== -1) {
                await updateRange(token, sheetId, `DER_SUMMARY!A${derRowIdx}:L${derRowIdx}`, [derRow]);
              } else {
                await appendRow(token, sheetId, "DER_SUMMARY!A:L", derRow);
              }
            } catch (derErr) {
              console.warn("DER_SUMMARY update error:", derErr);
            }
          };

          // Case A: Full Day Audit (12 Slots + Bills)
          if (action === "SAVE_PAST_DAY_AUDIT" || Array.isArray(data.slots)) {
            const slots = Array.isArray(data.slots) ? data.slots : [0,0,0,0,0,0,0,0,0,0,0,0];
            const billsVal = Number(data.dayEndBills !== undefined ? data.dayEndBills : (data.dayBills !== undefined ? data.dayBills : (data.bills !== undefined ? data.bills : data.todayBills))) || 0;
            const totalFootfall = Number(data.totalFootfall !== undefined ? data.totalFootfall : (data.footfall !== undefined ? data.footfall : slots.reduce((a, b) => a + (Number(b) || 0), 0))) || 0;
            const conversionPct = data.conversionPct || (totalFootfall > 0 ? ((billsVal / totalFootfall) * 100).toFixed(1) + "%" : "0.0%");
            const ratio = data.ratio || (billsVal > 0 ? (totalFootfall / billsVal).toFixed(1) : "0");

            let maxCount = -1;
            let peakHour = data.peakHour || "";
            slots.forEach((cnt, idx) => {
              const c = Number(cnt) || 0;
              if (c > maxCount) {
                maxCount = c;
                peakHour = slotRanges[idx];
              }
            });

            const existingRows = await readSheet(token, sheetId, "FOOTFALL_LOG!A:B");
            const existingMap = {};
            const duplicateRowsToClear = [];
            if (Array.isArray(existingRows)) {
              for (let i = 1; i < existingRows.length; i++) {
                if (existingRows[i] && existingRows[i][0] && existingRows[i][1]) {
                  const rDate = String(existingRows[i][0]).trim();
                  const rSlot = String(existingRows[i][1]).trim().toUpperCase();
                  if (matchDates(rDate, date)) {
                    const dKey = `${date}_${rSlot}`;
                    if (!existingMap[dKey]) {
                      existingMap[dKey] = i + 1;
                    } else {
                      duplicateRowsToClear.push(i + 1);
                    }
                  }
                }
              }
            }

            for (let idx = 0; idx < 12; idx++) {
              const slotId = `SLOT_${String(idx + 1).padStart(2, "0")}`;
              const slotRange = slotRanges[idx];
              const slotCount = Number(slots[idx]) || 0;
              const slotRow = [
                date,
                slotId,
                slotRange,
                slotCount,
                billsVal,
                conversionPct,
                ratio,
                peakHour,
                branch,
                loggedBy,
                nowStr
              ];
              const key = `${date}_${slotId}`;
              if (existingMap[key]) {
                await updateRange(token, sheetId, `FOOTFALL_LOG!A${existingMap[key]}:K${existingMap[key]}`, [slotRow]);
              } else {
                await appendRow(token, sheetId, "FOOTFALL_LOG!A:K", slotRow);
              }
            }

            const dayEndKey = `${date}_DAY_END`;
            const dayEndTotalKey = `${date}_DAY_END_TOTAL`;
            const dayEndRowIdx = existingMap[dayEndKey] || existingMap[dayEndTotalKey];
            const dayEndRow = [
              date,
              "DAY_END",
              "Day End Total",
              totalFootfall,
              billsVal,
              conversionPct,
              ratio,
              peakHour,
              branch,
              loggedBy,
              nowStr
            ];
            if (dayEndRowIdx) {
              await updateRange(token, sheetId, `FOOTFALL_LOG!A${dayEndRowIdx}:K${dayEndRowIdx}`, [dayEndRow]);
            } else {
              await appendRow(token, sheetId, "FOOTFALL_LOG!A:K", dayEndRow);
            }

            for (const dupRowIdx of duplicateRowsToClear) {
              await clearRange(token, sheetId, `FOOTFALL_LOG!A${dupRowIdx}:K${dupRowIdx}`);
            }

            await updateDerSummaryRow(totalFootfall, billsVal, conversionPct, peakHour, "Verified (Past Day Audited)");
            invalidateCache();
            return sendJson({ status: "SUCCESS", action: "SAVE_PAST_DAY_AUDIT", date: date });
          }

          // Case B: Single Slot or Day-End Bills Update
          const slotId = data.slotId || (data.slot ? `SLOT_${String(data.slot).padStart(2, "0")}` : "DAY_END");
          const slotRange = data.slotRange || data.timeRange || "";
          const footfallVal = Number(data.footfall !== undefined ? data.footfall : (data.count !== undefined ? data.count : 0));
          const billsVal = Number(data.dayEndBills !== undefined ? data.dayEndBills : (data.dayBills !== undefined ? data.dayBills : 0));
          
          const row = [
            date,
            slotId,
            slotRange,
            footfallVal,
            billsVal,
            data.conversionPct || "0%",
            data.ratio || "0",
            data.peakHourToday || data.peakHour || "",
            branch,
            loggedBy,
            nowStr
          ];

          const existingRows = await readSheet(token, sheetId, "FOOTFALL_LOG!A:B");
          let targetRowIdx = -1;
          if (Array.isArray(existingRows)) {
            for (let i = 1; i < existingRows.length; i++) {
              if (existingRows[i] && existingRows[i][0] && existingRows[i][1]) {
                const rDate = String(existingRows[i][0]).trim();
                const rSlot = String(existingRows[i][1]).trim().toUpperCase();
                if (matchDates(rDate, date) && rSlot === slotId.toUpperCase()) {
                  targetRowIdx = i + 1;
                  break;
                }
              }
            }
          }

          if (targetRowIdx !== -1) {
            await updateRange(token, sheetId, `FOOTFALL_LOG!A${targetRowIdx}:K${targetRowIdx}`, [row]);
          } else {
            await appendRow(token, sheetId, "FOOTFALL_LOG!A:K", row);
          }

          if (action === "SAVE_DAY_END_BILLS") {
            await updateDerSummaryRow(footfallVal, billsVal, data.conversionPct || "0%", data.peakHourToday || data.peakHour || "", "Verified (Day End Closed)");
          }

          invalidateCache();
          return sendJson({ status: "SUCCESS", action: action || "UPDATE_FOOTFALL", mode: targetRowIdx !== -1 ? "UPDATED" : "APPENDED" });
        }

        // 5. LOG_CALL
        if (path === "/api/call" || action === "LOG_CALL") {
          const callId = data.callId || ("CALL-" + Date.now());
          const callRow = [
            callId,
            data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            data.customerName || "",
            data.mobile || "",
            data.queueCategory || "General Calling",
            data.disposition || "Connected",
            data.callbackDate || "",
            data.notes || "",
            data.caller || "Lakshmi"
          ];
          await appendRow(token, sheetId, "TELECALLER_LOGS!A:I", callRow);
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "LOG_CALL", id: callId });
        }

        // 6. USER MANAGEMENT
        if (path === "/api/users" || action === "ADD_USER") {
          const userId = data.userId || data.id || ("USR-" + String(Date.now()).slice(-6));
          const userRow = [
            userId,
            data.fullName || data.Full_Name || "",
            data.username || data.Username || "",
            data.password || data.Default_Password || "svv@2026",
            data.branch || data.Branch || "Cuddalore (Main Branch)",
            data.role || data.Role || "Staff",
            data.dept || data.Assigned_Counter_Dept || "",
            data.mobile || data.Mobile_Number || "",
            data.email || data.Email || "",
            data.permissions || data.Granted_Permissions || "",
            data.status || data.Status || "Active",
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          ];
          await appendRow(token, sheetId, "USER_CREATION!A:L", userRow);
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "ADD_USER", id: userId });
        }

        if (path === "/api/users/update" || action === "UPDATE_USER") {
          const targetId = String(data.id || data.userId || "").trim();
          const rows = await readSheet(token, sheetId, "USER_CREATION!A:A");
          let updateRow = -1;
          if (Array.isArray(rows)) {
            for (let i = 1; i < rows.length; i++) {
              if (rows[i] && String(rows[i][0]).trim() === targetId) {
                updateRow = i + 1;
                break;
              }
            }
          }
          if (updateRow !== -1) {
            if (data.role) await updateRange(token, sheetId, `USER_CREATION!F${updateRow}`, [[data.role]]);
            if (data.branch) await updateRange(token, sheetId, `USER_CREATION!E${updateRow}`, [[data.branch]]);
            if (data.status) await updateRange(token, sheetId, `USER_CREATION!K${updateRow}`, [[data.status]]);
            if (data.permissions) await updateRange(token, sheetId, `USER_CREATION!J${updateRow}`, [[data.permissions]]);
            invalidateCache();
            return sendJson({ status: "SUCCESS", action: "UPDATE_USER", id: targetId });
          }
          return sendJson({ status: "ERROR", message: "User not found: " + targetId }, 404);
        }

        // 7. BULK_SYNC
        if (path === "/api/sync" || action === "BULK_SYNC") {
          let count = 0;
          if (Array.isArray(data.feedbacks)) {
            for (const fb of data.feedbacks) {
              const ratingVal = Number(fb.rating !== undefined ? fb.rating : (fb.Rating_10 !== undefined ? fb.Rating_10 : (fb.q7 || 10))) || 10;
              await appendRow(token, sheetId, "FEEDBACK_RESPONSES!A:AB", [
                fb.id || fb.Feedback_ID || ("SVV-FB-" + Date.now()),
                fb.timestamp || fb.Timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                fb.date || fb.Date || new Date().toISOString().split("T")[0],
                fb.branch || fb.Branch || "Cuddalore (Main Branch)",
                fb.source || fb.Source || "Staff",
                fb.status || fb.Status || "NEW",
                fb.customerName || fb.Customer_Name || fb.name || "",
                fb.mobile || fb.Mobile_Number || fb.phone || "",
                fb.city || fb.City || "",
                fb.occupation || fb.Occupation || "",
                fb.staffName || fb.Staff_Name || fb.staff || "",
                ratingVal,
                fb.mood || fb.Mood || (ratingVal >= 9 ? "Appreciation" : (ratingVal <= 6 ? "Concern" : "Feedback")),
                fb.remarks || fb.Customer_Remarks || fb.customerRemarks || fb.feedbackComment || "",
                fb.actionRemark || fb.Staff_Action_Remarks || fb.staffActionRemarks || "",
                fb.q0 || fb.Q0_Frequency || fb.frequency || "",
                fb.q1 || fb.Q1_Heard_About || fb.heardAbout || "",
                fb.q2 || fb.Q2_Store_Experience || fb.storeExperience || "",
                fb.q3 || fb.Q3_Staff_Service || fb.staffService || "",
                fb.q4 || fb.Q4_Occasion || fb.occasion || "",
                fb.occasionDate || fb.Occasion_Date || "",
                fb.q5 || fb.Q5_Chit_Awareness || fb.chitAwareness || "",
                fb.q6 || fb.Q6_Jewellery_Interest || fb.jewelleryInterest || "",
                fb.q7 || fb.Q7_Recommend || fb.recommendationChoice || String(ratingVal),
                fb.overallShoppingExperience || fb.Overall_Shopping_Experience || fb.overallExperience || fb.q8 || (ratingVal >= 9 ? "Excellent" : "Good"),
                fb.invoiceNo || fb.Invoice_No || fb.invoice || "SVV-COUNTER",
                fb.section || fb.Section_Zone || fb.counter || "Showroom Floor",
                new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              ]);
              count++;
            }
          }
          if (Array.isArray(data.diverts)) {
            for (const d of data.diverts) {
              await appendRow(token, sheetId, "CUSTOMER_DIVERTS!A:S", [
                d.id, d.timestamp, d.date, d.branch, d.customerName, d.mobile,
                d.section, d.counter, d.reason, d.product, d.design,
                d.size, d.gramRange, d.purpose, d.employee, d.priority || "MEDIUM",
                d.otherReason || "", d.status || "LOGGED",
                new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
              ]);
              count++;
            }
          }
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "BULK_SYNC", count: count });
        }

        // 8. SAVE_QUESTIONS_CONFIG
        if (path === "/api/questions" || action === "SAVE_QUESTIONS_CONFIG") {
          if (Array.isArray(data.feedbackQuestions) && data.feedbackQuestions.length > 0) {
            const rows = data.feedbackQuestions.map(q => [
              q.q_id || q.Question_ID,
              Number(q.display_order !== undefined ? q.display_order : q.Display_Order) || 0,
              q.target_kpi || q.Target_KPI || "",
              q.q_text_en || q.Question_Text_English || "",
              q.q_text_ta || q.Question_Text_Tamil || "",
              q.q_type || q.Input_Type || "single_choice",
              Array.isArray(q.options_en) ? q.options_en.join("|") : (q.Options_English || ""),
              Array.isArray(q.options_ta) ? q.options_ta.join("|") : (q.Options_Tamil || ""),
              String(q.is_mandatory !== undefined ? q.is_mandatory : q.Is_Mandatory).toUpperCase(),
              String(q.is_active !== undefined ? q.is_active : q.Is_Active).toUpperCase(),
              String(q.show_on_staff !== undefined ? q.show_on_staff : true).toUpperCase(),
              String(q.show_on_qr !== undefined ? q.show_on_qr : true).toUpperCase(),
              q.rationale || q.Business_Rationale || ""
            ]);
            await updateRange(token, sheetId, "FEEDBACK_QUESTIONS!A2:M" + (rows.length + 1), rows);
          }
          if (Array.isArray(data.divertQuestions) && data.divertQuestions.length > 0) {
            const rows = data.divertQuestions.map(d => [
              d.field_id || d.Divert_Field_ID,
              Number(d.display_order !== undefined ? d.display_order : d.Display_Order) || 0,
              d.field_label || d.Field_Label || "",
              d.field_type || d.Field_Type || "single_choice",
              Array.isArray(d.options) ? d.options.join("|") : (d.Configured_Options || ""),
              String(d.is_mandatory !== undefined ? d.is_mandatory : d.Is_Mandatory).toUpperCase(),
              d.workflow_trigger || d.Workflow_Trigger || "",
              d.description || d.Description_Instructions || ""
            ]);
            await updateRange(token, sheetId, "DIVERT_QUESTIONS!A2:H" + (rows.length + 1), rows);
          }
          invalidateCache();
          return sendJson({ status: "SUCCESS", action: "SAVE_QUESTIONS_CONFIG" });
        }
      }

      return sendJson({ error: "Endpoint Not Found: " + path }, 404);
    } catch (err) {
      console.error("Worker Sheets API Error:", err);
      return sendJson({
        status: "ERROR",
        message: err.message || "Cloudflare Worker Gateway execution failed"
      }, 500);
    }
  }
};

// ================= DIRECT GOOGLE SHEETS API V4 ENGINE =================

async function batchReadSheets(token, sheetId, ranges) {
  const query = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join("&");
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error(`Sheets BatchGet Error (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  const valueRanges = json.valueRanges || [];
  return ranges.map((_, i) => valueRanges[i]?.values || []);
}

async function readSheet(token, sheetId, range) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Sheets Read Error (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json.values || [];
}

async function appendRow(token, sheetId, range, row) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] })
  });
  if (!res.ok) throw new Error(`Sheets Append Error (${res.status}): ${await res.text()}`);
  return res.json();
}

async function updateRange(token, sheetId, range, rows) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows })
  });
  if (!res.ok) throw new Error(`Sheets Update Error (${res.status}): ${await res.text()}`);
  return res.json();
}

async function clearRange(token, sheetId, range) {
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:clear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    return res.json().catch(() => ({}));
  } catch (e) {
    console.warn("clearRange warning:", e);
    return {};
  }
}

function matchDates(d1, d2) {
  if (!d1 || !d2) return false;
  const s1 = String(d1).trim().toLowerCase();
  const s2 = String(d2).trim().toLowerCase();
  if (s1 === s2) return true;
  const toIso = (str) => {
    const m1 = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (m1) return `${m1[1]}-${m1[2].padStart(2, '0')}-${m1[3].padStart(2, '0')}`;
    const m2 = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (m2) return `${m2[3]}-${m2[2].padStart(2, '0')}-${m2[1].padStart(2, '0')}`;
    return str;
  };
  return toIso(s1) === toIso(s2);
}

function toObjects(rows) {
  if (!rows || rows.length <= 1) return [];
  const h = rows[0];
  return rows.slice(1).map(r => {
    const o = {};
    h.forEach((key, i) => { o[key] = r[i] !== undefined ? r[i] : ""; });
    return o;
  });
}

// OAuth2 RS256 JWT Token Generator for Google Sheets API v4
async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 120) return cachedToken;

  const header = b64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64Url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));

  const unsigned = `${header}.${claims}`;
  const sig = await signRsa(sa.private_key, unsigned);
  const jwt = `${unsigned}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });

  if (!res.ok) throw new Error(`Google Auth Token Error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return cachedToken;
}

async function signRsa(pemKey, msg) {
  const cleaned = pemKey.replace(/-----BEGIN[ A-Z_-]+-----/g, "").replace(/-----END[ A-Z_-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(msg));
  return b64Url(String.fromCharCode(...new Uint8Array(sig)));
}

function b64Url(s) {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function sendJson(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json;charset=UTF-8", ...CORS_HEADERS, ...extraHeaders }
  });
}
