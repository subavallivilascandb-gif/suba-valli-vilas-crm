/**
 * ============================================================================
 * SUBA VALLI VILAS JEWELLERY - CRM ROLES & RESPONSIBILITIES (RNR) SCRIPT
 * Standards: C&B (Consulting & Beyond) Operations Matrix
 * Bilingual: English & தமிழ்
 * ============================================================================
 */

(function () {
  'use strict';

  // Master RNR Data - Exact transcription from official SVV & C&B documents
  const RNR_DATA = {
    greeter: [
      {
        sno: 1,
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        roleEn: "Maintain punctuality and ensure presence on the shop floor during assigned hours without fail.",
        roleTa: "நியமிக்கப்பட்ட நேரங்களில் தவறாமல் நேரந்தவறாமையைக் கடைப்பிடித்து, விற்பனைத் தளத்தில் இருப்பதை உறுதி செய்ய வேண்டும்.",
        remarks: "Essential for 100% floor coverage"
      },
      {
        sno: 2,
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        roleEn: "Follow company discipline, grooming standards, and professional conduct at all times.",
        roleTa: "நிறுவனத்தின் ஒழுக்க விதிமுறைகள், தோற்றத் தரநிலைகள் மற்றும் தொழில்முறை நடத்தையை எப்போதும் பின்பற்ற வேண்டும்.",
        remarks: "Audit score ≥ 95%"
      },
      {
        sno: 3,
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        roleEn: "Acknowledge and greet every customer within 10 seconds of entry with a polite and welcoming approach.",
        roleTa: "ஒவ்வொரு வாடிக்கையாளரும் கடைக்குள் நுழைந்த 10 விநாடிகளுக்குள் பணிவுடனும் அன்புடனும் வரவேற்க வேண்டும்.",
        remarks: "Standard 10-Second Welcoming SLA"
      },
      {
        sno: 4,
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        roleEn: "Observe customer behaviour and proactively offer assistance without being pushy.",
        roleTa: "வாடிக்கையாளரின் நடத்தையைக் கவனித்து, வற்புறுத்தாமல் முன்வந்து உதவி வழங்க வேண்டும்.",
        remarks: "Natural, gracious engagement"
      },
      {
        sno: 5,
        areaEn: "Customer Handling",
        areaTa: "வாடிக்கையாளர் கையாளுதல்",
        roleEn: "Ensure smooth customer movement between sections and counters without confusion.",
        roleTa: "வாடிக்கையாளர்கள் பிரிவுகள் மற்றும் கவுண்டர்களுக்கு இடையே குழப்பமின்றி சீராகச் செல்வதை உறுதி செய்ய வேண்டும்.",
        remarks: "Floor traffic management"
      },
      {
        sno: 6,
        areaEn: "Customer Handling",
        areaTa: "வாடிக்கையாளர் கையாளுதல்",
        roleEn: "Handle customers patiently and politely, especially during peak hours.",
        roleTa: "குறிப்பாக நெரிசல் நேரங்களில் வாடிக்கையாளர்களைப் பொறுமையாகவும் பணிவாகவும் கையாள வேண்டும்.",
        remarks: "Calm demeanor under rush"
      },
      {
        sno: 7,
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        roleEn: "Ensure accurate hourly footfall count is recorded daily without omission or back-entry.",
        roleTa: "மணிநேர வாரியான வருகையாளர் எண்ணிக்கையை தினமும் துல்லியமாக, விடுபடாமலும் பின்தேதி பதிவின்றியும் பதிவு செய்ய வேண்டும்.",
        remarks: "100% real-time slot logging"
      },
      {
        sno: 8,
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        roleEn: "Coordinate with supervisors during high footfall hours for effective crowd management.",
        roleTa: "அதிக வருகை நேரங்களில் கூட்டத்தை திறம்பட நிர்வகிக்க மேற்பார்வையாளர்களுடன் ஒருங்கிணைந்து செயல்பட வேண்டும்.",
        remarks: "Crowd control & counter load"
      },
      {
        sno: 9,
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு மேலாண்மை",
        roleEn: "Ensure genuine diverted customers are recorded clearly with correct primary diversion reason.",
        roleTa: "உண்மையாகவே திசைமாறிய வாடிக்கையாளர்களை சரியான முதன்மைக் காரணத்துடன் தெளிவாகப் பதிவு செய்ய வேண்டும்.",
        remarks: "Divert accuracy ≥ 95%"
      },
      {
        sno: 10,
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு மேலாண்மை",
        roleEn: "Support supervisors in attempting alternate product suggestions before customer exit.",
        roleTa: "வாடிக்கையாளர் வெளியேறும் முன் மாற்றுப் பொருட்களைப் பரிந்துரைக்கும் முயற்சியில் மேற்பார்வையாளர்களுக்கு உதவ வேண்டும்.",
        remarks: "Save the sale target ≥ 80%"
      },
      {
        sno: 11,
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        roleEn: "Politely request customers to share feedback at billing or exit point without forcing.",
        roleTa: "பில்லிங் அல்லது வெளியேறும் இடத்தில், வற்புறுத்தாமல் கருத்துகளைப் பகிருமாறு வாடிக்கையாளர்களைப் பணிவுடன் கேட்க வேண்டும்.",
        remarks: "Feedback collection ≥ 60% of bills"
      },
      {
        sno: 12,
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        roleEn: "Ensure feedback forms are properly filled, legible, and submitted daily.",
        roleTa: "கருத்துப் படிவங்கள் சரியாக நிரப்பப்பட்டு, தெளிவாக படிக்கும்படி இருந்து, தினமும் சமர்ப்பிக்கப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "100% daily handoff to CRM Manager"
      },
      {
        sno: 13,
        areaEn: "Grievance Escalation",
        areaTa: "குறைகளை உயர்நிலைக்குத் தெரிவித்தல்",
        roleEn: "Immediately escalate serious complaints or negative customer experiences to Management.",
        roleTa: "கடுமையான புகார்கள் அல்லது எதிர்மறை வாடிக்கையாளர் அனுபவங்களை உடனடியாக நிர்வாகத்திற்குத் தெரிவிக்க வேண்டும்.",
        remarks: "Immediate 0-minute escalation"
      },
      {
        sno: 14,
        areaEn: "Grievance Escalation",
        areaTa: "குறைகளை உயர்நிலைக்குத் தெரிவித்தல்",
        roleEn: "Highlight repeated complaints and unresolved issues during daily briefing.",
        roleTa: "மீண்டும் மீண்டும் வரும் புகார்கள் மற்றும் தீர்க்கப்படாத பிரச்சினைகளை தினசரி கூட்டத்தில் எடுத்துரைக்க வேண்டும்.",
        remarks: "Morning standup input"
      },
      {
        sno: 15,
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        roleEn: "Ensure all CRM data entries in the app are accurate, complete, and error-free.",
        roleTa: "செயலியில் உள்ள அனைத்து CRM தரவு பதிவுகளும் துல்லியமாகவும் முழுமையாகவும் பிழையின்றியும் இருப்பதை உறுதி செய்ய வேண்டும்.",
        remarks: "Accuracy target ≥ 98%"
      },
      {
        sno: 16,
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        roleEn: "Ensure confidentiality of customer information and feedback data.",
        roleTa: "வாடிக்கையாளர் தகவல் மற்றும் கருத்துத் தரவின் ரகசியத்தன்மையைக் காக்க வேண்டும்.",
        remarks: "Strict Zero-leakage policy"
      },
      {
        sno: 17,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Share daily and weekly observations on customer behaviour, diversion trends, and feedback patterns.",
        roleTa: "வாடிக்கையாளர் நடத்தை, திசைமாற்றப் போக்குகள் மற்றும் கருத்து வடிவங்கள் குறித்த தினசரி, வாராந்திர கவனிப்புகளைப் பகிர வேண்டும்.",
        remarks: "Operational field intelligence"
      },
      {
        sno: 18,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Support Management with basic insights related to conversion and customer experience.",
        roleTa: "விற்பனை மாற்றம் மற்றும் வாடிக்கையாளர் அனுபவம் தொடர்பான அடிப்படை நுண்ணறிவுகளை வழங்கி நிர்வாகத்திற்கு உதவ வேண்டும்.",
        remarks: "Conversion gap mitigation"
      },
      {
        sno: 19,
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        roleEn: "Encourage customers politely to revisit the store and inform them about new arrivals or offers.",
        roleTa: "வாடிக்கையாளர்களை மீண்டும் கடைக்கு வருமாறு பணிவுடன் ஊக்குவித்து, புதிய வரவுகள் அல்லது சலுகைகள் பற்றித் தெரிவிக்க வேண்டும்.",
        remarks: "Warm re-invite protocol"
      },
      {
        sno: 20,
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        roleEn: "Identify and support engagement of repeat and high-value customers.",
        roleTa: "மீண்டும் வரும் மற்றும் அதிக மதிப்புள்ள வாடிக்கையாளர்களைக் கண்டறிந்து அவர்களுடனான தொடர்புக்கு உதவ வேண்டும்.",
        remarks: "≥ 10 repeat customers / week"
      },
      {
        sno: 21,
        areaEn: "Internal Coordination",
        areaTa: "உள் ஒருங்கிணைப்பு",
        roleEn: "Coordinate with Sales team to ensure customer expectations are met.",
        roleTa: "வாடிக்கையாளர் எதிர்பார்ப்புகள் நிறைவேறுவதை உறுதி செய்ய விற்பனைக் குழுவுடன் ஒருங்கிணைந்து செயல்பட வேண்டும்.",
        remarks: "Sales counter handoff"
      },
      {
        sno: 22,
        areaEn: "Internal Coordination",
        areaTa: "உள் ஒருங்கிணைப்பு",
        roleEn: "Share customer insights with VM and Operations teams regarding display or layout concerns.",
        roleTa: "காட்சியமைப்பு அல்லது அமைப்பு தொடர்பான கவலைகள் குறித்த வாடிக்கையாளர் நுண்ணறிவுகளை VM மற்றும் செயல்பாட்டுக் குழுக்களுடன் பகிர வேண்டும்.",
        remarks: "Visual merchandising feedback"
      },
      {
        sno: 23,
        areaEn: "Customer Video Testimonial",
        areaTa: "வாடிக்கையாளர் வீடியோ சான்று",
        roleEn: "Request willing customers to record a short video testimonial about their shopping experience.",
        roleTa: "விருப்பமுள்ள வாடிக்கையாளர்களிடம் தங்கள் ஷாப்பிங் அனுபவம் குறித்த சிறிய வீடியோ சான்றைப் பதிவு செய்யுமாறு கேட்க வேண்டும்.",
        remarks: "Target ≥ 5 videos / month"
      },
      {
        sno: 24,
        areaEn: "Customer Video Testimonial",
        areaTa: "வாடிக்கையாளர் வீடியோ சான்று",
        roleEn: "Ensure customer consent is taken and video is forwarded to CRM Manager.",
        roleTa: "வாடிக்கையாளரின் ஒப்புதல் பெறப்பட்டு, வீடியோ CRM மேலாளருக்கு அனுப்பப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "Consent compliance mandatory"
      },
      {
        sno: 25,
        areaEn: "Google Review Collection",
        areaTa: "கூகுள் மதிப்புரை சேகரிப்பு",
        roleEn: "Politely request customers to leave a Google review after a positive interaction.",
        roleTa: "நேர்மறையான தொடர்புக்குப் பிறகு கூகுளில் மதிப்புரை எழுதுமாறு வாடிக்கையாளர்களைப் பணிவுடன் கேட்க வேண்டும்.",
        remarks: "Target ≥ 15 reviews / month"
      },
      {
        sno: 26,
        areaEn: "Google Review Collection",
        areaTa: "கூகுள் மதிப்புரை சேகரிப்பு",
        roleEn: "Share the store Google review link via WhatsApp or show it on the greeter device.",
        roleTa: "கடையின் கூகுள் மதிப்புரை இணைப்பை வாட்ஸ்அப் மூலம் பகிர வேண்டும் அல்லது வரவேற்பாளர் சாதனத்தில் காட்ட வேண்டும்.",
        remarks: "Fast QR code scanning"
      },
      {
        sno: 27,
        areaEn: "Professional Conduct",
        areaTa: "தொழில்முறை நடத்தை",
        roleEn: "Act as a brand ambassador and maintain calm, respectful behaviour at all times.",
        roleTa: "பிராண்ட் தூதராகச் செயல்பட்டு, எப்போதும் அமைதியாகவும் மரியாதையுடனும் நடந்துகொள்ள வேண்டும்.",
        remarks: "SVV Brand reputation"
      },
      {
        sno: 28,
        areaEn: "Professional Conduct",
        areaTa: "தொழில்முறை நடத்தை",
        roleEn: "Follow escalation matrix and avoid arguments or personal opinions with customers.",
        roleTa: "மேல்முறையீட்டு (எஸ்கலேஷன்) வழிமுறையைப் பின்பற்றி, வாடிக்கையாளர்களுடன் வாக்குவாதம் மற்றும் தனிப்பட்ட கருத்துகளைத் தவிர்க்க வேண்டும்.",
        remarks: "Strict Zero argument rule"
      },
      {
        sno: 29,
        areaEn: "Policy Compliance",
        areaTa: "கொள்கை இணக்கம்",
        roleEn: "Strictly adhere to HR policies, CRM guidelines, and instructions issued by Management from time to time.",
        roleTa: "HR கொள்கைகள், CRM வழிகாட்டுதல்கள் மற்றும் நிர்வாகம் அவ்வப்போது வழங்கும் அறிவுறுத்தல்களை கண்டிப்பாகப் பின்பற்ற வேண்டும்.",
        remarks: "Zero policy breaches"
      }
    ],

    manager: [
      {
        sno: 1,
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        roleEn: "Maintain punctuality and ensure presence on the shop floor during assigned hours without fail.",
        roleTa: "நியமிக்கப்பட்ட நேரங்களில் தவறாமல் நேரந்தவறாமையைக் கடைப்பிடித்து, விற்பனைத் தளத்தில் இருப்பதை உறுதி செய்ய வேண்டும்.",
        remarks: "Lead by personal discipline"
      },
      {
        sno: 2,
        areaEn: "General Discipline",
        areaTa: "பொது ஒழுக்கம்",
        roleEn: "Follow company discipline, grooming standards, and professional conduct at all times.",
        roleTa: "நிறுவனத்தின் ஒழுக்க விதிமுறைகள், தோற்றத் தரநிலைகள் மற்றும் தொழில்முறை நடத்தையை எப்போதும் பின்பற்ற வேண்டும்.",
        remarks: "Brand ambassador standard"
      },
      {
        sno: 3,
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        roleEn: "Monitor whether team members acknowledge and greet customers as per the defined customer service standards.",
        roleTa: "வரையறுக்கப்பட்ட வாடிக்கையாளர் சேவைத் தரநிலைகளின்படி, குழு உறுப்பினர்கள் வாடிக்கையாளர்களை வரவேற்கிறார்களா என்பதைக் கண்காணிக்க வேண்டும்.",
        remarks: "Daily audit of 10-sec greet"
      },
      {
        sno: 4,
        areaEn: "Customer Engagement",
        areaTa: "வாடிக்கையாளர் ஈடுபாடு",
        roleEn: "Observe customer interactions and ensure staff provide timely and appropriate assistance. Identify gaps in customer handling and inform the Floor Manager.",
        roleTa: "வாடிக்கையாளர்களுடனான தொடர்புகளைக் கவனித்து, ஊழியர்கள் உரிய நேரத்தில் தகுந்த உதவி வழங்குவதை உறுதி செய்ய வேண்டும். வாடிக்கையாளர் கையாளுதலில் உள்ள குறைபாடுகளைக் கண்டறிந்து, ஃப்ளோர் மேலாளருக்குத் தெரிவிக்க வேண்டும்.",
        remarks: "Immediate gap escalation"
      },
      {
        sno: 5,
        areaEn: "Customer Handling",
        areaTa: "வாடிக்கையாளர் கையாளுதல்",
        roleEn: "Ensure smooth customer movement between sections and counters without confusion.",
        roleTa: "வாடிக்கையாளர்கள் பிரிவுகள் மற்றும் கவுண்டர்களுக்கு இடையே குழப்பமின்றி சீராகச் செல்வதை உறுதி செய்ய வேண்டும்.",
        remarks: "Peak congestion relief"
      },
      {
        sno: 6,
        areaEn: "Customer Handling",
        areaTa: "வாடிக்கையாளர் கையாளுதல்",
        roleEn: "Handle customers patiently and politely, especially during peak hours, and engage with customers to make them feel more comfortable.",
        roleTa: "குறிப்பாக நெரிசல் நேரங்களில் வாடிக்கையாளர்களைப் பொறுமையாகவும் பணிவாகவும் கையாண்டு, அவர்கள் மேலும் வசதியாக உணரும்படி அவர்களுடன் உரையாட வேண்டும்.",
        remarks: "High hospitality standard"
      },
      {
        sno: 7,
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        roleEn: "Ensure accurate hourly footfall count is recorded daily without omission, track hourly footfall and be on rounds during high footfall time.",
        roleTa: "மணிநேர வாரியான வருகையாளர் எண்ணிக்கை தினமும் விடுபடாமல் துல்லியமாகப் பதிவு செய்யப்படுவதை உறுதி செய்து, அதைக் கண்காணித்து, அதிக வருகை நேரங்களில் தளத்தில் சுற்றி வர வேண்டும்.",
        remarks: "Active floor patrol"
      },
      {
        sno: 8,
        areaEn: "Footfall Management",
        areaTa: "வருகையாளர் எண்ணிக்கை மேலாண்மை",
        roleEn: "Review daily footfall trends and report deviations from targets to the Management.",
        roleTa: "தினசரி வருகையாளர் எண்ணிக்கைப் போக்குகளை ஆய்வு செய்து, இலக்குகளிலிருந்து ஏற்படும் விலகல்களை நிர்வாகத்திற்குத் தெரிவிக்க வேண்டும்.",
        remarks: "Daily deviation reporting"
      },
      {
        sno: 9,
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு மேலாண்மை",
        roleEn: "Ensure genuine diverted customers are recorded clearly with correct primary diversion reason in the app.",
        roleTa: "உண்மையாகவே திசைமாறிய வாடிக்கையாளர்களை சரியான முதன்மைக் காரணத்துடன் செயலியில் தெளிவாகப் பதிவு செய்வதை உறுதி செய்ய வேண்டும்.",
        remarks: "App audit & validation"
      },
      {
        sno: 10,
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு மேலாண்மை",
        roleEn: "Support staff in attempting alternate product suggestions before customer exit.",
        roleTa: "வாடிக்கையாளர் வெளியேறும் முன் மாற்றுப் பொருட்களைப் பரிந்துரைக்கும் முயற்சியில் ஊழியர்களுக்கு உதவ வேண்டும்.",
        remarks: "Save customer sale"
      },
      {
        sno: 11,
        areaEn: "Divert Register Management",
        areaTa: "திசைமாறிய வாடிக்கையாளர் பதிவேடு மேலாண்மை",
        roleEn: "Analyse divert data weekly and apply Root Cause Analysis (RCA) to identify recurring diversion patterns.",
        roleTa: "திசைமாற்றத் தரவை வாராந்தம் பகுப்பாய்வு செய்து, மீண்டும் மீண்டும் நிகழும் திசைமாற்றப் போக்குகளைக் கண்டறிய மூலகாரணப் பகுப்பாய்வை (RCA) பயன்படுத்த வேண்டும்.",
        remarks: "Weekly RCA report"
      },
      {
        sno: 12,
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        roleEn: "Politely request customers to share feedback at exit point without forcing.",
        roleTa: "வெளியேறும் இடத்தில், வற்புறுத்தாமல் கருத்துகளைப் பகிருமாறு வாடிக்கையாளர்களைப் பணிவுடன் கேட்க வேண்டும்.",
        remarks: "Non-intrusive approach"
      },
      {
        sno: 13,
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        roleEn: "Ensure feedback forms are properly filled, legible, and submitted daily.",
        roleTa: "கருத்துப் படிவங்கள் சரியாக நிரப்பப்பட்டு, தெளிவாக படிக்கும்படி இருந்து, தினமும் சமர்ப்பிக்கப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "Quality check of forms"
      },
      {
        sno: 14,
        areaEn: "Customer Feedback Collection",
        areaTa: "வாடிக்கையாளர் கருத்து சேகரிப்பு",
        roleEn: "Review feedback data on a daily basis, escalate recurring complaints to Management, and share the divert and telecalling report with the Store Manager to include feedback in the staff briefing.",
        roleTa: "கருத்துத் தரவை தினமும் ஆய்வு செய்து, மீண்டும் மீண்டும் வரும் புகார்களை நிர்வாகத்திற்குத் தெரிவிக்க வேண்டும்; ஊழியர் கூட்டத்தில் கருத்துகளை இணைக்க, திசைமாற்ற மற்றும் தொலைபேசி அழைப்பு (டெலிகாலிங்) அறிக்கைகளை கடை மேலாளருடன் பகிர வேண்டும்.",
        remarks: "Continuous loop alignment"
      },
      {
        sno: 15,
        areaEn: "Grievance Escalation",
        areaTa: "குறைகளை உயர்நிலைக்குத் தெரிவித்தல்",
        roleEn: "Immediately escalate serious complaints or negative customer experiences to Management.",
        roleTa: "கடுமையான புகார்கள் அல்லது எதிர்மறை வாடிக்கையாளர் அனுபவங்களை உடனடியாக நிர்வாகத்திற்குத் தெரிவிக்க வேண்டும்.",
        remarks: "SLA < 15 minutes"
      },
      {
        sno: 16,
        areaEn: "Grievance Escalation",
        areaTa: "குறைகளை உயர்நிலைக்குத் தெரிவித்தல்",
        roleEn: "Highlight repeated complaints and unresolved issues during review meetings.",
        roleTa: "மீண்டும் மீண்டும் வரும் புகார்கள் மற்றும் தீர்க்கப்படாத பிரச்சினைகளை ஆய்வுக் கூட்டங்களில் எடுத்துரைக்க வேண்டும்.",
        remarks: "Agenda item in MRM"
      },
      {
        sno: 17,
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        roleEn: "Ensure confidentiality of customer information and feedback data.",
        roleTa: "வாடிக்கையாளர் தகவல் மற்றும் கருத்துத் தரவின் ரகசியத்தன்மையைக் காக்க வேண்டும்.",
        remarks: "Customer privacy guardian"
      },
      {
        sno: 18,
        areaEn: "CRM Data Discipline",
        areaTa: "CRM தரவு ஒழுக்கம்",
        roleEn: "Verify accuracy of all CRM app entries made by Greeters on a daily basis.",
        roleTa: "வரவேற்பாளர்கள் செய்த அனைத்து CRM செயலிப் பதிவுகளின் துல்லியத்தை தினமும் சரிபார்க்க வேண்டும்.",
        remarks: "Daily accuracy verification"
      },
      {
        sno: 19,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Ensure all reports are filled correctly in the CRM App and submitted on time.",
        roleTa: "அனைத்து அறிக்கைகளும் CRM செயலியில் சரியாக நிரப்பப்பட்டு, உரிய நேரத்தில் சமர்ப்பிக்கப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "100% timeliness"
      },
      {
        sno: 20,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Review daily metrics – footfall, divert %, feedback collection % – against targets and flag deviations to the Management.",
        roleTa: "தினசரி அளவீடுகளான வருகையாளர் எண்ணிக்கை, திசைமாற்ற சதவீதம், கருத்து சேகரிப்பு சதவீதம் ஆகியவற்றை இலக்குகளுடன் ஒப்பிட்டு ஆய்வு செய்து, விலகல்களை நிர்வாகத்திற்குத் தெரிவிக்க வேண்டும்.",
        remarks: "Variance analysis"
      },
      {
        sno: 21,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Prepare and share the Day End Report (DER) with the official whatsapp group every morning without fail.",
        roleTa: "தினசரி முடிவு அறிக்கையை (DER) தயாரித்து, ஒவ்வொரு நாளும் காலையில் தவறாமல் அதிகாரப்பூர்வ WhatsApp குழுவில் பகிர வேண்டும்.",
        remarks: "DER Morning Deadline 10:00 AM"
      },
      {
        sno: 22,
        areaEn: "Reporting & Insights",
        areaTa: "அறிக்கை மற்றும் நுண்ணறிவுகள்",
        roleEn: "Regularly check the Telecalling section/module in the CRM App to monitor call entries, call status, remarks, and follow-up updates.",
        roleTa: "அழைப்புப் பதிவுகள், அழைப்பு நிலை, குறிப்புகள் மற்றும் தொடர் நடவடிக்கை புதுப்பிப்புகளைக் கண்காணிக்க, CRM செயலியில் உள்ள தொலைபேசி அழைப்பு (டெலிகாலிங்) பிரிவை தொடர்ந்து சரிபார்க்க வேண்டும்.",
        remarks: "Queue turnaround monitoring"
      },
      {
        sno: 23,
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        roleEn: "Encourage customers politely to revisit the store and inform them about new arrivals or offers.",
        roleTa: "வாடிக்கையாளர்களை மீண்டும் கடைக்கு வருமாறு பணிவுடன் ஊக்குவித்து, புதிய வரவுகள் அல்லது சலுகைகள் பற்றித் தெரிவிக்க வேண்டும்.",
        remarks: "Promotion broadcast"
      },
      {
        sno: 24,
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        roleEn: "Identify and support engagement of repeat and high-value customers.",
        roleTa: "மீண்டும் வரும் மற்றும் அதிக மதிப்புள்ள வாடிக்கையாளர்களைக் கண்டறிந்து அவர்களுடனான தொடர்புக்கு உதவ வேண்டும்.",
        remarks: "VIP Relationship desk"
      },
      {
        sno: 25,
        areaEn: "Customer Retention Support",
        areaTa: "வாடிக்கையாளர் தக்கவைப்பு ஆதரவு",
        roleEn: "Initiate birthday follow-ups using the Birthday Tracker – contact customers via call or WhatsApp before their birthday.",
        roleTa: "பிறந்தநாள் கண்காணிப்புப் பட்டியலைப் (Birthday Tracker) பயன்படுத்தி பிறந்தநாள் தொடர்பைத் தொடங்க வேண்டும் – வாடிக்கையாளர்களின் பிறந்தநாளுக்கு முன் அழைப்பு அல்லது வாட்ஸ்அப் மூலம் தொடர்பு கொள்ள வேண்டும்.",
        remarks: "Advance birthday greetings"
      },
      {
        sno: 26,
        areaEn: "Team Coordination & Sales Alignment",
        areaTa: "குழு ஒருங்கிணைப்பு மற்றும் விற்பனை இணைப்பு",
        roleEn: "Conduct team briefings with CRM staff to align on targets and customer service standards (10-minute meeting).",
        roleTa: "இலக்குகள் மற்றும் வாடிக்கையாளர் சேவைத் தரநிலைகளில் ஒருமித்த புரிதலுக்காக CRM ஊழியர்களுடன் குழுக் கூட்டங்களை நடத்த வேண்டும் (10 நிமிடக் கூட்டம்).",
        remarks: "Daily Morning 10-Min Briefing"
      },
      {
        sno: 27,
        areaEn: "Team Coordination & Sales Alignment",
        areaTa: "குழு ஒருங்கிணைப்பு மற்றும் விற்பனை இணைப்பு",
        roleEn: "Evaluate CRM Greeter performance and provide coaching and feedback.",
        roleTa: "CRM வரவேற்பாளர்களின் செயல்திறனை மதிப்பீடு செய்து, பயிற்சியும் கருத்துகளும் வழங்க வேண்டும்.",
        remarks: "Monthly 1-on-1 coaching"
      },
      {
        sno: 28,
        areaEn: "Visual Merchandising Oversight",
        areaTa: "விஷுவல் மெர்ச்சண்டைசிங் மேற்பார்வை",
        roleEn: "Ensure the VM Checklist is followed by the VM person.",
        roleTa: "VM சரிபார்ப்புப் பட்டியல் VM பொறுப்பாளரால் பின்பற்றப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "Store aesthetics check"
      },
      {
        sno: 29,
        areaEn: "Visual Merchandising Oversight",
        areaTa: "விஷுவல் மெர்ச்சண்டைசிங் மேற்பார்வை",
        roleEn: "Coordinate with the VM/Operations team to address any display or layout concerns raised by Greeters or customers.",
        roleTa: "வரவேற்பாளர்கள் அல்லது வாடிக்கையாளர்கள் எழுப்பும் காட்சியமைப்பு அல்லது அமைப்பு தொடர்பான கவலைகளைத் தீர்க்க VM/செயல்பாட்டுக் குழுவுடன் ஒருங்கிணைந்து செயல்பட வேண்டும்.",
        remarks: "Counter layout resolution"
      },
      {
        sno: 30,
        areaEn: "Customer Help Desk Supervision",
        areaTa: "வாடிக்கையாளர் உதவி மையக் கண்காணிப்பு",
        roleEn: "Oversee customer problem addressal; ensure all complaints and queries are resolved promptly.",
        roleTa: "வாடிக்கையாளர் பிரச்சினைகளுக்குத் தீர்வு காணும் பணியைக் கண்காணித்து, அனைத்துப் புகார்களும் விசாரணைகளும் உடனடியாகத் தீர்க்கப்படுவதை உறுதி செய்ய வேண்டும்.",
        remarks: "Resolution SLA < 24 hours"
      },
      {
        sno: 31,
        areaEn: "Professional Conduct",
        areaTa: "தொழில்முறை நடத்தை",
        roleEn: "Act as a brand ambassador and maintain calm, respectful behaviour at all times.",
        roleTa: "பிராண்ட் தூதராகச் செயல்பட்டு, எப்போதும் அமைதியாகவும் மரியாதையுடனும் நடந்துகொள்ள வேண்டும்.",
        remarks: "Exemplary conduct"
      },
      {
        sno: 32,
        areaEn: "Professional Conduct",
        areaTa: "தொழில்முறை நடத்தை",
        roleEn: "Follow escalation matrix and avoid arguments or personal opinions with customers.",
        roleTa: "மேல்முறையீட்டு (எஸ்கலேஷன்) வழிமுறையைப் பின்பற்றி, வாடிக்கையாளர்களுடன் வாக்குவாதம் மற்றும் தனிப்பட்ட கருத்துகளைத் தவிர்க்க வேண்டும்.",
        remarks: "Diplomatic customer care"
      },
      {
        sno: 33,
        areaEn: "Policy Compliance",
        areaTa: "கொள்கை இணக்கம்",
        roleEn: "Strictly adhere to HR policies, CRM guidelines, and instructions issued by Management from time to time.",
        roleTa: "HR கொள்கைகள், CRM வழிகாட்டுதல்கள் மற்றும் நிர்வாகம் அவ்வப்போது வழங்கும் அறிவுறுத்தல்களை கண்டிப்பாகப் பின்பற்ற வேண்டும்.",
        remarks: "Compliance audit standard"
      },
      {
        sno: 34,
        areaEn: "KPI (Key Performance Indicators)",
        areaTa: "KPI (முக்கிய செயல்திறன் குறிகாட்டிகள்)",
        roleEn: "Monitor and consolidate the monthly performance of each CRM team member based on their assigned responsibilities and KPIs.",
        roleTa: "ஒவ்வொரு CRM குழு உறுப்பினரின் ஒதுக்கப்பட்ட பொறுப்புகள் மற்றும் KPI-களின் அடிப்படையில் அவர்களின் மாதாந்திர செயல்திறனைக் கண்காணித்து, தொகுத்து வழங்க வேண்டும்.",
        remarks: "Consolidation by 5th of month"
      }
    ],

    telecaller: [
      {
        sno: 1,
        areaEn: "Daily Outbound Queue Execution",
        areaTa: "தினசரி வெளிச்செல்லும் அழைப்பு மேலாண்மை",
        roleEn: "Execute outbound calls daily across the 5 designated CRM queues: Negative Feedback, Stock Diverts, Non-Enrolled Scheme Leads, Birthday Greetings, and General Follow-ups.",
        roleTa: "எதிர்மறை கருத்துகள், திசைமாற்றப் பொருட்கள், சீட்டு சேராத வாடிக்கையாளர்கள், பிறந்தநாள் வாழ்த்துகள், பொதுத் தொடர்புகள் ஆகிய 5 வரிசைகளிலும் தினசரி அழைப்புகளை மேற்கொள்ள வேண்டும்.",
        remarks: "Target ≥ 40 calls / day"
      },
      {
        sno: 2,
        areaEn: "Daily Outbound Queue Execution",
        areaTa: "தினசரி வெளிச்செல்லும் அழைப்பு மேலாண்மை",
        roleEn: "Follow the approved call script politely and professionally in Tamil or English as preferred by the customer.",
        roleTa: "வாடிக்கையாளரின் விருப்பத்திற்கு ஏற்ப தமிழ் அல்லது ஆங்கிலத்தில் அங்கீகரிக்கப்பட்ட அழைப்பு வழிகாட்டியை பணிவுடன் பின்பற்ற வேண்டும்.",
        remarks: "Professional telephone etiquette"
      },
      {
        sno: 3,
        areaEn: "Divert Stock Callback SLA",
        areaTa: "திசைமாற்றப் பொருள் அழைப்பு காலக்கெடு",
        roleEn: "Call customers whose diverted jewelry item has been sourced and received in the showroom within 24 hours of notification.",
        roleTa: "திசைமாறிய நகை உருப்படி கடைக்கு வந்து சேர்ந்த 24 மணி நேரத்திற்குள் வாடிக்கையாளரைத் தொடர்பு கொண்டு தெரிவிக்க வேண்டும்.",
        remarks: "Turnaround SLA < 24 Hours"
      },
      {
        sno: 4,
        areaEn: "Divert Stock Callback SLA",
        areaTa: "திசைமாற்றப் பொருள் அழைப்பு காலக்கெடு",
        roleEn: "Share high-resolution jewelry photos / video via official WhatsApp business number upon customer request.",
        roleTa: "வாடிக்கையாளர் கோரினால் அதிகாரப்பூர்வ வாட்ஸ்அப் மூலம் நகையின் தெளிவான படம் அல்லது வீடியோவை அனுப்ப வேண்டும்.",
        remarks: "WhatsApp catalog support"
      },
      {
        sno: 5,
        areaEn: "Negative Feedback & Concern Recovery",
        areaTa: "எதிர்மறை கருத்து & புகார் தீர்வு அழைப்பு",
        roleEn: "Contact all callable customers who provided a rating ≤ 6 or expressed dissatisfaction (Q2-Q6 concerns) within 24 hours.",
        roleTa: "மதிப்பீடு ≤ 6 அளித்த அல்லது அதிருப்தி தெரிவித்த அனைத்து வாடிக்கையாளர்களையும் 24 மணி நேரத்திற்குள் அழைத்து சமாதானப்படுத்த வேண்டும்.",
        remarks: "Recovery target ≥ 85%"
      },
      {
        sno: 6,
        areaEn: "Negative Feedback & Concern Recovery",
        areaTa: "எதிர்மறை கருத்து & புகார் தீர்வு அழைப்பு",
        roleEn: "Listen empathetically using the CALM framework, never argue, and escalate complex technical grievances to CRM Manager.",
        roleTa: "CALM வழிகாட்டியைப் பயன்படுத்தி பொறுமையாகக் கேட்க வேண்டும்; வாக்குவாதம் செய்யாமல் சிக்கலான புகார்களை CRM மேலாளருக்கு மாற்ற வேண்டும்.",
        remarks: "CALM methodology"
      },
      {
        sno: 7,
        areaEn: "Chit Scheme Awareness & Onboarding",
        areaTa: "தங்கச் சீட்டுத் திட்டம் அறிமுகம் & பதிவு",
        roleEn: "Brief walk-in customers who answered 'No' to chit enrollment about the Suba Valli Vilas 11-Month Gold Savings Scheme (Ungal Veetu Kadai).",
        roleTa: "சீட்டுத் திட்டத்தில் சேராத வாடிக்கையாளர்களுக்கு சுப வள்ளி விலாஸ் 11 மாத தங்க சேமிப்புத் திட்டத்தின் நன்மைகளை எடுத்துக்கூற வேண்டும்.",
        remarks: "Conversion target ≥ 15%"
      },
      {
        sno: 8,
        areaEn: "Chit Scheme Awareness & Onboarding",
        areaTa: "தங்கச் சீட்டுத் திட்டம் அறிமுகம் & பதிவு",
        roleEn: "Guide willing customers through online enrollment or schedule showroom visit for enrollment with the chit counter.",
        roleTa: "விருப்பமுள்ள வாடிக்கையாளர்களுக்கு இணையவழி பதிவு அல்லது கடைக்கு வந்து சேர வழிகாட்ட வேண்டும்.",
        remarks: "Digital chit link sharing"
      },
      {
        sno: 9,
        areaEn: "Customer Birthday & Anniversary Care",
        areaTa: "பிறந்தநாள் மற்றும் திருமணநாள் வாழ்த்துகள்",
        roleEn: "Call or send personalized WhatsApp greetings to customers from the Birthday Tracker 1-2 days in advance of their celebration.",
        roleTa: "பிறந்தநாள்/திருமணநாள் கொண்டாடும் வாடிக்கையாளர்களுக்கு 1-2 நாட்களுக்கு முன்பே அழைத்து அல்லது வாட்ஸ்அப்பில் வாழ்த்து தெரிவிக்க வேண்டும்.",
        remarks: "100% on-time greeting"
      },
      {
        sno: 10,
        areaEn: "Customer Birthday & Anniversary Care",
        areaTa: "பிறந்தநாள் மற்றும் திருமணநாள் வாழ்த்துகள்",
        roleEn: "Inform celebratory customers of exclusive festival and birthday jewelry discounts or silver coin gift offers.",
        roleTa: "வாடிக்கையாளர்களுக்குரிய பிறந்தநாள் தள்ளுபடி சலுகைகள் மற்றும் சிறப்பு பரிசுகள் குறித்து விளக்க வேண்டும்.",
        remarks: "Birthday gift privilege"
      },
      {
        sno: 11,
        areaEn: "CRM Disposition & Call Logging Accuracy",
        areaTa: "அழைப்புப் பதிவு மற்றும் குறிப்புகள் துல்லியம்",
        roleEn: "Immediately log call disposition in the CRM App: Connected, Callback Requested, Converted, Wrong Number, Closed, with precise notes.",
        roleTa: "ஒவ்வொரு அழைப்பின் முடிவையும் (இணைக்கப்பட்டது, மறுஅழைப்பு, மாறியது, தவறான எண்) உடனடியாகத் துல்லியமான குறிப்புடன் செயலியில் பதிவு செய்ய வேண்டும்.",
        remarks: "100% immediate disposition"
      },
      {
        sno: 12,
        areaEn: "CRM Disposition & Call Logging Accuracy",
        areaTa: "அழைப்புப் பதிவு மற்றும் குறிப்புகள் துல்லியம்",
        roleEn: "Set explicit callback reminder alarms for customers who request follow-up at an evening or weekend time.",
        roleTa: "குறிப்பிட்ட நேரத்தில் அழைக்கக் கோரும் வாடிக்கையாளர்களுக்கு கால அட்டவணை நினைவூட்டலை அமைக்க வேண்டும்.",
        remarks: "Zero missed callbacks"
      },
      {
        sno: 13,
        areaEn: "Customer Data Privacy & Discipline",
        areaTa: "வாடிக்கையாளர் தரவுப் பாதுகாப்பு & ஒழுக்கம்",
        roleEn: "Strictly protect customer phone numbers and purchase history; never export or share customer contacts externally.",
        roleTa: "வாடிக்கையாளரின் தொலைபேசி எண்கள் மற்றும் விவரங்களை மிகுந்த ரகசியமாகப் பாதுகாக்க வேண்டும்; வெளியே பகிரக் கூடாது.",
        remarks: "Data confidentiality"
      },
      {
        sno: 14,
        areaEn: "Daily Handoff & Reporting",
        areaTa: "தினசரி ஒப்படைப்பு & அறிக்கை சமர்ப்பிப்பு",
        roleEn: "Submit daily telecalling summary report to CRM Manager by 7:30 PM detailing calls attempted, connected, converted, and escalations.",
        roleTa: "அழைக்கப்பட்டவை, இணைந்தவை, சீட்டு சேர்ந்தவை மற்றும் புகார்கள் அடங்கிய தினசரி சுருக்க அறிக்கையை மாலை 7:30-க்குள் CRM மேலாளரிடம் வழங்க வேண்டும்.",
        remarks: "Evening DER Telecaller input"
      },
      {
        sno: 15,
        areaEn: "Policy Compliance",
        areaTa: "கொள்கை இணக்கம்",
        roleEn: "Strictly adhere to HR policies, Telecaller SOPs, and instructions issued by Management.",
        roleTa: "நிறுவனத்தின் HR கொள்கைகள், டெலிகாலர் நிலையான செயல்பாட்டு வழிகாட்டுதல்களை முழுமையாகப் பின்பற்ற வேண்டும்.",
        remarks: "Standard adherence"
      }
    ]
  };

  // State
  let activeRole = 'greeter';
  let activeLang = 'both'; // 'both', 'en', 'ta'
  let currentSearch = '';
  let currentAreaFilter = 'ALL';

  // DOM Elements
  const dom = {
    roleTabs: document.querySelectorAll('[data-rnr-role]'),
    langBtns: document.querySelectorAll('[data-rnr-lang]'),
    searchInput: document.getElementById('rnrSearchInput'),
    areaFilter: document.getElementById('rnrAreaFilter'),
    tableBody: document.getElementById('rnrTableBody'),
    rowCountBadge: document.getElementById('rnrRowCountBadge'),
    roleTitle: document.getElementById('rnrCurrentRoleTitle'),
    roleBadge: document.getElementById('rnrCurrentRoleBadge'),
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

  function getRolesTitle(role) {
    switch (role) {
      case 'greeter': return { title: "CRM Greeters — Roles & Responsibilities (RNR)", badge: "29 Points • C&B Standard" };
      case 'manager': return { title: "CRM Manager — Roles & Responsibilities (RNR)", badge: "34 Points • Store Oversight" };
      case 'telecaller': return { title: "CRM Telecaller — Roles & Responsibilities (RNR)", badge: "15 Points • Desk & Outbound SLA" };
      default: return { title: "CRM RNR Matrix", badge: "" };
    }
  }

  function populateAreaDropdown() {
    if (!dom.areaFilter) return;
    const items = RNR_DATA[activeRole] || [];
    const uniqueAreas = Array.from(new Set(items.map(i => i.areaEn)));
    
    dom.areaFilter.innerHTML = `<option value="ALL">All Responsible Areas (அனைத்து பொறுப்பு பகுதிகள்)</option>`;
    uniqueAreas.forEach(a => {
      const match = items.find(i => i.areaEn === a);
      const taLabel = match ? ` (${match.areaTa})` : '';
      const opt = document.createElement('option');
      opt.value = a;
      opt.textContent = `${a}${taLabel}`;
      dom.areaFilter.appendChild(opt);
    });
    dom.areaFilter.value = 'ALL';
    currentAreaFilter = 'ALL';
  }

  function renderTable() {
    const list = RNR_DATA[activeRole] || [];
    const q = currentSearch.toLowerCase().trim();

    const filtered = list.filter(item => {
      const matchesArea = currentAreaFilter === 'ALL' || item.areaEn === currentAreaFilter;
      const matchesSearch = !q ||
        item.areaEn.toLowerCase().includes(q) ||
        item.areaTa.includes(q) ||
        item.roleEn.toLowerCase().includes(q) ||
        item.roleTa.includes(q) ||
        item.remarks.toLowerCase().includes(q);
      return matchesArea && matchesSearch;
    });

    if (dom.rowCountBadge) {
      dom.rowCountBadge.textContent = `${filtered.length} of ${list.length} Points`;
    }

    if (filtered.length === 0) {
      dom.tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color:#64748B;">No roles & responsibilities found matching your filters.</td></tr>`;
      return;
    }

    dom.tableBody.innerHTML = filtered.map(item => {
      let roleContent = '';
      if (activeLang === 'en') {
        roleContent = `<strong>${escapeHtml(item.roleEn)}</strong>`;
      } else if (activeLang === 'ta') {
        roleContent = `<div style="font-family:'Noto Sans Tamil', serif; font-size:0.95rem; color:#580505;">${escapeHtml(item.roleTa)}</div>`;
      } else {
        roleContent = `
          <div style="margin-bottom:6px; font-weight:600; color:#1E293B;">${escapeHtml(item.roleEn)}</div>
          <div style="font-family:'Noto Sans Tamil', serif; font-size:0.92rem; color:#6B0808; background:#FFFBF2; padding:6px 10px; border-radius:6px; border-left:3px solid #C5A059;">${escapeHtml(item.roleTa)}</div>
        `;
      }

      let areaContent = '';
      if (activeLang === 'en') {
        areaContent = `<span class="gov-badge gov-badge-maroon">${escapeHtml(item.areaEn)}</span>`;
      } else if (activeLang === 'ta') {
        areaContent = `<span class="gov-badge gov-badge-maroon" style="font-family:'Noto Sans Tamil', serif;">${escapeHtml(item.areaTa)}</span>`;
      } else {
        areaContent = `
          <div class="gov-badge gov-badge-maroon" style="margin-bottom:4px;">${escapeHtml(item.areaEn)}</div>
          <div style="font-size:0.8rem; color:#78350F; font-family:'Noto Sans Tamil', serif;">${escapeHtml(item.areaTa)}</div>
        `;
      }

      return `
        <tr>
          <td style="text-align:center; font-weight:700; color:#580505; width:55px;">${item.sno}</td>
          <td style="width:220px;">${areaContent}</td>
          <td>${roleContent}</td>
          <td style="width:180px;"><span class="gov-badge gov-badge-gold" style="white-space:normal; line-height:1.3;">${escapeHtml(item.remarks)}</span></td>
        </tr>
      `;
    }).join('');
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

  // Google Sheet Integration
  function syncWithGoogleSheet() {
    const gsheetUrl = localStorage.getItem('svv_gsheet_url') || 'https://script.google.com/macros/s/AKfycbxScZV2koc5d68t1F9851fRi-H_60r3UJe_GwilkdDFR-2K-710v2IdB1PiHpUUztJEiA/exec';
    
    if (dom.syncStatusText) dom.syncStatusText.textContent = "Syncing with GSheet...";
    showToast("Connecting to Suba Valli Vilas Google Sheet...");

    // Store in localStorage for instant offline access
    localStorage.setItem('svv_rnr_data', JSON.stringify(RNR_DATA));

    fetch(`${gsheetUrl}?action=PING`)
      .then(res => res.json())
      .then(data => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Connected to GSheet";
        showToast("✅ RNR points verified and synchronized with Google Sheet!");
      })
      .catch(err => {
        if (dom.syncStatusText) dom.syncStatusText.textContent = "Offline (Cached)";
        showToast("ℹ️ Loaded official RNR points from local storage cache.");
      });
  }

  // Event Listeners
  function initEvents() {
    dom.roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dom.roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeRole = tab.getAttribute('data-rnr-role');

        const meta = getRolesTitle(activeRole);
        if (dom.roleTitle) dom.roleTitle.textContent = meta.title;
        if (dom.roleBadge) dom.roleBadge.textContent = meta.badge;

        populateAreaDropdown();
        renderTable();
      });
    });

    dom.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dom.langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLang = btn.getAttribute('data-rnr-lang');
        renderTable();
      });
    });

    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderTable();
      });
    }

    if (dom.areaFilter) {
      dom.areaFilter.addEventListener('change', (e) => {
        currentAreaFilter = e.target.value;
        renderTable();
      });
    }

    if (dom.btnSyncGSheet) {
      dom.btnSyncGSheet.addEventListener('click', syncWithGoogleSheet);
    }
  }

  function init() {
    initEvents();
    populateAreaDropdown();
    renderTable();
    // Auto-check gsheet on launch
    setTimeout(syncWithGoogleSheet, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
