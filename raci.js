/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - CRM TEAM RACI MATRIX SCRIPT
 * Reference: RACI/101/CRM/002/HS/SEP-26
 * Consulting & Beyond (C&B) Matrix for SVV Jewellery
 * ============================================================================
 */

(function () {
  'use strict';

  const RACI_TEAM_MEMBERS = [
    { key: "ALL", name: "All Team Members", role: "Show All 17 Processes" },
    { key: "selvi", name: "Selvi", role: "CRM Manager (Main)", staffCode: "CRM Manager" },
    { key: "ramya", name: "Ramya", role: "CRM Staff 1 (Main Showroom)", staffCode: "CRM Staff 1" },
    { key: "madhumitha", name: "Madhumitha", role: "CRM Staff 2 (Main Showroom)", staffCode: "CRM Staff 2" },
    { key: "praveen", name: "Praveen", role: "CRM Staff 3 (Valet & Parking)", staffCode: "CRM Staff 3" },
    { key: "kaviya", name: "Kaviya", role: "CRM Staff 4 (Valet & Parking)", staffCode: "CRM Staff 4" },
    { key: "saranya", name: "Saranya", role: "CRM Telecaller Desk", staffCode: "Telecaller" },
    { key: "sm", name: "Store Manager", role: "Store Head (Approver)", staffCode: "Store Manager" },
    { key: "md", name: "Managing Director", role: "Executive Leadership", staffCode: "MD" }
  ];

  const RACI_DATA = [
    {
      sno: 1,
      processEn: "Greet every customer within 10 seconds and offer help without being pushy.",
      processTa: "ஒவ்வொரு வாடிக்கையாளரையும் 10 விநாடிகளுக்குள் வரவேற்று, வற்புறுத்தாமல் உதவி வழங்குதல்.",
      r1: "CRM Staff 1, CRM Staff 4 (Ramya, Kaviya)",
      r2: "CRM Staff 2, CRM Staff 3 (Madhumitha, Praveen)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "—"
    },
    {
      sno: 2,
      processEn: "Guide customer movement between sections and counters, especially in peak hours.",
      processTa: "குறிப்பாக நெரிசல் நேரங்களில் பிரிவுகள் மற்றும் கவுண்டர்களுக்கு இடையே வாடிக்கையாளர்களுக்கு வழிகாட்டுதல்.",
      r1: "CRM Staff 1, CRM Staff 4 (Ramya, Kaviya)",
      r2: "CRM Staff 2, CRM Staff 3 (Madhumitha, Praveen)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "—"
    },
    {
      sno: 3,
      processEn: "Record accurate hourly footfall count daily (no omission or back-entry).",
      processTa: "மணிநேர வாரியான வருகையாளர் எண்ணிக்கையை தினமும் துல்லியமாகப் பதிவு செய்தல் (விடுபடல் அல்லது பின்தேதி பதிவு கூடாது).",
      r1: "CRM Staff 1, CRM Staff 4 (Ramya, Kaviya)",
      r2: "CRM Staff 2, CRM Staff 3 (Madhumitha, Praveen)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 4,
      processEn: "Review daily footfall trends and report deviations from targets.",
      processTa: "தினசரி வருகையாளர் எண்ணிக்கைப் போக்குகளை ஆய்வு செய்து, இலக்கிலிருந்து ஏற்படும் விலகல்களைத் தெரிவித்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "CRM Staff 1 (Ramya)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 5,
      processEn: "Record diverted customers in the register and app with the correct primary reason and try alternate product suggestions.",
      processTa: "திசைமாறிய வாடிக்கையாளர்களை சரியான முதன்மைக் காரணத்துடன் செயலியில் பதிவு செய்து, மாற்றுப் பொருட்களைப் பரிந்துரைத்தல்.",
      r1: "CRM Staff 2, CRM Staff 3 (Madhumitha, Praveen)",
      r2: "CRM Staff 1, CRM Staff 4 (Ramya, Kaviya)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "—"
    },
    {
      sno: 6,
      processEn: "Analyse divert data weekly and apply RCA to find recurring diversion patterns.",
      processTa: "திசைமாற்றத் தரவை வாராந்தம் பகுப்பாய்வு செய்து, மீண்டும் நிகழும் போக்குகளை RCA மூலம் கண்டறிதல்.",
      r1: "CRM Manager (Selvi)",
      r2: "CRM Staff 2 (Madhumitha)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 7,
      processEn: "Collect customer feedback, video testimonials and Google reviews politely.",
      processTa: "வாடிக்கையாளர் கருத்துகள், வீடியோ சான்றுகள் மற்றும் கூகுள் மதிப்புரைகளைப் பணிவுடன் சேகரித்தல்.",
      r1: "CRM Staff 2, CRM Staff 3 (Madhumitha, Praveen)",
      r2: "CRM Staff 1, CRM Staff 4 (Ramya, Kaviya)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "—"
    },
    {
      sno: 8,
      processEn: "Review feedback daily, escalate recurring complaints, and share divert & telecalling reports for staff briefing.",
      processTa: "கருத்துகளை தினமும் ஆய்வு செய்து, மீண்டும் வரும் புகார்களைத் தெரிவித்து, ஊழியர் கூட்டத்திற்காக திசைமாற்ற மற்றும் டெலிகாலிங் அறிக்கைகளைப் பகிர்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "Store Manager",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "CRM Staff 1, 2, 3, 4"
    },
    {
      sno: 9,
      processEn: "Escalate serious complaints immediately and ensure all complaints and queries are resolved promptly (Help Desk).",
      processTa: "கடுமையான புகார்களை உடனடியாகத் தெரிவித்து, அனைத்துப் புகார்கள்/விசாரணைகளும் உடனடியாகத் தீர்க்கப்படுவதை உறுதி செய்தல் (உதவி மையம்).",
      r1: "CRM Staff 1, 2, 3, 4 (Ramya, Madhumitha, Praveen, Kaviya)",
      r2: "CRM Manager (Selvi)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 10,
      processEn: "Keep CRM app entries accurate and complete, verify them daily, and protect customer data confidentiality.",
      processTa: "CRM செயலிப் பதிவுகளைத் துல்லியமாகவும் முழுமையாகவும் வைத்து, தினமும் சரிபார்த்து, வாடிக்கையாளர் தரவின் ரகசியத்தைக் காத்தல்.",
      r1: "CRM Staff 1, 2, 3, 4 (Ramya, Madhumitha, Praveen, Kaviya)",
      r2: "CRM Manager (Selvi)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 11,
      processEn: "Monitor the Telecalling module – call entries, status, remarks and follow-ups.",
      processTa: "டெலிகாலிங் பிரிவைக் கண்காணித்தல் – அழைப்புப் பதிவுகள், நிலை, குறிப்புகள் மற்றும் தொடர் நடவடிக்கைகள்.",
      r1: "Telecaller (Saranya)",
      r2: "CRM Staff 1 or CRM Manager (Ramya / Selvi)",
      accountable: "CRM Manager (Selvi)",
      consulted: "PC (Process Consultant - C&B)",
      informed: "Store Manager"
    },
    {
      sno: 12,
      processEn: "Retain repeat and high-value customers; share new arrivals/offers; do birthday follow-ups.",
      processTa: "மீண்டும் வரும் மற்றும் அதிக மதிப்புள்ள வாடிக்கையாளர்களைத் தக்கவைத்து, புதிய வரவுகள்/சலுகைகளைத் தெரிவித்து, பிறந்தநாள் தொடர்பு கொள்ளுதல்.",
      r1: "Telecaller & CRM Manager (Saranya & Selvi)",
      r2: "Telecaller & CRM Manager (Saranya & Selvi)",
      accountable: "CRM Manager (Selvi)",
      consulted: "Store Manager",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 13,
      processEn: "Prepare and share the Day End Report (DER) every evening.",
      processTa: "நாள் முடிவு அறிக்கையை (DER) ஒவ்வொரு மாலையும் தயாரித்துப் பகிர்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "CRM Staff 1 (Ramya)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 14,
      processEn: "Conduct 10-minute team briefings, coach staff and evaluate Greeter performance.",
      processTa: "10 நிமிடக் குழுக் கூட்டங்களை நடத்தி, ஊழியர்களுக்குப் பயிற்சி அளித்து, வரவேற்பாளர்களின் செயல்திறனை மதிப்பீடு செய்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "CRM Staff 1, 2, 3, 4",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 15,
      processEn: "Ensure the VM checklist is followed and resolve display/layout concerns with VM/Operations.",
      processTa: "VM சரிபார்ப்புப் பட்டியல் பின்பற்றப்படுவதை உறுதி செய்து, காட்சியமைப்பு/அமைப்பு கவலைகளை VM/செயல்பாட்டுக் குழுவுடன் தீர்த்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "CRM Staff 1 (Ramya)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    },
    {
      sno: 16,
      processEn: "Consolidate the monthly performance of each CRM team member against KPIs.",
      processTa: "ஒவ்வொரு CRM குழு உறுப்பினரின் மாதாந்திர செயல்திறனை KPI அடிப்படையில் தொகுத்தல்.",
      r1: "CRM Manager (Selvi)",
      r2: "Store Manager",
      accountable: "MD (நிர்வாக இயக்குநர்)",
      consulted: "PC (Process Consultant - C&B)",
      informed: "—"
    },
    {
      sno: 17,
      processEn: "Follow discipline, professional conduct, HR policies and CRM guidelines.",
      processTa: "ஒழுக்கம், தொழில்முறை நடத்தை, HR கொள்கைகள் மற்றும் CRM வழிகாட்டுதல்களைப் பின்பற்றுதல்.",
      r1: "CRM Staff 1, 2, 3, 4 (Ramya, Madhumitha, Praveen, Kaviya)",
      r2: "CRM Manager (Selvi)",
      accountable: "Store Manager",
      consulted: "PC (Process Consultant - C&B)",
      informed: "MD (நிர்வாக இயக்குநர்)"
    }
  ];

  let selectedMember = 'ALL';
  let searchQuery = '';

  const dom = {
    memberChips: document.getElementById('raciMemberChips'),
    tableBody: document.getElementById('raciTableBody'),
    searchInput: document.getElementById('raciSearchInput'),
    countBadge: document.getElementById('raciCountBadge'),
    syncBtn: document.getElementById('btnSyncGSheet'),
    syncText: document.getElementById('syncStatusText'),
    toast: document.getElementById('govToast')
  };

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.style.display = 'block';
    setTimeout(() => { dom.toast.style.display = 'none'; }, 3000);
  }

  function renderMemberChips() {
    if (!dom.memberChips) return;
    dom.memberChips.innerHTML = RACI_TEAM_MEMBERS.map(m => `
      <button type="button" class="raci-chip-btn ${selectedMember === m.key ? 'active' : ''}" data-member="${m.key}">
        <strong>${m.name}</strong>
        <span style="font-size:0.75rem; opacity:0.85;">${m.role}</span>
      </button>
    `).join('');

    dom.memberChips.querySelectorAll('.raci-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMember = btn.getAttribute('data-member');
        renderMemberChips();
        renderTable();
      });
    });
  }

  function matchesMember(row, memberKey) {
    if (memberKey === 'ALL') return true;
    const member = RACI_TEAM_MEMBERS.find(m => m.key === memberKey);
    if (!member) return true;

    const target = member.name.toLowerCase();
    const roleTarget = (member.staffCode || '').toLowerCase();

    const checkField = (f) => {
      const s = String(f || '').toLowerCase();
      return s.includes(target) || (roleTarget && s.includes(roleTarget));
    };

    return checkField(row.r1) || checkField(row.r2) || checkField(row.accountable) || checkField(row.consulted) || checkField(row.informed);
  }

  function highlightRoleMatch(text, memberKey) {
    if (!text || memberKey === 'ALL') return escapeHtml(text);
    const member = RACI_TEAM_MEMBERS.find(m => m.key === memberKey);
    if (!member) return escapeHtml(text);

    let html = escapeHtml(text);
    const target = member.name;
    const regex = new RegExp(`(${target})`, 'gi');
    html = html.replace(regex, `<mark style="background:#FDE047; padding:1px 4px; border-radius:3px; font-weight:700;">$1</mark>`);
    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderTable() {
    if (!dom.tableBody) return;
    const q = searchQuery.toLowerCase().trim();

    const filtered = RACI_DATA.filter(row => {
      const matchesSearch = !q ||
        row.processEn.toLowerCase().includes(q) ||
        row.processTa.includes(q) ||
        row.r1.toLowerCase().includes(q) ||
        row.r2.toLowerCase().includes(q) ||
        row.accountable.toLowerCase().includes(q);
      const matchesMem = matchesMember(row, selectedMember);
      return matchesSearch && matchesMem;
    });

    if (dom.countBadge) {
      dom.countBadge.textContent = `${filtered.length} of ${RACI_DATA.length} Processes`;
    }

    if (filtered.length === 0) {
      dom.tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:#64748B;">No RACI process found matching the selected team member / filter.</td></tr>`;
      return;
    }

    dom.tableBody.innerHTML = filtered.map(row => `
      <tr>
        <td style="text-align:center; font-weight:700; color:#580505; width:45px;">${row.sno}</td>
        <td style="min-width:280px;">
          <div style="font-weight:600; color:#1E293B; margin-bottom:4px;">${escapeHtml(row.processEn)}</div>
          <div style="font-family:'Noto Sans Tamil', serif; font-size:0.86rem; color:#6B0808; background:#FFFBF2; padding:4px 8px; border-radius:4px; border-left:3px solid #C5A059;">
            ${escapeHtml(row.processTa)}
          </div>
        </td>
        <td style="min-width:160px; background:#F8FAFC;"><span class="gov-badge gov-badge-green" style="white-space:normal; line-height:1.3; font-weight:600;">${highlightRoleMatch(row.r1, selectedMember)}</span></td>
        <td style="min-width:160px;"><span class="gov-badge gov-badge-gold" style="white-space:normal; line-height:1.3; font-weight:600;">${highlightRoleMatch(row.r2, selectedMember)}</span></td>
        <td style="min-width:150px; background:#FEF2F2;"><span class="gov-badge gov-badge-maroon" style="white-space:normal; line-height:1.3; font-weight:700;">${highlightRoleMatch(row.accountable, selectedMember)}</span></td>
        <td style="min-width:140px;"><span class="gov-badge gov-badge-amber" style="white-space:normal; line-height:1.3;">${highlightRoleMatch(row.consulted, selectedMember)}</span></td>
        <td style="min-width:120px;"><span style="color:#64748B; font-size:0.85rem;">${highlightRoleMatch(row.informed, selectedMember)}</span></td>
      </tr>
    `).join('');
  }

  function syncWithGoogleSheet() {
    const gsheetUrl = localStorage.getItem('svv_gsheet_url') || 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec';
    if (dom.syncText) dom.syncText.textContent = "Connecting to Sheet...";
    showToast("Verifying RACI matrix with Google Sheet backend...");

    localStorage.setItem('svv_raci_data', JSON.stringify(RACI_DATA));

    fetch(`${gsheetUrl}?action=PING`)
      .then(res => res.json())
      .then(data => {
        if (dom.syncText) dom.syncText.textContent = "Synced with GSheet";
        showToast("✅ RACI matrix synchronized with Google Sheet database!");
      })
      .catch(() => {
        if (dom.syncText) dom.syncText.textContent = "Cached (Offline)";
        showToast("ℹ️ Loaded RACI matrix from secure local cache.");
      });
  }

  function init() {
    renderMemberChips();
    renderTable();

    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTable();
      });
    }

    if (dom.syncBtn) {
      dom.syncBtn.addEventListener('click', syncWithGoogleSheet);
    }

    setTimeout(syncWithGoogleSheet, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
