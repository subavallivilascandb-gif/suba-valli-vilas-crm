/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - CRM MISSION CONTROL (GAME ENGINE)
 * Module: Ultra-Interactive Gamified Simulation Engine with Cartoon Characters
 * Features:
 *   - Voice Assistant (Tamil & English Web Speech API Narration) 🔊
 *   - Cartoon Character Cards for all Staff Members with Superpowers
 *   - Easiest Visual Matching for RACI (All 17 Official C&B Processes)
 *   - Comprehensive RNR Question Bank (All Greeter, Manager, Telecaller duties)
 *   - All Questions Directory Explorer Modal (55+ Total Qs)
 *   - 3D Cyber-Gold Dice Roll & Fisher-Yates Dynamic Shuffling
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CARTOON STAFF HEROES ROSTER & SUPERPOWERS CATALOG
  // --------------------------------------------------------------------------
  const CARTOON_STAFF = {
    ramya_kaviya: {
      id: "ramya_kaviya",
      nameTa: "ரம்யா & காவியா",
      nameEn: "Ramya & Kaviya",
      roleTa: "CRM வரவேற்பாளர்கள் (CRM Staff 1 & 4)",
      roleEn: "CRM Showroom Greeters (Staff 1 & 4)",
      badgeTitle: "⭐ Smile Stars",
      avatar: "🌟",
      theme: "theme-amber",
      superpowerTa: "10 விநாடி இன்முக வரவேற்பு & மணிநேர வருகையாளர் பதிவு",
      superpowerEn: "10s Namaste Greeting & Hourly Footfall Slot Logging",
      voiceDescTa: "ரம்யா மற்றும் காவியா. வரவேற்பு நாயகிகள். வாடிக்கையாளர்களை 10 விநாடிகளுக்குள் புன்னகையுடன் வரவேற்பவர்கள்."
    },
    madhumitha_praveen: {
      id: "madhumitha_praveen",
      nameTa: "மதுமிதா & பிரவீன்",
      nameEn: "Madhumitha & Praveen",
      roleTa: "தரைத்தள வழிகாட்டிகள் & உபசரிப்பு (CRM Staff 2 & 3)",
      roleEn: "Floor Hosts & Valet (CRM Staff 2 & 3)",
      badgeTitle: "🚀 Floor Champions",
      avatar: "💎",
      theme: "theme-cyan",
      superpowerTa: "நெரிசல் சீரமைப்பு, வாகன உதவி & கருத்து சேகரிப்பு",
      superpowerEn: "Peak Crowd Flow, Valet Welcoming & Feedback Collection",
      voiceDescTa: "மதுமிதா மற்றும் பிரவீன். தரைத்தள வழிகாட்டிகள். நெரிசல் நேரங்களில் வாடிக்கையாளர்களுக்கு வழிகாட்டுபவர்கள்."
    },
    selvi: {
      id: "selvi",
      nameTa: "செல்வி",
      nameEn: "Selvi",
      roleTa: "CRM மேலாளர் (CRM Manager)",
      roleEn: "CRM Manager (Main Showroom)",
      badgeTitle: "👑 CRM Queen",
      avatar: "👑",
      theme: "theme-gold",
      superpowerTa: "காலை 9:50 ஆலோசனைக் கூட்டம் & தினசரி DER அறிக்கை",
      superpowerEn: "9:50 AM Huddle, Coaching & Evening DER Dispatch",
      voiceDescTa: "செல்வி. CRM மேலாளர். காலை கூட்டத்தை நடத்துபவர் மற்றும் நாள் முடிவு அறிக்கையை தயாரிப்பவர்."
    },
    saranya: {
      id: "saranya",
      nameTa: "சரண்யா",
      nameEn: "Saranya",
      roleTa: "டெலிகாலர் பிரிவு (CRM Telecaller Desk)",
      roleEn: "CRM Telecaller Desk",
      badgeTitle: "🎧 Super Telecaller",
      avatar: "🎧",
      theme: "theme-emerald",
      superpowerTa: "24 மணி நேர திசைமாற்ற மறுஅழைப்பு & தங்கச் சீட்டு அறிமுகம்",
      superpowerEn: "24h Walkout Divert Recovery & Gold Chit Scheme",
      voiceDescTa: "சரண்யா. டெலிகாலர். திசைமாறிய வாடிக்கையாளர்களை 24 மணி நேரத்திற்குள் மீண்டும் அழைப்பவர்."
    },
    sm: {
      id: "sm",
      nameTa: "கடை மேலாளர்",
      nameEn: "Store Manager",
      roleTa: "ஷோரூம் தலைவர் & ஒப்புதல் அளிப்பவர் (Showroom Head)",
      roleEn: "Showroom Operations Head & Approver",
      badgeTitle: "🏛️ Showroom Captain",
      avatar: "🏛️",
      theme: "theme-coral",
      superpowerTa: "கடை செயல்பாடுகள், புகார் தீர்வு & நிர்வாக ஒப்புதல்",
      superpowerEn: "Floor Supervision, Dispute Resolution & Approval",
      voiceDescTa: "கடை மேலாளர். ஷோரூம் தலைவர். அனைத்து முக்கிய செயல்பாடுகளுக்கும் அனுமதி அளிப்பவர்."
    },
    md: {
      id: "md",
      nameTa: "நிர்வாக இயக்குநர் (MD)",
      nameEn: "Managing Director (MD)",
      roleTa: "உயர் நிர்வாகத் தலைமை (Executive Leadership)",
      roleEn: "Executive Strategic Leadership",
      badgeTitle: "🎖️ Grand Master",
      avatar: "🎖️",
      theme: "theme-purple",
      superpowerTa: "உயர் ஆய்வு, நிறுவன உத்தி & கொள்கை ஒப்புதல்",
      superpowerEn: "Executive Governance & Monthly KPI Appraisals",
      voiceDescTa: "நிர்வாக இயக்குநர். நிறுவனத்தின் ஒட்டுமொத்த வளர்ச்சி மற்றும் கொள்கைகளை வழிநடத்துபவர்."
    },
    counter_sales: {
      id: "counter_sales",
      nameTa: "கவுண்டர் விற்பனை ஊழியர்கள்",
      nameEn: "Counter Sales Staff",
      roleTa: "நகை விற்பனையாளர்கள் (Sales Staff)",
      roleEn: "Showroom Jewellery Salespersons",
      badgeTitle: "💍 Jewellery Stars",
      avatar: "💍",
      theme: "theme-magenta",
      superpowerTa: "நகை விளக்கம் & வாடிக்கையாளர் மாற்றுப் பரிந்துரை",
      superpowerEn: "Jewellery Guidance & Alternate Product Suggestions",
      voiceDescTa: "கவுண்டர் விற்பனை ஊழியர்கள். வாடிக்கையாளர்களுக்கு நகைகளை காண்பித்து மாற்றுப் பொருட்களைப் பரிந்துரைப்பவர்கள்."
    },
    all_crm_staff: {
      id: "all_crm_staff",
      nameTa: "அனைத்து CRM ஊழியர்கள்",
      nameEn: "All CRM Staff (1, 2, 3, 4)",
      roleTa: "அனைத்து வரவேற்பாளர்கள் & வழிகாட்டிகள்",
      roleEn: "All Showroom Greeters & Floor Hosts",
      badgeTitle: "👥 CRM Team Unity",
      avatar: "👥",
      theme: "theme-cyan",
      superpowerTa: "ஒழுக்கம், உடனடி புகார் தெரிவிப்பு & தரவு ரகசியம்",
      superpowerEn: "Discipline, Immediate Grievance Escalation & Zero Leakage",
      voiceDescTa: "அனைத்து CRM ஊழியர்கள். ஒழுக்கத்தைக் கடைப்பிடித்து வாடிக்கையாளர் புகார்களை உடனடியாக மேலாளரிடம் தெரிவிப்பவர்கள்."
    },
    none: {
      id: "none",
      nameTa: "— யாருமில்லை (None)",
      nameEn: "— None / Not Applicable",
      roleTa: "பொருந்தாது",
      roleEn: "Not Applicable",
      badgeTitle: "⛔ None",
      avatar: "⛔",
      theme: "theme-coral",
      superpowerTa: "இந்த நிலைக்கு யாரும் ஒதுக்கப்படவில்லை",
      superpowerEn: "No team member assigned",
      voiceDescTa: "இந்த பொறுப்புக்கு யாரும் தேவை இல்லை."
    }
  };

  const STAFF_ROSTER = [
    { id: "selvi", name: "Selvi", role: "CRM Manager", avatar: "👑", level: "Level 4 • CRM Master" },
    { id: "ramya", name: "Ramya", role: "CRM Staff 1", avatar: "🌟", level: "Level 3 • Customer Champion" },
    { id: "madhumitha", name: "Madhumitha", role: "CRM Staff 2", avatar: "💎", level: "Level 2 • Experience Specialist" },
    { id: "praveen", name: "Praveen", role: "CRM Staff 3", avatar: "🚗", level: "Level 2 • Experience Specialist" },
    { id: "kaviya", name: "Kaviya", role: "CRM Staff 4", avatar: "✨", level: "Level 3 • Customer Champion" },
    { id: "saranya", name: "Saranya", role: "Telecaller Desk", avatar: "📞", level: "Level 3 • Outreach Expert" },
    { id: "sm", name: "Store Manager", role: "Showroom Head", avatar: "🏛️", level: "Level 5 • Operations Head" },
    { id: "md", name: "Managing Director", role: "Executive Leadership", avatar: "🎖️", level: "Level 5 • Strategic Leader" }
  ];

  const DEFAULT_LEADERBOARD = [
    { rank: 1, name: "Selvi", role: "CRM Manager", base: 95, bonus: 18, total: 113, status: "🏆 Legend" },
    { rank: 2, name: "Ramya", role: "CRM Staff 1", base: 90, bonus: 14, total: 104, status: "⭐ Master" },
    { rank: 3, name: "Saranya", role: "Telecaller Desk", base: 85, bonus: 12, total: 97, status: "🥇 Expert" },
    { rank: 4, name: "Kaviya", role: "CRM Staff 4", base: 80, bonus: 10, total: 90, status: "🥈 Champion" },
    { rank: 5, name: "Madhumitha", role: "CRM Staff 2", base: 75, bonus: 8, total: 83, status: "🥉 Specialist" },
    { rank: 6, name: "Praveen", role: "CRM Staff 3", base: 70, bonus: 6, total: 76, status: "Active" }
  ];

  // --------------------------------------------------------------------------
  // 2. AUDIO SYNTHESIZER & SPEECH ASSISTANT (TAMIL & ENGLISH)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'bonus') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        osc.frequency.setValueAtTime(1174.66, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'dice') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.45);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Audio Context init suppressed", e);
    }
  }

  const SpeechAssistant = {
    autoRead: false,
    speak(text, lang = 'ta-IN') {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/<[^>]*>?/gm, '').trim();
        const utter = new SpeechSynthesisUtterance(clean);
        utter.lang = lang;
        utter.rate = 0.88;
        utter.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase()));
          if (match) utter.voice = match;
        }
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn("Speech error", e);
      }
    },
    stop() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // --------------------------------------------------------------------------
  // 3. SHUFFLE UTILITY
  // --------------------------------------------------------------------------
  function shuffleArray(origArray) {
    const array = origArray.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // --------------------------------------------------------------------------
  // 4. MASTER RNR QUESTION BANK (COVERS ALL OFFICIAL DUTIES)
  // Bilingual English & Tamil • Options mapped to CARTOON HEROES
  // --------------------------------------------------------------------------
  const ALL_RNR_BANK = [
    // --- GREETER / FLOOR HOST DUTIES ---
    {
      id: "rnr_1",
      category: "greeter",
      level: 1,
      pts: 5,
      focusTag: "10-Second Welcoming SLA",
      questionTa: "வாடிக்கையாளர் கடைக்குள் நுழைந்த 10 விநாடிகளுக்குள் பணிவுடனும் அன்புடனும் இருகரம் கூப்பி (வணக்கம்) வரவேற்கும் முதன்மைப் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "Under official SVV RNR Matrix, which team member(s) is primary responsible for greeting every customer within 10 seconds of entry with a warm smile and Namaste?",
      correctStaffKey: "ramya_kaviya",
      optionsStaffKeys: ["ramya_kaviya", "selvi", "saranya", "sm"],
      explanation: "விதி 3-ன் படி: வாடிக்கையாளரை 10 விநாடிகளுக்குள் புன்னகையுடன் வரவேற்பது வரவேற்பாளர்களின் (ரம்யா & காவியா) முதன்மைப் பொறுப்பாகும்."
    },
    {
      id: "rnr_2",
      category: "greeter",
      level: 1,
      pts: 5,
      focusTag: "General Discipline & Punctuality",
      questionTa: "நியமிக்கப்பட்ட பணி நேரங்களில் தவறாமல் நேரந்தவறாமையைக் கடைப்பிடித்து, விற்பனைத் தள வாசலில் 100% இருப்பதை உறுதி செய்ய வேண்டியவர்கள் யார்?",
      questionEn: "Which team members must maintain strict punctuality and ensure 100% presence at the entrance during assigned shifts without unscheduled floor absence?",
      correctStaffKey: "ramya_kaviya",
      optionsStaffKeys: ["ramya_kaviya", "saranya", "counter_sales", "md"],
      explanation: "விதி 1-ன் படி: வரவேற்பாளர்கள் (ரம்யா & காவியா) 100% நேரந்தவறாமையுடன் நுழைவாயிலில் தவறாமல் இருக்க வேண்டும்."
    },
    {
      id: "rnr_3",
      category: "greeter",
      level: 1,
      pts: 5,
      focusTag: "Valet Welcome & Refreshments",
      questionTa: "முதியவர்கள் மற்றும் குடும்ப வாடிக்கையாளர்கள் வருகையின் போது கார் கதவு திறப்பது, வாகன நிறுத்துமிடம் வழிகாட்டுவது மற்றும் வரவேற்பு பானம்/தண்ணீர் வழங்கும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "Who is responsible for coordinating parking assistance, opening car doors warmly, and offering purified water or welcome beverage at reception?",
      correctStaffKey: "madhumitha_praveen",
      optionsStaffKeys: ["madhumitha_praveen", "saranya", "selvi", "sm"],
      explanation: "விதி 17 & 19: தரைத்தள வழிகாட்டிகள் (மதுமிதா & பிரவீன்) வாகன வரவேற்பு மற்றும் கனிவான உபசரிப்பை வழங்க வேண்டும்."
    },
    {
      id: "rnr_4",
      category: "greeter",
      level: 2,
      pts: 5,
      focusTag: "Floor Traffic & Congestion Relief",
      questionTa: "நெரிசல் மிகுந்த மாலை நேரங்கள் மற்றும் பண்டிகை நாட்களில், கவுண்டர்களுக்கு இடையே வாடிக்கையாளர்களை வழிநடத்தி கூட்டத்தை ஒழுங்குபடுத்தும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "During evening rush hours and festival seasons, who is primary responsible for guiding customer movement between counters and preventing congestion?",
      correctStaffKey: "madhumitha_praveen",
      optionsStaffKeys: ["madhumitha_praveen", "saranya", "md", "counter_sales"],
      explanation: "விதி 5 & 8: தரைத்தள வழிகாட்டிகள் (மதுமிதா & பிரவீன்) கவுண்டர்களுக்கு இடையே வாடிக்கையாளர்களை சீராக வழிநடத்துவர்."
    },
    {
      id: "rnr_5",
      category: "greeter",
      level: 2,
      pts: 5,
      focusTag: "Hourly Footfall Slot Recording",
      questionTa: "ஒவ்வொரு மணிநேர முடிவிலும் (காலை 10:00 முதல் இரவு 9:00 வரை) வருகையாளர் எண்ணிக்கையை CRM செயலியில் துல்லியமாகப் பதிவு செய்யும் முதன்மைப் பொறுப்பாளர்கள் யார்?",
      questionEn: "Who is responsible for recording the accurate hourly customer footfall count in the CRM App at the end of every hour without omission or back-entry?",
      correctStaffKey: "ramya_kaviya",
      optionsStaffKeys: ["ramya_kaviya", "selvi", "saranya", "sm"],
      explanation: "விதி 7-ன் படி: வரவேற்பாளர்கள் (ரம்யா & காவியா) ஒவ்வொரு மணிநேர வருகையாளர் எண்ணிக்கையையும் விடுபடாமல் பதிவு செய்ய வேண்டும்."
    },
    {
      id: "rnr_6",
      category: "greeter",
      level: 2,
      pts: 5,
      focusTag: "Divert Register & Primary Reason",
      questionTa: "வாடிக்கையாளர் பொருள் வாங்காமல் வெளியேறினால் (Divert), அதற்கான சரியான முதன்மைக் காரணத்தைக் குறிப்பிட்டு பதிவேட்டில் பதிவு செய்யும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "When a customer exits without purchasing, who is responsible for recording the genuine divert entry with correct primary diversion reason?",
      correctStaffKey: "madhumitha_praveen",
      optionsStaffKeys: ["madhumitha_praveen", "ramya_kaviya", "selvi", "saranya"],
      explanation: "விதி 9-ன் படி: தரைத்தள வழிகாட்டிகள் (மதுமிதா & பிரவீன்) வெளியேறும் வாடிக்கையாளரின் சரியான திசைமாற்றக் காரணத்தைப் பதிவு செய்ய வேண்டும்."
    },
    {
      id: "rnr_7",
      category: "greeter",
      level: 2,
      pts: 5,
      focusTag: "Exit Feedback Collection (≥60% Target)",
      questionTa: "பில்லிங் முடித்து வெளியேறும் இடத்தில் வாடிக்கையாளர் கருத்துப் படிவங்களைச் சேகரித்து (பில்களில் ≥60%), தினமும் இரவு 9:00 மணிக்கு மேலாளரிடம் ஒப்படைப்பவர் யார்?",
      questionEn: "Who is responsible for collecting completed customer feedback slips at exit (≥ 60% of bills) and handing over 100% of physical slips to Selvi daily at 9:00 PM?",
      correctStaffKey: "ramya_kaviya",
      optionsStaffKeys: ["ramya_kaviya", "saranya", "sm", "counter_sales"],
      explanation: "விதி 11 & 12: வரவேற்பாளர்கள் (ரம்யா & காவியா) பில்லில் குறைந்தபட்சம் 60% கருத்துப் படிவங்களைச் சேகரித்து இரவு 9:00 மணிக்கு ஒப்படைக்க வேண்டும்."
    },
    {
      id: "rnr_8",
      category: "greeter",
      level: 3,
      pts: 5,
      focusTag: "Immediate Grievance Escalation (0-Min SLA)",
      questionTa: "வாடிக்கையாளர் ஏதேனும் கடுமையான அதிருப்தி அல்லது புகார் தெரிவித்தால், வற்புறுத்தாமல் உடனடியாக 0-நிமிட காலக்கெடுவில் நிர்வாகத்திற்குத் தெரிவிக்கும் கடமை யாருக்கு உரியது?",
      questionEn: "When a customer expresses serious grievance or service dissatisfaction, what is the mandatory immediate (0-minute SLA) escalation duty of Greeters?",
      correctStaffKey: "all_crm_staff",
      optionsStaffKeys: ["all_crm_staff", "saranya", "none", "counter_sales"],
      explanation: "விதி 13-ன் படி: அனைத்து CRM ஊழியர்களும் புகார்களை வாக்குவாதம் செய்யாமல் உடனடியாக மேலாளரிடம் தெரிவிக்க வேண்டும்."
    },

    // --- MANAGER DUTIES (SELVI) ---
    {
      id: "rnr_9",
      category: "manager",
      level: 1,
      pts: 5,
      focusTag: "Daily 9:50 AM Morning Huddle",
      questionTa: "ஒவ்வொரு நாளும் காலையில் 9:50 மணிக்கு 10 நிமிட CRM ஆலோசனைக் கூட்டத்தை நடத்துவதற்கும், தோற்றத் தரநிலைகளை ஆய்வு செய்வதற்கும் யார் பொறுப்பு?",
      questionEn: "Every morning before showroom opening (9:50 AM), who conducts the mandatory 10-minute CRM huddle, checks grooming standards, and aligns daily targets?",
      correctStaffKey: "selvi",
      optionsStaffKeys: ["selvi", "ramya_kaviya", "madhumitha_praveen", "sm"],
      explanation: "மேலாளர் விதி 14: CRM மேலாளர் செல்வி காலை 9:50 மணிக்கு 10 நிமிட ஆலோசனைக் கூட்டத்தை நடத்தி ஊழியர்களுக்கு வழிகாட்ட வேண்டும்."
    },
    {
      id: "rnr_10",
      category: "manager",
      level: 2,
      pts: 5,
      focusTag: "Day End Report (DER) Evening Dispatch",
      questionTa: "தினசரி வருகை, பில்லிங் மாற்ற விகிதம், திசைமாற்றம், கருத்துகள் மற்றும் டெலிகாலிங் அடங்கிய DER அறிக்கையைத் தொகுத்து இரவு 9:30-க்குள் நிர்வாகக் குழுவில் பகிர்பவர் யார்?",
      questionEn: "Who compiles the Day End Report (DER) covering footfall, billing conversion ratio, diverts, CSI/NPS, and shares it on the management group before 9:30 PM?",
      correctStaffKey: "selvi",
      optionsStaffKeys: ["selvi", "ramya_kaviya", "saranya", "sm"],
      explanation: "மேலாளர் விதி 21: செல்வி (CRM மேலாளர்) தினசரி முடிவு அறிக்கையை (DER) இரவு 9:30-க்குள் முழுமையாகத் தொகுத்து பகிர வேண்டும்."
    },
    {
      id: "rnr_11",
      category: "manager",
      level: 3,
      pts: 5,
      focusTag: "Weekly Divert Root Cause Analysis (RCA)",
      questionTa: "திசைமாற்றத் தரவை வாராந்தம் பகுப்பாய்வு செய்து, மீண்டும் நிகழும் போக்குகளை RCA மூலம் கண்டறிந்து நிர்வாகத்திற்குத் தெரிவிக்கும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "Who conducts weekly Root Cause Analysis (RCA) on divert records, identifying recurring lost-sale patterns, and presenting solutions to Management?",
      correctStaffKey: "selvi",
      optionsStaffKeys: ["selvi", "ramya_kaviya", "saranya", "counter_sales"],
      explanation: "மேலாளர் விதி 11: CRM மேலாளர் செல்வி வாராந்திர திசைமாற்ற மூல காரணப் பகுப்பாய்வை (RCA) மேற்கொண்டு தீர்வுகளை வழங்க வேண்டும்."
    },
    {
      id: "rnr_12",
      category: "manager",
      level: 3,
      pts: 5,
      focusTag: "Monthly Staff KPI Consolidation",
      questionTa: "ஒவ்வொரு மாத முடிவிலும், அனைத்து CRM ஊழியர்களின் செயல்திறனை KPI அடிப்படையில் தொகுத்து நிர்வாக இயக்குநரிடம் சமர்ப்பிக்கும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "At the end of every operational month, who consolidates individual staff performance against official C&B KPIs for Managing Director review?",
      correctStaffKey: "selvi",
      optionsStaffKeys: ["selvi", "ramya_kaviya", "saranya", "sm"],
      explanation: "RACI செயல்முறை 16: செல்வி (CRM மேலாளர்) மாதாந்திர ஊழியர் KPI செயல்திறனைத் தொகுத்து நிர்வாக இயக்குநரிடம் சமர்ப்பிக்க வேண்டும்."
    },

    // --- TELECALLER DUTIES (SARANYA) ---
    {
      id: "rnr_13",
      category: "telecaller",
      level: 1,
      pts: 5,
      focusTag: "24-Hour Walkout Divert Callback SLA",
      questionTa: "பூர்த்தி செய்யப்படாத தேவைகளுக்காக பொருள் வாங்காமல் சென்ற வாடிக்கையாளர்களை 24 மணி நேரத்திற்குள் மீண்டும் தொலைபேசியில் அழைத்து விற்பனையை உறுதி செய்பவர் யார்?",
      questionEn: "When a customer leaves without purchase due to an unfulfilled demand, which team member must call back the customer within 24 hours to recover the sale?",
      correctStaffKey: "saranya",
      optionsStaffKeys: ["saranya", "ramya_kaviya", "selvi", "sm"],
      explanation: "டெலிகாலர் விதி 3: திசைமாறிய வாடிக்கையாளர்களை 24 மணி நேரத்திற்குள் அழைத்து விற்பனையை உறுதி செய்வது சரண்யாவின் முதன்மைக் கடமையாகும்."
    },
    {
      id: "rnr_14",
      category: "telecaller",
      level: 2,
      pts: 5,
      focusTag: "Negative Feedback (≤ 6 Rating) Recovery",
      questionTa: "வாடிக்கையாளர் 6 அல்லது அதற்குக் குறைவான மதிப்பீடு அளித்தால், 24 மணி நேரத்திற்குள் CALM வழிகாட்டியைப் பயன்படுத்தி அவர்களை அழைத்து சமாதானப்படுத்தும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "When a customer rates their experience ≤ 6 out of 10, which team member initiates empathetic recovery calling within 24 hours using the CALM framework?",
      correctStaffKey: "saranya",
      optionsStaffKeys: ["saranya", "ramya_kaviya", "madhumitha_praveen", "sm"],
      explanation: "டெலிகாலர் விதி 5: குறைவான மதிப்பீடு அளித்த வாடிக்கையாளர்களை 24 மணி நேரத்திற்குள் அழைத்து குறைகளைக் கேட்டுத் தீர்ப்பவர் சரண்யா."
    },
    {
      id: "rnr_15",
      category: "telecaller",
      level: 2,
      pts: 5,
      focusTag: "11-Month Gold Savings Chit Scheme Briefing",
      questionTa: "சீட்டுத் திட்டத்தில் சேராத வாடிக்கையாளர்களுக்கு சுப வள்ளி விலாஸ் 11 மாத தங்க சேமிப்புத் திட்டத்தின் நன்மைகளை எடுத்துக்கூறி சேர்க்கும் பொறுப்பு யாருக்கு உரியது?",
      questionEn: "For walk-in customers who answered 'No' to chit enrollment, who explains the Suba Valli Vilas 11-Month Gold Savings Scheme and guides online enrollment?",
      correctStaffKey: "saranya",
      optionsStaffKeys: ["saranya", "ramya_kaviya", "counter_sales", "md"],
      explanation: "டெலிகாலர் விதி 7: சீட்டுத் திட்டத்தில் இணையாத வாடிக்கையாளர்களுக்கு 11 மாத சேமிப்புத் திட்டத்தை அறிமுகப்படுத்துபவர் சரண்யா."
    },
    {
      id: "rnr_16",
      category: "telecaller",
      level: 3,
      pts: 5,
      focusTag: "Customer Data Privacy & Confidentiality",
      questionTa: "வாடிக்கையாளரின் தொலைபேசி எண்கள் மற்றும் வாங்குதல் விவரங்களை மிகுந்த ரகசியமாகப் பாதுகாத்து, வெளியே பகிராமல் தடுக்கும் ஒழுக்கக் கடமை யாருக்கு உரியது?",
      questionEn: "Under official CRM governance and data protection policy, who must strictly protect customer phone numbers and purchase histories within the app?",
      correctStaffKey: "saranya",
      optionsStaffKeys: ["saranya", "ramya_kaviya", "selvi", "madhumitha_praveen"],
      explanation: "டெலிகாலர் விதி 13: வாடிக்கையாளர் தொடர்பு எண்களை எக்காரணம் கொண்டும் வெளியே பகிராமல் 100% ரகசியமாகப் பாதுகாக்க வேண்டும்."
    }
  ];

  // --------------------------------------------------------------------------
  // 5. MASTER RACI BANK - ALL 17 OFFICIAL C&B PROCESSES
  // Full Bilingual Content • Exact Role Targets matching CARTOON_STAFF
  // --------------------------------------------------------------------------
  const ALL_RACI_BANK = [
    {
      id: "raci_1",
      processNumber: 1,
      level: 1,
      category: "raci",
      triggerSla: "Within 10 seconds of entry",
      processTitleTa: "செயல்முறை 1: வாடிக்கையாளரை 10 விநாடிகளுக்குள் பணிவுடன் வரவேற்று உதவி வழங்குதல்.",
      processTitleEn: "Process #1: Greet every customer within 10 seconds and offer help without being pushy.",
      r1: "ramya_kaviya",
      r2: "madhumitha_praveen",
      accountable: "selvi",
      consulted: "sm",
      informed: "none",
      explanation: "செயல்முறை 1: R1 = ரம்யா & காவியா, R2 = மதுமிதா & பிரவீன், A = செல்வி, C = கடை மேலாளர், I = யாருமில்லை."
    },
    {
      id: "raci_2",
      processNumber: 2,
      level: 1,
      category: "raci",
      triggerSla: "Continuous / Peak rush hours",
      processTitleTa: "செயல்முறை 2: நெரிசல் நேரங்களில் பிரிவுகள் மற்றும் கவுண்டர்களுக்கு இடையே வாடிக்கையாளர்களுக்கு வழிகாட்டுதல்.",
      processTitleEn: "Process #2: Guide customer movement between sections and counters, especially in peak hours.",
      r1: "ramya_kaviya",
      r2: "madhumitha_praveen",
      accountable: "selvi",
      consulted: "sm",
      informed: "none",
      explanation: "செயல்முறை 2: R1 = ரம்யா & காவியா, R2 = மதுமிதா & பிரவீன், A = செல்வி, C = கடை மேலாளர், I = யாருமில்லை."
    },
    {
      id: "raci_3",
      processNumber: 3,
      level: 1,
      category: "raci",
      triggerSla: "Hourly (10:00 AM – 9:00 PM)",
      processTitleTa: "செயல்முறை 3: மணிநேர வருகையாளர் எண்ணிக்கையை தினமும் துல்லியமாகப் பதிவு செய்தல் (விடுபடலின்றி).",
      processTitleEn: "Process #3: Record accurate hourly footfall count daily (no omission or back-entry allowed).",
      r1: "ramya_kaviya",
      r2: "madhumitha_praveen",
      accountable: "selvi",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 3: R1 = ரம்யா & காவியா, R2 = மதுமிதா & பிரவீன், A = செல்வி, C = கடை மேலாளர், I = MD."
    },
    {
      id: "raci_4",
      processNumber: 4,
      level: 2,
      category: "raci",
      triggerSla: "Daily Morning & Evening Review",
      processTitleTa: "செயல்முறை 4: தினசரி வருகையாளர் போக்குகளை ஆய்வு செய்து, இலக்கிலிருந்து விலகல்களைத் தெரிவித்தல்.",
      processTitleEn: "Process #4: Review daily footfall trends and report deviations from targets.",
      r1: "selvi",
      r2: "ramya_kaviya",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 4: R1 = செல்வி, R2 = ரம்யா, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_5",
      processNumber: 5,
      level: 1,
      category: "raci",
      triggerSla: "Real-Time (Immediate upon walkout)",
      processTitleTa: "செயல்முறை 5: திசைமாறிய வாடிக்கையாளர்களை சரியான காரணத்துடன் செயலியில் பதிவு செய்து, மாற்றுப் பரிந்துரைத்தல்.",
      processTitleEn: "Process #5: Record diverted customers in register & app with primary reason and try alternate product suggestions.",
      r1: "madhumitha_praveen",
      r2: "ramya_kaviya",
      accountable: "selvi",
      consulted: "sm",
      informed: "none",
      explanation: "செயல்முறை 5: R1 = மதுமிதா & பிரவீன், R2 = ரம்யா & காவியா, A = செல்வி, C = கடை மேலாளர், I = யாருமில்லை."
    },
    {
      id: "raci_6",
      processNumber: 6,
      level: 3,
      category: "raci",
      triggerSla: "Weekly Audit Meeting (Mondays)",
      processTitleTa: "செயல்முறை 6: திசைமாற்றத் தரவை வாராந்தம் ஆய்வு செய்து, மீண்டும் நிகழும் போக்குகளை RCA மூலம் கண்டறிதல்.",
      processTitleEn: "Process #6: Analyse divert data weekly and apply RCA to find recurring diversion patterns.",
      r1: "selvi",
      r2: "madhumitha_praveen",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 6: R1 = செல்வி, R2 = மதுமிதா, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_7",
      processNumber: 7,
      level: 2,
      category: "raci",
      triggerSla: "Continuous at Billing / Exit Gate",
      processTitleTa: "செயல்முறை 7: வாடிக்கையாளர் கருத்துகள், வீடியோ சான்றுகள் மற்றும் கூகுள் மதிப்புரைகளைப் பணிவுடன் சேகரித்தல்.",
      processTitleEn: "Process #7: Collect customer feedback, video testimonials and Google reviews politely.",
      r1: "madhumitha_praveen",
      r2: "ramya_kaviya",
      accountable: "selvi",
      consulted: "sm",
      informed: "none",
      explanation: "செயல்முறை 7: R1 = மதுமிதா & பிரவீன், R2 = ரம்யா & காவியா, A = செல்வி, C = கடை மேலாளர், I = யாருமில்லை."
    },
    {
      id: "raci_8",
      processNumber: 8,
      level: 2,
      category: "raci",
      triggerSla: "Daily 9:50 AM Morning Briefing",
      processTitleTa: "செயல்முறை 8: கருத்துகளை தினமும் ஆய்வு செய்து, ஊழியர் கூட்டத்தில் அறிக்கைகளைப் பகிர்தல்.",
      processTitleEn: "Process #8: Review feedback daily, escalate recurring complaints, and share reports for staff briefing.",
      r1: "selvi",
      r2: "sm",
      accountable: "sm",
      consulted: "sm",
      informed: "all_crm_staff",
      explanation: "செயல்முறை 8: R1 = செல்வி, R2 = கடை மேலாளர், A = கடை மேலாளர், C = ஆலோசகர், I = அனைத்து ஊழியர்கள்."
    },
    {
      id: "raci_9",
      processNumber: 9,
      level: 3,
      category: "raci",
      triggerSla: "Immediate (0-15 Minutes Escalation)",
      processTitleTa: "செயல்முறை 9: கடுமையான புகார்களை உடனடியாகத் தெரிவித்து, உடனடியாகத் தீர்க்கப்படுவதை உறுதி செய்தல்.",
      processTitleEn: "Process #9: Escalate serious complaints immediately and ensure all complaints are resolved promptly.",
      r1: "all_crm_staff",
      r2: "selvi",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 9: R1 = அனைத்து CRM ஊழியர்கள், R2 = செல்வி, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_10",
      processNumber: 10,
      level: 3,
      category: "raci",
      triggerSla: "Daily Real-Time Logging & 9:00 PM Audit",
      processTitleTa: "செயல்முறை 10: CRM செயலிப் பதிவுகளைத் துல்லியமாக வைத்து, வாடிக்கையாளர் தரவின் ரகசியத்தைக் காத்தல்.",
      processTitleEn: "Process #10: Keep CRM app entries accurate and complete, verify them daily, and protect confidentiality.",
      r1: "all_crm_staff",
      r2: "selvi",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 10: R1 = அனைத்து CRM ஊழியர்கள், R2 = செல்வி, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_11",
      processNumber: 11,
      level: 2,
      category: "raci",
      triggerSla: "Daily Calling Shift (10 AM – 7:30 PM)",
      processTitleTa: "செயல்முறை 11: டெலிகாலிங் பிரிவைக் கண்காணித்தல் – அழைப்புப் பதிவுகள், நிலை மற்றும் தொடர் நடவடிக்கைகள்.",
      processTitleEn: "Process #11: Monitor the Telecalling module – call entries, status, remarks and follow-ups.",
      r1: "saranya",
      r2: "ramya_kaviya",
      accountable: "selvi",
      consulted: "sm",
      informed: "sm",
      explanation: "செயல்முறை 11: R1 = சரண்யா, R2 = ரம்யா, A = செல்வி, C = ஆலோசகர், I = கடை மேலாளர்."
    },
    {
      id: "raci_12",
      processNumber: 12,
      level: 2,
      category: "raci",
      triggerSla: "1-2 Days Advance of Celebration",
      processTitleTa: "செயல்முறை 12: மீண்டும் வரும் வாடிக்கையாளர்களைத் தக்கவைத்து, பிறந்தநாள்/திருமணநாள் வாழ்த்து தெரிவித்தல்.",
      processTitleEn: "Process #12: Retain repeat and high-value customers; share new arrivals/offers; do birthday follow-ups.",
      r1: "saranya",
      r2: "selvi",
      accountable: "selvi",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 12: R1 = சரண்யா, R2 = செல்வி, A = செல்வி, C = கடை மேலாளர், I = MD."
    },
    {
      id: "raci_13",
      processNumber: 13,
      level: 2,
      category: "raci",
      triggerSla: "Daily before 9:30 PM Showroom Close",
      processTitleTa: "செயல்முறை 13: நாள் முடிவு அறிக்கையை (DER) ஒவ்வொரு மாலையும் தயாரித்துப் பகிர்தல்.",
      processTitleEn: "Process #13: Prepare and share the Day End Report (DER) every evening.",
      r1: "selvi",
      r2: "ramya_kaviya",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 13: R1 = செல்வி, R2 = ரம்யா, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_14",
      processNumber: 14,
      level: 1,
      category: "raci",
      triggerSla: "Daily 9:50 AM Sharp",
      processTitleTa: "செயல்முறை 14: 10 நிமிடக் குழுக் கூட்டங்களை நடத்தி, ஊழியர்களுக்குப் பயிற்சி அளித்து செயல்திறனை மதிப்பீடு செய்தல்.",
      processTitleEn: "Process #14: Conduct 10-minute team briefings, coach staff and evaluate Greeter performance.",
      r1: "selvi",
      r2: "all_crm_staff",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 14: R1 = செல்வி, R2 = அனைத்து CRM ஊழியர்கள், A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_15",
      processNumber: 15,
      level: 2,
      category: "raci",
      triggerSla: "Daily 10:00 AM Opening Inspection",
      processTitleTa: "செயல்முறை 15: VM சரிபார்ப்புப் பட்டியல் பின்பற்றப்படுவதை உறுதி செய்து காட்சியமைப்புக் கவலைகளைத் தீர்த்தல்.",
      processTitleEn: "Process #15: Ensure the VM checklist is followed and resolve display/layout concerns with VM/Operations.",
      r1: "selvi",
      r2: "ramya_kaviya",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 15: R1 = செல்வி, R2 = ரம்யா, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    },
    {
      id: "raci_16",
      processNumber: 16,
      level: 3,
      category: "raci",
      triggerSla: "Monthly Close (1st of Every Month)",
      processTitleTa: "செயல்முறை 16: ஒவ்வொரு CRM குழு உறுப்பினரின் மாதாந்திர செயல்திறனை KPI அடிப்படையில் தொகுத்தல்.",
      processTitleEn: "Process #16: Consolidate the monthly performance of each CRM team member against KPIs.",
      r1: "selvi",
      r2: "sm",
      accountable: "md",
      consulted: "sm",
      informed: "none",
      explanation: "செயல்முறை 16: R1 = செல்வி, R2 = கடை மேலாளர், A = MD (நிர்வாக இயக்குநர்), C = ஆலோசகர், I = யாருமில்லை."
    },
    {
      id: "raci_17",
      processNumber: 17,
      level: 1,
      category: "raci",
      triggerSla: "100% Floor Presence & Standards",
      processTitleTa: "செயல்முறை 17: ஒழுக்கம், தொழில்முறை நடத்தை, HR கொள்கைகள் மற்றும் CRM வழிகாட்டுதல்களைப் பின்பற்றுதல்.",
      processTitleEn: "Process #17: Follow discipline, professional conduct, HR policies and CRM guidelines.",
      r1: "all_crm_staff",
      r2: "selvi",
      accountable: "sm",
      consulted: "sm",
      informed: "md",
      explanation: "செயல்முறை 17: R1 = அனைத்து CRM ஊழியர்கள், R2 = செல்வி, A = கடை மேலாளர், C = ஆலோசகர், I = MD."
    }
  ];

  // --------------------------------------------------------------------------
  // 6. MASTER MISSIONS ENGINE
  // --------------------------------------------------------------------------
  const STORAGE_KEY = "SVV_MISSION_LEAGUE_STATE_V3";

  class SVVMissionEngine {
    constructor() {
      this.state = this.loadState();
      this.timerInterval = null;
      this.remainingSeconds = 0;
      this.currentMissionIndex = 0;
      this.battleStepIndex = 0;
      this.bossStepIndex = 0;
      this.raciMatches = {};
      this.raciProcessResults = {};
      this.rnrAnswered = {};

      this.activeRole = 'staff';
      this.activeLevel = 1;
      this.levelProgress = 0;
      this.levelTarget = 5;
      this.isRolling = false;
      this.currentModifier = null;

      this.buildAndShuffleDecks();
      this.initUI();
    }

    loadState() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn("Error parsing saved state", e);
        }
      }
      return {
        playerId: "selvi",
        baseScore: 0,
        bonusScore: 0,
        streak: 0,
        completedMissions: {},
        badges: ["Greeting Star"],
        answers: {}
      };
    }

    saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.updateHud();
    }

    resetSession() {
      if (confirm("Reset current mission progress and score? (Staff profile will remain saved)")) {
        this.state.baseScore = 0;
        this.state.bonusScore = 0;
        this.state.streak = 0;
        this.state.completedMissions = {};
        this.currentMissionIndex = 0;
        this.battleStepIndex = 0;
        this.bossStepIndex = 0;
        this.raciMatches = {};
        this.raciProcessResults = {};
        this.rnrAnswered = {};
        this.levelProgress = 0;
        this.currentModifier = null;
        this.buildAndShuffleDecks();
        this.saveState();
        this.renderMissionRibbon();
        this.loadMission(0);
        this.updateLevelMeter();
        playSound('bonus');
      }
    }

    getActivePlayer() {
      return STAFF_ROSTER.find(s => s.id === this.state.playerId) || STAFF_ROSTER[0];
    }

    updateHud() {
      const player = this.getActivePlayer();
      const nameEl = document.getElementById('hudPlayerName');
      const lvlEl = document.getElementById('hudPlayerLevel');
      const avEl = document.getElementById('hudAvatarIcon');
      const baseEl = document.getElementById('hudBaseScore');
      const bonusEl = document.getElementById('hudBonusScore');
      const streakEl = document.getElementById('hudStreak');
      const badgeEl = document.getElementById('hudBadgesCount');

      if (nameEl) nameEl.textContent = `${player.name} (${player.role.split('(')[0].trim()})`;
      if (lvlEl) lvlEl.textContent = player.level;
      if (avEl) avEl.textContent = player.avatar;
      if (baseEl) baseEl.textContent = `${this.state.baseScore} / 100`;
      if (bonusEl) bonusEl.textContent = `+${this.state.bonusScore}`;
      if (streakEl) streakEl.textContent = `🔥 ${this.state.streak}`;
      if (badgeEl) badgeEl.textContent = `🏆 ${this.state.badges ? this.state.badges.length : 0}`;
    }

    // ------------------------------------------------------------------------
    // BUILD DECKS ACCORDING TO ROLE & LEVEL
    // ------------------------------------------------------------------------
    buildAndShuffleDecks() {
      let filteredRnr = ALL_RNR_BANK.filter(q => {
        const matchesLevel = q.level === this.activeLevel;
        let matchesRole = (this.activeRole === 'all') || (q.category === this.activeRole);
        if (this.activeRole === 'staff' && q.category === 'greeter') matchesRole = true;
        return matchesLevel && matchesRole;
      });

      if (filteredRnr.length === 0) {
        filteredRnr = ALL_RNR_BANK.filter(q => q.level === this.activeLevel);
      }
      if (filteredRnr.length === 0) {
        filteredRnr = ALL_RNR_BANK.slice(0, 4);
      }

      const shuffledRnr = shuffleArray(filteredRnr).map((q, idx) => {
        const clone = Object.assign({}, q);
        clone.qNumber = idx + 1;
        clone.shuffledOptionKeys = shuffleArray(clone.optionsStaffKeys);
        return clone;
      });

      let filteredRaci = ALL_RACI_BANK.filter(p => p.level === this.activeLevel);
      if (filteredRaci.length === 0) filteredRaci = ALL_RACI_BANK.slice(0, 4);

      const shuffledRaci = shuffleArray(filteredRaci).map((p, idx) => {
        const clone = Object.assign({}, p);
        clone.processSeqNum = idx + 1;
        return clone;
      });

      this.currentRnrQuestions = shuffledRnr;
      this.currentRaciProcesses = shuffledRaci;
      this.rnrQuestionIndex = 0;
      this.raciProcessIndex = 0;
      this.rnrAnswered = {};
      this.raciProcessResults = {};
      this.raciMatches = {};
    }

    selectRole(roleId) {
      playSound('click');
      this.activeRole = roleId;

      const roles = [
        { id: 'staff', btnId: 'btnRoleStaff', label: 'CRM Staff (Greeter)' },
        { id: 'manager', btnId: 'btnRoleManager', label: 'CRM Manager' },
        { id: 'telecaller', btnId: 'btnRoleTelecaller', label: 'Telecaller Desk' },
        { id: 'all', btnId: 'btnRoleAll', label: 'Master (All Roles)' }
      ];

      roles.forEach(r => {
        const btn = document.getElementById(r.btnId);
        if (btn) {
          if (r.id === roleId) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });

      const activeObj = roles.find(r => r.id === roleId);
      const labelEl = document.getElementById('activeRoleNameLabel');
      if (labelEl && activeObj) labelEl.textContent = activeObj.label;

      this.buildAndShuffleDecks();
      this.loadMission(this.currentMissionIndex);
      this.updateLevelMeter();
    }

    selectLevel(levelNum) {
      playSound('bonus');
      this.activeLevel = levelNum;

      [1, 2, 3].forEach(lvl => {
        const btn = document.getElementById(`btnLevelTier${lvl}`);
        if (btn) {
          if (lvl === levelNum) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });

      this.levelProgress = 0;
      this.buildAndShuffleDecks();
      this.loadMission(this.currentMissionIndex);
      this.updateLevelMeter();
    }

    shuffleCurrentDeck() {
      playSound('click');
      this.buildAndShuffleDecks();
      this.loadMission(this.currentMissionIndex);

      const diceSubText = document.getElementById('diceSubText');
      if (diceSubText) {
        diceSubText.innerHTML = `🔀 <strong>Deck Reshuffled!</strong> Randomized questions and cartoon choices loaded for Level ${this.activeLevel}.`;
      }
    }

    updateLevelMeter() {
      const fillEl = document.getElementById('levelProgressFill');
      const textEl = document.getElementById('levelProgressText');
      const pct = Math.min(100, Math.round((this.levelProgress / this.levelTarget) * 100));

      if (fillEl) fillEl.style.width = `${pct}%`;
      if (textEl) textEl.textContent = `${this.levelProgress} / ${this.levelTarget} Completed (L${this.activeLevel})`;

      if (this.levelProgress >= this.levelTarget) {
        if (this.activeLevel < 3) {
          const nextLvl = this.activeLevel + 1;
          setTimeout(() => {
            playSound('bonus');
            SpeechAssistant.speak(`அற்புதம்! லெவல் ${this.activeLevel} முடிந்தது! நீங்கள் லெவல் ${nextLvl}-க்கு முன்னேறி உள்ளீர்கள்!`, 'ta-IN');
            alert(`🎉 LEVEL UP! You conquered Level ${this.activeLevel}!\nPromoted to Level ${nextLvl}!`);
            this.selectLevel(nextLvl);
          }, 800);
        }
      }
    }

    // ------------------------------------------------------------------------
    // 3D INTERACTIVE CYBER-GOLD DICE ROLL
    // ------------------------------------------------------------------------
    rollDice() {
      if (this.isRolling) return;
      this.isRolling = true;
      playSound('dice');

      const diceBox = document.getElementById('diceBoxBtn');
      const diceIcon = document.getElementById('diceFaceIcon');
      const diceHeadline = document.getElementById('diceHeadline');
      const diceBadge = document.getElementById('diceModifierBadge');
      const diceSub = document.getElementById('diceSubText');

      if (diceBox) diceBox.classList.add('rolling');

      const pips = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      let tumbleCount = 0;
      const interval = setInterval(() => {
        if (diceIcon) diceIcon.textContent = pips[Math.floor(Math.random() * pips.length)];
        tumbleCount++;
        if (tumbleCount > 6) clearInterval(interval);
      }, 90);

      setTimeout(() => {
        if (diceBox) diceBox.classList.remove('rolling');
        this.isRolling = false;

        const roll = Math.floor(Math.random() * 6) + 1;
        if (diceIcon) diceIcon.textContent = pips[roll - 1];

        if (roll === 1) {
          this.currentModifier = 'speed';
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 1: ⚡ SPEED BLITZ ACTIVE!`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-speed';
            diceBadge.textContent = '⚡ 1.5x Speed Bonus';
          }
          if (diceSub) diceSub.innerHTML = `Answer within time limit to earn double speed bonus points (+3 Pts)!`;
          this.loadMission(0);
        } else if (roll === 2) {
          this.currentModifier = null;
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 2: 🎯 RNR DUTY TEST`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-gold';
            diceBadge.textContent = 'RNR Cartoon Match';
          }
          if (diceSub) diceSub.innerHTML = `Identify the correct cartoon character for official SVV duties.`;
          this.loadMission(0);
        } else if (roll === 3) {
          this.currentModifier = null;
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 3: 📋 RACI 5-WAY MATRIX MATCH`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-raci';
            diceBadge.textContent = 'RACI 5-Way Match';
          }
          if (diceSub) diceSub.innerHTML = `Match R1, R2, A, C, I to team members across all 17 processes.`;
          this.loadMission(1);
        } else if (roll === 4) {
          this.currentModifier = null;
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 4: 🛡️ CUSTOMER BATTLE`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-gold';
            diceBadge.textContent = 'Divert Recovery';
          }
          if (diceSub) diceSub.innerHTML = `Walkout recovery scenario: Save the customer relationship!`;
          this.loadMission(2);
        } else if (roll === 5) {
          this.currentModifier = 'golden';
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 5: 💎 GOLDEN MYSTERY QUESTION!`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-gold';
            diceBadge.textContent = '💎 2x Base Points!';
          }
          if (diceSub) diceSub.innerHTML = `Golden Opportunity! Correct answer earns DOUBLE Base Points (+10 Pts)!`;
          this.loadMission(0);
        } else {
          this.currentModifier = 'boss';
          if (diceHeadline) diceHeadline.textContent = `🎲 Rolled a 6: 👑 BOSS ESCALATION CHALLENGE!`;
          if (diceBadge) {
            diceBadge.className = 'dice-modifier-pill modifier-boss';
            diceBadge.textContent = '🚨 Emergency Escalation';
          }
          if (diceSub) diceSub.innerHTML = `High-stakes bridal emergency! Execute complete resolution protocol.`;
          this.loadMission(5);
        }

        playSound('bonus');
      }, 700);
    }

    // ------------------------------------------------------------------------
    // UI INITIALIZATION
    // ------------------------------------------------------------------------
    initUI() {
      this.updateHud();
      this.renderCartoonRosterRibbon();
      this.renderStaffSelector();
      this.renderMissionRibbon();
      this.loadMission(0);
      this.updateLevelMeter();

      const btnReset = document.getElementById('btnRestartSession');
      if (btnReset) btnReset.addEventListener('click', () => this.resetSession());
    }

    // ------------------------------------------------------------------------
    // RENDER CARTOON STAFF SHOWCASE RIBBON
    // ------------------------------------------------------------------------
    renderCartoonRosterRibbon() {
      const container = document.getElementById('cartoonRosterRibbon');
      if (!container) return;

      const keys = ['selvi', 'ramya_kaviya', 'madhumitha_praveen', 'saranya', 'sm', 'md', 'counter_sales'];
      container.innerHTML = keys.map(k => {
        const s = CARTOON_STAFF[k];
        return `
          <div class="roster-mini-card" onclick="window.SVV_GAME.speakStaffVoice('${k}')" title="Click to hear ${s.nameTa}">
            <div class="roster-avatar-box">
              <span>${s.avatar}</span>
            </div>
            <div class="roster-info-box">
              <span class="roster-badge-tag">${s.badgeTitle}</span>
              <span class="roster-name-text">${s.nameTa}</span>
              <span class="roster-role-sub">${s.nameEn}</span>
            </div>
            <button class="voice-mini-btn" style="width:28px; height:28px; font-size:0.8rem;" onclick="event.stopPropagation(); window.SVV_GAME.speakStaffVoice('${k}')">🔊</button>
          </div>
        `;
      }).join('');
    }

    speakStaffVoice(staffKey) {
      const s = CARTOON_STAFF[staffKey];
      if (s) {
        playSound('click');
        SpeechAssistant.speak(`${s.nameTa}. ${s.voiceDescTa}`, 'ta-IN');
      }
    }

    speakCurrentQuestion(lang = 'ta-IN') {
      playSound('click');
      if (this.currentMissionIndex === 0) {
        const q = this.currentRnrQuestions[this.rnrQuestionIndex];
        if (!q) return;
        if (lang === 'ta-IN') {
          let text = `${q.questionTa}. உங்கள் வாய்ப்புகள்: `;
          q.shuffledOptionKeys.forEach((k, idx) => {
            const s = CARTOON_STAFF[k];
            text += `வாய்ப்பு ${idx + 1}: ${s.nameTa}. `;
          });
          SpeechAssistant.speak(text, 'ta-IN');
        } else {
          let text = `${q.questionEn}. Your choices: `;
          q.shuffledOptionKeys.forEach((k, idx) => {
            const s = CARTOON_STAFF[k];
            text += `Option ${idx + 1}: ${s.nameEn}. `;
          });
          SpeechAssistant.speak(text, 'en-IN');
        }
      } else if (this.currentMissionIndex === 1) {
        const p = this.currentRaciProcesses[this.raciProcessIndex];
        if (!p) return;
        if (lang === 'ta-IN') {
          SpeechAssistant.speak(`செயல்முறை: ${p.processTitleTa}. இதில் R1, R2, A, C, மற்றும் I பொறுப்புகளை சரியான கார்ட்டூன் நபருடன் பொருத்துங்கள்.`, 'ta-IN');
        } else {
          SpeechAssistant.speak(`Process: ${p.processTitleEn}. Match the correct team member for R1, R2, A, C, and I.`, 'en-IN');
        }
      }
    }

    stopVoice() {
      SpeechAssistant.stop();
    }

    toggleAutoVoice(checked) {
      SpeechAssistant.autoRead = checked;
      if (checked) {
        this.speakCurrentQuestion('ta-IN');
      } else {
        SpeechAssistant.stop();
      }
    }

    renderStaffSelector() {
      const list = document.getElementById('staffSelectList');
      if (!list) return;
      list.innerHTML = STAFF_ROSTER.map(s => `
        <div class="staff-card ${s.id === this.state.playerId ? 'selected' : ''}" onclick="window.SVV_GAME.switchPlayer('${s.id}')">
          <div style="font-size:2rem; margin-bottom:6px;">${s.avatar}</div>
          <div style="font-weight:800; color:#FFFFFF; font-size:1rem;">${s.name}</div>
          <div style="font-size:0.75rem; color:var(--game-champagne);">${s.role}</div>
        </div>
      `).join('');
    }

    switchPlayer(playerId) {
      this.state.playerId = playerId;
      this.saveState();
      this.updateHud();
      this.renderStaffSelector();
      const modal = document.getElementById('modalPlayerSelector');
      if (modal) modal.classList.remove('active');
      playSound('click');
    }

    renderMissionRibbon() {
      const ribbon = document.getElementById('missionRibbon');
      if (!ribbon) return;

      const titles = [
        { num: 1, title: "Mission Start", pts: 20 },
        { num: 2, title: "Role Match", pts: 20 },
        { num: 3, title: "Customer Battle", pts: 20 },
        { num: 4, title: "KPI Challenge", pts: 15 },
        { num: 5, title: "CRM Detective", pts: 15 },
        { num: 6, title: "Final Boss", pts: 15 }
      ];

      ribbon.innerHTML = titles.map((m, idx) => {
        const isDone = !!this.state.completedMissions[`m${m.num}`];
        const isActive = idx === this.currentMissionIndex;
        return `
          <div class="mission-node ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" onclick="window.SVV_GAME.loadMission(${idx})">
            <div class="mission-node-num">M0${m.num} ${isDone ? '✓' : ''}</div>
            <div class="mission-node-title">${m.title}</div>
            <div class="mission-node-pts">${m.pts} Pts</div>
          </div>
        `;
      }).join('');
    }

    startTimer(seconds) {
      clearInterval(this.timerInterval);
      this.remainingSeconds = seconds;
      const clockEl = document.getElementById('stageTimerClock');
      if (!clockEl) return;

      const updateClock = () => {
        clockEl.textContent = `⏱️ 00:${String(this.remainingSeconds).padStart(2, '0')}s`;
        if (this.remainingSeconds <= 5) clockEl.classList.add('pulse-danger');
        else clockEl.classList.remove('pulse-danger');
      };

      updateClock();
      this.timerInterval = setInterval(() => {
        this.remainingSeconds--;
        if (this.remainingSeconds <= 0) {
          clearInterval(this.timerInterval);
          this.remainingSeconds = 0;
          updateClock();
        } else {
          updateClock();
        }
      }, 1000);
    }

    loadMission(index) {
      if (index < 0 || index > 5) return;
      this.currentMissionIndex = index;
      this.renderMissionRibbon();
      const stage = document.getElementById('missionStage');
      if (!stage) return;

      let innerContent = "";
      let category = "";
      let maxPts = 20;
      let timeLimit = 35;
      let headline = "";
      let scenario = "";

      if (index === 0) {
        category = `RNR • Level ${this.activeLevel} • Cartoon Heroes Selection`;
        maxPts = 20;
        timeLimit = 30;
        headline = "MISSION 01: RNR Duty Assignment (Select the Staff Cartoon)";
        scenario = "Identify the correct staff cartoon character responsible for each official SVV duty below.";
        innerContent = this.renderSingleChoice();
      } else if (index === 1) {
        category = `RACI/101 • 5-Way Matrix Matching (All 17 Processes)`;
        maxPts = 20;
        timeLimit = 45;
        headline = "MISSION 02: RACI Cartoon Matching (Match R1, R2, A, C, I)";
        scenario = "Match each RACI role (Doer, Helper, Boss Owner, Advisor, Informed) to the correct staff cartoon character.";
        innerContent = this.renderRaciMatch();
      } else if (index === 2) {
        category = "Divert Management • 4 Decision Steps";
        maxPts = 20;
        timeLimit = 35;
        headline = "MISSION 03: The Lost Sale & Divert Recovery";
        scenario = "A customer visits Suba Valli Vilas to purchase an out-of-stock 22K antique bridal necklace. Navigate the 4-step decision sequence to save the customer relationship.";
        innerContent = this.renderBranchingBattle();
      } else if (index === 3) {
        category = "KPI & Benchmarks • Calculations";
        maxPts = 15;
        timeLimit = 30;
        headline = "MISSION 04: Target Hunter – Calculate & Improve";
        scenario = "Evaluate monthly showroom metrics (Feedbacks Collected = 65/100, Google Reviews = 12/15) and pick the right management action.";
        innerContent = this.renderKpiMath();
      } else if (index === 4) {
        category = "Audit & Compliance • Error Hunting";
        maxPts = 15;
        timeLimit = 25;
        headline = "MISSION 05: Spot the Operational Error";
        scenario = "Examine the three showroom records below and click on the dossier that contains a serious procedural violation.";
        innerContent = this.renderDetective();
      } else if (index === 5) {
        category = "Boss Battle • Emergency Escalation";
        maxPts = 15;
        timeLimit = 40;
        headline = "MISSION 06: The Agitated Bridal Customer";
        scenario = "FINAL BOSS: An agitated wedding customer arrives because their bridal clasp was sized incorrectly 24 hours before their ceremony. Execute the complete emergency protocol.";
        innerContent = this.renderFinalBoss();
      }

      stage.innerHTML = `
        <div class="stage-hdr">
          <div class="stage-badge-group">
            <span class="stage-pill stage-pill-rnr">${category}</span>
            <span class="stage-pill stage-pill-pts">+${maxPts} Base Pts</span>
            ${this.currentModifier === 'golden' ? '<span class="stage-pill" style="background:rgba(255,215,0,0.3); color:var(--game-gold); border:1.5px solid var(--game-gold);">💎 2X GOLDEN MULTIPLIER ACTIVE!</span>' : ''}
            ${this.currentModifier === 'speed' ? '<span class="stage-pill" style="background:rgba(0,240,255,0.3); color:var(--game-neon-cyan); border:1.5px solid var(--game-neon-cyan);">⚡ SPEED BLITZ ACTIVE!</span>' : ''}
          </div>
          <div class="stage-timer-wrap">
            <span class="stage-timer-clock" id="stageTimerClock">⏱️ 00:${String(timeLimit).padStart(2, '0')}s</span>
          </div>
        </div>

        <h2 class="scenario-headline">${headline}</h2>
        <p class="scenario-subhead">${scenario}</p>

        <!-- VOICE ASSISTANT BAR -->
        <div class="voice-assistant-bar">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">🔊</span>
            <span style="font-weight:800; font-size:0.86rem; color:var(--game-gold);">குரல் உதவி (Voice Help):</span>
          </div>
          <button class="voice-btn voice-btn-ta" onclick="window.SVV_GAME.speakCurrentQuestion('ta-IN')">
            🔊 தமிழில் கேளுங்கள் (Listen Tamil)
          </button>
          <button class="voice-btn voice-btn-en" onclick="window.SVV_GAME.speakCurrentQuestion('en-IN')">
            🔊 Listen in English
          </button>
          <button class="voice-btn voice-btn-stop" onclick="window.SVV_GAME.stopVoice()">
            ⏹️ நிறுத்து (Stop)
          </button>
          <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:#CBD5E1; cursor:pointer; margin-left:auto;">
            <input type="checkbox" id="autoVoiceCheck" ${SpeechAssistant.autoRead ? 'checked' : ''} onchange="window.SVV_GAME.toggleAutoVoice(this.checked)">
            தானாக படிக்க (Auto-Read)
          </label>
        </div>

        <div id="missionInteractiveArea">
          ${innerContent}
        </div>

        <div class="feedback-banner" id="stageFeedbackBanner"></div>

        <div class="stage-actions">
          <button class="btn-game btn-game-outline" onclick="window.SVV_GAME.loadMission(${Math.max(0, index - 1)})">◄ Previous Mission</button>
          <button class="btn-game btn-game-gold" id="btnNextMission" onclick="window.SVV_GAME.advanceMission()">Next Mission ►</button>
        </div>
      `;

      this.startTimer(timeLimit);

      if (SpeechAssistant.autoRead) {
        setTimeout(() => this.speakCurrentQuestion('ta-IN'), 300);
      }
    }

    // ------------------------------------------------------------------------
    // MODE 1: SINGLE CHOICE (CARTOON HERO CARDS SELECTION)
    // ------------------------------------------------------------------------
    renderSingleChoice() {
      this.rnrQuestionIndex = this.rnrQuestionIndex || 0;
      if (this.rnrQuestionIndex >= this.currentRnrQuestions.length) this.rnrQuestionIndex = 0;
      this.rnrAnswered = this.rnrAnswered || {};

      const q = this.currentRnrQuestions[this.rnrQuestionIndex];
      const prevAnswer = this.rnrAnswered[q.id];

      // Stepper
      const stepper = `
        <div class="quiz-stepper">
          ${this.currentRnrQuestions.map((item, idx) => {
            const isCurrent = idx === this.rnrQuestionIndex;
            const ans = this.rnrAnswered[item.id];
            const isCorrect = ans && ans.isCorrect;
            return `
              <div class="quiz-step-pill ${isCurrent ? 'active' : ''} ${ans ? (isCorrect ? 'completed' : 'active') : ''}" onclick="window.SVV_GAME.switchRnrQuestion(${idx})">
                <span>${ans ? (isCorrect ? '✓' : '✗') : (idx + 1)}</span>
                <span>Q${item.qNumber}: ${item.focusTag}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Bilingual Question Card
      const qCard = `
        <div class="bilingual-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <span class="stage-pill stage-pill-rnr">🎯 ${q.focusTag}</span>
            <span style="font-family:var(--font-game); font-size:0.88rem; color:var(--game-gold); font-weight:800;">
              Question ${q.qNumber} of ${this.currentRnrQuestions.length} • +${q.pts} Base Pts
            </span>
          </div>
          <div class="bilingual-ta">${q.questionTa}</div>
          <div class="bilingual-en">${q.questionEn}</div>
        </div>
      `;

      // Cartoon Option Cards Grid
      const choices = `
        <div class="cartoon-choices-grid">
          ${q.shuffledOptionKeys.map((staffKey, i) => {
            const s = CARTOON_STAFF[staffKey];
            const isMatch = staffKey === q.correctStaffKey;
            let extraClass = "";
            if (prevAnswer) {
              if (isMatch) extraClass = "correct";
              else if (prevAnswer.selectedKey === staffKey) extraClass = "incorrect";
            }
            return `
              <div class="cartoon-card ${s.theme} ${extraClass}" id="cartoon_opt_${staffKey}" onclick="window.SVV_GAME.submitCartoonChoice('${staffKey}')">
                <div class="cartoon-avatar-box">
                  <span>${s.avatar}</span>
                </div>
                <div class="cartoon-content">
                  <div class="cartoon-badge-pill">${s.badgeTitle}</div>
                  <div class="cartoon-name-ta">${s.nameTa}</div>
                  <div class="cartoon-name-en">${s.roleEn}</div>
                  <div class="cartoon-power-desc">⚡ ${s.superpowerTa}</div>
                </div>
                <button class="voice-mini-btn" title="கேட்கவும் (Listen)" onclick="event.stopPropagation(); window.SVV_GAME.speakStaffVoice('${staffKey}')">
                  🔊
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;

      let nextActionHtml = "";
      if (prevAnswer) {
        if (this.rnrQuestionIndex < this.currentRnrQuestions.length - 1) {
          nextActionHtml = `
            <div style="text-align:center; margin-top:20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.nextRnrQuestion()" style="padding:12px 28px; box-shadow:0 0 18px rgba(255,215,0,0.4);">
                அடுத்த கேள்வி (Next Question ${q.qNumber + 1}) ➔
              </button>
            </div>
          `;
        } else {
          nextActionHtml = `
            <div style="text-align:center; margin-top:20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.advanceMission()" style="padding:12px 28px; box-shadow:0 0 18px rgba(255,215,0,0.4);">
                லெவல் ${this.activeLevel} முடிந்தது! Mission 02 (RACI) தொடரவும் ►
              </button>
            </div>
          `;
        }
      }

      return `
        ${stepper}
        ${qCard}
        ${choices}
        <div id="rnrNextBtnArea">${nextActionHtml}</div>
      `;
    }

    submitCartoonChoice(selectedStaffKey) {
      const q = this.currentRnrQuestions[this.rnrQuestionIndex];
      if (this.rnrAnswered && this.rnrAnswered[q.id]) return;

      const isCorrect = selectedStaffKey === q.correctStaffKey;
      if (!this.rnrAnswered) this.rnrAnswered = {};
      this.rnrAnswered[q.id] = { selectedKey: selectedStaffKey, isCorrect };

      q.shuffledOptionKeys.forEach(k => {
        const el = document.getElementById(`cartoon_opt_${k}`);
        if (el) {
          if (k === q.correctStaffKey) el.classList.add('correct');
          else if (k === selectedStaffKey) el.classList.add('incorrect');
        }
      });

      let earnedPts = q.pts;
      if (this.currentModifier === 'golden') earnedPts *= 2;

      let speedBonus = 0;
      if (isCorrect) {
        if (this.remainingSeconds >= 15) speedBonus = this.currentModifier === 'speed' ? 3 : 1;
        playSound('bonus');
        this.state.streak++;
        this.addScore(earnedPts, speedBonus);
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak(`அற்புதம்! சரியானது! ${CARTOON_STAFF[q.correctStaffKey].nameTa}.`, 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
        SpeechAssistant.speak(`தவறான தேர்வு. சரியான நபர்: ${CARTOON_STAFF[q.correctStaffKey].nameTa}.`, 'ta-IN');
      }
      this.saveState();

      const banner = document.getElementById('stageFeedbackBanner');
      if (banner) {
        banner.className = `feedback-banner show ${isCorrect ? 'correct' : 'incorrect'}`;
        banner.innerHTML = `
          <div class="feedback-title">${isCorrect ? `🎉 சரியானது! (+${earnedPts} Base Pts${speedBonus > 0 ? ` · +${speedBonus} Speed Bonus ⚡` : ''})` : '⚠️ தவறான தேர்வு'}</div>
          <div class="feedback-desc">${q.explanation}</div>
        `;
      }

      const allDone = this.currentRnrQuestions.every(item => this.rnrAnswered[item.id]);
      if (allDone) {
        this.unlockBadge("Greeting Star");
        this.finishMission('m1');
      }

      const nextBtnContainer = document.getElementById('rnrNextBtnArea');
      if (nextBtnContainer) {
        if (this.rnrQuestionIndex < this.currentRnrQuestions.length - 1) {
          nextBtnContainer.innerHTML = `
            <div style="text-align:center; margin-top:20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.nextRnrQuestion()" style="padding:12px 28px; box-shadow:0 0 18px rgba(255,215,0,0.4);">
                அடுத்த கேள்வி (Next Question ${q.qNumber + 1}) ➔
              </button>
            </div>
          `;
        } else {
          nextBtnContainer.innerHTML = `
            <div style="text-align:center; margin-top:20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.advanceMission()" style="padding:12px 28px; box-shadow:0 0 18px rgba(255,215,0,0.4);">
                அனைத்து கேள்விகளும் முடிந்தது! Mission 02 (RACI) தொடரவும் ►
              </button>
            </div>
          `;
        }
      }
    }

    nextRnrQuestion() {
      if (this.rnrQuestionIndex < this.currentRnrQuestions.length - 1) {
        this.rnrQuestionIndex++;
        this.loadMission(0);
      }
    }

    switchRnrQuestion(idx) {
      this.rnrQuestionIndex = idx;
      this.loadMission(0);
    }

    // ------------------------------------------------------------------------
    // MODE 2: RACI 5-WAY CARTOON MATCHING METHOD (ALL 17 PROCESSES)
    // ------------------------------------------------------------------------
    renderRaciMatch() {
      this.raciProcessIndex = this.raciProcessIndex || 0;
      if (this.raciProcessIndex >= this.currentRaciProcesses.length) this.raciProcessIndex = 0;
      this.raciProcessResults = this.raciProcessResults || {};
      this.raciMatches = {};

      const proc = this.currentRaciProcesses[this.raciProcessIndex];
      const prevResult = this.raciProcessResults[proc.id];

      // Stepper
      const stepper = `
        <div class="quiz-stepper">
          ${this.currentRaciProcesses.map((p, idx) => {
            const isCurrent = idx === this.raciProcessIndex;
            const res = this.raciProcessResults[p.id];
            const isAllCorrect = res && res.isAllCorrect;
            return `
              <div class="quiz-step-pill ${isCurrent ? 'active' : ''} ${res ? (isAllCorrect ? 'completed' : 'active') : ''}" onclick="window.SVV_GAME.switchRaciProcess(${idx})">
                <span>${res ? (isAllCorrect ? '✓' : '!') : (idx + 1)}</span>
                <span>செயல்முறை ${p.processNumber}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Process Box
      const procBox = `
        <div class="bilingual-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <span class="stage-pill stage-pill-rnr">⏱️ SLA: ${proc.triggerSla}</span>
            <span style="font-family:var(--font-game); font-size:0.88rem; color:var(--game-gold); font-weight:800;">
              செயல்முறை ${proc.processNumber} of 17 • 5 கார்ட்டூன் பொறுப்புகளை பொருத்துங்கள்
            </span>
          </div>
          <div class="bilingual-ta">${proc.processTitleTa}</div>
          <div class="bilingual-en">${proc.processTitleEn}</div>
        </div>
      `;

      // 5 RACI Role Definitions
      const raciRolesDef = [
        { key: "r1", code: "R1", nameTa: "முதன்மைப் பொறுப்பாளர் (Primary Doer 🏃‍♂️)", nameEn: "Floor Logger / Actual Doer", targetKey: proc.r1, pillClass: "role-code-r1", subTa: "யார் வேலையை நேரடியாக செய்ய வேண்டும்?" },
        { key: "r2", code: "R2", nameTa: "துணைப் பொறுப்பாளர் (Support Helper 🤝)", nameEn: "Support & Backup Assistant", targetKey: proc.r2, pillClass: "role-code-r2", subTa: "யார் உதவியாக நிற்க வேண்டும்?" },
        { key: "accountable", code: "A", nameTa: "முழுப் பொறுப்பான மேலாளர் (Accountable Owner 👑)", nameEn: "Accountable Boss Owner", targetKey: proc.accountable, pillClass: "role-code-a", subTa: "யார் இறுதிப் பொறுப்பு ஏற்க வேண்டும்?" },
        { key: "consulted", code: "C", nameTa: "ஆலோசகர் (Consulted Advisor 💡)", nameEn: "Consulted Advisor", targetKey: proc.consulted, pillClass: "role-code-c", subTa: "யாரிடம் ஆலோசனை கேட்க வேண்டும்?" },
        { key: "informed", code: "I", nameTa: "தகவல் பெறுபவர் (Informed Stakeholder 📢)", nameEn: "Informed Stakeholder", targetKey: proc.informed, pillClass: "role-code-i", subTa: "யாருக்கு தகவல் தெரிவிக்க வேண்டும்?" }
      ];

      // Eligible Staff Keys for Dropdown
      const candidateKeys = ['ramya_kaviya', 'madhumitha_praveen', 'selvi', 'saranya', 'sm', 'md', 'all_crm_staff', 'none'];

      // Rows
      const rows = `
        <div class="raci-cartoon-board">
          ${raciRolesDef.map(role => {
            let rowClass = "";
            let fbText = "";
            let fbColor = "";
            let selectedVal = "";
            let isDisabled = false;

            if (prevResult) {
              isDisabled = true;
              selectedVal = prevResult.matches[role.key] || "";
              const isMatch = selectedVal === role.targetKey;
              const targetStaff = CARTOON_STAFF[role.targetKey];
              if (isMatch) {
                rowClass = "match-correct";
                fbText = `✓ சரியானது! (${targetStaff ? targetStaff.nameTa : ''})`;
                fbColor = "var(--game-neon-green)";
              } else {
                rowClass = "match-incorrect";
                fbText = `✗ தவறு! சரியான கார்ட்டூன்: <strong>${targetStaff ? `${targetStaff.avatar} ${targetStaff.nameTa}` : ''}</strong>`;
                fbColor = "var(--game-neon-red)";
              }
            }

            return `
              <div class="raci-cartoon-row ${rowClass}" id="raciRow_${role.key}">
                <div class="raci-role-badge-box">
                  <div class="role-code-pill ${role.pillClass}">${role.code}</div>
                  <div>
                    <div class="role-title-ta">${role.nameTa}</div>
                    <div class="role-title-en">${role.subTa}</div>
                  </div>
                </div>

                <div class="match-connector">➔</div>

                <div>
                  <select class="raci-cartoon-select" id="raciSelect_${role.key}" ${isDisabled ? 'disabled' : ''} onchange="window.SVV_GAME.onRaciCartoonSelect('${role.key}', this.value)">
                    <option value="">-- ${role.code} கார்ட்டூனைத் தேர்ந்தெடுக்கவும் --</option>
                    ${candidateKeys.map(k => {
                      const s = CARTOON_STAFF[k];
                      return `
                        <option value="${k}" ${selectedVal === k ? 'selected' : ''}>
                          ${s.avatar} ${s.nameTa} (${s.nameEn})
                        </option>
                      `;
                    }).join('')}
                  </select>
                  <div class="match-feedback-tag" id="raciFeedback_${role.key}" style="color:${fbColor}; margin-top:6px; font-weight:800; font-size:0.88rem;">${fbText}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      let actionBtn = "";
      if (!prevResult) {
        actionBtn = `
          <div style="text-align: center; margin-top: 20px;">
            <button class="btn-game btn-game-gold" id="btnSubmitRaciMatch" onclick="window.SVV_GAME.verifyRaciMatching()" style="padding: 14px 32px; font-size: 1.05rem; box-shadow:0 0 20px rgba(255,215,0,0.45);">
              ⚡ கார்ட்டூன்களை சரிபார் (Lock RACI Matches & Check)
            </button>
          </div>
        `;
      } else {
        if (this.raciProcessIndex < this.currentRaciProcesses.length - 1) {
          actionBtn = `
            <div style="text-align: center; margin-top: 20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.nextRaciProcess()" style="padding: 12px 28px; font-size: 1rem; box-shadow:0 0 16px rgba(255,215,0,0.3);">
                அடுத்த செயல்முறை (Process ${proc.processSeqNum + 1}) ➔
              </button>
            </div>
          `;
        } else {
          actionBtn = `
            <div style="text-align: center; margin-top: 20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.advanceMission()" style="padding: 12px 28px; font-size: 1rem; box-shadow:0 0 16px rgba(255,215,0,0.3);">
                அனைத்து செயல்முறைகளும் பொருந்தின! Mission 03 தொடரவும் ►
              </button>
            </div>
          `;
        }
      }

      return `
        ${stepper}
        ${procBox}
        ${rows}
        <div id="raciActionArea">${actionBtn}</div>
      `;
    }

    onRaciCartoonSelect(roleKey, selectedStaffKey) {
      playSound('click');
      if (!this.raciMatches) this.raciMatches = {};
      this.raciMatches[roleKey] = selectedStaffKey;

      const row = document.getElementById(`raciRow_${roleKey}`);
      const fb = document.getElementById(`raciFeedback_${roleKey}`);
      if (row) row.classList.remove('match-correct', 'match-incorrect');
      if (fb) fb.innerHTML = '';
    }

    verifyRaciMatching() {
      const proc = this.currentRaciProcesses[this.raciProcessIndex];
      const rolesKeys = ["r1", "r2", "accountable", "consulted", "informed"];
      let allAnswered = true;
      let correctMatches = 0;

      rolesKeys.forEach(k => {
        const sel = (this.raciMatches && this.raciMatches[k]) || '';
        if (!sel) allAnswered = false;
      });

      if (!allAnswered) {
        SpeechAssistant.speak("தயவுசெய்து அனைத்து 5 நிலைகளுக்கும் கார்ட்டூனைத் தேர்ந்தெடுக்கவும்.", 'ta-IN');
        alert("Please match a cartoon character for all 5 roles (R1, R2, A, C, I) before submitting!");
        return;
      }

      const submitBtn = document.getElementById('btnSubmitRaciMatch');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }

      rolesKeys.forEach(k => {
        const selectEl = document.getElementById(`raciSelect_${k}`);
        if (selectEl) selectEl.disabled = true;

        const selectedVal = (this.raciMatches && this.raciMatches[k]) || '';
        const targetVal = proc[k];
        const isMatch = selectedVal === targetVal;
        const row = document.getElementById(`raciRow_${k}`);
        const fb = document.getElementById(`raciFeedback_${k}`);
        const targetStaff = CARTOON_STAFF[targetVal];

        if (isMatch) {
          correctMatches++;
          if (row) row.classList.add('match-correct');
          if (fb) {
            fb.style.color = 'var(--game-neon-green)';
            fb.innerHTML = `✓ சரியானது! (${targetStaff ? targetStaff.nameTa : ''})`;
          }
        } else {
          if (row) row.classList.add('match-incorrect');
          if (fb) {
            fb.style.color = 'var(--game-neon-red)';
            fb.innerHTML = `✗ தவறு! சரியான கார்ட்டூன்: <strong>${targetStaff ? `${targetStaff.avatar} ${targetStaff.nameTa}` : ''}</strong>`;
          }
        }
      });

      const isAllCorrect = correctMatches === 5;
      let earnedBasePoints = correctMatches;
      if (this.currentModifier === 'golden') earnedBasePoints *= 2;

      if (!this.raciProcessResults) this.raciProcessResults = {};
      this.raciProcessResults[proc.id] = {
        matches: Object.assign({}, this.raciMatches),
        correctMatches,
        isAllCorrect
      };

      let speedBonus = 0;
      if (isAllCorrect) {
        if (this.remainingSeconds >= 20) speedBonus = this.currentModifier === 'speed' ? 3 : 1;
        playSound('bonus');
        this.state.streak++;
        this.addScore(earnedBasePoints, speedBonus);
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak("அற்புதம்! 5-க்கு 5 சரியான பொருத்தங்கள்!", 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
        if (earnedBasePoints > 0) this.addScore(earnedBasePoints, 0);
        SpeechAssistant.speak(`நன்றாக முயற்சித்தீர்கள்! ${correctMatches} பொருத்தங்கள் சரியானவை.`, 'ta-IN');
      }
      this.saveState();

      const banner = document.getElementById('stageFeedbackBanner');
      if (banner) {
        banner.className = `feedback-banner show ${isAllCorrect ? 'correct' : (earnedBasePoints > 0 ? 'correct' : 'incorrect')}`;
        banner.innerHTML = `
          <div class="feedback-title">
            ${isAllCorrect ? `🎉 Perfect 5/5 Matches! (+${earnedBasePoints} Base Pts${speedBonus > 0 ? ` · +${speedBonus} Speed Bonus ⚡` : ''})` : (earnedBasePoints > 0 ? `👍 Good Effort! (${correctMatches}/5 Matches Correct · +${earnedBasePoints} Pts Earned)` : '⚠️ Incorrect Role Matches')}
          </div>
          <div class="feedback-desc">${proc.explanation}</div>
        `;
      }

      const allDone = this.currentRaciProcesses.every(p => this.raciProcessResults[p.id]);
      if (allDone) {
        this.unlockBadge("RACI Master");
        this.finishMission('m2');
      }

      const actionArea = document.getElementById('raciActionArea');
      if (actionArea) {
        if (this.raciProcessIndex < this.currentRaciProcesses.length - 1) {
          actionArea.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.nextRaciProcess()" style="padding: 12px 28px; font-size: 1rem; box-shadow:0 0 16px rgba(255,215,0,0.3);">
                அடுத்த செயல்முறை (Process ${proc.processSeqNum + 1}) ➔
              </button>
            </div>
          `;
        } else {
          actionArea.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
              <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.advanceMission()" style="padding: 12px 28px; font-size: 1rem; box-shadow:0 0 16px rgba(255,215,0,0.3);">
                அனைத்து செயல்முறைகளும் முடிந்தது! Mission 03 தொடரவும் ►
              </button>
            </div>
          `;
        }
      }
    }

    nextRaciProcess() {
      if (this.raciProcessIndex < this.currentRaciProcesses.length - 1) {
        this.raciProcessIndex++;
        this.raciMatches = {};
        this.loadMission(1);
      }
    }

    switchRaciProcess(idx) {
      this.raciProcessIndex = idx;
      this.raciMatches = {};
      this.loadMission(1);
    }

    // ------------------------------------------------------------------------
    // ALL QUESTIONS DIRECTORY DRAWER (BROWSE ALL 55+ QUESTIONS)
    // ------------------------------------------------------------------------
    renderAllQuestionsDrawer(filterCategory = 'all') {
      const container = document.getElementById('drawerQuestionsList');
      if (!container) return;

      let rnrList = ALL_RNR_BANK;
      let raciList = ALL_RACI_BANK;

      if (filterCategory === 'greeter') {
        rnrList = ALL_RNR_BANK.filter(q => q.category === 'greeter');
        raciList = [];
      } else if (filterCategory === 'manager') {
        rnrList = ALL_RNR_BANK.filter(q => q.category === 'manager');
        raciList = [];
      } else if (filterCategory === 'telecaller') {
        rnrList = ALL_RNR_BANK.filter(q => q.category === 'telecaller');
        raciList = [];
      } else if (filterCategory === 'raci') {
        rnrList = [];
        raciList = ALL_RACI_BANK;
      }

      let html = '';

      if (rnrList.length > 0) {
        html += `<div style="font-weight:900; color:var(--game-gold); font-size:1rem; margin:10px 0 6px 0;">🎯 RNR Duty Questions (${rnrList.length})</div>`;
        rnrList.forEach((q, idx) => {
          const s = CARTOON_STAFF[q.correctStaffKey];
          html += `
            <div class="q-drawer-item" onclick="window.SVV_GAME.jumpToRnrQuestion('${q.id}')">
              <div style="flex:1;">
                <div style="font-size:0.75rem; color:var(--game-champagne); font-weight:800; text-transform:uppercase;">
                  Q${idx + 1} • Level ${q.level} • ${q.focusTag}
                </div>
                <div style="font-weight:700; color:#FFFFFF; font-size:0.92rem; margin-top:2px;">${q.questionTa}</div>
              </div>
              <div style="text-align:right;">
                <span class="stage-pill stage-pill-rnr">${s ? s.avatar : ''} ${s ? s.nameTa : ''}</span>
              </div>
            </div>
          `;
        });
      }

      if (raciList.length > 0) {
        html += `<div style="font-weight:900; color:#00F0FF; font-size:1rem; margin:16px 0 6px 0;">📋 RACI Processes (1 to 17)</div>`;
        raciList.forEach(p => {
          const r1Staff = CARTOON_STAFF[p.r1];
          html += `
            <div class="q-drawer-item" onclick="window.SVV_GAME.jumpToRaciProcess('${p.id}')">
              <div style="flex:1;">
                <div style="font-size:0.75rem; color:#00F0FF; font-weight:800; text-transform:uppercase;">
                  Process #${p.processNumber} • SLA: ${p.triggerSla}
                </div>
                <div style="font-weight:700; color:#FFFFFF; font-size:0.92rem; margin-top:2px;">${p.processTitleTa}</div>
              </div>
              <div style="text-align:right;">
                <span class="stage-pill" style="background:rgba(0,240,255,0.2); border:1px solid #00F0FF; color:#00F0FF;">R1: ${r1Staff ? r1Staff.nameTa : ''}</span>
              </div>
            </div>
          `;
        });
      }

      container.innerHTML = html;
    }

    filterQuestionsDrawer(cat, btn) {
      playSound('click');
      const tabs = document.querySelectorAll('.q-tab-btn');
      tabs.forEach(t => t.classList.remove('active'));
      if (btn) btn.classList.add('active');
      this.renderAllQuestionsDrawer(cat);
    }

    jumpToRnrQuestion(qId) {
      const q = ALL_RNR_BANK.find(item => item.id === qId);
      if (q) {
        const modal = document.getElementById('modalAllQuestions');
        if (modal) modal.classList.remove('active');
        this.activeLevel = q.level;
        this.selectLevel(q.level);
        const idx = this.currentRnrQuestions.findIndex(item => item.id === qId);
        if (idx !== -1) this.rnrQuestionIndex = idx;
        this.loadMission(0);
        playSound('bonus');
      }
    }

    jumpToRaciProcess(pId) {
      const p = ALL_RACI_BANK.find(item => item.id === pId);
      if (p) {
        const modal = document.getElementById('modalAllQuestions');
        if (modal) modal.classList.remove('active');
        this.activeLevel = p.level;
        this.selectLevel(p.level);
        const idx = this.currentRaciProcesses.findIndex(item => item.id === pId);
        if (idx !== -1) this.raciProcessIndex = idx;
        this.loadMission(1);
        playSound('bonus');
      }
    }

    // ------------------------------------------------------------------------
    // MODES 3 TO 6 (CUSTOMER BATTLE, KPI, DETECTIVE, BOSS)
    // ------------------------------------------------------------------------
    renderBranchingBattle() {
      const battleSteps = [
        {
          step: 1, pts: 5,
          qTa: "படி 1: வாடிக்கையாளர் கேட்ட குறிப்பிட்ட நெக்லஸ் தட்டில் இல்லை. உங்கள் உடனடி நடவடிக்கை என்ன?",
          qEn: "The requested bridal necklace isn't in the tray. What is your immediate action?",
          options: [
            { text: "கவுண்டரில் உள்ள 2-3 ஒத்த கைவினை ஆன்டிக் நெக்லஸ்களை புன்னகையுடன் காட்டுதல்.", isCorrect: true, fb: "அற்புதம்! வாடிக்கையாளர் மாற்று மாடல்களைப் பார்க்க சம்மதிக்கிறார்." },
            { text: "பண்டிகை ஸ்டாக் அடுத்த மாதம் தான் வரும் என்று கூறி அனுப்பி விடுதல்.", isCorrect: false, fb: "தவறு! வாடிக்கையாளர் உடனே கடையை விட்டு வெளியேறுகிறார்." },
            { text: "அவர்களை சிறிய லைட்-வெயிட் கவுண்டருக்கு அனுப்புதல்.", isCorrect: false, fb: "தவறு! வாடிக்கையாளர் திருமண நகையை மட்டுமே விரும்புகிறார்." }
          ]
        },
        {
          step: 2, pts: 5,
          qTa: "படி 2: வாடிக்கையாளர் ஒரு நகையை விரும்புகிறார், ஆனால் 3 வாரங்களில் 32 கிராமில் வேண்டும். என்ன செய்வீர்கள்?",
          qEn: "Customer needs the design in exactly 32g within 3 weeks for wedding. What do you do?",
          options: [
            { text: "திருமண தேதியைக் கேட்டு, SVV கரிகார் கைவினை மூலம் செய்து தர பதிவு செய்தல்.", isCorrect: true, fb: "சிறப்பு! SVV கரிகார் நெட்வொர்க் நகையை தயார் செய்ய உத்தரவாதம் அளிக்கிறது." },
            { text: "3 வாரத்தில் 32 கிராம் செய்வது சாத்தியமில்லை என்று கூறுதல்.", isCorrect: false, fb: "வாய்ப்பை இழந்துவிட்டீர்கள்! வாடிக்கையாளர் வெளியேறுகிறார்." }
          ]
        },
        {
          step: 3, pts: 5,
          qTa: "படி 3: இந்த விவரத்தை CRM செயலியில் எவ்வாறு பதிவு செய்ய வேண்டும்?",
          qEn: "How must this interaction be recorded in the SVV CRM App?",
          options: [
            { text: "Divert பகுதியில்: ஆன்டிக் நெக்லஸ், 32 கிராம், திருமண தேவை, Hot Lead என பதிவு செய்தல்.", isCorrect: true, fb: "சரியானது! அனைத்து விவரங்களும் செயலில் துல்லியமாகப் பதிவாகின." },
            { text: "இன்று பில் போடாததால் எதையும் பதிவு செய்யாமல் விடுதல்.", isCorrect: false, fb: "கடுமையான RNR விதிமீறல்! வெளியேறும் அனைத்து வாடிக்கையாளரும் பதிவாக வேண்டும்." }
          ]
        },
        {
          step: 4, pts: 5,
          qTa: "படி 4: விற்பனையை உறுதி செய்ய அடுத்த 24 மணி நேர நடவடிக்கை என்ன?",
          qEn: "What follow-up action within 24 hours guarantees customer conversion?",
          options: [
            { text: "டெலிகாலர் சரண்யா கரிகாரிடம் பேசி 24 மணி நேரத்திற்குள் வாட்ஸ்அப்பில் படங்களை அனுப்புதல்.", isCorrect: true, fb: "வெற்றி! வாடிக்கையாளர் ஆர்டரை உறுதி செய்து தங்கச் சீட்டிலும் சேர்ந்தார்!" },
            { text: "வாடிக்கையாளர் மீண்டும் வருவார் என்று காத்திருத்தல்.", isCorrect: false, fb: "செயலற்ற அணுகுமுறை வாடிக்கையாளரை போட்டி கடைக்கு அனுப்பும்." }
          ]
        }
      ];

      this.battleStepIndex = this.battleStepIndex || 0;
      if (this.battleStepIndex >= battleSteps.length) this.battleStepIndex = 0;
      const step = battleSteps[this.battleStepIndex];

      return `
        <div class="scenario-box">
          <div style="font-size:0.8rem; font-weight:800; color:var(--game-gold); margin-bottom:6px; text-transform:uppercase;">
            முடிவு வரிசை • படி ${step.step} of 4 (+${step.pts} Pts)
          </div>
          <div class="bilingual-ta" style="font-size:1.1rem; margin-bottom:6px;">${step.qTa}</div>
          <div class="bilingual-en">${step.qEn}</div>
        </div>

        <div class="choices-grid">
          ${step.options.map((opt, i) => `
            <div class="choice-card" id="bopt_${i}" onclick="window.SVV_GAME.submitBattleStep(${i})">
              <div class="choice-key">${i + 1}</div>
              <div class="choice-text">${opt.text}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    submitBattleStep(optIdx) {
      const battleSteps = [
        { options: [{ isCorrect: true, fb: "அற்புதம்! வாடிக்கையாளர் சம்மதித்தார்." }, { isCorrect: false, fb: "தவறு." }, { isCorrect: false, fb: "தவறு." }], pts: 5 },
        { options: [{ isCorrect: true, fb: "சிறப்பு! கரிகார் ஆர்டர் பதிவு செய்யப்பட்டது." }, { isCorrect: false, fb: "தவறு." }], pts: 5 },
        { options: [{ isCorrect: true, fb: "சரியானது! Divert பதிவு முழுமை பெற்றது." }, { isCorrect: false, fb: "தவறு." }], pts: 5 },
        { options: [{ isCorrect: true, fb: "வெற்றி! ஆர்டர் உறுதியானது!" }, { isCorrect: false, fb: "தவறு." }], pts: 5 }
      ];

      const step = battleSteps[this.battleStepIndex];
      const opt = step.options[optIdx];
      const isCorrect = opt.isCorrect;

      const el = document.getElementById(`bopt_${optIdx}`);
      if (el) {
        if (isCorrect) el.classList.add('correct');
        else el.classList.add('incorrect');
      }

      if (isCorrect) {
        playSound('correct');
        this.addScore(step.pts, 0);
        this.state.streak++;
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak(opt.fb, 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
      }
      this.saveState();

      const banner = document.getElementById('stageFeedbackBanner');
      if (banner) {
        banner.className = `feedback-banner show ${isCorrect ? 'correct' : 'incorrect'}`;
        banner.innerHTML = `
          <div class="feedback-title">${isCorrect ? '✅ படி வெற்றி பெற்றது!' : '⚠️ தவறான முடிவு'}</div>
          <div class="feedback-desc">${opt.fb}</div>
        `;
      }

      setTimeout(() => {
        if (this.battleStepIndex < 3) {
          this.battleStepIndex++;
          this.loadMission(2);
        } else {
          this.unlockBadge("Customer Saver");
          this.finishMission('m3');
        }
      }, 1400);
    }

    renderKpiMath() {
      return `
        <div class="scenario-box" style="margin-bottom:20px;">
          <table class="mis-table" style="background:#1C0505; color:#FFFFFF; width:100%; font-size:0.88rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(197,160,89,0.3);">
                <th style="padding:8px;">KPI பெயர்</th>
                <th style="padding:8px; text-align:center;">இலக்கு</th>
                <th style="padding:8px; text-align:center;">அடைந்த அளவு</th>
                <th style="padding:8px; text-align:center;">நிலை</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding:8px;">Feedback சேகரிப்பு விகிதம்</td><td style="padding:8px; text-align:center;">60%</td><td style="padding:8px; text-align:center; font-weight:800; color:var(--game-gold);">65 forms / 100 bills</td><td style="padding:8px; text-align:center; color:#00E676;">🟢 சாதனை (65%)</td></tr>
              <tr><td style="padding:8px;">Google Reviews</td><td style="padding:8px; text-align:center;">15 / மாதம்</td><td style="padding:8px; text-align:center; color:#FFB300;">12 Reviews</td><td style="padding:8px; text-align:center; color:#FFB300;">⚠️ 80%</td></tr>
            </tbody>
          </table>
        </div>

        <div style="background:rgba(255,255,255,0.04); border:1px solid var(--game-card-border); border-radius:12px; padding:16px;">
          <div style="font-weight:800; color:#FFFFFF; font-size:1.05rem; margin-bottom:10px;">
            100 பில்களில் 65 கருத்துப் படிவங்கள் சேகரிக்கப்பட்டுள்ளன. அதிகாரப்பூர்வ இலக்கான 60%-ஐ அணி அடைந்துவிட்டதா?
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button class="btn-game btn-game-gold" onclick="window.SVV_GAME.submitKpiAnswer(true)">
              ஆம்! இலக்கு அடைந்துவிட்டோம் (+5% கூடுதல் சாதனை)
            </button>
            <button class="btn-game btn-game-outline" onclick="window.SVV_GAME.submitKpiAnswer(false)">
              இல்லை, இலக்கை அடையவில்லை
            </button>
          </div>
        </div>
      `;
    }

    submitKpiAnswer(isYes) {
      if (isYes) {
        playSound('bonus');
        this.addScore(15, 0);
        this.state.streak++;
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak("சரியானது! 65 சதவீதம் என்பது 60 சதவீத இலக்கை விட அதிகம்!", 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
      }
      this.saveState();
      this.finishMission('m4');

      const banner = document.getElementById('stageFeedbackBanner');
      if (banner) {
        banner.className = `feedback-banner show ${isYes ? 'correct' : 'incorrect'}`;
        banner.innerHTML = `
          <div class="feedback-title">${isYes ? '✅ சரியான கணக்கீடு!' : '⚠️ தவறான பதில்'}</div>
          <div class="feedback-desc">65 படிவங்கள் ÷ 100 பில்கள் = 65% சாதனை. அதிகாரப்பூர்வ இலக்கான 60%-ஐ விட 5% கூடுதல்!</div>
        `;
      }
    }

    renderDetective() {
      return `
        <div class="dossier-grid">
          <div class="dossier-card" id="dossier_A" onclick="window.SVV_GAME.submitDetectiveChoice('A')">
            <div class="dossier-tag">🔎 ஆவணம் A: கருத்துப் படிவ ஒப்படைப்பு</div>
            <div style="font-weight:800; color:#FFFFFF; font-size:1rem; margin-bottom:6px;">வார இறுதிக்குப் பிறகு ஒப்படைப்பு</div>
            <p style="font-size:0.86rem; color:#CBD5E1; line-height:1.5;">
              சனிக்கிழமை வசூலான 65 கருத்துப் படிவங்களை மேசையில் பூட்டி வைத்துவிட்டு, திங்கட்கிழமை மேலாளரிடம் ஒப்படைக்க முடிவு செய்யப்பட்டது.
            </p>
          </div>
          <div class="dossier-card" id="dossier_B" onclick="window.SVV_GAME.submitDetectiveChoice('B')">
            <div class="dossier-tag">🔎 ஆவணம் B: வீடியோ சான்று பதிவு</div>
            <div style="font-weight:800; color:#FFFFFF; font-size:1rem; margin-bottom:6px;">வாடிக்கையாளர் சம்மதத்துடன் பதிவு</div>
            <p style="font-size:0.86rem; color:#CBD5E1; line-height:1.5;">
              வாடிக்கையாளரின் எழுத்துப்பூர்வ சம்மதத்துடன் 45 விநாடி வீடியோ எடுக்கப்பட்டு பதிவேட்டில் குறிக்கப்பட்டது.
            </p>
          </div>
          <div class="dossier-card" id="dossier_C" onclick="window.SVV_GAME.submitDetectiveChoice('C')">
            <div class="dossier-tag">🔎 ஆவணம் C: Divert பதிவு</div>
            <div style="font-weight:800; color:#FFFFFF; font-size:1rem; margin-bottom:6px;">சரியான முதன்மைக் காரணம்</div>
            <p style="font-size:0.86rem; color:#CBD5E1; line-height:1.5;">
              8 கிராம் மோதிரம் கிடைக்காத காரணம் மற்றும் வாடிக்கையாளர் எண் செயலியில் துல்லியமாகப் பதியப்பட்டது.
            </p>
          </div>
        </div>
        <p style="text-align:center; font-size:0.9rem; color:var(--game-champagne); font-weight:700;">
          CRM விதிமுறையை மீறிய தவறான ஆவணத்தைக் கிளிக் செய்யவும்.
        </p>
      `;
    }

    submitDetectiveChoice(id) {
      clearInterval(this.timerInterval);
      const isCorrect = id === 'A';
      const card = document.getElementById(`dossier_${id}`);
      if (card && isCorrect) card.classList.add('selected-error');

      if (isCorrect) {
        playSound('bonus');
        this.addScore(15, 0);
        this.state.streak++;
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak("மிகச்சரி! கருத்துப் படிவங்களை தினமும் இரவு 9 மணிக்கு மேலாளரிடம் ஒப்படைக்க வேண்டும். தள்ளிப் போடக் கூடாது.", 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
      }
      this.saveState();
      this.finishMission('m5');

      const banner = document.getElementById('stageFeedbackBanner');
      if (banner) {
        banner.className = `feedback-banner show ${isCorrect ? 'correct' : 'incorrect'}`;
        banner.innerHTML = `
          <div class="feedback-title">${isCorrect ? '🔍 தணிக்கை வெற்றி! தவறு கண்டுபிடிக்கப்பட்டது!' : '⚠️ தவறான தேர்வு'}</div>
          <div class="feedback-desc">ஆவணம் A-ல் விதிமீறல் உள்ளது: கருத்துப் படிவங்களை வார இறுதி வரை வைத்திருக்கக் கூடாது. தினமும் இரவு 9:00 மணிக்கு மேலாளர் செல்வியிடம் ஒப்படைக்க வேண்டும்!</div>
        `;
      }
    }

    renderFinalBoss() {
      const bossSteps = [
        {
          step: 1, pts: 5,
          qTa: "நிலை 1: திருமண வாடிக்கையாளர் கோபமாக இருக்கிறார். உங்கள் உடனடி de-escalation நடவடிக்கை என்ன?",
          qEn: "Stage 1: Agitated wedding customer. Immediate de-escalation protocol?",
          options: [
            { text: "வாடிக்கையாளரை உடனடியாக VIP லவுஞ்சிற்கு அழைத்துச் சென்று தண்ணீர்/டீ வழங்கி, வாக்குவாதம் இன்றி அமைதியாகக் கேட்டல்.", isCorrect: true },
            { text: "ஆர்டர் ரசீதில் தவறு உள்ளதாக வாடிக்கையாளரிடம் வாதிடுதல்.", isCorrect: false }
          ]
        },
        {
          step: 2, pts: 5,
          qTa: "நிலை 2: RACI வழிகாட்டுதலின்படி எத்தனை நிமிடத்திற்குள் மேலாளருக்கு தகவல் தெரிவிக்க வேண்டும்?",
          qEn: "Stage 2: RACI complaint escalation timeframe?",
          options: [
            { text: "15 நிமிடங்களுக்குள் கடை மேலாளர் மற்றும் CRM மேலாளருக்கு தகவல் தெரிவித்தல்.", isCorrect: true },
            { text: "அடுத்த நாள் காலை கூட்டம் வரை காத்திருத்தல்.", isCorrect: false }
          ]
        },
        {
          step: 3, pts: 5,
          qTa: "நிலை 3: 24 மணி நேர காலக்கெடுவுக்குள் வாடிக்கையாளரை திருப்திப்படுத்த இறுதி நடவடிக்கை என்ன?",
          qEn: "Stage 3: Final 24-hour SLA resolution?",
          options: [
            { text: "மாஸ்டர் கரிகாரை VIP லவுஞ்சிற்கு வரவழைத்து 45 நிமிடத்தில் அளவை சரிசெய்து, சிறப்பு வெள்ளி நாணயத்துடன் திருமண இடத்திற்கு வழங்குதல்.", isCorrect: true },
            { text: "500 ரூபாய் கூப்பன் கொடுத்து திருப்பி அனுப்பி விடுதல்.", isCorrect: false }
          ]
        }
      ];

      this.bossStepIndex = this.bossStepIndex || 0;
      if (this.bossStepIndex >= bossSteps.length) this.bossStepIndex = 0;
      const step = bossSteps[this.bossStepIndex];

      return `
        <div class="scenario-box" style="border-left-color:var(--game-neon-red); background:rgba(50, 6, 6, 0.75);">
          <div style="font-size:0.8rem; font-weight:800; color:#FFA3A9; margin-bottom:6px; text-transform:uppercase;">
            🚨 அவசரப் புகார் தீர்வு • நிலை ${step.step} of 3 (+${step.pts} Pts)
          </div>
          <div class="bilingual-ta" style="font-size:1.15rem; margin-bottom:6px;">${step.qTa}</div>
          <div class="bilingual-en">${step.qEn}</div>
        </div>

        <div class="choices-grid">
          ${step.options.map((opt, i) => `
            <div class="choice-card" id="boss_opt_${i}" onclick="window.SVV_GAME.submitBossStep(${i})">
              <div class="choice-key">${i + 1}</div>
              <div class="choice-text">${opt.text}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    submitBossStep(optIdx) {
      const bossSteps = [
        { options: [{ isCorrect: true }, { isCorrect: false }], pts: 5 },
        { options: [{ isCorrect: true }, { isCorrect: false }], pts: 5 },
        { options: [{ isCorrect: true }, { isCorrect: false }], pts: 5 }
      ];

      const step = bossSteps[this.bossStepIndex];
      const isCorrect = step.options[optIdx].isCorrect;

      const el = document.getElementById(`boss_opt_${optIdx}`);
      if (el) {
        if (isCorrect) el.classList.add('correct');
        else el.classList.add('incorrect');
      }

      if (isCorrect) {
        playSound('correct');
        this.addScore(step.pts, 0);
        this.state.streak++;
        this.levelProgress++;
        this.updateLevelMeter();
        SpeechAssistant.speak("சிறப்பு! சரியான முடிவு!", 'ta-IN');
      } else {
        playSound('wrong');
        this.state.streak = 0;
      }
      this.saveState();

      if (this.bossStepIndex < 2) {
        setTimeout(() => {
          this.bossStepIndex++;
          this.loadMission(5);
        }, 1200);
      } else {
        this.unlockBadge("Mission Champion");
        this.finishMission('m6');
        const banner = document.getElementById('stageFeedbackBanner');
        if (banner) {
          banner.className = 'feedback-banner show correct';
          banner.innerHTML = `
            <div class="feedback-title">👑 வாழ்த்துகள்! இறுதி பாஸ் மிஷன் வெற்றிகரமாக முடிந்தது!</div>
            <div class="feedback-desc">CALM உபசரிப்பு, 15-நிமிட தகவல், நேரடி கரிகார் திருத்தம் மூலம் ₹15 லட்சம் மதிப்பிலான திருமண வாடிக்கையாளரை முழுமையாக மீட்டெடுத்து விட்டீர்கள்!</div>
          `;
        }
      }
    }

    addScore(base, bonus) {
      this.state.baseScore = Math.min(100, this.state.baseScore + base);
      this.state.bonusScore += bonus;
      this.saveState();
    }

    finishMission(missionId) {
      this.state.completedMissions[missionId] = true;
      this.saveState();
      this.renderMissionRibbon();
    }

    advanceMission() {
      if (this.currentMissionIndex < 5) {
        this.loadMission(this.currentMissionIndex + 1);
      } else {
        SpeechAssistant.speak(`வாழ்த்துகள்! நீங்கள் SVV Mission League-ல் ${this.state.baseScore + this.state.bonusScore} புள்ளிகள் பெற்று வெற்றி பெற்றுள்ளீர்கள்!`, 'ta-IN');
        alert(`🏆 Mission League Completed!\nFinal Score: ${this.state.baseScore}/100 Base + ${this.state.bonusScore} Bonuses = ${this.state.baseScore + this.state.bonusScore} Total Score!`);
        const modal = document.getElementById('modalLeaderboard');
        if (modal) modal.classList.add('active');
        this.renderLeaderboard();
      }
    }

    unlockBadge(badgeName) {
      if (!this.state.badges) this.state.badges = [];
      if (!this.state.badges.includes(badgeName)) {
        this.state.badges.push(badgeName);
        this.saveState();
      }
    }

    renderLeaderboard() {
      const tbody = document.getElementById('leaderboardTableBody');
      if (!tbody) return;
      const activeP = this.getActivePlayer();
      const currentTotal = this.state.baseScore + this.state.bonusScore;

      let list = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
      const exist = list.find(l => l.name === activeP.name);
      if (exist) {
        exist.base = this.state.baseScore;
        exist.bonus = this.state.bonusScore;
        exist.total = currentTotal;
      } else {
        list.push({
          rank: 7,
          name: activeP.name,
          role: activeP.role,
          base: this.state.baseScore,
          bonus: this.state.bonusScore,
          total: currentTotal,
          status: "Competitor"
        });
      }

      list.sort((a, b) => b.total - a.total);
      list.forEach((l, idx) => l.rank = idx + 1);

      tbody.innerHTML = list.map(l => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06); ${l.name === activeP.name ? 'background:rgba(255, 215, 0, 0.15); font-weight:bold;' : ''}">
          <td style="padding:10px; text-align:center; color:var(--game-gold);">#${l.rank}</td>
          <td style="padding:10px;">${l.name}</td>
          <td style="padding:10px; color:#94A3B8; font-size:0.85rem;">${l.role}</td>
          <td style="padding:10px; text-align:right;">${l.base}</td>
          <td style="padding:10px; text-align:right; color:#00E676;">+${l.bonus}</td>
          <td style="padding:10px; text-align:right; font-family:var(--font-game); font-weight:800; color:var(--game-gold);">${l.total}</td>
          <td style="padding:10px; text-align:center;"><span class="gov-badge gov-badge-gold" style="font-size:0.75rem;">${l.status}</span></td>
        </tr>
      `).join('');
    }

    renderBadges() {
      const container = document.getElementById('badgesContainer');
      if (!container) return;
      const ALL_BADGES = [
        { name: "Greeting Star", icon: "🏅", desc: "Greet every showroom customer within 10 seconds without fail." },
        { name: "RACI Master", icon: "🎯", desc: "100% correct assignment of R1, R2, Accountable roles on footfall." },
        { name: "Customer Saver", icon: "🛡️", desc: "Recovered a walkout inquiry into a committed bridal booking." },
        { name: "KPI Hunter", icon: "📈", desc: "Calculated shop-floor collection percentages and selected review strategy." },
        { name: "Data Detective", icon: "🕵️", desc: "Spotted the feedback handoff error during operational audit." },
        { name: "Mission Champion", icon: "👑", desc: "Completed the Final Boss bridal emergency escalation protocol." }
      ];

      container.innerHTML = ALL_BADGES.map(b => {
        const isUnlocked = this.state.badges && this.state.badges.includes(b.name);
        return `
          <div style="background:rgba(255,255,255,0.04); border:1px solid ${isUnlocked ? 'var(--game-gold)' : 'rgba(255,255,255,0.1)'}; border-radius:10px; padding:14px; text-align:center; opacity:${isUnlocked ? 1 : 0.4};">
            <div style="font-size:2rem; margin-bottom:6px;">${b.icon}</div>
            <div style="font-weight:700; color:#FFFFFF; font-size:0.9rem;">${b.name}</div>
            <p style="font-size:0.75rem; color:#94A3B8; margin-top:4px;">${b.desc}</p>
            <div style="margin-top:8px;">
              <span class="gov-badge ${isUnlocked ? 'gov-badge-gold' : 'gov-badge-maroon'}" style="font-size:0.7rem;">
                ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Initialize and mount globally
  window.SVVMissionEngine = SVVMissionEngine;
  window.addEventListener('DOMContentLoaded', () => {
    window.SVV_GAME = new SVVMissionEngine();
  });

})();
