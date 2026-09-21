/**
 * ==========================================================================
 * SUBA VALLI VILAS - STANDALONE CUSTOMER FEEDBACK PORTAL LOGIC (feedback.js)
 * Designed for phone scanning via QR codes across all showroom mediums.
 * ==========================================================================
 */

(function () {
  'use strict';

  // State
  const state = {
    currentLang: 'en',
    rating: 10,
    mood: 'Appreciation',
    urlParams: {},
    isSubmitting: false,
    questionsConfig: []
  };

  // Built-in Default Questions Configuration (Matches Google Sheet FEEDBACK_QUESTIONS tab)
  const DEFAULT_QUESTIONS = [
    {
      q_id: 'Q0',
      display_order: 0,
      q_text_en: 'How often do you shop with us?',
      q_text_ta: 'எங்களுடன் எத்தனை முறை ஷாப்பிங் செய்கிறீர்கள்?',
      q_type: 'single_choice',
      options_en: ['First Visit', 'Occasionally', 'Monthly', 'Regular Customer'],
      options_ta: ['First Visit (முதல் முறை)', 'Occasionally (அவ்வப்போது)', 'Monthly (மாதந்தோறும்)', 'Regular Customer (வழக்கமான வாடிக்கையாளர்)'],
      is_mandatory: false,
      is_active: true
    },
    {
      q_id: 'Q1',
      display_order: 1,
      q_text_en: 'How did you hear about Suba Valli Vilas?',
      q_text_ta: 'சுபா வள்ளி விலாஸ் பற்றி உங்களுக்கு எப்படி தெரியும்?',
      q_type: 'single_choice',
      options_en: ['Friends & Relatives', 'Bill Boards/Hoardings', 'Social Media', 'TV/Radio', 'Newspaper'],
      options_ta: ['Friends & Relatives (நண்பர்கள்/உறவினர்கள்)', 'Bill Boards / Hoardings (விளம்பர பலகை)', 'Social Media (சமூக ஊடகம்)', 'TV / Radio / FM', 'Newspaper (செய்திதாள்)'],
      is_mandatory: true,
      is_active: true
    },
    {
      q_id: 'Q2',
      display_order: 2,
      q_text_en: 'What did you like the most about Suba Valli Vilas?',
      q_text_ta: 'சுபா வள்ளி விலாஸில் உங்களுக்கு மிகவும் பிடித்தது எது?',
      q_type: 'single_choice',
      options_en: ['Design Collections & Variety', 'Staff Hospitality & Explanation', '916 Purity & Trust', 'Transparent Pricing & V.A', 'Store Ambiance'],
      options_ta: ['Design Collections & Variety (நகை கலெக்ஷன்)', 'Staff Hospitality & Explanation (உபசரிப்பு)', '916 Purity & Trust (தூய்மை & நம்பிக்கை)', 'Transparent Pricing & V.A (சேதாரம்)', 'Store Ambiance (கடை சூழல்)'],
      is_mandatory: true,
      is_active: true
    },
    {
      q_id: 'Q3',
      display_order: 3,
      q_text_en: 'What could we improve about our service?',
      q_text_ta: 'எங்கள் சேவையில் நீங்கள் எதை மேம்படுத்த விரும்புகிறீர்கள்?',
      q_type: 'single_choice',
      options_en: ['Everything is Excellent', 'Faster Billing', 'More Lightweight Designs', 'More Antique Pieces', 'Parking Facility'],
      options_ta: ['Everything is Excellent (அனைத்தும் நன்று)', 'Faster Billing (விரைவான பில்லிங்)', 'More Lightweight Designs (எடை குறைந்த நகைகள்)', 'More Antique Pieces (ஆண்டிக் நகைகள்)', 'Parking Facility (வாகன நிறுத்தம்)'],
      is_mandatory: false,
      is_active: true
    },
    {
      q_id: 'Q4',
      display_order: 4,
      q_text_en: 'What occasion do you purchase for?',
      q_text_ta: 'நீங்கள் எந்த சுப நிகழ்ச்சிக்கு நகை வாங்குகிறீர்கள்?',
      q_type: 'single_choice',
      options_en: ['Wedding / Bridal', 'Festival', 'Birthday / Anniversary', 'Monthly Savings', 'Gifts'],
      options_ta: ['Wedding / Bridal (திருமணம்)', 'Festival (தீபாவளி/பொங்கல்/அட்சய திருதியை)', 'Birthday / Anniversary (பிறந்தநாள்/திருமணநாள்)', 'Monthly Savings / Investment (சேமிப்பு)', 'Gift / Casual Purchase (பரிசு)'],
      is_mandatory: true,
      is_active: true
    },
    {
      q_id: 'Q5',
      display_order: 5,
      q_text_en: 'Are you aware of our Suba Valli Vilas Gold Chit Schemes?',
      q_text_ta: 'எங்கள் தங்க நகை சேமிப்பு திட்டம் (சிட்) பற்றி உங்களுக்கு தெரியுமா?',
      q_type: 'single_choice',
      options_en: ['Yes - Already Enrolled', 'Yes - Aware but not joined', 'No - Please explain scheme'],
      options_ta: ['Yes - Already Enrolled (ஏற்கனவே சேர்ந்துள்ளேன்)', 'Yes - Aware but not joined (தெரியும், சேரவில்லை)', 'No - Please explain scheme (தெரியாது, விவரம் தேவை)'],
      is_mandatory: true,
      is_active: true
    }
  ];

  // Translations dictionary for 5 languages
  const I18N = {
    en: {
      brandSub: 'Jewellery • Since 1948 • Cuddalore',
      npsTitle: 'How likely are you to recommend Suba Valli Vilas? *',
      npsSub: '1 to 10 recommendation scale',
      lblNotLikely: '1 = Not at all likely',
      lblExtremelyLikely: '10 = Extremely likely',
      moodTitle: 'Your Overall Experience Category *',
      moodSub: 'Select the nature of your visit feedback',
      moodApprec: 'Appreciation',
      moodApprecSub: 'Delighted Experience',
      moodFeedback: 'Feedback',
      moodFeedbackSub: 'Helpful Suggestion',
      moodConcern: 'Concern',
      moodConcernSub: 'Requires Attention',
      storeExpTitle: 'Store Experience & Delight Questions',
      storeExpSub: 'Help us serve you with perfection',
      lblQ0: 'How often do you shop with us?',
      lblQ0Sub: 'Customer loyalty frequency',
      lblQ1: 'How did you hear about Suba Valli Vilas? *',
      lblQ1Sub: 'Marketing attribution',
      lblQ2: 'What did you like the most about Suba Valli Vilas? *',
      lblQ2Sub: 'Showroom strengths',
      lblQ3: 'What could we improve about our service?',
      lblQ3Sub: 'Service refinement',
      lblQ4: 'What occasion do you purchase for? *',
      lblQ4Sub: 'Celebration timeline',
      lblQ5: 'Are you aware of our Suba Valli Vilas Gold Chit Schemes? *',
      lblQ5Sub: '11-month gold savings schemes',
      custDetailsTitle: 'Customer Details & Remarks',
      custDetailsSub: 'For billing verification & personalized wishes',
      lblName: 'Your Full Name *',
      lblMobile: 'Mobile Number * (10 Digits)',
      lblCity: 'City / Town / Area',
      lblOccasion: 'Upcoming Birthday or Anniversary Date (For Special Offers)',
      lblRemarks: 'Your Valuable Remarks or Staff Appreciation',
      lblRemarksSub: 'Tell us about your showroom visit, staff service, or jewelry selections...',
      btnSubmit: '✨ Submit Feedback',
      thankYouTitle: 'Thank You for Visiting!',
      thankYouDesc: 'Your feedback has been received directly by the management desk. We deeply cherish your relationship with Suba Valli Vilas.'
    },
    ta: {
      brandSub: 'பாரம்பரிய 916 தங்க நகை மாளிகை • கடலூர்',
      npsTitle: 'சுபா வள்ளி விலாஸை உங்கள் நண்பர்கள் அல்லது குடும்பத்தினருக்கு பரிந்துரைக்க எவ்வளவு வாய்ப்புள்ளது? *',
      npsSub: '1 முதல் 10 வரை மதிப்பிடுங்கள்',
      lblNotLikely: '1 = வாய்ப்பில்லை (குறைவு)',
      lblExtremelyLikely: '10 = நிச்சயமாக (முழு திருப்தி)',
      moodTitle: 'உங்கள் ஒட்டுமொத்த அனுபவ வகை *',
      moodSub: 'உங்கள் கருத்தின் வகையைத் தேர்வு செய்யவும்',
      moodApprec: 'பாராட்டு',
      moodApprecSub: 'மகிழ்ச்சியான அனுபவம்',
      moodFeedback: 'பின்னூட்டம்',
      moodFeedbackSub: 'ஆலோசனை / கருத்து',
      moodConcern: 'குறைபாடு',
      moodConcernSub: 'மேம்படுத்த வேண்டியவை',
      storeExpTitle: 'கடை அனுபவம் மற்றும் திருப்தி கேள்விகள்',
      storeExpSub: 'எங்கள் சேவையை மெருகேற்ற உதவுங்கள்',
      lblQ0: 'எங்களுடன் எத்தனை முறை ஷாப்பிங் செய்கிறீர்கள்?',
      lblQ0Sub: 'வாடிக்கையாளர் வருகை முறை',
      lblQ1: 'சுபா வள்ளி விலாஸ் பற்றி உங்களுக்கு எப்படி தெரியும்? *',
      lblQ1Sub: 'விளம்பர ஊடகம்',
      lblQ2: 'சுபா வள்ளி விலாஸில் உங்களுக்கு மிகவும் பிடித்தது எது? *',
      lblQ2Sub: 'சிறப்பு அம்சங்கள்',
      lblQ3: 'எங்கள் சேவையில் நீங்கள் எதை மேம்படுத்த விரும்புகிறீர்கள்?',
      lblQ3Sub: 'சேவை மேம்பாடு',
      lblQ4: 'நீங்கள் எந்த சுப நிகழ்ச்சிக்கு நகை வாங்குகிறீர்கள்? *',
      lblQ4Sub: 'சுப நிகழ்வு விவரம்',
      lblQ5: 'எங்கள் தங்க நகை சேமிப்பு திட்டம் (சிட்) பற்றி உங்களுக்கு தெரியுமா? *',
      lblQ5Sub: '11 மாத தங்க நகை திட்டம்',
      custDetailsTitle: 'வாடிக்கையாளர் விவரங்கள் & கருத்துகள்',
      custDetailsSub: 'வாழ்த்துக்கள் மற்றும் சிறப்பு சலுகைகளுக்கு',
      lblName: 'உங்கள் முழு பெயர் *',
      lblMobile: 'கைபேசி எண் * (10 இலக்கங்கள்)',
      lblCity: 'ஊர் / நகரம் / பகுதி',
      lblOccasion: 'பிறந்தநாள் அல்லது திருமண நாள் தேதி',
      lblRemarks: 'உங்கள் கருத்துகள் அல்லது பாராட்டுக்களைப் பகிருங்கள்',
      lblRemarksSub: 'நகை வேலைப்பாடு மற்றும் ஊழியர்களின் உபசரிப்பு பற்றி குறிப்பிடவும்...',
      btnSubmit: '✨ கருத்தைப் பதிவு செய்',
      thankYouTitle: 'மிக்க நன்றி!',
      thankYouDesc: 'உங்கள் மேலான கருத்துகள் நிர்வாக அலுவலகத்திற்கு நேரடியாக அனுப்பி வைக்கப்பட்டுள்ளன. உங்கள் ஆதரவுக்கு சுபா வள்ளி விலாஸின் மனமார்ந்த நன்றிகள்.'
    },
    hi: {
      brandSub: 'पारंपरिक 916 सोने के आभूषण • कुड्डालोर',
      npsTitle: 'क्या आप सूबा वल्ली विलास की सिफारिश दूसरों से करेंगे? *',
      npsSub: '1 से 10 तक रेटिंग दें',
      lblNotLikely: '1 = बिल्कुल नहीं',
      lblExtremelyLikely: '10 = निश्चित रूप से',
      moodTitle: 'आपका समग्र अनुभव वर्ग *',
      moodSub: 'अपनी प्रतिक्रिया की श्रेणी चुनें',
      moodApprec: 'सराहना',
      moodApprecSub: 'उत्कृष्ट अनुभव',
      moodFeedback: 'प्रतिक्रिया',
      moodFeedbackSub: 'सुझाव',
      moodConcern: 'चिंता / कमी',
      moodConcernSub: 'ध्यान देने योग्य',
      storeExpTitle: 'स्टोर अनुभव प्रश्न',
      storeExpSub: 'आपकी राय हमारे लिए अनमोल है',
      lblQ0: 'आप हमारे यहां कितनी बार आते हैं?',
      lblQ0Sub: 'खरीदारी की आवृत्ति',
      lblQ1: 'सूबा वल्ली विलास के बारे में कैसे जाना? *',
      lblQ1Sub: 'प्रचार स्रोत',
      lblQ2: 'आपको सबसे ज्यादा क्या पसंद आया? *',
      lblQ2Sub: 'स्टोर की खासियत',
      lblQ3: 'हम अपनी सेवा में क्या सुधार कर सकते हैं?',
      lblQ3Sub: 'सेवा में सुधार',
      lblQ4: 'किस अवसर के लिए आभूषण खरीद रहे हैं? *',
      lblQ4Sub: 'शुभ अवसर',
      lblQ5: 'क्या आप गोल्ड चिट बचत योजना से अवगत हैं? *',
      lblQ5Sub: '11 महीने की बचत योजना',
      custDetailsTitle: 'ग्राहक विवरण एवं टिप्पणी',
      custDetailsSub: 'विशेष शुभकामनाओं के लिए',
      lblName: 'आपका पूरा नाम *',
      lblMobile: 'मोबाइल नंबर * (10 अंक)',
      lblCity: 'शहर / क्षेत्र',
      lblOccasion: 'जन्मदिन या शादी की वर्षगांठ',
      lblRemarks: 'आपकी बहुमूल्य टिप्पणी या स्टाफ प्रशंसा',
      lblRemarksSub: 'स्टाफ सेवा या आभूषण डिजाइन के बारे में बताएं...',
      btnSubmit: '✨ प्रतिक्रिया दर्ज करें',
      thankYouTitle: 'हार्दिक धन्यवाद!',
      thankYouDesc: 'आपकी प्रतिक्रिया प्रबंधन तक पहुंच गई है। सूबा वल्ली विलास में पधारने के लिए बहुत-बहुत धन्यवाद।'
    },
    kn: {
      brandSub: 'ಸಾಂಪ್ರದಾಯಿಕ 916 ಚಿನ್ನದ ಆಭರಣಗಳು • ಕಡಲೂರು',
      npsTitle: 'ಸುಬಾ ವಲ್ಲಿ ವಿಲಾಸ್ ಅನ್ನು ಇತರರಿಗೆ ಶಿಫಾರಸು ಮಾಡುತ್ತೀರಾ? *',
      npsSub: '1 ರಿಂದ 10 ರವರೆಗೆ ರೇಟಿಂಗ್ ನೀಡಿ',
      lblNotLikely: '1 = ಖಂಡಿತ ಇಲ್ಲ',
      lblExtremelyLikely: '10 = ಖಂಡಿತವಾಗಿ',
      moodTitle: 'ನಿಮ್ಮ ಅನುಭವದ ವರ್ಗ *',
      moodSub: 'ಪ್ರತಿಕ್ರಿಯೆಯ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ',
      moodApprec: 'ಮೆಚ್ಚುಗೆ',
      moodApprecSub: 'ಅತ್ಯುತ್ತಮ ಅನುಭವ',
      moodFeedback: 'ಅಭಿಪ್ರಾಯ',
      moodFeedbackSub: 'ಸಲಹೆ',
      moodConcern: 'ನ್ಯೂನತೆ',
      moodConcernSub: 'ಗಮನಿಸಬೇಕಾದದ್ದು',
      storeExpTitle: 'ಅಂಗಡಿ ಅನುಭವ ಪ್ರಶ್ನೆಗಳು',
      storeExpSub: 'ಉತ್ತಮ ಸೇವೆಗಾಗಿ ನಿಮ್ಮ ಸಲಹೆ',
      lblQ0: 'ನೀವು ಎಷ್ಟು ಬಾರಿ ಶಾಪಿಂಗ್ ಮಾಡುತ್ತೀರಿ?',
      lblQ0Sub: 'ಭೇಟಿಯ ಆವರ್ತನ',
      lblQ1: 'ಸುಬಾ ವಲ್ಲಿ ವಿಲಾಸ್ ಬಗ್ಗೆ ಹೇಗೆ ತಿಳಿಯಿತು? *',
      lblQ1Sub: 'ಮಾಹಿತಿ ಮೂಲ',
      lblQ2: 'ನಿಮಗೆ ಹೆಚ್ಚು ಇಷ್ಟವಾದದ್ದು ಯಾವುದು? *',
      lblQ2Sub: 'ವಿಶೇಷತೆಗಳು',
      lblQ3: 'ನಾವು ಏನು ಸುಧಾರಿಸಬಹುದು?',
      lblQ3Sub: 'ಸೇವಾ ಸುಧಾರಣೆ',
      lblQ4: 'ಯಾವ ಸಂದರ್ಭಕ್ಕಾಗಿ ಖರೀದಿ? *',
      lblQ4Sub: 'ಶುಭ ಸಂದರ್ಭ',
      lblQ5: 'ಚಿನ್ನದ ಉಳಿತಾಯ ಚಿಟ್ ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿದಿದೆಯೇ? *',
      lblQ5Sub: '11 ತಿಂಗಳ ಉಳಿತಾಯ ಯೋಜನೆ',
      custDetailsTitle: 'ಗ್ರಾಹಕರ ವಿವರಗಳು & ಅಭಿಪ್ರಾಯ',
      custDetailsSub: 'ಶುಭಾಶಯಗಳು ಮತ್ತು ಕೊಡುಗೆಗಳಿಗಾಗಿ',
      lblName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು *',
      lblMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ * (10 ಅಂಕಿಗಳು)',
      lblCity: 'ಊರು / ನಗರ',
      lblOccasion: 'ಹುಟ್ಟುಹಬ್ಬ ಅಥವಾ ವಾರ್ಷಿಕೋತ್ಸವ ದಿನಾಂಕ',
      lblRemarks: 'ನಿಮ್ಮ ಅನಿಸಿಕೆ ಅಥವಾ ಮೆಚ್ಚುಗೆಯ ಮಾತುಗಳು',
      lblRemarksSub: 'ಸಿಬ್ಬಂದಿ ಸೇವೆ ಅಥವಾ ವಿನ್ಯಾಸಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ...',
      btnSubmit: '✨ ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
      thankYouTitle: 'ಧನ್ಯವಾದಗಳು!',
      thankYouDesc: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಸುಬಾ ವಲ್ಲಿ ವಿಲಾಸ್ ಜೊತೆಗಿನ ನಿಮ್ಮ ನಂಬಿಕೆಗೆ ನಮ್ಮ ಧನ್ಯವಾದಗಳು.'
    },
    ml: {
      brandSub: 'പരമ്പരാഗത 916 സ്വർണ്ണാഭരണങ്ങൾ • കടലൂർ',
      npsTitle: 'സുബ വള്ളി വിലാസ് മറ്റുള്ളവർക്ക് ശുപാർശ ചെയ്യുമോ? *',
      npsSub: '1 മുതൽ 10 വരെ റേറ്റിംഗ് നൽകുക',
      lblNotLikely: '1 = ഇല്ല',
      lblExtremelyLikely: '10 = തീർച്ചയായും',
      moodTitle: 'നിങ്ങളുടെ മൊത്തത്തിലുള്ള അനുഭവം *',
      moodSub: 'അനുഭവ തരം തിരഞ്ഞെടുക്കുക',
      moodApprec: 'അഭിനന്ദനം',
      moodApprecSub: 'സന്തോഷകരമായ അനുഭവം',
      moodFeedback: 'അഭിപ്രായം',
      moodFeedbackSub: 'നിർദ്ദേശം',
      moodConcern: 'പോരായ്മ',
      moodConcernSub: 'ശ്രദ്ധിക്കേണ്ടത്',
      storeExpTitle: 'ഷോറൂം അനുഭവ ചോദ്യങ്ങൾ',
      storeExpSub: 'മെച്ചപ്പെട്ട സേവനത്തിനായി',
      lblQ0: 'ഞങ്ങളോടൊപ്പം എത്ര തവണ ഷോപ്പിംഗ് നടത്തിയിട്ടുണ്ട്?',
      lblQ0Sub: 'സന്ദർശന ആവൃത്തി',
      lblQ1: 'സുബ വള്ളി വിലാസിനെക്കുറിച്ച് എങ്ങനെ അറിഞ്ഞു? *',
      lblQ1Sub: 'വിവര ഉറവിടം',
      lblQ2: 'നിങ്ങൾക്ക് ഏറ്റവും ഇഷ്ടപ്പെട്ടത് എന്താണ്? *',
      lblQ2Sub: 'പ്രത്യേകതകൾ',
      lblQ3: 'ഞങ്ങളുടെ സേവനത്തിൽ എന്താണ് മെച്ചപ്പെടുത്തേണ്ടത്?',
      lblQ3Sub: 'സേവന മെച്ചപ്പെടുത്തൽ',
      lblQ4: 'ഏത് ആഘോഷത്തിനാണ് വാങ്ങുന്നത്? *',
      lblQ4Sub: 'വിശേഷാവസരം',
      lblQ5: 'ഗോൾഡ് ചിട്ടി സേവിംഗ്സ് സ്കീമിനെക്കുറിച്ച് അറിയാമോ? *',
      lblQ5Sub: '11 മാസ സ്വർണ്ണ നിക്ഷേപം',
      custDetailsTitle: 'ഉപഭോക്തൃ വിവരങ്ങളും കുറിപ്പുകളും',
      custDetailsSub: 'ആശംസകൾക്കും ആനുകൂല്യങ്ങൾക്കുമായി',
      lblName: 'നിങ്ങളുടെ പൂർണ്ണ നാമം *',
      lblMobile: 'മൊബൈൽ നമ്പർ * (10 അക്കങ്ങൾ)',
      lblCity: 'സ്ഥലം / നഗരം',
      lblOccasion: 'ജന്മദിനം അല്ലെങ്കിൽ വിവാഹ വാർഷിക തീയതി',
      lblRemarks: 'നിങ്ങളുടെ വിലയേറിയ അഭിപ്രായങ്ങൾ',
      lblRemarksSub: 'സ്റ്റാഫ് സേവനത്തെക്കുറിച്ചോ ആഭരണങ്ങളെക്കുറിച്ചോ എഴുതുക...',
      btnSubmit: '✨ അഭിപ്രായം രേഖപ്പെടുത്തുക',
      thankYouTitle: 'ഹൃദ്യമായ നന്ദി!',
      thankYouDesc: 'നിങ്ങളുടെ അഭിപ്രായങ്ങൾ മാനേജ്മെന്റിലേക്ക് സമർപ്പിച്ചിരിക്കുന്നു. സുബ വള്ളി വിലാസ് സന്ദർശിച്ചതിന് നന്ദി.'
    }
  };

  // DOM Elements
  const dom = {
    form: document.getElementById('portalFeedbackForm'),
    thankYouCard: document.getElementById('thankYouCard'),
    btnSubmitAnother: document.getElementById('btnSubmitAnother'),
    btnSubmit: document.getElementById('btnSubmitFeedback'),
    langPills: document.querySelectorAll('.lang-pill'),
    npsButtons: document.querySelectorAll('.nps-btn'),
    npsInput: document.getElementById('npsRatingInput'),
    moodCards: document.querySelectorAll('.mood-radio-card'),
    contextTag: document.getElementById('portalContextTag'),
    contextText: document.getElementById('portalContextText'),
    chipsGroups: document.querySelectorAll('.chips-group'),
    // Inputs
    metaSource: document.getElementById('metaSource'),
    metaMedium: document.getElementById('metaMedium'),
    metaBranch: document.getElementById('metaBranch'),
    metaCounter: document.getElementById('metaCounter'),
    metaStaff: document.getElementById('metaStaff'),
    metaInvoice: document.getElementById('metaInvoice'),
    custName: document.getElementById('portalCustName'),
    custMobile: document.getElementById('portalCustMobile'),
    custCity: document.getElementById('portalCustCity'),
    custOccasionDate: document.getElementById('portalCustOccasionDate'),
    custRemarks: document.getElementById('portalCustRemarks')
  };

  // ================= DYNAMIC QUESTIONS & SCHEMA SYNC ENGINE =================
  function loadStoredQuestions() {
    try {
      const stored = localStorage.getItem('svv_feedback_questions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.questionsConfig = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading stored feedback questions:', e);
    }
    state.questionsConfig = [...DEFAULT_QUESTIONS];
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
      const showOnQr = String(row.Show_On_Customer_QR !== undefined ? row.Show_On_Customer_QR : (row.show_on_qr !== undefined ? row.show_on_qr : true)).toLowerCase() !== 'false';

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
        show_on_qr: showOnQr
      };
    });

    const filtered = mapped.filter(q => q.is_active && q.show_on_qr);
    filtered.sort((a, b) => a.display_order - b.display_order);

    if (filtered.length > 0) {
      state.questionsConfig = filtered;
      localStorage.setItem('svv_feedback_questions', JSON.stringify(filtered));
      renderDynamicQuestions();
      console.log(`[Portal Dynamic Engine] Applied ${filtered.length} live questions from Google Sheets!`);
    }
  }

  async function fetchQuestionsFromCloud() {
    const cfUrl = new URLSearchParams(window.location.search).get('cf') ||
                  localStorage.getItem('svv_cloudflare_worker_url') ||
                  '';
    const gsUrl = new URLSearchParams(window.location.search).get('gs') ||
                  localStorage.getItem('svv_gsheet_url') ||
                  '';

    if (!cfUrl && !gsUrl) return;

    try {
      let targetUrl = '';
      if (cfUrl) {
        targetUrl = `${cfUrl.replace(/\/+$/, '')}/api/questions`;
      } else {
        targetUrl = gsUrl.includes('?') ? `${gsUrl}&action=GET_QUESTIONS` : `${gsUrl}?action=GET_QUESTIONS`;
      }

      const res = await fetch(targetUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data.feedbackQuestions) && data.feedbackQuestions.length > 0) {
        applyFeedbackQuestionsFromSheet(data.feedbackQuestions);
      }
    } catch (err) {
      console.warn('Could not auto-fetch questions from cloud in customer portal:', err);
    }
  }

  function renderDynamicQuestions() {
    const container = document.getElementById('portalDynamicQuestionsList');
    if (!container) return;

    const activeList = (state.questionsConfig && state.questionsConfig.length > 0)
      ? state.questionsConfig.filter(q => q.is_active !== false)
      : DEFAULT_QUESTIONS;

    const lang = state.currentLang || 'en';
    const isTa = lang === 'ta';

    let html = '';
    activeList.forEach((q) => {
      let mainText = q.q_text_en;
      let subText = q.q_text_ta || '';

      if (isTa) {
        mainText = q.q_text_ta || q.q_text_en;
        subText = q.q_text_en || '';
      } else if (I18N[lang] && I18N[lang][`lbl${q.q_id}`]) {
        mainText = I18N[lang][`lbl${q.q_id}`];
        subText = I18N[lang][`lbl${q.q_id}Sub`] || q.q_text_ta || '';
      }

      const optsEn = q.options_en || [];
      const optsTa = q.options_ta || optsEn;
      const opts = (isTa && optsTa.length) ? optsTa : optsEn;

      const inputId = `${q.q_id.toLowerCase()}Input`;
      const existingInput = document.getElementById(inputId);
      const currentSelectedVal = existingInput ? existingInput.value : (optsEn[0] || '');

      html += `
        <div class="form-group mb-3 dynamic-portal-q" data-qid="${q.q_id}">
          <label class="portal-field-label">
            ${escapeHtml(mainText.replace(/\s*\*+\s*$/, ''))}${q.is_mandatory ? ' *' : ''}
          </label>
          ${subText ? `<span class="portal-field-sub">${escapeHtml(subText.replace(/\s*\*+\s*$/, ''))}</span>` : ''}
          <div class="chips-group" data-target="${inputId}">
            ${opts.map((optLabel, oIdx) => {
              const val = optsEn[oIdx] || optLabel;
              const isSelected = (val === currentSelectedVal) || (!currentSelectedVal && oIdx === 0);
              return `
                <span class="chip-item ${isSelected ? 'active' : ''}" data-value="${escapeHtml(val)}">
                  ${escapeHtml(optLabel)}
                </span>
              `;
            }).join('')}
          </div>
          <input type="hidden" id="${inputId}" name="${q.q_id.toLowerCase()}" value="${escapeHtml(currentSelectedVal || optsEn[0] || '')}">
        </div>
      `;
    });

    container.innerHTML = html;
    setupChipsSelection();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  function init() {
    parseUrlParameters();
    loadStoredQuestions();
    setupLanguageSwitcher();
    setupNPSButtons();
    setupMoodRadios();
    renderDynamicQuestions();
    setupFormSubmission();

    // Auto-fetch latest dynamic questions from Cloudflare / Google Sheets
    fetchQuestionsFromCloud();

    // Auto-sync when user returns from Google Sheets tab
    let lastSyncFocus = 0;
    window.addEventListener('focus', () => {
      const now = Date.now();
      if (now - lastSyncFocus > 15000) {
        lastSyncFocus = now;
        fetchQuestionsFromCloud();
      }
    });

    // Periodic auto-sync every 60 seconds
    setInterval(() => {
      fetchQuestionsFromCloud();
    }, 60000);
  }

  // Parse URL Parameters (Supports multi-medium QR links)
  function parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    state.urlParams = {
      source: params.get('source') || 'QR',
      medium: params.get('medium') || 'Billing Counter Standee',
      branch: params.get('branch') || 'Cuddalore (Main Branch)',
      counter: params.get('counter') || '',
      staff: params.get('staff') || '',
      invoice: params.get('invoice') || '',
      lang: params.get('lang') || 'en'
    };

    // Update hidden inputs
    if (dom.metaSource) dom.metaSource.value = state.urlParams.source;
    if (dom.metaMedium) dom.metaMedium.value = state.urlParams.medium;
    if (dom.metaBranch) dom.metaBranch.value = state.urlParams.branch;
    if (dom.metaCounter) dom.metaCounter.value = state.urlParams.counter;
    if (dom.metaStaff) dom.metaStaff.value = state.urlParams.staff;
    if (dom.metaInvoice) dom.metaInvoice.value = state.urlParams.invoice;

    // Display context tag if counter or staff is specified
    if (state.urlParams.counter || state.urlParams.staff || state.urlParams.medium) {
      let desc = state.urlParams.medium;
      if (state.urlParams.counter) desc += ` • ${state.urlParams.counter}`;
      if (state.urlParams.staff) desc += ` • Staff: ${state.urlParams.staff}`;
      if (dom.contextText) dom.contextText.textContent = desc;
      if (dom.contextTag) dom.contextTag.style.display = 'inline-flex';
    }

    // Language override from URL
    if (I18N[state.urlParams.lang]) {
      setLanguage(state.urlParams.lang);
    }
  }

  // Language Switcher
  function setupLanguageSwitcher() {
    dom.langPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const lang = pill.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  function setLanguage(lang) {
    if (!I18N[lang]) return;
    state.currentLang = lang;

    // Toggle active pill
    dom.langPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-lang') === lang);
    });

    const dict = I18N[lang];
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el && text) el.textContent = text;
    };

    setText('lblNpsTitle', dict.npsTitle);
    setText('lblNpsSub', dict.npsSub);
    setText('lblNotLikely', dict.lblNotLikely);
    setText('lblExtremelyLikely', dict.lblExtremelyLikely);
    setText('lblMoodTitle', dict.moodTitle);
    setText('lblMoodSub', dict.moodSub);
    setText('lblMoodApprec', dict.moodApprec);
    setText('lblMoodApprecSub', dict.moodApprecSub);
    setText('lblMoodFeedback', dict.moodFeedback);
    setText('lblMoodFeedbackSub', dict.moodFeedbackSub);
    setText('lblMoodConcern', dict.moodConcern);
    setText('lblMoodConcernSub', dict.moodConcernSub);
    setText('lblStoreExpTitle', dict.storeExpTitle);
    setText('lblStoreExpSub', dict.storeExpSub);
    setText('lblQ0', dict.lblQ0);
    setText('lblQ0Sub', dict.lblQ0Sub);
    setText('lblQ1', dict.lblQ1);
    setText('lblQ1Sub', dict.lblQ1Sub);
    setText('lblQ2', dict.lblQ2);
    setText('lblQ2Sub', dict.lblQ2Sub);
    setText('lblQ3', dict.lblQ3);
    setText('lblQ3Sub', dict.lblQ3Sub);
    setText('lblQ4', dict.lblQ4);
    setText('lblQ4Sub', dict.lblQ4Sub);
    setText('lblQ5', dict.lblQ5);
    setText('lblQ5Sub', dict.lblQ5Sub);
    setText('lblCustDetailsTitle', dict.custDetailsTitle);
    setText('lblCustDetailsSub', dict.custDetailsSub);
    setText('lblCustName', dict.lblName);
    setText('lblCustMobile', dict.lblMobile);
    setText('lblCustCity', dict.lblCity);
    setText('lblCustOccasionDate', dict.lblOccasion);
    setText('lblCustRemarks', dict.lblRemarks);
    setText('lblCustRemarksSub', dict.lblRemarksSub);
    setText('lblThankYouTitle', dict.thankYouTitle);
    setText('lblThankYouDesc', dict.thankYouDesc);

    const btnSubmitSpan = dom.btnSubmit?.querySelector('span');
    if (btnSubmitSpan) btnSubmitSpan.textContent = dict.btnSubmit;

    // Dynamically re-render experience questions for active language
    renderDynamicQuestions();
  }

  // NPS Rating Buttons (1 to 10)
  function setupNPSButtons() {
    dom.npsButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const score = parseInt(btn.getAttribute('data-score')) || 10;
        state.rating = score;
        if (dom.npsInput) dom.npsInput.value = score;

        dom.npsButtons.forEach(b => {
          const bScore = parseInt(b.getAttribute('data-score'));
          b.classList.toggle('active', bScore <= score);
        });

        // Auto-select mood based on NPS
        if (score >= 9) {
          selectMood('Appreciation');
        } else if (score >= 7) {
          selectMood('Feedback');
        } else {
          selectMood('Concern');
        }
      });
    });
  }

  // Experience Mood Selector
  function setupMoodRadios() {
    dom.moodCards.forEach(card => {
      card.addEventListener('click', () => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          selectMood(radio.value);
        }
      });
    });
  }

  function selectMood(moodValue) {
    state.mood = moodValue;
    dom.moodCards.forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      const isSelected = radio && radio.value === moodValue;
      card.classList.toggle('active', isSelected);
      if (radio) radio.checked = isSelected;
    });
  }

  // Chip options selection
  function setupChipsSelection() {
    const groups = document.querySelectorAll('.chips-group');
    groups.forEach(group => {
      const targetId = group.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      const chips = group.querySelectorAll('.chip-item');

      chips.forEach(chip => {
        chip.onclick = () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (targetInput) {
            targetInput.value = chip.getAttribute('data-value');
          }
        };
      });
    });
  }

  // Form Submission
  function setupFormSubmission() {
    if (!dom.form) return;

    dom.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (state.isSubmitting) return;

      const name = (dom.custName?.value || '').trim();
      const mobile = (dom.custMobile?.value || '').trim();

      if (!name) {
        alert('Please enter your full name.');
        dom.custName?.focus();
        return;
      }

      if (!mobile || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
        alert('Please provide a valid 10-digit mobile number.');
        dom.custMobile?.focus();
        return;
      }

      state.isSubmitting = true;
      dom.btnSubmit.disabled = true;
      dom.btnSubmit.innerHTML = '<span>⏳ Submitting...</span>';

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');
      const isoDate = now.toISOString().split('T')[0];
      const feedbackId = `SVV-QR-${now.getTime().toString().slice(-6)}`;

      const newRecord = {
        id: feedbackId,
        timestamp: dateStr,
        date: isoDate,
        branch: dom.metaBranch?.value || 'Cuddalore (Main Branch)',
        section: dom.metaCounter?.value || 'General Showroom',
        invoiceNo: dom.metaInvoice?.value || 'QR-WALKIN',
        source: 'QR',
        medium: dom.metaMedium?.value || 'Billing Counter Standee',
        staffName: dom.metaStaff?.value || 'Showroom Staff',
        customerName: name,
        mobile: mobile,
        city: dom.custCity?.value || '',
        occasionDate: dom.custOccasionDate?.value || '',
        rating: parseInt(dom.npsInput?.value) || 10,
        mood: state.mood,
        remarks: (dom.custRemarks?.value || '').trim(),
        status: 'NEW'
      };

      // Dynamically attach all active question answers from schema
      const activeQs = (state.questionsConfig && state.questionsConfig.length > 0)
        ? state.questionsConfig.filter(q => q.is_active !== false)
        : DEFAULT_QUESTIONS;

      for (const q of activeQs) {
        const inputId = `${q.q_id.toLowerCase()}Input`;
        const inputEl = document.getElementById(inputId);
        const ans = inputEl ? inputEl.value : '';

        if (q.is_mandatory && !ans) {
          alert(`Please answer the required question: ${q.q_text_en}`);
          inputEl?.parentElement?.scrollIntoView({ behavior: 'smooth' });
          state.isSubmitting = false;
          dom.btnSubmit.disabled = false;
          dom.btnSubmit.innerHTML = '<span>✨ Submit Feedback</span>';
          return;
        }

        newRecord[q.q_id.toLowerCase()] = ans;
        newRecord[q.q_id] = ans;
      }

      // 1. Save to localStorage offline cache
      try {
        const cached = JSON.parse(localStorage.getItem('svv_offline_feedbacks') || '[]');
        cached.unshift(newRecord);
        localStorage.setItem('svv_offline_feedbacks', JSON.stringify(cached));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }

      // 2. Dispatch to Cloudflare Worker Intermediary / Google Apps Script
      await dispatchFeedbackToCloud(newRecord);

      // 3. Show Celebration Screen
      dom.form.style.display = 'none';
      if (dom.thankYouCard) {
        dom.thankYouCard.style.display = 'block';
        dom.thankYouCard.scrollIntoView({ behavior: 'smooth' });
      }

      state.isSubmitting = false;
      dom.btnSubmit.disabled = false;
      dom.btnSubmit.innerHTML = '<span>✨ Submit Feedback</span>';
    });

    // Submit Another button
    if (dom.btnSubmitAnother) {
      dom.btnSubmitAnother.addEventListener('click', () => {
        dom.form.reset();
        dom.thankYouCard.style.display = 'none';
        dom.form.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Cloud Dispatch Engine (Cloudflare Worker -> Google Apps Script)
  async function dispatchFeedbackToCloud(record) {
    // Check endpoints in order of priority:
    // 1. Cloudflare Worker URL from localStorage or URL query (?cf=...)
    // 2. Google Apps Script Webhook URL from localStorage or URL query (?gs=...)
    // 3. Relative /api/feedback (if hosted under same domain with Cloudflare reverse proxy)
    const cfUrl = new URLSearchParams(window.location.search).get('cf') ||
                  localStorage.getItem('svv_cloudflare_worker_url') ||
                  'https://svv-crm-gateway.subavallivilas-candb.workers.dev';
    const gsUrl = new URLSearchParams(window.location.search).get('gs') ||
                  localStorage.getItem('svv_gsheet_url') ||
                  '';

    const payload = {
      action: 'ADD_FEEDBACK',
      data: record,
      sourceMedium: record.medium
    };

    // Try Cloudflare Worker first
    if (cfUrl) {
      try {
        const target = cfUrl.replace(/\/+$/, '') + '/api/feedback';
        const res = await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          console.log('✅ Feedback successfully submitted via Cloudflare Worker Intermediary!');
          return;
        }
      } catch (err) {
        console.warn('Cloudflare Worker dispatch attempt failed, trying fallback...', err);
      }
    }

    // Direct Google Apps Script fallback
    if (gsUrl) {
      try {
        await fetch(gsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        console.log('✅ Feedback submitted directly to Google Apps Script!');
      } catch (err) {
        console.warn('Google Apps Script direct post error:', err);
      }
    }
  }

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
