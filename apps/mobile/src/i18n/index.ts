import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  te: {
    translation: {
      appName: 'ఆదిశక్తి',
      tagline: 'మహిళల భద్రత, సాధికారత & ఆర్థిక సమ్మిళితం',
      iAmSafe: 'నేను సురక్షితంగా ఉన్నాను',
      warningTrigger: 'వార్నింగ్ ట్రిగ్గర్ (ఎల్లో)',
      redAlert: 'రెడ్ అలర్ట్ (సహాయం)',
      trackMe: 'నా లొకేషన్ ట్రాక్ చేయండి',
      myCircle: 'నా రక్షణ సర్కిల్',
      helpline: 'హెల్ప్‌లైన్ 112',
      schemes: 'ప్రభుత్వ పథకాలు',
      learn: 'శిక్షణ & చట్టాలు',
      market: 'ద్వాక్రా మార్కెట్',
      profile: 'ప్రొఫైల్ & రక్షణ',
      audioConsent: 'ఆడియో రికార్డింగ్ సమ్మతి',
      guardians: 'రక్షకులు (గార్డియన్స్)',
      offlineMode: 'ఆఫ్‌లైన్ మోడ్ - రక్షణ అలర్ట్‌లు క్యూ చేయబడ్డాయి'
    }
  },
  en: {
    translation: {
      appName: 'ADISHAKTI',
      tagline: "Women's Safety, Empowerment & Economic Inclusion",
      iAmSafe: 'I AM SAFE',
      warningTrigger: 'Warning Trigger (Yellow)',
      redAlert: 'Red Alert (SOS)',
      trackMe: 'Track My Route',
      myCircle: 'My Safety Circle',
      helpline: 'Helpline 112',
      schemes: 'Schemes',
      learn: 'Learn & Law',
      market: 'SHG Market',
      profile: 'Profile & Safety',
      audioConsent: 'Audio Monitoring Consent',
      guardians: 'Verified Guardians',
      offlineMode: 'Offline Mode — Safety events queued locally'
    }
  },
  hi: {
    translation: {
      appName: 'आदिशक्ति',
      tagline: 'महिला सुरक्षा, सशक्तीकरण और आर्थिक समावेश',
      iAmSafe: 'मैं सुरक्षित हूँ',
      warningTrigger: 'वार्निंग ट्रिगर (येलो)',
      redAlert: 'रेड अलर्ट (एसओएस)',
      trackMe: 'ट्रैक माय रूट',
      myCircle: 'सुरक्षा घेरा',
      helpline: 'हेल्पलाइन 112',
      schemes: 'सरकारी योजनाएं',
      learn: 'कौशल और कानून',
      market: 'एसएचजी बाजार',
      profile: 'प्रोफाइल और सुरक्षा',
      audioConsent: 'ऑडियो निगरानी सहमति',
      guardians: 'अभिभावक सूची',
      offlineMode: 'ऑफ़लाइन मोड — सुरक्षा अलर्ट स्थानीय रूप से कतारबद्ध हैं'
    }
  },
  ta: { translation: { appName: 'ஆதிசக்தி', iAmSafe: 'நான் பாதுகாப்பாக உள்ளேன்' } },
  kn: { translation: { appName: 'ಆದಿಶಕ್ತಿ', iAmSafe: 'ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ' } },
  ml: { translation: { appName: 'ആദിശക്തി', iAmSafe: 'ഞാൻ സുരക്ഷിതനാണ്' } },
  or: { translation: { appName: 'ଆଦିଶକ୍ତି', iAmSafe: 'ମୁଁ ସୁରକ୍ଷିତ ଅଛି' } },
  mr: { translation: { appName: 'आदिशक्ती', iAmSafe: 'मी सुरक्षित आहे' } },
  bn: { translation: { appName: 'আদিশক্তি', iAmSafe: 'আমি সুরক্ষিত' } },
  gu: { translation: { appName: 'આદિશક્તિ', iAmSafe: 'હું સુરક્ષિત છું' } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'te',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
