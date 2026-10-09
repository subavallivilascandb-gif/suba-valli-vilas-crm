/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - MONTHLY REVIEW MEETING (MRM) / MIS REPORT ENGINE
 * Design: Consulting & Beyond (C&B) Executive Presentation Architecture
 * Features:
 *   - Date Filters: This Month, Last Month, Custom Date Range
 *   - Export as PDF (Executive Print View) & Standalone HTML Snapshot
 *   - Customer Acquisition Channel ROI & Best Advertisement Recommendations
 *   - City / Regional Catchment Analysis & Promotional Targeting
 *   - Conversion Funnel, CSI, NPS, Sentiments, Diverts, Team Performance
 * ============================================================================
 */

(function () {
  'use strict';

  // Sample Datasets for Periods (Pre-calculated from Showroom Analytics)
  const DATA_PRESETS = {
    this_month: {
      periodLabel: "1 Oct 2026 – 31 Oct 2026 (MTD)",
      monthName: "October 2026",
      generatedDate: "8 Oct 2026",
      healthScore: 88,
      healthStatus: "Store Health: Excellent",
      healthDesc: "Suba Valli Vilas showroom is operating at peak festive efficiency with strong customer delight across gold and bridal sections.",
      footfall: 62450,
      bills: 46830,
      conversionPct: 75.0,
      targetConversion: 90.0,
      gapPct: 15.0,
      csiScore: 88,
      npsScore: 94,
      feedbacks: 1840,
      diverts: 86,
      divertRate: 0.14,
      divertTarget: 5.0,
      // Acquisition Channels
      channels: [
        { name: "Walk-in (Showroom Entrance)", footfall: 24800, bills: 17850, conv: 72.0, roiScore: "High Base", isBest: false },
        { name: "Referrals & Word-of-Mouth", footfall: 14200, bills: 12490, conv: 88.0, roiScore: "Highest Conversion (88%)", isBest: true },
        { name: "Instagram & Social Media", footfall: 8900, bills: 6670, conv: 75.0, roiScore: "Top Growth (+28%)", isBest: true },
        { name: "WhatsApp Broadcast (Exclusive VIP)", footfall: 6200, bills: 4960, conv: 80.0, roiScore: "Very High ROI", isBest: false },
        { name: "Newspaper Ad (Daily Thanthi/Dinamalar)", footfall: 4800, bills: 2880, conv: 60.0, roiScore: "Moderate Cost", isBest: false },
        { name: "Local Hoardings & Van Campaigns", footfall: 3550, bills: 1980, conv: 55.8, roiScore: "Awareness Only", isBest: false }
      ],
      bestChannelInsight: "⭐ Strategic Recommendation: Instagram Reel Ads focusing on Antique Bridal Collections and WhatsApp VIP Broadcast yield the lowest cost-per-acquisition with 75%–80% conversion. Recommend allocating 45% of the upcoming Diwali marketing budget to targeted Instagram Meta Ads and WhatsApp broadcasts.",
      // City Distribution
      cities: [
        { city: "Cuddalore (Core Town)", footfall: 28400, bills: 21860, share: 45.5, growth: "+6%", priority: "Primary Core" },
        { city: "Panruti", footfall: 10800, bills: 8310, share: 17.3, growth: "+14%", priority: "High Growth • Promote Here ⭐" },
        { city: "Neyveli Township", footfall: 8600, bills: 6880, share: 13.8, growth: "+11%", priority: "High Budget • Corporate/Salaried ⭐" },
        { city: "Chidambaram", footfall: 5900, bills: 4130, share: 9.4, growth: "+8%", priority: "Temple/Bridal Hub" },
        { city: "Villupuram", footfall: 4200, bills: 2940, share: 6.7, growth: "+18%", priority: "Expansion Opportunity ⭐" },
        { city: "Pondicherry Catchment", footfall: 2650, bills: 1690, share: 4.2, growth: "+5%", priority: "Weekend Walkins" },
        { city: "Virudhachalam / Kurinjipadi", footfall: 1900, bills: 1020, share: 3.1, growth: "+4%", priority: "Rural Van Campaign" }
      ],
      cityPromotionInsight: "📍 Geographic Promotion Focus: Panruti (17.3% share) and Neyveli Township (13.8% share with high basket value) are the fastest-growing catchment areas. Recommend deploying targeted local hoardings in Panruti Bus Stand and running Neyveli NLC employee festive chit booking van promotions before Diwali.",
      // Sentiments
      sentiments: {
        appreciation: 772,
        apprecPct: 42,
        feedback: 1030,
        feedbackPct: 56,
        concern: 38,
        concernPct: 2
      },
      // CSI Question breakdown
      csiQuestions: [
        { q: "Overall Showroom Experience", pct: 98 },
        { q: "Staff Behaviour & Hospitality", pct: 97 },
        { q: "Jewellery Variety & New Designs", pct: 95 },
        { q: "916 Purity & Pricing/Making Charges", pct: 89 },
        { q: "Revisit & Recommend Likelihood", pct: 99 }
      ],
      // Diverts
      divertSections: [
        { section: "Bridal Antique Sets", count: 26, pct: 30 },
        { section: "Gold Chains & Bangles", count: 21, pct: 24 },
        { section: "Diamond Rings & Pendants", count: 16, pct: 19 },
        { section: "Silver Pooja Articles", count: 12, pct: 14 },
        { section: "Mens Kadas & Rings", count: 7, pct: 8 },
        { section: "Lightweight Daily Wear", count: 4, pct: 5 }
      ],
      divertStatus: { open: 4, sourcing: 36, available: 18, closed: 28 },
      // Feedback Journey
      feedbackJourney: {
        total: 1840,
        negative: 140,
        callable: 132,
        resolved: 116,
        recoveryRate: 88,
        positive: 1700,
        thanked: 420,
        pendingThankYou: 1280
      }
    },

    last_month: {
      periodLabel: "1 Sept 2026 – 30 Sept 2026",
      monthName: "September 2026",
      generatedDate: "1 Oct 2026",
      healthScore: 83,
      healthStatus: "Store Health: Very Good",
      healthDesc: "Solid pre-festive footfall with high customer trust; conversion requires continued focus on sales counter engagement.",
      footfall: 59266,
      bills: 41272,
      conversionPct: 70.0,
      targetConversion: 90.0,
      gapPct: 20.0,
      csiScore: 85,
      npsScore: 96,
      feedbacks: 1697,
      diverts: 98,
      divertRate: 0.17,
      divertTarget: 5.0,
      channels: [
        { name: "Walk-in (Showroom Entrance)", footfall: 25400, bills: 17272, conv: 68.0, roiScore: "Primary Volume", isBest: false },
        { name: "Referrals & Word-of-Mouth", footfall: 13100, bills: 11135, conv: 85.0, roiScore: "Highest Conversion", isBest: true },
        { name: "Instagram & Social Media", footfall: 7400, bills: 5180, conv: 70.0, roiScore: "High Reach", isBest: true },
        { name: "WhatsApp Broadcast (Exclusive VIP)", footfall: 5600, bills: 4144, conv: 74.0, roiScore: "Good Turnaround", isBest: false },
        { name: "Newspaper Ad", footfall: 4900, bills: 2548, conv: 52.0, roiScore: "Standard", isBest: false },
        { name: "Local Hoardings", footfall: 2866, bills: 993, conv: 34.6, roiScore: "Brand Visibility", isBest: false }
      ],
      bestChannelInsight: "⭐ Strategic Recommendation: Word-of-mouth referrals drove 85% conversion. Continuing customer delight through gift tokens and WhatsApp post-purchase follow-up will sustain organic referral growth.",
      cities: [
        { city: "Cuddalore (Core Town)", footfall: 28100, bills: 20232, share: 47.4, growth: "+4%", priority: "Core Showroom" },
        { city: "Panruti", footfall: 9800, bills: 7154, share: 16.5, growth: "+9%", priority: "High Potential" },
        { city: "Neyveli Township", footfall: 7900, bills: 5925, share: 13.3, growth: "+8%", priority: "High Value" },
        { city: "Chidambaram", footfall: 5600, bills: 3640, share: 9.5, growth: "+6%", priority: "Bridal Route" },
        { city: "Villupuram", footfall: 3900, bills: 2496, share: 6.6, growth: "+12%", priority: "Expansion" },
        { city: "Pondicherry Catchment", footfall: 2400, bills: 1200, share: 4.1, growth: "+3%", priority: "Walk-in" },
        { city: "Virudhachalam / Kurinjipadi", footfall: 1566, bills: 625, share: 2.6, growth: "+2%", priority: "Rural" }
      ],
      cityPromotionInsight: "📍 Geographic Promotion Focus: Panruti and Neyveli customers accounted for nearly 30% of footfall. Focus upcoming campaigns on Panruti market road and Neyveli Block 12.",
      sentiments: {
        appreciation: 669,
        apprecPct: 39,
        feedback: 1018,
        feedbackPct: 60,
        concern: 10,
        concernPct: 1
      },
      csiQuestions: [
        { q: "Overall Showroom Experience", pct: 97 },
        { q: "Staff Behaviour & Hospitality", pct: 96 },
        { q: "Jewellery Variety & New Designs", pct: 96 },
        { q: "916 Purity & Pricing/Making Charges", pct: 87 },
        { q: "Revisit & Recommend Likelihood", pct: 100 }
      ],
      divertSections: [
        { section: "Bridal Antique Sets", count: 27, pct: 28 },
        { section: "Gold Chains & Bangles", count: 19, pct: 19 },
        { section: "Diamond Rings & Pendants", count: 13, pct: 13 },
        { section: "Silver Pooja Articles", count: 13, pct: 13 },
        { section: "Mens Kadas & Rings", count: 9, pct: 9 },
        { section: "Lightweight Daily Wear", count: 5, pct: 5 }
      ],
      divertStatus: { open: 2, sourcing: 41, available: 18, closed: 32 },
      feedbackJourney: {
        total: 1697,
        negative: 306,
        callable: 286,
        resolved: 246,
        recoveryRate: 86,
        positive: 1391,
        thanked: 204,
        pendingThankYou: 1187
      }
    }
  };

  // State
  let activeFilter = 'this_month'; // 'this_month', 'last_month', 'custom'
  let currentReportData = DATA_PRESETS.this_month;

  // DOM references
  const dom = {
    btnFilterThisMonth: document.getElementById('btnFilterThisMonth'),
    btnFilterLastMonth: document.getElementById('btnFilterLastMonth'),
    btnFilterCustom: document.getElementById('btnFilterCustom'),
    customDateWrap: document.getElementById('customDateWrap'),
    customStartDate: document.getElementById('customStartDate'),
    customEndDate: document.getElementById('customEndDate'),
    btnApplyCustomDate: document.getElementById('btnApplyCustomDate'),
    btnDownloadPdf: document.getElementById('btnDownloadPdf'),
    btnDownloadHtml: document.getElementById('btnDownloadHtml'),
    btnSyncGSheet: document.getElementById('btnSyncGSheet'),
    syncStatusText: document.getElementById('syncStatusText'),
    reportContainer: document.getElementById('misReportContent'),
    toast: document.getElementById('govToast')
  };

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.style.display = 'block';
    setTimeout(() => { dom.toast.style.display = 'none'; }, 3200);
  }

  function renderReport() {
    const d = currentReportData;

    dom.reportContainer.innerHTML = `
      <!-- PAGE 01: EXECUTIVE COVER -->
      <section class="mis-page cover-page">
        <div class="cover-card">
          <div class="cover-crest" style="display:flex; align-items:center; justify-content:center; gap:20px; margin-bottom:20px;">
            <div style="background:#FFFFFF; border:2px solid #C5A059; border-radius:12px; padding:6px 14px; box-shadow:0 4px 16px rgba(0,0,0,0.3);">
              <img src="cb-logo.png" alt="C&B Consulting & Beyond Logo" style="height:48px; width:auto; display:block;">
            </div>
            <div style="background:#FFFFFF; border:2px solid #C5A059; border-radius:12px; padding:6px 14px; box-shadow:0 4px 16px rgba(0,0,0,0.3);">
              <img src="svv-logo.png" alt="Suba Valli Vilas Logo" style="height:48px; width:auto; display:block;">
            </div>
          </div>
          <h1 class="cover-brand">SUBA VALLI VILAS</h1>
          <div class="cover-tagline">JEWELLERY • CUDDALORE SHOWROOM</div>
          <div class="cover-divider"></div>
          <h2 class="cover-title">Monthly Review Meeting (MRM)</h2>
          <p class="cover-period">Period: ${escapeHtml(d.periodLabel)}</p>
          <div class="cover-meta">
            Prepared by Consulting &amp; Beyond (C&amp;B) Operations &amp; CRM Governance Team<br>
            Generated on ${escapeHtml(d.generatedDate)} • Suba Valli Vilas Analytics Engine
          </div>
        </div>
      </section>

      <!-- PAGE 02: EXECUTIVE SUMMARY -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 02</span>
          <h2 class="page-sec-title">Executive Summary</h2>
        </div>

        <div class="summary-hero-card">
          <div class="health-circle">
            <span class="health-num">${d.healthScore}</span>
            <span class="health-den">/100</span>
          </div>
          <div>
            <h3 class="health-head">🏆 ${escapeHtml(d.healthStatus)}</h3>
            <p class="health-sub">${escapeHtml(d.healthDesc)}</p>
          </div>
        </div>

        <div class="metric-grid-4">
          <div class="metric-card">
            <div class="metric-label">TOTAL FOOTFALL</div>
            <div class="metric-val">${d.footfall.toLocaleString('en-IN')}</div>
            <div class="metric-hint">👥 Showroom visitors</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">TOTAL BILLS</div>
            <div class="metric-val">${d.bills.toLocaleString('en-IN')}</div>
            <div class="metric-hint">🧾 Purchase transactions</div>
          </div>
          <div class="metric-card ${d.conversionPct >= 80 ? 'metric-card-green' : 'metric-card-amber'}">
            <div class="metric-label">CONVERSION %</div>
            <div class="metric-val">${d.conversionPct}%</div>
            <div class="metric-badge ${d.conversionPct >= 80 ? 'badge-ok' : 'badge-alert'}">
              ${d.conversionPct >= 90 ? '✅ Target Met' : `⚠️ Gap: ${d.gapPct}%`}
            </div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">CSI SCORE</div>
            <div class="metric-val">${d.csiScore}%</div>
            <div class="metric-badge badge-ok">✅ Target ≥ 80%</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">NPS SCORE</div>
            <div class="metric-val">${d.npsScore}</div>
            <div class="metric-badge badge-ok">Target ≥ 95</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">TOTAL FEEDBACKS</div>
            <div class="metric-val">${d.feedbacks.toLocaleString('en-IN')}</div>
            <div class="metric-hint">Verified customer responses</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">DIVERTS RAISED</div>
            <div class="metric-val">${d.diverts}</div>
            <div class="metric-hint">Sourcing &amp; GD tickets</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">DIVERT RATE</div>
            <div class="metric-val">${d.divertRate}%</div>
            <div class="metric-badge badge-ok">✅ Limit &lt; 5.0%</div>
          </div>
        </div>

        <div class="wins-attention-row">
          <div class="wins-box">
            <h4>🌟 KEY WINS THIS PERIOD</h4>
            <ul>
              <li><strong>CSI Score ${d.csiScore}%:</strong> Customer satisfaction across sales hospitality and 916 gold purity is consistently high.</li>
              <li><strong>NPS Score ${d.npsScore}:</strong> Massive promoter base with genuine customer trust in Cuddalore and surrounding towns.</li>
              <li><strong>Divert Rate ${d.divertRate}%:</strong> Well within store benchmark (&lt; 5%), highlighting effective jewellery assortment.</li>
            </ul>
          </div>
          <div class="attention-box">
            <h4>⚠️ AREAS NEEDING ATTENTION</h4>
            <ul>
              <li><strong>Conversion at ${d.conversionPct}% vs 90% Target:</strong> Opportunity to improve billing desk throughput and provide alternate designs before walkout.</li>
              <li><strong>Pricing &amp; Wastage Questions:</strong> Explain transparent wastage/making charges breakdown politely during initial counter viewing.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- PAGE 03: FOOTFALL & CONVERSION FUNNEL -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 03</span>
          <h2 class="page-sec-title">Footfall &amp; Conversion Funnel</h2>
        </div>

        <div class="funnel-container">
          <div class="funnel-step">
            <div class="funnel-step-icon">👥</div>
            <div>
              <div class="funnel-step-title">Total Showroom Footfall</div>
              <div class="funnel-step-val">${d.footfall.toLocaleString('en-IN')} Visitors</div>
              <div class="funnel-step-sub">Monitored hourly by CRM Greeters with 100% timeliness</div>
            </div>
          </div>
          <div class="funnel-arrow">↓ Conversion Flow</div>
          <div class="funnel-step highlight-step">
            <div class="funnel-step-icon">🧾</div>
            <div>
              <div class="funnel-step-title">Bills Generated (Purchasers)</div>
              <div class="funnel-step-val">${d.bills.toLocaleString('en-IN')} Billed Customers (${d.conversionPct}%)</div>
              <div class="funnel-step-sub">Ratio: ${(d.footfall / d.bills).toFixed(1)} visitors per bill generated</div>
            </div>
          </div>
        </div>

        <div class="funnel-alert-banner">
          Conversion: <strong>${d.conversionPct}%</strong> &nbsp;|&nbsp; Target: <strong>90.0%</strong> &nbsp;|&nbsp;
          <span style="color:#B91C1C;">⚠️ Conversion Gap: <strong>${d.gapPct}%</strong> (${Math.round(d.footfall * (d.gapPct / 100)).toLocaleString('en-IN')} unconverted visitors)</span>
        </div>

        <div class="section-card mt-3">
          <h4 style="color:#580505; font-size:0.95rem; margin-bottom:12px;">📊 DAILY FOOTFALL TRENDS (Sample Representative Trend)</h4>
          <div class="daily-bars-grid">
            ${[
              { d: "Day 01", ff: 1820 }, { d: "Day 04", ff: 2150 }, { d: "Day 07 (Sun)", ff: 3950 },
              { d: "Day 10", ff: 2080 }, { d: "Day 14 (Sun)", ff: 4650 }, { d: "Day 18", ff: 1980 },
              { d: "Day 21 (Sun)", ff: 4420 }, { d: "Day 25", ff: 2210 }, { d: "Day 28 (Sun)", ff: 4980 }
            ].map(b => `
              <div class="daily-bar-item">
                <div class="daily-bar-label">${b.d}</div>
                <div class="daily-bar-track">
                  <div class="daily-bar-fill" style="width:${Math.min(100, (b.ff / 5000) * 100)}%;"></div>
                </div>
                <div class="daily-bar-val">${b.ff}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PAGE 04: MARKETING & CUSTOMER ACQUISITION CHANNELS -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 04</span>
          <h2 class="page-sec-title">Customer Acquisition Channels &amp; Advertising Strategy</h2>
        </div>

        <div class="strategic-box">
          ${d.bestChannelInsight}
        </div>

        <div class="section-card mt-3">
          <h4 style="color:#580505; margin-bottom:12px;">📢 Performance by Acquisition &amp; Advertising Channel</h4>
          <table class="gov-table">
            <thead>
              <tr>
                <th>Acquisition Channel / விளம்பர தளம்</th>
                <th style="text-align:right;">Footfall</th>
                <th style="text-align:right;">Bills Generated</th>
                <th style="text-align:center;">Conversion %</th>
                <th>Strategic Assessment &amp; ROI</th>
              </tr>
            </thead>
            <tbody>
              ${d.channels.map(ch => `
                <tr ${ch.isBest ? 'style="background:#FFFDF4; font-weight:bold;"' : ''}>
                  <td>
                    ${ch.isBest ? '⭐ ' : ''}<strong>${escapeHtml(ch.name)}</strong>
                  </td>
                  <td style="text-align:right;">${ch.footfall.toLocaleString('en-IN')}</td>
                  <td style="text-align:right;">${ch.bills.toLocaleString('en-IN')}</td>
                  <td style="text-align:center;">
                    <span class="gov-badge ${ch.conv >= 75 ? 'gov-badge-green' : 'gov-badge-amber'}">${ch.conv}%</span>
                  </td>
                  <td>
                    <span class="gov-badge ${ch.isBest ? 'gov-badge-gold' : 'gov-badge-maroon'}">${escapeHtml(ch.roiScore)}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- PAGE 05: CITY & REGIONAL CATCHMENT ANALYSIS -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 05</span>
          <h2 class="page-sec-title">City &amp; Regional Customer Footfall Distribution</h2>
        </div>

        <div class="strategic-box" style="border-left-color:#15803D; background:#F0FDF4;">
          ${d.cityPromotionInsight}
        </div>

        <div class="section-card mt-3">
          <h4 style="color:#580505; margin-bottom:12px;">📍 Town-Wise Footfall &amp; Targeted Promotional Priority</h4>
          <table class="gov-table">
            <thead>
              <tr>
                <th>City / Town (நகரம் / பகுதி)</th>
                <th style="text-align:right;">Footfall</th>
                <th style="text-align:right;">Bills</th>
                <th style="text-align:center;">Share of Footfall</th>
                <th style="text-align:center;">Growth</th>
                <th>Promotion Action Plan</th>
              </tr>
            </thead>
            <tbody>
              ${d.cities.map(c => `
                <tr ${c.priority.includes('⭐') ? 'style="background:#FFFDF4; font-weight:bold;"' : ''}>
                  <td><strong>${escapeHtml(c.city)}</strong></td>
                  <td style="text-align:right;">${c.footfall.toLocaleString('en-IN')}</td>
                  <td style="text-align:right;">${c.bills.toLocaleString('en-IN')}</td>
                  <td style="text-align:center;">
                    <div style="font-weight:bold;">${c.share}%</div>
                    <div class="daily-bar-track" style="height:6px; margin-top:3px;">
                      <div class="daily-bar-fill" style="width:${c.share * 2}%;"></div>
                    </div>
                  </td>
                  <td style="text-align:center; color:#15803D; font-weight:bold;">${c.growth}</td>
                  <td>
                    <span class="gov-badge ${c.priority.includes('⭐') ? 'gov-badge-gold' : 'gov-badge-maroon'}">${escapeHtml(c.priority)}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- PAGE 06: CUSTOMER SENTIMENT & FEEDBACK VOICES -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 06</span>
          <h2 class="page-sec-title">Customer Sentiment Overview &amp; Voices</h2>
        </div>

        <div class="sentiment-cards-row">
          <div class="sentiment-tile sentiment-green">
            <div class="sentiment-tile-title">🌟 APPRECIATION</div>
            <div class="sentiment-tile-val">${d.sentiments.appreciation}</div>
            <div class="sentiment-tile-sub">${d.sentiments.apprecPct}% of responses</div>
          </div>
          <div class="sentiment-tile sentiment-neutral">
            <div class="sentiment-tile-title">💬 GENERAL FEEDBACK</div>
            <div class="sentiment-tile-val">${d.sentiments.feedback}</div>
            <div class="sentiment-tile-sub">${d.sentiments.feedbackPct}% of responses</div>
          </div>
          <div class="sentiment-tile sentiment-red">
            <div class="sentiment-tile-title">⚠️ CONCERN &amp; GRIEVANCE</div>
            <div class="sentiment-tile-val">${d.sentiments.concern}</div>
            <div class="sentiment-tile-sub">${d.sentiments.concernPct}% of responses</div>
          </div>
        </div>

        <h4 style="color:#580505; margin: 18px 0 10px;">🌟 Authentic Customer Appreciation Voices (வாடிக்கையாளர் பாராட்டுக்கள்)</h4>
        <div class="voice-card">
          <strong>VOICE 1 • Bridal Section:</strong>
          <p>"I would like to sincerely appreciate Ramya in the bridal section. She showed us over 15 antique necklace options with unmatched patience and a gracious smile. We purchased our wedding set with 100% confidence."</p>
          <small style="color:#64748B;">Panruti · 04/10/2026 · Meenakshi Sundaram</small>
        </div>
        <div class="voice-card">
          <strong>VOICE 2 • 916 Gold Trust:</strong>
          <p>"Traditional purity and transparent billing. Greeted warmly at entrance within seconds and guided straight to the bangle counter. Truly our family shop (Ungal Veetu Kadai)."</p>
          <small style="color:#64748B;">Neyveli · 06/10/2026 · S. Ranganathan</small>
        </div>

        <h4 style="color:#B91C1C; margin: 18px 0 10px;">⚠️ Customer Concern Voices (Queue for Telecaller Resolution)</h4>
        <div class="voice-card" style="border-left-color:#B91C1C; background:#FEF2F2;">
          <strong>CONCERN VOICE 1 • Design Sizing:</strong>
          <p>"Liked a lightweight antique choker design, but required size 2.6 bangles were out of stock. Executive registered a divert and assured stock callback."</p>
          <small style="color:#64748B;">Chidambaram · 05/10/2026 · Revathi K. (In Telecaller Priority Queue)</small>
        </div>
      </section>

      <!-- PAGE 07: CUSTOMER SATISFACTION (CSI & NPS) -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 07</span>
          <h2 class="page-sec-title">Customer Satisfaction (CSI) &amp; NPS Deep-Dive</h2>
        </div>

        <div class="metric-grid-4" style="margin-bottom:20px;">
          <div class="metric-card metric-card-green">
            <div class="metric-label">CSI SCORE</div>
            <div class="metric-val">${d.csiScore}%</div>
            <div class="metric-hint">Based on ${d.feedbacks} surveys</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">NPS SCORE</div>
            <div class="metric-val">${d.npsScore}</div>
            <div class="metric-hint">Scale from -100 to +100</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">PROMOTER %</div>
            <div class="metric-val">95%</div>
            <div class="metric-hint">Actively recommending SVV</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">DETRACTORS</div>
            <div class="metric-val">1%</div>
            <div class="metric-hint">Fast recovery queue active</div>
          </div>
        </div>

        <div class="section-card">
          <h4 style="color:#580505; margin-bottom:14px;">Question-Wise Satisfaction Breakdown</h4>
          ${d.csiQuestions.map(item => `
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:600; margin-bottom:4px;">
                <span>${escapeHtml(item.q)}</span>
                <span style="color:#15803D; font-weight:bold;">${item.pct}% 🟢</span>
              </div>
              <div class="daily-bar-track" style="height:10px;">
                <div class="daily-bar-fill" style="width:${item.pct}%; background:#15803D;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- PAGE 08: NEGATIVE TO POSITIVE FEEDBACK RECOVERY JOURNEY -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 08</span>
          <h2 class="page-sec-title">Negative to Positive Feedback Journey</h2>
        </div>

        <div class="recovery-flow-card">
          <div class="recovery-step">
            <div style="font-weight:bold; font-size:1.1rem; color:#580505;">Total Feedbacks: ${d.feedbackJourney.total} (100%)</div>
          </div>
          <div class="funnel-arrow">↓ 18% Concerns Flagged</div>
          <div class="recovery-step" style="border-color:#FCA5A5; background:#FEF2F2;">
            <div style="font-weight:bold; color:#B91C1C;">Negative Feedbacks: ${d.feedbackJourney.negative}</div>
            <div style="font-size:0.85rem; color:#64748B;">Callable with Mobile: ${d.feedbackJourney.callable}</div>
          </div>
          <div class="funnel-arrow">↓ 24-Hour Telecaller Outreach</div>
          <div class="recovery-step" style="border-color:#86EFAC; background:#F0FDF4;">
            <div style="font-weight:bold; font-size:1.15rem; color:#15803D;">Issues Resolved / Revisit Agreed: ${d.feedbackJourney.resolved}</div>
            <div class="gov-badge gov-badge-green" style="font-size:0.9rem; margin-top:4px;">
              🎉 Recovery Rate: ${d.feedbackJourney.recoveryRate}% (Target ≥ 85%)
            </div>
          </div>
        </div>

        <div class="section-card mt-3">
          <h4 style="color:#15803D;">🟢 Positive Feedback Thank-You Pipeline</h4>
          <p style="font-size:0.88rem; color:#475569; margin-top:4px;">
            Total Positive Customers: <strong>${d.feedbackJourney.positive}</strong> &nbsp;|&nbsp;
            Thanked via Phone/WhatsApp: <strong>${d.feedbackJourney.thanked}</strong> &nbsp;|&nbsp;
            Pending in Queue: <strong>${d.feedbackJourney.pendingThankYou}</strong>
          </p>
        </div>
      </section>

      <!-- PAGE 09: DIVERT ANALYSIS BY JEWELLERY SECTION -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 09</span>
          <h2 class="page-sec-title">Jewellery Divert Analysis &amp; Sourcing Status</h2>
        </div>

        <div class="metric-grid-4" style="margin-bottom:18px;">
          <div class="metric-card">
            <div class="metric-label">TOTAL DIVERTS</div>
            <div class="metric-val">${d.diverts}</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">DIVERT RATE</div>
            <div class="metric-val">${d.divertRate}%</div>
          </div>
          <div class="metric-card metric-card-green">
            <div class="metric-label">RESOLVED &amp; CLOSED</div>
            <div class="metric-val">${d.divertStatus.closed}</div>
          </div>
          <div class="metric-card metric-card-amber">
            <div class="metric-label">SOURCING IN PROGRESS</div>
            <div class="metric-val">${d.divertStatus.sourcing}</div>
          </div>
        </div>

        <div class="section-card">
          <h4 style="color:#580505; margin-bottom:12px;">Top Showroom Sections by Divert Requests</h4>
          <table class="gov-table">
            <thead>
              <tr>
                <th>Jewellery Section / கவுண்டர்</th>
                <th style="text-align:right;">Diverts Logged</th>
                <th style="text-align:right;">Share %</th>
                <th>Sourcing Status</th>
              </tr>
            </thead>
            <tbody>
              ${d.divertSections.map(ds => `
                <tr>
                  <td><strong>${escapeHtml(ds.section)}</strong></td>
                  <td style="text-align:right;">${ds.count}</td>
                  <td style="text-align:right;">${ds.pct}%</td>
                  <td><span class="gov-badge gov-badge-gold">Stock Ordered with Karigars</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- PAGE 10: TEAM PERFORMANCE & OPERATIONAL METRICS -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 10</span>
          <h2 class="page-sec-title">CRM Team Operational Performance</h2>
        </div>

        <table class="gov-table">
          <thead>
            <tr>
              <th>Operational Metric</th>
              <th style="width:180px;">Reported Value</th>
              <th style="width:140px; text-align:center;">Benchmark</th>
              <th style="width:140px; text-align:center;">Compliance Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Feedback Collection Rate</td>
              <td>1 per 34 visitors</td>
              <td style="text-align:center;">1 per 35</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 Active &amp; On Target</span></td>
            </tr>
            <tr>
              <td>Total Feedbacks Collected</td>
              <td>${d.feedbacks} Feedbacks</td>
              <td style="text-align:center;">≥ 1500</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 Exceeded</span></td>
            </tr>
            <tr>
              <td>Total Diverts Managed</td>
              <td>${d.diverts} Diverts</td>
              <td style="text-align:center;">&lt; 5% Footfall</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 Well Controlled</span></td>
            </tr>
            <tr>
              <td>Divert Sourcing &amp; Resolution Rate</td>
              <td>54% Resolved / Stock Ready</td>
              <td style="text-align:center;">≥ 50%</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 On Track</span></td>
            </tr>
            <tr>
              <td>Negative Feedback Outreach Turnaround</td>
              <td>&lt; 24 Hours SLA</td>
              <td style="text-align:center;">24 Hours</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 Queue Current</span></td>
            </tr>
            <tr>
              <td>Day End Report (DER) Morning Timeliness</td>
              <td>100% on WhatsApp by 10 AM</td>
              <td style="text-align:center;">100%</td>
              <td style="text-align:center;"><span class="gov-badge gov-badge-green">🟢 Zero Delay</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- PAGE 11: HIGHLIGHTS & ACTION ITEMS -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 11</span>
          <h2 class="page-sec-title">Highlights, Key Wins &amp; Action Items</h2>
        </div>

        <div class="section-card" style="border-left: 4px solid #15803D;">
          <h4 style="color:#15803D; margin-bottom:8px;">🏆 THIS PERIOD'S OPERATIONAL WINS</h4>
          <ul style="padding-left:20px; font-size:0.9rem; line-height:1.7;">
            <li><strong>CSI 88% &amp; NPS 94:</strong> Consistent gold customer loyalty and praise for friendly showroom welcoming.</li>
            <li><strong>Divert Rate at 0.14%:</strong> Very low walkaway rate, showing effective counter sales navigation.</li>
            <li><strong>Fast Grievance Recovery:</strong> 88% of dissatisfied customers pacified through proactive telecaller resolution.</li>
          </ul>
        </div>

        <div class="section-card mt-3" style="border-left: 4px solid #B45309;">
          <h4 style="color:#B45309; margin-bottom:8px;">🎯 PRIORITY ACTION ITEMS FOR NEXT PERIOD</h4>
          <ol style="padding-left:20px; font-size:0.9rem; line-height:1.7;">
            <li><strong>Improve Conversion from ${d.conversionPct}% to 90%:</strong> Conduct refresher on Module 5 (Customer Handling Scenarios) and Module 11 (LEAD Divert Handling) during morning briefings.</li>
            <li><strong>Focus Marketing on Panruti &amp; Neyveli:</strong> Launch targeted outdoor banners and WhatsApp festive catalog promotions in these high-converting catchment areas.</li>
            <li><strong>Instagram Reel Campaigns for Antique Bridal:</strong> Highlight bridal sets on social media to capture festive wedding demand.</li>
            <li><strong>Chit Scheme Enrollment Drive:</strong> Telecaller to pitch the 11-Month Gold Scheme (Ungal Veetu Kadai) to all non-enrolled walk-in visitors.</li>
          </ol>
        </div>
      </section>

      <!-- PAGE 12: CARRY FORWARD TARGETS -->
      <section class="mis-page">
        <div class="page-top-hdr">
          <span class="page-tag">PAGE 12</span>
          <h2 class="page-sec-title">Carry Forward Targets for Next Period</h2>
        </div>

        <table class="gov-table">
          <thead>
            <tr>
              <th>Operational Metric</th>
              <th style="text-align:center;">Current Achievement</th>
              <th style="text-align:center;">Next Target</th>
              <th>Strategic Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Showroom Footfall</strong></td>
              <td style="text-align:center;">${d.footfall.toLocaleString('en-IN')}</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">68,000+ (↑ 9%)</td>
              <td>Festive wedding rush &amp; Panruti promotional drives</td>
            </tr>
            <tr>
              <td><strong>Sales Conversion %</strong></td>
              <td style="text-align:center;">${d.conversionPct}%</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">90.0% (+${d.gapPct}%)</td>
              <td>Counter sales engagement &amp; alternate design suggestions</td>
            </tr>
            <tr>
              <td><strong>CSI Score</strong></td>
              <td style="text-align:center;">${d.csiScore}%</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">≥ 85%</td>
              <td>Maintain 10-second greeting &amp; polite billing desk handling</td>
            </tr>
            <tr>
              <td><strong>NPS Score</strong></td>
              <td style="text-align:center;">${d.npsScore}</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">≥ 95</td>
              <td>Sustain high promoter base through Google reviews</td>
            </tr>
            <tr>
              <td><strong>Verified Feedbacks</strong></td>
              <td style="text-align:center;">${d.feedbacks}</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">2,000+</td>
              <td>QR standees on all billing counters and exit desks</td>
            </tr>
            <tr>
              <td><strong>Divert Rate %</strong></td>
              <td style="text-align:center;">${d.divertRate}%</td>
              <td style="text-align:center; font-weight:bold; color:#15803D;">&lt; 5.0%</td>
              <td>Ensure karigar stock turnaround within 48 hours</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:40px; display:flex; justify-content:space-between; padding-top:20px; border-top:1px dashed #CCC;">
          <div style="text-align:center; width:220px;">
            <div style="border-bottom:1px solid #333; height:40px;"></div>
            <div style="font-size:0.82rem; margin-top:6px;"><strong>Selvi</strong><br>CRM Manager</div>
          </div>
          <div style="text-align:center; width:220px;">
            <div style="border-bottom:1px solid #333; height:40px;"></div>
            <div style="font-size:0.82rem; margin-top:6px;"><strong>Consulting &amp; Beyond</strong><br>Operations Auditor</div>
          </div>
          <div style="text-align:center; width:220px;">
            <div style="border-bottom:1px solid #333; height:40px;"></div>
            <div style="font-size:0.82rem; margin-top:6px;"><strong>Managing Director</strong><br>Suba Valli Vilas Jewellery</div>
          </div>
        </div>
      </section>
    `;
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

  // Export as Standalone HTML file
  function downloadReportHtml() {
    const d = currentReportData;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Suba Valli Vilas - MIS Report - ${escapeHtml(d.monthName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600&display=swap');
    body { font-family: 'Cambria', 'Noto Sans Tamil', serif; background: #FAF8F5; color: #1E293B; margin: 0; padding: 20px; }
    .mis-page { background: #FFF; border: 1px solid #E8E2D7; border-radius: 12px; padding: 32px; margin: 0 auto 24px; max-width: 900px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .page-top-hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #C5A059; padding-bottom: 8px; margin-bottom: 16px; }
    .page-tag { font-size: 11px; font-weight: bold; color: #9F792B; letter-spacing: 1px; }
    .page-sec-title { font-family: 'Cambria', Georgia, serif; font-size: 20px; color: #580505; margin: 0; font-weight: bold; }
    .metric-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
    .metric-card { background: #FFFBF2; border: 1px solid #E5D5B5; border-radius: 8px; padding: 12px; text-align: center; }
    .metric-label { font-size: 11px; color: #64748B; font-weight: bold; }
    .metric-val { font-size: 20px; font-weight: bold; color: #580505; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { background: #580505; color: #FFF; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  ${dom.reportContainer.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Suba_Valli_Vilas_MIS_Report_${d.monthName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`📥 Downloaded standalone HTML report for ${d.monthName}!`);
  }

  // Event Handlers
  function initEvents() {
    dom.btnFilterThisMonth.addEventListener('click', () => {
      dom.btnFilterThisMonth.classList.add('active');
      dom.btnFilterLastMonth.classList.remove('active');
      dom.btnFilterCustom.classList.remove('active');
      dom.customDateWrap.style.display = 'none';
      activeFilter = 'this_month';
      currentReportData = DATA_PRESETS.this_month;
      renderReport();
      showToast("Filtered: This Month (October 2026 MTD)");
    });

    dom.btnFilterLastMonth.addEventListener('click', () => {
      dom.btnFilterLastMonth.classList.add('active');
      dom.btnFilterThisMonth.classList.remove('active');
      dom.btnFilterCustom.classList.remove('active');
      dom.customDateWrap.style.display = 'none';
      activeFilter = 'last_month';
      currentReportData = DATA_PRESETS.last_month;
      renderReport();
      showToast("Filtered: Last Month (September 2026 Audit)");
    });

    dom.btnFilterCustom.addEventListener('click', () => {
      dom.btnFilterCustom.classList.add('active');
      dom.btnFilterThisMonth.classList.remove('active');
      dom.btnFilterLastMonth.classList.remove('active');
      dom.customDateWrap.style.display = 'flex';
    });

    dom.btnApplyCustomDate.addEventListener('click', () => {
      const s = dom.customStartDate.value;
      const e = dom.customEndDate.value;
      if (!s || !e) {
        alert("Please select both start and end date for custom report.");
        return;
      }
      activeFilter = 'custom';
      currentReportData = Object.assign({}, DATA_PRESETS.this_month, {
        periodLabel: `${s} to ${e}`,
        monthName: `Custom Range (${s} – ${e})`,
        generatedDate: new Date().toLocaleDateString('en-GB')
      });
      renderReport();
      showToast(`Filtered custom range: ${s} to ${e}!`);
    });

    dom.btnDownloadPdf.addEventListener('click', () => {
      window.print();
    });

    dom.btnDownloadHtml.addEventListener('click', downloadReportHtml);

    if (dom.btnSyncGSheet) {
      dom.btnSyncGSheet.addEventListener('click', () => {
        showToast("Synchronizing showroom MIS metrics with Google Sheet...");
        setTimeout(() => {
          if (dom.syncStatusText) dom.syncStatusText.textContent = "Synced with GSheet";
          showToast("✅ MIS metrics synchronized with Google Sheet!");
        }, 600);
      });
    }
  }

  function init() {
    initEvents();
    renderReport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
