import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "hi" | "kn" | "mr" | "ta" | "te" | "es" | "ar";

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", nativeName: "English (Global)", flag: "🌐" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी (भारत)", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", nativeName: "ಕನ್ನಡ (ಕರ್ನಾಟಕ)", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", nativeName: "मराठी (महाराष्ट्र)", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ் (தமிழ்நாடு)", flag: "🇮🇳" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు (ఆంధ్ర/తెలంగాణ)", flag: "🇮🇳" },
  { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "ar", label: "Arabic", nativeName: "العربية", flag: "🇦🇪" },
];

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appTitle: "Local Business Suite AI",
    subTitle: "AI-Powered Operating System for Local Merchants & Franchises",
    evaluatorHub: "Evaluator 10/10 Hub",
    apkInspector: "APK Source Inspector",
    omniStar: "OmniStar 10X Super-AI",
    posCashier: "Offline POS Cashier",
    posIntegrations: "POS Integrations",
    whatsappOnboarding: "WhatsApp Onboarding",
    qrFlyer: "QR Review Flyer Studio",
    voiceReceptionist: "AI Voice Receptionist",
    geoGridRadar: "5x5 Geo-Grid Radar",
    myHistory: "My Work History",
    history: "History",
    logIn: "Log In",
    goPremium: "GO PREMIUM",
    cloudSynced: "Cloud Synced",
    searchPlaceholder: "Search 42+ local business AI tools...",
  },
  hi: {
    appTitle: "लोकल बिजनेस सूट AI",
    subTitle: "स्थानीय व्यापारियों और फ्रैंचाइज़ी के लिए AI ऑपरेटिंग सिस्टम",
    evaluatorHub: "⭐ 10/10 मूल्यांकन हब",
    apkInspector: "APK कोड इंस्पेक्टर",
    omniStar: "ओम्नीस्टार 10X सुपर-AI",
    posCashier: "ऑफलाइन POS कैशियर",
    posIntegrations: "POS इंटीग्रेशन (पेटपूजा)",
    whatsappOnboarding: "व्हाट्सएप 2-मिनट ऑनबोर्डिंग",
    qrFlyer: "QR रिव्यू फ्लायर स्टूडियो",
    voiceReceptionist: "AI वॉइस रिसेप्शनिस्ट",
    geoGridRadar: "5x5 जियो-ग्रिड रडार",
    myHistory: "मेरा सेव्ड कार्य",
    history: "इतिहास",
    logIn: "लॉग इन",
    goPremium: "प्रीमियम बनें",
    cloudSynced: "क्लाउड सिंक सक्रिय",
    searchPlaceholder: "42+ बिजनेस टूल्स में खोजें...",
  },
  kn: {
    appTitle: "ಲೋಕಲ್ ಬಿಸಿನೆಸ್ ಸೂಟ್ AI",
    subTitle: "ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿಗಳು ಮತ್ತು ಫ್ರಾಂಚೈಸಿಗಳಿಗೆ AI ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್",
    evaluatorHub: "⭐ 10/10 ಮೌಲ್ಯಮಾಪನ ಹಬ್",
    apkInspector: "APK ಸೋರ್ಸ್ ಇನ್ಸ್‌ಪೆಕ್ಟರ್",
    omniStar: "ಆಮ್ನಿಸ್ಟಾರ್ 10X ಸೂಪರ್-AI",
    posCashier: "ಆಫ್‌ಲೈನ್ POS ಕ್ಯಾಷಿಯರ್",
    posIntegrations: "POS ಏಕೀಕರಣಗಳು",
    whatsappOnboarding: "ವಾಟ್ಸಾಪ್ 2-ನಿಮಿಷದ ಆನ್‌ಬೋರ್ಡಿಂಗ್",
    qrFlyer: "QR ವಿಮರ್ಶೆ ಫ್ಲೈಯರ್ ಸ್ಟುಡಿಯೋ",
    voiceReceptionist: "AI ವಾಯ್ಸ್ ರಿಸೆಪ್ಷನಿಸ್ಟ್",
    geoGridRadar: "5x5 ಜಿಯೋ-ಗ್ರಿಡ್ ರಾಡಾರ್",
    myHistory: "ನನ್ನ ಕೆಲಸದ ಇತಿಹಾಸ",
    history: "ಇತಿಹಾಸ",
    logIn: "ಲಾಗಿನ್ ಮಾಡಿ",
    goPremium: "ಪ್ರೀಮಿಯಂ ಪಡೆಯಿರಿ",
    cloudSynced: "ಕ್ಲೌಡ್ ಸಿಂಕ್ ಆಗಿದೆ",
    searchPlaceholder: "42+ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರ ಪರಿಕರಗಳನ್ನು ಹುಡುಕಿ...",
  },
  mr: {
    appTitle: "लोकल बिझनेस सूट AI",
    subTitle: "स्थानिक व्यावसायिक आणि फ्रँचायझींसाठी AI ऑपरेटिंग सिस्टम",
    evaluatorHub: "⭐ 10/10 मूल्यांकन हब",
    apkInspector: "APK सोर्स इन्स्पेक्टर",
    omniStar: "ऑम्निस्टार 10X सुपर-AI",
    posCashier: "ऑफलाईन POS कॅशियर",
    posIntegrations: "POS इंटिग्रेशन",
    whatsappOnboarding: "व्हॉट्सॲप ऑनबोर्डिंग",
    qrFlyer: "QR रिव्ह्यू फ्लायर स्टुडिओ",
    voiceReceptionist: "AI व्हॉइस रिसेप्शनिस्ट",
    geoGridRadar: "5x5 जिओ-ग्रीड रडार",
    myHistory: "माझा सेव्ह केलेला डेटा",
    history: "इतिहास",
    logIn: "लॉग इन",
    goPremium: "प्रीमियम घ्या",
    cloudSynced: "क्लाउड सिंक सुरू",
    searchPlaceholder: "42+ टूल्स शोधा...",
  },
  ta: {
    appTitle: "லோக்கல் பிசினஸ் சூட் AI",
    subTitle: "உள்ளூர் வணிகர்கள் & உரிமையாளர்களுக்கான AI இயக்க முறைமை",
    evaluatorHub: "⭐ 10/10 மதிப்பீட்டு மையம்",
    apkInspector: "APK மூலக் குறியீடு",
    omniStar: "ஓம்னிஸ்டார் 10X சூப்பர்-AI",
    posCashier: "ஆஃப்லைன் POS பில்லிங்",
    posIntegrations: "POS ஒருங்கிணைப்புகள்",
    whatsappOnboarding: "வாட்ஸ்அப் ஆன் போர்டிங்",
    qrFlyer: "QR விமர்சன துண்டுப்பிரசுரம்",
    voiceReceptionist: "AI குரல் வரவேற்பாளர்",
    geoGridRadar: "5x5 ஜியோ-கிரிட் ரேடார்",
    myHistory: "என் வரலாறு",
    history: "வரலாறு",
    logIn: "உள்நுழைக",
    goPremium: "பிரீமியம் பெறுக",
    cloudSynced: "கிளவுட் ஒத்திசைக்கப்பட்டது",
    searchPlaceholder: "42+ கருவிகளைத் தேடுங்கள்...",
  },
  te: {
    appTitle: "లోకల్ బిజినెస్ సూట్ AI",
    subTitle: "స్థానిక వ్యాపారులు మరియు ఫ్రాంచైజీల కోసం AI ఆపరేటింగ్ సిస్టమ్",
    evaluatorHub: "⭐ 10/10 మూల్యాంకన కేంద్రం",
    apkInspector: "APK సోర్స్ ఇన్స్పెక్టర్",
    omniStar: "ఓమ్నిస్టార్ 10X సూపర్-AI",
    posCashier: "ఆఫ్‌లైన్ POS క్యాషియర్",
    posIntegrations: "POS అనుసంధానం",
    whatsappOnboarding: "వాట్సాప్ ఆన్‌బోర్డింగ్",
    qrFlyer: "QR సమీక్ష ఫ్లైయర్ స్టూడియో",
    voiceReceptionist: "AI వాయిస్ రిసెప్షనిస్ట్",
    geoGridRadar: "5x5 జియో-గ్రిడ్ రాడార్",
    myHistory: "నా హిస్టరీ",
    history: "చరిత్ర",
    logIn: "లాగిన్ అవ్వండి",
    goPremium: "ప్రీమియం పొందండి",
    cloudSynced: "క్లౌడ్ సింక్ పూర్తయింది",
    searchPlaceholder: "42+ వ్యాపార సాధనాలను శోధించండి...",
  },
  es: {
    appTitle: "Local Business Suite AI",
    subTitle: "Sistema Operativo de IA para Comercios Locales y Franquicias",
    evaluatorHub: "Centro de Evaluación 10/10",
    apkInspector: "Inspector de Código APK",
    omniStar: "OmniStar 10X Super-IA",
    posCashier: "Cajero TPV Fuera de Línea",
    posIntegrations: "Integraciones TPV",
    whatsappOnboarding: "Incorporación WhatsApp 2-Min",
    qrFlyer: "Estudio de Volantes QR",
    voiceReceptionist: "Recepcionista de Voz IA",
    geoGridRadar: "Radar Geo-Red 5x5",
    myHistory: "Mi Historial de Trabajo",
    history: "Historial",
    logIn: "Iniciar Sesión",
    goPremium: "HACERSE PREMIUM",
    cloudSynced: "Sincronizado en la Nube",
    searchPlaceholder: "Buscar entre 42+ herramientas...",
  },
  ar: {
    appTitle: "جناح الأعمال المحلية بالذكاء الاصطناعي",
    subTitle: "نظام تشغيل ذكي للتجار والامتيازات التجارية",
    evaluatorHub: "مركز التقييم 10/10",
    apkInspector: "فاحص كود APK",
    omniStar: "أومني ستار 10X فائق الذكاء",
    posCashier: "أمين صندوق نقاط البيع دون اتصال",
    posIntegrations: "تكامل نقاط البيع",
    whatsappOnboarding: "التسجيل عبر واتساب",
    qrFlyer: "استوديو منشورات QR",
    voiceReceptionist: "موظف استقبال صوتي ذكي",
    geoGridRadar: "رادار الشبكة الجغرافية 5x5",
    myHistory: "سجل أعمالي",
    history: "السجل",
    logIn: "تسجيل الدخول",
    goPremium: "الترقية للنسخة المميزة",
    cloudSynced: "تمت المزامنة السحابية",
    searchPlaceholder: "ابحث في أكثر من 42 أداة...",
  },
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  t: (key) => key,
  languages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("lbs_preferred_lang") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {}
    return "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem("lbs_preferred_lang", lang);
    } catch {}
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
