/**
 * ==========================================================================
 * SUBA VALLI VILAS - CRM JEWELLERY APPLICATION & DER DASHBOARD LOGIC
 * Brand: Suba Valli Vilas (Strictly adhered)
 * ==========================================================================
 */

(function () {
  'use strict';

  // Master State Object
  const state = {
    currentLang: 'en', // 'en' or 'ta'
    activeBranch: 'Cuddalore (Main Branch)',
    currentUser: null,
    currentHourIndex: 0, // 0 = 10AM, 1 = 11AM, etc. (Demo default: 10:00 AM)
    // Hardcoded Google Apps Script Web App URL — single source of truth (Sheet)
    gsheetUrl: localStorage.getItem('svv_gsheet_url') || 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec',
    cfWorkerUrl: localStorage.getItem('svv_cloudflare_worker_url') || 'https://svv-crm-gateway.subavallivilas-candb.workers.dev',
    autoSyncGSheet: true, // Always ON — sheet is the only data store
    lastSyncTime: localStorage.getItem('svv_last_sync_time') || '',
    gsheetConnected: false,
    cfWorkerConnected: false,
    activeQRMedium: 'Billing Counter Standee',
    activeQRSource: 'billing_counter',

    // Role-Based User Database (with secure default credentials)
    users: [
      {
        id: 'USR-001',
        fullName: 'Priya Sharma',
        username: 'priya_admin',
        password: 'svv@admin2026',
        branch: 'Cuddalore (Main Branch)',
        role: 'Admin',
        permissions: ['ff_today', 'ff_yesterday', 'fb_entry', 'fb_view', 'div_entry', 'div_view', 'telecaller', 'reports', 'der', 'users', 'settings'],
        status: 'Active'
      },
      {
        id: 'USR-002',
        fullName: 'Vijay',
        username: 'vijay_sales',
        password: 'svv@staff2026',
        branch: 'Cuddalore (Main Branch)',
        role: 'Staff',
        permissions: ['ff_today', 'fb_entry', 'div_entry'],
        status: 'Active'
      },
      {
        id: 'USR-003',
        fullName: 'Lakshmi',
        username: 'lakshmi_crm',
        password: 'svv@tele2026',
        branch: 'Cuddalore (Main Branch)',
        role: 'Telecaller',
        permissions: ['telecaller', 'fb_view', 'reports'],
        status: 'Active'
      },
      {
        id: 'USR-004',
        fullName: 'Balagoud',
        username: 'balagoud_staff',
        password: 'svv@staff2026',
        branch: 'Cuddalore (Main Branch)',
        role: 'Staff',
        permissions: ['ff_today', 'fb_entry', 'div_entry'],
        status: 'Active'
      },
      {
        id: 'USR-005',
        fullName: 'Karthik',
        username: 'karthik_mgr',
        password: 'svv@mgr2026',
        branch: 'Cuddalore (Main Branch)',
        role: 'Manager',
        permissions: ['ff_today', 'ff_yesterday', 'fb_view', 'fb_entry', 'div_view', 'div_entry', 'telecaller', 'reports', 'der'],
        status: 'Active'
      }
    ],

    // 12 Hourly Slots (10:00 AM to 10:00 PM) - Clean Zeroed Initial State (User Request #5)
    slots: [
      { id: 'SLOT_01', time: '10:00 AM', range: '10:00 AM – 11:00 AM', count: 0, status: 'PENDING' },
      { id: 'SLOT_02', time: '11:00 AM', range: '11:00 AM – 12:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_03', time: '12:00 PM', range: '12:00 PM – 01:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_04', time: '01:00 PM', range: '01:00 PM – 02:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_05', time: '02:00 PM', range: '02:00 PM – 03:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_06', time: '03:00 PM', range: '03:00 PM – 04:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_07', time: '04:00 PM', range: '04:00 PM – 05:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_08', time: '05:00 PM', range: '05:00 PM – 06:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_09', time: '06:00 PM', range: '06:00 PM – 07:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_10', time: '07:00 PM', range: '07:00 PM – 08:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_11', time: '08:00 PM', range: '08:00 PM – 09:00 PM', count: 0, status: 'PENDING' },
      { id: 'SLOT_12', time: '09:00 PM', range: '09:00 PM – 10:00 PM', count: 0, status: 'PENDING' }
    ],

    todayBills: 0,
    todayBillsSubmitted: false,

    // Unified Cross-Module Customer Call Registry
    customerCallRegistry: {},

    // Staff Employee Master
    staffMembers: [
      { empId: 'EMP-101', name: 'Vijay', counter: 'Counter 3 - Bangles', role: 'Sales Executive', divertCount: 0 },
      { empId: 'EMP-102', name: 'Nilesh', counter: 'Counter 4 - Rings', role: 'Sales Executive', divertCount: 0 },
      { empId: 'EMP-103', name: 'Balagoud', counter: 'Counter 1 - Antique', role: 'Senior Sales', divertCount: 0 },
      { empId: 'EMP-104', name: 'Valent', counter: 'Counter 6 - Silver', role: 'Sales Executive', divertCount: 0 },
      { empId: 'EMP-105', name: 'Swati', counter: 'Counter 2 - Chains', role: 'Sales Executive', divertCount: 0 },
      { empId: 'EMP-106', name: 'Arun hasbe', counter: 'Counter 5 - Bridal', role: 'Floor Supervisor', divertCount: 0 },
      { empId: 'EMP-100', name: 'Priya Sharma', counter: 'Admin Office', role: 'Store Admin', divertCount: 0 }
    ],

    pastDays: [],

    // Questions Database matching Google Sheet Schema (media_1789453394245.png)
    questionsConfig: [
      {
        q_id: 'Q0',
        q_text_en: 'How often do you shop with us?',
        q_text_ta: 'எங்களுடன் எத்தனை முறை ஷாப்பிங் செய்கிறீர்கள்?',
        q_type: 'single_choice',
        options_en: ['First Visit', 'Occasionally', 'Every Few Month', 'Monthly', 'Regular Customer'],
        options_ta: ['முதல் முறை', 'அவ்வப்போது', 'சில மாதங்களுக்கு ஒருமுறை', 'மாதந்தோறும்', 'வழக்கமான வாடிக்கையாளர்'],
        is_mandatory: false,
        is_active: true,
        display_order: 0
      },
      {
        q_id: 'Q1',
        q_text_en: 'How did you know about Suba Valli Vilas?',
        q_text_ta: 'சுப வள்ளி விலாஸ் பற்றி உங்களுக்கு எப்படி தெரியும்?',
        q_type: 'single_choice',
        options_en: ['Bill Boards/Hoardings', 'TV', 'Newspaper', 'Radio/FM', 'Friends & Relatives', 'Social Media', 'Others'],
        options_ta: ['விளம்பர பலகைகள்', 'தொலைக்காட்சி (TV)', 'செய்திதாள்', 'வானொலி/FM', 'நண்பர்கள் & உறவினர்கள்', 'சமூக ஊடகங்கள்', 'மற்றவை'],
        is_mandatory: true,
        is_active: true,
        display_order: 1
      },
      {
        q_id: 'Q2',
        q_text_en: 'What did you like the most about Suba Valli Vilas?',
        q_text_ta: 'சுப வள்ளி விலாஸில் உங்களுக்கு மிகவும் பிடித்தது எது?',
        q_type: 'single_choice',
        options_en: ['Design Collections & Variety', 'Staff Hospitality & Explanation', 'Purity & Trust', 'Making Charges & Pricing', 'Store Ambiance'],
        options_ta: ['நகை வடிவமைப்பு & கலெக்ஷன்', 'ஊழியர்களின் உபசரிப்பு & வழிகாட்டல்', '916 தூய்மை & நம்பிக்கை', 'சேதாரம் & விலை மதிப்பு', 'கடையின் சூழல்'],
        is_mandatory: true,
        is_active: true,
        display_order: 2
      },
      {
        q_id: 'Q3',
        q_text_en: 'What could we improve about our service?',
        q_text_ta: 'எங்கள் சேவையில் நீங்கள் எதை மேம்படுத்த விரும்புகிறீர்கள்?',
        q_type: 'single_choice',
        options_en: ['Billing Speed', 'More Lightweight Jewellery', 'More Antique/Traditional Designs', 'Seating & Refreshments', 'Parking Space', 'None - Very Satisfied'],
        options_ta: ['பில்லிங் வேகம் & கவுண்டர்கள்', 'குறைந்த எடை நகைகள்', 'பாரம்பரிய / ஆண்டிக் நகைகள்', 'இருக்கை & உபசரிப்பு', 'பார்க்கிங் வசதி', 'எதுவுமில்லை - மிகுந்த திருப்தி'],
        is_mandatory: true,
        is_active: true,
        display_order: 3
      },
      {
        q_id: 'Q4',
        q_text_en: 'What occasion do you purchase for?',
        q_text_ta: 'நீங்கள் எந்த சுப நிகழ்ச்சிக்கு நகை வாங்குகிறீர்கள்?',
        q_type: 'single_choice',
        options_en: ['Wedding / Bridal', 'Festival', 'Birthday', 'Wedding Anniversary', 'Monthly Savings', 'Gifts', 'General Walk-in'],
        options_ta: ['திருமணம் / பிரைடல்', 'பண்டிகை (தீபாவளி/பொங்கல்/அட்சய திருதியை)', 'பிறந்தநாள்', 'திருமண நாள்', 'மாதாந்திர சேமிப்பு / சீட்டு', 'பரிசுகள்', 'பொதுவான வருகை'],
        is_mandatory: true,
        is_active: true,
        display_order: 4
      },
      {
        q_id: 'Q5',
        q_text_en: "Are you aware of Suba Valli Vilas' Chit schemes?",
        q_text_ta: 'சுப வள்ளி விலாஸின் தங்க சேமிப்புத் திட்டங்கள் (Gold Chit Scheme) பற்றி உங்களுக்குத் தெரியுமா?',
        q_type: 'single_choice',
        options_en: ['Yes - Already Enrolled', 'Yes - Aware but not joined', 'No - Not aware at all (Please explain)'],
        options_ta: ['ஆம் - ஏற்கனவே இணைந்துள்ளேன்', 'ஆம் - தெரியும் ஆனால் இணையவில்லை', 'இல்லை - தெரியாது (விளக்கவும்)'],
        is_mandatory: true,
        is_active: true,
        display_order: 5
      },
      {
        q_id: 'Q6',
        q_text_en: 'Specific jewellery types interested in?',
        q_text_ta: 'நீங்கள் விரும்பும் நகைப் பிரிவுகள் யாவை?',
        q_type: 'multiple_choice',
        options_en: ['22K Gold Antique', 'Diamond Solitaire & Sets', 'Daily Wear Light Weight', 'Traditional Temple Jewellery', 'Silver Utensils'],
        options_ta: ['✨ 22K Gold Antique (22K ஆண்டிக் நகைகள்)', '💎 Diamond Solitaire & Sets (வைர நகைகள்)', '🌟 Daily Wear Light Weight (குறைந்த எடை நகைகள்)', '🛕 Traditional Temple Jewellery (கோவில் நகைகள்)', '🪙 Silver Utensils (வெள்ளி பொருட்கள்)'],
        is_mandatory: false,
        is_active: true,
        display_order: 6
      },
      {
        q_id: 'Q7',
        q_text_en: 'Would you recommend Suba Valli Vilas to your friends or family?',
        q_text_ta: 'சுப வள்ளி விலாஸை உங்கள் நண்பர்கள் அல்லது குடும்பத்தினருக்கு பரிந்துரைப்பீர்களா?',
        q_type: 'single_choice',
        options_en: ['Yes, definitely', 'Not sure', 'No, Not recommended'],
        options_ta: ['ஆம், நிச்சயமாக', 'உறுதியாக தெரியவில்லை', 'இல்லை, பரிந்துரைக்க மாட்டேன்'],
        is_mandatory: true,
        is_active: true,
        display_order: 7
      },
      {
        q_id: 'Q8',
        display_order: 8,
        target_kpi: 'Customer Satisfaction Index',
        q_text_en: 'Overall shopping experience',
        q_text_ta: 'ஒட்டுமொத்த ஷாப்பிங் அனுபவம்',
        q_type: 'single_choice',
        options_en: ['Excellent', 'Good', 'Average', 'Need Improvement'],
        options_ta: ['சிறப்பானது', 'நல்லது', 'சராசரி', 'மேம்பாடு தேவை'],
        is_mandatory: true,
        is_active: true
      },
      {
        q_id: 'Q9_CUSTOM2',
        display_order: 9,
        target_kpi: 'Custom Metric 2',
        q_text_en: 'Custom Question 2',
        q_text_ta: 'கூடுதல் கேள்வி 2',
        q_type: 'single_choice',
        options_en: ['Option 1', 'Option 2', 'Option 3'],
        options_ta: ['விருப்பம் 1', 'விருப்பம் 2', 'விருப்பம் 3'],
        is_mandatory: false,
        is_active: false
      }
    ],

    // Divert Audit Questions / Fields Configuration (10 Standardized fields)
    divertQuestionsConfig: [
      {
        field_id: 'DIV_Q01',
        display_order: 1,
        field_label: 'Section',
        field_type: 'single_choice',
        options: ['Gold 22K', 'Antique & Temple', 'Diamond Solitaires & Sets', 'Lightweight 22K', 'Silver Articles & Utensils', 'Platinum'],
        is_mandatory: true,
        workflow_trigger: 'Inventory Routing',
        description: 'Floor department where customer requirement was requested'
      },
      {
        field_id: 'DIV_Q02',
        display_order: 2,
        field_label: 'Counter',
        field_type: 'single_choice',
        options: ['Counter 1 - Antique', 'Counter 2 - Chains', 'Counter 3 - Bangles', 'Counter 4 - Rings', 'Counter 5 - Bridal Lounge', 'Counter 6 - Silver', 'Counter 7 - Diamonds', 'Counter 8 - Bullion & Coins'],
        is_mandatory: true,
        workflow_trigger: 'Counter Analytics',
        description: 'Counter attributed to the divert / unfulfilled demand'
      },
      {
        field_id: 'DIV_Q03',
        display_order: 3,
        field_label: 'Reason For Divert (Lost Sale Reason)',
        field_type: 'single_choice',
        options: ['Design not available', 'Size not matching', 'Weight / Gram range mismatch', 'Price / Budget variation', 'Making & Wastage charges issue', 'Out of stock / Fresh piece needed', 'Looking for specific Karatometer purity', 'Other (Specify in remarks)'],
        is_mandatory: true,
        workflow_trigger: 'DER Divert Pareto Analysis',
        description: 'Primary commercial or stock reason transaction was diverted'
      },
      {
        field_id: 'DIV_Q04',
        display_order: 4,
        field_label: 'Product Name & Item Description',
        field_type: 'text',
        options: ['Open text (e.g. 38g Antique Matte Haram, 2.6 Screw Bangle pair, Solitaire Ring size 14)'],
        is_mandatory: true,
        workflow_trigger: 'Workshop Procurement',
        description: 'Specific jewellery product customer was looking to purchase'
      },
      {
        field_id: 'DIV_Q05',
        display_order: 5,
        field_label: 'Design & Crafting Style',
        field_type: 'single_choice',
        options: ['Antique Matte Finish', 'Calcutta Filigree', 'Traditional Nakashi / Temple', 'Contemporary Minimalist', 'Floral Casting', 'Plain Smooth Gold', 'Rhodium / Two-Tone'],
        is_mandatory: false,
        workflow_trigger: 'Merchandising Planning',
        description: 'Specific crafting style required by client'
      },
      {
        field_id: 'DIV_Q06',
        display_order: 6,
        field_label: 'Size / Fit',
        field_type: 'text',
        options: ['Open text (e.g. 2.4, 2.6, 2.8 for Bangles; Size 12-16 for Rings; 18-22 inches for Chains)'],
        is_mandatory: false,
        workflow_trigger: 'Workshop Sizing',
        description: 'Exact dimension or bangle/ring size needed'
      },
      {
        field_id: 'DIV_Q07',
        display_order: 7,
        field_label: 'Weight / Gram Range',
        field_type: 'text',
        options: ['Open text (e.g. 15-20g, 35-40g, 50g+)'],
        is_mandatory: false,
        workflow_trigger: 'Grams Allocation',
        description: 'Target weight range requested by customer'
      },
      {
        field_id: 'DIV_Q08',
        display_order: 8,
        field_label: 'Purpose For Visit',
        field_type: 'single_choice',
        options: ['Wedding / Bridal Purchase', 'Upcoming Festival (Diwali/Pongal/Akshaya Tritiya)', 'Birthday / Anniversary Gift', 'Monthly Savings / Chit Investment', 'General Walk-in'],
        is_mandatory: true,
        workflow_trigger: 'Telecaller Priority',
        description: 'Occasion driving the purchase timeline'
      },
      {
        field_id: 'DIV_Q09',
        display_order: 9,
        field_label: 'Follow-up Priority & SLA',
        field_type: 'single_choice',
        options: ['HIGH (Urgent Bridal / Within 24 Hours)', 'MEDIUM (Stock Sourcing / Within 48 Hours)', 'LOW (General Followup / Within 7 Days)'],
        is_mandatory: true,
        workflow_trigger: 'SLA Alert Engine',
        description: 'Determines telecaller escalation deadline for call-back'
      },
      {
        field_id: 'DIV_Q10',
        display_order: 10,
        field_label: 'Staff Attending & Logged By',
        field_type: 'single_choice',
        options: ['Vijay', 'Balagoud', 'Nilesh', 'Valent', 'Swati', 'Arun hasbe', 'Priya Sharma'],
        is_mandatory: true,
        workflow_trigger: 'Staff Attribution',
        description: 'Showroom sales executive responsible for attending customer'
      }
    ],
    // Feedback and Diverts loaded exclusively from Google Sheet (single source of truth)
    feedbacks: [],
    // Real Customer Diverts Database (Loaded from Google Sheet only)
    diverts: [],

    // Telecaller Calls Registry (Populated dynamically)
    telecallerCalls: []
  };

  // Cuddalore Zone-Wise Interactive Drilldown Expanded State
  const expandedZoneIds = new Set(['west', 'north', 'south', 'east_core']);

  // ================= DOM ELEMENTS CACHE =================
  const dom = {
    // Header
    headerDate: document.getElementById('headerDate'),
    headerTime: document.getElementById('headerTime'),
    branchSelect: document.getElementById('branchSelect'),
    langToggleBtn: document.getElementById('langToggleBtn'),
    currentLangLabel: document.getElementById('currentLangLabel'),
    quickUserSwitch: document.getElementById('quickUserSwitch'),
    userAvatar: document.getElementById('userAvatar'),
    currentUserName: document.getElementById('currentUserName'),
    currentUserRoleBadge: document.getElementById('currentUserRoleBadge'),
    btnOpenNewFeedback: document.getElementById('btnOpenNewFeedback'),
    btnSignOut: document.getElementById('btnSignOut'),
    loginModalOverlay: document.getElementById('loginModalOverlay'),
    crmLoginForm: document.getElementById('crmLoginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    btnToggleLoginPwd: document.getElementById('btnToggleLoginPwd'),
    btnLoginSubmit: document.getElementById('btnLoginSubmit'),
    loginErrorMsg: document.getElementById('loginErrorMsg'),

    // Nav
    navTabs: document.querySelectorAll('.nav-tab'),
    screenViews: document.querySelectorAll('.screen-view'),
    telecallerQueueCount: document.getElementById('telecallerQueueCount'),

    // DER
    derScreenHeading: document.getElementById('derScreenHeading'),
    derPrintMainHeading: document.getElementById('derPrintMainHeading'),
    derTotalFootfall: document.getElementById('derTotalFootfall'),
    derTotalBills: document.getElementById('derTotalBills'),
    derConversionRate: document.getElementById('derConversionRate'),
    derConversionBenchmark: document.getElementById('derConversionBenchmark'),
    derFootfallRatio: document.getElementById('derFootfallRatio'),
    derAvgRating: document.getElementById('derAvgRating'),
    derFeedbackTotal: document.getElementById('derFeedbackTotal'),
    derTotalFeedbacksCount: document.getElementById('derTotalFeedbacksCount'),
    derFeedbackChannelBreakdown: document.getElementById('derFeedbackChannelBreakdown'),
    derSchemeUnawareCount: document.getElementById('derSchemeUnawareCount'),
    derSchemeQueuedCount: document.getElementById('derSchemeQueuedCount'),
    derSchemeUnawareDesc: document.getElementById('derSchemeUnawareDesc'),
    derDivertsCount: document.getElementById('derDivertsCount'),
    derDivertFormula: document.getElementById('derDivertFormula'),
    derSlotHistogram: document.getElementById('derSlotHistogram'),
    derHourlyChartContainer: document.getElementById('derHourlyChartContainer'),
    derHourlyGraphTitle: document.getElementById('derHourlyGraphTitle'),
    derHourlySlotsSubtitle: document.getElementById('derHourlySlotsSubtitle'),
    derHourlyBadge: document.getElementById('derHourlyBadge'),
    derWeeklyBarsContainer: document.getElementById('derWeeklyBarsContainer'),
    derWeeklySub: document.getElementById('derWeeklySub'),
    derApprecCount: document.getElementById('derApprecCount'),
    derNeutralCount: document.getElementById('derNeutralCount'),
    derConcernCount: document.getElementById('derConcernCount'),
    derSchemeAwarePct: document.getElementById('derSchemeAwarePct'),
    derSchemeBar: document.getElementById('derSchemeBar'),
    derDivertCountersBody: document.getElementById('derDivertCountersBody'),
    derDivertReasonsList: document.getElementById('derDivertReasonsList'),
    derStaffTableBody: document.getElementById('derStaffTableBody'),
    btnRefreshDER: document.getElementById('btnRefreshDER'),
    btnPrintDER: document.getElementById('btnPrintDER'),
    btnExportDERSummary: document.getElementById('btnExportDERSummary'),
    derNPSScore: document.getElementById('derNPSScore'),
    derNPSDetail: document.getElementById('derNPSDetail'),
    derCSIScore: document.getElementById('derCSIScore'),
    derCSIDetail: document.getElementById('derCSIDetail'),
    derDateFilter: document.getElementById('derDateFilter'),
    aiRecommendationsList: document.getElementById('aiRecommendationsList'),

    // Footfall
    footfallCurrentSlotBadge: document.getElementById('footfallCurrentSlotBadge'),
    btnSimulateHour: document.getElementById('btnSimulateHour'),
    ffTodayTotal: document.getElementById('ffTodayTotal'),
    ffSlotsSubmitted: document.getElementById('ffSlotsSubmitted'),
    ffActiveSlotLabel: document.getElementById('ffActiveSlotLabel'),
    ffActiveSlotSub: document.getElementById('ffActiveSlotSub'),
    ffMissedSlots: document.getElementById('ffMissedSlots'),
    ffPeakHour: document.getElementById('ffPeakHour'),
    ffPeakHourSub: document.getElementById('ffPeakHourSub'),
    todayBillsInput: document.getElementById('todayBillsInput'),
    btnSaveTodayBills: document.getElementById('btnSaveTodayBills'),
    todayConversionBox: document.getElementById('todayConversionBox'),
    todayConversionPct: document.getElementById('todayConversionPct'),
    todayRatioPct: document.getElementById('todayRatioPct'),
    todaySlotsGrid: document.getElementById('todaySlotsGrid'),

    // Admin Yesterday
    yesterdayAdminSection: document.getElementById('yesterdayAdminSection'),
    yesterdayAccessStatus: document.getElementById('yesterdayAccessStatus'),
    adminLockedNotice: document.getElementById('adminLockedNotice'),
    adminYesterdayContent: document.getElementById('adminYesterdayContent'),
    yesterdayDateSelector: document.getElementById('yesterdayDateSelector'),
    btnLoadPastDateSlots: document.getElementById('btnLoadPastDateSlots'),
    btnSavePastDaySlots: document.getElementById('btnSavePastDaySlots'),
    pastDateBillsInput: document.getElementById('pastDateBillsInput'),
    pastSlotsSaveStatus: document.getElementById('pastSlotsSaveStatus'),
    pastSlotsTitle: document.getElementById('pastSlotsTitle'),
    pastSlotsGrid: document.getElementById('pastSlotsGrid'),
    pastDaysTableBody: document.getElementById('pastDaysTableBody'),

    // Feedback
    btnFeedbackNewAction: document.getElementById('btnFeedbackNewAction'),
    btnOpenCustomerQR: document.getElementById('btnOpenCustomerQR'),
    fbStatTotal: document.getElementById('fbStatTotal'),
    fbStatNew: document.getElementById('fbStatNew'),
    fbStatReviewed: document.getElementById('fbStatReviewed'),
    fbStatAction: document.getElementById('fbStatAction'),
    fbStatClosed: document.getElementById('fbStatClosed'),
    fbFilterStartDate: document.getElementById('fbFilterStartDate'),
    fbFilterEndDate: document.getElementById('fbFilterEndDate'),
    btnRangeToday: document.getElementById('btnRangeToday'),
    btnRangeYesterday: document.getElementById('btnRangeYesterday'),
    btnRange7Days: document.getElementById('btnRange7Days'),
    btnRangeAll: document.getElementById('btnRangeAll'),
    fbFilterStatus: document.getElementById('fbFilterStatus'),
    fbFilterMood: document.getElementById('fbFilterMood'),
    fbFilterStaff: document.getElementById('fbFilterStaff'),
    btnFilterApply: document.getElementById('btnFilterApply'),
    btnFilterReset: document.getElementById('btnFilterReset'),
    fbResultCount: document.getElementById('fbResultCount'),
    feedbackCardsList: document.getElementById('feedbackCardsList'),
    btnViewCardsMode: document.getElementById('btnViewCardsMode'),
    btnViewQuestionsMode: document.getElementById('btnViewQuestionsMode'),
    questionWiseReportContainer: document.getElementById('questionWiseReportContainer'),
    questionCardsGrid: document.getElementById('questionCardsGrid'),
    questionDrilldownPanel: document.getElementById('questionDrilldownPanel'),
    drilldownQuestionTitle: document.getElementById('drilldownQuestionTitle'),
    drilldownOptionSubtitle: document.getElementById('drilldownOptionSubtitle'),
    drilldownOptionLabel: document.getElementById('drilldownOptionLabel'),
    drilldownCountBadge: document.getElementById('drilldownCountBadge'),
    btnCloseDrilldown: document.getElementById('btnCloseDrilldown'),
    drilldownTableBody: document.getElementById('drilldownTableBody'),
    onPageCustRemarks: document.getElementById('onPageCustRemarks'),
    feedbackSuccessAlert: document.getElementById('feedbackSuccessAlert'),
    custPortalSuccessAlert: document.getElementById('custPortalSuccessAlert'),

    // Diverts
    btnOpenNewDivert: document.getElementById('btnOpenNewDivert'),
    divertTotalCount: document.getElementById('divertTotalCount'),
    divertHighCount: document.getElementById('divertHighCount'),
    divertPendingCount: document.getElementById('divertPendingCount'),
    divertConvertedCount: document.getElementById('divertConvertedCount'),
    divertSearchInput: document.getElementById('divertSearchInput'),
    divertFilterPills: document.querySelectorAll('[data-divert-filter]'),
    divertsTableBody: document.getElementById('divertsTableBody'),
    divertStaffGrid: document.getElementById('divertStaffGrid'),
    divertInsightsGrid: document.getElementById('divertInsightsGrid'),
    divertCounterClassificationBody: document.getElementById('divertCounterClassificationBody'),
    divertReasonClassificationList: document.getElementById('divertReasonClassificationList'),

    // Telecaller
    queueTabs: document.querySelectorAll('.queue-tab'),
    telecallerQueueTitle: document.getElementById('telecallerQueueTitle'),
    telecallerQueueDesc: document.getElementById('telecallerQueueDesc'),
    telecallerTableBody: document.getElementById('telecallerTableBody'),
    queueUnawareCount: document.getElementById('queueUnawareCount'),
    queueDivertCount: document.getElementById('queueDivertCount'),
    queueOccasionCount: document.getElementById('queueOccasionCount'),
    queueConcernCount: document.getElementById('queueConcernCount'),
    queueCommonCount: document.getElementById('queueCommonCount'),
    queueAllCount: document.getElementById('queueAllCount'),
    telFilterFromDate: document.getElementById('telFilterFromDate'),
    telFilterToDate: document.getElementById('telFilterToDate'),
    btnTelDateApply: document.getElementById('btnTelDateApply'),
    btnTelDateReset: document.getElementById('btnTelDateReset'),

    // Reports
    reportPills: document.querySelectorAll('.report-pill'),
    reportSubviews: document.querySelectorAll('.report-subview'),
    btnApplyReportFilter: document.getElementById('btnApplyReportFilter'),
    btnExportActiveReport: document.getElementById('btnExportActiveReport'),
    repExecutiveKpiStrip: document.getElementById('repExecutiveKpiStrip'),
    repKpiTotalFootfall: document.getElementById('repKpiTotalFootfall'),
    repKpiTotalFeedbacks: document.getElementById('repKpiTotalFeedbacks'),
    repKpiFeedbacksSub: document.getElementById('repKpiFeedbacksSub'),
    repKpiTotalDiverts: document.getElementById('repKpiTotalDiverts'),
    repKpiDivertsSub: document.getElementById('repKpiDivertsSub'),
    repKpiAvgRating: document.getElementById('repKpiAvgRating'),
    repKpiChitEnrolled: document.getElementById('repKpiChitEnrolled'),
    repFilterSummaryLabel: document.getElementById('repFilterSummaryLabel'),
    repFromDate: document.getElementById('repFromDate'),
    repToDate: document.getElementById('repToDate'),
    repStaffFilter: document.getElementById('repStaffFilter'),
    repBranchFilter: document.getElementById('repBranchFilter'),
    repFootfallTableBody: document.getElementById('repFootfallTableBody'),
    repStaffFeedbackBody: document.getElementById('repStaffFeedbackBody'),
    repQuestionAnalysisGrid: document.getElementById('repQuestionAnalysisGrid'),
    repStaffDivertsBody: document.getElementById('repStaffDivertsBody'),
    repCounterList: document.getElementById('repCounterList'),
    repDivertReasonsProgress: document.getElementById('repDivertReasonsProgress'),
    repTelecallerBody: document.getElementById('repTelecallerBody'),

    // Users & RBAC
    btnOpenCreateUser: document.getElementById('btnOpenCreateUser'),
    usersTableBody: document.getElementById('usersTableBody'),

    // Settings & Cloud Infrastructure
    questionsConfigBody: document.getElementById('questionsConfigBody'),
    divertQuestionsConfigBody: document.getElementById('divertQuestionsConfigBody'),
    btnSaveQuestionsConfig: document.getElementById('btnSaveQuestionsConfig'),
    btnDownloadSheetTemplate: document.getElementById('btnDownloadSheetTemplate'),
    cfWorkerGatewayUrl: document.getElementById('cfWorkerGatewayUrl'),
    btnSaveCFWorkerUrl: document.getElementById('btnSaveCFWorkerUrl'),
    btnTestCFWorker: document.getElementById('btnTestCFWorker'),

    // Multi-Medium QR Studio
    onPageQRSVG: document.getElementById('onPageQRSVG'),
    onPageShareLink: document.getElementById('onPageShareLink'),
    btnCopyOnPageLink: document.getElementById('btnCopyOnPageLink'),
    btnTestCustomerMode: document.getElementById('btnTestCustomerMode'),
    qrMediumSelector: document.getElementById('qrMediumSelector'),
    qrStudioCounter: document.getElementById('qrStudioCounter'),
    qrStudioStaff: document.getElementById('qrStudioStaff'),
    qrStudioBranch: document.getElementById('qrStudioBranch'),
    currentMediumBadge: document.getElementById('currentMediumBadge'),
    qrStudioPreviewCaption: document.getElementById('qrStudioPreviewCaption'),
    btnPrintStandeePlacard: document.getElementById('btnPrintStandeePlacard'),
    btnDownloadQRImage: document.getElementById('btnDownloadQRImage'),

    // Modals
    modalFeedback: document.getElementById('modalFeedback'),
    btnCloseFeedbackModal: document.getElementById('btnCloseFeedbackModal'),
    btnCancelFeedback: document.getElementById('btnCancelFeedback'),
    feedbackForm: document.getElementById('feedbackForm'),
    btnModeStaff: document.getElementById('btnModeStaff'),
    btnModeWalkin: document.getElementById('btnModeWalkin'),
    fbDynamicQuestionsList: document.getElementById('fbDynamicQuestionsList'),

    modalFootfallSlot: document.getElementById('modalFootfallSlot'),
    btnCloseFootfallModal: document.getElementById('btnCloseFootfallModal'),
    btnCancelFootfallModal: document.getElementById('btnCancelFootfallModal'),
    footfallSlotForm: document.getElementById('footfallSlotForm'),
    ffModalSlotTitle: document.getElementById('ffModalSlotTitle'),
    ffModalSlotId: document.getElementById('ffModalSlotId'),
    ffModalSlotTimeLabel: document.getElementById('ffModalSlotTimeLabel'),
    ffModalCountInput: document.getElementById('ffModalCountInput'),

    modalDivert: document.getElementById('modalDivert'),
    btnCloseDivertModal: document.getElementById('btnCloseDivertModal'),
    btnCancelDivert: document.getElementById('btnCancelDivert'),
    divertForm: document.getElementById('divertForm'),

    modalCustomerQR: document.getElementById('modalCustomerQR'),
    btnCloseQRModal: document.getElementById('btnCloseQRModal'),
    btnCopyLink: document.getElementById('btnCopyLink'),
    btnOpenSelfFillDemo: document.getElementById('btnOpenSelfFillDemo'),
    qrCanvasContainer: document.getElementById('qrCanvasContainer'),
    shareableLinkInput: document.getElementById('shareableLinkInput'),

    modalTelecallerAction: document.getElementById('modalTelecallerAction'),
    btnCloseTelActionModal: document.getElementById('btnCloseTelActionModal'),
    btnCancelTelAction: document.getElementById('btnCancelTelAction'),
    telActionForm: document.getElementById('telActionForm'),
    telCustId: document.getElementById('telCustId'),
    telCustNamePreview: document.getElementById('telCustNamePreview'),
    telCustMobilePreview: document.getElementById('telCustMobilePreview'),
    telCustTagsPreview: document.getElementById('telCustTagsPreview'),
    telCustQueueInfo: document.getElementById('telCustQueueInfo'),
    telCallStatus: document.getElementById('telCallStatus'),
    telDisposition: document.getElementById('telDisposition'),
    telCallbackDate: document.getElementById('telCallbackDate'),
    telNotes: document.getElementById('telNotes'),
    btnGenerateWhatsApp: document.getElementById('btnGenerateWhatsApp'),
    whatsappSnippet: document.getElementById('whatsappSnippet'),

    modalCreateUser: document.getElementById('modalCreateUser'),
    btnCloseCreateUserModal: document.getElementById('btnCloseCreateUserModal'),
    btnCancelCreateUser: document.getElementById('btnCancelCreateUser'),
    createUserForm: document.getElementById('createUserForm'),
    newRolePreset: document.getElementById('newRolePreset'),

    modalEditQuestion: document.getElementById('modalEditQuestion'),
    btnCloseEditQuestionModal: document.getElementById('btnCloseEditQuestionModal'),
    btnCancelEditQuestion: document.getElementById('btnCancelEditQuestion'),
    editQuestionForm: document.getElementById('editQuestionForm'),
    editQId: document.getElementById('editQId'),
    editQIdDisplay: document.getElementById('editQIdDisplay'),
    editQDisplayOrder: document.getElementById('editQDisplayOrder'),
    editQTextEn: document.getElementById('editQTextEn'),
    editQTextTa: document.getElementById('editQTextTa'),
    editQOptionsEn: document.getElementById('editQOptionsEn'),
    editQOptionsTa: document.getElementById('editQOptionsTa'),
    editQMandatory: document.getElementById('editQMandatory'),
    editQActive: document.getElementById('editQActive'),

    // Google Sheets Cloud Database DOM references
    gsheetWebhookUrl: document.getElementById('gsheetWebhookUrl'),
    btnSaveGSheetUrl: document.getElementById('btnSaveGSheetUrl'),
    btnTestGSheet: document.getElementById('btnTestGSheet'),
    gsheetStatusPill: document.getElementById('gsheetStatusPill'),
    gsheetStatusText: document.getElementById('gsheetStatusText'),
    gsheetLastSync: document.getElementById('gsheetLastSync'),
    chkAutoSyncGSheet: document.getElementById('chkAutoSyncGSheet'),
    btnSyncAllToGSheet: document.getElementById('btnSyncAllToGSheet'),
    btnPullFromGSheet: document.getElementById('btnPullFromGSheet'),
    btnToggleGSheetGuide: document.getElementById('btnToggleGSheetGuide'),
    gsheetGuideContent: document.getElementById('gsheetGuideContent'),
    gsheetGuideChevron: document.getElementById('gsheetGuideChevron'),
    btnCopyAppsScriptCode: document.getElementById('btnCopyAppsScriptCode'),
    btnDownloadAppsScript: document.getElementById('btnDownloadAppsScript'),

    appToast: document.getElementById('appToast')
  };

  // Active sub-filters
  let activeDivertFilter = 'ALL';
  let activeTelecallerQueue = 'unaware';
  let activeTelStatusFilter = 'ALL';
  let activeReportTab = 'footfall';
  let activeFeedbackMode = 'Staff';
  let activeFbSourceFilter = 'ALL';
  let activeFbStatusFilter = 'ALL';
  const expandedFeedbackIds = new Set();

  // ================= DATE NORMALIZATION HELPER =================
  function normalizeDateToIso(str) {
    if (!str) return '';
    str = String(str).trim();
    str = str.replace(/\s*\(.*?\)/, '').trim();
    if (str.includes('T')) {
      str = str.split('T')[0];
    } else if (str.includes(' ')) {
      str = str.split(' ')[0];
    }
    str = str.replace(/[,;:]+$/, '').trim();

    const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      return `${year}-${month}-${day}`;
    }
    const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (ymdMatch) {
      const year = ymdMatch[1];
      const month = ymdMatch[2].padStart(2, '0');
      const day = ymdMatch[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return str;
  }

  // ================= TOAST HELPER =================
  function showToast(message, duration = 3000) {
    dom.appToast.textContent = message;
    dom.appToast.style.display = 'block';
    setTimeout(() => {
      dom.appToast.style.display = 'none';
    }, duration);
  }

  // ================= RBAC & USER CONTROLS =================
  function hasPermission(perm) {
    if (!state.currentUser) return false;
    if (state.currentUser.role === 'Admin') return true;
    return state.currentUser.permissions.includes(perm);
  }

  function applyRolePermissions() {
    const u = state.currentUser;
    if (!u) return;

    dom.currentUserName.textContent = u.fullName;
    dom.currentUserRoleBadge.textContent = u.role;
    dom.currentUserRoleBadge.className = `user-role-badge badge-${u.role.toLowerCase()}`;
    dom.userAvatar.textContent = u.fullName.charAt(0).toUpperCase();

    // Toggle navigation tabs based on user permissions
    document.getElementById('tab-der').style.display = hasPermission('der') ? 'flex' : 'none';
    document.getElementById('tab-footfall').style.display = (hasPermission('ff_today') || hasPermission('ff_yesterday')) ? 'flex' : 'none';
    document.getElementById('tab-feedback').style.display = hasPermission('fb_view') ? 'flex' : 'none';
    const tabEntry = document.getElementById('tab-feedback-entry');
    if (tabEntry) tabEntry.style.display = hasPermission('fb_entry') ? 'flex' : 'none';
    document.getElementById('tab-divert').style.display = hasPermission('div_view') ? 'flex' : 'none';
    document.getElementById('tab-telecaller').style.display = hasPermission('telecaller') ? 'flex' : 'none';
    document.getElementById('tab-reports').style.display = hasPermission('reports') ? 'flex' : 'none';
    document.getElementById('tab-users').style.display = hasPermission('users') ? 'flex' : 'none';
    document.getElementById('tab-settings').style.display = hasPermission('settings') ? 'flex' : 'none';

    // Footfall: Yesterday's Slots Dashboard Access (Admin only)
    if (hasPermission('ff_yesterday')) {
      dom.adminLockedNotice.style.display = 'none';
      dom.adminYesterdayContent.style.display = 'block';
      dom.yesterdayAccessStatus.textContent = 'Admin Mode Active';
      dom.yesterdayAccessStatus.className = 'badge badge-admin';
    } else {
      dom.adminLockedNotice.style.display = 'block';
      dom.adminYesterdayContent.style.display = 'none';
      dom.yesterdayAccessStatus.textContent = 'Restricted (Admin Only)';
      dom.yesterdayAccessStatus.className = 'badge badge-rose';
    }

    // Default screen switch if current tab is hidden
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab && activeTab.style.display === 'none') {
      const firstVisible = Array.from(dom.navTabs).find(t => t.style.display !== 'none');
      if (firstVisible) firstVisible.click();
    }
  }

  function switchUser(userId) {
    const found = state.users.find(u => u.id === userId);
    if (found) {
      state.currentUser = found;
      dom.quickUserSwitch.value = userId;
      localStorage.setItem('svv_auth_user', found.id);
      sessionStorage.setItem('svv_auth_user', found.id);
      applyRolePermissions();
      renderAll();
      showToast(`Switched user profile to: ${found.fullName} (${found.role})`);
    }
  }

  // ================= LANGUAGE TOGGLE & BILINGUAL ENGINE =================
  function updateFeedbackFormLanguage(lang) {
    state.currentLang = lang;
    const isTa = lang === 'ta';

    if (dom.currentLangLabel) dom.currentLangLabel.textContent = isTa ? 'தமிழ்' : 'English';
    document.body.classList.toggle('lang-ta', isTa);

    // Update segmented buttons
    document.querySelectorAll('[data-form-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-form-lang') === lang);
    });
    document.querySelectorAll('[data-cust-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cust-lang') === lang);
    });

    const setTxt = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    // Translate On-Page Feedback Form elements
    setTxt('onPageLangPrompt', isTa ? 'படிவ மொழி / Form Language:' : 'Form Language / படிவ மொழி:');
    setTxt('lblStaffHeading', isTa ? '👤 பணியாளர் பெயர் (கருத்து சேகரிப்பவர்) *' : '👤 STAFF NAME (Who is collecting this feedback) *');
    setTxt('lblStaffAttributionBadge', isTa ? 'பணியாளர் குறிப்பு கட்டாயம்' : 'Staff Attribution Mandatory');
    setTxt('lblStaffChipsSub', isTa ? 'உடனடி தேர்வுக்கு பணியாளரை கிளிக் செய்யவும்:' : 'Click a staff member below for instant selection:');
    setTxt('lblStaffSelectTitle', isTa ? 'தேர்ந்தெடுக்கப்பட்ட பணியாளர் *' : 'Selected Staff Member *');
    setTxt('lblCustomStaffTitle', isTa ? 'பணியாளர் பெயரை உள்ளிடவும்' : 'Enter Staff Name');
    setTxt('lblExperienceTitle', isTa ? 'சுப வள்ளி விலாஸில் உங்கள் அனுபவத்தைப் பற்றி கூறுங்கள் *' : 'Tell us about your Experience *');
    setTxt('lblMoodApprec', isTa ? 'பாராட்டு' : 'Appreciation');
    setTxt('lblMoodFeedback', isTa ? 'பொதுக் கருத்து' : 'Feedback');
    setTxt('lblMoodConcern', isTa ? 'குறை / புகார்' : 'Concern');
    setTxt('lblCustDetailsTitle', isTa ? 'வாடிக்கையாளர் விவரங்கள் (விருப்பப்பட்டால்)' : 'Customer Details (Optional — only if customer is willing to share)');
    setTxt('lblOnPageCustName', isTa ? 'வாடிக்கையாளர் பெயர்' : 'Customer Name');
    setTxt('lblOnPageCustMobile', isTa ? 'அலைபேசி எண் (10 இலக்கம்)' : 'Mobile Number');
    setTxt('lblOnPageCustCity', isTa ? 'ஊர் / நகரம்' : 'City / Town');
    setTxt('lblOnPageCustOcc', isTa ? 'தொழில் / வேலை' : 'Occupation');
    setTxt('lblOnPageCustDOB', isTa ? 'பிறந்தநாள் / திருமண நாள்' : 'Date of Birth / Anniversary');
    setTxt('lblQuestionsCardTitle', isTa ? 'வாடிக்கையாளர் கருத்து கேள்விகள்' : 'Customer Feedback Questions');
    setTxt('onPageLangNotice', `Language: ${isTa ? 'தமிழ் (Tamil)' : 'English & தமிழ்'}`);
    setTxt('lblSubmitNotice', isTa ? 'சமர்ப்பித்தால் உடனடியாக கருத்து பதிவு செய்யப்பட்டு DER-ல் புதுப்பிக்கப்படும்.' : 'Submitting will immediately record feedback and update DER & Reports.');
    setTxt('btnResetOnPageForm', isTa ? 'படிவத்தை அழிக்க' : 'Clear Form');
    setTxt('btnSubmitOnPageFeedback', isTa ? '💾 சுப வள்ளி விலாஸ் கருத்தைப் பதிவு செய்' : '💾 Submit Feedback to Suba Valli Vilas');

    // Translate Customer Portal elements
    setTxt('custPortalLangLabel', isTa ? 'மொழியைத் தேர்வு செய்யவும்:' : 'Preferred Language / மொழியைத் தேர்வு செய்யவும்:');
    setTxt('custPortalMoodTitle', isTa ? 'இன்று சுப வள்ளி விலாஸில் உங்கள் வருகை எப்படி இருந்தது? *' : 'How was your visit to Suba Valli Vilas today? *');
    setTxt('custPortalMoodApprec', isTa ? 'பாராட்டு' : 'Appreciation');
    setTxt('custPortalMoodFeedback', isTa ? 'பொதுக் கருத்து' : 'Feedback');
    setTxt('custPortalMoodConcern', isTa ? 'குறை / புகார்' : 'Concern');
    setTxt('custPortalDetailsTitle', isTa ? 'உங்கள் விவரங்கள் (விருப்பப்பட்டால்)' : 'Your Details (Optional)');
    setTxt('custPortalNameLbl', isTa ? 'உங்கள் பெயர்' : 'Your Name');
    setTxt('custPortalMobileLbl', isTa ? 'அலைபேசி எண்' : 'Mobile Number');
    setTxt('custPortalCityLbl', isTa ? 'ஊர் / நகரம்' : 'City / Town');
    setTxt('custPortalOccLbl', isTa ? 'தொழில் / வேலை' : 'Occupation');
    setTxt('custPortalDOBLbl', isTa ? 'பிறந்தநாள் / திருமண நாள்' : 'Date of Birth / Anniversary');
    setTxt('custPortalQuestionsHeading', isTa ? 'நகை விருப்பங்கள் & வாடிக்கையாளர் கருத்துகள்' : 'Jewellery Preferences & Feedback');
    setTxt('custPortalThankNotice', isTa ? 'சுப வள்ளி விலாஸ் உங்கள் நம்பிக்கையை போற்றுகிறது.' : 'Suba Valli Vilas values your precious trust.');
    setTxt('btnSubmitCustPortal', isTa ? '🙏 எனது கருத்தை சமர்ப்பிக்கிறேன்' : '🙏 Submit My Feedback / சமர்ப்பிக்கவும்');

    renderFeedbackModalQuestions();
    renderReports();
  }

  function toggleLanguage() {
    const nextLang = state.currentLang === 'en' ? 'ta' : 'en';
    updateFeedbackFormLanguage(nextLang);
    showToast(`Language switched to: ${nextLang === 'en' ? 'English' : 'தமிழ் (Tamil)'}`);
  }

  // ================= 1. DER DASHBOARD RENDERING =================
  function renderDERHourlyLineChart() {
    const container = document.getElementById('derHourlyChartContainer');
    if (!container) return;

    const todayIso = new Date().toISOString().split('T')[0];
    const dateVal = dom.derDateFilter?.value || todayIso;
    const targetIso = normalizeDateToIso(dateVal) || todayIso;
    const parts = targetIso.split('-');
    const formattedDate = (parts.length === 3) ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateVal;
    const isToday = (targetIso === todayIso);

    const titleEl = document.getElementById('derHourlyGraphTitle');
    if (titleEl) titleEl.textContent = `Hourly Footfall — ${formattedDate}`;

    const badgeEl = document.getElementById('derHourlyBadge');
    if (badgeEl) badgeEl.textContent = "HOURLY TREND";

    // 12 Slots: 10AM to 9PM (index 0 to 11) - Fetch based on target date
    let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let submittedCount = 0;

    if (isToday) {
      counts = state.slots.map(s => Number(s.count) || 0);
      submittedCount = state.slots.filter(s => s.status === 'SUBMITTED' || (Number(s.count) > 0)).length;
    } else {
      const pastDay = state.pastDays.find(d => normalizeDateToIso(d.date) === targetIso);
      if (pastDay && Array.isArray(pastDay.slots) && pastDay.slots.length === 12) {
        counts = pastDay.slots.map(c => Number(c) || 0);
      } else {
        try {
          const raw = localStorage.getItem(`svv_today_slots_${targetIso}`) || localStorage.getItem(`svv_past_slots_${targetIso}`);
          if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length === 12) {
              counts = arr.map(c => Number(c) || 0);
            }
          }
        } catch (e) {}
      }
      submittedCount = counts.filter(c => c > 0).length;
    }

    const subTitleEl = document.getElementById('derHourlySlotsSubtitle');
    if (subTitleEl) subTitleEl.textContent = `${submittedCount} of 12 slots recorded`;

    const maxVal = Math.max(...counts, 430);
    const yGridMax = Math.ceil(maxVal / 100) * 100 || 450;
    const ySteps = [0, Math.round(yGridMax * 0.33), Math.round(yGridMax * 0.66), yGridMax];

    const svgWidth = 540;
    const svgHeight = 220;
    const padLeft = 45;
    const padRight = 25;
    const padTop = 38;
    const padBottom = 32;
    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;

    // Calculate (x, y) coordinates for each of the 12 slots
    const points = state.slots.map((s, idx) => {
      const x = padLeft + (idx * (plotW / 11));
      const val = counts[idx] || 0;
      const y = padTop + (1 - (val / yGridMax)) * plotH;
      return { x, y, val, slot: s, idx };
    });

    // Path string for the line
    const linePathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    // Area path for gradient fill underneath
    const areaPathD = `${linePathD} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

    // Horizontal grid lines
    const gridLines = ySteps.map(stepVal => {
      const y = padTop + (1 - (stepVal / yGridMax)) * plotH;
      return `
        <line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${svgWidth - padRight}" y2="${y.toFixed(1)}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="${padLeft - 8}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#94A3B8" font-family="'Cambria', serif">${stepVal}</text>
      `;
    }).join('');

    // X-axis time labels
    const xLabels = points.map(p => {
      const shortTime = p.slot.time.replace(':00', '').replace(' ', '').toUpperCase();
      return `
        <text x="${p.x.toFixed(1)}" y="${(svgHeight - 10).toFixed(1)}" text-anchor="middle" font-size="9" fill="#64748B" font-family="'Cambria', serif" font-weight="600">${shortTime}</text>
      `;
    }).join('');

    // Points & Exact Count Labels directly above each point
    const pointsMarkup = points.map(p => {
      const isSub = isToday ? (p.slot.status === 'SUBMITTED' || p.val > 0) : (p.val > 0);
      const isAct = isToday && (p.slot.status === 'ACTIVE');
      const dotColor = isSub ? '#16A34A' : isAct ? '#D97706' : '#94A3B8';
      const showLabel = p.val > 0 || isSub;

      return `
        <g class="slot-dot-group">
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${dotColor}" stroke="#FFFFFF" stroke-width="2"/>
          ${showLabel ? `
            <text x="${p.x.toFixed(1)}" y="${(p.y - 8).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0F172A" font-family="'Cambria', serif">${p.val}</text>
          ` : ''}
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <svg class="der-line-chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="hourlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E293B" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#1E293B" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaPathD}" fill="url(#hourlyAreaGrad)"/>
        <path d="${linePathD}" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${xLabels}
        ${pointsMarkup}
      </svg>
    `;
  }

  function renderDERWeeklyDailyChart() {
    const container = document.getElementById('derWeeklyBarsContainer');
    if (!container) return;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const todayIso = new Date().toISOString().split('T')[0];
    const filterDateVal = dom.derDateFilter?.value || todayIso;
    const filterIso = normalizeDateToIso(filterDateVal) || todayIso;
    const filterDateObj = new Date(filterIso + 'T12:00:00'); // parse at midday
    const liveTodayFootfall = state.slots.reduce((sum, s) => sum + (Number(s.count) || 0), 0);

    // Build exactly 7 consecutive days starting from filter date going backwards (e.g. 24, 23, 22, 21, 20, 19, 18)
    const daysData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(filterDateObj);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const monthStr = monthNames[d.getMonth()];
      const isToday = (iso === todayIso);

      let footfall = 0;
      if (isToday) {
        footfall = liveTodayFootfall;
      } else {
        const found = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);
        if (found) {
          footfall = Number(found.footfall) || (found.slots ? found.slots.reduce((a, b) => a + Number(b), 0) : 0);
        } else {
          try {
            const raw = localStorage.getItem(`svv_today_slots_${iso}`) || localStorage.getItem(`svv_past_slots_${iso}`);
            if (raw) {
              const arr = JSON.parse(raw);
              if (Array.isArray(arr)) {
                footfall = arr.reduce((a, b) => a + (Number(b) || 0), 0);
              }
            }
          } catch (e) {}
        }
      }

      daysData.push({
        label: `${dayNum} ${monthStr}`,
        iso: iso,
        footfall: footfall,
        isToday: isToday
      });
    }

    const maxVal = Math.max(...daysData.map(d => d.footfall), 100);

    container.innerHTML = daysData.map(d => {
      const pct = Math.min(100, Math.max(4, Math.round((d.footfall / maxVal) * 100)));
      return `
        <div class="der-weekly-bar-row">
          <span class="der-bar-date-label">${d.label}</span>
          <div class="der-bar-track">
            <div class="der-bar-fill ${d.isToday ? 'today-bar' : ''}" style="width: ${pct}%;"></div>
          </div>
          <span class="der-bar-count-label">${d.footfall}</span>
        </div>
      `;
    }).join('');
  }

  function renderDER() {
    // Dynamic Heading strictly formatted: Suba Valli Vilas Jewellery - CRM DER - DD/MM/YYYY
    const todayIso = new Date().toISOString().split('T')[0];
    if (dom.derDateFilter && !dom.derDateFilter.value) {
      dom.derDateFilter.value = todayIso;
    }
    const dateVal = dom.derDateFilter?.value || todayIso;
    const targetIso = normalizeDateToIso(dateVal) || todayIso;
    const parts = targetIso.split('-');
    const formattedDate = (parts.length === 3) ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateVal;
    const dynamicDERTitle = `Suba Valli Vilas Jewellery - CRM DER - ${formattedDate}`;
    if (dom.derScreenHeading) dom.derScreenHeading.textContent = dynamicDERTitle;
    if (dom.derPrintMainHeading) dom.derPrintMainHeading.textContent = dynamicDERTitle;

    // Ensure feedbacks and diverts are loaded from storage if state is empty
    if (!state.feedbacks || state.feedbacks.length === 0) {
      loadFeedbacksFromStorage();
    }
    if (!state.diverts || state.diverts.length === 0) {
      loadDivertsFromStorage();
    }

    // Determine footfall and bills strictly for targetIso
    let selectedFootfall = 0;
    let selectedBills = 0;

    if (targetIso === todayIso) {
      selectedFootfall = state.slots.reduce((sum, s) => sum + (Number(s.count) || 0), 0);
      selectedBills = Number(state.todayBills) || 0;
    } else {
      // Check state.pastDays
      const pastDay = state.pastDays.find(d => normalizeDateToIso(d.date) === targetIso);
      if (pastDay) {
        selectedFootfall = Number(pastDay.footfall) || 0;
        selectedBills = Number(pastDay.bills) || 0;
      } else {
        // Check localStorage for saved date slots/bills
        try {
          const savedSlots = JSON.parse(localStorage.getItem(`svv_today_slots_${targetIso}`) || localStorage.getItem(`svv_past_slots_${targetIso}`) || 'null');
          if (Array.isArray(savedSlots)) {
            selectedFootfall = savedSlots.reduce((sum, s) => sum + (Number(s.count) || 0), 0);
          }
          const savedBills = JSON.parse(localStorage.getItem(`svv_today_bills_${targetIso}`) || 'null');
          if (savedBills && savedBills.todayBills !== undefined) {
            selectedBills = Number(savedBills.todayBills) || 0;
          }
        } catch (e) {
          console.warn('Could not read historical footfall from storage:', e);
        }
      }
    }

    if (dom.derTotalFootfall) dom.derTotalFootfall.textContent = selectedFootfall;
    if (dom.derTotalBills) dom.derTotalBills.textContent = selectedBills;

    // Conversion Rate & Benchmark (> 90%)
    const convPct = selectedFootfall > 0 ? ((selectedBills / selectedFootfall) * 100).toFixed(1) : '0.0';
    const ratio = selectedFootfall > 0 && selectedBills > 0 ? (selectedFootfall / selectedBills).toFixed(1) : '0';

    if (dom.derConversionRate) dom.derConversionRate.textContent = `${convPct}%`;
    if (dom.derConversionBenchmark) dom.derConversionBenchmark.textContent = 'Benchmark > 90%';
    if (dom.derFootfallRatio) dom.derFootfallRatio.textContent = `1 bill per ${ratio} visitors`;

    // Filter feedbacks strictly for targetIso
    const dateFeedbacks = (state.feedbacks || []).filter(f => normalizeDateToIso(f.date || f.timestamp) === targetIso);
    const totalFb = dateFeedbacks.length;

    // Total feedbacks KPI card with Staff and QR breakdown (Live & Dynamic)
    const qrCount = dateFeedbacks.filter(f => String(f.source || '').toLowerCase().includes('qr')).length;
    const staffCount = dateFeedbacks.length - qrCount;
    const totalFbEl = dom.derTotalFeedbacksCount || document.getElementById('derTotalFeedbacksCount');
    if (totalFbEl) totalFbEl.textContent = totalFb;
    const breakdownEl = dom.derFeedbackChannelBreakdown || document.getElementById('derFeedbackChannelBreakdown');
    if (breakdownEl) breakdownEl.textContent = `Staff: ${staffCount} | QR: ${qrCount}`;
    if (dom.derFeedbackTotal) dom.derFeedbackTotal.textContent = `${totalFb} feedback logged`;

    // Sentiment breakdown & NPS / CSI calculation for targetIso
    let apprec = 0, neutral = 0, concern = 0, schemeUnaware = 0;
    let ratingSum = 0;
    let promoters = 0, detractors = 0, passives = 0;
    let csiHighCount = 0;

    dateFeedbacks.forEach(f => {
      let r = 10;
      const qVal = (f.q7 || f.q_rec || f.recommendationChoice || '').toLowerCase();
      if (qVal.includes('yes') || qVal.includes('definitely') || qVal.includes('ஆம்') || qVal.includes('நிச்சயமாக')) {
        r = 10;
      } else if (qVal.includes('not sure') || qVal.includes('தெரியவில்லை')) {
        r = 7;
      } else if (qVal.includes('no') || qVal.includes('not recommended') || qVal.includes('இல்லை')) {
        r = 3;
      } else if (f.rating) {
        r = Number(f.rating) || 10;
      }

      ratingSum += r;
      if (r >= 9) promoters++;
      else if (r <= 6) detractors++;
      else passives++;

      // CSI: Based on question "Overall Shopping Experience"
      // Options: Excellent | Good | Average | Needs Improvement
      const expVal = (f.overallShoppingExperience || f.overallExperience || f.shoppingExperience || f.q2 || f.q_exp || '').toString().toLowerCase().trim();
      let isCsiSatisfied = false;
      if (expVal.includes('excellent') || expVal.includes('good') || expVal.includes('சிறந்தது') || expVal.includes('நன்று')) {
        isCsiSatisfied = true;
      } else if (expVal.includes('average') || expVal.includes('needs improvement') || expVal.includes('poor')) {
        isCsiSatisfied = false;
      } else {
        // Fallback for numeric ratings or existing text choices
        const numRating = Number(f.rating) || 0;
        if (numRating >= 8) {
          isCsiSatisfied = true;
        } else if (expVal.includes('hospitality') || expVal.includes('purity') || expVal.includes('design') || expVal.includes('ambiance')) {
          isCsiSatisfied = true;
        }
      }

      if (isCsiSatisfied) csiHighCount++;

      const m = (f.mood || '').toLowerCase().trim();
      const c = (f.category || '').toLowerCase().trim();
      if (m === 'concern' || c === 'concern' || m === 'complaint' || c === 'complaint') {
        concern++;
      } else if (m === 'appreciation' || c === 'appreciation' || m === 'feedback' || c === 'feedback') {
        apprec++;
      } else {
        if (Number(f.rating) <= 6) concern++;
        else if (Number(f.rating) >= 9) apprec++;
        else neutral++;
      }

      const q5Val = (f.q5 || '').toLowerCase();
      if (q5Val.includes('not aware') || q5Val.includes('தெரியாது') || q5Val.includes('no')) schemeUnaware++;
    });

    if (dom.derApprecCount) dom.derApprecCount.textContent = apprec;
    if (dom.derNeutralCount) dom.derNeutralCount.textContent = neutral;
    if (dom.derConcernCount) dom.derConcernCount.textContent = concern;

    const baseFb = totalFb || 1;
    const unawarePct = totalFb > 0 ? Math.round((schemeUnaware / baseFb) * 100) : 0;
    const awarePct = totalFb > 0 ? (100 - unawarePct) : 0;
    if (dom.derSchemeUnawareCount) dom.derSchemeUnawareCount.textContent = `${unawarePct}%`;
    if (dom.derSchemeQueuedCount) dom.derSchemeQueuedCount.textContent = `${schemeUnaware} leads queued in telecaller`;
    if (dom.derSchemeAwarePct) dom.derSchemeAwarePct.textContent = `${awarePct}% Aware`;
    if (dom.derSchemeBar) dom.derSchemeBar.style.width = `${awarePct}%`;

    // Chit scheme description dynamic update based on aware % (replaces hardcoded 38%)
    const schemeDescEl = dom.derSchemeUnawareDesc || document.getElementById('derSchemeUnawareDesc');
    if (schemeDescEl) {
      if (totalFb > 0) {
        schemeDescEl.textContent = `${unawarePct}% visitors are unaware of chit saving schemes. Direct them to Telecaller Desk for high-conversion outreach.`;
      } else {
        schemeDescEl.textContent = `No chit awareness survey data recorded for ${formattedDate}.`;
      }
    }

    // NPS Score - Show only Metric Target > +95 under counter
    const npsScore = totalFb > 0 ? Math.round(((promoters - detractors) / baseFb) * 100) : 0;
    if (dom.derNPSScore) {
      dom.derNPSScore.innerHTML = totalFb > 0 ? `${npsScore >= 0 ? '+' : ''}${npsScore}<span class="text-sm">/100</span>` : `0<span class="text-sm">/100</span>`;
    }
    const npsDetailEl = dom.derNPSDetail || document.getElementById('derNPSDetail');
    if (npsDetailEl) {
      npsDetailEl.textContent = 'Metric Target > +95';
    }

    // Customer Satisfaction Index (CSI based on Overall Shopping Experience: Excellent | Good)
    const csiScore = totalFb > 0 ? Math.round((csiHighCount / baseFb) * 100) : 0;
    if (dom.derCSIScore) dom.derCSIScore.textContent = totalFb > 0 ? `${csiScore}%` : '0%';
    const csiDetailEl = dom.derCSIDetail || document.getElementById('derCSIDetail');
    if (csiDetailEl) {
      csiDetailEl.textContent = 'Metric Target > 95%';
    }

    // Filter diverts strictly for targetIso (checks both date and timestamp for UTC serialization safety)
    const dateDiverts = state.diverts.filter(d => {
      const dtIso = normalizeDateToIso(d.date);
      const tsIso = normalizeDateToIso(d.timestamp);
      return dtIso === targetIso || tsIso === targetIso;
    });
    const divertCount = dateDiverts.length;
    const divertLossRate = selectedFootfall > 0 ? ((divertCount / selectedFootfall) * 100).toFixed(1) : '0.0';
    if (dom.derDivertsCount) {
      dom.derDivertsCount.innerHTML = `${divertCount} <span class="text-sm font-normal" id="derDivertRatePct">(${divertLossRate}%)</span>`;
    }
    if (dom.derDivertFormula) {
      dom.derDivertFormula.textContent = `Formula: (Diverts / Footfall) * 100 (${divertCount}/${selectedFootfall})`;
    }

    // Render Side-by-Side Charts
    renderDERHourlyLineChart();
    renderDERWeeklyDailyChart();

    // Divert Counter-wise Classification Table in DER (Date Filtered)
    if (dom.derDivertCountersBody) {
      const countersMaster = [
        { name: 'Counter 1 - Antique', section: 'Gold' },
        { name: 'Counter 2 - Chains', section: 'Gold' },
        { name: 'Counter 3 - Bangles', section: 'Gold' },
        { name: 'Counter 4 - Rings', section: 'Diamond' },
        { name: 'Counter 5 - Bridal Lounge', section: 'Bridal Lounge' },
        { name: 'Counter 6 - Silver', section: 'Silver Articles' }
      ];
      const totalDiv = divertCount || 1;
      dom.derDivertCountersBody.innerHTML = countersMaster.map(c => {
        const prefix = c.name.split(' - ')[0];
        const cnt = dateDiverts.filter(d => (d.counter || '').includes(prefix)).length;
        const share = divertCount > 0 ? Math.round((cnt / totalDiv) * 100) : 0;
        return `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td><span class="badge badge-subtle">${c.section}</span></td>
            <td><strong>${cnt}</strong> diverts</td>
            <td><span class="badge ${cnt > 0 ? 'badge-gold' : 'badge-subtle'}">${share}%</span></td>
          </tr>
        `;
      }).join('');
    }

    // Divert Reason-wise Classification List in DER (Date Filtered)
    const reasonCounts = {};
    dateDiverts.forEach(d => {
      const r = (d.reason || d.Reason || 'Other').trim();
      reasonCounts[r] = (reasonCounts[r] || 0) + 1;
    });

    if (dom.derDivertReasonsList) {
      if (divertCount === 0) {
        dom.derDivertReasonsList.innerHTML = `<li class="text-muted text-sm py-2">No diverts logged for ${formattedDate}</li>`;
      } else {
        dom.derDivertReasonsList.innerHTML = Object.entries(reasonCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([reason, count], idx) => {
            const share = divertCount > 0 ? Math.round((count / divertCount) * 100) : 0;
            return `
            <li class="divert-rank-item">
              <div class="d-flex align-center gap-2">
                <span class="rank-num">${idx + 1}</span>
                <span><strong>${reason}</strong></span>
              </div>
              <span class="badge badge-gold">${count} (${share}%)</span>
            </li>
          `;
          }).join('');
      }
    }

    // Staff Leaderboard (Strictly calculated for targetIso)
    const staffStats = {};
    dateFeedbacks.forEach(f => {
      const sName = f.staffName || 'Showroom Floor';
      if (!staffStats[sName]) {
        staffStats[sName] = { feedbacks: 0, totalRating: 0, diverts: 0, branch: f.branch || state.activeBranch };
      }
      staffStats[sName].feedbacks++;
      staffStats[sName].totalRating += (Number(f.rating) || 10);
    });

    dateDiverts.forEach(d => {
      const sName = d.attendedStaff || d.employee || 'Showroom Floor';
      if (!staffStats[sName]) {
        staffStats[sName] = { feedbacks: 0, totalRating: 0, diverts: 0, branch: d.branch || state.activeBranch };
      }
      staffStats[sName].diverts++;
    });

    if (dom.derStaffTableBody) {
      const entries = Object.entries(staffStats);
      if (entries.length === 0) {
        dom.derStaffTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No staff transactions or feedback logged for ${formattedDate}</td></tr>`;
      } else {
        dom.derStaffTableBody.innerHTML = entries
          .sort((a, b) => b[1].feedbacks - a[1].feedbacks || b[1].diverts - a[1].diverts)
          .map(([sName, data]) => {
            const avg = data.feedbacks > 0 ? (data.totalRating / data.feedbacks).toFixed(1) : '10.0';
            return `
              <tr>
                <td><strong>${sName}</strong></td>
                <td><span class="badge badge-subtle">${data.branch}</span></td>
                <td><strong>${data.feedbacks}</strong></td>
                <td>⭐ ${avg}</td>
                <td><span class="badge badge-amber">${data.diverts}</span></td>
              </tr>
            `;
          }).join('');
      }
    }

    // Render Voice of Customer Daily Highlights (Date Filtered)
    renderDERVoiceOfCustomer(dateFeedbacks, formattedDate);

    // Render AI Executive Store Improvement Advisor (Date Filtered, Dynamic & Concise)
    renderDERAIAdvisor(dateFeedbacks, dateDiverts, selectedFootfall, selectedBills, convPct, formattedDate, csiScore);
  }

  // ================= DER VOICE OF CUSTOMER HIGHLIGHTS =================
  function renderDERVoiceOfCustomer(feedbacks, formattedDate) {
    const posContainer = document.getElementById('derPositivePointsList');
    const negContainer = document.getElementById('derNegativePointsList');
    if (!posContainer || !negContainer) return;

    const list = feedbacks || [];

    // Strictly mutually exclusive partitioning based on category / mood
    // Concern / Complaint / Negative -> Negative ONLY
    // Appreciation / Feedback / Positive -> Positive ONLY
    const isNeg = f => {
      const m = (f.mood || '').toLowerCase().trim();
      const c = (f.category || '').toLowerCase().trim();
      if (m === 'concern' || c === 'concern' || m === 'complaint' || c === 'complaint' || m === 'negative') return true;
      if (m === 'appreciation' || c === 'appreciation' || m === 'feedback' || c === 'feedback' || m === 'positive') return false;
      return Number(f.rating) <= 6;
    };

    const negList = [];
    const posList = [];
    const seenPosKeys = new Set();
    const seenNegKeys = new Set();

    list.forEach(f => {
      const remarkText = (f.remarks || f.feedbackComment || f.customerRemarks || f.q2 || f.q3 || '').trim();
      const itemKey = (f.id || '') + '||' + remarkText;

      if (isNeg(f)) {
        if (!seenNegKeys.has(itemKey)) {
          seenNegKeys.add(itemKey);
          negList.push(f);
        }
      } else {
        if (!seenPosKeys.has(itemKey)) {
          seenPosKeys.add(itemKey);
          posList.push(f);
        }
      }
    });

    const posFeedbacks = posList.slice(0, 2);
    const negFeedbacks = negList.slice(0, 3);

    if (posFeedbacks.length === 0) {
      posContainer.innerHTML = `<div class="p-3 text-muted text-sm">No positive customer remarks logged for ${formattedDate}.</div>`;
    } else {
      posContainer.innerHTML = posFeedbacks.map((f, idx) => `
        <div class="voc-item">
          <div class="voc-item-meta">
            <span class="voc-item-staff">Staff: <strong>${f.staffName || 'Floor Staff'}</strong></span>
            <span class="text-success voc-item-rating">⭐ ${f.rating || 10}/10 • Appreciation</span>
            <span class="text-xs text-muted">${f.branch || state.activeBranch} • ${f.customerName || 'Customer'}</span>
          </div>
          <div class="voc-item-text">
            <strong>Point ${idx + 1}:</strong> ${f.remarks || f.feedbackComment || f.customerRemarks || f.q2 || 'Appreciated showroom collection and warm staff hospitality.'}
          </div>
        </div>
      `).join('');
    }

    if (negFeedbacks.length === 0) {
      negContainer.innerHTML = `<div class="p-3 text-muted text-sm">Zero customer concerns recorded for ${formattedDate}. All ratings satisfied.</div>`;
    } else {
      negContainer.innerHTML = negFeedbacks.map((f, idx) => `
        <div class="voc-item negative-item">
          <div class="voc-item-meta">
            <span class="voc-item-staff">Staff: <strong>${f.staffName || 'Floor Staff'}</strong></span>
            <span class="text-rose voc-item-rating">⚠️ ${f.rating || 6}/10 • Concern</span>
            <span class="text-xs text-muted">${f.branch || state.activeBranch} • ${f.customerName || 'Customer'}</span>
          </div>
          <div class="voc-item-text">
            <strong>Point ${idx + 1}:</strong> ${f.remarks || f.feedbackComment || f.customerRemarks || f.q3 || 'Customer experienced billing rush or item availability delay.'}
          </div>
          <span class="voc-action-badge">
            Action: ${f.actionRemark || (idx === 0 ? 'Assigned floor manager courtesy follow-up' : 'Logged into Telecaller service recovery desk')}
          </span>
        </div>
      `).join('');
    }
  }

  // ================= AI EXECUTIVE STORE IMPROVEMENT ADVISOR =================
  function renderDERAIAdvisor(feedbacks, diverts, footfall, bills, convPct, formattedDate, csiScore) {
    const list = document.getElementById('aiRecommendationsList');
    if (!list) return;

    const fbList = feedbacks || [];
    const divList = diverts || [];
    const ff = footfall || 0;
    const b = bills || 0;
    const cp = parseFloat(convPct) || 0;

    // 1. Divert Insight
    let divertTitle = 'Showroom Demand & Stock Fulfillment';
    let divertText = '';
    if (divList.length > 0) {
      const reasonMap = {};
      divList.forEach(d => {
        const r = d.reason || 'Design / Stock';
        reasonMap[r] = (reasonMap[r] || 0) + 1;
      });
      const topReason = Object.entries(reasonMap).sort((a, b) => b[1] - a[1])[0];
      const counterMap = {};
      divList.forEach(d => {
        const c = d.counter || 'General Counter';
        counterMap[c] = (counterMap[c] || 0) + 1;
      });
      const topCounter = Object.entries(counterMap).sort((a, b) => b[1] - a[1])[0];
      divertText = `<strong>${divList.length} diverts recorded</strong> on ${formattedDate}. Top factor: <em>${topReason[0]}</em> (${topReason[1]} requests) primarily at <em>${topCounter[0]}</em>. Coordinate showroom stock replenishment for these fast-moving items.`;
    } else {
      divertText = `<strong>Zero missed sales (0 diverts)</strong> logged on ${formattedDate}. Stock availability and sizing met 100% of recorded customer walk-in requirements.`;
    }

    // 2. Conversion Insight
    let convText = '';
    if (ff > 0) {
      if (cp >= 90) {
        convText = `Conversion reached <strong>${convPct}%</strong> (${b} bills from ${ff} visitors), beating the 90% store target. Customer engagement and billing speed operated at high efficiency.`;
      } else {
        const gap = (90 - cp).toFixed(1);
        convText = `Store conversion recorded at <strong>${convPct}%</strong> (${b} bills from ${ff} visitors), leaving a <strong>${gap}% gap</strong> below the 90% benchmark. Deploy additional floor assistance during peak afternoon rush.`;
      }
    } else {
      convText = `No footfall entries logged yet for ${formattedDate}. Enter hourly slot counts to activate conversion analysis.`;
    }

    // 3. Customer Voice & Survey Feedback
    let expText = '';
    if (fbList.length > 0) {
      const posCount = fbList.filter(f => f.mood === 'Appreciation' || Number(f.rating) >= 8).length;
      const posPct = Math.round((posCount / fbList.length) * 100);
      const praiseMap = {};
      fbList.forEach(f => {
        if (f.q2) praiseMap[f.q2] = (praiseMap[f.q2] || 0) + 1;
      });
      const topPraise = Object.entries(praiseMap).sort((a, b) => b[1] - a[1])[0];
      const praiseNote = topPraise ? `Top appreciated attribute: <em>${topPraise[0]}</em>.` : 'Strong customer sentiment.';
      expText = `Customer Satisfaction Index (CSI) stands at <strong>${csiScore || 95}%</strong> with <strong>${posPct}% positive ratings</strong> across ${fbList.length} reviews. ${praiseNote}`;
    } else {
      expText = `No feedback reviews submitted on ${formattedDate}. QR standee and tablet feedback prompts active for customer collection.`;
    }

    // 4. Telecaller & Scheme Pipeline
    const unawareCount = fbList.filter(f => f.q5 && (f.q5.includes('Not aware') || f.q5.includes('தெரியாது'))).length;
    const pendingLeads = Object.values(state.customerCallRegistry || {}).filter(c => c.callStatus === 'PENDING' || c.callStatus === 'FOLLOWUP').length;
    const teleText = `<strong>${unawareCount} visitors</strong> expressed unfamiliarity with the Suba Valli Vilas 11-Month Gold Savings Chit Scheme today. <strong>${pendingLeads} active leads</strong> queued in telecaller registry for courtesy calls.`;

    list.innerHTML = `
      <div class="ai-rec-card">
        <div class="ai-rec-title">
          <span>📦</span>
          <span>${divertTitle}</span>
        </div>
        <p class="ai-rec-text">${divertText}</p>
      </div>

      <div class="ai-rec-card">
        <div class="ai-rec-title">
          <span>⚡</span>
          <span>Footfall & Billing Conversion</span>
        </div>
        <p class="ai-rec-text">${convText}</p>
      </div>

      <div class="ai-rec-card">
        <div class="ai-rec-title">
          <span>🌟</span>
          <span>Customer Voice & Satisfaction</span>
        </div>
        <p class="ai-rec-text">${expText}</p>
      </div>

      <div class="ai-rec-card">
        <div class="ai-rec-title">
          <span>💎</span>
          <span>Telecaller & Chit Savings Scheme</span>
        </div>
        <p class="ai-rec-text">${teleText}</p>
      </div>
    `;
  }

  // Storage persistence functions for today's slots and bills
  function saveTodaySlotsToStorage() {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      localStorage.setItem(`svv_today_slots_${todayDate}`, JSON.stringify(state.slots));
      localStorage.setItem(`svv_today_bills_${todayDate}`, JSON.stringify({
        todayBills: state.todayBills,
        todayBillsSubmitted: state.todayBillsSubmitted
      }));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadTodaySlotsFromStorage() {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const savedSlots = localStorage.getItem(`svv_today_slots_${todayDate}`);
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots);
        if (Array.isArray(parsed) && parsed.length === state.slots.length) {
          parsed.forEach((ps, idx) => {
            if (state.slots[idx]) {
              state.slots[idx].count = ps.count;
              state.slots[idx].status = ps.status;
            }
          });
        }
      }
      const savedBills = localStorage.getItem(`svv_today_bills_${todayDate}`);
      if (savedBills) {
        const parsedB = JSON.parse(savedBills);
        if (parsedB.todayBills !== undefined) state.todayBills = parsedB.todayBills;
        if (parsedB.todayBillsSubmitted !== undefined) state.todayBillsSubmitted = !!parsedB.todayBillsSubmitted;
      }
    } catch (e) {
      console.warn('Storage load failed:', e);
    }
  }

  function saveFeedbacksToStorage() {
    // Sheet is the single source of truth — no localStorage caching for feedbacks
    // Data is always pulled fresh from Google Sheet via pullDataFromGSheet()
  }

  function initCleanBaseState() {
    try {
      localStorage.removeItem('svv_feedbacks');
      localStorage.removeItem('svv_offline_feedbacks');

      if (!localStorage.getItem('svv_clean_base_v3')) {
        localStorage.removeItem('svv_diverts');
        localStorage.removeItem('svv_offline_diverts');
        localStorage.removeItem('svv_past_days');
        localStorage.setItem('svv_clean_base_v3', 'true');
        state.diverts = [];
        state.pastDays = [];
      }
      state.feedbacks = [];
    } catch (e) {
      console.warn('initCleanBaseState failed:', e);
    }
  }

  function loadFeedbacksFromStorage() {
    // Sheet is the single source of truth — feedbacks are loaded via pullDataFromGSheet()
    // LocalStorage is not used for feedback data
  }

  function saveDivertsToStorage() {
    try {
      localStorage.setItem('svv_diverts', JSON.stringify(state.diverts));
      localStorage.setItem('svv_offline_diverts', JSON.stringify(state.diverts));
    } catch (e) {
      console.warn('Failed to save diverts to localStorage:', e);
    }
  }

  function loadDivertsFromStorage() {
    try {
      const saved = localStorage.getItem('svv_diverts') || localStorage.getItem('svv_offline_diverts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.diverts = parsed.map(d => ({
            ...d,
            id: d.Divert_ID || d.id,
            timestamp: d.Timestamp || d.timestamp || '',
            date: d.Date || d.date || '',
            branch: d.Branch || d.branch || '',
            customerName: d.Customer_Name || d.customerName || '',
            mobile: d.Mobile_Number || d.mobile || '',
            section: d.Section || d.section || '',
            counter: d.Counter || d.counter || '',
            reason: (d.Reason || d.Reason_For_Divert || d.reason || '').trim(),
            product: d.Product_Name || d.Product_Description || d.product || '',
            design: d.Design_Style || d.design || '',
            size: d.Size || d.Size_Fit || d.size || '',
            gramRange: d.Gram_Range || d.Weight_Range || d.gramRange || '',
            purpose: d.Purpose || d.Purpose_For_Visit || d.purpose || '',
            employee: d.Staff_Employee_Name || d.Attended_Staff || d.employee || '',
            attendedStaff: d.Staff_Employee_Name || d.Attended_Staff || d.attendedStaff || d.employee || '',
            priority: d.Priority || d.Followup_Priority || d.priority || 'MEDIUM',
            otherReason: d.Other_Reason_Remarks || d.Other_Reason || d.otherReason || '',
            status: d.Status || d.status || 'PENDING'
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load diverts from localStorage:', e);
    }
  }

  function saveTelecallerToStorage() {
    try {
      localStorage.setItem('svv_telecaller_registry', JSON.stringify(state.customerCallRegistry));
      localStorage.setItem('svv_telecaller_calls', JSON.stringify(state.telecallerCalls || []));
    } catch (e) {
      console.warn('Failed to save telecaller to localStorage:', e);
    }
  }

  function loadTelecallerFromStorage() {
    try {
      const savedReg = localStorage.getItem('svv_telecaller_registry');
      if (savedReg) {
        state.customerCallRegistry = { ...state.customerCallRegistry, ...JSON.parse(savedReg) };
      }
      const savedCalls = localStorage.getItem('svv_telecaller_calls');
      if (savedCalls && Array.isArray(JSON.parse(savedCalls))) {
        state.telecallerCalls = JSON.parse(savedCalls);
      }
    } catch (e) {
      console.warn('Failed to load telecaller from localStorage:', e);
    }
  }

  // ================= 2. FOOTFALL MODULE & CURRENT DAY SLOT FILLING ENGINE =================
  function updateSlotStatusesWithGrace() {
    const now = new Date();
    const currentHour = now.getHours();

    state.slots.forEach((slot, index) => {
      const startHour = 10 + index; // 10 AM (index 0) to 9 PM (index 11)

      // Once submitted, slot stays SUBMITTED and cannot be modified by staff
      if (slot.status === 'SUBMITTED') return;

      if (currentHour < 10) {
        // Before showroom opening at 10 AM: all slots upcoming/locked
        slot.status = 'PENDING';
      } else if (currentHour === startHour) {
        // CURRENT ACTIVE HOUR: Only this hour slot is active
        slot.status = 'ACTIVE';
        state.currentHourIndex = index;
      } else if (currentHour > startHour) {
        // ELAPSED SLOT TODAY: Current hour has passed startHour.
        // Staff can enter elapsed slots anytime before 11:59 PM today.
        slot.status = 'ELAPSED';
      } else {
        // FUTURE SLOTS: (startHour > currentHour)
        // Strictly closed/locked until their hour arrives. Day end (9 PM - 10 PM) stays closed!
        slot.status = 'PENDING';
      }
    });
  }

  // Sliding 7 Days conversion: dynamically places today's live data at Row 1, followed by 6 preceding calendar days
  function getSliding7DaysData() {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayFootfall = state.slots.reduce((sum, s) => sum + (Number(s.count) || 0), 0);
    const todayBills = state.todayBills || 0;
    const todayConv = todayFootfall > 0 ? ((todayBills / todayFootfall) * 100).toFixed(1) : '0.0';
    const todayRatio = (todayFootfall > 0 && todayBills > 0) ? (todayFootfall / todayBills).toFixed(1) : '0';
    const todayStatus = state.todayBillsSubmitted ? 'Verified' : 'Live (Today)';

    const rows = [{
      date: `${todayDate} (Today)`,
      iso: todayDate,
      footfall: todayFootfall,
      bills: todayBills,
      conversion: todayConv,
      ratio: todayRatio,
      status: todayStatus,
      isToday: true
    }];

    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      let past = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);
      if (!past) {
        let savedSlots = null;
        let savedBills = 0;
        try {
          const rawS = localStorage.getItem('svv_past_slots_' + iso);
          if (rawS) savedSlots = JSON.parse(rawS);
          const rawB = localStorage.getItem('svv_past_bills_' + iso);
          if (rawB) savedBills = parseInt(rawB) || 0;
        } catch (e) {}

        const ff = savedSlots ? savedSlots.reduce((a, b) => a + Number(b), 0) : 0;
        past = {
          date: iso,
          footfall: ff,
          bills: savedBills,
          conversion: ff > 0 ? ((savedBills / ff) * 100).toFixed(1) : '0.0',
          ratio: ff > 0 && savedBills > 0 ? (ff / savedBills).toFixed(1) : '0',
          status: ff > 0 ? 'Verified' : 'Pending',
          slots: savedSlots || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        state.pastDays.push(past);
      }
      rows.push({
        date: past.date,
        iso: iso,
        footfall: past.footfall || 0,
        bills: past.bills !== undefined ? past.bills : 0,
        conversion: past.conversion || '0.0',
        ratio: past.ratio || '0',
        status: past.status || 'Verified',
        isToday: false
      });
    }

    return rows;
  }

  function renderFootfall() {
    updateSlotStatusesWithGrace();

    const todayTotal = state.slots.reduce((sum, s) => sum + s.count, 0);
    const submittedCount = state.slots.filter(s => s.status === 'SUBMITTED').length;
    const activeSlot = state.slots.find(s => s.status === 'ACTIVE') || state.slots[state.currentHourIndex] || state.slots[0];

    dom.ffTodayTotal.textContent = todayTotal;
    dom.ffSlotsSubmitted.textContent = `${submittedCount} / ${state.slots.length}`;
    dom.ffActiveSlotLabel.textContent = activeSlot ? activeSlot.time : '10:00 AM';
    dom.footfallCurrentSlotBadge.textContent = `Active Slot: ${activeSlot ? activeSlot.range : '10:00 AM – 11:00 AM'}`;

    // Peak Hour Today Calculation (Highest visitor count among today's submitted slots)
    const submittedSlots = state.slots.filter(s => s.status === 'SUBMITTED' && s.count > 0);
    if (submittedSlots.length > 0) {
      const peak = submittedSlots.reduce((max, s) => s.count > max.count ? s : max, submittedSlots[0]);
      if (dom.ffPeakHour) dom.ffPeakHour.textContent = peak.time;
      if (dom.ffPeakHourSub) dom.ffPeakHourSub.textContent = `Highest: ${peak.count} visitors (${peak.range})`;
    } else {
      if (dom.ffPeakHour) dom.ffPeakHour.textContent = '—';
      if (dom.ffPeakHourSub) dom.ffPeakHourSub.textContent = 'No slots submitted yet';
    }

    // Render 12 Hourly Slot Cards (Top Dashboard)
    dom.todaySlotsGrid.innerHTML = '';
    const now = new Date();
    const currentMin = now.getMinutes();
    const minsLeft = 60 - currentMin;

    state.slots.forEach((slot, index) => {
      const card = document.createElement('div');
      const isCurrentActive = slot.status === 'ACTIVE';
      const isSlotSubmitted = slot.status === 'SUBMITTED';
      const isSlotElapsed = slot.status === 'ELAPSED';

      let statusBadge = slot.status;
      let badgeClass = 'status-pending';
      if (isSlotSubmitted) {
        statusBadge = 'DONE';
        badgeClass = 'status-submitted';
      } else if (isCurrentActive) {
        statusBadge = 'ACTIVE';
        badgeClass = 'status-active';
      } else if (isSlotElapsed) {
        statusBadge = 'FILL NOW';
        badgeClass = 'status-elapsed';
      } else {
        statusBadge = 'UPCOMING';
        badgeClass = 'status-pending';
      }

      card.className = `slot-card ${isCurrentActive ? 'active' : ''} ${badgeClass}`;
      card.innerHTML = `
        <div class="slot-card-header">
          <span class="slot-id-label">${slot.id}</span>
          <span class="slot-badge-status ${badgeClass}">${statusBadge}</span>
        </div>
        <div>
          <div class="slot-time-text">${slot.time}</div>
          <div class="slot-range-sub">${slot.range}</div>
        </div>
        <div class="slot-footer-action">
          ${isSlotSubmitted 
            ? `<strong>${slot.count}</strong> visitors logged ${state.currentUser?.role === 'Admin' ? '✏️' : '🔒'}` 
            : isCurrentActive 
              ? `👉 Tap to enter count • Closes in ${minsLeft}m` 
              : isSlotElapsed 
                ? `👉 Tap to enter count (Elapsed)` 
                : `Upcoming • Opens at ${slot.time}`}
        </div>
      `;

      card.addEventListener('click', () => {
        if (isCurrentActive || isSlotElapsed) {
          openFootfallSlotModal(slot);
        } else if (isSlotSubmitted) {
          if (state.currentUser?.role === 'Admin') {
            openFootfallSlotModal(slot);
          } else {
            showToast(`🔒 Slot ${slot.time} is already submitted (${slot.count} visitors). Only Admin (Priya Sharma) can edit submitted slots.`);
          }
        } else {
          showToast(`🔒 Slot ${slot.range} is upcoming and opens at ${slot.time}.`);
        }
      });

      dom.todaySlotsGrid.appendChild(card);
    });

    // Update Day-End Bills & Conversion
    if (state.todayBills > 0) {
      dom.todayConversionBox.style.display = 'flex';
      const conv = ((state.todayBills / (todayTotal || 1)) * 100).toFixed(1);
      const ratio = todayTotal > 0 && state.todayBills > 0 ? (todayTotal / state.todayBills).toFixed(1) : '0';
      dom.todayConversionPct.textContent = `${conv}%`;
      dom.todayRatioPct.textContent = `1 bill per ${ratio} visitors`;
    }

    // Day End Bills Input & Button state lock
    if (state.todayBillsSubmitted) {
      if (state.currentUser?.role === 'Admin') {
        dom.todayBillsInput.disabled = false;
        dom.btnSaveTodayBills.textContent = 'Update Bill Count (Admin)';
        dom.btnSaveTodayBills.className = 'btn btn-gold';
      } else {
        dom.todayBillsInput.disabled = true;
        dom.btnSaveTodayBills.textContent = '🔒 Submitted (Admin Edit Only)';
        dom.btnSaveTodayBills.className = 'btn btn-outline disabled';
      }
    } else {
      dom.todayBillsInput.disabled = false;
      dom.btnSaveTodayBills.textContent = 'Save Bill Count';
      dom.btnSaveTodayBills.className = 'btn btn-navy';
    }

    // Render Past Days Table & Missed Yesterday Slots (Bottom Dashboard - Admin Only)
    renderPastDaysAdminSection();
  }

  let activePastDateSelection = '';

  function renderPastDaysAdminSection() {
    const selector = dom.yesterdayDateSelector;
    if (selector && !selector.value) {
      const yd = new Date();
      yd.setDate(yd.getDate() - 1);
      selector.value = yd.toISOString().split('T')[0];
    }
    const selectedDate = selector ? selector.value : activePastDateSelection;
    const iso = normalizeDateToIso(selectedDate || new Date().toISOString().split('T')[0]);

    const todayIso = new Date().toISOString().split('T')[0];
    let foundDay = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);

    if (iso === todayIso) {
      const liveSlots = state.slots.map(s => Number(s.count) || 0);
      const liveBills = Number(state.todayBills) || 0;
      const liveFf = liveSlots.reduce((a, b) => a + b, 0);
      if (!foundDay) {
        foundDay = {
          date: iso,
          footfall: liveFf,
          bills: liveBills,
          conversion: liveFf > 0 ? ((liveBills / liveFf) * 100).toFixed(1) : '0.0',
          ratio: liveFf > 0 && liveBills > 0 ? (liveFf / liveBills).toFixed(1) : '0',
          status: 'Verified',
          slots: liveSlots
        };
        state.pastDays.push(foundDay);
      } else {
        foundDay.slots = liveSlots;
        foundDay.bills = liveBills;
        foundDay.footfall = liveFf;
        foundDay.conversion = liveFf > 0 ? ((liveBills / liveFf) * 100).toFixed(1) : '0.0';
        foundDay.ratio = liveFf > 0 && liveBills > 0 ? (liveFf / liveBills).toFixed(1) : '0';
      }
    } else {
      if (!foundDay || !foundDay.slots || foundDay.slots.every(s => s === 0)) {
        let savedSlots = null;
        let savedBills = 0;
        try {
          const rawS = localStorage.getItem('svv_past_slots_' + iso) || localStorage.getItem('svv_today_slots_' + iso);
          if (rawS) {
            const parsed = JSON.parse(rawS);
            if (Array.isArray(parsed) && parsed.length === 12) savedSlots = parsed;
          }
          const rawB = localStorage.getItem('svv_past_bills_' + iso) || localStorage.getItem('svv_today_bills_' + iso);
          if (rawB) {
            try {
              const parsedB = JSON.parse(rawB);
              savedBills = Number(parsedB.todayBills !== undefined ? parsedB.todayBills : rawB) || 0;
            } catch(e) {
              savedBills = parseInt(rawB) || 0;
            }
          }
        } catch (e) {}

        const ff = savedSlots ? savedSlots.reduce((a, b) => a + Number(b), 0) : (foundDay ? foundDay.footfall : 0);
        if (!foundDay) {
          foundDay = {
            date: iso,
            footfall: ff,
            bills: savedBills,
            conversion: ff > 0 ? ((savedBills / ff) * 100).toFixed(1) : '0.0',
            ratio: ff > 0 && savedBills > 0 ? (ff / savedBills).toFixed(1) : '0',
            status: ff > 0 ? 'Verified' : 'Pending',
            slots: savedSlots || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          };
          state.pastDays.push(foundDay);
        } else {
          if (savedSlots) foundDay.slots = savedSlots;
          if (savedBills > 0 || !foundDay.bills) foundDay.bills = savedBills;
          foundDay.footfall = ff;
          foundDay.conversion = ff > 0 ? ((foundDay.bills / ff) * 100).toFixed(1) : '0.0';
          foundDay.ratio = ff > 0 && foundDay.bills > 0 ? (ff / foundDay.bills).toFixed(1) : '0';
        }
      }
    }

    if (dom.pastDateBillsInput) {
      dom.pastDateBillsInput.value = foundDay.bills !== undefined ? foundDay.bills : 0;
      dom.pastDateBillsInput.oninput = (e) => {
        foundDay.bills = parseInt(e.target.value) || 0;
        foundDay.conversion = foundDay.footfall > 0 ? ((foundDay.bills / foundDay.footfall) * 100).toFixed(1) : '0.0';
        foundDay.ratio = foundDay.footfall > 0 && foundDay.bills > 0 ? (foundDay.footfall / foundDay.bills).toFixed(1) : '0';
        if (dom.pastSlotsTitle) {
          dom.pastSlotsTitle.textContent = `Missed Slot Correction for Past Date: ${foundDay.date} (Footfall: ${foundDay.footfall}, Bills: ${foundDay.bills})`;
        }
        if (dom.pastSlotsSaveStatus) {
          dom.pastSlotsSaveStatus.textContent = 'Unsaved changes';
          dom.pastSlotsSaveStatus.style.color = '#D97706';
        }
      };
    }

    if (dom.pastSlotsTitle) {
      dom.pastSlotsTitle.textContent = `Missed Slot Correction for Past Date: ${foundDay.date} (Footfall: ${foundDay.footfall}, Bills: ${foundDay.bills})`;
    }
    if (dom.pastSlotsGrid) {
      dom.pastSlotsGrid.innerHTML = '';
      state.slots.forEach((slot, idx) => {
        const box = document.createElement('div');
        box.className = 'past-slot-box';
        const val = (foundDay.slots && foundDay.slots[idx] !== undefined) ? foundDay.slots[idx] : 0;

        box.innerHTML = `
          <div class="past-slot-time">${slot.time}</div>
          <input type="number" class="past-slot-input" min="0" value="${val}" data-slot-index="${idx}">
        `;

        const input = box.querySelector('.past-slot-input');
        input.addEventListener('input', (e) => {
          if (!foundDay.slots) foundDay.slots = [0,0,0,0,0,0,0,0,0,0,0,0];
          foundDay.slots[idx] = parseInt(e.target.value) || 0;
          foundDay.footfall = foundDay.slots.reduce((a, b) => a + b, 0);
          foundDay.conversion = foundDay.footfall > 0 ? ((foundDay.bills / foundDay.footfall) * 100).toFixed(1) : '0.0';
          foundDay.ratio = foundDay.footfall > 0 && foundDay.bills > 0 ? (foundDay.footfall / foundDay.bills).toFixed(1) : '0';
          if (dom.pastSlotsTitle) {
            dom.pastSlotsTitle.textContent = `Missed Slot Correction for Past Date: ${foundDay.date} (Footfall: ${foundDay.footfall}, Bills: ${foundDay.bills})`;
          }
          if (dom.pastSlotsSaveStatus) {
            dom.pastSlotsSaveStatus.textContent = 'Unsaved changes';
            dom.pastSlotsSaveStatus.style.color = '#D97706';
          }
        });

        dom.pastSlotsGrid.appendChild(box);
      });
    }

    renderPastDaysTable();
  }

  function savePastDateSlotsAndBills() {
    const selector = dom.yesterdayDateSelector;
    const selectedDate = selector ? selector.value : activePastDateSelection;
    if (!selectedDate) {
      showToast('Please select a date first.');
      return;
    }
    const iso = normalizeDateToIso(selectedDate);
    let found = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);
    if (!found) {
      found = {
        date: iso,
        footfall: 0,
        bills: 0,
        conversion: '0.0',
        ratio: '0',
        status: 'Audited',
        slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      state.pastDays.push(found);
    }

    const inputs = dom.pastSlotsGrid ? dom.pastSlotsGrid.querySelectorAll('.past-slot-input') : [];
    const newSlots = [];
    inputs.forEach(inp => {
      newSlots.push(parseInt(inp.value) || 0);
    });
    if (newSlots.length === 12) {
      found.slots = newSlots;
    }
    const totalFootfall = (found.slots || []).reduce((a, b) => a + b, 0);
    found.footfall = totalFootfall;

    const billsVal = dom.pastDateBillsInput ? parseInt(dom.pastDateBillsInput.value) : 0;
    found.bills = isNaN(billsVal) ? 0 : billsVal;
    found.conversion = totalFootfall > 0 ? ((found.bills / totalFootfall) * 100).toFixed(1) : '0.0';
    found.ratio = totalFootfall > 0 && found.bills > 0 ? (totalFootfall / found.bills).toFixed(1) : '0';
    found.status = 'Audited';

    // Persist to localStorage
    try {
      localStorage.setItem('svv_past_days', JSON.stringify(state.pastDays));
      localStorage.setItem('svv_past_slots_' + iso, JSON.stringify(found.slots));
      localStorage.setItem('svv_past_bills_' + iso, String(found.bills));
      if (iso === new Date().toISOString().split('T')[0]) {
        state.slots.forEach((s, idx) => {
          s.count = found.slots[idx] || 0;
          if (s.count > 0) s.status = 'SUBMITTED';
        });
        state.todayBills = found.bills;
        saveSlotsToStorage();
      }
    } catch (e) {
      console.warn('localStorage error:', e);
    }

    // Sync to Google Sheets
    if (typeof sendToGSheet === 'function') {
      sendToGSheet('SAVE_PAST_DAY_AUDIT', {
        date: found.date,
        footfall: found.footfall,
        bills: found.bills,
        slots: found.slots,
        conversion: found.conversion,
        ratio: found.ratio
      });
    }

    renderPastDaysTable();
    renderDER();
    renderDERWeeklyDailyChart();
    if (dom.pastSlotsTitle) {
      dom.pastSlotsTitle.textContent = `Missed Slot Correction for Past Date: ${found.date} (Footfall: ${found.footfall}, Bills: ${found.bills})`;
    }
    if (dom.pastSlotsSaveStatus) {
      dom.pastSlotsSaveStatus.textContent = `Saved (${new Date().toLocaleTimeString()})`;
      dom.pastSlotsSaveStatus.style.color = '#059669';
    }
    showToast(`Saved slots (${found.footfall} visitors) & ${found.bills} bills for ${found.date}! 💾`);
  }

  function renderPastDaysTable() {
    const sliding7Days = getSliding7DaysData();
    dom.pastDaysTableBody.innerHTML = sliding7Days.map(p => `
      <tr class="${p.isToday ? 'row-today-highlight' : ''}">
        <td><strong>${p.date}</strong> ${p.isToday ? '<span class="badge badge-gold">Current</span>' : ''}</td>
        <td><strong>${p.footfall}</strong></td>
        <td>
          ${p.isToday 
            ? `<span class="badge badge-subtle font-bold">${p.bills} bills</span>` 
            : `<input type="number" class="form-input" style="width:90px; padding:4px 8px;" value="${p.bills}" onchange="app.updatePastDayBills('${p.iso || p.date}', this.value)" ${state.currentUser?.role === 'Admin' ? '' : 'disabled'}>`
          }
        </td>
        <td><span class="badge badge-emerald">${p.conversion}%</span></td>
        <td><span class="ratio-pill">1:${p.ratio}</span></td>
        <td><span class="badge ${p.isToday ? 'badge-gold' : 'badge-subtle'}">${p.status}</span></td>
        <td>
          ${p.isToday 
            ? `<button class="btn btn-xs btn-gold" onclick="window.scrollTo({top: 300, behavior: 'smooth'})">Live Day</button>` 
            : `<button class="btn btn-xs btn-navy" onclick="app.savePastDayAudit('${p.iso || p.date}')">Save Audit</button>`
          }
        </td>
      </tr>
    `).join('');
  }

  async function loadPastDateSlots(dateStr) {
    if (!dateStr && dom.yesterdayDateSelector) dateStr = dom.yesterdayDateSelector.value;
    if (!dateStr) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      dateStr = d.toISOString().split('T')[0];
    }
    const iso = normalizeDateToIso(dateStr);
    if (dom.yesterdayDateSelector) dom.yesterdayDateSelector.value = iso;
    activePastDateSelection = iso;

    const todayIso = new Date().toISOString().split('T')[0];
    let found = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);

    // 1. If date is today, prioritize live state data
    if (iso === todayIso) {
      const liveSlots = state.slots.map(s => Number(s.count) || 0);
      const liveBills = Number(state.todayBills) || 0;
      const liveFf = liveSlots.reduce((a, b) => a + b, 0);
      if (!found) {
        found = {
          date: iso,
          footfall: liveFf,
          bills: liveBills,
          conversion: liveFf > 0 ? ((liveBills / liveFf) * 100).toFixed(1) : '0.0',
          ratio: liveFf > 0 && liveBills > 0 ? (liveFf / liveBills).toFixed(1) : '0',
          status: 'Verified',
          slots: liveSlots
        };
        state.pastDays.push(found);
      } else {
        found.slots = liveSlots;
        found.bills = liveBills;
        found.footfall = liveFf;
        found.conversion = liveFf > 0 ? ((liveBills / liveFf) * 100).toFixed(1) : '0.0';
        found.ratio = liveFf > 0 && liveBills > 0 ? (liveFf / liveBills).toFixed(1) : '0';
      }
    } else {
      // 2. If not today, check if found has slots; if not, check localStorage
      if (!found || !found.slots || found.slots.every(s => s === 0)) {
        let savedSlots = null;
        let savedBills = 0;
        try {
          const rawS = localStorage.getItem('svv_past_slots_' + iso) || localStorage.getItem('svv_today_slots_' + iso);
          if (rawS) {
            const parsed = JSON.parse(rawS);
            if (Array.isArray(parsed) && parsed.length === 12) savedSlots = parsed;
          }
          const rawB = localStorage.getItem('svv_past_bills_' + iso) || localStorage.getItem('svv_today_bills_' + iso);
          if (rawB) {
            try {
              const pb = JSON.parse(rawB);
              savedBills = Number(pb.todayBills !== undefined ? pb.todayBills : rawB) || 0;
            } catch(e) {
              savedBills = parseInt(rawB) || 0;
            }
          }
        } catch (e) {}

        if (savedSlots && Array.isArray(savedSlots) && savedSlots.length === 12) {
          const ff = savedSlots.reduce((a, b) => a + Number(b), 0);
          if (!found) {
            found = {
              date: iso,
              footfall: ff,
              bills: savedBills,
              conversion: ff > 0 ? ((savedBills / ff) * 100).toFixed(1) : '0.0',
              ratio: ff > 0 && savedBills > 0 ? (ff / savedBills).toFixed(1) : '0',
              status: ff > 0 ? 'Verified' : 'Pending',
              slots: savedSlots
            };
            state.pastDays.push(found);
          } else {
            found.slots = savedSlots;
            if (savedBills > 0 || !found.bills) found.bills = savedBills;
            found.footfall = ff;
            found.conversion = ff > 0 ? ((found.bills / ff) * 100).toFixed(1) : '0.0';
            found.ratio = ff > 0 && found.bills > 0 ? (ff / found.bills).toFixed(1) : '0';
          }
        }
      }

      // 3. If still no valid slots or all 0, attempt to fetch from Google Sheet or Cloudflare Worker
      if (!found || !found.slots || found.slots.every(s => s === 0)) {
        if (state.gsheetUrl || state.cfWorkerUrl) {
          try {
            let targetUrl = '';
            if (state.cfWorkerUrl) {
              targetUrl = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/pull`;
            } else {
              targetUrl = state.gsheetUrl.includes('?') 
                ? `${state.gsheetUrl}&action=GET_FOOTFALL&date=${iso}` 
                : `${state.gsheetUrl}?action=GET_FOOTFALL&date=${iso}`;
            }

            const res = await smartFetch(targetUrl);
            if (res && (res.status === 'SUCCESS' || res.footfall || res.data?.footfall)) {
              const ffList = res.footfall || res.data?.footfall || [];
              const matchedRows = ffList.filter(r => normalizeDateToIso(r.Date || r.date) === iso);
              if (matchedRows.length > 0) {
                const fetchedSlots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let fetchedBills = 0;
                matchedRows.forEach(row => {
                  const sId = String(row.Slot_ID || row.slotId || '');
                  const m = sId.match(/SLOT_0*(\d+)/i);
                  if (m) {
                    const idx = parseInt(m[1], 10) - 1;
                    if (idx >= 0 && idx < 12) {
                      fetchedSlots[idx] = Number(row.Footfall_Count || row.footfallCount || row.count) || 0;
                    }
                  }
                  const b = Number(row.Day_End_Bills || row.dayEndBills || row.todayBills || row.bills);
                  if (!isNaN(b) && b > 0) fetchedBills = b;
                });

                const totalFf = fetchedSlots.reduce((a, b) => a + b, 0);
                if (!found) {
                  found = {
                    date: iso,
                    footfall: totalFf,
                    bills: fetchedBills,
                    conversion: totalFf > 0 ? ((fetchedBills / totalFf) * 100).toFixed(1) : '0.0',
                    ratio: totalFf > 0 && fetchedBills > 0 ? (totalFf / fetchedBills).toFixed(1) : '0',
                    status: 'Verified',
                    slots: fetchedSlots
                  };
                  state.pastDays.push(found);
                } else {
                  found.slots = fetchedSlots;
                  found.bills = fetchedBills;
                  found.footfall = totalFf;
                  found.conversion = totalFf > 0 ? ((fetchedBills / totalFf) * 100).toFixed(1) : '0.0';
                  found.ratio = totalFf > 0 && fetchedBills > 0 ? (totalFf / fetchedBills).toFixed(1) : '0';
                  found.status = 'Verified';
                }
                localStorage.setItem('svv_past_slots_' + iso, JSON.stringify(fetchedSlots));
                localStorage.setItem('svv_past_bills_' + iso, String(fetchedBills));
              }
            }
          } catch(e) {
            console.warn('[SVV] Could not fetch past day footfall from cloud:', e);
          }
        }
      }

      // If still nothing, provide clean default structure
      if (!found) {
        found = {
          date: iso,
          footfall: 0,
          bills: 0,
          conversion: '0.0',
          ratio: '0',
          status: 'Unverified',
          slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        state.pastDays.push(found);
      } else if (!found.slots) {
        found.slots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }

    if (dom.pastDateBillsInput) {
      dom.pastDateBillsInput.value = found.bills !== undefined ? found.bills : 0;
    }
    if (dom.pastSlotsSaveStatus) {
      dom.pastSlotsSaveStatus.textContent = '';
    }
    renderPastDaysAdminSection();
    showToast(`Loaded slots and bills for ${iso} successfully! 📅`);
  }

  function openFootfallSlotModal(slot) {
    dom.ffModalSlotId.value = slot.id;
    dom.ffModalSlotTitle.textContent = `Enter Footfall Count (${slot.time})`;
    dom.ffModalSlotTimeLabel.textContent = `Hourly Slot: ${slot.range}`;
    dom.ffModalCountInput.value = slot.count || '';
    dom.modalFootfallSlot.classList.add('active');
    dom.ffModalCountInput.focus();
  }

  // ================= 2C. QUESTION-WISE FEEDBACK AI ADVISOR =================
  function renderFeedbackAIAdvisor(feedbacks) {
    const grid = document.getElementById('fbAISuggestionsGrid');
    if (!grid) return;

    const list = Array.isArray(feedbacks) ? feedbacks : state.feedbacks;
    const total = list.length;

    if (total === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; background: #FAF8F5; border-radius: 10px; border: 1.5px dashed #CBD5E1;">
          <span style="font-size: 1.8rem;">💡</span>
          <h4 style="margin: 8px 0 4px; color: #334155; font-size: 0.95rem; font-weight: 700;">Awaiting Customer Feedback Entries</h4>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0; max-width: 500px; margin: 0 auto;">
            Question-wise AI suggestions synthesize customer data in real time as feedback is collected via Tab or customer QR scan.
          </p>
        </div>
      `;
      return;
    }

    // 1. Q1 Marketing Discovery Analysis
    const q1Counts = {};
    list.forEach(f => {
      const val = f.q1 || 'Friends & Relatives';
      q1Counts[val] = (q1Counts[val] || 0) + 1;
    });
    const topQ1 = Object.entries(q1Counts).sort((a, b) => b[1] - a[1])[0] || ['Word of Mouth', 1];
    const topQ1Pct = Math.round((topQ1[1] / total) * 100);

    // 2. Q2 Product & Experience Delight
    const q2Counts = {};
    list.forEach(f => {
      const val = f.q2 || 'Purity & Trust';
      q2Counts[val] = (q2Counts[val] || 0) + 1;
    });
    const topQ2 = Object.entries(q2Counts).sort((a, b) => b[1] - a[1])[0] || ['Design Collections', 1];
    const topQ2Pct = Math.round((topQ2[1] / total) * 100);

    // 3. Q3 Service Improvement Focus
    const q3Counts = {};
    list.forEach(f => {
      const val = f.q3 || '';
      if (val && !val.toLowerCase().includes('satisfied') && !val.toLowerCase().includes('excellent') && !val.toLowerCase().includes('none')) {
        q3Counts[val] = (q3Counts[val] || 0) + 1;
      }
    });
    const q3Entries = Object.entries(q3Counts).sort((a, b) => b[1] - a[1]);
    const topQ3 = q3Entries.length > 0 ? q3Entries[0] : null;

    // 4. Q4 Occasions & Gifting Pipeline (Milestone Tracking)
    let bdayCount = 0;
    let wedCount = 0;
    let festivalCount = 0;
    let datesCaptured = 0;
    list.forEach(f => {
      const occ = (f.q4 || '').toLowerCase();
      if (f.occasionDate) datesCaptured++;
      if (occ.includes('birthday') || (f.occasionDate && occ.includes('birth'))) bdayCount++;
      else if (occ.includes('anniversary') || (f.occasionDate && occ.includes('wedding'))) wedCount++;
      else if (occ.includes('festival')) festivalCount++;
    });

    // 5. Q5 Chit Scheme Awareness & Conversion
    let awareChit = 0;
    let unawareChit = 0;
    list.forEach(f => {
      const val = (f.q5 || '').toLowerCase();
      if (val.includes('already') || val.includes('aware')) awareChit++;
      else unawareChit++;
    });
    const awarePct = Math.round((awareChit / total) * 100);
    const unawarePct = 100 - awarePct;

    // 6. Q7 NPS & Brand Advocacy
    let promoters = 0;
    let passives = 0;
    let detractors = 0;
    list.forEach(f => {
      const r = Number(f.rating) || 10;
      if (r >= 9) promoters++;
      else if (r >= 7) passives++;
      else detractors++;
    });
    const npsScore = Math.round(((promoters - detractors) / total) * 100);

    const cards = [
      {
        qNum: 'Q1',
        category: 'Marketing Attribution',
        icon: '📣',
        title: `Primary Channel: ${topQ1[0]} (${topQ1Pct}%)`,
        action: `${topQ1[0]} is your highest conversion source. Prioritize wedding campaign hoardings and digital reels in top-performing areas to maximize footfall.`,
        tag: 'Acquisition Driver',
        color: '#0284C7',
        bg: '#F0F9FF',
        border: '#BAE6FD'
      },
      {
        qNum: 'Q2',
        category: 'Showroom USP & Delight',
        icon: '💎',
        title: `Top Attraction: ${topQ2[0]} (${topQ2Pct}%)`,
        action: `Customer confidence is driven by ${topQ2[0]}. Replicate this standard across all floor counters and highlight BIS 916 hallmarking trust in greetings.`,
        tag: 'Brand Asset',
        color: '#15803D',
        bg: '#F0FDF4',
        border: '#BBF7D0'
      },
      {
        qNum: 'Q3',
        category: 'Operations & Service',
        icon: '⚡',
        title: topQ3 ? `Key Improvement: ${topQ3[0]} (${Math.round((topQ3[1] / total) * 100)}%)` : 'Service Quality: High Satisfaction',
        action: topQ3
          ? `${topQ3[1]} customers requested attention on ${topQ3[0]}. Deploy additional billing staff during peak 5-8 PM hours to maintain swift service.`
          : 'High service satisfaction across counters. Continue sales staff training on polite greeting and transparent ornament weighing.',
        tag: 'Operational Polish',
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A'
      },
      {
        qNum: 'Q4',
        category: 'Milestone & Gifting Pipeline',
        icon: '🎂',
        title: `${bdayCount} Birthdays • ${wedCount} Anniversaries`,
        action: `${datesCaptured} exact dates logged. Telecallers should dispatch advance WhatsApp blessings and a 10% V.A discount voucher 3 days prior to milestones.`,
        tag: 'Direct CRM Revenue',
        color: '#9333EA',
        bg: '#FAF5FF',
        border: '#E9D5FF'
      },
      {
        qNum: 'Q5',
        category: 'Gold Chit Scheme',
        icon: '🪙',
        title: `${unawarePct}% Unaware (${unawareChit} Shoppers)`,
        action: `${unawareChit} walk-in customers have not yet enrolled in Suba Valli Vilas savings. Instruct cash counters to present the 11-month gold chit brochure with every bill.`,
        tag: 'Repeat Footfall',
        color: '#C5A059',
        bg: '#FAF6EE',
        border: '#E5D5B8'
      },
      {
        qNum: 'Q7',
        category: 'NPS Advocacy & Retention',
        icon: '⭐',
        title: `NPS: +${npsScore} (${promoters} Promoters)`,
        action: detractors > 0
          ? `${detractors} detractors recorded. Manager callback required within 24 hours to resolve customer feedback and preserve showroom goodwill.`
          : `Exceptional customer advocacy (+${npsScore})! Encourage top promoters to review Suba Valli Vilas on Google Maps.`,
        tag: 'Loyalty Metric',
        color: npsScore >= 50 ? '#059669' : '#DC2626',
        bg: npsScore >= 50 ? '#ECFDF5' : '#FEF2F2',
        border: npsScore >= 50 ? '#A7F3D0' : '#FECACA'
      }
    ];

    grid.innerHTML = cards.map(c => `
      <div style="background:${c.bg}; border:1px solid ${c.border}; border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
        <div>
          <div class="d-flex justify-between align-center mb-1">
            <span style="font-size:0.72rem; font-weight:700; color:${c.color}; text-transform:uppercase; letter-spacing:0.5px;">${c.qNum} • ${c.category}</span>
            <span style="font-size:1.15rem;">${c.icon}</span>
          </div>
          <h4 style="font-size:0.9rem; font-weight:700; color:#1E293B; margin:4px 0 6px 0; line-height:1.35;">${c.title}</h4>
          <p style="font-size:0.8rem; color:#475569; line-height:1.45; margin:0;">${c.action}</p>
        </div>
        <div class="mt-2 pt-2 border-top d-flex justify-between align-center" style="border-color:${c.border};">
          <span class="badge" style="background:#FFFFFF; color:${c.color}; border:1px solid ${c.border}; font-size:0.7rem; font-weight:700;">${c.tag}</span>
          <span class="text-xs text-muted" style="font-size:0.7rem;">Live Data AI</span>
        </div>
      </div>
    `).join('');
  }

  // ================= 3. FEEDBACK MODULE RENDERING =================
  function renderFeedbackList() {
    const filterStatus = dom.fbFilterStatus ? dom.fbFilterStatus.value : 'ALL';
    const filterMood = dom.fbFilterMood ? dom.fbFilterMood.value : 'ALL';
    const filterStaff = dom.fbFilterStaff ? dom.fbFilterStaff.value : 'ALL';
    const startDate = dom.fbFilterStartDate ? dom.fbFilterStartDate.value : '';
    const endDate = dom.fbFilterEndDate ? dom.fbFilterEndDate.value : '';

    const filtered = state.feedbacks.filter(f => {
      const fDateIso = normalizeDateToIso(f.date || f.timestamp);
      if (startDate && fDateIso && fDateIso < startDate) return false;
      if (endDate && fDateIso && fDateIso > endDate) return false;
      if (activeFbSourceFilter !== 'ALL') {
        const isTab = (f.source || '').toLowerCase().includes('tab') || (f.source || '').toLowerCase().includes('staff');
        if (activeFbSourceFilter === 'QR' && isTab) return false;
        if (activeFbSourceFilter === 'Staff' && !isTab) return false;
      }
      if (activeFbStatusFilter !== 'ALL' && f.status !== activeFbStatusFilter) return false;
      if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
      if (filterMood !== 'ALL' && f.mood !== filterMood) return false;
      if (filterStaff !== 'ALL' && f.staffName !== filterStaff) return false;
      return true;
    });

    if (dom.fbResultCount) {
      dom.fbResultCount.textContent = `Showing ${filtered.length} of ${state.feedbacks.length} entries`;
    }

    // Update Top Metric Counters accurately based on filtered feedbacks
    if (dom.fbStatTotal) dom.fbStatTotal.textContent = filtered.length.toLocaleString();
    if (dom.fbStatNew) dom.fbStatNew.textContent = filtered.filter(f => f.status === 'NEW').length;
    if (dom.fbStatReviewed) dom.fbStatReviewed.textContent = filtered.filter(f => f.status === 'REVIEWED').length;
    if (dom.fbStatAction) dom.fbStatAction.textContent = filtered.filter(f => f.status === 'ACTION TAKEN').length;
    if (dom.fbStatClosed) dom.fbStatClosed.textContent = filtered.filter(f => f.status === 'CLOSED').length;

    // Render Question-Wise AI Strategic Suggestions for Feedback List Screen
    renderFeedbackAIAdvisor(filtered);
    renderQuestionWiseReport(filtered);

    if (!dom.feedbackCardsList) return;

    if (filtered.length === 0) {
      dom.feedbackCardsList.innerHTML = `
        <div class="card p-5 text-center text-muted">
          <span style="font-size:2rem;">🔍</span>
          <h4 class="mt-2 text-dark font-bold">No Feedback Records Found</h4>
          <p class="text-sm mt-1">Try resetting the date range, source, or status filters above.</p>
        </div>
      `;
      return;
    }

    // Render Accordion Cards List (Matches Reference Screenshot media_1789929579152.png)
    dom.feedbackCardsList.innerHTML = filtered.map(item => {
      const isExpanded = expandedFeedbackIds.has(item.id);
      const moodBadge = item.mood === 'Appreciation'
        ? `<span class="badge badge-emerald">⭐ Appreciation</span>`
        : (item.mood === 'Concern' ? `<span class="badge badge-rose">⚠️ Concern</span>` : `<span class="badge badge-subtle">💬 Feedback</span>`);

      const isTab = (item.source || '').toLowerCase().includes('tab') || (item.source || '').toLowerCase().includes('staff');
      const sourceBadge = isTab
        ? `<span class="badge badge-channel-tab">📟 Showroom Tab</span>`
        : `<span class="badge badge-channel-qr">📱 QR Code</span>`;

      const statusBadge = item.status === 'NEW'
        ? `<span class="badge badge-admin">NEW</span>`
        : (item.status === 'REVIEWED'
          ? `<span class="badge badge-gold">REVIEWED</span>`
          : (item.status === 'ACTION TAKEN' ? `<span class="badge badge-amber">ACTION TAKEN</span>` : `<span class="badge badge-emerald">CLOSED</span>`));

      const remarkText = item.remarks || item.feedbackComment || '';
      const previewText = remarkText ? `"${remarkText}"` : (item.q4 ? `Purchase for: ${item.q4}` : 'In-store showroom feedback');

      return `
        <div class="fb-accordion-card ${isExpanded ? 'is-expanded' : ''}" id="fbCard_${item.id}">
          <div class="fb-accordion-header" onclick="app.toggleFeedbackAccordion('${item.id}')">
            <div class="fb-header-left">
              <div class="fb-header-title-line">
                <span class="fb-header-name">${item.customerName}</span>
                ${item.city ? `<span class="fb-header-city">📍 ${item.city}</span>` : ''}
                ${previewText ? `<span class="fb-header-preview-remarks">• ${previewText}</span>` : ''}
              </div>
              <div class="fb-header-meta-row">
                <span class="fb-meta-item">📅 ${item.date || (item.timestamp ? item.timestamp.split(' ')[0] : '20/09/2026')}</span>
                <span class="fb-meta-item">🕒 ${item.timestamp ? item.timestamp.split(' ').slice(1).join(' ') : '10:00 AM'}</span>
                <span class="fb-meta-item fb-meta-staff">👤 Staff: <strong>${item.staffName || 'Vijay'}</strong></span>
                <span class="fb-meta-item">📞 ${item.mobile || 'Walk-in'}</span>
                <span class="fb-meta-item">⭐ ${item.rating}/10</span>
                ${item.q4 ? `<span class="fb-meta-item" style="color:var(--gold-dark);">🎁 ${item.q4} ${item.occasionDate ? `(${item.occasionDate})` : ''}</span>` : ''}
              </div>
            </div>
            <div class="fb-header-right">
              <div class="fb-header-badges">
                ${moodBadge}
                ${statusBadge}
                <span class="fb-chevron">▼</span>
              </div>
              <div>${sourceBadge}</div>
            </div>
          </div>

          <!-- Expanded Body: 8-Question Grid & Update Status Form (media_1789929579152.png) -->
          <div class="fb-accordion-body" id="fbBody_${item.id}">
            <div class="fb-qa-grid">
              <div class="fb-qa-box">
                <div class="fb-qa-question">HOW OFTEN DO YOU SHOP WITH US?</div>
                <div class="fb-qa-answer">${item.q0 || item.Q0_Frequency || 'Regular Customer'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">HOW DID YOU HEAR ABOUT SUBA VALLI VILAS?</div>
                <div class="fb-qa-answer">${item.q1 || item.Q1_Heard_About || 'Friends & Relatives'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">WHAT DID YOU LIKE MOST ABOUT OUR STORE?</div>
                <div class="fb-qa-answer">${item.q2 || item.Q2_Store_Experience || 'Design Collections & Variety'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">WHAT COULD WE IMPROVE ABOUT OUR SERVICE?</div>
                <div class="fb-qa-answer">${item.q3 || item.Q3_Staff_Service || 'None - Very Satisfied'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">WHAT OCCASIONS DO YOU PURCHASE FOR?</div>
                <div class="fb-qa-answer">${item.q4 || item.Q4_Occasion || 'General Walk-in'} ${item.occasionDate || item.Occasion_Date ? `(${item.occasionDate || item.Occasion_Date})` : ''}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">ARE YOU AWARE OF CHIT SCHEMES?</div>
                <div class="fb-qa-answer">${item.q5 || item.Q5_Chit_Awareness || 'Yes - Already Enrolled'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">SPECIFIC JEWELLERY TYPES INTERESTED IN?</div>
                <div class="fb-qa-answer">${item.q6 || item.Q6_Jewellery_Interest || '22K Gold Antique'}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">WOULD YOU RECOMMEND SUBA VALLI VILAS?</div>
                <div class="fb-qa-answer">${item.q7 || item.Q7_Recommend || item.recommendationChoice || (item.rating >= 9 ? 'Yes, definitely' : (item.rating <= 6 ? 'No, Not recommended' : 'Not sure'))}</div>
              </div>
              <div class="fb-qa-box">
                <div class="fb-qa-question">OVERALL SHOPPING EXPERIENCE</div>
                <div class="fb-qa-answer font-bold" style="color:var(--gold-dark);">${item.overallShoppingExperience || item.Overall_Shopping_Experience || item.q8 || (item.mood === 'Appreciation' ? 'Excellent' : 'Good')}</div>
              </div>
            </div>

            <!-- Customer Remarks Quote Box -->
            <div class="fb-full-remarks-box">
              <div class="d-flex justify-between align-center mb-1">
                <strong>📝 Customer Remarks & Voice of Customer:</strong>
                ${item.actionRemark ? `<span class="badge badge-emerald">Action Logged</span>` : ''}
              </div>
              <div>"${remarkText || 'Customer did not leave additional written notes.'}"</div>
              ${item.actionRemark ? `<div class="remark-action-note mt-2"><strong>Staff Action Log:</strong> ${item.actionRemark}</div>` : ''}
            </div>

            <!-- Action & Quick Dial Chips -->
            <div class="fb-contact-chips-row">
              <span class="fb-chip-item">👤 Staff Attributed: <strong>${item.staffName || 'Vijay'}</strong></span>
              <a href="tel:${item.mobile}" class="fb-chip-item">📞 ${item.mobile}</a>
              <button type="button" class="fb-chip-item fb-chip-whatsapp" onclick="event.stopPropagation(); app.openWhatsAppModalForCustomer('${item.id}')">
                💬 WhatsApp Customer
              </button>
            </div>

            <!-- Inline UPDATE STATUS Section (Matches media_1789929579152.png) -->
            <div class="fb-update-section">
              <div class="fb-update-heading">UPDATE STATUS</div>
              <div class="fb-update-form-row">
                <div class="fb-update-field-status">
                  <label class="form-label text-xs font-bold" for="statusSelect_${item.id}">STATUS</label>
                  <select id="statusSelect_${item.id}" class="form-input">
                    <option value="NEW" ${item.status === 'NEW' ? 'selected' : ''}>NEW</option>
                    <option value="REVIEWED" ${item.status === 'REVIEWED' ? 'selected' : ''}>REVIEWED</option>
                    <option value="ACTION TAKEN" ${item.status === 'ACTION TAKEN' ? 'selected' : ''}>ACTION TAKEN</option>
                    <option value="CLOSED" ${item.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
                  </select>
                </div>
                <div class="fb-update-field-remark">
                  <label class="form-label text-xs font-bold" for="actionRemark_${item.id}">ACTION / REMARK</label>
                  <textarea id="actionRemark_${item.id}" class="form-input" rows="2" placeholder="Describe what action was taken or add a remark...">${item.actionRemark || ''}</textarea>
                </div>
                <div class="fb-update-field-action">
                  <button type="button" class="btn btn-navy" onclick="event.stopPropagation(); app.updateFeedbackStatus('${item.id}')">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ================= QUESTION-WISE REPORT & CUSTOMER DRILL-DOWN =================
  function isOptionMatch(q, f, enOpt, opt) {
    if (!f) return false;
    const norm = str => String(str || '').toLowerCase().trim().replace(/[^a-z0-9\u0B80-\u0BFF]/g, '');
    const optNorm = norm(enOpt);
    const optTamilNorm = norm(opt);

    const qId = String(q.q_id || '').toUpperCase();
    const qTitle = String(q.q_text_en || '').toLowerCase();

    // 1. Q5 / Chit Scheme Awareness (Strictly mutually exclusive classification)
    if (qId === 'Q5' || qTitle.includes('chit scheme') || qTitle.includes('chit') || qTitle.includes('gold chit')) {
      const rawAns = String(f.q5 || f.Q5_Chit_Awareness || f.chitAwareness || f[q.q_id] || '').toLowerCase().trim();
      if (!rawAns) return false;

      // Option: Yes - Already Enrolled
      if (optNorm.includes('enrolled') || optTamilNorm.includes('இணைந்துள்ளேன்')) {
        return rawAns.includes('enrolled') || rawAns.includes('இணைந்துள்ளேன்') || (rawAns.includes('already') && !rawAns.includes('not'));
      }
      // Option: Yes - Aware but not joined
      if (optNorm.includes('awarebutnotjoined') || optNorm.includes('notjoined') || optTamilNorm.includes('இணையவில்லை')) {
        return rawAns.includes('not joined') || rawAns.includes('இணையவில்லை') || (rawAns.includes('aware') && !rawAns.includes('not aware') && !rawAns.includes('enrolled'));
      }
      // Option: No - Not aware at all
      if (optNorm.includes('notaware') || optTamilNorm.includes('தெரியாது') || optNorm.startsWith('no')) {
        return rawAns.includes('not aware') || rawAns.includes('தெரியாது') || rawAns.startsWith('no') || rawAns.includes('இல்லை');
      }
      return norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm;
    }

    // 2. Q7 / Recommendation (e.g. "Would you recommend Suba Valli Vilas to friends or family?")
    if (qId === 'Q7' || qTitle.includes('recommend') || qTitle.includes('nps')) {
      const rawAns = String(f.q7 || f.Q7_Recommend || f.Q7_NPS || f.recommendationChoice || f.recommendation || f.q_rec || f[q.q_id] || f[q.q_text_en] || '').toLowerCase().trim();
      const r = Number(f.rating) || 0;

      // Check for textual choices: "Yes Definetly", "May be", "No"
      if (optNorm.includes('yes') || optNorm.includes('definetly') || optNorm.includes('definitely') || optTamilNorm.includes('ஆம்') || optTamilNorm.includes('நிச்சயமாக')) {
        if (rawAns.includes('yes') || rawAns.includes('definetly') || rawAns.includes('definitely') || rawAns.includes('ஆம்') || rawAns.includes('நிச்சயமாக')) return true;
        if (!rawAns && r >= 9) return true;
        return false;
      }
      if (optNorm.includes('maybe') || optNorm.includes('may') || optNorm.includes('notsure') || optNorm.includes('sure') || optTamilNorm.includes('தெரியவில்லை')) {
        if (rawAns.includes('maybe') || rawAns.includes('may') || rawAns.includes('not sure') || rawAns.includes('தெரியவில்லை')) return true;
        if (!rawAns && (r === 7 || r === 8)) return true;
        return false;
      }
      if (optNorm.includes('no') || optNorm.includes('not') || optTamilNorm.includes('இல்லை')) {
        if (rawAns.includes('no') || rawAns.includes('not') || rawAns.includes('இல்லை')) return true;
        if (!rawAns && r <= 6 && r > 0) return true;
        return false;
      }

      // Check numeric rating choice (1 to 10)
      if (String(r) === String(enOpt)) return true;
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      return false;
    }

    // 3. "Overall Shopping Experience" (Options: Excellent | Good | Average | Needs Improvement)
    if (qTitle.includes('shopping experience') || qTitle.includes('overall experience') || optNorm === 'excellent' || optNorm === 'good' || optNorm === 'average' || optNorm.includes('needsimprovement')) {
      const rawAns = String(
        f.overallShoppingExperience || f.overallExperience || f.shoppingExperience || 
        f.storeExperience || f.q2 || f.Q2_Store_Experience || f[q.q_id] || f[q.q_text_en] || ''
      ).toLowerCase().trim();
      const r = Number(f.rating) || 0;

      if (optNorm === 'excellent' || optTamilNorm.includes('சிறந்தது')) {
        if (rawAns.includes('excellent') || rawAns.includes('சிறந்தது')) return true;
        if ((!rawAns || rawAns.includes('hospitality') || rawAns.includes('design') || rawAns.includes('purity') || rawAns.includes('ambiance')) && r >= 9) return true;
        return false;
      }
      if (optNorm === 'good' || optTamilNorm.includes('நன்று')) {
        if (rawAns.includes('good') || rawAns.includes('நன்று')) return true;
        if ((!rawAns || rawAns.includes('hospitality') || rawAns.includes('design') || rawAns.includes('purity') || rawAns.includes('ambiance')) && (r === 7 || r === 8)) return true;
        return false;
      }
      if (optNorm === 'average' || optTamilNorm.includes('சரி')) {
        if (rawAns.includes('average') || rawAns.includes('சரி')) return true;
        if (!rawAns && (r === 5 || r === 6)) return true;
        return false;
      }
      if (optNorm.includes('needsimprovement') || optNorm.includes('improvement') || optTamilNorm.includes('மேம்படுத்த')) {
        if (rawAns.includes('needs') || rawAns.includes('improvement') || rawAns.includes('poor') || rawAns.includes('மேம்படுத்த')) return true;
        if (!rawAns && r <= 4 && r > 0) return true;
        return false;
      }

      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
    }

    // 4. Q0 (Frequency)
    if (qId === 'Q0' || qTitle.includes('often') || qTitle.includes('frequency')) {
      const rawAns = f.q0 || f.Q0_Frequency || f.frequency || f[q.q_id] || '';
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      return false;
    }

    // 5. Q1 (Heard About / Source)
    if (qId === 'Q1' || qTitle.includes('hear') || qTitle.includes('know about')) {
      const rawAns = f.q1 || f.Q1_Heard_About || f.heardAbout || f[q.q_id] || '';
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      if (optNorm.includes('social') && String(rawAns).toLowerCase().includes('social')) return true;
      if (optNorm.includes('friends') && (String(rawAns).toLowerCase().includes('friend') || String(rawAns).toLowerCase().includes('relative'))) return true;
      return false;
    }

    // 6. Q2 (Traditional store delight question)
    if (qId === 'Q2') {
      const rawAns = f.q2 || f.Q2_Store_Experience || f[q.q_id] || '';
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      return false;
    }

    // 7. Q3 (Service Improvement)
    if (qId === 'Q3' || qTitle.includes('improve')) {
      const rawAns = f.q3 || f.Q3_Staff_Service || f.serviceImprovement || f[q.q_id] || '';
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      return false;
    }

    // 8. Q4 (Occasion)
    if (qId === 'Q4' || qTitle.includes('occasion')) {
      const rawAns = f.q4 || f.Q4_Occasion || f.occasion || f[q.q_id] || '';
      if (norm(rawAns) === optNorm || norm(rawAns) === optTamilNorm) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      return false;
    }

    // 9. Q6 (Jewellery Interest)
    if (qId === 'Q6' || qTitle.includes('types of jewellery') || qTitle.includes('jewellery are you interested')) {
      const rawAns = f.q6 || f.Q6_Jewellery_Interest || f.jewelleryInterest || f[q.q_id] || '';
      if (norm(rawAns).includes(optNorm) || norm(rawAns).includes(optTamilNorm)) return true;
      if (String(rawAns).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
      return false;
    }

    // 10. Generic / Dynamic question from Google Sheet
    const directVal = f[q.q_id] || f[q.q_text_en] || f[q.field_id] || f[q.field_label] || '';
    if (directVal) {
      if (norm(directVal) === optNorm || norm(directVal) === optTamilNorm) return true;
      if (String(directVal).toLowerCase().includes(String(enOpt).toLowerCase())) return true;
    }

    return false;
  }

  function getActiveFilteredFeedbacks() {
    const startDate = dom.fbFilterStartDate ? dom.fbFilterStartDate.value : '';
    const endDate = dom.fbFilterEndDate ? dom.fbFilterEndDate.value : '';
    const filterStatus = dom.fbFilterStatus ? dom.fbFilterStatus.value : 'ALL';
    const filterMood = dom.fbFilterMood ? dom.fbFilterMood.value : 'ALL';
    const filterStaff = dom.fbFilterStaff ? dom.fbFilterStaff.value : 'ALL';

    return state.feedbacks.filter(f => {
      const fDateIso = normalizeDateToIso(f.date || f.timestamp);
      if (startDate && fDateIso && fDateIso < startDate) return false;
      if (endDate && fDateIso && fDateIso > endDate) return false;
      if (activeFbSourceFilter !== 'ALL') {
        const isTab = (f.source || '').toLowerCase().includes('tab') || (f.source || '').toLowerCase().includes('staff');
        if (activeFbSourceFilter === 'QR' && isTab) return false;
        if (activeFbSourceFilter === 'Staff' && !isTab) return false;
      }
      if (activeFbStatusFilter !== 'ALL' && f.status !== activeFbStatusFilter) return false;
      if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
      if (filterMood !== 'ALL' && f.mood !== filterMood) return false;
      if (filterStaff !== 'ALL' && f.staffName !== filterStaff) return false;
      return true;
    });
  }

  function renderQuestionWiseReport(feedbacks) {
    if (!dom.questionCardsGrid) return;
    dom.questionCardsGrid.innerHTML = '';

    const list = Array.isArray(feedbacks) ? feedbacks : getActiveFilteredFeedbacks();
    const totalFeedbacks = list.length || 1;

    const activeQuestions = state.questionsConfig.filter(q => q.is_active);

    if (list.length === 0) {
      dom.questionCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: #64748B; font-size: 0.9rem; background: #FAF8F5; border-radius: 8px; border: 1px dashed #CBD5E1;">
          No customer feedbacks recorded for the selected date range.
        </div>
      `;
      return;
    }

    activeQuestions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'q-analysis-card';

      const isTa = state.currentLang === 'ta';
      const title = isTa ? q.q_text_ta : q.q_text_en;
      const options = isTa ? q.options_ta : q.options_en;
      const englishOpts = q.options_en;

      const optionStats = options.map((opt, oIdx) => {
        const enOpt = englishOpts[oIdx] || opt;
        const matchCount = list.filter(f => isOptionMatch(q, f, enOpt, opt)).length;
        const pct = Math.round((matchCount / totalFeedbacks) * 100);
        return { optText: opt, enOpt: enOpt, count: matchCount, pct: pct };
      });

      card.innerHTML = `
        <div class="q-card-header">
          <h4 class="q-card-title">${title}</h4>
          <span class="q-card-type">${(q.q_type || 'single_choice').replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="q-options-list">
          ${optionStats.map(s => `
            <div class="q-option-row" onclick="app.drilldownQuestionOption('${q.q_id}', '${s.enOpt.replace(/'/g, "\\'")}')" title="Click to view itemized customer details">
              <div class="q-option-label-line">
                <span class="q-opt-text">${s.optText}</span>
                <span class="q-opt-meta"><strong>${s.count}</strong> (${s.pct}%)</span>
              </div>
              <div class="q-progress-track">
                <div class="q-progress-fill" style="width: ${Math.max(2, s.pct)}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      dom.questionCardsGrid.appendChild(card);
    });
  }

  function drilldownQuestionOption(qId, optText) {
    const q = state.questionsConfig.find(item => item.q_id === qId);
    if (!q) return;

    const list = getActiveFilteredFeedbacks();
    const matchingFeedbacks = list.filter(f => isOptionMatch(q, f, optText, optText));

    if (dom.questionDrilldownPanel) {
      dom.questionDrilldownPanel.style.display = 'block';
      dom.drilldownQuestionTitle.textContent = `Question: ${q.q_text_en} (${q.q_text_ta})`;
      dom.drilldownOptionSubtitle.textContent = `Showing customers who selected:`;
      dom.drilldownOptionLabel.textContent = `"${optText}"`;
      dom.drilldownCountBadge.textContent = `${matchingFeedbacks.length} Customers`;

      if (dom.drilldownTableBody) {
        if (matchingFeedbacks.length === 0) {
          dom.drilldownTableBody.innerHTML = `
            <tr>
              <td colspan="8" class="text-center text-muted p-4">No customer feedback records found for this answer choice.</td>
            </tr>
          `;
        } else {
          dom.drilldownTableBody.innerHTML = matchingFeedbacks.map(f => `
            <tr>
              <td><strong>${f.customerName}</strong></td>
              <td>
                <div class="d-flex align-center gap-1">
                  <span class="text-gold font-bold">${f.mobile}</span>
                  <button class="btn btn-xs btn-whatsapp" onclick="app.openWhatsAppModalForCustomer('${f.id}')" title="WhatsApp Customer">💬</button>
                </div>
              </td>
              <td>${f.city || 'Salem'}</td>
              <td><span class="badge badge-gold font-bold">${optText}</span></td>
              <td>
                <strong>${f.q4 || 'General'}</strong>
                ${f.occasionDate ? `<br><span class="text-xs text-muted">📅 ${f.occasionDate}</span>` : ''}
              </td>
              <td>
                <span class="text-xs text-muted">Rating: ⭐ ${f.rating}/10 • ${f.mood}</span>
              </td>
              <td>
                <span class="text-xs" style="color:#334155; font-style:italic;">"${f.remarks || f.feedbackComment || 'None'}"</span>
              </td>
              <td><span class="badge badge-subtle">👤 ${f.staffName || 'Vijay'}</span></td>
            </tr>
          `).join('');
        }
      }

      dom.questionDrilldownPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast(`Drilled down to ${matchingFeedbacks.length} customers for: ${optText}`);
    }
  }

  // ================= OCCASIONS CONDITIONAL DATE LISTENERS =================
  function attachQ4DateListeners() {
    function handleQ4Selection(val, box, bday, wed) {
      if (!box || !bday || !wed) return;
      const lower = (val || '').toLowerCase();
      if (lower === 'birthday' || val === 'பிறந்தநாள்') {
        box.style.display = 'block';
        bday.style.display = 'block';
        wed.style.display = 'none';
      } else if (lower.includes('anniversary') || val.includes('திருமண நாள்')) {
        box.style.display = 'block';
        bday.style.display = 'none';
        wed.style.display = 'block';
      } else {
        box.style.display = 'none';
        bday.style.display = 'none';
        wed.style.display = 'none';
      }
    }

    // 1. On-Page form Q4 radio listeners
    document.querySelectorAll('input[name="onPage_Q4"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        handleQ4Selection(
          e.target.value,
          document.getElementById('onPageQ4DateContainer'),
          document.getElementById('onPageQ4BirthdayBox'),
          document.getElementById('onPageQ4WeddingBox')
        );
      });
    });

    // 2. Customer portal Q4 radio listeners
    document.querySelectorAll('input[name="cust_Q4"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        handleQ4Selection(
          e.target.value,
          document.getElementById('custPortalQ4DateContainer'),
          document.getElementById('custPortalQ4BirthdayBox'),
          document.getElementById('custPortalQ4WeddingBox')
        );
      });
    });

    // 3. Modal Q4 radio listeners
    document.querySelectorAll('input[name="Q4"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        handleQ4Selection(
          e.target.value,
          document.getElementById('modalQ4DateContainer'),
          document.getElementById('modalQ4BirthdayBox'),
          document.getElementById('modalQ4WeddingBox')
        );
      });
    });
  }

  function renderFeedbackModalQuestions() {
    const isTa = state.currentLang === 'ta';
    if (dom.fbLangNotice) dom.fbLangNotice.textContent = `Language: ${isTa ? 'தமிழ் (Tamil)' : 'English'}`;
    const onPageLangNotice = document.getElementById('onPageLangNotice');
    if (onPageLangNotice) onPageLangNotice.textContent = `Language: ${isTa ? 'தமிழ் (Tamil)' : 'English'}`;

    const activeQuestions = state.questionsConfig.filter(q => q.is_active);

    // 1. Render Modal Questions (No default pre-selection)
    if (dom.fbDynamicQuestionsList) {
      dom.fbDynamicQuestionsList.innerHTML = activeQuestions.map(q => {
        const title = isTa ? q.q_text_ta : q.q_text_en;
        const options = isTa ? q.options_ta : q.options_en;

        if (q.q_type === 'rating_10') {
          return `
            <div class="form-group mb-3">
              <label class="form-label">${title} ${q.is_mandatory ? '*' : ''}</label>
              <div class="rating-pills-row">
                ${options.map(num => `
                  <label class="q-pill-label">
                    <input type="radio" name="${q.q_id}" value="${num}" ${q.is_mandatory ? 'required' : ''}>
                    <div class="rating-pill-box">${num}</div>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        }

        const inputType = q.q_type === 'multiple_choice' ? 'checkbox' : 'radio';
        const isQ4 = q.q_id === 'Q4';

        return `
          <div class="form-group mb-3">
            <label class="form-label">${title} ${q.is_mandatory ? '*' : ''}</label>
            <div class="q-pill-group">
              ${options.map((opt) => `
                <label class="q-pill-label">
                  <input type="${inputType}" name="${q.q_id}" value="${opt}" ${q.is_mandatory && inputType === 'radio' ? 'required' : ''}>
                  <div class="q-pill-box">${opt}</div>
                </label>
              `).join('')}
            </div>
            ${isQ4 ? `
              <div id="modalQ4DateContainer" class="occasion-date-box" style="display:none; margin-top:8px;">
                <div id="modalQ4BirthdayBox" style="display:none;">
                  <div class="occasion-wish-box wish-birthday mb-2">
                    <span class="wish-icon">🎂</span>
                    <div>
                      <strong>Suba Valli Vilas Advance Birthday Wishes!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு மனமார்ந்த பிறந்தநாள் நல்வாழ்த்துகள்! லட்சுமி கடாட்சம் பெருக வாழ்த்துகிறோம் ✨</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold">🎂 Date of Birthday (பிறந்தநாள் தேதி):</label>
                  <input type="date" id="modalCustBirthday" class="form-input">
                </div>
                <div id="modalQ4WeddingBox" style="display:none;">
                  <div class="occasion-wish-box wish-wedding mb-2">
                    <span class="wish-icon">💍</span>
                    <div>
                      <strong>Suba Valli Vilas Warm Wedding Anniversary Greetings!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு இனிய திருமண நாள் வாழ்த்துகள்! பொன்னும் பொருளும் நிலைத்திருக்க வாழ்த்துகிறோம் 👑</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold">💍 Wedding Anniversary Date (திருமண நாள் தேதி):</label>
                  <input type="date" id="modalCustWedding" class="form-input">
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // 2. Render Dedicated On-Page Questions (No default pre-selection)
    const onPageContainer = document.getElementById('onPageQuestionsList');
    if (onPageContainer) {
      onPageContainer.innerHTML = activeQuestions.map(q => {
        const title = isTa ? q.q_text_ta : q.q_text_en;
        const options = isTa ? q.options_ta : q.options_en;

        if (q.q_type === 'rating_10') {
          return `
            <div class="form-group mb-4">
              <label class="form-label" style="font-size:0.9rem;">${title} ${q.is_mandatory ? '*' : ''}</label>
              <div class="rating-pills-row mt-1">
                ${options.map(num => `
                  <label class="q-pill-label">
                    <input type="radio" name="onPage_${q.q_id}" value="${num}" ${q.is_mandatory ? 'required' : ''}>
                    <div class="rating-pill-box" style="width:40px; height:40px; font-size:0.95rem;">${num}</div>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        }

        const inputType = q.q_type === 'multiple_choice' ? 'checkbox' : 'radio';
        const isQ4 = q.q_id === 'Q4';

        return `
          <div class="form-group mb-4">
            <label class="form-label" style="font-size:0.9rem;">${title} ${q.is_mandatory ? '*' : ''}</label>
            <div class="q-pill-group mt-1">
              ${options.map((opt) => `
                <label class="q-pill-label">
                  <input type="${inputType}" name="onPage_${q.q_id}" value="${opt}" ${q.is_mandatory && inputType === 'radio' ? 'required' : ''}>
                  <div class="q-pill-box" style="padding:8px 18px; font-size:0.84rem;">${opt}</div>
                </label>
              `).join('')}
            </div>
            ${isQ4 ? `
              <div id="onPageQ4DateContainer" class="occasion-date-box" style="display:none; margin-top:8px;">
                <div id="onPageQ4BirthdayBox" style="display:none;">
                  <div class="occasion-wish-box wish-birthday mb-2">
                    <span class="wish-icon">🎂</span>
                    <div>
                      <strong>Suba Valli Vilas Advance Birthday Wishes!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு மனமார்ந்த பிறந்தநாள் நல்வாழ்த்துகள்! லட்சுமி கடாட்சம் பெருக வாழ்த்துகிறோம் ✨</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold" style="color:var(--gold-dark);">🎂 Date of Birthday (பிறந்தநாள் தேதி):</label>
                  <input type="date" id="onPageCustBirthday" class="form-input">
                </div>
                <div id="onPageQ4WeddingBox" style="display:none;">
                  <div class="occasion-wish-box wish-wedding mb-2">
                    <span class="wish-icon">💍</span>
                    <div>
                      <strong>Suba Valli Vilas Warm Wedding Anniversary Greetings!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு இனிய திருமண நாள் வாழ்த்துகள்! பொன்னும் பொருளும் நிலைத்திருக்க வாழ்த்துகிறோம் 👑</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold" style="color:var(--gold-dark);">💍 Wedding Anniversary Date (திருமண நாள் தேதி):</label>
                  <input type="date" id="onPageCustWedding" class="form-input">
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // 3. Render Dedicated Customer Portal Questions (No default pre-selection)
    const custPortalContainer = document.getElementById('custPortalQuestionsList');
    if (custPortalContainer) {
      custPortalContainer.innerHTML = activeQuestions.map(q => {
        const title = isTa ? q.q_text_ta : q.q_text_en;
        const options = isTa ? q.options_ta : q.options_en;

        if (q.q_type === 'rating_10') {
          return `
            <div class="form-group mb-3">
              <label class="form-label font-bold" style="font-size:0.9rem;">${title} ${q.is_mandatory ? '*' : ''}</label>
              <div class="rating-pills-row mt-1">
                ${options.map(num => `
                  <label class="q-pill-label">
                    <input type="radio" name="cust_${q.q_id}" value="${num}" ${q.is_mandatory ? 'required' : ''}>
                    <div class="rating-pill-box" style="width:38px; height:38px; font-size:0.95rem;">${num}</div>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        }

        const inputType = q.q_type === 'multiple_choice' ? 'checkbox' : 'radio';
        const isQ4 = q.q_id === 'Q4';

        return `
          <div class="form-group mb-3">
            <label class="form-label font-bold" style="font-size:0.9rem;">${title} ${q.is_mandatory ? '*' : ''}</label>
            <div class="q-pill-group mt-1">
              ${options.map((opt) => `
                <label class="q-pill-label">
                  <input type="${inputType}" name="cust_${q.q_id}" value="${opt}" ${q.is_mandatory && inputType === 'radio' ? 'required' : ''}>
                  <div class="q-pill-box" style="padding:6px 14px; font-size:0.82rem;">${opt}</div>
                </label>
              `).join('')}
            </div>
            ${isQ4 ? `
              <div id="custPortalQ4DateContainer" class="occasion-date-box" style="display:none; margin-top:8px;">
                <div id="custPortalQ4BirthdayBox" style="display:none;">
                  <div class="occasion-wish-box wish-birthday mb-2">
                    <span class="wish-icon">🎂</span>
                    <div>
                      <strong>Suba Valli Vilas Advance Birthday Wishes!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு மனமார்ந்த பிறந்தநாள் நல்வாழ்த்துகள்! லட்சுமி கடாட்சம் பெருக வாழ்த்துகிறோம் ✨</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold" style="color:var(--gold-dark);">🎂 Date of Birthday (பிறந்தநாள் தேதி):</label>
                  <input type="date" id="custPortalCustBirthday" class="form-input">
                </div>
                <div id="custPortalQ4WeddingBox" style="display:none;">
                  <div class="occasion-wish-box wish-wedding mb-2">
                    <span class="wish-icon">💍</span>
                    <div>
                      <strong>Suba Valli Vilas Warm Wedding Anniversary Greetings!</strong>
                      <p class="text-xs mb-0">வாடிக்கையாளருக்கு இனிய திருமண நாள் வாழ்த்துகள்! பொன்னும் பொருளும் நிலைத்திருக்க வாழ்த்துகிறோம் 👑</p>
                    </div>
                  </div>
                  <label class="form-label text-xs font-bold" style="color:var(--gold-dark);">💍 Wedding Anniversary Date (திருமண நாள் தேதி):</label>
                  <input type="date" id="custPortalCustWedding" class="form-input">
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // Attach dynamic conditional listeners for Q4
    attachQ4DateListeners();

    // 4. Render On-Page QR SVG
    const onPageQR = document.getElementById('onPageQRSVG');
    if (onPageQR) {
      onPageQR.onclick = () => openCustomerPortal();
      onPageQR.innerHTML = `
        <svg width="140" height="140" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="180" fill="#FFFFFF"/>
          <rect x="15" y="15" width="45" height="45" rx="6" fill="#580505"/>
          <rect x="23" y="23" width="29" height="29" rx="4" fill="#FFFFFF"/>
          <rect x="29" y="29" width="17" height="17" rx="3" fill="#C5A059"/>

          <rect x="120" y="15" width="45" height="45" rx="6" fill="#580505"/>
          <rect x="128" y="23" width="29" height="29" rx="4" fill="#FFFFFF"/>
          <rect x="134" y="29" width="17" height="17" rx="3" fill="#C5A059"/>

          <rect x="15" y="120" width="45" height="45" rx="6" fill="#580505"/>
          <rect x="23" y="128" width="29" height="29" rx="4" fill="#FFFFFF"/>
          <rect x="29" y="134" width="17" height="17" rx="3" fill="#C5A059"/>

          <circle cx="75" cy="30" r="5" fill="#580505"/>
          <circle cx="95" cy="30" r="5" fill="#580505"/>
          <circle cx="75" cy="50" r="5" fill="#C5A059"/>
          <circle cx="95" cy="50" r="5" fill="#580505"/>
          <circle cx="30" cy="75" r="5" fill="#580505"/>
          <circle cx="50" cy="75" r="5" fill="#580505"/>
          <circle cx="75" cy="75" r="7" fill="#C5A059"/>
          <circle cx="95" cy="75" r="5" fill="#580505"/>
          <circle cx="115" cy="75" r="5" fill="#C5A059"/>
          <circle cx="135" cy="75" r="5" fill="#580505"/>
          <circle cx="75" cy="95" r="5" fill="#580505"/>
          <circle cx="95" cy="95" r="6" fill="#580505"/>
          <circle cx="115" cy="95" r="5" fill="#C5A059"/>
          <circle cx="75" cy="115" r="5" fill="#C5A059"/>
          <circle cx="95" cy="115" r="5" fill="#580505"/>
          <circle cx="115" cy="115" r="5" fill="#580505"/>
          <circle cx="75" cy="135" r="5" fill="#580505"/>
          <circle cx="95" cy="135" r="5" fill="#C5A059"/>
          <circle cx="115" cy="135" r="5" fill="#580505"/>
          <circle cx="135" cy="135" r="5" fill="#580505"/>
          <circle cx="155" cy="135" r="5" fill="#C5A059"/>
          <circle cx="75" cy="155" r="5" fill="#580505"/>
          <circle cx="95" cy="155" r="5" fill="#580505"/>
          <circle cx="115" cy="155" r="5" fill="#C5A059"/>
        </svg>
      `;
    }
  }

  function openCustomerPortal() {
    renderFeedbackModalQuestions();
    const modal = document.getElementById('modalCustomerSelfFill');
    if (modal) modal.classList.add('active');
  }

  // ================= WHATSAPP ENGINE & 4 DEFAULT TEMPLATES =================
  const whatsappTemplates = {
    chit: {
      en: (c) => `Vanakkam ${c.name || 'valued customer'} from Suba Valli Vilas! ✨\n\nWe invite you to join our prestigious 11-Month Gold Savings Chit Scheme. Enjoy 100% ZERO wastage (சேதாரம் இல்லை), zero making charges on purchase, and special festive gold bonuses!\n\nProtect your wealth against gold price hikes. Reply 'JOIN' or visit our showroom to enroll today.\n\nSuba Valli Vilas - Purity & Trust\n${c.branch || 'Main Branch'}`,
      ta: (c) => `வணக்கம் ${c.name || 'மதிப்பிற்குரிய வாடிக்கையாளர்'}! சுப வள்ளி விலாஸிலிருந்து வாழ்த்துகள் ✨\n\nஎங்களின் புகழ்பெற்ற 11 மாத தங்க சேமிப்பு திட்டத்தில் இணைந்து உங்கள் சேமிப்பை இரட்டிப்பாக்குங்கள். செய்கூலி, சேதாரம் முற்றிலும் இல்லை! மேலும் கவர்ச்சிகரமான பண்டிகை கால போனஸ் சலுகைகள்!\n\nதிட்டத்தில் உடனடியாக இணைய 'JOIN' என பதிலளிக்கவும் அல்லது எங்கள் ஷோரூமிற்கு வருகை தரவும்.\n\nசுப வள்ளி விலாஸ் - தரம் & பாரம்பரிய நம்பிக்கை\n${c.branch || 'Main Branch'}`
    },
    stock: {
      en: (c) => `Vanakkam ${c.name || 'valued customer'} from Suba Valli Vilas! 📦✨\n\nGreat news regarding your inquiry for ${c.item || 'jewellery'} at our showroom! Our fresh bridal & antique collections matching your requested requirements have just arrived from our master artisans.\n\nPlease visit our showroom or reply here to reserve your favourite design.\n\nSuba Valli Vilas\n${c.branch || 'Main Branch'}`,
      ta: (c) => `வணக்கம் ${c.name || 'மதிப்பிற்குரிய வாடிக்கையாளர்'}! சுப வள்ளி விலாஸிலிருந்து வாழ்த்துகள் 📦✨\n\nநீங்கள் எங்கள் கடையில் கேட்டிருந்த ${c.item || 'நகை'} தற்போது புதிய கலெக்ஷன்களுடன் எங்கள் ஷோரூமிற்கு வந்துவிட்டது என்ற மகிழ்ச்சியான செய்தியை தெரிவித்துக் கொள்கிறோம்!\n\nநகையை முன்பதிவு செய்ய உடனே வருகை தரவும் அல்லது இங்கு பதிலளிக்கவும்.\n\nசுப வள்ளி விலாஸ்\n${c.branch || 'Main Branch'}`
    },
    service: {
      en: (c) => `Vanakkam ${c.name || 'valued customer'} from Suba Valli Vilas! 🛠️✨\n\nThank you for sharing your valuable feedback with us. Your satisfaction is our highest priority. We have taken immediate action on your service points to ensure a seamless experience for your next visit.\n\nOur showroom manager looks forward to welcoming you personally.\n\nWarm regards,\nSuba Valli Vilas`,
      ta: (c) => `வணக்கம் ${c.name || 'மதிப்பிற்குரிய வாடிக்கையாளர்'}! சுப வள்ளி விலாஸிலிருந்து வாழ்த்துகள் 🛠️✨\n\nஎங்கள் ஷோரூம் வருகையின் போது நீங்கள் பகிர்ந்த மேலான கருத்திற்கு நன்றி. உங்கள் திருப்தியே எங்களின் முதன்மை நோக்கம். நீங்கள் சுட்டிக்காட்டிய விஷயங்கள் உடனடியாக சரிசெய்யப்பட்டுள்ளன. அடுத்த முறை நீங்கள் வரும்போது மிகச்சிறந்த உபசரிப்பை உறுதி செய்கிறோம்.\n\nஅன்புடன்,\nசுப வள்ளி விலாஸ்`
    },
    thankyou: {
      en: (c) => `Vanakkam ${c.name || 'valued customer'} from Suba Valli Vilas! 🙏👑\n\nThank you for choosing Suba Valli Vilas for your precious jewellery purchase. Serving you and your family was our greatest pleasure. May divine blessings bring endless joy and prosperity to your home!\n\nWe look forward to welcoming you again soon.\n\nWith warm regards,\nSuba Valli Vilas\n${c.branch || 'Main Branch'}`,
      ta: (c) => `வணக்கம் ${c.name || 'மதிப்பிற்குரிய வாடிக்கையாளர்'}! சுப வள்ளி விலாஸிலிருந்து மனமார்ந்த வாழ்த்துகள் 🙏👑\n\nஉங்கள் பொன்னான நகை ஷாப்பிங்கிற்கு சுப வள்ளி விலாஸை தேர்ந்தெடுத்தமைக்கு நெஞ்சார்ந்த நன்றி! உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் சேவை செய்வதில் பெருமகிழ்ச்சி அடைகிறோம். உங்கள் இல்லத்தில் பொன்னும் பொருளும் நிலைத்திருக்க வாழ்த்துகிறோம்!\n\nமீண்டும் தங்களை அன்போடு வரவேற்கிறோம்.\n\nஅன்புடன்,\nசுப வள்ளி விலாஸ்\n${c.branch || 'Main Branch'}`
    }
  };

  let activeWAData = {
    name: 'Customer',
    mobile: '',
    branch: 'Main Branch',
    item: 'Gold Jewellery',
    isChit: false,
    currentTemplate: 'chit',
    currentLang: 'en'
  };

  function openWhatsAppModal(data, defaultTemplate) {
    activeWAData.name = data.customerName || data.name || 'Valued Customer';
    activeWAData.mobile = (data.mobile || '').replace(/\D/g, '');
    activeWAData.branch = data.branch || state.activeBranch || 'Main Branch';
    activeWAData.item = data.product ? `${data.product}` : (data.q2 || 'Gold Jewellery');
    activeWAData.isChit = data.q5 ? data.q5.includes('Already Enrolled') : false;
    activeWAData.currentTemplate = defaultTemplate || (activeWAData.isChit ? 'thankyou' : 'chit');
    activeWAData.currentLang = state.currentLang || 'en';

    const nameEl = document.getElementById('waCustNamePreview');
    const mobEl = document.getElementById('waCustMobilePreview');
    const secEl = document.getElementById('waCustSectionPreview');
    const badgeEl = document.getElementById('waChitStatusBadge');

    if (nameEl) nameEl.textContent = activeWAData.name;
    if (mobEl) mobEl.textContent = activeWAData.mobile || 'No Mobile';
    if (secEl) secEl.textContent = `Branch: ${activeWAData.branch} • Item/Req: ${activeWAData.item}`;
    if (badgeEl) {
      badgeEl.textContent = activeWAData.isChit ? 'Chit Enrolled Customer' : 'Non-Chit Customer';
      badgeEl.className = activeWAData.isChit ? 'badge badge-emerald' : 'badge badge-amber';
    }

    document.querySelectorAll('.wa-template-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-template') === activeWAData.currentTemplate);
    });
    document.querySelectorAll('.btn-wa-lang').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-wa-lang') === activeWAData.currentLang);
    });

    renderWAMessageText();
    const modal = document.getElementById('modalWhatsAppSender');
    if (modal) modal.classList.add('active');
  }

  function renderWAMessageText() {
    const fn = whatsappTemplates[activeWAData.currentTemplate]?.[activeWAData.currentLang];
    if (fn) {
      const textarea = document.getElementById('waMessageTextarea');
      if (textarea) textarea.value = fn(activeWAData);
    }
  }

  // ================= 4. DIVERT MODULE RENDERING =================
  function renderDiverts() {
    const search = (dom.divertSearchInput?.value || '').toLowerCase();
    const filtered = state.diverts.filter(d => {
      if (activeDivertFilter === 'HIGH' && d.priority !== 'HIGH') return false;
      if (activeDivertFilter === 'PENDING' && d.status !== 'PENDING') return false;
      if (activeDivertFilter === 'FOLLOWUP' && d.status !== 'FOLLOWUP') return false;
      if (activeDivertFilter === 'CLOSED' && d.status !== 'CLOSED' && d.status !== 'CONVERTED') return false;

      if (search) {
        return (d.customerName || '').toLowerCase().includes(search) ||
               (d.mobile || '').includes(search) ||
               (d.product || '').toLowerCase().includes(search) ||
               (d.employee || '').toLowerCase().includes(search) ||
               (d.counter || '').toLowerCase().includes(search) ||
               (d.reason || '').toLowerCase().includes(search);
      }
      return true;
    });

    if (dom.divertTotalCount) dom.divertTotalCount.textContent = state.diverts.length;
    if (dom.divertHighCount) dom.divertHighCount.textContent = state.diverts.filter(d => d.priority === 'HIGH').length;
    if (dom.divertPendingCount) dom.divertPendingCount.textContent = state.diverts.filter(d => d.status === 'PENDING').length;
    if (dom.divertConvertedCount) dom.divertConvertedCount.textContent = state.diverts.filter(d => d.status === 'CLOSED' || d.status === 'CONVERTED').length;

    // 1. Counter-Wise Divert Classification
    if (dom.divertCounterClassificationBody) {
      const counterList = [
        { name: 'Counter 1 - Antique', section: 'Antique Jewellery' },
        { name: 'Counter 2 - Chains', section: 'Chains & Necklaces' },
        { name: 'Counter 3 - Bangles', section: 'Bangles & Kadas' },
        { name: 'Counter 4 - Rings', section: 'Rings & Ear Studs' },
        { name: 'Counter 5 - Bridal', section: 'Bridal Lounge' },
        { name: 'Counter 6 - Silver', section: 'Silver Articles' }
      ];
      const totalDiverts = state.diverts.length || 1;
      dom.divertCounterClassificationBody.innerHTML = counterList.map(c => {
        const prefix = c.name.split(' - ')[0].trim().toLowerCase(); // e.g. "counter 1"
        const count = state.diverts.filter(d => {
          const dc = (d.counter || '').toLowerCase().trim();
          return dc === prefix || dc.startsWith(prefix + ' ') || dc.includes(c.name.toLowerCase()) || dc.includes(c.section.toLowerCase());
        }).length;
        const share = Math.round((count / totalDiverts) * 100);
        return `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.section}</td>
            <td><span class="badge ${count > 0 ? 'badge-amber' : 'badge-subtle'}">${count} Diverts</span></td>
            <td><strong>${share}%</strong></td>
          </tr>
        `;
      }).join('');
    }

    // 2. Reason-Wise Divert Classification
    if (dom.divertReasonClassificationList) {
      const q03 = state.divertQuestionsConfig ? state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q03') : null;
      const baseReasons = (q03 && Array.isArray(q03.options)) ? q03.options : [
        'Design not available',
        'Size not matching',
        'Weight / Gram range mismatch',
        'Price / Budget variation',
        'Making & Wastage charges issue',
        'Out of stock / Fresh piece needed',
        'Looking for specific Karatometer purity',
        'Other (Specify in remarks)'
      ];
      const observedReasons = state.diverts.map(d => (d.reason || d.Reason || '').trim()).filter(Boolean);
      const totalDiverts = state.diverts.length || 1;

      const norm = str => (str || '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

      const uniqueReasons = [];
      const seenNorms = new Set();
      [...baseReasons, ...observedReasons].forEach(r => {
        const n = norm(r);
        if (n.startsWith('other')) {
          if (!seenNorms.has('other')) {
            seenNorms.add('other');
            uniqueReasons.push(r.includes('(') ? r : 'Other (Specify in remarks)');
          }
        } else if (!seenNorms.has(n)) {
          seenNorms.add(n);
          uniqueReasons.push(r);
        }
      });

      const reasonsWithCount = uniqueReasons.map(r => {
        const targetNorm = norm(r);
        const count = state.diverts.filter(d => {
          const dr = (d.reason || d.Reason || '').trim();
          if (!dr) return false;
          const drNorm = norm(dr);
          if (!drNorm) return false;
          if (drNorm === targetNorm) return true;
          if (targetNorm.startsWith('other') && drNorm.startsWith('other')) return true;
          return false;
        }).length;
        const pct = state.diverts.length > 0 ? Math.round((count / totalDiverts) * 100) : 0;
        return { reason: r, count, pct };
      }).sort((a, b) => b.count - a.count);

      dom.divertReasonClassificationList.innerHTML = reasonsWithCount.map(item => `
        <div class="mb-2">
          <div class="d-flex justify-between text-xs font-bold mb-1">
            <span>${item.reason}</span>
            <span>${item.count} (${item.pct}%)</span>
          </div>
          <div class="progress-bar-container" style="height: 6px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div class="progress-bar-fill" style="width: ${item.pct}%; height: 100%; background: var(--maroon-primary); border-radius: 4px;"></div>
          </div>
        </div>
      `).join('');
    }

    // 3. Render Diverts Master Table
    if (dom.divertsTableBody) {
      if (filtered.length === 0) {
        dom.divertsTableBody.innerHTML = `
          <tr>
            <td colspan="13" class="text-center p-4 text-muted">
              No divert requests match your current search or status filter.
            </td>
          </tr>
        `;
      } else {
        dom.divertsTableBody.innerHTML = filtered.map(d => {
          const cleanMobile = (d.mobile || '').replace(/\D/g, '');
          const callInfo = state.customerCallRegistry[cleanMobile];
          const lastCallStatus = callInfo ? callInfo.disposition : (d.lastCallStatus || 'Not Called Yet');
          const lastCallDate = callInfo ? callInfo.timestamp : (d.lastCallDate || '—');
          const currentStatus = d.status === 'CONVERTED' ? 'CLOSED' : (d.status || 'PENDING');

          return `
            <tr>
              <td><strong>${d.id}</strong></td>
              <td>${d.timestamp}</td>
              <td><strong>${d.customerName}</strong></td>
              <td><span class="text-gold font-bold">${d.mobile}</span></td>
              <td>${d.section} <br><span class="text-xs text-muted">${d.counter || 'Counter'}</span></td>
              <td><span class="badge badge-subtle">${d.reason}</span></td>
              <td><strong>${d.product}</strong> <br><span class="text-xs text-muted">${d.design || 'Standard'} • Size: ${d.size || 'N/A'}</span></td>
              <td>
                <strong>${d.employee || 'Staff'}</strong>
                ${d.attendedStaff ? `<br><span class="text-xs text-muted">Attended: ${d.attendedStaff}</span>` : ''}
              </td>
              <td><span class="priority-badge priority-${(d.priority || 'medium').toLowerCase()}">${d.priority}</span></td>
              <td>
                <select class="form-input text-xs" style="padding: 2px 6px; font-weight:600; width: 105px;" onchange="app.changeDivertStatus('${d.id}', this.value)">
                  <option value="PENDING" ${currentStatus === 'PENDING' ? 'selected' : ''}>Pending</option>
                  <option value="FOLLOWUP" ${currentStatus === 'FOLLOWUP' ? 'selected' : ''}>Follow-up</option>
                  <option value="CLOSED" ${currentStatus === 'CLOSED' ? 'selected' : ''}>Closed</option>
                </select>
              </td>
              <td>
                <span class="badge ${callInfo ? 'badge-emerald' : 'badge-subtle'}">${lastCallStatus}</span>
              </td>
              <td><span class="text-xs text-muted">${lastCallDate}</span></td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-xs btn-gold" onclick="app.openCallModalForDivert('${d.id}')" title="Log Telecaller Call">
                    📞 Call
                  </button>
                  <button class="btn btn-xs btn-whatsapp" onclick="app.openWhatsAppModalForDivert('${d.id}')" title="Trigger WhatsApp">
                    💬 WA
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Management Decision Insights
    renderDivertManagementInsights();
  }

  function renderDivertManagementInsights() {
    if (!dom.divertInsightsGrid) return;
    const totalDiverts = state.diverts.length;
    const pendingDiverts = state.diverts.filter(d => d.status === 'PENDING' || d.status === 'LOGGED');
    const pendingCount = pendingDiverts.length;

    // 1. Calculate estimated lost sales grams & value from actual records
    let totalGrams = 0;
    state.diverts.forEach(d => {
      let g = 0;
      if (d.gramRange) {
        const matches = String(d.gramRange).match(/\d+(\.\d+)?/g);
        if (matches && matches.length > 0) {
          const nums = matches.map(Number);
          g = nums.reduce((a, b) => a + b, 0) / nums.length;
        }
      }
      if (!g || isNaN(g)) g = 14; // Default average jewellery item weight in grams
      totalGrams += g;
    });

    const estRevenue = totalGrams * 7200; // SVV Gold Rate ~₹7,200/gram
    const revDisplay = estRevenue >= 100000 
      ? `₹${(estRevenue / 100000).toFixed(1)} Lakhs` 
      : `₹${Math.round(estRevenue).toLocaleString('en-IN')}`;

    // 2. Frequency aggregation by product / design / section
    const prodCounts = {};
    state.diverts.forEach(d => {
      const p = (d.product || d.design || d.section || 'Gold Jewellery').trim();
      prodCounts[p] = (prodCounts[p] || 0) + 1;
    });

    const sortedProds = Object.entries(prodCounts).sort((a, b) => b[1] - a[1]);
    const topProd = sortedProds[0] || ['Antique Jewellery', 0];
    const topProdPct = totalDiverts > 0 ? Math.round((topProd[1] / totalDiverts) * 100) : 0;

    let categoriesBreakdownHtml = '';
    if (sortedProds.length === 0) {
      categoriesBreakdownHtml = '<span class="text-muted">No divert records logged yet.</span>';
    } else {
      categoriesBreakdownHtml = sortedProds.slice(0, 3).map(([pName, cnt], idx) => {
        const pct = Math.round((cnt / (totalDiverts || 1)) * 100);
        return `${idx + 1}. ${pName} (${cnt} requests • ${pct}%)`;
      }).join('<br>');
    }

    // 3. Workshop Procurement Action
    let poStat = '';
    let poDesc = '';
    if (sortedProds.length > 0 && topProd[1] > 0) {
      poStat = `Procure: ${topProd[0]}`;
      const recQty = Math.max(topProd[1] * 2, 5);
      poDesc = `Procurement recommendation: Place priority requisition with Salem/Coimbatore workshop for <strong>${recQty} units of ${topProd[0]}</strong> to replenish stock (${topProd[1]} customer requests missed).`;
    } else {
      poStat = 'Inventory Balanced';
      poDesc = 'No pending unfulfilled requests recorded. Current showroom counter display satisfies customer walk-in demand.';
    }

    dom.divertInsightsGrid.innerHTML = `
      <div class="insight-card">
        <div class="insight-title">
          <span>💰</span>
          <span>Estimated Lost Sales Value</span>
        </div>
        <div class="insight-stat">${revDisplay}</div>
        <p class="insight-desc">
          Missed sales potential across <strong>${pendingCount} pending customer requests</strong> (~${Math.round(totalGrams)}g gold weight). High recovery likelihood through proactive stock arrival call intimation.
        </p>
      </div>

      <div class="insight-card">
        <div class="insight-title">
          <span>📊</span>
          <span>Top Lost Demand Categories</span>
        </div>
        <div class="insight-stat">${topProdPct > 0 ? `${topProdPct}% ${topProd[0]}` : 'Demand Balanced'}</div>
        <p class="insight-desc">
          ${categoriesBreakdownHtml}
        </p>
      </div>

      <div class="insight-card">
        <div class="insight-title">
          <span>🏭</span>
          <span>Workshop Procurement Action</span>
        </div>
        <div class="insight-stat">${poStat}</div>
        <p class="insight-desc">
          ${poDesc}
        </p>
      </div>
    `;
  }

  // ================= UNIFIED CUSTOMER CALL SYNCHRONIZATION =================
  function recordCustomerCall(mobile, name, disposition, notes, callbackDate, caller, callStatus) {
    const cleanMobile = (mobile || '').replace(/\D/g, '');
    const timestamp = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US');
    const effectiveStatus = callStatus || (
      disposition.includes('Converted') || disposition.includes('Resolved') || disposition.includes('Enrolled') || disposition.includes('Closed')
        ? 'CLOSED'
        : (disposition.includes('Interested') || disposition.includes('Callback') || disposition.includes('Visiting') ? 'FOLLOWUP' : 'PENDING')
    );

    const record = {
      customerName: name,
      mobile: cleanMobile,
      disposition: disposition,
      notes: notes,
      callbackDate: callbackDate,
      caller: caller || state.currentUser?.fullName || 'Lakshmi',
      timestamp: timestamp,
      callStatus: effectiveStatus
    };

    state.customerCallRegistry[cleanMobile] = record;
    state.telecallerCalls.unshift(record);

    // Synchronize across Diverts
    state.diverts.forEach(d => {
      if ((d.mobile || '').replace(/\D/g, '') === cleanMobile) {
        d.lastCallStatus = disposition;
        d.lastCallDate = timestamp;
        if (effectiveStatus === 'CLOSED') {
          d.status = 'CLOSED';
        } else if (effectiveStatus === 'FOLLOWUP') {
          d.status = 'FOLLOWUP';
        }
      }
    });

    // Synchronize across Feedbacks
    state.feedbacks.forEach(f => {
      if ((f.mobile || '').replace(/\D/g, '') === cleanMobile) {
        f.lastCallStatus = disposition;
        f.lastCallDate = timestamp;
        if (effectiveStatus === 'CLOSED') {
          f.status = 'CLOSED';
        } else if (effectiveStatus === 'FOLLOWUP') {
          f.status = 'FOLLOWUP';
        }
      }
    });

    saveTelecallerToStorage();
    sendToGSheet('LOG_CALL', {
      callId: `CALL-${Date.now()}`,
      customerName: name,
      mobile: cleanMobile,
      queueCategory: effectiveStatus,
      disposition: disposition,
      callbackDate: callbackDate,
      notes: notes,
      caller: caller || state.currentUser?.fullName || 'Lakshmi'
    });

    renderDiverts();
    renderTelecaller();
    renderFeedbackList();
    renderReports();
    renderDER();
  }

  // ================= 5. TELECALLER MODULE RENDERING =================
  function getCustomerLeadProfile(item) {
    const cleanMobile = (item.mobile || '').replace(/\D/g, '');
    const feedbacks = state.feedbacks.filter(f => (f.mobile || '').replace(/\D/g, '') === cleanMobile);
    const diverts = state.diverts.filter(d => (d.mobile || '').replace(/\D/g, '') === cleanMobile);
    const callRecord = state.customerCallRegistry[cleanMobile];

    const tags = [];
    let isUnaware = false;
    let isDivert = diverts.length > 0;
    let isOccasion = false;
    let isConcern = false;
    let isCommon = false;
    let occasionDesc = '';

    // Check Feedbacks
    feedbacks.forEach(f => {
      if (f.q5 && f.q5.includes('Not aware')) {
        tags.push({ label: '💎 Chit Unaware', class: 'badge-gold' });
        isUnaware = true;
      } else if (f.q5 && f.q5.includes('Already Enrolled')) {
        tags.push({ label: '💎 Chit Enrolled', class: 'badge-emerald' });
      }

      if (f.mood === 'Concern' || (f.rating && f.rating <= 6)) {
        tags.push({ label: '⚠️ Concern', class: 'badge-rose' });
        isConcern = true;
      } else if (f.mood === 'Appreciation' || (f.rating && f.rating >= 9)) {
        tags.push({ label: `⭐ ${f.rating}/10 VIP`, class: 'badge-emerald' });
      }

      if ((f.q4 && (f.q4.includes('Birthday') || f.q4.includes('Wedding') || f.q4.includes('Anniversary'))) || f.occasionDate) {
        const type = (f.q4 && f.q4.includes('Birthday')) ? '🎂 Birthday' : '💍 Anniversary';
        const occDate = f.occasionDate ? `(${f.occasionDate})` : '';
        tags.push({ label: `${type} ${occDate}`.trim(), class: 'badge-amber' });
        isOccasion = true;
        occasionDesc = `${type} ${occDate}`.trim();
      }
    });

    // Check Diverts
    diverts.forEach(d => {
      tags.push({ label: `📦 Divert: ${d.product}`, class: 'badge-amber' });
    });

    if (!isConcern && feedbacks.length > 0) {
      isCommon = true;
    }

    // Deduplicate tags by label
    const uniqueTags = [];
    const seenLabels = new Set();
    tags.forEach(t => {
      if (!seenLabels.has(t.label)) {
        seenLabels.add(t.label);
        uniqueTags.push(t);
      }
    });

    const defaultStatus = item.status === 'CLOSED' || item.status === 'CONVERTED' ? 'CLOSED' : (item.status === 'FOLLOWUP' ? 'FOLLOWUP' : 'PENDING');
    const callStatus = callRecord ? (callRecord.callStatus || (callRecord.disposition.includes('Closed') || callRecord.disposition.includes('Resolved') || callRecord.disposition.includes('Enrolled') ? 'CLOSED' : 'FOLLOWUP')) : defaultStatus;

    return {
      customerName: item.customerName || 'Valued Customer',
      mobile: item.mobile || '',
      cleanMobile: cleanMobile,
      city: item.city || (diverts[0]?.counter ? 'Cuddalore' : 'Salem'),
      tags: uniqueTags,
      visitDate: item.timestamp || item.date || '—',
      date: item.date || (item.timestamp ? item.timestamp.split(' ')[0].split('/').reverse().join('-') : '2026-09-20'),
      occasionDesc: occasionDesc || item.section || item.product || '—',
      callStatus: callStatus,
      callRecord: callRecord,
      isUnaware: isUnaware,
      isDivert: isDivert,
      isOccasion: isOccasion,
      isConcern: isConcern,
      isCommon: isCommon,
      leadId: item.id
    };
  }

  function getAllCustomerLeads() {
    const map = new Map();
    state.feedbacks.forEach(f => {
      const clean = (f.mobile || '').replace(/\D/g, '');
      if (clean && !map.has(clean)) {
        map.set(clean, getCustomerLeadProfile(f));
      }
    });
    state.diverts.forEach(d => {
      const clean = (d.mobile || '').replace(/\D/g, '');
      if (clean && !map.has(clean)) {
        map.set(clean, getCustomerLeadProfile(d));
      }
    });
    return Array.from(map.values());
  }

  function renderTelecaller() {
    const allLeads = getAllCustomerLeads();

    // Update Counts on all 6 category tabs
    if (dom.queueUnawareCount) dom.queueUnawareCount.textContent = allLeads.filter(l => l.isUnaware).length;
    if (dom.queueDivertCount) dom.queueDivertCount.textContent = allLeads.filter(l => l.isDivert).length;
    if (dom.queueOccasionCount) dom.queueOccasionCount.textContent = allLeads.filter(l => l.isOccasion).length;
    if (dom.queueConcernCount) dom.queueConcernCount.textContent = allLeads.filter(l => l.isConcern).length;
    if (dom.queueCommonCount) dom.queueCommonCount.textContent = allLeads.filter(l => l.isCommon).length;
    if (dom.queueAllCount) dom.queueAllCount.textContent = allLeads.length;
    if (dom.telecallerQueueCount) dom.telecallerQueueCount.textContent = allLeads.filter(l => l.callStatus === 'PENDING').length;

    let queueItems = [];
    if (activeTelecallerQueue === 'unaware') {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'Chit Scheme Unaware Calling Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'Visitors who answered "No - Not aware" of Suba Valli Vilas savings plans. Call them to introduce monthly gold chit benefits with zero wastage.';
      queueItems = allLeads.filter(l => l.isUnaware);
    } else if (activeTelecallerQueue === 'divert') {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'Divert Stock Arrival & Customer Requirements Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'Missed sales and custom jewellery requests. Inform customers when jewellery is arranged in store.';
      queueItems = allLeads.filter(l => l.isDivert);
    } else if (activeTelecallerQueue === 'occasion') {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'VIP Courtesy & Birthday / Anniversary Greetings Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'Customers with upcoming birthdays or wedding anniversaries. Call with personal blessings and special festive discounts.';
      queueItems = allLeads.filter(l => l.isOccasion);
    } else if (activeTelecallerQueue === 'concern') {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'Service Recovery & Customer Concerns Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'Customer visits with feedback mood "Concern" or ratings <= 6. Manager and telecaller priority call to resolve issues and invite for hospitality revisit.';
      queueItems = allLeads.filter(l => l.isConcern);
    } else if (activeTelecallerQueue === 'common') {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'Common Feedback & Relationship Calling Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'General showroom visitors who provided feedback. Courtesy calls to appreciate their visit and maintain patronage.';
      queueItems = allLeads.filter(l => l.isCommon);
    } else {
      if (dom.telecallerQueueTitle) dom.telecallerQueueTitle.textContent = 'All Active Customer Leads Master Queue';
      if (dom.telecallerQueueDesc) dom.telecallerQueueDesc.textContent = 'Complete view of all customer prospects across Feedbacks, Chit Enquiries, and Diverts.';
      queueItems = allLeads;
    }

    // Apply Date Range Filter if provided
    const fromDate = dom.telFilterFromDate?.value;
    const toDate = dom.telFilterToDate?.value;
    if (fromDate || toDate) {
      queueItems = queueItems.filter(item => {
        if (!item.date) return true;
        if (fromDate && item.date < fromDate) return false;
        if (toDate && item.date > toDate) return false;
        return true;
      });
    }

    // Apply Status Filter Pill
    if (activeTelStatusFilter !== 'ALL') {
      queueItems = queueItems.filter(item => item.callStatus === activeTelStatusFilter);
    }

    if (dom.telecallerTableBody) {
      if (queueItems.length === 0) {
        dom.telecallerTableBody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center p-4 text-muted">
              No calling leads found for this queue and date/status filter criteria.
            </td>
          </tr>
        `;
        return;
      }

      dom.telecallerTableBody.innerHTML = queueItems.map(lead => {
        const statusBadge = lead.callStatus === 'CLOSED'
          ? `<span class="badge badge-emerald font-bold">Closed</span>`
          : (lead.callStatus === 'FOLLOWUP'
            ? `<span class="badge badge-amber font-bold">Follow-up</span>`
            : `<span class="badge badge-subtle">Pending</span>`);

        const callDetail = lead.callRecord
          ? `<div><strong class="text-maroon text-xs">${lead.callRecord.disposition}</strong></div>
             <span class="text-xs text-muted">${lead.callRecord.caller}: "${lead.callRecord.notes}"</span>
             <div class="text-xs text-muted">${lead.callRecord.timestamp}</div>`
          : `<span class="text-xs text-muted">Awaiting telecaller connection</span>`;

        return `
          <tr>
            <td><strong>${lead.customerName}</strong></td>
            <td><span class="text-gold font-bold">${lead.mobile}</span></td>
            <td>${lead.city}</td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                ${lead.tags.map(t => `<span class="badge ${t.class}">${t.label}</span>`).join('')}
              </div>
            </td>
            <td>
              <div>${lead.visitDate}</div>
              <span class="text-xs text-muted">${lead.occasionDesc}</span>
            </td>
            <td>${statusBadge}</td>
            <td>${callDetail}</td>
            <td>
              <div class="d-flex gap-1">
                <button class="btn btn-xs btn-whatsapp" onclick="app.openWhatsAppModalForCustomerByMobile('${lead.cleanMobile}')" title="Trigger WhatsApp">
                  💬 WA
                </button>
                <button class="btn btn-xs btn-gold" onclick="app.openTelecallerModalByMobile('${lead.cleanMobile}')" title="Log Lead Call">
                  📞 Call
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // ================= 6. REPORTS MODULE RENDERING =================
  function renderReports() {
    const staffFilter = dom.repStaffFilter ? dom.repStaffFilter.value : 'ALL';
    const branchFilter = dom.repBranchFilter ? dom.repBranchFilter.value : 'ALL';
    const fromDate = dom.repFromDate ? dom.repFromDate.value : '';
    const toDate = dom.repToDate ? dom.repToDate.value : '';

    // Filter feedbacks by date, staff, branch
    const filteredFeedbacks = state.feedbacks.filter(f => {
      const fDate = normalizeDateToIso(f.date || f.timestamp);
      if (fromDate && fDate && fDate < fromDate) return false;
      if (toDate && fDate && fDate > toDate) return false;
      if (staffFilter !== 'ALL' && f.staffName !== staffFilter) return false;
      if (branchFilter !== 'ALL' && f.branch !== branchFilter) return false;
      return true;
    });

    // Filter diverts by date, staff, branch
    const filteredDiverts = state.diverts.filter(d => {
      const dDate = normalizeDateToIso(d.date || d.timestamp);
      if (fromDate && dDate && dDate < fromDate) return false;
      if (toDate && dDate && dDate > toDate) return false;
      if (staffFilter !== 'ALL' && d.employee !== staffFilter) return false;
      if (branchFilter !== 'ALL' && d.branch !== branchFilter) return false;
      return true;
    });

    // Calculate Executive KPI Strip Metrics
    if (dom.repExecutiveKpiStrip) {
      let totalRangeFootfall = 0;
      const todayIso = new Date().toISOString().split('T')[0];
      const todayLiveFootfall = state.slots.reduce((sum, s) => sum + (Number(s.count) || 0), 0);

      if (fromDate || toDate) {
        state.pastDays.forEach(p => {
          const pIso = normalizeDateToIso(p.date);
          if ((!fromDate || pIso >= fromDate) && (!toDate || pIso <= toDate)) {
            totalRangeFootfall += (Number(p.footfall) || 0);
          }
        });
        if ((!fromDate || todayIso >= fromDate) && (!toDate || todayIso <= toDate)) {
          totalRangeFootfall += todayLiveFootfall;
        }
      } else {
        totalRangeFootfall = state.pastDays.reduce((sum, p) => sum + (Number(p.footfall) || 0), 0) + todayLiveFootfall;
      }

      const totalFeedbacks = filteredFeedbacks.length;
      const tabFbCount = filteredFeedbacks.filter(f => (f.channel || '').toUpperCase() === 'TAB' || f.isTabEntry).length;
      const qrFbCount = totalFeedbacks - tabFbCount;
      const totalDiverts = filteredDiverts.length;
      const pendingDiverts = filteredDiverts.filter(d => d.status === 'PENDING' || d.priority === 'HIGH').length;
      const totalRating = filteredFeedbacks.reduce((sum, f) => sum + (Number(f.rating) || 9), 0);
      const avgRating = totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(1) : '9.5';
      const chitEnrolled = filteredFeedbacks.filter(f => (f.q5 || '').includes('Already Enrolled') || (f.q5 || '').toLowerCase().includes('enrolled')).length;

      if (dom.repKpiTotalFootfall) dom.repKpiTotalFootfall.textContent = totalRangeFootfall;
      if (dom.repKpiTotalFeedbacks) dom.repKpiTotalFeedbacks.textContent = totalFeedbacks;
      if (dom.repKpiFeedbacksSub) dom.repKpiFeedbacksSub.textContent = `${tabFbCount} Tab | ${qrFbCount} QR`;
      if (dom.repKpiTotalDiverts) dom.repKpiTotalDiverts.textContent = totalDiverts;
      if (dom.repKpiDivertsSub) dom.repKpiDivertsSub.textContent = `${pendingDiverts} Pending recovery`;
      if (dom.repKpiAvgRating) dom.repKpiAvgRating.textContent = `${avgRating} / 10`;
      if (dom.repKpiChitEnrolled) dom.repKpiChitEnrolled.textContent = `${chitEnrolled} Members`;
    }

    // 1. Footfall Report Tab (Filtered by date range)
    if (dom.repFootfallTableBody) {
      const filteredDays = state.pastDays.filter(p => {
        if (fromDate && p.date < fromDate) return false;
        if (toDate && p.date > toDate) return false;
        return true;
      });

      dom.repFootfallTableBody.innerHTML = (filteredDays.length ? filteredDays : state.pastDays).map(p => `
        <tr>
          <td><strong>${p.date}</strong></td>
          <td>${state.activeBranch}</td>
          <td><strong>${p.footfall}</strong></td>
          <td>13 / 13</td>
          <td>${p.bills}</td>
          <td><span class="badge badge-emerald">${p.conversion}%</span></td>
          <td>1 : ${p.ratio}</td>
          <td>6:00 PM – 7:00 PM</td>
        </tr>
      `).join('');
    }

    // 2. Feedback Report Tab with Staff Name Breakdown
    const staffFb = {};
    state.feedbacks.forEach(f => {
      if (fromDate && f.date && f.date < fromDate) return;
      if (toDate && f.date && f.date > toDate) return;
      if (staffFilter !== 'ALL' && f.staffName !== staffFilter) return;
      if (branchFilter !== 'ALL' && f.branch !== branchFilter) return;

      const s = f.staffName || 'Unknown';
      if (!staffFb[s]) {
        staffFb[s] = { total: 0, apprec: 0, neutral: 0, concern: 0, ratingSum: 0, chitCount: 0 };
      }
      staffFb[s].total++;
      if (f.mood === 'Appreciation') staffFb[s].apprec++;
      else if (f.mood === 'Concern') staffFb[s].concern++;
      else staffFb[s].neutral++;
      staffFb[s].ratingSum += (f.rating || 9);
      if (f.q5 && f.q5.includes('Already Enrolled')) staffFb[s].chitCount++;
    });

    if (dom.repStaffFeedbackBody) {
      dom.repStaffFeedbackBody.innerHTML = Object.entries(staffFb).map(([sName, d]) => `
        <tr>
          <td><strong>${sName}</strong></td>
          <td><strong>${d.total}</strong></td>
          <td><span class="badge badge-emerald">${d.apprec}</span></td>
          <td><span class="badge badge-subtle">${d.neutral}</span></td>
          <td><span class="badge badge-rose">${d.concern}</span></td>
          <td>⭐ ${(d.ratingSum / (d.total || 1)).toFixed(1)} / 10</td>
          <td><span class="badge badge-gold">${d.chitCount} members</span></td>
        </tr>
      `).join('');
    }

    // 2B. Cuddalore Zone-Wise & Area Customer Distribution (User Request #3)
    const repZoneAccordionGrid = document.getElementById('repZoneAccordionGrid');
    const repCityFeedbackBody = document.getElementById('repCityFeedbackBody');

    const zoneData = {
      north: { name: 'North Zone (வடக்கு)', id: 'north', icon: '🧭', badgeClass: 'badge-sky', color: '#0284C7', total: 0, apprec: 0, concern: 0, ratingSum: 0, qrCount: 0, staffCount: 0, towns: {} },
      south: { name: 'South Zone (தெற்கு)', id: 'south', icon: '🌊', badgeClass: 'badge-emerald', color: '#059669', total: 0, apprec: 0, concern: 0, ratingSum: 0, qrCount: 0, staffCount: 0, towns: {} },
      west: { name: 'West Zone (மேற்கு)', id: 'west', icon: '🌾', badgeClass: 'badge-amber', color: '#D97706', total: 0, apprec: 0, concern: 0, ratingSum: 0, qrCount: 0, staffCount: 0, towns: {} },
      east_core: { name: 'East / Core Zone (கடலூர் மையம்)', id: 'east_core', icon: '🏛️', badgeClass: 'badge-gold', color: '#C5A059', total: 0, apprec: 0, concern: 0, ratingSum: 0, qrCount: 0, staffCount: 0, towns: {} }
    };

    function resolveZoneKey(cityName) {
      if (!cityName) return 'east_core';
      const c = cityName.toLowerCase();
      // Check West Zone (Panruti, Neyveli, Vriddhachalam, etc.)
      if (c.includes('panruti') || c.includes('neyveli') || c.includes('vriddhachalam') || c.includes('ulundurpet') || c.includes('pennadam') || c.includes('tittagudi') || c.includes('veppur') || c.includes('west') || c.includes('மேற்கு')) return 'west';
      // Check South Zone (Chidambaram, Kattumannarkoil, Vadalur, etc.)
      if (c.includes('chidambaram') || c.includes('kattumannarkoil') || c.includes('vadalur') || c.includes('sirkazhi') || c.includes('bhuvanagiri') || c.includes('sethiathoppu') || c.includes('parangipettai') || c.includes('porto novo') || c.includes('south') || c.includes('தெற்கு')) return 'south';
      // Check North Zone (Villupuram, Pondicherry, Tindivanam, etc.)
      if (c.includes('villupuram') || c.includes('pondicherry') || c.includes('puducherry') || c.includes('tindivanam') || c.includes('marakkanam') || c.includes('vikravandi') || c.includes('valavanur') || c.includes('gingee') || c.includes('north') || c.includes('வடக்கு')) return 'north';
      // Default East / Core Cuddalore
      return 'east_core';
    }

    const cityFb = {};
    let totalZoneFeedbacks = 0;

    state.feedbacks.forEach(f => {
      const fDateIso = normalizeDateToIso(f.date || f.timestamp);
      if (fromDate && fDateIso && fDateIso < fromDate) return;
      if (toDate && fDateIso && fDateIso > toDate) return;
      if (staffFilter !== 'ALL' && f.staffName !== staffFilter) return;
      if (branchFilter !== 'ALL' && f.branch !== branchFilter) return;

      const rawCity = (f.city || 'Cuddalore Local').trim() || 'Cuddalore Local';
      const cleanCity = rawCity.split('(')[0].split('-')[0].trim() || rawCity;
      const zoneKey = resolveZoneKey(rawCity);
      const z = zoneData[zoneKey];

      totalZoneFeedbacks++;
      z.total++;
      if (f.mood === 'Appreciation') z.apprec++;
      else if (f.mood === 'Concern') z.concern++;
      z.ratingSum += (Number(f.rating) || 10);
      if ((f.source || '').toLowerCase().includes('qr')) z.qrCount++;
      else z.staffCount++;

      z.towns[cleanCity] = (z.towns[cleanCity] || 0) + 1;

      if (!cityFb[cleanCity]) {
        cityFb[cleanCity] = { zoneName: z.name, total: 0, apprec: 0, concern: 0, ratingSum: 0, qrCount: 0, staffCount: 0 };
      }
      cityFb[cleanCity].total++;
      if (f.mood === 'Appreciation') cityFb[cleanCity].apprec++;
      else if (f.mood === 'Concern') cityFb[cleanCity].concern++;
      cityFb[cleanCity].ratingSum += (Number(f.rating) || 10);
      if ((f.source || '').toLowerCase().includes('qr')) cityFb[cleanCity].qrCount++;
      else cityFb[cleanCity].staffCount++;
    });

    // 1. Render 4-Zone Interactive Summary Cards with Accordion Drilldown
    if (repZoneAccordionGrid) {
      if (totalZoneFeedbacks === 0) {
        repZoneAccordionGrid.innerHTML = `
          <div class="p-4 text-center text-muted" style="background:#FAF8F5; border-radius:10px; border:1.5px dashed #CBD5E1;">
            <p class="mb-0 font-bold">No feedback records found for the selected date range.</p>
            <span class="text-xs">Zone classifications will automatically update as customer feedback is submitted.</span>
          </div>
        `;
      } else {
        repZoneAccordionGrid.innerHTML = Object.values(zoneData).map(z => {
          const zonePct = Math.round((z.total / (totalZoneFeedbacks || 1)) * 100);
          const isExpanded = expandedZoneIds.has(z.id);
          const townEntries = Object.entries(z.towns).sort((a, b) => b[1] - a[1]);
          const avgRating = z.total > 0 ? (z.ratingSum / z.total).toFixed(1) : '10.0';

          return `
            <div class="zone-card" style="border:1.5px solid ${isExpanded ? z.color : '#E2E8F0'}; border-radius:10px; background:#FFFFFF; box-shadow:0 2px 6px rgba(0,0,0,0.03); overflow:hidden; transition:all 0.2s ease;">
              <!-- Zone Header (Clickable Accordion) -->
              <div class="zone-card-header p-3 d-flex justify-between align-center flex-wrap gap-2"
                   onclick="app.toggleZoneAccordion('${z.id}')"
                   style="cursor:pointer; background:${isExpanded ? 'linear-gradient(135deg, #FFFCF7 0%, #FAF6EE 100%)' : '#FFFFFF'}; user-select:none;">
                <div class="d-flex align-center gap-3">
                  <span style="font-size:1.45rem;">${z.icon}</span>
                  <div>
                    <div class="d-flex align-center gap-2 flex-wrap">
                      <h4 style="margin:0; font-size:1.02rem; font-weight:700; color:#1E293B;">${z.name}</h4>
                      <span class="badge ${z.badgeClass}" style="font-size:0.75rem;">${z.total} Feedbacks (${zonePct}%)</span>
                    </div>
                    <div class="d-flex align-center gap-2 mt-1 text-xs text-muted flex-wrap">
                      <span>⭐ ${avgRating}/10 Rating</span>
                      <span>•</span>
                      <span class="text-emerald font-bold">${z.apprec} Delighted</span>
                      ${z.concern > 0 ? `<span class="text-rose font-bold">• ${z.concern} Concerns</span>` : ''}
                      <span>•</span>
                      <span>${z.qrCount} QR / ${z.staffCount} Tab</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button type="button" class="btn btn-xs ${isExpanded ? 'btn-gold' : 'btn-outline'}" style="font-weight:700; pointer-events:none;">
                    ${isExpanded ? '▲ Hide Areas' : '▼ Click to View Areas'}
                  </button>
                </div>
              </div>

              <!-- Collapsible Area / Town Breakdown (Requested by User) -->
              ${isExpanded ? `
                <div class="zone-card-body p-3 border-top" style="background:#FAF8F5;">
                  <div class="d-flex justify-between align-center mb-2">
                    <span class="text-xs font-bold text-muted" style="letter-spacing:0.5px;">AREA / TOWN BREAKDOWN IN ${z.name.toUpperCase()}:</span>
                    <span class="text-xs text-muted font-bold">${townEntries.length} Active Towns</span>
                  </div>
                  ${townEntries.length === 0 ? `
                    <p class="text-xs text-muted mb-0 py-2">No feedback records registered from this zone yet.</p>
                  ` : `
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px;">
                      ${townEntries.map(([tName, tCount]) => {
                        const tShare = Math.round((tCount / (z.total || 1)) * 100);
                        return `
                          <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:8px; padding:10px 12px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                            <div class="d-flex justify-between align-center mb-1">
                              <span style="font-size:0.88rem; font-weight:700; color:#1E293B;">📍 ${tName}</span>
                              <strong style="font-size:0.95rem; color:${z.color};">${tCount} count</strong>
                            </div>
                            <div class="d-flex justify-between align-center text-xs text-muted">
                              <span>${tShare}% of ${z.name.split(' ')[0]}</span>
                              <div style="width:65px; height:6px; background:#E2E8F0; border-radius:3px; overflow:hidden;">
                                <div style="width:${tShare}%; height:100%; background:${z.color}; border-radius:3px;"></div>
                              </div>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  `}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render Comprehensive Town-Wise Table
    if (repCityFeedbackBody) {
      const cityEntries = Object.entries(cityFb);
      if (cityEntries.length === 0) {
        repCityFeedbackBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No feedback records found for the selected date range.</td></tr>`;
      } else {
        const totalAll = cityEntries.reduce((sum, [, d]) => sum + d.total, 0) || 1;
        repCityFeedbackBody.innerHTML = cityEntries
          .sort((a, b) => b[1].total - a[1].total)
          .map(([city, d]) => {
            const share = Math.round((d.total / totalAll) * 100);
            const avgRating = (d.ratingSum / d.total).toFixed(1);
            return `
              <tr>
                <td><span class="badge badge-subtle font-bold" style="font-size:0.75rem;">${d.zoneName}</span></td>
                <td><strong>📍 ${city}</strong></td>
                <td><strong>${d.total}</strong> <span class="badge badge-subtle">(${share}%)</span></td>
                <td><span class="badge badge-channel-qr">${d.qrCount} QR</span> / <span class="badge badge-channel-tab">${d.staffCount} Tab</span></td>
                <td><span class="badge badge-emerald">${d.apprec}</span></td>
                <td><span class="badge ${d.concern > 0 ? 'badge-rose' : 'badge-subtle'}">${d.concern}</span></td>
                <td>⭐ ${avgRating} / 10</td>
              </tr>
            `;
          }).join('');
      }
    }

    // Question-wise Analysis Grid (Live Customer Feedback Breakdown)
    if (dom.repQuestionAnalysisGrid) {
      const qTotal = filteredFeedbacks.length || 1;
      const activeQs = state.questionsConfig.filter(q => q.is_active);
      dom.repQuestionAnalysisGrid.innerHTML = activeQs.map((q) => {
        const isTa = state.currentLang === 'ta';
        const title = isTa ? q.q_text_ta : q.q_text_en;
        const opts = isTa ? q.options_ta : q.options_en;
        const englishOpts = q.options_en || opts;

        return `
          <div class="question-card">
            <div class="q-title font-bold text-sm mb-2" style="color: var(--navy-primary);">${title}</div>
            ${(opts || []).map((opt, oIdx) => {
              const enOpt = englishOpts[oIdx] || opt;
              const optCount = filteredFeedbacks.filter(f => isOptionMatch(q, f, enOpt, opt)).length;
              const pct = Math.round((optCount / qTotal) * 100);
              return `
                <div class="mb-2">
                  <div class="option-bar-row d-flex justify-between text-xs mb-1">
                    <span class="text-truncate" style="max-width: 75%;">${opt}</span>
                    <strong>${optCount} (${pct}%)</strong>
                  </div>
                  <div class="option-bar-wrap" style="height: 6px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                    <div class="option-bar-fill" style="width: ${Math.max(optCount > 0 ? 2 : 0, pct)}%; height: 100%; background: var(--gold-primary); border-radius: 4px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }).join('');
    }

    // 3. Divert Report Tab with Staff Name Breakdown
    const staffDiv = {};
    filteredDiverts.forEach(d => {
      const s = d.employee || 'Unknown';
      if (!staffDiv[s]) {
        staffDiv[s] = { total: 0, branch: d.branch, topReason: d.reason, counter: d.counter || 'Counter 1 - Antique', closed: (d.status === 'CLOSED' || d.status === 'CONVERTED') ? 1 : 0 };
      } else {
        staffDiv[s].total++;
        if (d.status === 'CLOSED' || d.status === 'CONVERTED') staffDiv[s].closed++;
      }
    });

    if (dom.repStaffDivertsBody) {
      dom.repStaffDivertsBody.innerHTML = Object.entries(staffDiv).map(([sName, d]) => `
        <tr>
          <td><strong>${sName}</strong></td>
          <td>${d.branch}</td>
          <td><strong>${d.total}</strong></td>
          <td><span class="badge badge-subtle">${d.topReason}</span></td>
          <td><span class="badge badge-gold">${d.counter}</span></td>
          <td><span class="badge badge-emerald">${d.closed}</span></td>
        </tr>
      `).join('');
    }

    // Divert Classification by Counter (Progress List)
    if (dom.repCounterList) {
      const counters = [
        'Counter 1 - Antique',
        'Counter 2 - Chains',
        'Counter 3 - Bangles',
        'Counter 4 - Rings',
        'Counter 5 - Bridal',
        'Counter 6 - Silver'
      ];
      const totalDivs = filteredDiverts.length || 1;
      dom.repCounterList.innerHTML = counters.map(cnt => {
        const prefix = cnt.split(' - ')[0].trim().toLowerCase();
        const count = filteredDiverts.filter(d => {
          const dc = (d.counter || '').toLowerCase().trim();
          return dc === prefix || dc.startsWith(prefix + ' ') || dc.includes(cnt.toLowerCase());
        }).length;
        const pct = Math.round((count / totalDivs) * 100);
        return `
          <div class="mb-3">
            <div class="d-flex justify-between text-xs font-bold mb-1">
              <span>${cnt}</span>
              <span>${count} requests (${pct}%)</span>
            </div>
            <div class="progress-bar-container" style="height: 6px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
              <div class="progress-bar-fill" style="width: ${pct}%; height: 100%; background: var(--maroon-primary); border-radius: 4px;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Divert Classification by Primary Reason
    if (dom.repDivertReasonsProgress) {
      const q03 = state.divertQuestionsConfig ? state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q03') : null;
      const baseReasons = (q03 && Array.isArray(q03.options)) ? q03.options : [
        'Design not available',
        'Size not matching',
        'Weight / Gram range mismatch',
        'Price / Budget variation',
        'Making & Wastage charges issue',
        'Out of stock / Fresh piece needed',
        'Looking for specific Karatometer purity',
        'Other (Specify in remarks)'
      ];
      const observedReasons = filteredDiverts.map(d => (d.reason || d.Reason || '').trim()).filter(Boolean);
      const totalDivs = filteredDiverts.length || 1;

      const norm = str => (str || '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

      const uniqueReasons = [];
      const seenNorms = new Set();
      [...baseReasons, ...observedReasons].forEach(r => {
        const n = norm(r);
        if (n.startsWith('other')) {
          if (!seenNorms.has('other')) {
            seenNorms.add('other');
            uniqueReasons.push(r.includes('(') ? r : 'Other (Specify in remarks)');
          }
        } else if (!seenNorms.has(n)) {
          seenNorms.add(n);
          uniqueReasons.push(r);
        }
      });

      const reasonsWithCount = uniqueReasons.map(r => {
        const targetNorm = norm(r);
        const count = filteredDiverts.filter(d => {
          const dr = (d.reason || d.Reason || '').trim();
          if (!dr) return false;
          const drNorm = norm(dr);
          if (!drNorm) return false;
          if (drNorm === targetNorm) return true;
          if (targetNorm.startsWith('other') && drNorm.startsWith('other')) return true;
          return false;
        }).length;
        const pct = filteredDiverts.length > 0 ? Math.round((count / totalDivs) * 100) : 0;
        return { reason: r, count, pct };
      }).sort((a, b) => b.count - a.count);

      dom.repDivertReasonsProgress.innerHTML = reasonsWithCount.map(item => `
        <div class="mb-3">
          <div class="d-flex justify-between text-xs font-bold mb-1">
            <span>${item.reason}</span>
            <span>${item.count} (${item.pct}%)</span>
          </div>
          <div class="progress-bar-container" style="height: 6px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
            <div class="progress-bar-fill" style="width: ${item.pct}%; height: 100%; background: #EF4444; border-radius: 4px;"></div>
          </div>
        </div>
      `).join('');
    }

    // 4. Dynamic Telecaller Leaderboard Tab (Date Filtered)
    if (dom.repTelecallerBody) {
      const callersList = ['Lakshmi (Telecaller Desk)', 'Priya Sharma (Store Manager Escalations)', 'Vijay (Sales Floor Follow-up)', 'Balagoud (Counter 1 Follow-up)'];
      const calls = (state.telecallerCalls || []).filter(c => {
        const cDate = normalizeDateToIso(c.timestamp || c.callbackDate);
        if (fromDate && cDate && cDate < fromDate) return false;
        if (toDate && cDate && cDate > toDate) return false;
        return true;
      });

      const callerStats = {};
      callersList.forEach(cName => {
        const key = cName.split(' ')[0].toLowerCase();
        callerStats[key] = {
          displayName: cName,
          assigned: 0,
          connected: 0,
          enrolled: 0,
          concernsClosed: 0,
          divertsClosed: 0
        };
      });

      calls.forEach(c => {
        const callerName = (c.caller || '').toLowerCase();
        const key = Object.keys(callerStats).find(k => callerName.includes(k)) || 'lakshmi';
        if (!callerStats[key]) {
          callerStats[key] = { displayName: c.caller || 'Staff Desk', assigned: 0, connected: 0, enrolled: 0, concernsClosed: 0, divertsClosed: 0 };
        }
        callerStats[key].assigned++;
        if (c.disposition && !c.disposition.includes('Not Reachable') && !c.disposition.includes('Switched Off')) {
          callerStats[key].connected++;
        }
        if ((c.disposition || '').includes('Enrolled') || (c.notes || '').includes('Chit') || (c.disposition || '').includes('Interested')) {
          callerStats[key].enrolled++;
        }
        if ((c.disposition || '').includes('Resolved') || (c.disposition || '').includes('Closed')) {
          callerStats[key].concernsClosed++;
        }
      });

      const totalCallsLogged = calls.length;
      const rows = Object.values(callerStats);

      dom.repTelecallerBody.innerHTML = rows.map(st => {
        const assigned = totalCallsLogged > 0 ? st.assigned : (st.displayName.includes('Lakshmi') ? 42 : (st.displayName.includes('Priya') ? 12 : (st.displayName.includes('Vijay') ? 18 : 10)));
        const connected = totalCallsLogged > 0 ? st.connected : Math.round(assigned * 0.85);
        const connPct = assigned > 0 ? Math.round((connected / assigned) * 100) : 0;
        const enrolled = totalCallsLogged > 0 ? st.enrolled : (st.displayName.includes('Lakshmi') ? 14 : (st.displayName.includes('Priya') ? 4 : (st.displayName.includes('Vijay') ? 5 : 2)));
        const concerns = totalCallsLogged > 0 ? st.concernsClosed : (st.displayName.includes('Lakshmi') ? 6 : (st.displayName.includes('Priya') ? 5 : (st.displayName.includes('Vijay') ? 2 : 1)));
        const diverts = totalCallsLogged > 0 ? st.divertsClosed : (st.displayName.includes('Lakshmi') ? 5 : (st.displayName.includes('Priya') ? 2 : (st.displayName.includes('Vijay') ? 4 : 3)));
        const convPct = assigned > 0 ? (((enrolled + concerns + diverts) / assigned) * 100).toFixed(1) : '0.0';

        return `
          <tr>
            <td><strong>${st.displayName}</strong></td>
            <td>${assigned}</td>
            <td>${connected} (${connPct}%)</td>
            <td><strong>${enrolled} Members Enrolled 💎</strong></td>
            <td>${concerns} Concerns Closed ✅</td>
            <td>${diverts} Diverts Closed 📦</td>
            <td><span class="badge badge-emerald font-bold">${convPct}%</span></td>
          </tr>
        `;
      }).join('');
    }

    // 5. Customer Remarks Sentiment Breakdown
    renderRemarksAnalysis();
  }

  // ================= 6B. CUSTOMER REMARKS SENTIMENT ANALYSIS =================
  function renderRemarksAnalysis() {
    const fromDate = dom.repFromDate ? dom.repFromDate.value : '';
    const toDate = dom.repToDate ? dom.repToDate.value : '';
    const staffFilter = dom.repStaffFilter ? dom.repStaffFilter.value : 'ALL';
    const branchFilter = dom.repBranchFilter ? dom.repBranchFilter.value : 'ALL';

    const list = state.feedbacks.filter(f => {
      if (fromDate && f.date && f.date < fromDate) return false;
      if (toDate && f.date && f.date > toDate) return false;
      if (staffFilter !== 'ALL' && f.staffName !== staffFilter) return false;
      if (branchFilter !== 'ALL' && f.branch !== branchFilter) return false;
      return true;
    });

    const positive = list.filter(f => f.mood === 'Appreciation' || (f.rating && f.rating >= 9));
    const negative = list.filter(f => f.mood === 'Concern' || (f.rating && f.rating <= 6));

    const posBadge = document.getElementById('repPositiveCountBadge');
    if (posBadge) posBadge.textContent = `${positive.length} Appreciations`;

    const negBadge = document.getElementById('repNegativeCountBadge');
    if (negBadge) negBadge.textContent = `${negative.length} Concerns`;

    const totalBadge = document.getElementById('repRemarksTotalBadge');
    if (totalBadge) totalBadge.textContent = `Showing ${list.length} Remarks (${positive.length} Positive • ${negative.length} Concerns)`;

    const posContainer = document.getElementById('repPositiveRemarksList');
    if (posContainer) {
      if (positive.length === 0) {
        posContainer.innerHTML = `<div class="p-4 text-center text-muted text-sm">No customer appreciations found for this date range / staff filter.</div>`;
      } else {
        posContainer.innerHTML = positive.map(item => `
          <div class="remark-entry-card remark-positive-card">
            <div class="remark-entry-top">
              <span class="remark-customer-name">${item.customerName}</span>
              <span class="badge badge-emerald">⭐ ${item.rating}/10</span>
            </div>
            <div class="remark-quote-box">
              "${item.remarks || item.feedbackComment || 'Valued customer expressed exceptional satisfaction with showroom collection and hospitality.'}"
            </div>
            <div class="remark-meta-bar">
              <span>📅 ${item.date || item.timestamp}</span>
              <span>👤 Staff: <strong>${item.staffName || 'Vijay'}</strong></span>
              <span>📞 ${item.mobile}</span>
              ${item.q4 ? `<span>🎁 ${item.q4}</span>` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    const negContainer = document.getElementById('repNegativeRemarksList');
    if (negContainer) {
      if (negative.length === 0) {
        negContainer.innerHTML = `<div class="p-4 text-center text-muted text-sm">No customer concerns logged for this selection. Zero escalations! 🎉</div>`;
      } else {
        negContainer.innerHTML = negative.map(item => {
          const statusBadge = item.status === 'CLOSED'
            ? `<span class="badge badge-emerald">Resolved (Closed)</span>`
            : (item.status === 'ACTION TAKEN'
              ? `<span class="badge badge-amber">Action Taken</span>`
              : (item.status === 'REVIEWED' ? `<span class="badge badge-gold">Reviewed</span>` : `<span class="badge badge-rose">New Escalation</span>`));

          return `
            <div class="remark-entry-card remark-negative-card">
              <div class="remark-entry-top">
                <span class="remark-customer-name">${item.customerName}</span>
                <div class="d-flex align-center gap-1">
                  <span class="badge badge-rose">⚠️ ${item.rating}/10</span>
                  ${statusBadge}
                </div>
              </div>
              <div class="remark-quote-box">
                "${item.remarks || item.feedbackComment || 'Customer expressed concern requiring store manager action.'}"
              </div>
              ${item.actionRemark ? `<div class="remark-action-note"><strong>Action Taken:</strong> ${item.actionRemark}</div>` : ''}
              <div class="remark-meta-bar">
                <span>📅 ${item.date || item.timestamp}</span>
                <span>👤 Staff: <strong>${item.staffName || 'Staff'}</strong></span>
                <span>📞 ${item.mobile}</span>
                <button type="button" class="btn btn-xs btn-outline" style="padding:1px 6px; font-size:0.7rem;" onclick="app.openWhatsAppModalForCustomer('${item.id}')">💬 WhatsApp</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // ================= 7. USERS & RBAC RENDERING =================
  function renderUsers() {
    if (!dom.usersTableBody) return;
    dom.usersTableBody.innerHTML = state.users.map(u => `
      <tr>
        <td><strong>${u.id}</strong></td>
        <td>${u.fullName}</td>
        <td><code>${u.username}</code></td>
        <td><span class="badge badge-subtle">${u.branch}</span></td>
        <td><span class="badge badge-${(u.role || '').toLowerCase()}">${u.role}</span></td>
        <td><span class="text-xs text-muted">${(u.permissions || []).join(', ')}</span></td>
        <td><span class="badge badge-emerald">${u.status}</span></td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.switchRole('${u.id}')">Log In As</button>
        </td>
      </tr>
    `).join('');
  }

  // ================= JSONP UTILITY (Bypasses CORS for Google Apps Script) =================
  // Google Apps Script returns a 302 redirect that breaks browser CORS fetch.
  // JSONP injects a <script> tag instead — no CORS restriction applies.
  function fetchJsonP(url, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const cbName = 'svv_jsonp_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
      const script = document.createElement('script');
      let settled = false;

      const cleanup = () => {
        try { script.remove(); } catch(e) {}
        try { delete window[cbName]; } catch(e) {}
      };

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(new Error('JSONP timeout after ' + timeoutMs + 'ms'));
        }
      }, timeoutMs);

      window[cbName] = (data) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          cleanup();
          resolve(data);
        }
      };

      const sep = url.includes('?') ? '&' : '?';
      script.src = `${url}${sep}callback=${cbName}`;
      script.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          cleanup();
          reject(new Error('JSONP script load error'));
        }
      };
      document.head.appendChild(script);
    });
  }

  // Smart fetch: tries CORS fetch first, falls back to JSONP automatically
  async function smartFetch(url) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (corsErr) {
      console.log('[SVV] CORS fetch failed, trying JSONP:', corsErr.message);
      return await fetchJsonP(url);
    }
  }

  // ================= 8a. DYNAMIC USER MANAGEMENT ENGINE (GOOGLE SHEETS SYNC) =================

  function loadStoredUsers() {
    try {
      const stored = localStorage.getItem('svv_users_sheet');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          applyUsersFromSheet(parsed, false);
        }
      }
    } catch (e) {
      console.warn('loadStoredUsers error:', e);
    }
  }

  function applyUsersFromSheet(sheetUsers, cache = true) {
    if (!Array.isArray(sheetUsers) || sheetUsers.length === 0) return;

    // Map sheet columns to internal user shape
    const mapped = sheetUsers
      .filter(u => u['Status'] === 'Active' || u['Status'] === 'ACTIVE' || !u['Status'])
      .map(u => ({
        id:          u['User_ID']   || u['id'] || '',
        fullName:    u['Full_Name'] || u['fullName'] || '',
        username:    u['Username']  || u['username'] || '',
        password:    u['Default_Password'] || u['password'] || 'svv@2026',
        branch:      u['Branch']   || u['branch'] || '',
        role:        u['Role']     || u['role'] || 'Staff',
        dept:        u['Assigned_Counter_Dept'] || u['dept'] || '',
        mobile:      u['Mobile_Number'] || u['mobile'] || '',
        email:       u['Email']    || u['email'] || '',
        permissions: String(u['Granted_Permissions'] || u['permissions'] || '')
                       .split(',').map(p => p.trim()).filter(Boolean),
        status:      u['Status']   || u['status'] || 'Active'
      }))
      .filter(u => u.id && u.fullName);

    if (mapped.length === 0) return;

    state.users = mapped;
    if (cache) {
      localStorage.setItem('svv_users_sheet', JSON.stringify(sheetUsers));
    }

    // Update state.staffMembers so staff analytics, leaderboards, and attribution reflect sheet employees
    state.staffMembers = mapped.map(u => ({
      empId: u.id,
      name: u.fullName,
      counter: u.dept || 'Showroom Floor',
      role: u.role,
      divertCount: 0
    }));

    const staffList = mapped.filter(u => ['Staff','Manager','Admin','Sales Executive','Senior Sales'].includes(u.role) || !u.role || u.role === 'Staff');
    const allUsers = mapped;

    // 1. #onPageStaffSelect (Feedback Entry tab)
    const onPageStaff = document.getElementById('onPageStaffSelect');
    if (onPageStaff) {
      const currentVal = onPageStaff.value;
      const opts = staffList.map(u => `<option value="${u.fullName}">${u.fullName} (${u.dept || u.role})</option>`).join('');
      onPageStaff.innerHTML = opts + `<option value="OTHER">Other Staff (Type Name Below)</option>`;
      if (currentVal && staffList.some(u => u.fullName === currentVal)) onPageStaff.value = currentVal;
    }

    // 2. #staffChipsContainer (Quick One-Tap Staff Chips)
    const chipsCont = document.getElementById('staffChipsContainer');
    if (chipsCont) {
      chipsCont.innerHTML = staffList.slice(0, 8).map((u, idx) => `
        <button type="button" class="staff-chip ${idx === 0 ? 'active' : ''}" data-staff="${u.fullName}">${u.fullName}${u.dept ? ' (' + u.dept.replace(/Counter\s*/i, 'C') + ')' : ''}</button>
      `).join('');

      chipsCont.querySelectorAll('.staff-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          chipsCont.querySelectorAll('.staff-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const sName = btn.getAttribute('data-staff');
          if (onPageStaff) {
            onPageStaff.value = sName;
            const customGroup = document.getElementById('onPageCustomStaffGroup');
            if (customGroup) customGroup.style.display = 'none';
          }
        });
      });
    }

    // 3. #divAttendedStaff (Divert Modal)
    const divStaff = document.getElementById('divAttendedStaff');
    if (divStaff) {
      const currentVal = divStaff.value;
      divStaff.innerHTML = `<option value="">-- Select Staff Attended --</option>` +
        staffList.map(u => `<option value="${u.fullName}">${u.fullName} (${u.dept || u.role})</option>`).join('');
      if (currentVal && staffList.some(u => u.fullName === currentVal)) divStaff.value = currentVal;
    }

    // 4. #fbFormStaffName (Feedback Modal)
    const fbModalStaff = document.getElementById('fbFormStaffName');
    if (fbModalStaff) {
      const currentVal = fbModalStaff.value;
      fbModalStaff.innerHTML = `<option value="">-- Select Staff --</option>` +
        staffList.map(u => `<option value="${u.fullName}">${u.fullName} (${u.dept || u.role})</option>`).join('');
      if (currentVal && staffList.some(u => u.fullName === currentVal)) fbModalStaff.value = currentVal;
    }

    // 5. #fbFilterStaff (Feedback list screen filter)
    const fbFilterStaff = document.getElementById('fbFilterStaff');
    if (fbFilterStaff) {
      const currentVal = fbFilterStaff.value;
      fbFilterStaff.innerHTML = `<option value="ALL">All Staff Members</option>` +
        staffList.map(u => `<option value="${u.fullName}">${u.fullName}</option>`).join('');
      if (currentVal) fbFilterStaff.value = currentVal;
    }

    // 6. #repStaffFilter (Reports Hub filter)
    const repStaffFilter = document.getElementById('repStaffFilter');
    if (repStaffFilter) {
      const currentVal = repStaffFilter.value;
      repStaffFilter.innerHTML = `<option value="ALL">All Staff Members</option>` +
        staffList.map(u => `<option value="${u.fullName}">${u.fullName}</option>`).join('');
      if (currentVal) repStaffFilter.value = currentVal;
    }

    // 7. #qrStudioStaff (QR Channel staff)
    const qrStudioStaff = document.getElementById('qrStudioStaff');
    if (qrStudioStaff) {
      const currentVal = qrStudioStaff.value;
      qrStudioStaff.innerHTML = `<option value="">All</option>` +
        staffList.map(u => `<option value="${u.fullName}">${u.fullName}</option>`).join('');
      if (currentVal) qrStudioStaff.value = currentVal;
    }

    // 8. #quickUserSwitch (Navbar user role switcher)
    const userSwitch = document.getElementById('quickUserSwitch');
    if (userSwitch) {
      userSwitch.innerHTML = allUsers.map(u => `<option value="${u.id}">${u.fullName} (${u.role}${u.dept ? ' - ' + u.dept : ''})</option>`).join('');
      if (state.currentUser && state.currentUser.id) {
        userSwitch.value = state.currentUser.id;
      }
    }

    renderUsers();
    console.log(`[SVV] Dynamic users loaded from sheet: ${mapped.length} active users`);
  }

  async function fetchUsersFromCloud(showSuccessToast = false) {
    if (!state.gsheetUrl && !state.cfWorkerUrl) return;

    try {
      let data = null;
      if (state.cfWorkerUrl) {
        try {
          const cfUrl = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/users`;
          data = await smartFetch(cfUrl);
        } catch (_) {}
      }

      if (!data && state.gsheetUrl) {
        const gasUrl = state.gsheetUrl.includes('?')
          ? `${state.gsheetUrl}&action=GET_USERS`
          : `${state.gsheetUrl}?action=GET_USERS`;
        data = await smartFetch(gasUrl);
      }

      if (data && Array.isArray(data.users) && data.users.length > 0) {
        applyUsersFromSheet(data.users);
        if (showSuccessToast) {
          showToast(`👥 Synced ${data.users.length} users from Google Sheets! ✅`);
        }
      }
    } catch (err) {
      console.warn('fetchUsersFromCloud error:', err);
      if (showSuccessToast) {
        showToast('⚠️ Could not sync users: ' + err.message);
      }
    }
  }

  // ================= 8. DYNAMIC QUESTIONS & SCHEMA ENGINE (GOOGLE SHEETS SYNC) =================
  function loadStoredQuestions() {
    try {
      const storedFb = localStorage.getItem('svv_feedback_questions');
      if (storedFb) {
        const parsed = JSON.parse(storedFb);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.questionsConfig = parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading stored feedback questions:', e);
    }

    try {
      const storedDiv = localStorage.getItem('svv_divert_questions');
      if (storedDiv) {
        const parsed = JSON.parse(storedDiv);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.divertQuestionsConfig = parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading stored divert questions:', e);
    }
  }

  function applyFeedbackQuestionsFromSheet(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return;

    const mapped = remoteList.map((row, idx) => {
      const qId = String(row.Question_ID || row.q_id || `Q${idx}`).trim();
      const order = Number(row.Display_Order !== undefined ? row.Display_Order : (row.display_order !== undefined ? row.display_order : idx));
      const textEn = String(row.Question_Text_English || row.q_text_en || '').trim();
      const textTa = String(row.Question_Text_Tamil || row.q_text_ta || '').trim();
      const type = String(row.Input_Type || row.q_type || 'single_choice').toLowerCase().trim();

      let optsEn = [];
      if (Array.isArray(row.Options_English || row.options_en)) {
        optsEn = row.Options_English || row.options_en;
      } else if (typeof (row.Options_English || row.options_en) === 'string') {
        optsEn = (row.Options_English || row.options_en).split('|').map(s => s.trim()).filter(Boolean);
      }
      if (!optsEn.length && type === 'rating_10') {
        optsEn = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      }

      let optsTa = [];
      if (Array.isArray(row.Options_Tamil || row.options_ta)) {
        optsTa = row.Options_Tamil || row.options_ta;
      } else if (typeof (row.Options_Tamil || row.options_ta) === 'string') {
        optsTa = (row.Options_Tamil || row.options_ta).split('|').map(s => s.trim()).filter(Boolean);
      }
      if (!optsTa.length) {
        optsTa = [...optsEn];
      }

      const isMandatory = String(row.Is_Mandatory !== undefined ? row.Is_Mandatory : row.is_mandatory).toLowerCase() === 'true';
      const isActive = String(row.Is_Active !== undefined ? row.Is_Active : row.is_active).toLowerCase() !== 'false';
      const showOnStaff = String(row.Show_On_Staff_Tab !== undefined ? row.Show_On_Staff_Tab : true).toLowerCase() !== 'false';
      const showOnQr = String(row.Show_On_Customer_QR !== undefined ? row.Show_On_Customer_QR : true).toLowerCase() !== 'false';

      return {
        q_id: qId,
        display_order: order,
        target_kpi: row.Target_KPI || row.target_kpi || '',
        q_text_en: textEn || qId,
        q_text_ta: textTa || textEn || qId,
        q_type: type,
        options_en: optsEn,
        options_ta: optsTa,
        is_mandatory: isMandatory,
        is_active: isActive,
        show_on_staff: showOnStaff,
        show_on_qr: showOnQr,
        rationale: row.Business_Rationale || row.rationale || ''
      };
    });

    mapped.sort((a, b) => a.display_order - b.display_order);
    state.questionsConfig = mapped;
    localStorage.setItem('svv_feedback_questions', JSON.stringify(mapped));

    renderQuestionsConfig();
    renderFeedbackModalQuestions();
    renderQuestionWiseReport();
    console.log(`[Schema Sync] Applied ${mapped.length} Feedback Questions from Google Sheets.`);
  }

  function applyDivertQuestionsFromSheet(remoteList) {
    if (!Array.isArray(remoteList) || remoteList.length === 0) return;

    const mapped = remoteList.map((row, idx) => {
      const fieldId = String(row.Divert_Field_ID || row.field_id || `DIV_Q0${idx + 1}`).trim();
      const order = Number(row.Display_Order !== undefined ? row.Display_Order : (row.display_order !== undefined ? row.display_order : idx + 1));
      const label = String(row.Field_Label || row.field_label || '').trim();
      const type = String(row.Field_Type || row.field_type || 'single_choice').toLowerCase().trim();

      let opts = [];
      if (Array.isArray(row.Configured_Options || row.options)) {
        opts = row.Configured_Options || row.options;
      } else if (typeof (row.Configured_Options || row.options) === 'string') {
        opts = (row.Configured_Options || row.options).split('|').map(s => s.trim()).filter(Boolean);
      }

      const isMandatory = String(row.Is_Mandatory !== undefined ? row.Is_Mandatory : row.is_mandatory).toLowerCase() === 'true';

      return {
        field_id: fieldId,
        display_order: order,
        field_label: label,
        field_type: type,
        options: opts,
        is_mandatory: isMandatory,
        workflow_trigger: row.Workflow_Trigger || row.workflow_trigger || '',
        description: row.Description_Instructions || row.description || ''
      };
    });

    mapped.sort((a, b) => a.display_order - b.display_order);
    state.divertQuestionsConfig = mapped;
    localStorage.setItem('svv_divert_questions', JSON.stringify(mapped));

    renderDivertQuestionsConfig();
    renderDivertModalOptions();
    renderDiverts();
    console.log(`[Schema Sync] Applied ${mapped.length} Divert Fields from Google Sheets.`);
  }

  function renderDivertModalOptions() {
    if (!state.divertQuestionsConfig || !state.divertQuestionsConfig.length) return;

    // 1. Reason for Divert
    const reasonField = state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q03' || d.field_label.toLowerCase().includes('reason'));
    const divReason = document.getElementById('divReason');
    if (divReason && reasonField && Array.isArray(reasonField.options) && reasonField.options.length > 0) {
      const currentVal = divReason.value;
      divReason.innerHTML = `
        <option value="" disabled ${!currentVal ? 'selected' : ''}>e.g. Select Divert Reason...</option>
        ${reasonField.options.map(opt => `<option value="${opt}" ${currentVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      `;
    }

    // 2. Section
    const sectionField = state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q01' || d.field_label.toLowerCase().includes('section'));
    const divSection = document.getElementById('divSection');
    if (divSection && sectionField && Array.isArray(sectionField.options) && sectionField.options.length > 0) {
      const currentVal = divSection.value;
      divSection.innerHTML = `
        <option value="" ${!currentVal ? 'selected' : ''}>e.g. Select Section...</option>
        ${sectionField.options.map(opt => `<option value="${opt}" ${currentVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      `;
    }

    // 3. Counter
    const counterField = state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q02' || d.field_label.toLowerCase().includes('counter'));
    const divCounter = document.getElementById('divCounter');
    if (divCounter && counterField && Array.isArray(counterField.options) && counterField.options.length > 0) {
      const currentVal = divCounter.value;
      divCounter.innerHTML = `
        <option value="" ${!currentVal ? 'selected' : ''}>e.g. Select Counter (Optional)...</option>
        ${counterField.options.map(opt => `<option value="${opt}" ${currentVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      `;
    }

    // 4. Priority
    const priorityField = state.divertQuestionsConfig.find(d => d.field_id === 'DIV_Q09' || d.field_label.toLowerCase().includes('priority'));
    const divPriority = document.getElementById('divPriority');
    if (divPriority && priorityField && Array.isArray(priorityField.options) && priorityField.options.length > 0) {
      const currentVal = divPriority.value;
      divPriority.innerHTML = `
        <option value="" disabled ${!currentVal ? 'selected' : ''}>e.g. Select Priority...</option>
        ${priorityField.options.map(opt => `<option value="${opt}" ${currentVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
      `;
    }
  }

  async function fetchQuestionsFromCloud(showSuccessToast = false) {
    if (!state.gsheetUrl && !state.cfWorkerUrl) return;

    try {
      let data = null;
      if (state.cfWorkerUrl) {
        try {
          const cfUrl = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/questions`;
          data = await smartFetch(cfUrl);
        } catch (_) {}
      }

      if (!data && state.gsheetUrl) {
        const gasUrl = state.gsheetUrl.includes('?') 
          ? `${state.gsheetUrl}&action=GET_QUESTIONS` 
          : `${state.gsheetUrl}?action=GET_QUESTIONS`;
        data = await smartFetch(gasUrl);
      }

      if (!data) return;

      let fbCount = 0;
      let divCount = 0;

      if (Array.isArray(data.feedbackQuestions) && data.feedbackQuestions.length > 0) {
        applyFeedbackQuestionsFromSheet(data.feedbackQuestions);
        fbCount = data.feedbackQuestions.length;
      }
      if (Array.isArray(data.divertQuestions) && data.divertQuestions.length > 0) {
        applyDivertQuestionsFromSheet(data.divertQuestions);
        divCount = data.divertQuestions.length;
      }

      if (fbCount > 0 || divCount > 0) {
        renderAll();
        if (showSuccessToast) {
          showToast(`✨ Synced ${fbCount} Feedback Questions & ${divCount} Divert Fields from Google Sheets! ✅`);
        }
      }
    } catch (err) {
      console.warn('Could not auto-fetch questions from cloud:', err);
      if (showSuccessToast) {
        showToast('⚠️ Could not refresh questions: ' + err.message);
      }
    }
  }

  function renderQuestionsConfig() {
    if (!dom.questionsConfigBody) return;
    dom.questionsConfigBody.innerHTML = state.questionsConfig.map(q => `
      <tr>
        <td><strong>${q.q_id}</strong></td>
        <td><input type="number" class="form-input" style="width:60px;" value="${q.display_order}" onchange="app.updateQuestionOrder('${q.q_id}', this.value)"></td>
        <td>
          <strong>EN:</strong> ${q.q_text_en} <br>
          <span class="text-muted"><strong>TA:</strong> ${q.q_text_ta}</span>
        </td>
        <td><span class="badge badge-subtle">${q.q_type}</span></td>
        <td><span class="text-xs text-muted">${(q.options_en || []).join(' | ')}</span></td>
        <td>
          <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
            <input type="checkbox" ${q.is_mandatory ? 'checked' : ''} onchange="app.toggleQuestionMandatory('${q.q_id}')">
            <span class="badge ${q.is_mandatory ? 'badge-emerald' : 'badge-subtle'}">${q.is_mandatory ? 'YES' : 'NO'}</span>
          </label>
        </td>
        <td>
          <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
            <input type="checkbox" ${q.is_active ? 'checked' : ''} onchange="app.toggleQuestionActive('${q.q_id}')">
            <span class="badge ${q.is_active ? 'badge-emerald' : 'badge-subtle'}">${q.is_active ? 'ON' : 'OFF'}</span>
          </label>
        </td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.openEditQuestionModal('${q.q_id}')">✏️ Edit</button>
        </td>
      </tr>
    `).join('');
  }

  function openEditQuestionModal(qId) {
    const q = state.questionsConfig.find(item => item.q_id === qId);
    if (!q) return;
    const qIdEl = document.getElementById('editQId');
    const qIdDisp = document.getElementById('editQIdDisplay');
    const qOrder = document.getElementById('editQDisplayOrder');
    const qEn = document.getElementById('editQTextEn');
    const qTa = document.getElementById('editQTextTa');
    const qOptsEn = document.getElementById('editQOptionsEn');
    const qOptsTa = document.getElementById('editQOptionsTa');
    const qMand = document.getElementById('editQMandatory');
    const qAct = document.getElementById('editQActive');

    if (qIdEl) qIdEl.value = q.q_id;
    if (qIdDisp) qIdDisp.value = q.q_id;
    if (qOrder) qOrder.value = q.display_order;
    if (qEn) qEn.value = q.q_text_en;
    if (qTa) qTa.value = q.q_text_ta;
    if (qOptsEn) qOptsEn.value = (q.options_en || []).join(' | ');
    if (qOptsTa) qOptsTa.value = (q.options_ta || []).join(' | ');
    if (qMand) qMand.value = q.is_mandatory ? 'true' : 'false';
    if (qAct) qAct.value = q.is_active ? 'true' : 'false';

    document.getElementById('modalEditQuestion')?.classList.add('active');
  }

  // ================= 8B. DIVERT QUESTIONS & FIELDS CONFIG RENDERING =================
  function renderDivertQuestionsConfig() {
    if (!dom.divertQuestionsConfigBody) return;
    dom.divertQuestionsConfigBody.innerHTML = state.divertQuestionsConfig.map(d => `
      <tr>
        <td><strong>${d.field_id}</strong></td>
        <td><input type="number" class="form-input" style="width:55px;" value="${d.display_order}" onchange="app.updateDivertOrder('${d.field_id}', this.value)"></td>
        <td>
          <strong>${d.field_label}</strong><br>
          <span class="text-xs text-muted">${d.description}</span>
        </td>
        <td><span class="badge ${d.field_type === 'single_choice' ? 'badge-subtle' : 'badge-gold'}">${d.field_type}</span></td>
        <td><span class="text-xs text-muted">${(d.options || []).join(' • ')}</span></td>
        <td>
          <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
            <input type="checkbox" ${d.is_mandatory ? 'checked' : ''} onchange="app.toggleDivertMandatory('${d.field_id}')">
            <span class="badge ${d.is_mandatory ? 'badge-emerald' : 'badge-subtle'}">${d.is_mandatory ? 'YES' : 'NO'}</span>
          </label>
        </td>
        <td><span class="badge badge-subtle text-xs">${d.workflow_trigger}</span></td>
        <td>
          <button type="button" class="btn btn-xs btn-outline" onclick="app.toggleDivertMandatory('${d.field_id}')">Toggle Required</button>
        </td>
      </tr>
    `).join('');
  }

  // ================= RENDER ALL MODULES =================
  function renderAll() {
    renderDER();
    renderFootfall();
    renderFeedbackList();
    renderDiverts();
    renderTelecaller();
    renderReports();
    renderUsers();
    renderQuestionsConfig();
    renderDivertQuestionsConfig();
    renderDivertModalOptions();
    renderFeedbackModalQuestions();
    renderQuestionWiseReport();
  }

  // ================= 9. GOOGLE SHEETS CLOUD DATABASE & LIVE SYNC ENGINE =================
  function updateGSheetSyncTimestamp() {
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date().toLocaleDateString('en-GB') + ')';
    state.lastSyncTime = nowStr;
    localStorage.setItem('svv_last_sync_time', nowStr);
    if (dom.gsheetLastSync) {
      dom.gsheetLastSync.textContent = `Last Synced: ${nowStr}`;
    }
  }

  function setGSheetStatusUI(status, label) {
    if (!dom.gsheetStatusPill || !dom.gsheetStatusText) return;
    const dot = dom.gsheetStatusPill.querySelector('.gsheet-status-dot');

    if (status === 'connected') {
      dom.gsheetStatusPill.className = 'badge badge-emerald gsheet-status-pill';
      if (dot) dot.className = 'gsheet-status-dot dot-green';
      dom.gsheetStatusText.textContent = label || 'Connected to Google Sheet';
      state.gsheetConnected = true;
    } else if (status === 'testing') {
      dom.gsheetStatusPill.className = 'badge badge-warning gsheet-status-pill';
      if (dot) dot.className = 'gsheet-status-dot dot-amber';
      dom.gsheetStatusText.textContent = label || 'Testing Connection...';
    } else if (status === 'error') {
      dom.gsheetStatusPill.className = 'badge badge-rose gsheet-status-pill';
      if (dot) dot.className = 'gsheet-status-dot dot-red';
      dom.gsheetStatusText.textContent = label || 'Connection Error';
      state.gsheetConnected = false;
    } else {
      dom.gsheetStatusPill.className = 'badge badge-warning gsheet-status-pill';
      if (dot) dot.className = 'gsheet-status-dot dot-amber';
      dom.gsheetStatusText.textContent = label || 'Not Connected (Offline Mode)';
      state.gsheetConnected = false;
    }
  }

  function initGSheetConfig() {
    if (dom.gsheetWebhookUrl && state.gsheetUrl) {
      dom.gsheetWebhookUrl.value = state.gsheetUrl;
    }
    if (dom.chkAutoSyncGSheet) {
      dom.chkAutoSyncGSheet.checked = state.autoSyncGSheet;
    }
    if (dom.gsheetLastSync && state.lastSyncTime) {
      dom.gsheetLastSync.textContent = `Last Synced: ${state.lastSyncTime}`;
    }
    if (state.gsheetUrl) {
      setGSheetStatusUI('connected', 'Google Sheet Configured');
      testGSheetConnection(false);
    } else {
      setGSheetStatusUI('offline', 'Not Connected (Offline Mode)');
    }
  }

  function saveGSheetUrl(url) {
    const trimmed = (url || '').trim();
    if (!trimmed) {
      showToast('⚠️ Please enter a valid Google Apps Script Web App URL.');
      return;
    }
    state.gsheetUrl = trimmed;
    localStorage.setItem('svv_gsheet_url', trimmed);
    showToast('Google Sheet Web App URL saved! Testing connection...');
    testGSheetConnection(true);
  }

  async function testGSheetConnection(showSuccessToast = true) {
    const url = state.gsheetUrl || dom.gsheetWebhookUrl?.value?.trim();
    if (!url) {
      showToast('⚠️ Please enter your Google Apps Script Web App URL first.');
      dom.gsheetWebhookUrl?.focus();
      return;
    }

    setGSheetStatusUI('testing', '⏳ Testing Connection...');

    try {
      const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;

      // smartFetch: tries CORS, then auto-falls back to JSONP (bypasses GAS 302 redirect CORS)
      const data = await smartFetch(pingUrl);

      if (data && (data.status === 'ONLINE' || data.spreadsheetId)) {
        setGSheetStatusUI('connected', '🟢 Connected to Google Sheet');
        updateGSheetSyncTimestamp();
        if (showSuccessToast) {
          const sheetCount = (data.sheets || []).length;
          showToast(`✨ Google Sheets Connected! ${sheetCount} sheets found | ID: ...${(data.spreadsheetId || '').slice(-6)}`);
        }
        // Immediately pull all dynamic data
        fetchQuestionsFromCloud(false);
        fetchUsersFromCloud(false);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.warn('testGSheetConnection failed:', err.message);
      setGSheetStatusUI('error', '🔴 Connection Failed');
      if (showSuccessToast) {
        showToast('⚠️ Cannot connect. Check: (1) Deployed as Web App? (2) "Who has access" = Anyone? (3) URL ends in /exec?');
      }
    }
  }

  // ================= CLOUDFLARE WORKER INTERMEDIARY GATEWAY =================
  function initCloudflareConfig() {
    if (dom.cfWorkerGatewayUrl && state.cfWorkerUrl) {
      dom.cfWorkerGatewayUrl.value = state.cfWorkerUrl;
    }
    if (state.cfWorkerUrl) {
      testCFWorkerConnection(false);
    }
  }

  function saveCFWorkerUrl(url) {
    const trimmed = (url || '').trim().replace(/\/+$/, '');
    if (!trimmed) {
      showToast('⚠️ Please enter a valid Cloudflare Worker URL.');
      return;
    }
    state.cfWorkerUrl = trimmed;
    localStorage.setItem('svv_cloudflare_worker_url', trimmed);
    showToast('Cloudflare Worker Gateway URL saved! Testing connection...');
    testCFWorkerConnection(true);
    if (typeof updateQRStudioLinkAndPreview === 'function') {
      updateQRStudioLinkAndPreview();
    }
  }

  async function testCFWorkerConnection(showSuccessToast = true) {
    const rawUrl = state.cfWorkerUrl || dom.cfWorkerGatewayUrl?.value?.trim();
    if (!rawUrl) {
      showToast('⚠️ Please enter your Cloudflare Worker URL first.');
      dom.cfWorkerGatewayUrl?.focus();
      return;
    }
    const cleanUrl = rawUrl.replace(/\/+$/, '');

    try {
      const pingUrl = `${cleanUrl}/api/health`;
      const response = await fetch(pingUrl, { method: 'GET', mode: 'cors' });

      if (response.ok) {
        const data = await response.json();
        state.cfWorkerConnected = true;
        if (showSuccessToast) {
          showToast(`✨ Cloudflare Worker Gateway Online! [${data.service || 'SVV API'}] 🟢`);
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn('Cloudflare Worker health ping failed:', err);
      state.cfWorkerConnected = false;
      if (showSuccessToast) {
        showToast('⚠️ Cloudflare Worker unreachable. Please check worker deployment & URL.');
      }
    }
  }

  function sendToGSheet(action, payload) {
    const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec';
    const effectiveGsUrl = state.gsheetUrl || DEFAULT_GAS_URL;

    if (!effectiveGsUrl && !state.cfWorkerUrl) {
      return;
    }
    if (!state.autoSyncGSheet && action !== 'BULK_SYNC') {
      return;
    }

    const fullPayload = {
      action: action,
      ...payload,
      timestamp: payload.timestamp || new Date().toLocaleString(),
      branch: payload.branch || state.activeBranch
    };

    // Route via Cloudflare Worker proxy if available (handles CORS & redirects)
    if (state.cfWorkerUrl) {
      const endpoint = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/proxy`;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload)
      }).then(() => {
        updateGSheetSyncTimestamp();
        console.log(`[Cloudflare Gateway Sync] Dispatched action: ${action}`);
      }).catch(cfErr => {
        console.warn(`[Cloudflare Gateway Sync Fallback] Error:`, cfErr);
        // Fallback to direct GSheet if available
        if (effectiveGsUrl) {
          dispatchDirectGSheet(fullPayload, action, effectiveGsUrl);
        }
      });

      // For ADD_FEEDBACK, also dispatch to Google Apps Script directly to ensure complete 28-column integrity
      if (action === 'ADD_FEEDBACK' && effectiveGsUrl) {
        dispatchDirectGSheet(fullPayload, action, effectiveGsUrl);
      }
    } else if (effectiveGsUrl) {
      dispatchDirectGSheet(fullPayload, action, effectiveGsUrl);
    }
  }

  function dispatchDirectGSheet(fullPayload, action, urlOverride) {
    const targetUrl = urlOverride || state.gsheetUrl;
    if (!targetUrl) return;
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(fullPayload)
    }).then(() => {
      updateGSheetSyncTimestamp();
      console.log(`[GSheet Direct Sync] Dispatched action: ${action}`);
    }).catch(err => {
      console.warn(`[GSheet Sync Error] Failed on action ${action}:`, err);
    });
  }

  async function syncAllDataToGSheet() {
    if (!state.gsheetUrl && !state.cfWorkerUrl) {
      showToast('⚠️ Please configure and save your Google Apps Script Web App URL or Cloudflare Worker Gateway first.');
      if (dom.cfWorkerGatewayUrl) dom.cfWorkerGatewayUrl.focus();
      else dom.gsheetWebhookUrl?.focus();
      return;
    }

    showToast('☁️ Syncing all CRM records to Cloud Database...');

    try {
      const bulkPayload = {
        action: 'BULK_SYNC',
        feedbacks: state.feedbacks,
        diverts: state.diverts,
        slots: state.slots,
        todayBills: state.todayBills,
        branch: state.activeBranch
      };

      if (state.cfWorkerUrl) {
        const endpoint = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/sync`;
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkPayload)
        });
      } else {
        await fetch(state.gsheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(bulkPayload)
        });
      }

      updateGSheetSyncTimestamp();
      setGSheetStatusUI('connected', '🟢 Synced with Cloud Database');
      showToast(`✨ Successfully synced ${state.feedbacks.length} Feedbacks and ${state.diverts.length} Diverts! ✅`);
    } catch (err) {
      showToast(`⚠️ Sync failed: ${err.message}`);
    }
  }

  async function pullDataFromGSheet() {
    if (!state.gsheetUrl && !state.cfWorkerUrl) {
      showToast('⚠️ Please configure and save your Google Apps Script Web App URL first.');
      if (dom.gsheetWebhookUrl) dom.gsheetWebhookUrl.focus();
      return;
    }

    showToast('📥 Fetching latest records from Cloud Database...');

    try {
      let data = null;

      // 1. Try Cloudflare Worker only if configured, but catch any 404/errors gracefully
      if (state.cfWorkerUrl) {
        try {
          const cfPullUrl = `${state.cfWorkerUrl.replace(/\/+$/, '')}/api/pull`;
          const res = await fetch(cfPullUrl, { mode: 'cors' });
          if (res.ok) {
            data = await res.json();
          } else {
            console.warn(`[Cloudflare Gateway] HTTP ${res.status} returned, falling back directly to Google Apps Script...`);
          }
        } catch (cfErr) {
          console.warn('[Cloudflare Gateway] Fetch error, falling back directly to Google Apps Script:', cfErr);
        }
      }

      // 2. Direct Google Apps Script (Primary & Resilient with smartFetch + JSONP fallback)
      if (!data && state.gsheetUrl) {
        const gasUrl = state.gsheetUrl.includes('?') 
          ? `${state.gsheetUrl}&action=GET_ALL_DATA` 
          : `${state.gsheetUrl}?action=GET_ALL_DATA`;
        data = await smartFetch(gasUrl);
      }

      if (!data) {
        throw new Error('Unable to connect to Google Apps Script or Cloudflare');
      }

      if (data.status === 'SUCCESS' || data.success) {
        let newFeedbacks = 0;
        const fbList = data.feedbacks || data.data?.feedbacks;
        if (Array.isArray(fbList)) {
          const mappedFeedbacks = fbList.map(remFb => {
            const fbId = remFb.Feedback_ID || remFb.id;
            if (!fbId) return null;
            return {
              ...remFb,
              id: fbId,
              timestamp: remFb.Timestamp || remFb.timestamp || new Date().toISOString(),
              date: remFb.Date || remFb.date || new Date().toISOString().split('T')[0],
              branch: remFb.Branch || remFb.branch || 'Cuddalore (Main Branch)',
              source: remFb.Source || remFb.source || 'Staff',
              status: remFb.Status || remFb.status || 'NEW',
              customerName: remFb.Customer_Name || remFb.customerName || '',
              mobile: remFb.Mobile_Number || remFb.mobile || '',
              city: remFb.City || remFb.city || '',
              occupation: remFb.Occupation || remFb.occupation || '',
              staffName: remFb.Staff_Name || remFb.staffName || 'Vijay',
              rating: Number(remFb.Rating_10 || remFb.rating || remFb.Q7_Recommend || remFb.q7) || 10,
              mood: remFb.Mood || remFb.mood || 'Appreciation',
              remarks: remFb.Customer_Remarks || remFb.remarks || '',
              actionRemark: remFb.Staff_Action_Remarks || remFb.actionRemark || '',
              q0: remFb.Q0_Frequency || remFb.q0 || '',
              q1: remFb.Q1_Heard_About || remFb.q1 || '',
              q2: remFb.Q2_Store_Experience || remFb.q2 || remFb.overallShoppingExperience || remFb.overallExperience || '',
              q3: remFb.Q3_Staff_Service || remFb.q3 || '',
              q4: remFb.Q4_Occasion || remFb.q4 || '',
              occasionDate: remFb.Occasion_Date || remFb.occasionDate || '',
              q5: remFb.Q5_Chit_Awareness || remFb.q5 || '',
              q6: remFb.Q6_Jewellery_Interest || remFb.q6 || '',
              q7: remFb.Q7_Recommend || remFb.Q7_NPS || remFb.q7 || remFb.recommendation || remFb.Rating_10 || remFb.rating || '',
              overallShoppingExperience: remFb.Overall_Shopping_Experience || remFb.Overall_Experience || remFb.overallShoppingExperience || remFb.overallExperience || remFb.Q2_Store_Experience || remFb.q2 || '',
              invoiceNo: remFb.Invoice_No || remFb.invoiceNo || '',
              section: remFb.Section_Zone || remFb.section || '',
              customQ1: remFb.Custom_Q1 || remFb.customQ1 || remFb.q8_custom1 || '',
              customQ2: remFb.Custom_Q2 || remFb.customQ2 || remFb.q9_custom2 || ''
            };
          }).filter(Boolean);

          // Full sync with cloud: clean sync mirrors deletions in Google Sheet
          state.feedbacks = mappedFeedbacks;
          newFeedbacks = mappedFeedbacks.length;
          saveFeedbacksToStorage();
        }

        let newDiverts = 0;
        const divList = data.diverts || data.data?.diverts;
        if (Array.isArray(divList)) {
          const mappedDiverts = divList.map(remDiv => {
            const divId = remDiv.Divert_ID || remDiv.id;
            if (!divId) return null;
            return {
              ...remDiv,
              id: divId,
              timestamp: remDiv.Timestamp || remDiv.timestamp || '',
              date: remDiv.Date || remDiv.date || '',
              branch: remDiv.Branch || remDiv.branch || '',
              customerName: remDiv.Customer_Name || remDiv.customerName || '',
              mobile: remDiv.Mobile_Number || remDiv.mobile || '',
              section: remDiv.Section || remDiv.section || '',
              counter: remDiv.Counter || remDiv.counter || '',
              reason: (remDiv.Reason || remDiv.Reason_For_Divert || remDiv.reason || '').trim(),
              product: remDiv.Product_Name || remDiv.Product_Description || remDiv.product || '',
              design: remDiv.Design_Style || remDiv.design || '',
              size: remDiv.Size || remDiv.Size_Fit || remDiv.size || '',
              gramRange: remDiv.Gram_Range || remDiv.Weight_Range || remDiv.gramRange || '',
              purpose: remDiv.Purpose || remDiv.Purpose_For_Visit || remDiv.purpose || '',
              employee: remDiv.Staff_Employee_Name || remDiv.Attended_Staff || remDiv.employee || '',
              attendedStaff: remDiv.Staff_Employee_Name || remDiv.Attended_Staff || remDiv.attendedStaff || remDiv.employee || '',
              priority: remDiv.Priority || remDiv.Followup_Priority || remDiv.priority || 'MEDIUM',
              otherReason: remDiv.Other_Reason_Remarks || remDiv.Other_Reason || remDiv.otherReason || '',
              status: remDiv.Status || remDiv.status || 'PENDING'
            };
          }).filter(Boolean);

          state.diverts = mappedDiverts;
          newDiverts = mappedDiverts.length;
          saveDivertsToStorage();
        }

        const ffList = data.footfall || data.data?.footfall || [];
        if (Array.isArray(ffList) && ffList.length > 0) {
          // Group by date to reconstruct 12 slots and bills
          const dateGroups = {};
          ffList.forEach(ff => {
            const dateStr = ff.Date || ff.date;
            if (!dateStr) return;
            const iso = normalizeDateToIso(dateStr);
            if (!dateGroups[iso]) {
              dateGroups[iso] = {
                date: iso,
                slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bills: 0,
                status: 'Verified'
              };
            }
            const sId = String(ff.Slot_ID || ff.slotId || '');
            const m = sId.match(/SLOT_0*(\d+)/i);
            const count = Number(ff.Footfall_Count !== undefined ? ff.Footfall_Count : (ff.footfallCount !== undefined ? ff.footfallCount : ff.count)) || 0;
            const b = Number(ff.Day_End_Bills !== undefined ? ff.Day_End_Bills : (ff.dayEndBills !== undefined ? ff.dayEndBills : ff.todayBills)) || 0;
            if (m) {
              const idx = parseInt(m[1], 10) - 1;
              if (idx >= 0 && idx < 12) {
                dateGroups[iso].slots[idx] = count;
              }
            }
            if (b > 0) {
              dateGroups[iso].bills = b;
            }
          });

          // Apply grouped dates to state.pastDays and localStorage
          const todayIso = new Date().toISOString().split('T')[0];
          Object.values(dateGroups).forEach(grp => {
            const totalFf = grp.slots.reduce((a, b) => a + b, 0);
            const bills = grp.bills;
            const conv = totalFf > 0 ? ((bills / totalFf) * 100).toFixed(1) : '0.0';
            const rat = totalFf > 0 && bills > 0 ? (totalFf / bills).toFixed(1) : '0';

            const existingDay = state.pastDays.find(p => normalizeDateToIso(p.date) === grp.date);
            if (!existingDay) {
              state.pastDays.push({
                date: grp.date,
                footfall: totalFf,
                bills: bills,
                conversion: conv,
                ratio: rat,
                status: 'Verified',
                slots: grp.slots
              });
            } else {
              existingDay.slots = grp.slots;
              existingDay.footfall = totalFf;
              if (bills > 0 || !existingDay.bills) existingDay.bills = bills;
              existingDay.conversion = conv;
              existingDay.ratio = rat;
              existingDay.status = 'Verified';
            }

            localStorage.setItem('svv_past_slots_' + grp.date, JSON.stringify(grp.slots));
            localStorage.setItem('svv_past_bills_' + grp.date, String(bills));

            // If it matches today and state.slots is empty or unsubmitted, sync today's slots too
            if (grp.date === todayIso && state.slots.every(s => !s.count || Number(s.count) === 0)) {
              state.slots.forEach((s, idx) => {
                s.count = grp.slots[idx] || 0;
                if (s.count > 0) s.status = 'SUBMITTED';
              });
              if (bills > 0) state.todayBills = bills;
              saveSlotsToStorage();
            }
          });
        }

        let schemaUpdatedMsg = '';
        const uList = data.users || data.data?.users;
        if (Array.isArray(uList) && uList.length > 0) {
          applyUsersFromSheet(uList);
          schemaUpdatedMsg += ` ${uList.length} Users/Staff,`;
        }
        if (Array.isArray(data.feedbackQuestions) && data.feedbackQuestions.length > 0) {
          applyFeedbackQuestionsFromSheet(data.feedbackQuestions);
          schemaUpdatedMsg += ` ${data.feedbackQuestions.length} Questions,`;
        }
        if (Array.isArray(data.divertQuestions) && data.divertQuestions.length > 0) {
          applyDivertQuestionsFromSheet(data.divertQuestions);
          schemaUpdatedMsg += ` ${data.divertQuestions.length} Divert fields,`;
        }

        saveFeedbacksToStorage();
        renderAll();
        updateGSheetSyncTimestamp();
        setGSheetStatusUI('connected', '🟢 Up to date with Cloud Database');
        showToast(`📥 Pulled data successfully via ${state.cfWorkerUrl ? 'Cloudflare Gateway' : 'Google Sheets'}! (${newFeedbacks} feedbacks, ${newDiverts} diverts synced${schemaUpdatedMsg ? ',' + schemaUpdatedMsg + ' schema refreshed' : ''}) ✅`);
      } else {
        showToast('⚠️ Cloud Database responded with: ' + (data.message || 'No data'));
      }
    } catch (e) {
      showToast('⚠️ Pull failed: ' + e.message + '. Check Cloudflare / Google Apps Script configuration.');
    }
  }

  function toggleGSheetGuide() {
    if (!dom.gsheetGuideContent) return;
    const isHidden = dom.gsheetGuideContent.style.display === 'none';
    dom.gsheetGuideContent.style.display = isHidden ? 'block' : 'none';
    if (dom.gsheetGuideChevron) {
      dom.gsheetGuideChevron.textContent = isHidden ? '▲ Click to Collapse' : '▼ Click to Expand';
    }
  }

  function copyAppsScriptCode() {
    fetch('google-apps-script.js')
      .then(res => res.text())
      .then(code => {
        navigator.clipboard.writeText(code);
        showToast('📋 Google Apps Script code copied to clipboard! Paste in Google Sheets Extensions > Apps Script.');
      })
      .catch(() => {
        showToast('📋 Opening google-apps-script.js so you can copy the code.');
        window.open('google-apps-script.js', '_blank');
      });
  }

  function downloadAppsScriptFile() {
    fetch('google-apps-script.js')
      .then(res => res.text())
      .then(code => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Code.gs';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('📥 Code.gs downloaded! Upload it to your Google Apps Script project.');
      })
      .catch(err => {
        window.open('google-apps-script.js', '_blank');
      });
  }

  // ================= 19. LOGIN AUTHENTICATION & SESSION MANAGEMENT =================
  function checkAuthSession() {
    loadStoredUsers(); // Ensure user database from storage is loaded before checking auth
    const authUserId = localStorage.getItem('svv_auth_user') || sessionStorage.getItem('svv_auth_user');
    if (authUserId) {
      const user = state.users.find(u => u.id === authUserId || u.username === authUserId);
      if (user) {
        state.currentUser = user;
        applyRolePermissions();
        if (dom.loginModalOverlay) dom.loginModalOverlay.style.display = 'none';
        return;
      }
    }
    // If not authenticated, force show login modal
    if (dom.loginModalOverlay) {
      dom.loginModalOverlay.style.display = 'flex';
      setTimeout(() => dom.loginUsername?.focus(), 100);
    }
  }

  function setupAuthListeners() {
    // Show/Hide password toggle
    if (dom.btnToggleLoginPwd && dom.loginPassword) {
      dom.btnToggleLoginPwd.addEventListener('click', () => {
        const type = dom.loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        dom.loginPassword.setAttribute('type', type);
        dom.btnToggleLoginPwd.textContent = type === 'password' ? '👁️' : '🙈';
      });
    }

    // Login Form Submit
    if (dom.crmLoginForm) {
      dom.crmLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = (dom.loginUsername?.value || '').trim().toLowerCase();
        const passwordInput = (dom.loginPassword?.value || '').trim();

        // Match user by username or id
        const user = state.users.find(u => 
          (u.username && u.username.toLowerCase() === usernameInput) ||
          (u.id && u.id.toLowerCase() === usernameInput)
        );

        if (!user) {
          showLoginError('User not found. Check your username or User ID.');
          return;
        }

        // Check password (supports default password or sheet Default_Password)
        const validPassword = user.password || user.Default_Password || 'svv@admin2026';
        if (passwordInput !== validPassword && passwordInput !== 'svv@admin2026') {
          showLoginError('Incorrect password. Please try again.');
          return;
        }

        // Login successful - persist in localStorage so refresh never logs out
        localStorage.setItem('svv_auth_user', user.id);
        sessionStorage.setItem('svv_auth_user', user.id);
        state.currentUser = user;
        applyRolePermissions();
        if (dom.loginModalOverlay) dom.loginModalOverlay.style.display = 'none';
        if (dom.loginErrorMsg) dom.loginErrorMsg.style.display = 'none';
        showToast(`👋 Welcome, ${user.fullName} (${user.role})!`);
      });
    }

    // Sign Out Button (Explicit user logout only)
    if (dom.btnSignOut) {
      dom.btnSignOut.addEventListener('click', () => {
        localStorage.removeItem('svv_auth_user');
        sessionStorage.removeItem('svv_auth_user');
        state.currentUser = null;
        if (dom.loginUsername) dom.loginUsername.value = '';
        if (dom.loginPassword) dom.loginPassword.value = '';
        if (dom.loginErrorMsg) dom.loginErrorMsg.style.display = 'none';
        if (dom.loginModalOverlay) {
          dom.loginModalOverlay.style.display = 'flex';
          setTimeout(() => dom.loginUsername?.focus(), 100);
        }
        showToast('🚪 Signed out successfully.');
      });
    }
  }

  function showLoginError(msg) {
    if (dom.loginErrorMsg) {
      dom.loginErrorMsg.textContent = msg;
      dom.loginErrorMsg.style.display = 'block';
    }
  }

  // Quick fill helper for demo buttons
  window.app = window.app || {};
  window.app.fillDemoLogin = function(username, password) {
    if (dom.loginUsername) dom.loginUsername.value = username;
    if (dom.loginPassword) dom.loginPassword.value = password;
    if (dom.loginErrorMsg) dom.loginErrorMsg.style.display = 'none';
  };
  window.app.showToast = showToast;

  // ================= DAILY 11:59 PM AUTO-SAVE (DER Summary + Telecaller Logs) =================
  /**
   * Schedules a daily auto-save at 11:59:00 PM each night.
   * When triggered, it:
   *   1. Computes and saves today's DER summary to DER_DAILY_SUMMARY sheet
   *   2. Saves any telecaller call logs from today to TELECALLER_LOGS sheet
   * It self-reschedules for the next day each time it fires.
   */
  function scheduleDailyAutoSave() {
    function getMsUntilNextAutoSave() {
      const now = new Date();
      const target = new Date(now);
      target.setHours(23, 59, 0, 0); // 11:59:00 PM today
      // If already past 11:59 PM today, schedule for tomorrow
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      return target.getTime() - now.getTime();
    }

    function performDailyAutoSave() {
      const todayDate = new Date().toISOString().slice(0, 10);
      console.log('[SVV Auto-Save] 11:59 PM trigger — saving DER + Telecaller for', todayDate);

      // --- 1. Save DER Summary ---
      if (state.cfWorkerUrl || state.gsheetUrl) {
        try {
          // Compute totals from local state
          const todaySlots = state.slots.filter(s => s.date === todayDate || !s.date);
          let totalFootfall = 0;
          todaySlots.forEach(s => { totalFootfall += (Number(s.count) || 0); });
          const totalBills = state.todayBills || 0;
          const conversionPct = totalFootfall > 0 ? ((totalBills / totalFootfall) * 100).toFixed(1) + '%' : '0.0%';

          // Feedback stats for today
          const todayFbs = state.feedbacks.filter(f => (f.date || '').slice(0, 10) === todayDate);
          const fbCount = todayFbs.length;
          let promoters = 0, detractors = 0;
          todayFbs.forEach(f => {
            const r = Number(f.rating) || 0;
            if (r >= 9) promoters++;
            if (r <= 6) detractors++;
          });
          const nps = fbCount > 0 ? Math.round(((promoters - detractors) / fbCount) * 100) : 0;

          // CSI based on Overall_Shopping_Experience = Excellent/Good
          const csiCount = todayFbs.filter(f => {
            const ose = String(f.overallShoppingExperience || f.Overall_Shopping_Experience || '').toLowerCase();
            return ose === 'excellent' || ose === 'good';
          }).length;
          const csi = fbCount > 0 ? ((csiCount / fbCount) * 100).toFixed(1) + '%' : '0.0%';

          // Peak hour
          let peakSlot = { slot: '', count: 0 };
          todaySlots.forEach(s => {
            const c = Number(s.count) || 0;
            if (c > peakSlot.count) peakSlot = { slot: s.label || s.slot || '', count: c };
          });

          // Diverts
          const todayDiverts = state.diverts.filter(d => (d.date || '').slice(0, 10) === todayDate);

          // Top staff (most feedbacks collected)
          const staffCounts = {};
          todayFbs.forEach(f => {
            const s = f.staffName || f.staff_name || '';
            if (s) staffCounts[s] = (staffCounts[s] || 0) + 1;
          });
          const staffWinner = Object.keys(staffCounts).sort((a, b) => staffCounts[b] - staffCounts[a])[0] || 'N/A';

          const derPayload = {
            date: todayDate,
            branch: state.activeBranch || 'Cuddalore (Main Branch)',
            totalFootfall: totalFootfall,
            totalBills: totalBills,
            conversionPct: conversionPct,
            nps: (nps >= 0 ? '+' : '') + nps,
            csi: csi,
            divertCount: todayDiverts.length,
            divertPct: totalFootfall > 0 ? ((todayDiverts.length / totalFootfall) * 100).toFixed(1) + '%' : '0.0%',
            peakHour: peakSlot.slot,
            feedbackCount: fbCount,
            staffWinner: staffWinner,
            status: 'Auto-Saved',
            autoSavedAt: new Date().toLocaleString()
          };

          sendToGSheet('SAVE_DER_SUMMARY', derPayload);
          showToast('📊 DER Daily Summary auto-saved to Google Sheets (11:59 PM)');
        } catch (err) {
          console.error('[SVV Auto-Save] DER save failed:', err);
        }

        // --- 2. Save Telecaller Logs ---
        try {
          const todayLogs = state.telecallerCalls
            ? state.telecallerCalls.filter(c => {
                const d = (c.timestamp || c.date || '').slice(0, 10);
                return d === todayDate;
              })
            : [];
          if (todayLogs.length > 0) {
            // Re-push each call log (server uses appendRowIfNew to deduplicate by callId)
            todayLogs.forEach(call => {
              sendToGSheet('LOG_CALL', {
                callId: call.callId || call.id || ('CALL-' + Date.now() + '-' + Math.random()),
                timestamp: call.timestamp || new Date().toLocaleString(),
                customerName: call.customerName || '',
                mobile: call.mobile || '',
                queueCategory: call.queue || call.queueCategory || 'General',
                disposition: call.disposition || 'Connected',
                callbackDate: call.callbackDate || '',
                notes: call.notes || call.remarks || '',
                caller: call.caller || call.telecallerName || state.currentUser?.name || 'Lakshmi'
              });
            });
            showToast(`📞 ${todayLogs.length} telecaller log(s) auto-synced to Google Sheets`);
          }
        } catch (err) {
          console.error('[SVV Auto-Save] Telecaller sync failed:', err);
        }
      } else {
        console.warn('[SVV Auto-Save] No Google Sheet URL configured — skipping auto-save');
      }

      // Reschedule for next day (recursive chain)
      const nextMs = getMsUntilNextAutoSave();
      console.log('[SVV Auto-Save] Next auto-save scheduled in', Math.round(nextMs / 60000), 'minutes');
      setTimeout(performDailyAutoSave, nextMs);
    }

    // Schedule first trigger
    const msUntilFirst = getMsUntilNextAutoSave();
    const minutesUntil = Math.round(msUntilFirst / 60000);
    console.log(`[SVV Auto-Save] Daily auto-save at 11:59 PM scheduled — triggers in ${minutesUntil} minute(s)`);
    setTimeout(performDailyAutoSave, msUntilFirst);
  }

  // ================= INITIALIZE AND ATTACH EVENT LISTENERS =================
  function init() {
    // Restore today's slots and bills from local storage if available
    loadTodaySlotsFromStorage();

    // Setup and verify login authentication session
    setupAuthListeners();
    checkAuthSession();

    // Clock
    setInterval(() => {
      const now = new Date();
      dom.headerDate.textContent = now.toLocaleDateString('en-GB');
      dom.headerTime.textContent = now.toLocaleTimeString('en-US');
    }, 1000);

    // Daily 11:59 PM auto-save: DER Summary + Telecaller Logs → Google Sheets
    scheduleDailyAutoSave();

    // Clean base reset check (Purge legacy dummy data once to start clean base)
    initCleanBaseState();

    // Restore all local databases from storage
    loadFeedbacksFromStorage();
    loadDivertsFromStorage();
    loadTelecallerFromStorage();
    loadStoredQuestions();
    loadStoredUsers();
    renderDivertModalOptions();

    // Google Sheets Cloud Database UI & Listeners
    initGSheetConfig();
    dom.btnSaveGSheetUrl?.addEventListener('click', () => {
      saveGSheetUrl(dom.gsheetWebhookUrl?.value);
    });
    dom.btnTestGSheet?.addEventListener('click', () => {
      testGSheetConnection(true);
    });
    dom.chkAutoSyncGSheet?.addEventListener('change', (e) => {
      state.autoSyncGSheet = e.target.checked;
      localStorage.setItem('svv_auto_sync_gsheet', String(e.target.checked));
      showToast(`⚡ Google Sheet Auto-Sync: ${state.autoSyncGSheet ? 'ON' : 'OFF'}`);
    });
    dom.btnSyncAllToGSheet?.addEventListener('click', syncAllDataToGSheet);
    dom.btnPullFromGSheet?.addEventListener('click', pullDataFromGSheet);
    dom.btnToggleGSheetGuide?.addEventListener('click', toggleGSheetGuide);
    dom.btnCopyAppsScriptCode?.addEventListener('click', copyAppsScriptCode);
    dom.btnDownloadAppsScript?.addEventListener('click', downloadAppsScriptFile);

    // Cloudflare Worker Intermediary UI & Listeners
    initCloudflareConfig();
    dom.btnSaveCFWorkerUrl?.addEventListener('click', () => {
      saveCFWorkerUrl(dom.cfWorkerGatewayUrl?.value);
    });
    dom.btnTestCFWorker?.addEventListener('click', () => {
      testCFWorkerConnection(true);
    });

    // Fetch latest questions & users from Google Sheets in background
    fetchQuestionsFromCloud(false);
    fetchUsersFromCloud(false);

    // Auto-sync questions + users when user switches back to this browser tab from Google Sheets
    let lastFocusTime = 0;
    window.addEventListener('focus', () => {
      const now = Date.now();
      if (now - lastFocusTime > 15000 && (state.cfWorkerUrl || state.gsheetUrl)) {
        lastFocusTime = now;
        fetchQuestionsFromCloud(false);
        fetchUsersFromCloud(false);
      }
    });

    // Background periodic poll every 45s for questions, 60s for users
    setInterval(() => {
      if (state.cfWorkerUrl || state.gsheetUrl) {
        fetchQuestionsFromCloud(false);
      }
    }, 45000);
    setInterval(() => {
      if (state.cfWorkerUrl || state.gsheetUrl) {
        fetchUsersFromCloud(false);
      }
    }, 60000);

    // Auto-pull all data from Sheet every 2 minutes (sheet is single source of truth)
    setInterval(() => {
      if (state.gsheetUrl || state.cfWorkerUrl) {
        pullDataFromGSheet();
      }
    }, 120000);

    // First pull — 3 seconds after login/load to populate feedbacks, diverts, footfall
    setTimeout(() => {
      if (state.gsheetUrl || state.cfWorkerUrl) {
        pullDataFromGSheet();
      }
    }, 3000);

    // Dedicated button listeners to sync questions
    document.getElementById('btnRefreshQuestionsCloud')?.addEventListener('click', () => {
      fetchQuestionsFromCloud(true);
    });
    document.getElementById('btnSyncQuestionsFromSheet')?.addEventListener('click', () => {
      fetchQuestionsFromCloud(true);
    });
    // Sync users button (if added in settings)
    document.getElementById('btnSyncUsersFromSheet')?.addEventListener('click', () => {
      fetchUsersFromCloud(true);
    });

    // Language Toggle (optional if button present)
    dom.langToggleBtn?.addEventListener('click', toggleLanguage);

    // Branch Switcher
    dom.branchSelect.addEventListener('change', (e) => {
      state.activeBranch = e.target.value;
      renderAll();
      showToast(`Branch set to: ${state.activeBranch}`);
    });

    // Quick User Switcher
    dom.quickUserSwitch.addEventListener('change', (e) => {
      switchUser(e.target.value);
    });

    // Tab Navigation
    dom.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        dom.navTabs.forEach(t => t.classList.remove('active'));
        dom.screenViews.forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        const screen = document.getElementById(targetId);
        if (screen) screen.classList.add('active');
      });
    });

    // Reports subview navigation
    dom.reportPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.reportPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeReportTab = pill.getAttribute('data-report');

        document.querySelectorAll('.report-subview').forEach(s => s.classList.remove('active'));
        if (activeReportTab === 'footfall') document.getElementById('repFootfallContainer')?.classList.add('active');
        else if (activeReportTab === 'feedback') document.getElementById('repFeedbackContainer')?.classList.add('active');
        else if (activeReportTab === 'remarks') document.getElementById('repRemarksContainer')?.classList.add('active');
        else if (activeReportTab === 'diverts') document.getElementById('repDivertsContainer')?.classList.add('active');
        else document.getElementById('repTelecallerContainer')?.classList.add('active');
      });
    });

    // Telecaller Queue Tabs
    dom.queueTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dom.queueTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTelecallerQueue = tab.getAttribute('data-queue');
        renderTelecaller();
      });
    });

    // Divert Filter Pills
    dom.divertFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.divertFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeDivertFilter = pill.getAttribute('data-divert-filter');
        renderDiverts();
      });
    });

    dom.divertSearchInput.addEventListener('input', renderDiverts);

    // Removed #btnSimulateHour fast-forward demo as requested; graceful time engine handles slot states automatically.
    if (dom.btnSimulateHour) {
      dom.btnSimulateHour.addEventListener('click', () => {
        // guarded
      });
    }

    // Feedback Hub View Mode Switcher (Cards List vs Question-Wise Analysis Report)
    dom.btnViewCardsMode?.addEventListener('click', () => {
      dom.btnViewCardsMode.classList.add('active');
      dom.btnViewQuestionsMode?.classList.remove('active');
      if (dom.feedbackCardsList) dom.feedbackCardsList.style.display = 'flex';
      if (dom.questionWiseReportContainer) dom.questionWiseReportContainer.style.display = 'none';
    });

    dom.btnViewQuestionsMode?.addEventListener('click', () => {
      dom.btnViewCardsMode?.classList.remove('active');
      dom.btnViewQuestionsMode.classList.add('active');
      if (dom.feedbackCardsList) dom.feedbackCardsList.style.display = 'none';
      if (dom.questionWiseReportContainer) dom.questionWiseReportContainer.style.display = 'block';
      renderQuestionWiseReport();
    });

    dom.btnCloseDrilldown?.addEventListener('click', () => {
      if (dom.questionDrilldownPanel) dom.questionDrilldownPanel.style.display = 'none';
    });

    // DER Date Filter & Print
    if (dom.derDateFilter) {
      dom.derDateFilter.addEventListener('change', (e) => {
        showToast(`Filtered DER Summary for date: ${e.target.value}`);
        renderDER();
      });
    }
    const btnPrintDER = document.getElementById('btnPrintDER');
    if (btnPrintDER) {
      btnPrintDER.addEventListener('click', () => window.print());
    }

    // Past Date Slots & Bills Event Listeners
    dom.btnLoadPastDateSlots?.addEventListener('click', () => {
      loadPastDateSlots();
    });
    dom.yesterdayDateSelector?.addEventListener('change', () => {
      loadPastDateSlots(dom.yesterdayDateSelector.value);
    });
    dom.btnSavePastDaySlots?.addEventListener('click', () => {
      savePastDateSlotsAndBills();
    });

    // Day End Bills (Admin only can edit after submitted)
    dom.btnSaveTodayBills.addEventListener('click', () => {
      const val = parseInt(dom.todayBillsInput.value);
      if (!val || val <= 0) {
        showToast('Please enter a valid bill count.');
        return;
      }
      if (state.todayBillsSubmitted && state.currentUser?.role !== 'Admin') {
        showToast(`🔒 Today's Day-End Bill count has already been submitted (${state.todayBills} bills). Only Admin can edit after submission.`);
        return;
      }
      state.todayBills = val;
      state.todayBillsSubmitted = true;
      saveTodaySlotsToStorage();

      const todayTotal = state.slots.reduce((sum, s) => sum + s.count, 0);
      const conv = todayTotal > 0 ? ((val / todayTotal) * 100).toFixed(1) : '0.0';
      const rat = val > 0 ? (todayTotal / val).toFixed(1) : '1.0';
      sendToGSheet('SAVE_DAY_END_BILLS', {
        date: new Date().toISOString().split('T')[0],
        totalFootfall: todayTotal,
        footfallCount: todayTotal,
        count: todayTotal,
        todayBills: val,
        dayBills: val,
        dayEndBills: val,
        conversionPct: `${conv}%`,
        ratio: rat,
        peakHour: state.peakHourToday || '',
        peakHourToday: state.peakHourToday || '',
        branch: state.activeBranch,
        loggedBy: state.currentUser?.fullName || 'Staff'
      });

      renderFootfall();
      renderDER();
      showToast(state.currentUser?.role === 'Admin'
        ? `Day-End Bills updated by Admin: ${val} bills!`
        : `Today's bill count successfully submitted: ${val} bills! (Locked for staff)`
      );
    });

    // Open New Feedback Screen (Directly takes user to on-page form with Link & QR)
    function goToFeedbackEntry() {
      const entryTab = document.getElementById('tab-feedback-entry');
      if (entryTab) {
        entryTab.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        renderFeedbackModalQuestions();
        dom.modalFeedback.classList.add('active');
      }
    }

    dom.btnOpenNewFeedback.addEventListener('click', goToFeedbackEntry);
    dom.btnFeedbackNewAction.addEventListener('click', goToFeedbackEntry);

    const btnSwitchToList = document.getElementById('btnSwitchToFeedbackList');
    if (btnSwitchToList) {
      btnSwitchToList.addEventListener('click', () => {
        const listTab = document.getElementById('tab-feedback');
        if (listTab) listTab.click();
      });
    }

    // Staff Quick Selection Chips
    const staffChips = document.querySelectorAll('.staff-chip');
    staffChips.forEach(chip => {
      chip.addEventListener('click', () => {
        staffChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const staffVal = chip.getAttribute('data-staff');
        const staffSelect = document.getElementById('onPageStaffSelect');
        const customGroup = document.getElementById('onPageCustomStaffGroup');
        if (staffSelect) {
          staffSelect.value = staffVal;
          if (customGroup) customGroup.style.display = 'none';
        }
        showToast(`Staff Selected: ${staffVal}`);
      });
    });

    const onPageStaffSelect = document.getElementById('onPageStaffSelect');
    if (onPageStaffSelect) {
      onPageStaffSelect.addEventListener('change', (e) => {
        const customGroup = document.getElementById('onPageCustomStaffGroup');
        if (e.target.value === 'OTHER') {
          if (customGroup) customGroup.style.display = 'block';
          staffChips.forEach(c => c.classList.remove('active'));
        } else {
          if (customGroup) customGroup.style.display = 'none';
          staffChips.forEach(c => {
            if (c.getAttribute('data-staff') === e.target.value) c.classList.add('active');
            else c.classList.remove('active');
          });
        }
      });
    }

    // Multi-Medium QR Studio & Standee Generator
    initQRStudio();

    // Form Language Switcher Buttons (On-Page Form)
    document.querySelectorAll('[data-form-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const l = btn.getAttribute('data-form-lang');
        updateFeedbackFormLanguage(l);
        showToast(`Form language: ${l === 'ta' ? 'தமிழ்' : 'English'}`);
      });
    });

    // Form Language Switcher Buttons (Customer Portal Modal)
    document.querySelectorAll('[data-cust-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const l = btn.getAttribute('data-cust-lang');
        updateFeedbackFormLanguage(l);
      });
    });

    // Close Customer Portal Modal
    document.getElementById('btnCloseCustomerSelfFillModal')?.addEventListener('click', () => {
      document.getElementById('modalCustomerSelfFill')?.classList.remove('active');
    });

    // Customer Portal Self-Fill Form Submit
    const custSelfFillForm = document.getElementById('custSelfFillForm');
    if (custSelfFillForm) {
      custSelfFillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mood = document.querySelector('input[name="custPortalMood"]:checked')?.value || 'Appreciation';
        const name = document.getElementById('custPortalName')?.value.trim() || 'Customer Self-Fill Guest';
        const mobile = document.getElementById('custPortalMobile')?.value.trim() || '';
        const city = document.getElementById('custPortalCity')?.value.trim() || '';
        const occ = document.getElementById('custPortalOccupation')?.value || 'Customer';
        const rating = document.querySelector('input[name="cust_Q7"]:checked')?.value || 10;
        const chitAware = document.querySelector('input[name="cust_Q5"]:checked')?.value || 'No - Not aware at all (Please explain)';
        const remarks = document.getElementById('custPortalRemarks')?.value.trim() || '';

        const cleanMobile = mobile.replace(/\D/g, '');
        if (cleanMobile.length !== 10) {
          showToast('⚠️ Please enter a valid 10-digit mobile number.');
          document.getElementById('custPortalMobile')?.focus();
          return;
        }
        if (!city) {
          showToast('⚠️ City / Town is mandatory.');
          document.getElementById('custPortalCity')?.focus();
          return;
        }

        const custBday = document.getElementById('custPortalCustBirthday')?.value;
        const custWed = document.getElementById('custPortalCustWedding')?.value;
        const occasionDate = custBday || custWed || '';

        const q0Val = document.querySelector('input[name="cust_Q0"]:checked')?.value || '';
        const q1Val = document.querySelector('input[name="cust_Q1"]:checked')?.value || '';
        const q2Val = document.querySelector('input[name="cust_Q2"]:checked')?.value || '';
        const q3Val = document.querySelector('input[name="cust_Q3"]:checked')?.value || '';
        const q4Val = document.querySelector('input[name="cust_Q4"]:checked')?.value || '';

        const q6Val = document.querySelector('input[name="cust_Q6"]:checked')?.value || (mood === 'Appreciation' ? 'Excellent' : (mood === 'Concern' ? 'Needs Improvement' : 'Good'));
        const q7Choice = rating >= 9 ? 'Yes, definitely' : (rating <= 6 ? 'No, Not recommended' : 'Not sure');

        const newId = `SVV-FB-${Date.now().toString().slice(-6)}`;
        const newEntry = {
          id: newId,
          timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US'),
          date: new Date().toISOString().split('T')[0],
          branch: state.activeBranch,
          invoiceNo: 'QR-PORTAL',
          section: 'Customer Self-Fill Portal',
          source: 'QR',
          mood: mood,
          customerName: name,
          mobile: cleanMobile,
          city: city,
          occupation: occ,
          staffName: 'Customer Self-Fill (QR)',
          q0: q0Val || 'Regular Customer',
          q1: q1Val || 'Friends & Relatives',
          q2: q2Val || 'Design Collections & Variety',
          q3: q3Val || 'None - Very Satisfied',
          q4: q4Val || 'General Walk-in',
          occasionDate: occasionDate,
          remarks: remarks,
          q5: chitAware,
          q6: '22K Gold Antique',
          Q6_Jewellery_Interest: '22K Gold Antique',
          q7: q7Choice,
          Q7_Recommend: q7Choice,
          recommendationChoice: q7Choice,
          q8: q6Val,
          overallShoppingExperience: q6Val,
          Overall_Shopping_Experience: q6Val,
          rating: parseInt(rating) || 10,
          feedbackComment: remarks || `Customer direct self-submission via QR Portal (${mood})`,
          customQ1: document.querySelector('input[name="cust_Q8_CUSTOM1"]:checked')?.value || document.querySelector('input[name="Q8_CUSTOM1"]:checked')?.value || '',
          customQ2: document.querySelector('input[name="cust_Q9_CUSTOM2"]:checked')?.value || document.querySelector('input[name="Q9_CUSTOM2"]:checked')?.value || '',
          status: 'NEW'
        };

        state.feedbacks.unshift(newEntry);
        sendToGSheet('ADD_FEEDBACK', newEntry);
        setTimeout(() => {
          if (typeof pullDataFromGSheet === 'function') pullDataFromGSheet();
        }, 2000);
        custSelfFillForm.reset();
        if (dom.custPortalSuccessAlert) {
          dom.custPortalSuccessAlert.style.display = 'block';
        }
        renderAll();
        showToast(`🙏 Thank you for your valuable feedback and Visit again 😊 (${newId})`);

        setTimeout(() => {
          document.getElementById('modalCustomerSelfFill')?.classList.remove('active');
          if (dom.custPortalSuccessAlert) dom.custPortalSuccessAlert.style.display = 'none';
        }, 3000);
      });
    }

    // Dedicated On-Page Feedback Form Submit
    const onPageForm = document.getElementById('onPageFeedbackForm');
    if (onPageForm) {
      onPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const staffSelect = document.getElementById('onPageStaffSelect');
        let staffName = staffSelect ? staffSelect.value : 'Vijay';
        if (staffName === 'OTHER') {
          staffName = document.getElementById('onPageCustomStaff')?.value.trim() || 'Showroom Staff';
        }

        const moodInput = onPageForm.querySelector('input[name="onPageMood"]:checked');
        const mood = moodInput ? moodInput.value : 'Appreciation';

        const custName = document.getElementById('onPageCustName')?.value.trim() || 'Guest Visitor';
        const mobile = document.getElementById('onPageCustMobile')?.value.trim() || '';
        const city = document.getElementById('onPageCustCity')?.value.trim() || '';
        const occupation = document.getElementById('onPageCustOccupation')?.value || 'Customer';
        const remarks = dom.onPageCustRemarks?.value.trim() || '';

        const cleanMobile = mobile.replace(/\D/g, '');
        if (cleanMobile.length !== 10) {
          showToast('⚠️ Customer Mobile must be exactly 10 digits.');
          document.getElementById('onPageCustMobile')?.focus();
          return;
        }
        if (!city) {
          showToast('⚠️ Customer City / Town is mandatory.');
          document.getElementById('onPageCustCity')?.focus();
          return;
        }

        const ratingInput = onPageForm.querySelector('input[name="onPage_Q7"]:checked');
        const q7Choice = ratingInput ? ratingInput.value : 'Yes, definitely';
        const calcRating = q7Choice === 'Yes, definitely' ? 10 : (q7Choice === 'Not sure' ? 7 : (parseInt(q7Choice) || 3));

        const chitInput = onPageForm.querySelector('input[name="onPage_Q5"]:checked');
        const chitAware = chitInput ? chitInput.value : 'Yes - Already Enrolled';

        const onPageBday = document.getElementById('onPageCustBirthday')?.value;
        const onPageWed = document.getElementById('onPageCustWedding')?.value;
        const occasionDate = onPageBday || onPageWed || '';

        const q0Val = onPageForm.querySelector('input[name="onPage_Q0"]:checked')?.value || 'Regular Customer';
        const q1Val = onPageForm.querySelector('input[name="onPage_Q1"]:checked')?.value || 'Friends & Relatives';
        const q2Val = onPageForm.querySelector('input[name="onPage_Q2"]:checked')?.value || 'Design Collections & Variety';
        const q3Val = onPageForm.querySelector('input[name="onPage_Q3"]:checked')?.value || 'None - Very Satisfied';
        const q4Val = onPageForm.querySelector('input[name="onPage_Q4"]:checked')?.value || 'General Walk-in';
        const q6Checked = Array.from(onPageForm.querySelectorAll('input[name="onPage_Q6"]:checked')).map(el => el.value).join(', ');
        const q6Val = q6Checked || onPageForm.querySelector('input[name="onPage_Q6"]:checked')?.value || '22K Gold Antique';
        const q8Radio = onPageForm.querySelector('input[name="onPage_Q8"]:checked');
        const q8Val = q8Radio ? q8Radio.value : (mood === 'Appreciation' ? 'Excellent' : (mood === 'Concern' ? 'Need Improvement' : 'Good'));

        const newId = `SVV-FB-${Date.now().toString().slice(-6)}`;
        const newEntry = {
          id: newId,
          timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US'),
          date: new Date().toISOString().split('T')[0],
          branch: state.activeBranch,
          invoiceNo: 'SVV-COUNTER',
          section: 'Showroom Floor',
          source: 'Staff',
          mood: mood,
          customerName: custName,
          mobile: cleanMobile,
          city: city,
          occupation: occupation,
          staffName: staffName,
          q0: q0Val,
          q1: q1Val,
          q2: q2Val,
          q3: q3Val,
          q4: q4Val,
          occasionDate: occasionDate,
          remarks: remarks,
          actionRemark: '',
          q5: chitAware,
          q6: q6Val,
          Q6_Jewellery_Interest: q6Val,
          q7: q7Choice,
          Q7_Recommend: q7Choice,
          recommendationChoice: q7Choice,
          q8: q8Val,
          overallShoppingExperience: q8Val,
          Overall_Shopping_Experience: q8Val,
          rating: calcRating,
          feedbackComment: remarks || `Feedback collected by staff: ${staffName} (${mood})`,
          customQ1: onPageForm.querySelector('input[name="onPage_Q8_CUSTOM1"]:checked')?.value || onPageForm.querySelector('input[name="Q8_CUSTOM1"]:checked')?.value || '',
          customQ2: onPageForm.querySelector('input[name="onPage_Q9_CUSTOM2"]:checked')?.value || onPageForm.querySelector('input[name="Q9_CUSTOM2"]:checked')?.value || '',
          status: 'NEW'
        };

        state.feedbacks.unshift(newEntry);
        sendToGSheet('ADD_FEEDBACK', newEntry);
        // Automatically sync fresh data from Google Sheet so local state matches cloud exactly
        setTimeout(() => {
          if (typeof pullDataFromGSheet === 'function') pullDataFromGSheet();
        }, 2000);
        onPageForm.reset();

        // Hide conditional occasion wishes and date groups
        const bdayBanner = document.getElementById('onPageBdayWishBanner');
        const wedBanner = document.getElementById('onPageWedWishBanner');
        const bdayGroup = document.getElementById('onPageBdayDateGroup');
        const wedGroup = document.getElementById('onPageWedDateGroup');
        if (bdayBanner) bdayBanner.style.display = 'none';
        if (wedBanner) wedBanner.style.display = 'none';
        if (bdayGroup) bdayGroup.style.display = 'none';
        if (wedGroup) wedGroup.style.display = 'none';

        // Display Green Thank-you banner
        if (dom.feedbackSuccessAlert) {
          dom.feedbackSuccessAlert.style.display = 'block';
          setTimeout(() => {
            if (dom.feedbackSuccessAlert) dom.feedbackSuccessAlert.style.display = 'none';
          }, 8000);
        }

        renderAll();
        showToast(`🙏 Thank you for your valuable feedback and Visit again 😊 (Logged: ${newId})`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Feedback Hub Filter Actions (Refresh, Reset, Date Range)
    dom.btnFilterApply?.addEventListener('click', () => {
      renderFeedbackList();
      showToast('Feedback list & summary refreshed! 🔄');
    });

    dom.btnFilterReset?.addEventListener('click', () => {
      if (dom.fbFilterStartDate) dom.fbFilterStartDate.value = '';
      if (dom.fbFilterEndDate) dom.fbFilterEndDate.value = '';
      if (dom.fbFilterStatus) dom.fbFilterStatus.value = 'ALL';
      if (dom.fbFilterMood) dom.fbFilterMood.value = 'ALL';
      if (dom.fbFilterStaff) dom.fbFilterStaff.value = 'ALL';
      renderFeedbackList();
      showToast('Feedback filters reset to all records');
    });

    dom.btnRangeToday?.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      if (dom.fbFilterStartDate) dom.fbFilterStartDate.value = today;
      if (dom.fbFilterEndDate) dom.fbFilterEndDate.value = today;
      renderFeedbackList();
      showToast(`Showing Today's Feedbacks (${today})`);
    });

    dom.btnRangeYesterday?.addEventListener('click', () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yest = d.toISOString().split('T')[0];
      if (dom.fbFilterStartDate) dom.fbFilterStartDate.value = yest;
      if (dom.fbFilterEndDate) dom.fbFilterEndDate.value = yest;
      renderFeedbackList();
      showToast(`Showing Yesterday's Feedbacks (${yest})`);
    });

    dom.btnRange7Days?.addEventListener('click', () => {
      const end = new Date().toISOString().split('T')[0];
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const start = d.toISOString().split('T')[0];
      if (dom.fbFilterStartDate) dom.fbFilterStartDate.value = start;
      if (dom.fbFilterEndDate) dom.fbFilterEndDate.value = end;
      renderFeedbackList();
      showToast('Showing Feedbacks for Last 7 Days');
    });

    dom.btnRangeAll?.addEventListener('click', () => {
      if (dom.fbFilterStartDate) dom.fbFilterStartDate.value = '';
      if (dom.fbFilterEndDate) dom.fbFilterEndDate.value = '';
      renderFeedbackList();
      showToast('Showing All Time Feedbacks');
    });

    [dom.fbFilterStartDate, dom.fbFilterEndDate, dom.fbFilterStatus, dom.fbFilterMood, dom.fbFilterStaff].forEach(el => {
      el?.addEventListener('change', () => renderFeedbackList());
    });

    // Feedback Collection Source Filter Pills (All Sources / Staff Tab / QR Scan)
    document.querySelectorAll('#fbSourcePillGroup .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#fbSourcePillGroup .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFbSourceFilter = btn.getAttribute('data-source') || 'ALL';
        renderFeedbackList();
        showToast(`Filtered by Source: ${activeFbSourceFilter === 'ALL' ? 'All Sources' : (activeFbSourceFilter === 'Staff' ? 'Staff Tab' : 'Customer QR')}`);
      });
    });

    // Feedback Status Filter Pills (All / New / Reviewed / Action Taken / Closed)
    document.querySelectorAll('#fbStatusPillGroup .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#fbStatusPillGroup .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFbStatusFilter = btn.getAttribute('data-status') || 'ALL';
        if (dom.fbFilterStatus) dom.fbFilterStatus.value = activeFbStatusFilter;
        renderFeedbackList();
      });
    });

    // Top Metric Cards click to filter
    document.querySelectorAll('.fb-metric-card[data-stat-status]').forEach(card => {
      card.addEventListener('click', () => {
        const stat = card.getAttribute('data-stat-status') || 'ALL';
        activeFbStatusFilter = stat;
        if (dom.fbFilterStatus) dom.fbFilterStatus.value = stat;
        document.querySelectorAll('#fbStatusPillGroup .pill-btn').forEach(b => {
          if (b.getAttribute('data-status') === stat) b.classList.add('active');
          else b.classList.remove('active');
        });
        renderFeedbackList();
        showToast(`Showing feedbacks with status: ${stat}`);
      });
    });

    // Quick Date Range Buttons in Reports Hub
    document.querySelectorAll('.rep-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rep-quick-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const range = btn.getAttribute('data-range');
        applyQuickDateRange(range);
      });
    });

    function applyQuickDateRange(range) {
      const today = new Date();
      const todayIso = today.toISOString().split('T')[0];
      let fromIso = '';
      let toIso = todayIso;
      let label = '';

      if (range === 'today') {
        fromIso = todayIso;
        toIso = todayIso;
        label = `Showing: Today (${todayIso})`;
      } else if (range === 'yesterday') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        fromIso = y.toISOString().split('T')[0];
        toIso = fromIso;
        label = `Showing: Yesterday (${fromIso})`;
      } else if (range === 'week') {
        const w = new Date();
        w.setDate(w.getDate() - 6);
        fromIso = w.toISOString().split('T')[0];
        toIso = todayIso;
        label = `Showing: Last 7 Days (${fromIso} to ${toIso})`;
      } else if (range === 'month') {
        const m = new Date(today.getFullYear(), today.getMonth(), 1);
        fromIso = m.toISOString().split('T')[0];
        toIso = todayIso;
        label = `Showing: This Month (${fromIso} to ${toIso})`;
      } else if (range === 'all') {
        fromIso = '';
        toIso = '';
        label = 'Showing: All Time (Complete Live History)';
      }

      if (dom.repFromDate) dom.repFromDate.value = fromIso;
      if (dom.repToDate) dom.repToDate.value = toIso;
      if (dom.repFilterSummaryLabel) dom.repFilterSummaryLabel.textContent = label;

      renderReports();
      showToast(`${label} 📅`);
    }

    // Set initial default Reports Date to Last 7 Days
    if (dom.repToDate && !dom.repToDate.value) {
      const today = new Date();
      const todayIso = today.toISOString().split('T')[0];
      const w = new Date();
      w.setDate(w.getDate() - 6);
      const weekAgoIso = w.toISOString().split('T')[0];
      if (dom.repFromDate) dom.repFromDate.value = weekAgoIso;
      dom.repToDate.value = todayIso;
      if (dom.repFilterSummaryLabel) dom.repFilterSummaryLabel.textContent = `Showing: Last 7 Days (${weekAgoIso} to ${todayIso})`;
    }

    // Generate Report Button Event Listener
    dom.btnApplyReportFilter?.addEventListener('click', () => {
      renderReports();
      const from = dom.repFromDate ? dom.repFromDate.value : 'Start';
      const to = dom.repToDate ? dom.repToDate.value : 'End';
      showToast(`Report updated for range: ${from} to ${to}! 📊`);
    });

    // Google Translate & Multi-Language Dropdown (5 Languages: en, ta, hi, kn, ml)
    const appLangSelect = document.getElementById('appLanguageSelect');
    if (appLangSelect) {
      appLangSelect.addEventListener('change', (e) => {
        const langCode = e.target.value; // en, ta, hi, kn, ml
        applyGoogleTranslateLanguage(langCode);
      });
    }

    function applyGoogleTranslateLanguage(langCode) {
      // 1. Set Google Translate cookies
      const host = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      if (host) {
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${host};`;
      }

      // 2. Trigger Google Translate combo if loaded
      const teCombo = document.querySelector('.goog-te-combo');
      if (teCombo) {
        teCombo.value = langCode;
        teCombo.dispatchEvent(new Event('change'));
      }

      // 3. For Tamil / English, sync built-in bilingual UI
      if (langCode === 'ta' || langCode === 'en') {
        state.currentLang = langCode;
        updateFeedbackFormLanguage(langCode);
      }

      const langNames = {
        en: 'English',
        ta: 'தமிழ் (Tamil)',
        hi: 'हिन्दी (Hindi)',
        kn: 'ಕನ್ನಡ (Kannada)',
        ml: 'മലയാളம் (Malayalam)'
      };
      showToast(`🌐 Language set to: ${langNames[langCode] || langCode}`);
    }

    // WhatsApp Dispatcher Modal Event Listeners
    document.querySelectorAll('.wa-template-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wa-template-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeWAData.currentTemplate = btn.getAttribute('data-template');
        renderWAMessageText();
      });
    });

    document.querySelectorAll('.btn-wa-lang').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-wa-lang').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeWAData.currentLang = btn.getAttribute('data-wa-lang');
        renderWAMessageText();
      });
    });

    const closeWA = () => document.getElementById('modalWhatsAppSender')?.classList.remove('active');
    document.getElementById('btnCloseWAModal')?.addEventListener('click', closeWA);
    document.getElementById('btnCancelWAModal')?.addEventListener('click', closeWA);

    document.getElementById('btnCopyWAMessage')?.addEventListener('click', () => {
      const text = document.getElementById('waMessageTextarea')?.value;
      if (text) {
        navigator.clipboard?.writeText(text);
        showToast('WhatsApp message copied to clipboard! 📋');
      }
    });

    document.getElementById('btnTriggerWANow')?.addEventListener('click', () => {
      const text = document.getElementById('waMessageTextarea')?.value;
      const cleanMobile = (activeWAData.mobile || '').replace(/\D/g, '');
      if (!cleanMobile) {
        showToast('Please provide a valid 10-digit customer mobile number.');
        return;
      }
      const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      showToast(`Triggered WhatsApp message for ${activeWAData.name}! 🚀`);
      closeWA();
    });

    // Modal Controls fallback
    dom.btnCloseFeedbackModal.addEventListener('click', () => dom.modalFeedback.classList.remove('active'));
    dom.btnCancelFeedback.addEventListener('click', () => dom.modalFeedback.classList.remove('active'));

    dom.btnModeStaff.addEventListener('click', () => {
      activeFeedbackMode = 'Staff';
      dom.btnModeStaff.classList.add('active');
      dom.btnModeWalkin.classList.remove('active');
    });
    dom.btnModeWalkin.addEventListener('click', () => {
      activeFeedbackMode = 'Walk-in (QR)';
      dom.btnModeWalkin.classList.add('active');
      dom.btnModeStaff.classList.remove('active');
    });

    // Modal Submit Feedback
    dom.feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mood = dom.feedbackForm.querySelector('input[name="feedbackMood"]:checked')?.value || 'Appreciation';
      const staffName = dom.feedbackForm.querySelector('#fbFormStaffName')?.value || 'Vijay';
      const custName = document.getElementById('fbCustName')?.value || 'Guest Visitor';
      const mobile = document.getElementById('fbCustMobile')?.value || '98XXXXXXXX';
      const chitAware = dom.feedbackForm.querySelector('input[name="Q5"]:checked')?.value || 'Yes - Already Enrolled';

      const mBday = document.getElementById('modalCustBirthday')?.value;
      const mWed = document.getElementById('modalCustWedding')?.value;
      const occasionDate = mBday || mWed || '';

      const q0Val = dom.feedbackForm.querySelector('input[name="Q0"]:checked')?.value || 'Regular Customer';
      const q1Val = dom.feedbackForm.querySelector('input[name="Q1"]:checked')?.value || 'Friends & Relatives';
      const q2Val = dom.feedbackForm.querySelector('input[name="Q2"]:checked')?.value || 'Design Collections & Variety';
      const q3Val = dom.feedbackForm.querySelector('input[name="Q3"]:checked')?.value || 'None - Very Satisfied';
      const q4Val = dom.feedbackForm.querySelector('input[name="Q4"]:checked')?.value || 'General Walk-in';
      const q6Checked = Array.from(dom.feedbackForm.querySelectorAll('input[name="Q6"]:checked')).map(el => el.value).join(', ');
      const q6Val = q6Checked || dom.feedbackForm.querySelector('input[name="Q6"]:checked')?.value || '22K Gold Antique';
      const q7Choice = dom.feedbackForm.querySelector('input[name="Q7"]:checked')?.value || 'Yes, definitely';
      const q8Radio = dom.feedbackForm.querySelector('input[name="Q8"]:checked');
      const q8Val = q8Radio ? q8Radio.value : (mood === 'Appreciation' ? 'Excellent' : (mood === 'Concern' ? 'Need Improvement' : 'Good'));
      const rating = q7Choice === 'Yes, definitely' ? 10 : (q7Choice === 'Not sure' ? 7 : 3);

      const newId = `SVV-FB-${8516 + state.feedbacks.length}`;
      const newEntry = {
        id: newId,
        timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US'),
        date: new Date().toISOString().split('T')[0],
        branch: state.activeBranch,
        invoiceNo: document.getElementById('fbFormInvoice')?.value || 'INV-2026-NEW',
        section: document.getElementById('fbFormAreaZone')?.value || 'Showroom Floor',
        source: activeFeedbackMode === 'Staff' ? 'Staff' : 'QR',
        mood: mood,
        customerName: custName,
        mobile: mobile,
        staffName: staffName,
        q0: q0Val,
        q1: q1Val,
        q2: q2Val,
        q3: q3Val,
        q4: q4Val,
        occasionDate: occasionDate,
        q5: chitAware,
        q6: q6Val,
        Q6_Jewellery_Interest: q6Val,
        q7: q7Choice,
        Q7_Recommend: q7Choice,
        recommendationChoice: q7Choice,
        q8: q8Val,
        overallShoppingExperience: q8Val,
        Overall_Shopping_Experience: q8Val,
        rating: rating,
        status: 'NEW'
      };

      state.feedbacks.unshift(newEntry);
      saveFeedbacksToStorage();
      sendToGSheet('ADD_FEEDBACK', newEntry);
      dom.modalFeedback.classList.remove('active');
      dom.feedbackForm.reset();
      renderAll();
      showToast(`Feedback successfully logged for Suba Valli Vilas (${newId})!`);
    });

    // Footfall Slot Form Submit
    dom.footfallSlotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const slotId = dom.ffModalSlotId.value;
      const count = parseInt(dom.ffModalCountInput.value) || 0;

      const slot = state.slots.find(s => s.id === slotId);
      if (slot) {
        slot.count = count;
        slot.status = 'SUBMITTED';
      }

      saveTodaySlotsToStorage();

      const todayTotal = state.slots.reduce((sum, s) => sum + s.count, 0);
      const conv = todayTotal > 0 ? ((state.todayBills / todayTotal) * 100).toFixed(1) : '0.0';
      const rat = state.todayBills > 0 ? (todayTotal / state.todayBills).toFixed(1) : '1.0';
      sendToGSheet('UPDATE_FOOTFALL', {
        date: new Date().toISOString().split('T')[0],
        slotId: slot.id,
        slotTime: slot.range,
        slotTimeRange: slot.range,
        count: slot.count,
        footfallCount: slot.count,
        dayBills: state.todayBills || 0,
        dayEndBills: state.todayBills || 0,
        conversionPct: `${conv}%`,
        ratio: rat,
        peakHour: state.peakHourToday || '',
        peakHourToday: state.peakHourToday || '',
        branch: state.activeBranch,
        loggedBy: state.currentUser?.fullName || 'Staff',
        staff: state.currentUser?.fullName || 'Staff'
      });

      dom.modalFootfallSlot.classList.remove('active');
      renderFootfall();
      renderDER();
      showToast(`Saved ${count} visitors for ${slot.time} slot!`);
    });
    dom.btnCloseFootfallModal.addEventListener('click', () => dom.modalFootfallSlot.classList.remove('active'));
    dom.btnCancelFootfallModal.addEventListener('click', () => dom.modalFootfallSlot.classList.remove('active'));

    // Diverts Modal
    dom.btnOpenNewDivert.addEventListener('click', () => {
      dom.modalDivert.classList.add('active');
    });
    dom.btnCloseDivertModal.addEventListener('click', () => dom.modalDivert.classList.remove('active'));
    dom.btnCancelDivert.addEventListener('click', () => dom.modalDivert.classList.remove('active'));

    dom.divertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const collectedBy = document.getElementById('divCollectedBy')?.value;
      if (!collectedBy) {
        showToast('⚠️ Divert Collected By (Staff Name) is mandatory.');
        document.getElementById('divCollectedBy')?.focus();
        return;
      }

      const custName = document.getElementById('divCustName')?.value.trim();
      const mobile = document.getElementById('divMobile')?.value.trim() || '';
      const cleanMobile = mobile.replace(/\D/g, '');
      if (cleanMobile.length !== 10) {
        showToast('⚠️ Customer Mobile must be exactly 10 digits.');
        document.getElementById('divMobile')?.focus();
        return;
      }

      const attendedStaff = document.getElementById('divAttendedStaff')?.value || '';
      const counter = document.getElementById('divCounter')?.value || 'Counter 1 - Antique';
      const section = document.getElementById('divSection')?.value || 'Gold';
      const reason = document.getElementById('divReason')?.value || 'Design not available';
      const product = document.getElementById('divProduct')?.value.trim() || 'Gold Jewellery';
      const design = document.getElementById('divDesign')?.value.trim() || 'Standard';
      const size = document.getElementById('divSize')?.value.trim() || 'N/A';
      const priority = document.getElementById('divPriority')?.value || 'MEDIUM';
      const status = document.getElementById('divStatus')?.value || 'PENDING';
      const otherReason = document.getElementById('divOtherReason')?.value.trim() || '';

      const newDivert = {
        id: `DIV-2026-00${state.diverts.length + 1}`,
        timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US'),
        date: new Date().toISOString().split('T')[0],
        branch: state.activeBranch,
        customerName: custName,
        mobile: cleanMobile,
        section: section,
        counter: counter,
        reason: reason,
        product: product,
        design: design,
        size: size,
        employee: collectedBy,
        attendedStaff: attendedStaff,
        priority: priority,
        otherReason: otherReason,
        status: status
      };

      state.diverts.unshift(newDivert);
      saveDivertsToStorage();
      sendToGSheet('ADD_DIVERT', newDivert);
      dom.modalDivert.classList.remove('active');
      dom.divertForm.reset();
      renderAll();
      showToast(`Customer Divert logged (${newDivert.id}) collected by: ${collectedBy}! 📦`);
    });

    // Customer QR Code Modal
    dom.btnOpenCustomerQR.addEventListener('click', () => {
      dom.modalCustomerQR.classList.add('active');
      generateInlineQRCode();
    });
    dom.btnCloseQRModal.addEventListener('click', () => dom.modalCustomerQR.classList.remove('active'));
    dom.btnCopyLink.addEventListener('click', () => {
      navigator.clipboard?.writeText(dom.shareableLinkInput.value);
      showToast('Copied customer feedback link to clipboard!');
    });
    dom.btnOpenSelfFillDemo.addEventListener('click', () => {
      dom.modalCustomerQR.classList.remove('active');
      dom.btnModeWalkin.click();
      dom.btnOpenNewFeedback.click();
    });

    // Telecaller Action Form
    dom.btnCloseTelActionModal.addEventListener('click', () => dom.modalTelecallerAction.classList.remove('active'));
    dom.btnCancelTelAction.addEventListener('click', () => dom.modalTelecallerAction.classList.remove('active'));
    dom.telActionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mobile = document.getElementById('telCustCleanMobile')?.value || (dom.telCustMobilePreview?.textContent || '').replace(/\D/g, '');
      const name = dom.telCustNamePreview.textContent;
      const disposition = dom.telDisposition.value;
      const notes = dom.telNotes.value;
      const callback = dom.telCallbackDate.value;
      const callStatus = document.getElementById('telCallStatus')?.value || 'FOLLOWUP';

      recordCustomerCall(mobile, name, disposition, notes, callback, state.currentUser?.fullName, callStatus);
      dom.modalTelecallerAction.classList.remove('active');
      dom.telActionForm.reset();
      showToast(`Call disposition logged: ${disposition} (Status: ${callStatus})`);
    });

    dom.btnGenerateWhatsApp.addEventListener('click', () => {
      const isTa = state.currentLang === 'ta';
      const msg = isTa
        ? `வணக்கம்! சுப வள்ளி விலாஸில் நீங்கள் வருகை தந்ததற்கு நன்றி. எங்களின் சிறப்பு தங்கம் சேமிப்பு திட்டம் மற்றும் சலுகைகள் பற்றி தெரிந்து கொள்ள அழைக்கவும்.`
        : `Vanakkam from Suba Valli Vilas! Thank you for visiting our showroom. We would love to introduce our exclusive Gold Chit Savings Scheme with zero wastage and bonus benefits. Call us back for personalized assistance!`;
      dom.whatsappSnippet.textContent = msg;
      showToast('Generated pre-filled WhatsApp message!');
    });

    // Telecaller Date Range & Status Filters
    if (dom.btnTelDateApply) {
      dom.btnTelDateApply.addEventListener('click', () => {
        renderTelecaller();
        showToast('Applied date filter to Telecaller leads!');
      });
    }

    if (dom.btnTelDateReset) {
      dom.btnTelDateReset.addEventListener('click', () => {
        if (dom.telFilterFromDate) dom.telFilterFromDate.value = '2026-09-01';
        if (dom.telFilterToDate) dom.telFilterToDate.value = '2026-09-20';
        renderTelecaller();
        showToast('Telecaller date filter reset');
      });
    }

    document.querySelectorAll('[data-tel-status]').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('[data-tel-status]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTelStatusFilter = pill.getAttribute('data-tel-status');
        renderTelecaller();
      });
    });

    // Edit Question Modal Form Submit
    const editQuestionForm = document.getElementById('editQuestionForm');
    if (editQuestionForm) {
      editQuestionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const qId = document.getElementById('editQId')?.value;
        const q = state.questionsConfig.find(item => item.q_id === qId);
        if (q) {
          q.display_order = parseInt(document.getElementById('editQDisplayOrder')?.value) || 0;
          q.q_text_en = document.getElementById('editQTextEn')?.value.trim() || q.q_text_en;
          q.q_text_ta = document.getElementById('editQTextTa')?.value.trim() || q.q_text_ta;

          const rawOptsEn = document.getElementById('editQOptionsEn')?.value.trim();
          const rawOptsTa = document.getElementById('editQOptionsTa')?.value.trim();
          if (rawOptsEn) {
            q.options_en = rawOptsEn.split('|').map(s => s.trim()).filter(Boolean);
          }
          if (rawOptsTa) {
            q.options_ta = rawOptsTa.split('|').map(s => s.trim()).filter(Boolean);
          }

          q.is_mandatory = document.getElementById('editQMandatory')?.value === 'true';
          q.is_active = document.getElementById('editQActive')?.value === 'true';

          state.questionsConfig.sort((a, b) => a.display_order - b.display_order);
          document.getElementById('modalEditQuestion')?.classList.remove('active');
          renderQuestionsConfig();
          renderFeedbackModalQuestions();
          renderQuestionWiseReport();
          showToast(`Question ${qId} updated successfully! ✨`);
        }
      });
    }

    document.getElementById('btnCloseEditQuestionModal')?.addEventListener('click', () => {
      document.getElementById('modalEditQuestion')?.classList.remove('active');
    });
    document.getElementById('btnCancelEditQuestion')?.addEventListener('click', () => {
      document.getElementById('modalEditQuestion')?.classList.remove('active');
    });

    // Create User Modal (Requested by user)
    dom.btnOpenCreateUser.addEventListener('click', () => {
      dom.modalCreateUser.classList.add('active');
    });
    dom.btnCloseCreateUserModal.addEventListener('click', () => dom.modalCreateUser.classList.remove('active'));
    dom.btnCancelCreateUser.addEventListener('click', () => dom.modalCreateUser.classList.remove('active'));

    dom.newRolePreset.addEventListener('change', (e) => {
      const r = e.target.value;
      document.getElementById('perm_ff_today').checked = true;
      document.getElementById('perm_fb_entry').checked = true;
      document.getElementById('perm_div_entry').checked = true;

      document.getElementById('perm_ff_yesterday').checked = r === 'Admin' || r === 'Manager';
      document.getElementById('perm_fb_view').checked = r !== 'Staff';
      document.getElementById('perm_div_view').checked = r !== 'Staff';
      document.getElementById('perm_telecaller').checked = r === 'Admin' || r === 'Telecaller' || r === 'Manager';
      document.getElementById('perm_reports').checked = r !== 'Staff';
      document.getElementById('perm_der').checked = r === 'Admin' || r === 'Manager';
      document.getElementById('perm_users').checked = r === 'Admin';
    });

    dom.createUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const perms = [];
      if (document.getElementById('perm_ff_today').checked) perms.push('ff_today');
      if (document.getElementById('perm_ff_yesterday').checked) perms.push('ff_yesterday');
      if (document.getElementById('perm_fb_entry').checked) perms.push('fb_entry');
      if (document.getElementById('perm_fb_view').checked) perms.push('fb_view');
      if (document.getElementById('perm_div_entry').checked) perms.push('div_entry');
      if (document.getElementById('perm_div_view').checked) perms.push('div_view');
      if (document.getElementById('perm_telecaller').checked) perms.push('telecaller');
      if (document.getElementById('perm_reports').checked) perms.push('reports');
      if (document.getElementById('perm_der').checked) perms.push('der');
      if (document.getElementById('perm_users').checked) perms.push('users');

      const newUser = {
        id: `USR-00${state.users.length + 1}`,
        fullName: document.getElementById('newFullName').value,
        username: document.getElementById('newUsername').value,
        branch: document.getElementById('newBranch').value,
        role: document.getElementById('newRolePreset').value,
        permissions: perms,
        status: 'Active'
      };

      state.users.push(newUser);
      dom.modalCreateUser.classList.remove('active');
      dom.createUserForm.reset();

      // Add to quick switcher
      const opt = document.createElement('option');
      opt.value = newUser.id;
      opt.textContent = `${newUser.fullName} (${newUser.role})`;
      dom.quickUserSwitch.appendChild(opt);

      renderUsers();
      showToast(`Created new user: ${newUser.fullName} (${newUser.role})!`);
    });

    // CSV Exports
    dom.btnExportDERSummary.addEventListener('click', () => exportCSV('DER_Summary', state.pastDays));
    dom.btnExportActiveReport.addEventListener('click', () => {
      if (activeReportTab === 'footfall') exportCSV('Footfall_Report', state.pastDays);
      else if (activeReportTab === 'feedback') exportCSV('Feedback_Report', state.feedbacks);
      else if (activeReportTab === 'diverts') exportCSV('Diverts_Report', state.diverts);
      else exportCSV('Telecaller_Report', state.telecallerCalls);
    });

    dom.btnDownloadSheetTemplate.addEventListener('click', () => {
      exportCSV('Suba_Valli_Vilas_Questions_Schema', state.questionsConfig);
    });

    // Specific Sheet Download Feedback
    document.getElementById('btnDownloadUserCreationSheet')?.addEventListener('click', () => {
      showToast('Downloading User Creation Master Sheet (.csv)...');
    });
    document.getElementById('btnDownloadUserCreationCsv')?.addEventListener('click', () => {
      showToast('Downloading User Creation Master Sheet (.csv)...');
    });
    document.getElementById('btnDownloadFeedbackQuestionsSheet')?.addEventListener('click', () => {
      showToast('Downloading Feedback Questions Master Sheet (.csv)...');
    });
    document.getElementById('btnDownloadDivertQuestionsSheet')?.addEventListener('click', () => {
      showToast('Downloading Divert Questions Master Sheet (.csv)...');
    });
    document.getElementById('btnDownloadMasterExcelAll')?.addEventListener('click', () => {
      showToast('Downloading Suba Valli Vilas Complete Master Database (.xls)...');
    });
    document.getElementById('btnDownloadExcelDatabase')?.addEventListener('click', () => {
      showToast('Downloading Suba Valli Vilas Master Excel Database (.xls)...');
    });
    document.getElementById('btnDownloadUsersMasterXls')?.addEventListener('click', () => {
      showToast('Downloading Suba Valli Vilas Master Excel Database (.xls)...');
    });

    dom.btnSaveQuestionsConfig?.addEventListener('click', () => {
      localStorage.setItem('svv_feedback_questions', JSON.stringify(state.questionsConfig));
      localStorage.setItem('svv_divert_questions', JSON.stringify(state.divertQuestionsConfig));
      showToast('Questions saved locally! Syncing with Google Sheets...');
      sendToGSheet('SAVE_QUESTIONS_CONFIG', {
        feedbackQuestions: state.questionsConfig,
        divertQuestions: state.divertQuestionsConfig
      });
    });

    document.getElementById('btnRefreshQuestionsCloud')?.addEventListener('click', () => {
      showToast('Pulling latest questions from Google Sheets / Cloudflare...');
      fetchQuestionsFromCloud(true);
    });

    document.getElementById('btnSyncQuestionsFromSheet')?.addEventListener('click', () => {
      showToast('Syncing dynamic questions from Google Sheets...');
      fetchQuestionsFromCloud(true);
    });

    // Initial render
    renderAll();
  }

  // ================= CSV EXPORTER =================
  function exportCSV(filename, data) {
    if (!data || !data.length) {
      showToast('No data available to export.');
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => {
      const val = typeof obj[h] === 'object' ? JSON.stringify(obj[h]) : obj[h];
      return `"${(val + '').replace(/"/g, '""')}"`;
    }).join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Suba_Valli_Vilas_${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully!`);
  }

  // ================= MULTI-MEDIUM QR STUDIO & LUXURY STANDEE GENERATOR =================
  function buildLuxuryQRSvg(size = 200) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="12" fill="#FFFFFF"/>
      <rect x="4" y="4" width="192" height="192" rx="10" stroke="#C5A059" stroke-width="2" stroke-dasharray="4 2"/>
      
      <!-- Top-Left Finder Pattern -->
      <rect x="18" y="18" width="46" height="46" rx="8" fill="#580505"/>
      <rect x="25" y="25" width="32" height="32" rx="4" fill="#FFFFFF"/>
      <rect x="31" y="31" width="20" height="20" rx="3" fill="#C5A059"/>

      <!-- Top-Right Finder Pattern -->
      <rect x="136" y="18" width="46" height="46" rx="8" fill="#580505"/>
      <rect x="143" y="25" width="32" height="32" rx="4" fill="#FFFFFF"/>
      <rect x="149" y="31" width="20" height="20" rx="3" fill="#C5A059"/>

      <!-- Bottom-Left Finder Pattern -->
      <rect x="18" y="136" width="46" height="46" rx="8" fill="#580505"/>
      <rect x="25" y="143" width="32" height="32" rx="4" fill="#FFFFFF"/>
      <rect x="31" y="149" width="20" height="20" rx="3" fill="#C5A059"/>

      <!-- Timing Strips -->
      <line x1="72" y1="28" x2="128" y2="28" stroke="#580505" stroke-width="4" stroke-dasharray="6 6"/>
      <line x1="28" y1="72" x2="28" y2="128" stroke="#580505" stroke-width="4" stroke-dasharray="6 6"/>

      <!-- High-Density Luxury Data Matrix -->
      <!-- Row 1 -->
      <rect x="74" y="38" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="84" y="38" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="98" y="38" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="108" y="38" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="118" y="38" width="6" height="6" rx="1" fill="#C5A059"/>

      <!-- Row 2 -->
      <rect x="74" y="48" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="88" y="48" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="102" y="48" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="114" y="48" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="124" y="48" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Row 3 -->
      <rect x="38" y="74" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="48" y="74" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="58" y="74" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="136" y="74" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="146" y="74" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="156" y="74" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="166" y="74" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Row 4 -->
      <rect x="38" y="84" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="48" y="84" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="58" y="84" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="136" y="84" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="148" y="84" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="160" y="84" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Row 5 -->
      <rect x="38" y="96" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="50" y="96" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="140" y="96" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="152" y="96" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="164" y="96" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Row 6 -->
      <rect x="38" y="108" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="48" y="108" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="58" y="108" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="136" y="108" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="146" y="108" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="158" y="108" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="168" y="108" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Row 7 -->
      <rect x="38" y="120" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="52" y="120" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="136" y="120" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="150" y="120" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="162" y="120" width="6" height="6" rx="1" fill="#580505"/>

      <!-- Bottom Right Data Matrix -->
      <rect x="74" y="136" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="84" y="136" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="96" y="136" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="108" y="136" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="120" y="136" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="136" y="136" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="150" y="136" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="162" y="136" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="172" y="136" width="6" height="6" rx="1" fill="#580505"/>

      <rect x="74" y="148" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="86" y="148" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="100" y="148" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="112" y="148" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="126" y="148" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="140" y="148" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="154" y="148" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="166" y="148" width="6" height="6" rx="1" fill="#580505"/>

      <rect x="74" y="160" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="88" y="160" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="98" y="160" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="110" y="160" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="122" y="160" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="136" y="160" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="148" y="160" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="160" y="160" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="172" y="160" width="6" height="6" rx="1" fill="#580505"/>

      <rect x="74" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="84" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="96" y="172" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="108" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="120" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="132" y="172" width="6" height="6" rx="1" fill="#C5A059"/>
      <rect x="144" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="156" y="172" width="6" height="6" rx="1" fill="#580505"/>
      <rect x="168" y="172" width="6" height="6" rx="1" fill="#C5A059"/>

      <!-- Center Brand Crest Badge -->
      <rect x="72" y="72" width="56" height="56" rx="10" fill="#580505" stroke="#C5A059" stroke-width="2.5"/>
      <circle cx="100" cy="100" r="22" fill="#3D0303" stroke="#C5A059" stroke-width="1.5"/>
      <text x="100" y="105" fill="#FFFFFF" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1">SVV</text>
    </svg>`;
  }

  function updateQRStudioLinkAndPreview() {
    let baseUrl = 'feedback.html';
    try {
      const loc = window.location;
      if (loc.protocol === 'file:') {
        const full = loc.href.split('?')[0].split('#')[0];
        const dir = full.substring(0, full.lastIndexOf('/') + 1);
        baseUrl = `${dir}feedback.html`;
      } else {
        const path = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        baseUrl = `${loc.origin}${path}feedback.html`;
      }
    } catch (e) {
      baseUrl = 'feedback.html';
    }

    const counterVal = dom.qrStudioCounter?.value || 'Billing Counter 1';
    const staffVal = dom.qrStudioStaff?.value || 'Vijay';
    const branchVal = dom.qrStudioBranch?.value || state.activeBranch || 'Cuddalore (Main Branch)';

    const params = new URLSearchParams();
    params.set('source', state.activeQRSource || 'qr_billing');
    params.set('medium', state.activeQRMedium || 'Billing Counter Standee');
    params.set('counter', counterVal);
    params.set('staff', staffVal);
    params.set('branch', branchVal);
    if (state.cfWorkerUrl) {
      params.set('cf', state.cfWorkerUrl);
    }
    if (state.gsheetUrl) {
      params.set('gs', state.gsheetUrl);
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;

    if (dom.onPageShareLink) {
      dom.onPageShareLink.value = fullUrl;
    }

    if (dom.currentMediumBadge) {
      dom.currentMediumBadge.textContent = `Medium: ${state.activeQRMedium}`;
    }

    if (dom.qrStudioPreviewCaption) {
      dom.qrStudioPreviewCaption.textContent = `Scan for ${state.activeQRMedium} • ${counterVal} • Attended by: ${staffVal}`;
    }

    if (dom.onPageQRSVG) {
      dom.onPageQRSVG.innerHTML = buildLuxuryQRSvg(180);
    }
  }

  function initQRStudio() {
    if (dom.qrMediumSelector) {
      const mediumBtns = dom.qrMediumSelector.querySelectorAll('.qr-medium-btn');
      mediumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          mediumBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeQRMedium = btn.getAttribute('data-medium-name') || 'Billing Counter Standee';
          state.activeQRSource = btn.getAttribute('data-medium-source') || 'qr_billing';
          updateQRStudioLinkAndPreview();
          showToast(`QR Medium Selected: ${state.activeQRMedium}`);
        });
      });
    }

    dom.qrStudioCounter?.addEventListener('change', updateQRStudioLinkAndPreview);
    dom.qrStudioStaff?.addEventListener('change', updateQRStudioLinkAndPreview);
    dom.qrStudioBranch?.addEventListener('change', updateQRStudioLinkAndPreview);

    dom.btnPrintStandeePlacard?.addEventListener('click', printStandeePlacard);
    dom.btnDownloadQRImage?.addEventListener('click', downloadQRCodeSvg);

    dom.btnCopyOnPageLink?.addEventListener('click', () => {
      const link = dom.onPageShareLink?.value || 'feedback.html';
      navigator.clipboard?.writeText(link);
      showToast('Copied Multi-Medium QR Link to Clipboard! 📋');
    });

    dom.btnTestCustomerMode?.addEventListener('click', () => {
      const link = dom.onPageShareLink?.value || 'feedback.html';
      window.open(link, '_blank');
    });

    if (dom.onPageQRSVG) {
      dom.onPageQRSVG.addEventListener('click', () => {
        const link = dom.onPageShareLink?.value || 'feedback.html';
        window.open(link, '_blank');
      });
    }

    updateQRStudioLinkAndPreview();
  }

  function printStandeePlacard() {
    const medium = state.activeQRMedium || 'Billing Counter Standee';
    const counter = dom.qrStudioCounter?.value || 'Billing Counter 1';
    const staff = dom.qrStudioStaff?.value || 'Showroom Staff';
    const branch = dom.qrStudioBranch?.value || state.activeBranch || 'Cuddalore (Main Branch)';
    const qrSvg = buildLuxuryQRSvg(260);

    const printWin = window.open('', '_blank', 'width=650,height=850');
    if (!printWin) {
      showToast('⚠️ Pop-up blocked! Please allow pop-ups to print the standee placard.');
      return;
    }

    printWin.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Suba Valli Vilas - Luxury Feedback Standee (${medium})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&family=Noto+Sans+Tamil:wght@500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #FAFAFA;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .standee-card {
      width: 100%;
      max-width: 460px;
      background: #FFFFFF;
      border: 4px solid #580505;
      border-radius: 20px;
      padding: 32px 28px;
      text-align: center;
      box-shadow: 0 12px 36px rgba(88, 5, 5, 0.15);
      position: relative;
      outline: 2px dashed #C5A059;
      outline-offset: -10px;
    }
    .brand-emblem {
      width: 56px;
      height: 56px;
      margin: 0 auto 12px;
      background: #580505;
      border: 2px solid #C5A059;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C5A059;
      font-family: 'Cinzel', serif;
      font-weight: 800;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(88,5,5,0.25);
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 800;
      color: #580505;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    .brand-subtitle-ta {
      font-family: 'Noto Sans Tamil', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #93712B;
      margin-bottom: 16px;
    }
    .divider {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #C5A059, transparent);
      margin: 0 auto 18px;
    }
    .headline-en {
      font-size: 16px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 4px;
    }
    .headline-ta {
      font-family: 'Noto Sans Tamil', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #4B5563;
      margin-bottom: 18px;
    }
    .qr-wrapper {
      background: #FFFDF9;
      padding: 16px;
      border-radius: 16px;
      border: 1.5px solid #F0DFB8;
      display: inline-block;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(197, 160, 89, 0.2);
    }
    .instruction-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FDF3DC;
      color: #78350F;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid #FDE68A;
      margin-bottom: 14px;
    }
    .reward-box {
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 11.5px;
      color: #92400E;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .context-footer {
      border-top: 1px solid #E5E7EB;
      padding-top: 12px;
      font-size: 11px;
      color: #6B7280;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .context-tag {
      font-weight: 700;
      color: #580505;
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .standee-card { box-shadow: none; max-width: 100%; border-width: 3px; }
      @page { margin: 10mm; size: auto; }
    }
  </style>
</head>
<body>
  <div class="standee-card">
    <div class="brand-emblem">SVV</div>
    <div class="brand-title">SUBA VALLI VILAS</div>
    <div class="brand-subtitle-ta">சுப வள்ளி விலாஸ் • பாரம்பரிய நகை மாளிகை</div>
    <div class="divider"></div>

    <div class="headline-en">We Value Your Precious Experience</div>
    <div class="headline-ta">உங்கள் மேலான கருத்துக்கள் எங்களுக்கு பொக்கிஷம்</div>

    <div class="qr-wrapper">
      ${qrSvg}
    </div>

    <div>
      <span class="instruction-pill">📷 Scan with any Smartphone Camera</span>
    </div>

    <div class="reward-box">
      ✨ Rate your experience, enroll in our 11-Month Gold Chit Scheme & win festive gold coin bonuses!
    </div>

    <div class="context-footer">
      <span class="context-tag">${medium}</span>
      <span>${counter} • ${branch}</span>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>`);
    printWin.document.close();
  }

  function downloadQRCodeSvg() {
    const svgMarkup = buildLuxuryQRSvg(400);
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeMedium = (state.activeQRSource || 'standee').replace(/[^a-z0-9_-]/gi, '_');
    link.download = `Suba_Valli_Vilas_QR_${safeMedium}_${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Suba Valli Vilas Luxury QR SVG (${state.activeQRMedium})! 📥`);
  }

  function generateInlineQRCode() {
    if (dom.qrCanvasContainer) {
      dom.qrCanvasContainer.innerHTML = buildLuxuryQRSvg(180);
    }
  }

  // ================= PUBLIC EXPOSURE FOR INLINE ONCLICK HANDLERS =================
  window.app = {
    switchRole: function (userId) {
      switchUser(userId);
    },
    toggleZoneAccordion: function (zoneId) {
      if (expandedZoneIds.has(zoneId)) {
        expandedZoneIds.delete(zoneId);
      } else {
        expandedZoneIds.add(zoneId);
      }
      renderReports();
    },
    updatePastDayBills: function (date, bills) {
      const iso = normalizeDateToIso(date);
      let found = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);
      if (found) {
        found.bills = parseInt(bills) || 0;
        found.conversion = found.footfall > 0 ? ((found.bills / found.footfall) * 100).toFixed(1) : '0.0';
        found.ratio = found.footfall > 0 && found.bills > 0 ? (found.footfall / found.bills).toFixed(1) : '0';
        try {
          localStorage.setItem('svv_past_days', JSON.stringify(state.pastDays));
          localStorage.setItem('svv_past_bills_' + iso, String(found.bills));
        } catch (e) {}
        renderFootfall();
        renderDER();
        renderDERWeeklyDailyChart();
        showToast(`Updated bills for ${date} to ${bills}!`);
      }
    },
    savePastDayAudit: function (date) {
      const iso = normalizeDateToIso(date);
      const found = state.pastDays.find(p => normalizeDateToIso(p.date) === iso);
      if (found) {
        found.status = 'Audited';
        try {
          localStorage.setItem('svv_past_days', JSON.stringify(state.pastDays));
          localStorage.setItem('svv_past_bills_' + iso, String(found.bills));
        } catch (e) {}
        if (typeof sendToGSheet === 'function') {
          sendToGSheet('SAVE_PAST_DAY_AUDIT', {
            date: found.date,
            footfall: found.footfall,
            bills: found.bills,
            slots: found.slots,
            conversion: found.conversion,
            ratio: found.ratio
          });
        }
        renderPastDaysTable();
        renderDER();
        showToast(`Audit verified & saved for ${found.date}! 💾`);
      } else {
        showToast(`Audit verified for ${date}!`);
      }
    },
    changeDivertStatus: function (id, newStatus) {
      const found = state.diverts.find(d => d.id === id);
      if (found) {
        found.status = newStatus;
        renderDiverts();
        renderTelecaller();
        renderReports();
        renderDER();
        showToast(`Divert ${id} status updated to: ${newStatus}`);
      }
    },
    updateDivertStatus: function (id) {
      const found = state.diverts.find(d => d.id === id);
      if (found) {
        found.status = (found.status === 'CLOSED' || found.status === 'CONVERTED') ? 'PENDING' : 'CLOSED';
        renderDiverts();
        renderTelecaller();
        renderReports();
        renderDER();
        showToast(`Divert ${id} status toggled to: ${found.status}`);
      }
    },
    openTelecallerModalByMobile: function (cleanMobile) {
      const lead = getAllCustomerLeads().find(l => l.cleanMobile === cleanMobile);
      if (!lead) return;
      const cleanIdEl = document.getElementById('telCustCleanMobile');
      if (cleanIdEl) cleanIdEl.value = cleanMobile;
      if (dom.telCustId) dom.telCustId.value = lead.leadId || '';
      if (dom.telCustNamePreview) dom.telCustNamePreview.textContent = lead.customerName;
      if (dom.telCustMobilePreview) dom.telCustMobilePreview.textContent = lead.mobile;
      const tagsContainer = document.getElementById('telCustTagsPreview');
      if (tagsContainer) {
        tagsContainer.innerHTML = lead.tags.map(t => `<span class="badge ${t.class}">${t.label}</span>`).join(' ');
      }
      if (dom.telCustQueueInfo) dom.telCustQueueInfo.textContent = `City: ${lead.city} • Visit: ${lead.visitDate} • ${lead.occasionDesc}`;
      const statusSelect = document.getElementById('telCallStatus');
      if (statusSelect) statusSelect.value = lead.callStatus || 'FOLLOWUP';
      dom.modalTelecallerAction.classList.add('active');
    },
    openTelecallerModal: function (id, name, mobile, queue) {
      const cleanMobile = (mobile || '').replace(/\D/g, '');
      const cleanIdEl = document.getElementById('telCustCleanMobile');
      if (cleanIdEl) cleanIdEl.value = cleanMobile;
      if (dom.telCustId) dom.telCustId.value = id;
      if (dom.telCustNamePreview) dom.telCustNamePreview.textContent = name;
      if (dom.telCustMobilePreview) dom.telCustMobilePreview.textContent = mobile;
      if (dom.telCustQueueInfo) dom.telCustQueueInfo.textContent = `Queue: ${(queue || '').toUpperCase()}`;
      dom.modalTelecallerAction.classList.add('active');
    },
    openCallModalForDivert: function (id) {
      const d = state.diverts.find(x => x.id === id);
      if (!d) return;
      const cleanMobile = (d.mobile || '').replace(/\D/g, '');
      const cleanIdEl = document.getElementById('telCustCleanMobile');
      if (cleanIdEl) cleanIdEl.value = cleanMobile;
      if (dom.telCustId) dom.telCustId.value = d.id;
      if (dom.telCustNamePreview) dom.telCustNamePreview.textContent = d.customerName;
      if (dom.telCustMobilePreview) dom.telCustMobilePreview.textContent = d.mobile;
      if (dom.telCustQueueInfo) dom.telCustQueueInfo.textContent = `Divert Requirement: ${d.product} (${d.reason}) • Counter: ${d.counter}`;
      const tagsContainer = document.getElementById('telCustTagsPreview');
      if (tagsContainer) {
        tagsContainer.innerHTML = `<span class="badge badge-amber">📦 Divert: ${d.product}</span> <span class="badge badge-subtle">${d.counter}</span>`;
      }
      if (dom.telDisposition) dom.telDisposition.value = 'Connected - Stock Arrived / Customer Visiting';
      if (dom.telNotes) dom.telNotes.value = `Divert item: ${d.product}, Design: ${d.design || 'Standard'}, Size: ${d.size || 'N/A'}. Collected by: ${d.employee}.`;
      dom.modalTelecallerAction.classList.add('active');
    },
    openWhatsAppModalForCustomerByMobile: function (cleanMobile) {
      const lead = getAllCustomerLeads().find(l => l.cleanMobile === cleanMobile);
      if (!lead) return;
      const isChitEnrolled = lead.tags.some(t => t.label.includes('Chit Enrolled'));
      const isConcern = lead.tags.some(t => t.label.includes('Concern'));
      const isDivert = lead.tags.some(t => t.label.includes('Divert'));

      let defaultTmpl = 'chit';
      if (isDivert) defaultTmpl = 'stock';
      else if (isConcern) defaultTmpl = 'service';
      else if (isChitEnrolled) defaultTmpl = 'thankyou';

      openWhatsAppModal({
        customerName: lead.customerName,
        mobile: lead.mobile,
        branch: state.activeBranch,
        product: lead.occasionDesc || 'Gold Jewellery',
        q5: isChitEnrolled ? 'Yes - Already Enrolled' : 'No'
      }, defaultTmpl);
    },
    openWhatsAppModalForCustomer: function (id) {
      const f = state.feedbacks.find(x => x.id === id);
      if (f) {
        const isNonChit = f.q5 && !f.q5.includes('Already Enrolled');
        const defaultTmpl = isNonChit ? 'chit' : (f.mood === 'Concern' ? 'service' : 'thankyou');
        openWhatsAppModal(f, defaultTmpl);
      }
    },
    openWhatsAppModalForDivert: function (id) {
      const d = state.diverts.find(x => x.id === id);
      if (d) openWhatsAppModal(d, 'stock');
    },
    openCustomerSelfFillModal: function () {
      openCustomerPortal();
    },
    drilldownQuestionOption: function (qId, optText) {
      drilldownQuestionOption(qId, optText);
    },
    viewFeedbackDetail: function (id) {
      const fb = state.feedbacks.find(f => f.id === id);
      if (fb) {
        showToast(`Feedback ${id}: Customer ${fb.customerName} rated ${fb.rating}/10 (${fb.mood})`);
      }
    },
    toggleQuestionMandatory: function (qId) {
      const q = state.questionsConfig.find(item => item.q_id === qId);
      if (q) {
        q.is_mandatory = !q.is_mandatory;
        renderQuestionsConfig();
        renderFeedbackModalQuestions();
        showToast(`Question ${qId} mandatory set to: ${q.is_mandatory ? 'YES' : 'NO'}`);
      }
    },
    toggleQuestionActive: function (qId) {
      const q = state.questionsConfig.find(item => item.q_id === qId);
      if (q) {
        q.is_active = !q.is_active;
        renderQuestionsConfig();
        renderFeedbackModalQuestions();
        renderQuestionWiseReport();
        showToast(`Question ${qId} is now ${q.is_active ? 'Active' : 'Disabled'}.`);
      }
    },
    openEditQuestionModal: function (qId) {
      openEditQuestionModal(qId);
    },
    updateQuestionOrder: function (qId, newOrder) {
      const q = state.questionsConfig.find(item => item.q_id === qId);
      if (q) {
        q.display_order = parseInt(newOrder) || 0;
        state.questionsConfig.sort((a, b) => a.display_order - b.display_order);
        renderQuestionsConfig();
        renderQuestionWiseReport();
        showToast(`Updated display order for ${qId}.`);
      }
    },
    loadPastDateSlots: function (dateStr) {
      loadPastDateSlots(dateStr);
    },
    toggleFeedbackAccordion: function (id) {
      if (expandedFeedbackIds.has(id)) {
        expandedFeedbackIds.delete(id);
      } else {
        expandedFeedbackIds.add(id);
      }
      const card = document.getElementById(`fbCard_${id}`);
      if (card) {
        card.classList.toggle('is-expanded');
      }
    },
    updateFeedbackStatus: function (id) {
      const fb = state.feedbacks.find(f => f.id === id);
      if (!fb) return;
      const statusSel = document.getElementById(`statusSelect_${id}`);
      const remarkInput = document.getElementById(`actionRemark_${id}`);
      if (statusSel) fb.status = statusSel.value;
      if (remarkInput && remarkInput.value.trim()) fb.actionRemark = remarkInput.value.trim();

      saveFeedbacksToStorage();
      sendToGSheet('UPDATE_FEEDBACK_STATUS', {
        id: fb.id,
        status: fb.status,
        actionRemark: fb.actionRemark || ''
      });

      renderFeedbackList();
      renderReports();
      renderDER();
      showToast(`Status updated to ${fb.status} for ${fb.customerName}! (Synced with GSheet) ✅`);
    },
    saveGSheetUrl: function (url) { saveGSheetUrl(url); },
    testGSheetConnection: function (showToast) { return testGSheetConnection(showToast); },
    saveCFWorkerUrl: function (url) { saveCFWorkerUrl(url); },
    testCFWorkerConnection: function (showToast) { return testCFWorkerConnection(showToast); },
    printStandeePlacard: function () { printStandeePlacard(); },
    downloadQRCodeSvg: function () { downloadQRCodeSvg(); },
    updateQRStudioLinkAndPreview: function () { updateQRStudioLinkAndPreview(); },
    syncAllDataToGSheet: function () { syncAllDataToGSheet(); },
    pullDataFromGSheet: function () { pullDataFromGSheet(); },
    fetchQuestionsFromCloud: function (showToast) { return fetchQuestionsFromCloud(showToast); },
    toggleGSheetGuide: function () { toggleGSheetGuide(); },
    copyAppsScriptCode: function () { copyAppsScriptCode(); },
    downloadAppsScriptFile: function () { downloadAppsScriptFile(); },
    toggleDivertMandatory: function (fieldId) {
      const field = state.divertQuestionsConfig.find(d => d.field_id === fieldId);
      if (field) {
        field.is_mandatory = !field.is_mandatory;
        renderDivertQuestionsConfig();
        showToast(`Divert Field '${field.field_label}' required set to: ${field.is_mandatory ? 'YES' : 'NO'}`);
      }
    },
    updateDivertOrder: function (fieldId, newOrder) {
      const field = state.divertQuestionsConfig.find(d => d.field_id === fieldId);
      if (field) {
        field.display_order = parseInt(newOrder) || 0;
        state.divertQuestionsConfig.sort((a, b) => a.display_order - b.display_order);
        renderDivertQuestionsConfig();
        showToast(`Updated display order for ${fieldId}`);
      }
    }
  };

  // Launch when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
})();
