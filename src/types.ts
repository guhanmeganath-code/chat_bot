export type Language = "en" | "hi" | "ta";

export interface BotResponse {
  section_reference: string;
  explanation: string;
  example: string;
  disclaimer: string;
  confidence: "grounded" | "general";
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  base64: string; // base64-encoded file content (no data: prefix)
}

export interface Message {
  id: string;
  role: "user" | "bot";
  raw_text?: string; // used for user input message or pure text
  bot_response?: BotResponse; // structured response loaded for chatbot rendering
  confidence?: "grounded" | "general";
  timestamp: string;
  file?: FileAttachment; // optional uploaded file
}

export interface ChatSession {
  id: string;
  title: string;
  created_at?: string;
}

export const TRANSLATIONS = {
  en: {
    title: "Indian Law Chatbot",
    subtitle: "Your AI Legal Assistant for Indian Law",
    tagline: "Get instant, easy-to-understand answers to legal questions grounded in statutory acts.",
    startChat: "Start Legal Consultation",
    learnMore: "Learn More",
    askPlaceholder: "Ask your legal question (e.g. theft under IPC, cyber fraud under IT Act)...",
    groundedBadge: "CORPUS GROUNDED",
    generalBadge: "GENERAL INFORMATION",
    confidenceInfo: "This reference is retrieved and verified against key Indian penal/regulatory frameworks.",
    generalInfo: "This response is drawn from general legal principles. Exercise more caution.",
    newChat: "New Legal Review",
    disclaimerBar: "⚖️ DISCLAIMER: This chatbot provides general legal information based on statutes and is not a substitute for professional legal advice. For specific active case matters, consult a licensed advocate.",
    navFeatures: "Features",
    navHow: "How it Works",
    navTrust: "Statutory Scope",
    navDisclaimer: "Disclaimer",
    confidenceGrounded: "Grounded",
    confidenceGeneral: "General Case Review",
    micTooltip: "Use Voice Dictation",
    micListening: "Listening...",
    noHistory: "No prior consultations found. Ask our system your legal questions above.",
    featuresTitle: "Pillars of Indian Legal SaaS Guidance",
    featuresSub: "Powered by deep retrieval search technology across major Indian legal statutory frameworks.",
    howItWorksTitle: "How the Grounded Retrieval System Works",
    statutoryScopeTitle: "Statutory Coverage Scope",
    statutoryScopeSub: "This legal assistant is configured with verified reference databases across these primary acts:",
    bilingualToggle: "Language (Bilingual)",
    aboutTitle: "About Our Platform",
    aboutText: "This AI Assistant helps citizens, professionals, and students break down legal jargon and bridge Indian Penal Code (IPC/BNS), IT Act, and Traffic Rules into clear prose.",
  },
  hi: {
    title: "भारतीय कानून चैटबॉट",
    subtitle: "भारतीय कानून के लिए आपका AI कानूनी सहायक",
    tagline: "मुख्य अधिनियमों पर आधारित कानूनी प्रश्नों के तुरंत और आसानी से समझने योग्य उत्तर प्राप्त करें।",
    startChat: "कानूनी परामर्श शुरू करें",
    learnMore: "अधिक जानें",
    askPlaceholder: "अपना कानूनी प्रश्न पूछें (जैसे आईपीसी के तहत चोरी, आईटी अधिनियम के तहत साइबर धोखाधड़ी)...",
    groundedBadge: "सत्यापित स्रोत आधारित (Grounded)",
    generalBadge: "सामान्य जानकारी (General)",
    confidenceInfo: "यह संदर्भ भारतीय दंड/नियामक ढांचे के खिलाफ पुन: प्राप्त और सत्यापित है।",
    generalInfo: "यह उत्तर सामान्य कानूनी सिद्धांतों पर आधारित है। कृपया अधिक सावधानी बरतें।",
    newChat: "नया कानूनी प्रश्न",
    disclaimerBar: "⚖️ अस्वीकरण: यह चैटबॉट कानूनों पर आधारित सामान्य कानूनी जानकारी प्रदान करता है और पेशेवर कानूनी सलाह का विकल्प नहीं है। विशिष्ट सक्रिय मामलों के लिए, किसी वकील से संपर्क करें।",
    navFeatures: "विशेषताएं",
    navHow: "यह कैसे काम करता है",
    navTrust: "कानूनी दायरा",
    navDisclaimer: "अस्वीकरण",
    confidenceGrounded: "सत्यापित संदर्भ",
    confidenceGeneral: "सामान्य समीक्षा",
    micTooltip: "आवाज इनपुट का उपयोग करें",
    micListening: "सुन रहा हूँ...",
    noHistory: "कोई पुराना रिकॉर्ड नहीं मिला। ऊपर हमारे सिस्टम से अपना कानूनी प्रश्न पूछें।",
    featuresTitle: "भारतीय कानूनी परामर्श के मुख्य स्तंभ",
    featuresSub: "प्रमुख भारतीय कानूनी अधिनियमों के गहन खोज इंजन द्वारा समर्थित।",
    howItWorksTitle: "सत्यापित खोज प्रणाली कैसे कार्य करती है",
    statutoryScopeTitle: "कानूनी कवरेज दायरा",
    statutoryScopeSub: "यह कानूनी सहायक प्रमुख अधिनियमों के सत्यापित डेटाबेस के साथ सक्रिय है:",
    bilingualToggle: "भाषा बदलें",
    aboutTitle: "हमारे मंच के बारे में",
    aboutText: "यह एआई सहायक नागरिकों, कानूनी पेशेवरों और छात्रों को जटिल कानूनी भाषा समझने और कानून को सरल भाषा में समझाने में मदद करता है।",
  },
  ta: {
    title: "இந்திய சட்ட சாட்போட்",
    subtitle: "இந்திய சட்டத்திற்கான உங்களின் AI சட்ட உதவியாளர்",
    tagline: "அரசியலமைப்புச் சட்டப் பிரிவுகளின் அடிப்படையில் உங்கள் சட்டக் கேள்விகளுக்கு எளிதான பதில்களை உடனுக்குடன் பெறுங்கள்.",
    startChat: "சட்ட ஆலோசனையைத் தொடங்குங்கள்",
    learnMore: "மேலும் அறிய",
    askPlaceholder: "உங்கள் சட்டக் கேள்வியைக் கேளுங்கள் (उदा: திருட்டுச் சட்டம், தகவல் தொழில்நுட்பச் சட்டம்)...",
    groundedBadge: "சரிபார்க்கப்பட்ட ஆதாரம் (Grounded)",
    generalBadge: "பொதுவான தகவல் (General)",
    confidenceInfo: "இந்த குறிப்பு இந்திய தண்டனை மற்றும் ஒழுங்குமுறைச் சட்டங்களின் சரிபார்க்கப்பட்ட ஆதாரங்களில் இருந்து பெறப்பட்டது.",
    generalInfo: "இந்த பதில் பொதுவான சட்டக் கோட்பாடுகளின் அடிப்படையில் அமைந்துள்ளது. கூடுதல் எச்சரிக்கையுடன் செயல்படவும்.",
    newChat: "புதிய சட்ட ஆய்வு",
    disclaimerBar: "⚖️ பொறுப்புத் துறப்பு: இந்த சாட்போட் சட்டங்களின் அடிப்படையில் பொதுவான சட்டத் தகவல்களை மட்டுமே வழங்குகிறது. இது நேரடி சட்ட ஆலோசனைக்கு மாற்றாகாது. தனிப்பட்ட வழக்குகளுக்கு, வழக்கறிஞரை அணுகவும்.",
    navFeatures: "அம்சங்கள்",
    navHow: "செயல்பாட்டு முறை",
    navTrust: "சட்டப்பூர்வ எல்லை",
    navDisclaimer: "பொறுப்புத் துறப்பு",
    confidenceGrounded: "சரிபார்க்கப்பட்டது",
    confidenceGeneral: "பொதுவான ஆய்வு",
    micTooltip: "குரல் வழி உள்ளீடு",
    micListening: "கேட்கிறது...",
    noHistory: "முந்தைய பதிவுகள் எதுவும் இல்லை. உங்கள் சட்டக் கேள்விகளை மேலே கேட்கலாம்.",
    featuresTitle: "இந்திய சட்ட சேவையின் முக்கிய தூண்கள்",
    featuresSub: "இந்தியாவின் முக்கிய சட்டப்பிரிவுகளில் ஆழமான தேடல் தொழில்நுட்பத்தால் இயக்கப்படுகிறது.",
    howItWorksTitle: "சரிபார்க்கப்பட்ட தேடல் முறை எவ்வாறு செயல்படுகிறது",
    statutoryScopeTitle: "சரிபார்க்கப்பட்ட சட்டப்பிரிவுகள்",
    statutoryScopeSub: "இந்த சாட்போட் பின்வரும் முக்கிய சட்டங்களின் சரிபார்க்கப்பட்ட தரவுத்தளத்துடன் இணைக்கப்பட்டுள்ளது:",
    bilingualToggle: "மொழியை மாற்றுக",
    aboutTitle: "எம்மைப் பற்றி",
    aboutText: "இந்த AI உதவியாளர் குடிமக்கள், சட்ட வல்லுநர்கள் மற்றும் மாணவர்களுக்கு கடினமான சட்ட வார்த்தைகளை எளிய தமிழில் எளிதாகப் புரிந்துகொள்ள உதவுகிறது.",
  }
};
