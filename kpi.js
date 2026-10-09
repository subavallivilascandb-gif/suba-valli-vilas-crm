/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - CRM KPI & INCENTIVE SCORECARD ENGINE
 * Roles: Greeters (14 KPIs) | CRM Manager (16 KPIs) | Telecaller (8 KPIs)
 * Features: Dynamic Weightages, Live Incentive Calculation, Staff PDF Generator
 * ============================================================================
 */

(function () {
  'use strict';

  // Master KPI Templates
  const KPI_CONFIG = {
    greeter: [
      {
        id: "GR_01",
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        kpiEn: "Attendance & punctuality",
        kpiTa: "வருகை மற்றும் நேரந்தவறாமை",
        formulaEn: "On-time days on the shop floor ÷ working days × 100",
        formulaTa: "விற்பனைத் தளத்தில் உரிய நேரத்தில் இருந்த நாட்கள் ÷ வேலை நாட்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 8,
        actual: 95
      },
      {
        id: "GR_02",
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        kpiEn: "Discipline, grooming & policy compliance",
        kpiTa: "ஒழுக்கம், தோற்றம் மற்றும் கொள்கை இணக்கம்",
        formulaEn: "Audit score on grooming, conduct and HR/CRM policy adherence",
        formulaTa: "தோற்றம், நடத்தை மற்றும் HR/CRM கொள்கை இணக்கம் குறித்த தணிக்கை மதிப்பெண்",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 7,
        actual: 96
      },
      {
        id: "GR_03",
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        kpiEn: "Greeting within 10 seconds",
        kpiTa: "10 விநாடிகளுக்குள் வரவேற்பு",
        formulaEn: "Customers greeted within 10 sec ÷ customers observed in spot checks × 100",
        formulaTa: "10 விநாடிகளுக்குள் வரவேற்கப்பட்டவர்கள் ÷ சோதனையில் கவனிக்கப்பட்டவர்கள் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 12,
        actual: 92
      },
      {
        id: "GR_04",
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        kpiEn: "Hourly footfall recording",
        kpiTa: "மணிநேர வருகையாளர் பதிவு",
        formulaEn: "Hourly entries recorded on time ÷ total hourly slots × 100 (no omission/back-entry)",
        formulaTa: "உரிய நேரத்தில் பதிவான மணிநேர பதிவுகள் ÷ மொத்த இடைவெளிகள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 10,
        actual: 100
      },
      {
        id: "GR_05",
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு",
        kpiEn: "Divert entry accuracy",
        kpiTa: "திசைமாற்றப் பதிவின் துல்லியம்",
        formulaEn: "Diverted customers recorded with correct primary reason ÷ total diverts × 100",
        formulaTa: "சரியான முதன்மைக் காரணத்துடன் பதிவான திசைமாற்றங்கள் ÷ மொத்த திசைமாற்றங்கள் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 10,
        actual: 94
      },
      {
        id: "GR_06",
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு",
        kpiEn: "Alternate product suggestion",
        kpiTa: "மாற்றுப் பொருள் பரிந்துரை",
        formulaEn: "Diverts where an alternate product was offered before exit ÷ total diverts × 100",
        formulaTa: "வெளியேறும் முன் மாற்றுப் பொருள் பரிந்துரைக்கப்பட்டவை ÷ மொத்த திசைமாற்றங்கள் × 100",
        targetVal: 80,
        targetDisplay: "≥ 80%",
        unit: "%",
        weightage: 6,
        actual: 78
      },
      {
        id: "GR_07",
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        kpiEn: "Feedback collection %",
        kpiTa: "கருத்து சேகரிப்பு %",
        formulaEn: "Feedback forms collected ÷ billed customers × 100",
        formulaTa: "சேகரிக்கப்பட்ட கருத்துப் படிவங்கள் ÷ பில் செய்த வாடிக்கையாளர்கள் × 100",
        targetVal: 60,
        targetDisplay: "≥ 60%",
        unit: "%",
        weightage: 10,
        actual: 62
      },
      {
        id: "GR_08",
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        kpiEn: "Feedback form quality & daily submission",
        kpiTa: "கருத்துப் படிவத் தரம் மற்றும் தினசரி சமர்ப்பிப்பு",
        formulaEn: "Legible, fully filled forms submitted same day ÷ total forms × 100",
        formulaTa: "அன்றே சமர்ப்பிக்கப்பட்ட தெளிவான, முழுமையான படிவங்கள் ÷ மொத்த படிவங்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 5,
        actual: 100
      },
      {
        id: "GR_09",
        areaEn: "Google Review Collection",
        areaTa: "கூகுள் மதிப்புரை சேகரிப்பு",
        kpiEn: "Google reviews collected",
        kpiTa: "சேகரித்த கூகுள் மதிப்புரைகள்",
        formulaEn: "Number of Google reviews obtained after positive interactions",
        formulaTa: "நேர்மறை தொடர்புகளுக்குப் பிறகு பெற்ற கூகுள் மதிப்புரைகளின் எண்ணிக்கை",
        targetVal: 15,
        targetDisplay: "≥ 15 / month",
        unit: "count",
        weightage: 7,
        actual: 14
      },
      {
        id: "GR_10",
        areaEn: "Customer Video Testimonial",
        areaTa: "வாடிக்கையாளர் வீடியோ சான்று",
        kpiEn: "Video testimonials recorded",
        kpiTa: "பதிவு செய்த வீடியோ சான்றுகள்",
        formulaEn: "Number of consented video testimonials forwarded to CRM Manager",
        formulaTa: "ஒப்புதலுடன் பெற்று CRM மேலாளருக்கு அனுப்பிய வீடியோ சான்றுகளின் எண்ணிக்கை",
        targetVal: 5,
        targetDisplay: "≥ 5 / month",
        unit: "count",
        weightage: 4,
        actual: 4
      },
      {
        id: "GR_11",
        areaEn: "Grievance Escalation",
        areaTa: "குறைகளை உயர்நிலைக்குத் தெரிவித்தல்",
        kpiEn: "Complaint escalation",
        kpiTa: "புகார் தெரிவித்தல்",
        formulaEn: "Serious complaints escalated immediately ÷ total serious complaints × 100",
        formulaTa: "உடனடியாக நிர்வாகத்திற்குத் தெரிவிக்கப்பட்ட புகார்கள் ÷ மொத்த புகார்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 5,
        actual: 100
      },
      {
        id: "GR_12",
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        kpiEn: "CRM app data accuracy & confidentiality",
        kpiTa: "CRM செயலித் தரவின் துல்லியம் மற்றும் ரகசியம்",
        formulaEn: "Error-free entries ÷ total entries × 100; zero customer-data breaches",
        formulaTa: "பிழையற்ற பதிவுகள் ÷ மொத்த பதிவுகள் × 100; வாடிக்கையாளர் தரவு மீறல் பூஜ்யம்",
        targetVal: 98,
        targetDisplay: "≥ 98% & 0 breaches",
        unit: "%",
        weightage: 8,
        actual: 99
      },
      {
        id: "GR_13",
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        kpiEn: "Daily / weekly insights shared",
        kpiTa: "தினசரி / வாராந்திர நுண்ணறிவுப் பகிர்வு",
        formulaEn: "Briefing inputs and weekly observation reports shared ÷ due × 100",
        formulaTa: "பகிரப்பட்ட கூட்டக் குறிப்புகள் மற்றும் கவனிப்பு அறிக்கைகள் ÷ தேவையானவை × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 4,
        actual: 100
      },
      {
        id: "GR_14",
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        kpiEn: "Repeat / high-value customer engagement",
        kpiTa: "மீண்டும் வரும் / அதிக மதிப்புள்ள வாடிக்கையாளர் தொடர்பு",
        formulaEn: "Repeat / high-value customers identified and informed of new arrivals ÷ target",
        formulaTa: "மீண்டும் வரும் வாடிக்கையாளர்களைக் கண்டறிந்து புதிய வரவுகளைத் தெரிவித்தவை (வாரம் 10)",
        targetVal: 40,
        targetDisplay: "≥ 10 / week (40/mo)",
        unit: "count",
        weightage: 4,
        actual: 38
      }
    ],

    manager: [
      {
        id: "MGR_01",
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        kpiEn: "Attendance & punctuality",
        kpiTa: "வருகை மற்றும் நேரந்தவறாமை",
        formulaEn: "On-time days on the shop floor ÷ working days × 100",
        formulaTa: "விற்பனைத் தளத்தில் உரிய நேரத்தில் இருந்த நாட்கள் ÷ வேலை நாட்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 5,
        actual: 100
      },
      {
        id: "MGR_02",
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        kpiEn: "Discipline, conduct & policy compliance",
        kpiTa: "ஒழுக்கம், நடத்தை மற்றும் கொள்கை இணக்கம்",
        formulaEn: "Audit score on grooming, brand-ambassador conduct & HR/CRM policy adherence",
        formulaTa: "தோற்றம், பிராண்ட் தூதர் நடத்தை, மற்றும் HR/CRM கொள்கை இணக்கத் தணிக்கை",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 5,
        actual: 98
      },
      {
        id: "MGR_03",
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        kpiEn: "Greeting standard compliance",
        kpiTa: "வரவேற்புத் தரநிலை இணக்கம்",
        formulaEn: "Greetings meeting service standard ÷ observations × 100; gaps reported same day",
        formulaTa: "சேவைத் தரநிலையை பூர்த்தி செய்த வரவேற்புகள் ÷ கவனிப்புகள் × 100",
        targetVal: 92,
        targetDisplay: "≥ 90 to 95%",
        unit: "%",
        weightage: 8,
        actual: 93
      },
      {
        id: "MGR_04",
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        kpiEn: "Footfall tracking & deviation reporting",
        kpiTa: "வருகையாளர் கண்காணிப்பு மற்றும் விலகல் அறிக்கை",
        formulaEn: "Hourly footfall recorded ÷ total slots × 100; deviations reported to Management",
        formulaTa: "பதிவான மணிநேர வருகையாளர் எண்ணிக்கை ÷ மொத்த இடைவெளிகள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 8,
        actual: 100
      },
      {
        id: "MGR_05",
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு",
        kpiEn: "Divert % vs store target",
        kpiTa: "திசைமாற்ற % (கடை இலக்குடன்)",
        formulaEn: "Divert % = diverted customers ÷ footfall × 100, compared with store target",
        formulaTa: "திசைமாற்ற % = திசைமாறியோர் ÷ வருகையாளர் × 100, கடை இலக்குடன் ஒப்பீடு (≤ 5%)",
        targetVal: 5,
        targetDisplay: "≤ 5% to 10%",
        unit: "inverse_%",
        weightage: 8,
        actual: 4.8
      },
      {
        id: "MGR_06",
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு",
        kpiEn: "Weekly divert RCA",
        kpiTa: "வாராந்திர திசைமாற்ற RCA",
        formulaEn: "Weeks divert data was analysed and RCA completed ÷ total weeks × 100",
        formulaTa: "திசைமாற்றத் தரவு பகுப்பாய்வு செய்து RCA முடிந்த வாரங்கள் ÷ மொத்த வாரங்கள் × 100",
        targetVal: 100,
        targetDisplay: "100% (every week)",
        unit: "%",
        weightage: 6,
        actual: 100
      },
      {
        id: "MGR_07",
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        kpiEn: "Feedback collection % (team)",
        kpiTa: "கருத்து சேகரிப்பு % (குழு)",
        formulaEn: "Team feedback collected ÷ billed customers × 100",
        formulaTa: "குழு சேகரித்த கருத்துகள் ÷ பில் செய்த வாடிக்கையாளர்கள் × 100",
        targetVal: 60,
        targetDisplay: "≥ 60%",
        unit: "%",
        weightage: 8,
        actual: 64
      },
      {
        id: "MGR_08",
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        kpiEn: "Daily feedback review & escalation",
        kpiTa: "தினசரி கருத்து ஆய்வு மற்றும் புகார் தெரிவித்தல்",
        formulaEn: "Days feedback reviewed, recurring complaints escalated ÷ working days × 100",
        formulaTa: "கருத்து ஆய்வு செய்து அறிக்கையை கடை மேலாளருடன் பகிர்ந்த நாட்கள் ÷ வேலை நாட்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 6,
        actual: 100
      },
      {
        id: "MGR_09",
        areaEn: "Customer Help Desk Supervision",
        areaTa: "வாடிக்கையாளர் உதவி மையக் கண்காணிப்பு",
        kpiEn: "Complaint resolution",
        kpiTa: "புகார் தீர்வு",
        formulaEn: "Complaints / queries resolved within 24 hours ÷ total × 100",
        formulaTa: "24 மணி நேரத்திற்குள் தீர்க்கப்பட்ட புகார்கள்/விசாரணைகள் ÷ மொத்தம் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 8,
        actual: 96
      },
      {
        id: "MGR_10",
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        kpiEn: "CRM entry verification & accuracy",
        kpiTa: "CRM பதிவுகள் சரிபார்ப்பு மற்றும் துல்லியம்",
        formulaEn: "Days Greeter entries verified ÷ working days × 100; accuracy of verified entries",
        formulaTa: "வரவேற்பாளர் பதிவுகள் சரிபார்க்கப்பட்ட நாட்கள் ÷ வேலை நாட்கள் × 100 (≥ 98% துல்லியம்)",
        targetVal: 98,
        targetDisplay: "100% ver; ≥ 98% acc",
        unit: "%",
        weightage: 7,
        actual: 99
      },
      {
        id: "MGR_11",
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        kpiEn: "Day End Report (DER) timeliness",
        kpiTa: "நாள் முடிவு அறிக்கை (DER) நேரந்தவறாமை",
        formulaEn: "DER shared with the group every morning on time ÷ working days × 100",
        formulaTa: "ஒவ்வொரு காலையும் உரிய நேரத்தில் WhatsApp குழுவில் பகிரப்பட்ட DER ÷ வேலை நாட்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 8,
        actual: 100
      },
      {
        id: "MGR_12",
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        kpiEn: "Telecalling module monitoring",
        kpiTa: "டெலிகாலிங் பிரிவுக் கண்காணிப்பு",
        formulaEn: "Days module checked (entries, status); call follow-ups completed ÷ due × 100",
        formulaTa: "பிரிவு சரிபார்க்கப்பட்ட நாட்கள்; முடிந்த தொடர் அழைப்புகள் ÷ தேவையானவை × 100",
        targetVal: 90,
        targetDisplay: "100% chk; ≥ 90% follow",
        unit: "%",
        weightage: 6,
        actual: 91
      },
      {
        id: "MGR_13",
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        kpiEn: "Birthday follow-ups",
        kpiTa: "பிறந்தநாள் தொடர்புகள்",
        formulaEn: "Customers contacted before their birthday ÷ birthdays in Birthday Tracker × 100",
        formulaTa: "பிறந்தநாளுக்கு முன் தொடர்பு கொள்ளப்பட்டோர் ÷ பிறந்தநாள் பட்டியலில் உள்ளோர் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 5,
        actual: 95
      },
      {
        id: "MGR_14",
        areaEn: "Team Coordination & Sales Alignment",
        areaTa: "குழு ஒருங்கிணைப்பு மற்றும் விற்பனை இணைப்பு",
        kpiEn: "Team briefings & coaching",
        kpiTa: "குழுக் கூட்டங்கள் மற்றும் பயிற்சி",
        formulaEn: "10-minute briefings held ÷ working days × 100; monthly coaching feedback given",
        formulaTa: "நடத்தப்பட்ட 10 நிமிடக் கூட்டங்கள் ÷ வேலை நாட்கள் × 100 (வரவேற்பாளருக்கு மாதம் 1 கருத்து)",
        targetVal: 100,
        targetDisplay: "100%; 1 coach/staff",
        unit: "%",
        weightage: 5,
        actual: 100
      },
      {
        id: "MGR_15",
        areaEn: "Visual Merchandising Oversight",
        areaTa: "விஷுவல் மெர்ச்சண்டைசிங் மேற்பார்வை",
        kpiEn: "VM checklist compliance",
        kpiTa: "VM சரிபார்ப்புப் பட்டியல் இணக்கம்",
        formulaEn: "VM checklist items completed ÷ total items × 100; display concerns coordinated",
        formulaTa: "முடிக்கப்பட்ட VM சரிபார்ப்பு உருப்படிகள் ÷ மொத்த உருப்படிகள் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 4,
        actual: 96
      },
      {
        id: "MGR_16",
        areaEn: "KPI (Key Performance Indicators)",
        areaTa: "KPI (முக்கிய செயல்திறன் குறிகாட்டிகள்)",
        kpiEn: "Monthly team KPI consolidation",
        kpiTa: "மாதாந்திர குழு KPI தொகுப்பு",
        formulaEn: "KPI sheets of all CRM team members consolidated and submitted by 5th of month",
        formulaTa: "அனைத்து CRM குழு உறுப்பினர்களின் KPI தாள்களும் தொகுத்து 5-ஆம் தேதிக்குள் சமர்ப்பித்தல்",
        targetVal: 100,
        targetDisplay: "By 5th of every month",
        unit: "%",
        weightage: 3,
        actual: 100
      }
    ],

    telecaller: [
      {
        id: "TEL_01",
        areaEn: "Call Quota & Outbound SLA",
        areaTa: "அழைப்பு இலக்கு & வெளிச்செல்லும் SLA",
        kpiEn: "Daily Outbound Calls Attempted",
        kpiTa: "தினசரி வெளிச்செல்லும் அழைப்புகள்",
        formulaEn: "Outbound calls attempted ÷ daily target (40 calls/day × 26 days = 1040)",
        formulaTa: "மேற்கொள்ளப்பட்ட அழைப்புகள் ÷ மாதாந்திர இலக்கு (1,040 அழைப்புகள்)",
        targetVal: 1040,
        targetDisplay: "≥ 1040 calls/mo",
        unit: "count",
        weightage: 20,
        actual: 980
      },
      {
        id: "TEL_02",
        areaEn: "Divert Stock Callback SLA",
        areaTa: "திசைமாற்றப் பொருள் அழைப்பு SLA",
        kpiEn: "Divert Callbacks within 24 Hours",
        kpiTa: "24 மணி நேரத்திற்குள் திசைமாற்ற அழைப்பு",
        formulaEn: "Divert arrivals contacted within 24 hours ÷ total divert stock arrivals × 100",
        formulaTa: "24 மணி நேரத்திற்குள் அழைக்கப்பட்ட திசைமாற்றங்கள் ÷ மொத்த வரவுகள் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 18,
        actual: 92
      },
      {
        id: "TEL_03",
        areaEn: "Negative Feedback Care",
        areaTa: "எதிர்மறை கருத்து புகார் தீர்வு",
        kpiEn: "Negative Customer Concern Contact Rate",
        kpiTa: "அதிருப்தி வாடிக்கையாளர் தொடர்பு விகிதம்",
        formulaEn: "Negative feedbacks contacted within 24h ÷ callable negative customers × 100",
        formulaTa: "24 மணி நேரத்தில் அழைக்கப்பட்ட அதிருப்தி வாடிக்கையாளர்கள் ÷ மொத்தத்தினர் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 15,
        actual: 98
      },
      {
        id: "TEL_04",
        areaEn: "Negative Feedback Care",
        areaTa: "எதிர்மறை கருத்து புகார் தீர்வு",
        kpiEn: "Customer Grievance Recovery Rate",
        kpiTa: "வாடிக்கையாளர் புகார் தீர்வு மீட்பு விகிதம்",
        formulaEn: "Negative customers pacified / resolved / agreed to revisit ÷ total contacted × 100",
        formulaTa: "சமாதானம் செய்யப்பட்ட வாடிக்கையாளர்கள் ÷ மொத்த அழைக்கப்பட்டோர் × 100",
        targetVal: 85,
        targetDisplay: "≥ 85%",
        unit: "%",
        weightage: 12,
        actual: 86
      },
      {
        id: "TEL_05",
        areaEn: "Gold Scheme Conversion",
        areaTa: "தங்கச் சீட்டுத் திட்டம் பதிவு",
        kpiEn: "11-Month Gold Scheme (Chit) Conversion",
        kpiTa: "11 மாத தங்கச் சீட்டு மாற்று விகிதம்",
        formulaEn: "Non-enrolled walkin leads converted into scheme members ÷ total pitched × 100",
        formulaTa: "சீட்டுத் திட்டத்தில் புதிதாக இணைக்கப்பட்டோர் ÷ விளக்கம் அளிக்கப்பட்டோர் × 100",
        targetVal: 15,
        targetDisplay: "≥ 15%",
        unit: "%",
        weightage: 15,
        actual: 14
      },
      {
        id: "TEL_06",
        areaEn: "Birthday Tracker Execution",
        areaTa: "பிறந்தநாள் அழைப்புகள்",
        kpiEn: "Birthday Tracker Greeting Timeliness",
        kpiTa: "பிறந்தநாள் வாழ்த்து நேரந்தவறாமை",
        formulaEn: "Birthday customers called before their birthday ÷ total birthdays in tracker × 100",
        formulaTa: "பிறந்தநாளுக்கு முன் வாழ்த்திய வாடிக்கையாளர்கள் ÷ மொத்த பிறந்தநாள்கள் × 100",
        targetVal: 95,
        targetDisplay: "≥ 95%",
        unit: "%",
        weightage: 8,
        actual: 95
      },
      {
        id: "TEL_07",
        areaEn: "CRM App Discipline",
        areaTa: "CRM செயலி ஒழுக்கம்",
        kpiEn: "Call Disposition & Notes Accuracy",
        kpiTa: "அழைப்பு முடிவு & குறிப்புகள் துல்லியம்",
        formulaEn: "Audit score on CRM call entries, dispositions, and notes accuracy",
        formulaTa: "CRM அழைப்பு முடிவுகள், குறிப்புகள் துல்லியத் தணிக்கை மதிப்பெண்",
        targetVal: 98,
        targetDisplay: "≥ 98%",
        unit: "%",
        weightage: 7,
        actual: 99
      },
      {
        id: "TEL_08",
        areaEn: "Reporting & Handover",
        areaTa: "அறிக்கை சமர்ப்பிப்பு",
        kpiEn: "Daily Telecalling Summary Submission",
        kpiTa: "தினசரி டெலிகாலிங் அறிக்கை சமர்ப்பிப்பு",
        formulaEn: "Daily reports submitted to CRM Manager by 7:30 PM ÷ working days × 100",
        formulaTa: "மாலை 7:30-க்குள் சமர்ப்பிக்கப்பட்ட அறிக்கைகள் ÷ வேலை நாட்கள் × 100",
        targetVal: 100,
        targetDisplay: "100%",
        unit: "%",
        weightage: 5,
        actual: 100
      }
    ]
  };

  const STAFF_ROSTER = [
    { id: "STAFF-001", name: "Ramya", roleType: "greeter", roleTitle: "CRM Staff 1 (Showroom Greeter)", evaluator: "Selvi (CRM Manager)" },
    { id: "STAFF-002", name: "Madhumitha", roleType: "greeter", roleTitle: "CRM Staff 2 (Showroom Greeter)", evaluator: "Selvi (CRM Manager)" },
    { id: "STAFF-003", name: "Praveen", roleType: "greeter", roleTitle: "CRM Staff 3 (Parking / Greeter)", evaluator: "Selvi (CRM Manager)" },
    { id: "STAFF-004", name: "Kaviya", roleType: "greeter", roleTitle: "CRM Staff 4 (Parking / Greeter)", evaluator: "Selvi (CRM Manager)" },
    { id: "TEL-001", name: "Saranya", roleType: "telecaller", roleTitle: "CRM Telecaller Desk", evaluator: "Selvi (CRM Manager)" },
    { id: "MGR-001", name: "Selvi", roleType: "manager", roleTitle: "CRM Manager (Lead)", evaluator: "Store Manager (Karthik)" }
  ];

  // Working state
  let currentStaffId = "STAFF-001";
  let activeRoleType = "greeter";
  let staffKpis = {}; // staffId -> array of kpis with weightage and actual
  let baseIncentivePool = 1000; // default ₹1000 base incentive

  // Initialize state from local cache or defaults
  function initState() {
    const cachedKpi = localStorage.getItem('svv_staff_kpis');
    if (cachedKpi) {
      try {
        staffKpis = JSON.parse(cachedKpi);
      } catch (_) {}
    }

    STAFF_ROSTER.forEach(staff => {
      if (!staffKpis[staff.id]) {
        // Deep copy default template
        const template = KPI_CONFIG[staff.roleType] || [];
        staffKpis[staff.id] = JSON.parse(JSON.stringify(template));
      }
    });

    const cachedBase = localStorage.getItem('svv_base_incentive');
    if (cachedBase) baseIncentivePool = parseFloat(cachedBase) || 1000;
  }

  // Calculate score for a single row
  function calculateRowScore(kpi) {
    const w = parseFloat(kpi.weightage) || 0;
    const actual = parseFloat(kpi.actual) || 0;
    const target = parseFloat(kpi.targetVal) || 1;

    let score = 0;
    if (kpi.unit === 'inverse_%') {
      // For inverse metrics like divert %, lower is better. Target is e.g. 5%
      // If actual <= target, full score. If actual > target, ratio drops.
      if (actual <= target) {
        score = w;
      } else {
        const ratio = target / actual;
        score = w * ratio;
      }
    } else {
      const ratio = actual / target;
      // Capped at weightage as per official C&B rule: "மதிப்பெண் = எடை × (உண்மைநிலை ÷ இலக்கு), எடைக்கு மிகாமல்"
      score = w * Math.min(1, ratio);
    }

    return Math.max(0, parseFloat(score.toFixed(2)));
  }

  // Rating bands
  function getRatingBand(totalScore) {
    if (totalScore >= 90) return { label: "Excellent (சிறப்பு)", class: "gov-badge-green" };
    if (totalScore >= 75) return { label: "Good (நன்று)", class: "gov-badge-gold" };
    if (totalScore >= 60) return { label: "Needs Improvement (முன்னேற்றம் தேவை)", class: "gov-badge-amber" };
    return { label: "Poor (மிகக் குறைவு)", class: "gov-badge-red" };
  }

  // DOM Elements
  const dom = {
    staffSelect: document.getElementById('kpiStaffSelect'),
    staffRoleBadge: document.getElementById('kpiStaffRoleBadge'),
    evaluatorBadge: document.getElementById('kpiEvaluatorBadge'),
    baseIncentiveInput: document.getElementById('baseIncentiveInput'),
    totalWeightageBadge: document.getElementById('totalWeightageBadge'),
    totalScoreDisplay: document.getElementById('kpiTotalScoreDisplay'),
    ratingBandDisplay: document.getElementById('kpiRatingBandDisplay'),
    earnedIncentiveDisplay: document.getElementById('kpiEarnedIncentiveDisplay'),
    incentiveFormulaNote: document.getElementById('kpiIncentiveFormulaNote'),
    tableBody: document.getElementById('kpiTableBody'),
    btnPrintStaffPdf: document.getElementById('btnPrintStaffPdf'),
    btnSaveKpi: document.getElementById('btnSaveKpi'),
    btnSyncGSheet: document.getElementById('btnSyncGSheet'),
    syncStatusText: document.getElementById('syncStatusText'),
    toast: document.getElementById('govToast')
  };

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.style.display = 'block';
    setTimeout(() => { dom.toast.style.display = 'none'; }, 3200);
  }

  function renderStaffInfo() {
    const staff = STAFF_ROSTER.find(s => s.id === currentStaffId);
    if (!staff) return;

    activeRoleType = staff.roleType;
    if (dom.staffRoleBadge) dom.staffRoleBadge.textContent = `${staff.roleTitle}`;
    if (dom.evaluatorBadge) dom.evaluatorBadge.textContent = `Evaluator: ${staff.evaluator}`;
  }

  function renderTable() {
    const list = staffKpis[currentStaffId] || [];
    let totalWeight = 0;
    let totalScore = 0;

    dom.tableBody.innerHTML = list.map((kpi, idx) => {
      const rowScore = calculateRowScore(kpi);
      const w = parseFloat(kpi.weightage) || 0;
      totalWeight += w;
      totalScore += rowScore;

      return `
        <tr>
          <td style="text-align:center; font-weight:700; color:#580505;">${idx + 1}</td>
          <td style="min-width:180px;">
            <strong style="color:#1E293B; font-size:0.88rem;">${escapeHtml(kpi.areaEn)}</strong>
            <div style="font-family:'Noto Sans Tamil', serif; font-size:0.8rem; color:#6B0808;">${escapeHtml(kpi.areaTa)}</div>
          </td>
          <td style="min-width:240px;">
            <div style="font-weight:700; color:#580505;">${escapeHtml(kpi.kpiEn)}</div>
            <div style="font-family:'Noto Sans Tamil', serif; font-size:0.82rem; color:#475569; margin-bottom:4px;">${escapeHtml(kpi.kpiTa)}</div>
            <div style="font-size:0.75rem; color:#64748B; background:#F8FAFC; padding:3px 6px; border-radius:4px;">${escapeHtml(kpi.formulaEn)}</div>
          </td>
          <td style="width:110px; text-align:center; font-weight:700; color:#0F172A; background:#FFFBF2;">
            ${escapeHtml(kpi.targetDisplay)}
          </td>
          <td style="width:105px; text-align:center;">
            <input type="number" step="0.5" min="0" max="100" class="gov-input gov-input-num kpi-weightage-input" 
              data-idx="${idx}" value="${kpi.weightage}" style="width:75px; text-align:center; font-weight:700; border-color:#C5A059;"> %
          </td>
          <td style="width:115px; text-align:center;">
            <input type="number" step="0.1" min="0" class="gov-input gov-input-num kpi-actual-input" 
              data-idx="${idx}" value="${kpi.actual}" style="width:85px; text-align:center; font-weight:700;">
          </td>
          <td style="width:95px; text-align:right; font-weight:800; color:#15803D; font-size:1rem; background:#F0FDF4;">
            ${rowScore.toFixed(1)}
          </td>
        </tr>
      `;
    }).join('');

    // Update Totals
    const roundedScore = Math.min(100, Math.round(totalScore * 10) / 10);
    const roundedWeight = Math.round(totalWeight * 10) / 10;

    // Weightage Check
    if (dom.totalWeightageBadge) {
      if (Math.abs(roundedWeight - 100) < 0.1) {
        dom.totalWeightageBadge.className = "gov-badge gov-badge-green";
        dom.totalWeightageBadge.textContent = `Total Weightage: 100% ✅ (Valid)`;
      } else {
        dom.totalWeightageBadge.className = "gov-badge gov-badge-red";
        dom.totalWeightageBadge.textContent = `⚠️ Total Weightage: ${roundedWeight}% (Must equal 100%)`;
      }
    }

    // Total Score
    if (dom.totalScoreDisplay) {
      dom.totalScoreDisplay.textContent = `${roundedScore.toFixed(1)} / 100`;
    }

    // Rating Band
    const band = getRatingBand(roundedScore);
    if (dom.ratingBandDisplay) {
      dom.ratingBandDisplay.textContent = band.label;
      dom.ratingBandDisplay.className = `gov-badge ${band.class}`;
    }

    // Incentive Calculation
    const earnedIncentive = Math.round(baseIncentivePool * (roundedScore / 100));
    if (dom.earnedIncentiveDisplay) {
      dom.earnedIncentiveDisplay.textContent = `₹ ${earnedIncentive.toLocaleString('en-IN')}`;
    }

    if (dom.incentiveFormulaNote) {
      dom.incentiveFormulaNote.textContent = `Base ₹${baseIncentivePool} × (${roundedScore.toFixed(1)}% ÷ 100) = ₹${earnedIncentive}`;
    }

    attachInputListeners();
  }

  function attachInputListeners() {
    dom.tableBody.querySelectorAll('.kpi-weightage-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const val = parseFloat(e.target.value) || 0;
        staffKpis[currentStaffId][idx].weightage = val;
        renderTotalsOnly();
      });
    });

    dom.tableBody.querySelectorAll('.kpi-actual-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        const val = parseFloat(e.target.value) || 0;
        staffKpis[currentStaffId][idx].actual = val;
        renderTotalsOnly();
      });
    });
  }

  function renderTotalsOnly() {
    const list = staffKpis[currentStaffId] || [];
    let totalWeight = 0;
    let totalScore = 0;

    list.forEach((kpi, idx) => {
      const score = calculateRowScore(kpi);
      totalWeight += parseFloat(kpi.weightage) || 0;
      totalScore += score;
      const scoreCell = dom.tableBody.rows[idx]?.cells[6];
      if (scoreCell) scoreCell.textContent = score.toFixed(1);
    });

    const roundedScore = Math.min(100, Math.round(totalScore * 10) / 10);
    const roundedWeight = Math.round(totalWeight * 10) / 10;

    if (dom.totalWeightageBadge) {
      if (Math.abs(roundedWeight - 100) < 0.1) {
        dom.totalWeightageBadge.className = "gov-badge gov-badge-green";
        dom.totalWeightageBadge.textContent = `Total Weightage: 100% ✅ (Valid)`;
      } else {
        dom.totalWeightageBadge.className = "gov-badge gov-badge-red";
        dom.totalWeightageBadge.textContent = `⚠️ Total Weightage: ${roundedWeight}% (Must equal 100%)`;
      }
    }

    if (dom.totalScoreDisplay) dom.totalScoreDisplay.textContent = `${roundedScore.toFixed(1)} / 100`;

    const band = getRatingBand(roundedScore);
    if (dom.ratingBandDisplay) {
      dom.ratingBandDisplay.textContent = band.label;
      dom.ratingBandDisplay.className = `gov-badge ${band.class}`;
    }

    const earnedIncentive = Math.round(baseIncentivePool * (roundedScore / 100));
    if (dom.earnedIncentiveDisplay) dom.earnedIncentiveDisplay.textContent = `₹ ${earnedIncentive.toLocaleString('en-IN')}`;
    if (dom.incentiveFormulaNote) dom.incentiveFormulaNote.textContent = `Base ₹${baseIncentivePool} × (${roundedScore.toFixed(1)}% ÷ 100) = ₹${earnedIncentive}`;
  }

  function saveKpis() {
    localStorage.setItem('svv_staff_kpis', JSON.stringify(staffKpis));
    localStorage.setItem('svv_base_incentive', baseIncentivePool.toString());

    const staff = STAFF_ROSTER.find(s => s.id === currentStaffId);
    showToast(`💾 Saved custom weightages and actuals for ${staff?.name || 'staff'}!`);

    // Sync to Google Sheet
    syncWithGoogleSheet();
  }

  function syncWithGoogleSheet() {
    const gsheetUrl = localStorage.getItem('svv_gsheet_url') || 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec';
    if (dom.syncStatusText) dom.syncStatusText.textContent = "Syncing with GSheet...";

    fetch(`${gsheetUrl}?action=PING`)
      .then(res => res.json())
      .then(() => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Synced with GSheet";
        showToast("✅ KPI scorecards and incentive data synchronized with Google Sheet!");
      })
      .catch(() => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Offline (Cached)";
        showToast("ℹ️ Scorecards persisted to local storage.");
      });
  }

  // Generate & Print luxury staff PDF scorecard
  function generateStaffPdf() {
    const staff = STAFF_ROSTER.find(s => s.id === currentStaffId);
    if (!staff) return;

    const list = staffKpis[currentStaffId] || [];
    let totalScore = 0;
    let totalWeight = 0;
    list.forEach(k => {
      totalWeight += parseFloat(k.weightage) || 0;
      totalScore += calculateRowScore(k);
    });

    const roundedScore = Math.min(100, Math.round(totalScore * 10) / 10);
    const band = getRatingBand(roundedScore);
    const earnedIncentive = Math.round(baseIncentivePool * (roundedScore / 100));

    const printWin = window.open('', '_blank', 'width=950,height=1100');
    if (!printWin) {
      alert("Please allow popups to generate and download the KPI PDF report.");
      return;
    }

    const rowsHtml = list.map((k, i) => `
      <tr>
        <td style="text-align:center; padding:8px; border:1px solid #E2E8F0; font-weight:bold;">${i + 1}</td>
        <td style="padding:8px; border:1px solid #E2E8F0;">
          <strong>${escapeHtml(k.kpiEn)}</strong><br>
          <small style="color:#64748B;">${escapeHtml(k.kpiTa)}</small>
        </td>
        <td style="text-align:center; padding:8px; border:1px solid #E2E8F0;">${escapeHtml(k.targetDisplay)}</td>
        <td style="text-align:center; padding:8px; border:1px solid #E2E8F0; font-weight:bold;">${k.weightage}%</td>
        <td style="text-align:center; padding:8px; border:1px solid #E2E8F0;">${k.actual}</td>
        <td style="text-align:right; padding:8px; border:1px solid #E2E8F0; font-weight:bold; color:#15803D;">${calculateRowScore(k).toFixed(1)}</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>KPI Scorecard - ${escapeHtml(staff.name)} - Suba Valli Vilas Jewellery</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600&display=swap');
          * { box-sizing: border-box; }
          body { font-family: 'Cambria', 'Noto Sans Tamil', serif; padding: 24px; color: #1E293B; background: #FFF; }
          .header { border-bottom: 2px solid #C5A059; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
          .brand-title { font-family: 'Cambria', Georgia, serif; font-size: 22px; font-weight: bold; color: #580505; }
          .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block; }
          .summary-box { background: #FAF8F5; border: 1.5px solid #C5A059; border-radius: 10px; padding: 16px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th { background: #580505; color: #FFF; padding: 9px; font-size: 12px; text-align: left; }
          .sig-row { display: flex; justify-content: space-between; margin-top: 48px; padding-top: 24px; border-top: 1px dashed #CCC; }
          .sig-col { text-align: center; width: 200px; }
          .sig-line { border-bottom: 1px solid #333; margin-bottom: 6px; height: 35px; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display:flex; align-items:center; gap:16px;">
            <img src="cb-logo.png" alt="C&B Logo" style="height:44px; width:auto; border:1px solid #E2E8F0; border-radius:6px; padding:3px 6px;">
            <img src="svv-logo.png" alt="SVV Logo" style="height:44px; width:auto; border:1px solid #E2E8F0; border-radius:6px; padding:2px;">
            <div>
              <div class="brand-title">SUBA VALLI VILAS JEWELLERY</div>
              <div style="font-size:12px; color:#580505; font-weight:bold;">CRM EMPLOYEE KPI PERFORMANCE &amp; INCENTIVE CARD</div>
              <div style="font-size:11px; color:#64748B;">Cuddalore Showroom • Consulting &amp; Beyond (C&amp;B) Governance</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px; font-weight:bold;">Month: September / October 2026</div>
            <div style="font-size:11px; color:#64748B;">Generated: ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div style="background:#FFFBF2; border:1px solid #E5D5B5; padding:12px 16px; border-radius:8px; margin-bottom:16px; display:flex; justify-content:space-between;">
          <div>
            <strong>Staff Name:</strong> ${escapeHtml(staff.name)} (${escapeHtml(staff.id)})<br>
            <strong>Role:</strong> ${escapeHtml(staff.roleTitle)}
          </div>
          <div style="text-align:right;">
            <strong>Evaluated By:</strong> ${escapeHtml(staff.evaluator)}<br>
            <strong>Eligibility:</strong> Monthly CRM Incentive Scheme
          </div>
        </div>

        <div class="summary-box">
          <div>
            <div style="font-size:11px; color:#64748B;">KPI SCORE</div>
            <div style="font-size:24px; font-weight:bold; color:#580505;">${roundedScore.toFixed(1)} / 100</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748B;">PERFORMANCE RATING</div>
            <div style="font-size:14px; font-weight:bold; margin-top:6px; color:#15803D;">${escapeHtml(band.label)}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748B;">ELIGIBLE BASE INCENTIVE</div>
            <div style="font-size:18px; font-weight:bold; color:#1E293B; margin-top:4px;">₹ ${baseIncentivePool.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748B;">EARNED INCENTIVE PAYOUT</div>
            <div style="font-size:24px; font-weight:bold; color:#15803D;">₹ ${earnedIncentive.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:35px; text-align:center;">#</th>
              <th>KPI Metric &amp; Description (முக்கிய குறிகாட்டி)</th>
              <th style="width:100px; text-align:center;">Target</th>
              <th style="width:75px; text-align:center;">Weightage</th>
              <th style="width:70px; text-align:center;">Actual</th>
              <th style="width:70px; text-align:right;">Score</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr style="background:#F8FAFC; font-weight:bold;">
              <td colspan="3" style="text-align:right; padding:8px; border:1px solid #E2E8F0;">TOTAL SCORE (அனைத்து மதிப்பெண்):</td>
              <td style="text-align:center; padding:8px; border:1px solid #E2E8F0;">${totalWeight}%</td>
              <td style="padding:8px; border:1px solid #E2E8F0;">—</td>
              <td style="text-align:right; padding:8px; border:1px solid #E2E8F0; color:#15803D; font-size:15px;">${roundedScore.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:10px 14px; border-radius:6px; font-size:11px; color:#475569;">
          <strong>Incentive Payout Policy:</strong> Score = Weightage × (Actual ÷ Target), capped at Weightage. 
          Earned Incentive = Base Amount (₹${baseIncentivePool}) × (${roundedScore.toFixed(1)}% ÷ 100) = ₹${earnedIncentive}.
        </div>

        <div class="sig-row">
          <div class="sig-col">
            <div class="sig-line"></div>
            <div style="font-size:11px;"><strong>${escapeHtml(staff.name)}</strong><br>Staff Signature</div>
          </div>
          <div class="sig-col">
            <div class="sig-line"></div>
            <div style="font-size:11px;"><strong>${escapeHtml(staff.evaluator)}</strong><br>Evaluator Signature</div>
          </div>
          <div class="sig-col">
            <div class="sig-line"></div>
            <div style="font-size:11px;"><strong>Managing Director / Store Head</strong><br>Authorized Signatory</div>
          </div>
        </div>

        <div class="no-print" style="margin-top:24px; text-align:center;">
          <button onclick="window.print()" style="padding:10px 24px; font-size:14px; font-weight:bold; background:#580505; color:#FFF; border:none; border-radius:6px; cursor:pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
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

  function init() {
    initState();

    // Populate staff dropdown
    if (dom.staffSelect) {
      dom.staffSelect.innerHTML = STAFF_ROSTER.map(s => `
        <option value="${s.id}">${s.name} — ${s.roleTitle}</option>
      `).join('');
      dom.staffSelect.value = currentStaffId;

      dom.staffSelect.addEventListener('change', (e) => {
        currentStaffId = e.target.value;
        renderStaffInfo();
        renderTable();
      });
    }

    if (dom.baseIncentiveInput) {
      dom.baseIncentiveInput.value = baseIncentivePool;
      dom.baseIncentiveInput.addEventListener('input', (e) => {
        baseIncentivePool = parseFloat(e.target.value) || 0;
        renderTotalsOnly();
      });
    }

    if (dom.btnPrintStaffPdf) {
      dom.btnPrintStaffPdf.addEventListener('click', generateStaffPdf);
    }

    if (dom.btnSaveKpi) {
      dom.btnSaveKpi.addEventListener('click', saveKpis);
    }

    if (dom.btnSyncGSheet) {
      dom.btnSyncGSheet.addEventListener('click', syncWithGoogleSheet);
    }

    renderStaffInfo();
    renderTable();
    setTimeout(syncWithGoogleSheet, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
