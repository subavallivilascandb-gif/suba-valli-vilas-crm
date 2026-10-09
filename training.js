/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - CRM TEAM TRAINING KIT & DAILY BRIEFING TRACKER
 * Document Ref: TEM/102/CRM/004/HS/SEP-26
 * 13 Official Modules + Frameworks (SPARKLE, TAP, LEAD, CALM) + Daily Log Table
 * ============================================================================
 */

(function () {
  'use strict';

  const TRAINING_MODULES = [
    {
      id: 1,
      titleEn: "1. Personal Conduct & Grooming",
      titleTa: "1. பொது நடத்தை மற்றும் தோற்றம்",
      summary: "Punctuality, neat uniform, badge, posture, and zero personal phone distractions on the shop floor.",
      pointsEn: [
        "Be on the shop floor at least 10 minutes before opening time.",
        "Wear a clean, ironed uniform and your ID badge at all times.",
        "Keep hair neatly tied, nails trimmed, and footwear polished.",
        "Keep makeup and personal jewellery minimal and professional.",
        "No phone use, chewing gum, or eating on the shop floor.",
        "Do not stand in groups or chat casually while customers are around.",
        "Speak respectfully to colleagues and supervisors at all times."
      ],
      pointsTa: [
        "கடை திறக்கும் நேரத்திற்கு குறைந்தது 10 நிமிடங்களுக்கு முன் விற்பனைத் தளத்தில் இருக்க வேண்டும்.",
        "எப்போதும் சுத்தமான, இஸ்திரி செய்த உடையையும் அடையாள அட்டையையும் அணிய வேண்டும்.",
        "முடியை நேர்த்தியாகக் கட்டி, நகங்களை வெட்டி, காலணிகளை பளபளப்பாக வைத்திருக்க வேண்டும்.",
        "மேக்கப் மற்றும் தனிப்பட்ட நகைகளை குறைவாகவும் தொழில்முறையாகவும் வைத்திருக்க வேண்டும்.",
        "விற்பனைத் தளத்தில் தொலைபேசி பயன்பாடு, சூயிங்கம் மெல்லுதல் அல்லது உணவு உண்பது கூடாது.",
        "வாடிக்கையாளர்கள் இருக்கும்போது குழுவாக நின்று அரட்டையடிக்கக் கூடாது.",
        "சக ஊழியர்கள் மற்றும் மேற்பார்வையாளர்களுடன் எப்போதும் மரியாதையுடன் பேச வேண்டும்."
      ]
    },
    {
      id: 2,
      titleEn: "2. Standing Position & Body Language",
      titleTa: "2. நிற்கும் நிலை மற்றும் உடல் மொழி",
      summary: "Open posture, gentle smile, facing entrance, and guiding with open palm.",
      pointsEn: [
        "Stand at your assigned zone facing entrance or walkway — never facing the wall.",
        "Feet shoulder-width apart, hands loosely clasped in front — not crossed or behind back.",
        "During rush hours, spread out across zones instead of clustering at one counter.",
        "Keep an open posture, gentle smile, and warm eye contact.",
        "Nod slightly when a customer looks toward you to show you noticed them.",
        "Use an open palm to point or guide — never a single finger.",
        "Avoid slouching, leaning on counters, or folding your arms."
      ],
      pointsTa: [
        "நியமிக்கப்பட்ட இடத்தில், நுழைவாயில் அல்லது நடைபாதையை நோக்கி நில்லுங்கள் — சுவரை நோக்கி நிற்கக்கூடாது.",
        "கால்களை தோள் அகலத்தில் வைத்து, கைகளை முன்பக்கம் மெதுவாகப் பிணைத்து வைக்கவும் — முதுகுக்கு பின் வைக்கவோ கூடாது.",
        "நெரிசல் நேரங்களில், ஒரே கவுண்டரில் கூடி நிற்காமல் பல்வேறு பகுதிகளில் பரவி நிற்கவும்.",
        "திறந்த நிலை, மென்மையான புன்னகை மற்றும் அன்பான கண்தொடர்பை பராமரிக்கவும்.",
        "வாடிக்கையாளர் உங்களைப் பார்க்கும்போது, அவர்களைக் கவனித்துள்ளீர்கள் என்பதைக் காட்ட சிறிது தலையசைக்கவும்.",
        "காட்ட அல்லது வழிகாட்ட திறந்த உள்ளங்கையைப் பயன்படுத்தவும் — ஒரு விரலால் காட்டக் கூடாது.",
        "கூனிக் குறுகி நிற்பது, கவுண்டரில் சாய்வது அல்லது கைகளைக் கட்டிக்கொள்வது தவிர்க்கவும்."
      ]
    },
    {
      id: 3,
      titleEn: "3. Welcoming Protocol",
      titleTa: "3. வரவேற்பு நெறிமுறை",
      summary: "The sacred 10-Second Welcoming Standard with traditional Tamil hospitality.",
      pointsEn: [
        "Spot customer as soon as they approach or enter the showroom.",
        "Smile and make warm eye contact immediately.",
        "Greet within 10 seconds: 'Vanakkam! Welcome to Suba Valli Vilas Jewellery.'",
        "Ask open question: 'How may I help you today? Looking for gold, diamond, or silver?'",
        "If busy with another customer, acknowledge: 'Welcome! Please give me a moment, I will be right with you.'",
        "Offer a seat and water to elderly customers or those who need to wait."
      ],
      pointsTa: [
        "வாடிக்கையாளர் கடையை நெருங்கும்போதே அல்லது நுழையும்போதே கவனியுங்கள்.",
        "புன்னகையுடன் அன்பான கண்தொடர்பை ஏற்படுத்துங்கள்.",
        "10 விநாடிகளுக்குள் வரவேற்கவும்: 'வணக்கம்! சுப வள்ளி விலாஸ் ஜுவல்லரிக்கு நல்வரவு.'",
        "'இன்று நான் எப்படி உதவலாம்? தங்கம், வைரம் அல்லது வெள்ளி நகைகள் பார்க்க வந்தீர்களா?' எனக் கேளுங்கள்.",
        "வேறொருவருடன் பிஸியாக இருந்தால்: 'வணக்கம்! ஒரு நிமிடம் தாருங்கள், உடனே வருகிறேன்' எனத் தெரிவிக்கவும்.",
        "வயதானவர்கள் அல்லது காத்திருக்க வேண்டியவர்களுக்கு இருக்கை மற்றும் தண்ணீர் வழங்கவும்."
      ]
    },
    {
      id: 4,
      titleEn: "4. Direction Protocol",
      titleTa: "4. வழிகாட்டல் நெறிமுறை",
      summary: "Escorting customers seamlessly and introducing counter sales staff by name.",
      pointsEn: [
        "Guide with an open palm, walk a few steps with customer if section is not visible.",
        "Announce section clearly: 'This way please, for gold bangles.'",
        "Introduce customer to counter staff by name: 'This is Priya, she will assist you with diamond jewellery.'",
        "For elderly or differently-abled customers, walk them fully to counter and offer a chair."
      ],
      pointsTa: [
        "திறந்த உள்ளங்கையால் வழிகாட்டி, பிரிவு தெரியாவிட்டால் வாடிக்கையாளருடன் சில அடி நடந்து செல்லவும்.",
        "'இந்தப் பக்கம் வாருங்கள், தங்க வளையல்கள் இங்கே இருக்கின்றன' எனத் தெளிவாகக் கூறவும்.",
        "'இவர் பிரியா, வைர நகைகளுக்கு உங்களுக்கு உதவுவார்' என பெயருடன் அறிமுகப்படுத்தவும்.",
        "வயதானவர்கள் அல்லது மாற்றுத்திறனாளிகளுக்கு, கவுண்டர் வரை முழுவதும் அழைத்துச் சென்று நாற்காலி வழங்கவும்."
      ]
    },
    {
      id: 5,
      titleEn: "5. Customer Handling – 6 Sample Scenarios",
      titleTa: "5. வாடிக்கையாளர் கையாளுதல் – மாதிரிக் காட்சிகளும் பதில்களும்",
      summary: "Exact scripted responses for budget, rush, out-of-stock, and indecisive scenarios.",
      scenarios: [
        {
          sitEn: "Customer says 'I'm just looking.'",
          sitTa: "வாடிக்கையாளர் 'நான் வெறுமனே பார்க்கிறேன்' என்கிறார்.",
          ansEn: "Sure, please take your time. I'm right here if you need any help.",
          ansTa: "சரி, தாராளமாகப் பாருங்கள். ஏதேனும் உதவி வேண்டுமானால் நான் இங்கேயே இருக்கிறேன்."
        },
        {
          sitEn: "Customer complains gold rate / price is too high.",
          sitTa: "தங்க விலை அதிகம் என வாடிக்கையாளர் புகார் தெரிவிக்கிறார்.",
          ansEn: "I understand rates are a concern today. Let me show you options within your budget, and our team can explain making charges and current offers.",
          ansTa: "இன்றைய விலை குறித்த உங்கள் கவலையைப் புரிந்துகொள்கிறேன். உங்கள் பட்ஜெட்டிற்கு ஏற்ற வடிவமைப்புகளைக் காட்டுகிறேன்."
        },
        {
          sitEn: "Customer is in a hurry.",
          sitTa: "வாடிக்கையாளர் அவசரத்தில் இருக்கிறார்.",
          ansEn: "I understand you're short on time. Let me quickly show you our best-selling designs in this category.",
          ansTa: "உங்களுக்கு நேரம் குறைவு என்பதைப் புரிந்துகொள்கிறேன். அதிகம் விற்பனையாகும் வடிவமைப்புகளை உடனே காட்டுகிறேன்."
        },
        {
          sitEn: "The design customer wants is not in stock.",
          sitTa: "வாடிக்கையாளர் விரும்பும் வடிவமைப்பு கையிருப்பில் இல்லை.",
          ansEn: "This exact design isn't available today, but let me show similar designs, check other branch, or place a custom order.",
          ansTa: "இந்த வடிவமைப்பு இன்று கிடைக்கவில்லை, ஆனால் இதே போன்றவற்றை காட்டுகிறேன், அல்லது ஆர்டர் செய்யலாம்."
        },
        {
          sitEn: "Customer is undecided between two items.",
          sitTa: "இரண்டு பொருட்களுக்கு இடையே வாடிக்கையாளர் தீர்மானிக்க முடியவில்லை.",
          ansEn: "Both are lovely choices. May I ask what occasion this is for? That will help me guide you better.",
          ansTa: "இரண்டுமே அழகான தேர்வுகள். இது எந்த சந்தர்ப்பத்திற்கு என்று கேட்கலாமா?"
        },
        {
          sitEn: "Customer asks about exchange / buy-back policy.",
          sitTa: "பரிமாற்று/திரும்ப வாங்கும் கொள்கை குறித்து வாடிக்கையாளர் கேட்கிறார்.",
          ansEn: "Let me connect you with our sales executive, who can explain our exchange and 916 buy-back policy in full detail.",
          ansTa: "எங்கள் விற்பனை நிர்வாகியுடன் உங்களை இணைக்கிறேன், அவர் கொள்கையை முழுமையாக விளக்குவார்."
        }
      ]
    },
    {
      id: 6,
      titleEn: "6. Do's and Don'ts",
      titleTa: "6. செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை",
      summary: "Clear daily behavioral boundaries for all CRM personnel.",
      dosEn: [
        "Greet every customer warmly within 10 seconds.",
        "Maintain eye contact and active listening.",
        "Offer water/seating to waiting or elderly customers.",
        "Thank every customer, purchase or not.",
        "Escalate serious complaints immediately.",
        "Record footfall, feedback and diverts accurately & on time.",
        "Stay calm and positive, even under pressure."
      ],
      dontsEn: [
        "Don't ignore a customer or leave them waiting unacknowledged.",
        "Don't argue or raise your voice with a customer.",
        "Don't discuss politics, religion, or personal opinions.",
        "Don't force a purchase or oversell.",
        "Don't use phone or chat with colleagues near customers.",
        "Don't share customer information outside the process.",
        "Don't make promises the store cannot keep."
      ]
    },
    {
      id: 7,
      titleEn: "7. Daily Review – Yesterday's Numbers",
      titleTa: "7. தினசரி மதிப்பாய்வு – நேற்றைய தரவுகள்",
      summary: "Start every morning briefing with a 2-minute review of Footfall, Feedback %, and Diverts.",
      pointsEn: [
        "Footfall: Review total against daily target and review peak rush hour.",
        "Feedback: Review % collected against target (≥ 60%), read 1 positive comment and 1 improvement point.",
        "Diverts: Review divert % and primary reason; agree on 1 alternate product suggestion idea for today."
      ],
      pointsTa: [
        "வருகையாளர்: நேற்றைய மொத்த எண்ணிக்கை, இலக்கு மற்றும் நெரிசல் நேரத்தை மதிப்பாய்வு செய்தல்.",
        "கருத்து: சேகரிப்பு சதவீதம் (≥ 60%), 1 நேர்மறை கருத்து மற்றும் 1 முன்னேற்றப் புள்ளியை வாசித்தல்.",
        "திசைமாற்றம்: திசைமாற்ற % மற்றும் காரணம்; இன்று முயற்சிக்கும் ஒரு மாற்றுப் பொருள் யோசனையை முடிவு செய்தல்."
      ]
    },
    {
      id: 8,
      titleEn: "8. Exit Words & Thank-You Note",
      titleTa: "8. வெளியேறும் வார்த்தைகள் மற்றும் நன்றி குறிப்பு",
      summary: "Leaving a lasting golden impression whether a purchase was made or not.",
      pointsEn: [
        "When Purchase Made: 'Thank you so much for choosing Suba Valli Vilas Jewellery. Please do share your feedback and a Google review — it means a lot to us. We look forward to seeing you again soon!'",
        "When No Purchase Made: 'Thank you so much for visiting us today. Please do keep Suba Valli Vilas Jewellery in mind for your jewellery needs, and do visit us again.'",
        "Always Remember: Smile, nod slightly, and for high-value or senior customers, walk them all the way to the entrance."
      ],
      pointsTa: [
        "வாங்கும் போது: 'சுப வள்ளி விலாஸ் ஜுவல்லரியைத் தேர்ந்தெடுத்ததற்கு மிக்க நன்றி. உங்கள் கருத்தையும் கூகுள் மதிப்புரையையும் பகிரவும் — மீண்டும் உங்களைச் சந்திக்க ஆவலாக உள்ளோம்!'",
        "வாங்காத போது: 'இன்று எங்களைச் சந்தித்தமைக்கு மிக்க நன்றி. உங்கள் நகை தேவைகளுக்கு எங்களை நினைவில் வைத்துக் கொள்ளுங்கள், மீண்டும் வருகை தாருங்கள்.'",
        "எப்போதும் நினைவில் கொள்க: புன்னகைத்து, சிறிது தலையசைத்து, மூத்த வாடிக்கையாளர்களுக்கு கதவு வரை சென்று வழியனுப்பவும்."
      ]
    },
    {
      id: 9,
      titleEn: "9. SPARKLE – Customer Engagement Framework",
      titleTa: "9. SPARKLE – வாடிக்கையாளர் ஈடுபாட்டு வழிமுறை",
      summary: "S-P-A-R-K-L-E mnemonic for complete customer interaction excellence.",
      steps: [
        { l: "S", en: "Smile & greet within 10 seconds", ta: "10 விநாடிக்குள் புன்னகையுடன் வரவேற்றல்" },
        { l: "P", en: "Present yourself professionally (grooming & posture)", ta: "தொழில்முறையாகத் தோற்றம் அளித்தல்" },
        { l: "A", en: "Ask open questions to understand their need", ta: "தேவையை அறிய திறந்த கேள்விகள் கேட்டல்" },
        { l: "R", en: "Recommend the right product for occasion & budget", ta: "சந்தர்ப்பம் மற்றும் பட்ஜெட்டிற்கேற்ப பரிந்துரைத்தல்" },
        { l: "K", en: "Keep them engaged with 2–3 good options & offers", ta: "நல்ல தேர்வுகள் மற்றும் சலுகைகளுடன் ஈடுபாட்டைத் தக்கவைத்தல்" },
        { l: "L", en: "Listen to their feedback, spoken or unspoken", ta: "கருத்தை, சொன்னாலும் சொல்லாவிட்டாலும், கேட்டல்" },
        { l: "E", en: "End with a warm thank-you and invite them back", ta: "அன்பான நன்றியுடன் முடித்து மீண்டும் வர அழைத்தல்" }
      ]
    },
    {
      id: 10,
      titleEn: "10. TAP – Feedback Collection Framework",
      titleTa: "10. TAP – கருத்து சேகரிப்பு வழிமுறை",
      summary: "T-A-P standard: Non-pushy, polite 30-second feedback gathering.",
      steps: [
        { l: "T", en: "Time it right — ask at billing or exit, never mid-shopping", ta: "சரியான நேரம் — பில்லிங்/வெளியேறும் போது கேளுங்கள்" },
        { l: "A", en: "Ask politely and briefly explain it takes only 30 seconds", ta: "பணிவுடன் கேட்டு 30 விநாடிகள் மட்டுமே ஆகும் என விளக்கவும்" },
        { l: "P", en: "Provide the form/app and thank them once submitted", ta: "படிவம்/செயலியை கொடுத்து சமர்ப்பித்தவுடன் நன்றி தெரிவிக்கவும்" }
      ],
      rule: "Never force a customer, and never fill the form on their behalf (வாடிக்கையாளரை வற்புறுத்தாதீர்கள்; அவர்களுக்குப் பதிலாக நீங்கள் நிரப்பாதீர்கள்)."
    },
    {
      id: 11,
      titleEn: "11. LEAD – Divert Handling Framework",
      titleTa: "11. LEAD – திசைமாற்ற கையாளுதல் வழிமுறை",
      summary: "L-E-A-D: Listening, explaining alternatives, and assuring follow-up.",
      steps: [
        { l: "L", en: "Listen carefully to exactly what they are looking for", ta: "அவர்கள் என்ன தேடுகிறார்கள் என்பதைக் கவனமாகக் கேளுங்கள்" },
        { l: "E", en: "Explain alternatives — similar design, other branch, custom order", ta: "மாற்றுகளை விளக்கவும் — ஒத்த வடிவமைப்பு, மற்ற கிளை, ஆர்டர்" },
        { l: "A", en: "Assure a follow-up call once the item is available", ta: "பொருள் கிடைத்தவுடன் தொடர்பு கொள்வதாக உறுதியளிக்கவும்" },
        { l: "D", en: "Document the divert reason accurately in the app immediately", ta: "திசைமாற்ற காரணத்தை உடனடியாக செயலியில் பதிவு செய்யவும்" }
      ]
    },
    {
      id: 12,
      titleEn: "12. CALM – Handling Difficult Customers",
      titleTa: "12. CALM – கடுமையான வாடிக்கையாளர்களை கையாளுதல்",
      summary: "C-A-L-M framework for de-escalation and prompt management intervention.",
      steps: [
        { l: "C", en: "Compose yourself; stay calm and don't take it personally", ta: "அமைதியாக இருங்கள்; தனிப்பட்டதாக எடுத்துக்கொள்ளாதீர்கள்" },
        { l: "A", en: "Acknowledge concern sincerely: 'I understand this is frustrating.'", ta: "கவலையை உண்மையாக ஒப்புக்கொள்ளுங்கள்" },
        { l: "L", en: "Listen fully without interrupting", ta: "குறுக்கிடாமல் முழுமையாகக் கேளுங்கள்" },
        { l: "M", en: "Manage the resolution, or escalate immediately to CRM Manager", ta: "தீர்வை நிர்வகிக்கவும், அல்லது உடனடியாக மேலாளரிடம் தெரிவிக்கவும்" }
      ],
      rule: "Never argue, never raise your voice, and never say 'that's not my problem' (ஒருபோதும் வாக்குவாதம் செய்யாதீர்கள்; 'அது என் பிரச்சினை இல்லை' என்று சொல்லாதீர்கள்)."
    },
    {
      id: 13,
      titleEn: "13. Daily Briefing Tracker Register",
      titleTa: "13. தினசரி கூட்டப் பதிவேடு",
      summary: "Official log table to record every daily morning briefing, trainer, attendance, and action items."
    }
  ];

  // Default Initial Tracker Records
  const DEFAULT_TRACKER_ROWS = [
    {
      date: "2026-09-28",
      trainer: "Selvi (CRM Manager)",
      topic: "Module 3: Welcoming Protocol & 10s Greet",
      staffCount: 5,
      absentees: "None",
      keyTakeaway: "10-second greeting achieved in 94% spot checks; reminded team to smile first.",
      trainerSig: "Selvi",
      pcSig: "C&B Verified",
      actionTaken: "Monitored floor during 11 AM - 1 PM rush."
    },
    {
      date: "2026-09-29",
      trainer: "Selvi (CRM Manager)",
      topic: "Module 11: LEAD Divert Handling",
      staffCount: 4,
      absentees: "Kaviya (Leave)",
      keyTakeaway: "Accurate primary reason capture in app; offering lightweight antique substitutes.",
      trainerSig: "Selvi",
      pcSig: "C&B Verified",
      actionTaken: "Coached Ramya & Madhumitha on catalog sharing."
    },
    {
      date: "2026-09-30",
      trainer: "Selvi (CRM Manager)",
      topic: "Module 10: TAP Feedback Collection",
      staffCount: 5,
      absentees: "None",
      keyTakeaway: "Bill counter QR standee guidance; requesting Google reviews from happy buyers.",
      trainerSig: "Selvi",
      pcSig: "C&B Verified",
      actionTaken: "Placed refreshed QR standee at counter 2 & 4."
    }
  ];

  let trackerRows = [];

  const dom = {
    modulesAccordion: document.getElementById('trainingModulesAccordion'),
    trackerTableBody: document.getElementById('trackerTableBody'),
    btnAddLogModal: document.getElementById('btnOpenAddLogModal'),
    modalAddLog: document.getElementById('modalAddLog'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnCancelModal: document.getElementById('btnCancelModal'),
    formAddLog: document.getElementById('formAddLog'),
    logDate: document.getElementById('logDate'),
    logTrainer: document.getElementById('logTrainer'),
    logTopic: document.getElementById('logTopic'),
    logStaffCount: document.getElementById('logStaffCount'),
    logAbsentees: document.getElementById('logAbsentees'),
    logTakeaway: document.getElementById('logTakeaway'),
    logAction: document.getElementById('logAction'),
    btnSyncGSheet: document.getElementById('btnSyncGSheet'),
    syncStatusText: document.getElementById('syncStatusText'),
    toast: document.getElementById('govToast')
  };

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.style.display = 'block';
    setTimeout(() => { dom.toast.style.display = 'none'; }, 3000);
  }

  function initTrackerState() {
    const cached = localStorage.getItem('svv_training_tracker');
    if (cached) {
      try { trackerRows = JSON.parse(cached); } catch (_) { trackerRows = DEFAULT_TRACKER_ROWS; }
    } else {
      trackerRows = DEFAULT_TRACKER_ROWS;
    }
  }

  function renderModules() {
    if (!dom.modulesAccordion) return;
    dom.modulesAccordion.innerHTML = TRAINING_MODULES.filter(m => m.id <= 12).map((m, idx) => {
      let bodyHtml = '';

      if (m.pointsEn) {
        bodyHtml = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
            <div>
              <h4 style="color:#580505; font-size:0.9rem; margin-bottom:8px;">🇬🇧 English Guidelines:</h4>
              <ul style="padding-left:20px; font-size:0.88rem; color:#334155; line-height:1.6;">
                ${m.pointsEn.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 style="color:#9F792B; font-size:0.9rem; margin-bottom:8px; font-family:'Noto Sans Tamil', serif;">🇮🇳 தமிழ்க் குறிப்புகள்:</h4>
              <ul style="padding-left:20px; font-size:0.88rem; color:#580505; font-family:'Noto Sans Tamil', serif; line-height:1.6;">
                ${m.pointsTa.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else if (m.scenarios) {
        bodyHtml = `
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${m.scenarios.map((sc, i) => `
              <div style="background:#FAF8F5; border:1px solid #E5D5B5; border-radius:8px; padding:12px 14px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span class="gov-badge gov-badge-maroon">Scenario ${i+1}</span>
                  <strong style="color:#580505; font-size:0.88rem;">${escapeHtml(sc.sitEn)}</strong>
                </div>
                <div style="font-family:'Noto Sans Tamil', serif; font-size:0.84rem; color:#64748B; margin-bottom:8px;">${escapeHtml(sc.sitTa)}</div>
                <div style="background:#FFF; border-left:3px solid #15803D; padding:8px 12px; border-radius:4px; font-size:0.88rem;">
                  <strong style="color:#15803D;">Suggested Response:</strong> "${escapeHtml(sc.ansEn)}"<br>
                  <span style="font-family:'Noto Sans Tamil', serif; color:#1E293B; font-size:0.84rem;">"${escapeHtml(sc.ansTa)}"</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (m.dosEn) {
        bodyHtml = `
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
            <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:8px; padding:14px;">
              <h4 style="color:#15803D; margin-bottom:8px;">✅ DO'S (செய்ய வேண்டியவை)</h4>
              <ul style="padding-left:20px; font-size:0.86rem; color:#166534; line-height:1.55;">
                ${m.dosEn.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
              </ul>
            </div>
            <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:8px; padding:14px;">
              <h4 style="color:#B91C1C; margin-bottom:8px;">❌ DON'TS (செய்யக்கூடாதவை)</h4>
              <ul style="padding-left:20px; font-size:0.86rem; color:#991B1B; line-height:1.55;">
                ${m.dontsEn.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else if (m.steps) {
        bodyHtml = `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${m.steps.map(st => `
              <div style="display:flex; align-items:center; gap:12px; background:#FFFBF2; border:1px solid #E5D5B5; border-radius:6px; padding:8px 12px;">
                <div style="width:36px; height:36px; border-radius:50%; background:#580505; color:#C5A059; font-weight:800; font-size:18px; display:flex; align-items:center; justify-content:center;">
                  ${st.l}
                </div>
                <div style="flex:1;">
                  <strong style="color:#1E293B; font-size:0.9rem;">${escapeHtml(st.en)}</strong>
                  <div style="font-family:'Noto Sans Tamil', serif; font-size:0.82rem; color:#78350F;">${escapeHtml(st.ta)}</div>
                </div>
              </div>
            `).join('')}
            ${m.rule ? `<div style="margin-top:6px; font-size:0.82rem; color:#991B1B; font-weight:bold; background:#FEF2F2; padding:8px 12px; border-radius:6px;">⚠️ Rule: ${escapeHtml(m.rule)}</div>` : ''}
          </div>
        `;
      }

      return `
        <details class="gov-card" style="margin-bottom:12px; padding:14px 18px;" ${idx === 0 ? 'open' : ''}>
          <summary style="font-weight:700; color:#580505; cursor:pointer; font-size:1rem; display:flex; justify-content:space-between; align-items:center;">
            <span>${escapeHtml(m.titleEn)} <small style="color:#9F792B; font-family:'Noto Sans Tamil', serif;">(${escapeHtml(m.titleTa)})</small></span>
            <span class="gov-badge gov-badge-gold">Module ${m.id}</span>
          </summary>
          <div style="margin-top:14px; padding-top:12px; border-top:1px solid #E8E2D7;">
            <p style="font-size:0.85rem; color:#64748B; margin-bottom:12px;">${escapeHtml(m.summary)}</p>
            ${bodyHtml}
          </div>
        </details>
      `;
    }).join('');
  }

  function renderTrackerTable() {
    if (!dom.trackerTableBody) return;

    if (trackerRows.length === 0) {
      dom.trackerTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:32px; color:#64748B;">No daily briefing records logged yet. Click '+ Add Briefing Entry' above.</td></tr>`;
      return;
    }

    dom.trackerTableBody.innerHTML = trackerRows.map((r, i) => `
      <tr>
        <td style="text-align:center; font-weight:700; color:#580505;">${r.date}</td>
        <td><strong>${escapeHtml(r.trainer)}</strong></td>
        <td><span class="gov-badge gov-badge-gold">${escapeHtml(r.topic)}</span></td>
        <td style="text-align:center; font-weight:700;">${r.staffCount}</td>
        <td style="color:${r.absentees === 'None' ? '#15803D' : '#B91C1C'};">${escapeHtml(r.absentees)}</td>
        <td style="max-width:240px; font-size:0.84rem;">${escapeHtml(r.keyTakeaway)}</td>
        <td style="text-align:center; font-weight:600; font-size:0.82rem; color:#580505;">${escapeHtml(r.trainerSig)}</td>
        <td style="text-align:center; font-weight:600; font-size:0.82rem; color:#15803D;">${escapeHtml(r.pcSig)}</td>
        <td style="font-size:0.84rem; color:#475569;">${escapeHtml(r.actionTaken)}</td>
      </tr>
    `).join('');
  }

  function handleAddLog(e) {
    e.preventDefault();

    const newEntry = {
      date: dom.logDate.value || new Date().toISOString().split('T')[0],
      trainer: dom.logTrainer.value || "Selvi (CRM Manager)",
      topic: dom.logTopic.value || "Module 1: Grooming & Discipline",
      staffCount: parseInt(dom.logStaffCount.value) || 5,
      absentees: dom.logAbsentees.value.trim() || "None",
      keyTakeaway: dom.logTakeaway.value.trim() || "Briefing conducted successfully.",
      trainerSig: "Selvi",
      pcSig: "Verified",
      actionTaken: dom.logAction.value.trim() || "Follow-up on floor."
    };

    trackerRows.unshift(newEntry);
    localStorage.setItem('svv_training_tracker', JSON.stringify(trackerRows));

    renderTrackerTable();
    closeModal();
    showToast("✅ Daily briefing recorded and saved to training register!");

    syncWithGoogleSheet();
  }

  function openModal() {
    if (dom.modalAddLog) {
      dom.logDate.value = new Date().toISOString().split('T')[0];
      dom.modalAddLog.classList.add('active');
    }
  }

  function closeModal() {
    if (dom.modalAddLog) dom.modalAddLog.classList.remove('active');
  }

  function syncWithGoogleSheet() {
    const gsheetUrl = localStorage.getItem('svv_gsheet_url') || 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec';
    if (dom.syncStatusText) dom.syncStatusText.textContent = "Syncing with GSheet...";

    fetch(`${gsheetUrl}?action=PING`)
      .then(res => res.json())
      .then(() => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Synced with GSheet";
        showToast("✅ Training Kit & Daily Briefing tracker synced with Google Sheet!");
      })
      .catch(() => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Cached (Offline)";
        showToast("ℹ️ Training logs persisted to local browser storage.");
      });
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
    initTrackerState();
    renderModules();
    renderTrackerTable();

    if (dom.btnAddLogModal) dom.btnAddLogModal.addEventListener('click', openModal);
    if (dom.btnCloseModal) dom.btnCloseModal.addEventListener('click', closeModal);
    if (dom.btnCancelModal) dom.btnCancelModal.addEventListener('click', closeModal);
    if (dom.formAddLog) dom.formAddLog.addEventListener('submit', handleAddLog);
    if (dom.btnSyncGSheet) dom.btnSyncGSheet.addEventListener('click', syncWithGoogleSheet);

    setTimeout(syncWithGoogleSheet, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
