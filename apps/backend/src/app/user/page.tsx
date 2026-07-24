'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield, AlertTriangle, Radio, MapPin, Battery, Wifi, Volume2, PhoneCall,
  Award, BookOpen, ShoppingBag, User, Sparkles, Scale, CreditCard, ChevronRight,
  CheckCircle2, Lock, ArrowRight, Smartphone, UserPlus, Heart, Mic, Play, Plus, Trash2, Sliders, Sun, Moon, Navigation, Compass, Map, ExternalLink, BellRing, LogIn, Calendar, Send, HelpCircle
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

// Location Preset Data with Station Specific Coordinates & Navigation
const LOCATION_PRESETS = [
  {
    id: 'rjy-station',
    name: 'Godavari Station Rd, Rajahmundry',
    lat: 16.98416,
    lng: 81.7839,
    nearbyStations: [
      { id: 'p1', name: 'One Town Police Station Rajahmundry', dist: '0.8 km', phone: '0883-2423100', type: 'POLICE', lat: 16.9782, lng: 81.7765, address: 'Main Road, Mangalavaripeta, Rajahmundry' },
      { id: 'p2', name: 'Three Town Police Station Rajahmundry', dist: '1.2 km', phone: '0883-2472233', type: 'POLICE', lat: 17.00915, lng: 81.76976, address: 'Godavari Bund Road, Alcot Gardens, Rajahmundry' },
      { id: 'p3', name: 'Disha Mahila Police Station Rajahmundry', dist: '1.3 km', phone: '0883-2471091', type: 'DISHA', lat: 17.00906, lng: 81.76968, address: 'Godavari Bund Road, Alcot Gardens, Rajahmundry' }
    ]
  },
  {
    id: 'morampudi',
    name: 'Morampudi Junction, Rajahmundry East',
    lat: 16.9926,
    lng: 81.8142,
    nearbyStations: [
      { id: 'p4', name: 'Bommuru Police Station Morampudi', dist: '1.1 km', phone: '0883-2465544', type: 'POLICE', lat: 17.01373, lng: 81.80871, address: 'Padmavathi Nagar, NH-16, Rajahmundry' },
      { id: 'p5', name: 'Disha Emergency Command Unit Hub', dist: '1.1 km', phone: '1091', type: 'DISHA', lat: 17.0135, lng: 81.8085, address: 'Padmavathi Nagar, NH-16, Rajahmundry' }
    ]
  },
  {
    id: 'kadiyam',
    name: 'Kadiyam Highway Junction, East Godavari',
    lat: 16.9167,
    lng: 81.8333,
    nearbyStations: [
      { id: 'p6', name: 'Kadiyam Police Station', dist: '0.8 km', phone: '0883-2498765', type: 'POLICE', lat: 16.9135, lng: 81.8174, address: 'Kakinada-Rajahmundry Road, Kadiyam' },
      { id: 'p7', name: 'Grama Sachivalayam Women Cell Kadiyam', dist: '1.2 km', phone: '0883-2498800', type: 'DISHA', lat: 16.9150, lng: 81.8200, address: 'Village Secretariat Office, Kadiyam' }
    ]
  },
  {
    id: 'kakinada',
    name: 'Collectorate Compound, Kakinada',
    lat: 16.966,
    lng: 82.255,
    nearbyStations: [
      { id: 'p8', name: 'Kakinada Two-Town Police Station', dist: '0.7 km', phone: '0884-2334455', type: 'POLICE', lat: 16.9626, lng: 82.2361, address: 'Surya Rao Peta, Kakinada' },
      { id: 'p9', name: 'Sakhi One Stop Centre Kakinada', dist: '0.5 km', phone: '0884-2330044', type: 'SAKHI', lat: 16.9650, lng: 82.2500, address: 'Collectorate Road, Kakinada' },
      { id: 'p10', name: 'Disha Police Station Kakinada', dist: '0.7 km', phone: '0884-2378900', type: 'DISHA', lat: 16.9626, lng: 82.2361, address: 'Surya Rao Peta, Kakinada' }
    ]
  }
];

const MASTER_POLICE_STATIONS = [
  { id: 'ps-1', name: 'One Town Police Station Rajahmundry', phone: '0883-2423100', type: 'POLICE', lat: 16.9782, lng: 81.7765, address: 'Main Road, Mangalavaripeta, Rajahmundry' },
  { id: 'ps-2', name: 'Three Town Police Station Rajahmundry', phone: '0883-2472233', type: 'POLICE', lat: 17.00915, lng: 81.76976, address: 'Godavari Bund Road, Alcot Gardens, Rajahmundry' },
  { id: 'ps-3', name: 'Disha Mahila Police Station Rajahmundry', phone: '0883-2471091', type: 'DISHA', lat: 17.00906, lng: 81.76968, address: 'Godavari Bund Road, Alcot Gardens, Rajahmundry' },
  { id: 'ps-4', name: 'Bommuru Police Station Morampudi', phone: '0883-2465544', type: 'POLICE', lat: 17.01373, lng: 81.80871, address: 'Padmavathi Nagar, NH-16, Rajahmundry' },
  { id: 'ps-5', name: 'Disha Emergency Command Unit Hub', phone: '1091', type: 'DISHA', lat: 17.0135, lng: 81.8085, address: 'Padmavathi Nagar, NH-16, Rajahmundry' },
  { id: 'ps-6', name: 'Kadiyam Police Station', phone: '0883-2498765', type: 'POLICE', lat: 16.9135, lng: 81.8174, address: 'Kakinada-Rajahmundry Road, Kadiyam' },
  { id: 'ps-7', name: 'Grama Sachivalayam Women Cell Kadiyam', phone: '0883-2498800', type: 'DISHA', lat: 16.9150, lng: 81.8200, address: 'Village Secretariat Office, Kadiyam' },
  { id: 'ps-8', name: 'Kakinada Two-Town Police Station', phone: '0884-2334455', type: 'POLICE', lat: 16.9626, lng: 82.2361, address: 'Surya Rao Peta, Kakinada' },
  { id: 'ps-9', name: 'Sakhi One Stop Centre Kakinada', phone: '0884-2330044', type: 'SAKHI', lat: 16.9650, lng: 82.2500, address: 'Collectorate Road, Kakinada' },
  { id: 'ps-10', name: 'Disha Police Station Kakinada', phone: '0884-2378900', type: 'DISHA', lat: 16.9626, lng: 82.2361, address: 'Surya Rao Peta, Kakinada' }
];

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Sakhi/Protection Officers Directory
const PROTECTION_OFFICERS = [
  { district: 'East Godavari', name: 'Mrs. Ch. Vijayalakshmi', phone: '0883-2441091', office: 'Sakhi One Stop Centre Rajahmundry', address: 'GGH Hospital Compound, Rajahmundry' },
  { district: 'Kakinada', name: 'Mrs. P. Lalitha Kumari', phone: '0884-2330044', office: 'Sakhi One Stop Centre Kakinada', address: 'Behind Collectorate Office, Kakinada' },
  { district: 'Visakhapatnam', name: 'Dr. G. Hemalatha', phone: '0891-2563344', office: 'Sakhi One Stop Centre Visakhapatnam', address: 'KGH Hospital Compound, Visakhapatnam' },
  { district: 'Vijayawada', name: 'Mrs. K. Saraswathi Devi', phone: '0866-2489955', office: 'Sakhi One Stop Centre Krishna', address: 'Old Government Hospital Compound, Hanumanpet, Vijayawada' },
  { district: 'Guntur', name: 'Mrs. M. Sandhya Rani', phone: '0863-2234091', office: 'Sakhi One Stop Centre Guntur', address: 'Near District Court Complex, Guntur' },
  { district: 'Tirupati', name: 'Mrs. S. Radhamma', phone: '0877-2284591', office: 'Sakhi One Stop Centre Tirupati', address: 'Ruia Hospital Compound, Tirupati' }
];

// Vernacular Legal Awareness Guides
const LEGAL_GUIDES = [
  {
    id: 'l1',
    title: 'Domestic Violence Act 2005: Women Right to Residence',
    topic: 'Domestic Violence',
    duration: '85s',
    advocate: 'Adv. S. Lakshmi Prasanna',
    role: 'High Court Senior Advocate',
    url: 'https://cdn.adishakti.org/videos/dv_act_rights_te.mp4'
  },
  {
    id: 'l2',
    title: 'Protection from Cyber Bullying, Stalking & Morphing: IT Act 66E',
    topic: 'Cybercrime',
    duration: '90s',
    advocate: 'K. V. Subba Rao',
    role: 'AP Police Cyber Advisor',
    url: 'https://cdn.adishakti.org/videos/cybercrime_it66e_te.mp4'
  },
  {
    id: 'l3',
    title: 'POSH Act 2013: Workplace Harassment Complaints Committee',
    topic: 'Workplace Safety',
    duration: '80s',
    advocate: 'Adv. P. Sharada Devi',
    role: 'POSH Auditor & Corporate Advisor',
    url: 'https://cdn.adishakti.org/videos/posh_act_workplace_te.mp4'
  },
  {
    id: 'l4',
    title: 'Hindu Succession Act: Equal Ancestral Property Rights',
    topic: 'Property Rights',
    duration: '75s',
    advocate: 'Adv. M. Gouthami',
    role: 'AP State Legal Services Authority Member',
    url: 'https://cdn.adishakti.org/videos/property_succession_te.mp4'
  }
];

// Multilingual Dictionary
const T: any = {
  en: {
    home: 'Home',
    schemes: 'Schemes',
    legal: 'Legal',
    upskill: 'Upskill',
    market: 'Market',
    imSafe: 'I AM SAFE',
    warningTrigger: 'Warning Trigger (Yellow)',
    redSOS: 'Red Alert (Critical SOS)',
    verifyBtn: 'Tap to Verify',
    confirmTitle: 'Confirmation Required',
    confirmWarning: 'Are you sure you want to turn on the commute Warning Trigger?',
    confirmSos: 'Are you sure you want to dispatch a critical emergency RED SOS alert?',
    confirmSafe: 'Are you sure you want to mark yourself as safe & clear all alerts?',
    alertSent: 'Alert sent live to nearest responder station!',
    nearByStations: 'Nearby Police Stations & Disha Centers'
  },
  te: {
    home: 'హోమ్',
    schemes: 'పథకాలు',
    legal: 'చట్టాలు',
    upskill: 'నైపుణ్యం',
    market: 'మార్కెట్',
    imSafe: 'నేను సురక్షితంగా ఉన్నాను',
    warningTrigger: 'హెచ్చరిక ట్రిగ్గర్ (పసుపు)',
    redSOS: 'రెడ్ అలర్ట్ (అత్యవసర SOS)',
    verifyBtn: 'వెరిఫై చేయండి',
    confirmTitle: 'ధృవీకరణ అవసరం',
    confirmWarning: 'మీరు ప్రయాణ హెచ్చరిక ట్రిగ్గర్‌ను ఆన్ చేయాలనుకుంటున్నారా?',
    confirmSos: 'మీరు పోలీస్ కంట్రోల్ రూమ్‌కు అత్యవసర రెడ్ SOS అలర్ట్ పంపాలనుకుంటున్నారా?',
    confirmSafe: 'మీరు సురక్షితంగా ఉన్నట్లు మార్క్ చేసి అలర్ట్‌లను క్లియర్ చేయాలనుకుంటున్నారా?',
    alertSent: 'సమీప రక్షక కేంద్రానికి సమాచారం పంపబడింది!',
    nearByStations: 'సమీప పోలీస్ స్టేషన్లు & సఖి కేంద్రాలు'
  },
  hi: {
    home: 'होम',
    schemes: 'योजनाएं',
    legal: 'कानून',
    upskill: 'कौशल',
    market: 'बाजार',
    imSafe: 'मैं सुरक्षित हूँ',
    warningTrigger: 'चेतावनी ट्रिगर (पीला)',
    redSOS: 'रेड अलर्ट (क्रिटिकल SOS)',
    verifyBtn: 'सत्यापित करें',
    confirmTitle: 'पुष्टि की आवश्यकता है',
    confirmWarning: 'क्या आप वाकई चेतावनी ट्रिगर चालू करना चाहते हैं?',
    confirmSos: 'क्या आप पुलिस नियंत्रण कक्ष को आपातकालीन रेड SOS भेजना चाहते हैं?',
    confirmSafe: 'क्या आप स्वयं को सुरक्षित चिह्नित करना चाहते हैं?',
    alertSent: 'निकटतम सुरक्षा केंद्र को लाइव अलर्ट भेजा गया!',
    nearByStations: 'समीप पुलिस स्टेशन और दिशा केंद्र'
  }
};

export default function WomenUserApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [language, setLanguage] = useState<'te' | 'en' | 'hi'>('te');

  // Selected Location & Stations
  const [selectedLoc, setSelectedLoc] = useState(LOCATION_PRESETS[0]);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Auth Modes & Status
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isRegistered, setIsRegistered] = useState(false);
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Inputs
  const [loginPhone, setLoginPhone] = useState('+91 98765 43210');
  
  // Premium Multi-Box OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const [phone, setPhone] = useState('+91 98765 43210');
  const [regOtpDigits, setRegOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const regOtpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const [userId, setUserId] = useState('demo-user-101');
  const [fullName, setFullName] = useState('Sunitha Lakshmi');
  const [persona, setPersona] = useState<'SHG' | 'STUDENT' | 'PRO' | 'MOTHER'>('SHG');

  // Safety Circle & Escalation Chain
  const [guardians, setGuardians] = useState([
    { id: '1', name: 'Ramakrishna (Husband)', phone: '+91 98765 43211', priority: 1 },
    { id: '2', name: 'Venkata Rao (Brother)', phone: '+91 98765 43212', priority: 2 }
  ]);
  const [gNameInput, setGNameInput] = useState('');
  const [gPhoneInput, setGPhoneInput] = useState('');
  const [audioConsent, setAudioConsent] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'HOME' | 'SCHEMES' | 'LEGAL' | 'UPSKILL' | 'MARKET'>('HOME');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Safety Engine State
  const [warningActive, setWarningActive] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(0);
  const [redAlertActive, setRedAlertActive] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Double verification action modal triggers
  const [activeConfirmType, setActiveConfirmType] = useState<'WARNING' | 'SOS' | 'SAFE' | null>(null);

  // Legal Tab States
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('East Godavari');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [consultationBooked, setConsultationBooked] = useState(false);

  const dynamicNearbyStations = useMemo(() => {
    return MASTER_POLICE_STATIONS.map((st) => {
      const distance = getDistanceFromLatLonInKm(selectedLoc.lat, selectedLoc.lng, st.lat, st.lng);
      return {
        ...st,
        calculatedDist: distance
      };
    })
    .sort((a, b) => a.calculatedDist - b.calculatedDist)
    .slice(0, 3)
    .map((st) => ({
      ...st,
      dist: `${st.calculatedDist.toFixed(1)} km`
    }));
  }, [selectedLoc]);
  const [consultationName, setConsultationName] = useState('');

  // Dynamic Telemetry States
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [networkStatus, setNetworkStatus] = useState<string>('4G LTE');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        });
      }
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        const updateNetwork = () => {
          const type = conn.effectiveType || '4G';
          setNetworkStatus(`${type.toUpperCase()}`);
        };
        updateNetwork();
        conn.addEventListener('change', updateNetwork);
      }
    }
  }, []);

  // Speech-to-Text (STT) Recognition States
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Web Speech API is not supported in this browser. Please use the simulated prompt buttons.');
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const rawText = event.results[0][0].transcript;
        const text = rawText.toLowerCase();
        setIsListening(false);
        
        console.log('🎙️ STT Voice Captured Raw:', rawText);

        // Run the robust bilingual translator/matcher
        const matched = getMatchedPathway(text);
        if (matched === 'DV') {
          setIncidentDetails('"Husband hits me"');
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Domestic Violence Protection Act"`);
        } else if (matched === 'POSH') {
          setIncidentDetails('"Boss touches me"');
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Workplace Harassment (POSH Act) Committee"`);
        } else if (matched === 'PROPERTY') {
          setIncidentDetails('"Brother took land"');
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Hindu Succession (Property Rights) Dispute"`);
        } else if (matched === 'CYBER') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Cyber Crime & Online Harassment"`);
        } else if (matched === 'RAGGING') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Campus Ragging UGC Guidelines"`);
        } else if (matched === 'LEGAL_AID') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Free Legal Aid & Counsel Advice"`);
        } else if (matched === 'ZERO_FIR') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Zero FIR Rights Section 173"`);
        } else if (matched === 'CHILD_RIGHTS') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Child Rights Protection Act"`);
        } else if (matched === 'PERSONAL_SAFETY') {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\n\n🔄 Translated to AP Safety Pathway:\n🎯 "Personal Safety & Self-Defence BNS"`);
        } else {
          setIncidentDetails(rawText);
          alert(`🎙️ STT Voice Heard: "${rawText}"\nGeneral safety support loaded.`);
        }
      };

      rec.start();
    }
  };

  const getMatchedPathway = (text: string) => {
    const t = text.toLowerCase().trim();
    if (!t) return null;

    const dvKeywords = [
      'hit', 'beat', 'husband', 'violence', 'abuse', 'slap', 'fight', 'torture', 'danger', 'attack', 'threat', 'injure', 'hurt', 'kick', 'punch', 'domestic', 'partner', 'dowry', 'cruelty', 'in-laws',
      'కొట్టాడు', 'హింస', 'మొగుడు', 'భర్త', 'దెబ్బలు', 'హింసించు', 'కొట్టడం', 'తిట్టడం', 'హింసలు', 'నన్ను కొడుతున్నారు', 'గొడవ', 'చంపేస్తా', 'వరకట్నం', 'కట్నం',
      'kottadu', 'himsa', 'mogudu', 'bharta', 'debbalu', 'kotti', 'bhartha', 'godava', 'champesta', 'abusive', 'dowry', 'katnam'
    ];

    const poshKeywords = [
      'boss', 'touch', 'workplace', 'harass', 'office', 'colleague', 'manager', 'advances', 'uncomfortable', 'sexual', 'stalk', 'job', 'salary', 'posh', 'maternity', 'maternity leave', 'pregnancy', 'work place', 'working conditions', 'employment',
      'ఆఫీస్', 'వేధింపు', 'తాకాడు', 'ఇబ్బంది', 'స్పర్శ', 'మేనేజర్', 'సహోద్యోగి', 'తాకడం', 'వేధించడం', 'ఆఫీసు', 'ఉద్యోగం', 'గర్భవతి', 'ప్రెగ్నెన్సీ', 'పని ప్రదేశం',
      'office', 'vedhimpu', 'thakadu', 'ibbandi', 'sparsha', 'sparisa', 'manager', 'colleague', 'job'
    ];

    const propKeywords = [
      'land', 'brother', 'property', 'house', 'share', 'inherit', 'ancestral', 'will', 'document', 'boundary', 'title', 'deed', 'gift', 'patta', 'passbook', 'partition', 'eviction',
      'ఆస్తి', 'భూమి', 'అన్నయ్య', 'తమ్ముడు', 'లాక్కున్నాడు', 'ఇల్లు', 'భాగం', 'వాటా', 'దస్తావేజు', 'పట్టా', 'పాస్ పుస్తకం', 'భూమి వివాదం', 'రిజిస్ట్రేషన్',
      'aasthi', 'bhoomi', 'bhumi', 'annayya', 'thammudu', 'lakkunnadu', 'illu', 'vatha', 'share', 'document', 'patta'
    ];

    const cyberKeywords = [
      'cyber', 'online', 'morph', 'morphing', 'cheating', 'bullying', 'stalking', 'identity theft', 'fake account', 'hacked', 'password', 'obscene', 'website', 'phishing',
      'ఆన్‌లైన్', 'మార్ఫింగ్', 'హాకింగ్', 'ఫేస్బుక్', 'వాట్సాప్', 'వెబ్సైట్', 'సైబర్', 'నకిలీ',
      'cyber', 'online', 'morphing', 'bullying', 'hacked', 'morph'
    ];

    const raggingKeywords = [
      'ragging', 'seniors', 'ugc', 'campus', 'college', 'hostel', 'university', 'abuse college',
      'ర్యాగింగ్', 'కళాశాల', 'హాస్టల్', 'సీనియర్లు',
      'ragging', 'college'
    ];

    const legalAidKeywords = [
      'legal aid', 'free lawyer', 'dlsa', 'court fee', 'help desk', 'nalsa', 'slsa', 'legal services',
      'లాయర్', 'ఉచిత న్యాయ', 'న్యాయ సహాయం', 'సహాయం', 'ఉచిత లాయర్',
      'legal aid', 'free advocate', 'court'
    ];

    const zeroFirKeywords = [
      'zero fir', 'jurisdiction', 'any police station', 'register fir', 'section 173', 'bnss',
      'పోలీస్ స్టేషన్', 'ఎఫ్ఐఆర్', 'జీరో ఎఫ్ఐఆర్',
      'zero fir', 'fir', 'police station'
    ];

    const childKeywords = [
      'child', 'minor', 'under 18', 'labour', 'labor', 'pocso', 'marriage', 'school', 'children', 'exploit', 'hazardous', 'adolescent',
      'బాల', 'కార్మికులు', 'వివాహం', 'పిల్లలు', 'పని', 'స్కూల్', 'బాలలు', 'మైనర్', '1098'
    ];

    const personalSafetyKeywords = [
      'misbehave', 'stalk', 'stalking', 'assault', 'harassment', 'threaten', 'intimidation', 'attack', 'teasing', 'eve teasing', 'self defence', 'self defense', 'force', 'unlawful', 'criminal', 'abuse', 'molest', 'molesting', 'molestation', 'grope', 'groping', 'rape', 'forced touch',
      'అల్లరి', 'వేధించడం', 'భయపెట్టడం', 'ఆడవాళ్ళ', 'రక్షణ', 'దాడి', 'ఏడిపించడం', 'అగౌరవం', 'శరీర', 'బలాత్కారం', 'తాకడం',
      'misbehave', 'stalking', 'assault', 'eve teasing', 'self defense', 'molesting', 'molest'
    ];

    if (dvKeywords.some(keyword => t.includes(keyword))) return 'DV';
    if (poshKeywords.some(keyword => t.includes(keyword))) return 'POSH';
    if (propKeywords.some(keyword => t.includes(keyword))) return 'PROPERTY';
    if (cyberKeywords.some(keyword => t.includes(keyword))) return 'CYBER';
    if (raggingKeywords.some(keyword => t.includes(keyword))) return 'RAGGING';
    if (legalAidKeywords.some(keyword => t.includes(keyword))) return 'LEGAL_AID';
    if (zeroFirKeywords.some(keyword => t.includes(keyword))) return 'ZERO_FIR';
    if (childKeywords.some(keyword => t.includes(keyword))) return 'CHILD_RIGHTS';
    if (personalSafetyKeywords.some(keyword => t.includes(keyword))) return 'PERSONAL_SAFETY';

    return null;
  };



  // Upskill Tab States
  const [interviewFeedback, setInterviewFeedback] = useState<any | null>(null);
  const [upiStep, setUpiStep] = useState(1);
  const [simPin, setSimPin] = useState('');

  // Load high-accuracy HTML5 GPS coordinates immediately on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          
          // Set live accurate GPS location dynamically
          const gpsLoc = {
            id: 'live-gps',
            name: 'Live GPS Location, Rajahmundry',
            lat: latitude,
            lng: longitude,
            nearbyStations: [
              { id: 'p1', name: 'Disha Mahila Police Station Rajahmundry', dist: '0.6 km', phone: '0883-2471091', type: 'DISHA', lat: 16.9895, lng: 81.7850, address: 'Subhash Road, Rajahmundry Central' },
              { id: 'p2', name: 'Three Town Police Station Danavaipeta', dist: '1.2 km', phone: '0883-2472233', type: 'POLICE', lat: 16.9930, lng: 81.7890, address: 'Danavaipeta Main Road, Rajahmundry' },
              { id: 'p3', name: 'Sakhi One Stop Centre GGH Compound', dist: '1.4 km', phone: '0883-2441091', type: 'SAKHI', lat: 16.9910, lng: 81.7840, address: 'District Hospital Compound, Rajahmundry' }
            ]
          };
          setSelectedLoc(gpsLoc);
        },
        (error) => {
          console.warn('HTML5 Geolocation Fallback:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Handle Multi-box OTP input focus progression
  const handleOtpChange = (index: number, val: string, isReg: boolean) => {
    const updated = isReg ? [...regOtpDigits] : [...otpDigits];
    updated[index] = val.slice(-1);
    if (isReg) {
      setRegOtpDigits(updated);
      if (val && index < 5) regOtpRefs[index + 1].current?.focus();
    } else {
      setOtpDigits(updated);
      if (val && index < 5) otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isReg: boolean) => {
    if (e.key === 'Backspace') {
      const updated = isReg ? [...regOtpDigits] : [...otpDigits];
      if (!updated[index] && index > 0) {
        if (isReg) {
          regOtpRefs[index - 1].current?.focus();
          updated[index - 1] = '';
          setRegOtpDigits(updated);
        } else {
          otpRefs[index - 1].current?.focus();
          updated[index - 1] = '';
          setOtpDigits(updated);
        }
      } else {
        updated[index] = '';
        if (isReg) setRegOtpDigits(updated);
        else setOtpDigits(updated);
      }
    }
  };

  // Warning Timer with 30-minute Auto IVR Escalation
  useEffect(() => {
    let interval: any = null;
    if (warningActive) {
      interval = setInterval(() => {
        setWarningSeconds((prev) => {
          const nextSec = prev + 1;
          // 30 minutes = 1800 seconds
          if (nextSec >= 1800) {
            clearInterval(interval);
            setWarningActive(false);
            setRedAlertActive(true);
            alert("⚠️ 30 Minutes Elapsed! Adishakti Safety Engine has automatically initiated an Emergency IVR Call to your guardians and sent a live GPS distress report to the nearest Command Center.");
            
            // Dispatch event call simulation
            fetch('/api/safety/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: userId,
                type: 'IVR_AUTO_CALL',
                lastLat: selectedLoc.lat,
                lastLng: selectedLoc.lng,
                lastAddress: selectedLoc.name,
                audioFlag: audioConsent,
                notes: 'WARNING EXPIRED: Auto-triggered IVR voice phone calls to primary guardians.'
              })
            }).catch(e => console.error(e));
            return 0;
          }
          return nextSec;
        });
      }, 1000);
    } else {
      setWarningSeconds(0);
    }
    return () => clearInterval(interval);
  }, [warningActive, selectedLoc, audioConsent]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLoginSubmit = async () => {
    const otp = otpDigits.join('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: loginPhone,
          otp: otp,
          action: 'VERIFY_OTP'
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserId(data.user.id);
        setFullName(data.user.name);
        setGuardians(data.user.guardians || []);
        setIsRegistered(true);
      } else {
        alert(data.error || 'Login verification failed');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRegisterOtpSubmit = async () => {
    const otp = regOtpDigits.join('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          otp: otp,
          action: 'VERIFY_OTP',
          name: 'New Registered User',
          language: language
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserId(data.user.id);
        setFullName(data.user.name);
        setGuardians(data.user.guardians || []);
        setRegStep(2);
      } else {
        alert(data.error || 'Registration OTP verification failed');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Double Verification Confirmed Actions
  const handleConfirmAction = async () => {
    if (activeConfirmType === 'WARNING') {
      setWarningActive(true);
      await fetch('/api/safety/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          type: 'WARNING',
          lastLat: selectedLoc.lat,
          lastLng: selectedLoc.lng,
          lastAddress: selectedLoc.name,
          lastBattery: batteryLevel,
          lastNetworkStatus: networkStatus,
          audioFlag: audioConsent,
          notes: `Warning Trigger ON. Dispatched to ${dynamicNearbyStations[0]?.name || selectedLoc.name}`
        })
      });
    } else if (activeConfirmType === 'SOS') {
      setRedAlertActive(true);
      await fetch('/api/safety/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          type: 'RED',
          lastLat: selectedLoc.lat,
          lastLng: selectedLoc.lng,
          lastAddress: selectedLoc.name,
          lastBattery: batteryLevel,
          lastNetworkStatus: networkStatus,
          audioFlag: audioConsent,
          notes: 'CRITICAL RED SOS Alert Triggered!'
        })
      });
    } else if (activeConfirmType === 'SAFE') {
      setWarningActive(false);
      setRedAlertActive(false);
    }
    setActiveConfirmType(null);
  };

  const handleGenerateScript = () => {
    if (!incidentDetails) return;
    setGeneratedScript(`To,\nThe Cyber Cell / SHO Police Department\nAndhra Pradesh.\n\nSubject: Cyber Harassment Incident Report\n\nRespected Sir/Madam,\nI am officially reporting cyberstalking harassment.\nIncident Details: ${incidentDetails}\n\nI request immediate registration of an FIR under relevant IT Act Section 66E / IPC sections.\n\nVerified via Adishakti Telemetry.`);
  };

  const addGuardian = async () => {
    if (!gNameInput || !gPhoneInput) return;
    try {
      const res = await fetch('/api/guardians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          name: gNameInput,
          phone: gPhoneInput,
          priorityOrder: guardians.length + 1
        })
      });
      const data = await res.json();
      if (data.success) {
        setGuardians([
          ...guardians,
          { id: data.guardian.id, name: data.guardian.name, phone: data.guardian.phone, priority: data.guardian.priorityOrder }
        ]);
        setGNameInput('');
        setGPhoneInput('');
      } else {
        alert(data.error || 'Failed to save guardian');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteGuardian = async (id: string) => {
    try {
      const res = await fetch(`/api/guardians?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setGuardians(guardians.filter((g) => g.id !== id));
      } else {
        alert(data.error || 'Failed to delete contact');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const isLight = theme === 'light';

  // Use OpenStreetMap Embed configuration for zero CORS restrictions and instant loading
  const mapLat = selectedLoc.lat;
  const mapLng = selectedLoc.lng;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.005}%2C${mapLat - 0.004}%2C${mapLng + 0.005}%2C${mapLat + 0.004}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-center sm:p-4 p-0 font-sans ${
        isLight ? 'bg-purple-50/80 text-slate-900' : 'bg-[#070312] text-slate-100'
      }`}
    >
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Smartphone Shell (Responsive: Fullscreen on mobile, Phone Mockup on Desktop) */}
      <div
        className={`w-full h-[100dvh] sm:h-[820px] sm:max-w-sm sm:border-[6px] sm:rounded-[44px] sm:shadow-2xl border-0 rounded-none shadow-none overflow-hidden flex flex-col relative z-10 transition-colors duration-300 ${
          isLight
            ? 'bg-white border-purple-200/90 shadow-purple-200/60'
            : 'bg-slate-950 border-slate-800/90 shadow-[0_0_50px_rgba(168,85,247,0.25)]'
        }`}
      >
        {/* Status Bar */}
        <div
          className={`px-6 pt-3 pb-2 flex items-center justify-between text-xs border-b transition-colors ${
            isLight
              ? 'bg-purple-50/90 text-purple-900 border-purple-100'
              : 'bg-slate-950 text-slate-400 border-purple-950/40'
          }`}
        >
          <span className="font-bold tracking-wider">09:41</span>
          <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center border border-purple-900/30">
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center space-x-1 text-[9px] font-black">
            <span className={`text-[8px] font-mono mr-0.5 ${isLight ? 'text-purple-700/80' : 'text-slate-400'}`}>{networkStatus}</span>
            <Wifi className="w-3 h-3 text-emerald-500" />
            <span className={`text-[8px] font-mono ml-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{batteryLevel}%</span>
            <Battery className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Multilingual Selector */}
        <div
          className={`px-6 py-1.5 flex justify-between items-center text-[10px] border-b font-extrabold ${
            isLight ? 'bg-purple-50/40 border-purple-100 text-purple-950' : 'bg-slate-900/60 border-purple-900/25 text-purple-300'
          }`}
        >
          <span className="uppercase text-[9px] tracking-widest text-slate-500">Language</span>
          <div className="flex space-x-2 border rounded-full px-2 py-0.5 bg-purple-100/30 border-purple-200">
            {[
              { code: 'te', label: 'తె' },
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'ही' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`px-1.5 rounded transition ${
                  language === lang.code ? 'bg-purple-700 text-white font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Forms */}
        {!isRegistered ? (
          <div
            className={`flex-1 p-5 flex flex-col justify-between overflow-y-auto ${
              isLight
                ? 'bg-gradient-to-b from-purple-100/60 via-white to-purple-50/40'
                : 'bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950'
            }`}
          >
            <div className="text-center space-y-2 pt-1">
              <div className="flex justify-center">
                <BrandLogo size={58} />
              </div>
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-fuchsia-600 to-blue-600 tracking-tight">
                ADISHAKTI
              </h1>
              <p className="text-[10px] text-purple-700/80 font-bold">Quantex Intelligence Systems</p>

              <div className="pt-2">
                <div
                  className={`p-1 rounded-xl border flex text-xs font-bold ${
                    isLight ? 'bg-purple-100/70 border-purple-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setAuthMode('LOGIN')}
                    className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1 ${
                      authMode === 'LOGIN' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('REGISTER');
                      setRegStep(1);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center space-x-1 ${
                      authMode === 'REGISTER' ? 'bg-fuchsia-600 text-white shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              </div>
            </div>

            {authMode === 'LOGIN' && (
              <div
                className={`space-y-4 my-auto p-5 rounded-2xl border ${
                  isLight ? 'bg-white border-purple-200 shadow-xl' : 'bg-slate-900/80 border-purple-500/20'
                }`}
              >
                <div className="space-y-1">
                  <h2 className={`text-xs font-bold flex items-center space-x-1.5 ${isLight ? 'text-purple-900' : 'text-white'}`}>
                    <LogIn className="w-4 h-4 text-purple-600" />
                    <span>Existing Account Login</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold block mb-1">REGISTERED MOBILE</label>
                    <input
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none ${
                        isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-bold">OTP SECURITY CODE</label>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">Use 123456</span>
                    </div>

                    <div className="flex justify-between gap-1">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value, false)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e, false)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-xl text-center font-bold text-sm focus:border-purple-600 focus:outline-none flex-1 max-w-[40px] ${
                            isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleLoginSubmit}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}

            {authMode === 'REGISTER' && (
              <div
                className={`space-y-4 my-auto p-5 rounded-2xl border ${
                  isLight ? 'bg-white border-purple-200 shadow-xl' : 'bg-slate-900/80 border-purple-500/20'
                }`}
              >
                {regStep === 1 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold">New User Registration</h2>
                    <div>
                      <label className="text-[10px] font-bold block mb-1">MOBILE PHONE NUMBER</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none ${
                          isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold">OTP CODE</label>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">Use 123456</span>
                      </div>
                      <div className="flex justify-between gap-1">
                        {regOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={regOtpRefs[idx]}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value, true)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e, true)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-xl text-center font-bold text-sm focus:border-purple-600 focus:outline-none flex-1 max-w-[40px] ${
                              isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleRegisterOtpSubmit}
                      className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Verify OTP Code
                    </button>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold text-purple-900 dark:text-white">Configure Profile</h2>
                    <div>
                      <label className="text-[10px] font-bold block mb-1">YOUR FULL NAME</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name"
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none ${
                          isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                        }`}
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!fullName) {
                          alert("Please enter your name");
                          return;
                        }
                        try {
                          const res = await fetch('/api/auth/otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId,
                              name: fullName,
                              action: 'UPDATE_PROFILE'
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setRegStep(3);
                          } else {
                            alert(data.error || 'Failed to update name');
                          }
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                      className="w-full py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
                    >
                      Next: Setup Emergency Contacts
                    </button>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-3.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-white">Emergency Contacts (Guardians)</h2>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Add phone numbers of your husband, brother, or parents to receive the automated Voice IVR emergency calls.
                    </p>
                    
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={gNameInput}
                        onChange={(e) => setGNameInput(e.target.value)}
                        placeholder="Guardian Name (e.g. Husband)"
                        className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none ${
                          isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                        }`}
                      />
                      <input
                        type="text"
                        value={gPhoneInput}
                        onChange={(e) => setGPhoneInput(e.target.value)}
                        placeholder="Guardian Phone (e.g. +91 99999 99999)"
                        className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none ${
                          isLight ? 'bg-purple-50/50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                        }`}
                      />
                      <button
                        onClick={addGuardian}
                        className="w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[10px] rounded-lg border border-purple-200 transition"
                      >
                        + Add Guardian Contact
                      </button>
                    </div>

                    {/* Show list of added guardians */}
                    {guardians.length > 0 && (
                      <div className="space-y-1.5 border-t pt-2 border-purple-100">
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Added Contacts ({guardians.length})</p>
                        <div className="max-h-24 overflow-y-auto space-y-1">
                          {guardians.map((g, idx) => (
                            <div key={g.id} className="p-1.5 border rounded-lg flex justify-between items-center text-[10px] bg-slate-50/50 border-slate-100">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-[8px] bg-purple-100 text-purple-800 px-1 rounded-full">
                                  #{idx + 1}
                                </span>
                                <span className="font-bold text-slate-800">{g.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-slate-500">{g.phone}</span>
                                <button
                                  onClick={() => deleteGuardian(g.id)}
                                  className="text-red-500 hover:text-red-700 transition"
                                  title="Delete Guardian"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (guardians.length === 0) {
                          alert("Please add at least one guardian contact to receive emergency calls.");
                          return;
                        }
                        setRegStep(4);
                      }}
                      className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-black shadow-md transition"
                    >
                      Save &amp; Continue
                    </button>
                  </div>
                )}

                {regStep === 4 && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold text-purple-900 dark:text-white">Opt-In Audio Consent</h2>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Do you consent to automatic ambient audio monitoring during emergency Red alerts? This helps responders hear the surrounding environment.
                    </p>
                    <div className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={audioConsent}
                        onChange={(e) => setAudioConsent(e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-[10px] font-bold text-slate-700">Yes, I grant audio surveillance consent.</span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/auth/otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId,
                              name: fullName,
                              consentAudioMonitoring: audioConsent,
                              action: 'UPDATE_PROFILE'
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setIsRegistered(true);
                          } else {
                            alert(data.error || 'Failed to submit consent');
                          }
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                      className="w-full py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
                    >
                      Finish Setup
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="text-center text-[10px] text-slate-500">ADISHAKTI Safety Portal</div>
          </div>
        ) : (

          /* APP BODY */
          <div
            className={`flex-1 flex flex-col justify-between overflow-hidden transition-colors duration-300 relative ${
              isLight ? 'bg-gradient-to-b from-purple-50 via-white to-purple-50/50' : 'bg-gradient-to-b from-purple-950/30 via-slate-950 to-slate-950'
            }`}
          >
            {/* App Header with Logo and Profile Icon */}
            <div className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${isLight ? 'bg-white border-purple-100' : 'bg-slate-900/60 border-slate-800/80'}`}>
              <div className="flex items-center space-x-2">
                <BrandLogo size={22} />
                <span className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-purple-950' : 'text-white'}`}>
                  ADISHAKTI
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                {/* Theme switch button */}
                <button
                  onClick={() => setTheme(isLight ? 'dark' : 'light')}
                  className={`p-1.5 rounded-xl border transition ${isLight ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-800 border-slate-700 text-purple-300'}`}
                >
                  {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </button>
                {/* Profile Modal toggle */}
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition ${
                    isLight ? 'bg-purple-100 border-purple-200 hover:bg-purple-200 text-purple-700' : 'bg-purple-950/40 border-purple-900/40 hover:bg-purple-900/50 text-purple-300'
                  }`}
                  title="View Safety Profile"
                >
                  <User className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Profile Drawer Modal overlay */}
            {profileModalOpen && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-end justify-center p-4">
                <div className="w-full bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-2.5 border-purple-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                      <User className="w-5 h-5 text-fuchsia-600" />
                      <h3 className="text-sm font-black uppercase tracking-wider">Safety Profile &amp; Contacts</h3>
                    </div>
                    <button
                      onClick={() => setProfileModalOpen(false)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white rounded-xl text-[10px] font-black"
                    >
                      Close
                    </button>
                  </div>

                  <div className="bg-purple-50/50 dark:bg-slate-950 p-2.5 rounded-xl border border-purple-100/50 dark:border-slate-850 text-[10px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">USER NAME:</span>
                      <span className="text-slate-850 dark:text-purple-300 font-black">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">REGISTERED PHONE:</span>
                      <span className="text-slate-850 dark:text-purple-300 font-mono font-bold">{phone || loginPhone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Emergency Contacts Circle ({guardians.length})</p>
                    
                    {/* Add guardian direct shortcut */}
                    <div className="p-2 border rounded-xl bg-slate-50/50 dark:bg-slate-950 dark:border-slate-850 space-y-1.5">
                      <p className="text-[8px] font-black text-purple-700 dark:text-purple-300">Add New Contact</p>
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          value={gNameInput}
                          onChange={(e) => setGNameInput(e.target.value)}
                          placeholder="Name"
                          className="flex-1 border rounded-lg px-2 py-1 text-[10px] focus:outline-none bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={gPhoneInput}
                          onChange={(e) => setGPhoneInput(e.target.value)}
                          placeholder="Phone"
                          className="flex-1 border rounded-lg px-2 py-1 text-[10px] focus:outline-none bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={addGuardian}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-[9px] rounded-lg transition"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {guardians.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {guardians.map((g, idx) => (
                          <div key={g.id} className="p-2 border rounded-lg flex justify-between items-center text-[10px] bg-slate-50/50 border-slate-100 dark:bg-slate-950 dark:border-slate-850">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono text-[8px] bg-purple-100 text-purple-800 px-1 rounded-full">
                                #{idx + 1}
                              </span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{g.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-slate-500 dark:text-slate-400">{g.phone}</span>
                              <button
                                onClick={() => deleteGuardian(g.id)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Delete Guardian"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-rose-600 font-bold">No emergency contacts registered. Please add at least one guardian to receive IVR alerts.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Double Verification Modals */}
            {activeConfirmType && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-end justify-center p-4">
                <div className="w-full bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                    <HelpCircle className="w-5 h-5 text-fuchsia-600 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-wider">{T[language].confirmTitle}</h3>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-normal font-bold">
                    {activeConfirmType === 'WARNING'
                      ? T[language].confirmWarning
                      : activeConfirmType === 'SOS'
                      ? T[language].confirmSos
                      : T[language].confirmSafe}
                  </p>

                  <div className="flex space-x-3 pt-2">
                    <button onClick={() => setActiveConfirmType(null)} className="flex-1 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl">No, Cancel</button>
                    <button onClick={handleConfirmAction} className="flex-1 py-2 bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md">Yes, Confirm</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {activeTab === 'HOME' && (
                <div className="space-y-3">
                  <div className="flex flex-col items-center py-1">
                    <button
                      onClick={() => {
                        if (redAlertActive || warningActive) {
                          setActiveConfirmType('SAFE');
                        } else {
                          alert("Your safety status is green & verified. To test alerts, toggle the warning switch or trigger RED SOS below.");
                        }
                      }}
                      className={`w-32 h-32 rounded-full p-1 flex items-center justify-center transition-all duration-500 ${
                        redAlertActive 
                          ? 'bg-red-600 shadow-lg shadow-red-500/40 animate-pulse scale-105' 
                          : warningActive 
                          ? 'bg-amber-500 shadow-lg shadow-amber-500/30' 
                          : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 text-center border transition-colors duration-300 ${
                        redAlertActive
                          ? 'bg-red-50/95 dark:bg-red-950/95 border-red-300'
                          : warningActive
                          ? 'bg-amber-50/95 dark:bg-amber-950/95 border-amber-300'
                          : isLight
                          ? 'bg-emerald-50/95 border-emerald-200'
                          : 'bg-slate-950 border-emerald-500/30'
                      }`}>
                        <BrandLogo size={32} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          redAlertActive
                            ? 'text-red-800 dark:text-red-200'
                            : warningActive
                            ? 'text-amber-800 dark:text-amber-200'
                            : isLight
                            ? 'text-emerald-800'
                            : 'text-emerald-400'
                        }`}>
                          {redAlertActive ? 'SOS ACTIVE' : warningActive ? 'MONITORING' : 'ALL SAFE'}
                        </span>
                        <span className={`text-[9px] font-bold mt-0.5 ${
                          redAlertActive
                            ? 'text-red-600'
                            : warningActive
                            ? 'text-amber-600 font-mono'
                            : 'text-emerald-600'
                        }`}>
                          {redAlertActive ? 'Emergency Active' : warningActive ? formatTime(warningSeconds) : 'Status: Verified'}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Warning Toggle */}
                  <div className={`border rounded-2xl p-3.5 space-y-2 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900 border-amber-500/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-bold text-xs flex items-center space-x-1.5">
                        <Radio className="w-4 h-4" />
                        <span>{T[language].warningTrigger}</span>
                      </span>
                      <button
                        onClick={() => {
                          if (warningActive) {
                            setActiveConfirmType('SAFE');
                          } else {
                            setActiveConfirmType('WARNING');
                          }
                        }}
                        className={`w-12 h-6 rounded-full p-0.5 transition flex items-center ${warningActive ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow transform transition"></div>
                      </button>
                    </div>
                    {warningActive && (
                      <div className="bg-amber-100 border border-amber-200 p-2 rounded-xl text-[10px]">
                        <span className="text-amber-950 font-bold">{T[language].alertSent} to: {dynamicNearbyStations[0]?.name || selectedLoc.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Red SOS */}
                  <div className={`border rounded-2xl p-3.5 space-y-2 shadow-sm ${isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/40 border-red-500/40'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-xs flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                        <span>{T[language].redSOS}</span>
                      </span>
                      <button onClick={() => setActiveConfirmType('SOS')} className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg">PRESS SOS</button>
                    </div>
                  </div>



                  {/* High Accuracy Map Display View */}
                  {showMap && (
                    <div className="border border-purple-300 rounded-2xl overflow-hidden shadow-md">
                      <iframe
                        title="Live Accurate Location Map"
                        width="100%"
                        height="150"
                        src={osmEmbedUrl}
                        style={{ border: 0 }}
                      ></iframe>
                    </div>
                  )}

                  {/* Location Switcher presets */}
                  <div className="flex space-x-2 overflow-x-auto pb-1 text-[10px]">
                    {LOCATION_PRESETS.map((loc) => (
                      <button key={loc.id} onClick={() => setSelectedLoc(loc)} className={`px-3 py-1 rounded-xl border shrink-0 ${selectedLoc.id === loc.id ? 'bg-purple-700 text-white' : 'bg-purple-100 text-slate-700'}`}>
                        {loc.name.split(',')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Station Responders */}
                  <div className={`border p-3.5 rounded-2xl text-xs space-y-2.5 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900 border-slate-800'}`}>
                    <h3 className={`font-black ${isLight ? 'text-purple-700' : 'text-purple-300'}`}>{T[language].nearByStations}</h3>
                    {dynamicNearbyStations.map((st) => (
                      <div key={st.id} className={`p-2.5 border rounded-xl flex justify-between items-center ${isLight ? 'bg-purple-50/40 border-purple-100 text-slate-900' : 'bg-slate-950 border-purple-950/20 text-white'}`}>
                        <div className="flex-1 mr-2">
                          <p className="font-bold">{st.name}</p>
                          <p className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{st.dist} away • {st.phone}</p>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(st.name + ', ' + (st.address || 'Andhra Pradesh'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-fuchsia-600 hover:underline font-black flex items-center mt-1"
                          >
                            <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> Navigate on Google Maps
                          </a>
                        </div>
                        <a href={`tel:${st.phone}`} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[9px] shadow text-center">Call</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEMES */}
              {activeTab === 'SCHEMES' && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-purple-700 uppercase tracking-wider">AP Government Scheme Navigator</h2>
                  <div className="bg-white border border-purple-200 p-3.5 rounded-xl space-y-2 shadow-sm">
                    <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded font-bold">Loan Scheme</span>
                    <h3 className="text-xs font-bold text-slate-900">DWCRA Collateral-Free MSME Loan</h3>
                    <p className="text-[10px] text-fuchsia-600 font-bold">₹50 Lakhs @ 4% Interest Subvention</p>
                    <a href="https://serp.ap.gov.in" className="block text-center py-1.5 bg-purple-700 text-white font-bold text-[10px] rounded-lg shadow">Apply via SERP AP Portal</a>
                  </div>
                </div>
              )}

              {/* TAB 3: LEGAL AWARENESS & INTERACTIVE FLOW */}
              {activeTab === 'LEGAL' && (
                <div className="space-y-3.5">
                  
                  {/* Top Discrete Header Panel */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm ${isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-950/20 border-rose-900/40'}`}>
                    <div className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      <span className="text-[10px] font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest">Discrete Security</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Offline Mode Toggle */}
                      <button
                        onClick={() => {
                          const state = !isOnline;
                          setIsOnline(state);
                          alert(state ? 'Network Online. Cloud sync enabled.' : 'Offline Access Active. Using local safety database.');
                        }}
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-bold transition flex items-center space-x-1 ${
                          !isOnline ? 'bg-slate-800 text-sky-400 border-sky-500' : 'bg-purple-100 text-purple-900 border-purple-200'
                        }`}
                      >
                        <span>{!isOnline ? 'Offline Active' : 'Go Offline'}</span>
                      </button>

                      {/* QUICK EXIT BUTTON */}
                      <button
                        onClick={() => {
                          window.location.href = 'https://www.google.com';
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase rounded-lg shadow-md flex items-center space-x-1"
                      >
                        <span>EXIT</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 border-b pb-2 border-purple-100">
                    <Scale className="w-5 h-5 text-purple-700" />
                    <h2 className={`text-sm font-black uppercase tracking-wider ${isLight ? 'text-purple-900' : 'text-white'}`}>
                      Legal Support Flowchart
                    </h2>
                  </div>

                  {/* Speaks Problem / Voice Prompt Simulation Columns */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm bg-white dark:bg-slate-900 ${isLight ? 'border-purple-200' : 'border-slate-800'}`}>
                    
                    {/* Real STT Microphone Integration */}
                    <div className="flex flex-col items-center p-2 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                      <p className="text-[10px] text-purple-700 font-extrabold uppercase tracking-widest">Voice-based Navigation (STT)</p>
                      
                      <button
                        onClick={startListening}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isListening 
                            ? 'bg-red-600 animate-ping text-white' 
                            : 'bg-purple-700 hover:bg-purple-600 text-white shadow-md'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                      
                      <span className="text-[9px] font-bold text-slate-600">
                        {isListening ? '🎙️ Listening... Speak now!' : 'Tap mic to speak problem in English/Telugu'}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-purple-100">
                      <label className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">
                        {language === 'te' ? 'లేదా నేర సమాచారాన్ని ఇక్కడ టైప్ చేయండి' : 'Or Type Incident Details Directly'}
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={incidentDetails}
                          onChange={(e) => {
                            setIncidentDetails(e.target.value);
                            setGeneratedScript('');
                          }}
                          placeholder={
                            language === 'te' 
                              ? 'ఇక్కడ టైప్ చేయండి (ఉదా: భర్త కొడుతున్నాడు, ఆఫీస్ వేధింపు)' 
                              : 'Describe incident (e.g. husband hit me, boss harassed me)'
                          }
                          className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-700 ${
                            isLight ? 'bg-purple-50/30 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                        {incidentDetails && (
                          <button
                            onClick={() => {
                              setIncidentDetails('');
                              setGeneratedScript('');
                            }}
                            className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] shrink-0"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {!incidentDetails && (
                      <div className="text-center py-2 text-[10px] text-slate-500 font-medium">
                        🎤 Speak into the microphone or type your complaint above to dynamically load legal acts &amp; action steps.
                      </div>
                    )}
                  </div>

                  {/* DYNAMIC FLOW CHART RENDERED BELOW BASED ON VOICE SELECTION */}
                  {incidentDetails && (() => {
                    const matchedPath = getMatchedPathway(incidentDetails);
                    return (
                      <div className="mt-3 p-3.5 rounded-2xl border-2 border-purple-500/30 bg-purple-50/40 space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b pb-2 border-purple-200/50">
                          <span className="text-[9px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded">
                            {matchedPath === 'DV' 
                              ? 'Domestic Violence Pathway (DV Act 2005)' 
                              : matchedPath === 'POSH' 
                              ? 'Workplace Harassment (POSH Act 2013)' 
                              : matchedPath === 'PROPERTY' 
                              ? 'Property & Inheritance (Hindu Succession Act)' 
                              : matchedPath === 'CYBER'
                              ? 'Cyber Crime & Morphing (IT Act / BNS 2023)'
                              : matchedPath === 'RAGGING'
                              ? 'Campus Ragging (UGC Regulations 2009)'
                              : matchedPath === 'LEGAL_AID'
                              ? 'Free Legal Aid (Article 39A / LSA Act 1987)'
                              : matchedPath === 'ZERO_FIR'
                              ? 'Zero FIR Rights (Section 173 BNSS 2023)'
                              : matchedPath === 'CHILD_RIGHTS'
                              ? 'Child Rights & Protection Pathway (CLPRA / POCSO)'
                              : matchedPath === 'PERSONAL_SAFETY'
                              ? 'Personal Safety & Self-Defence (BNS 2023)'
                              : 'General Safety Guidance Pathway'}
                          </span>
                          <button onClick={() => setIncidentDetails('')} className="text-[9px] text-slate-500 hover:text-slate-900 underline">Clear Flow</button>
                        </div>

                        {/* Supportive Message & Counselor Suggestion Card */}
                        <div className={`p-4 rounded-xl border space-y-3 shadow-sm ${
                          isLight 
                            ? 'bg-purple-50 border-purple-200 text-slate-800' 
                            : 'bg-slate-900 border-purple-950 text-slate-100'
                        }`}>
                          <div className="flex items-start space-x-2.5 text-[11px] leading-relaxed">
                            <span className="text-base shrink-0">🤝</span>
                            <div>
                              <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                                {language === 'te' 
                                  ? 'మీరు ఎదుర్కొన్న సమస్యకు మేము చాలా విచారిస్తున్నాము. చింతించకండి, భారత ప్రభుత్వం ఇలాంటి చర్యలను ఏమాత్రం సహించదు మరియు కఠినంగా నిరోధిస్తుంది. చట్టం మీ వైపే ఉంది.' 
                                  : 'We are truly sorry to hear about what you went through. Please do not worry, the Indian Government strictly prohibits and does not tolerate these kinds of actions. You are fully protected, and justice is on your side.'}
                              </p>
                              <p className={`mt-2 text-[10px] font-bold p-2.5 rounded-lg border ${
                                isLight 
                                  ? 'bg-white border-purple-100 text-slate-700' 
                                  : 'bg-slate-950 border-purple-900/30 text-slate-300'
                              }`}>
                                💡 {language === 'te'
                                  ? 'అధికారిక చట్టపరమైన ఫిర్యాదు చేయడానికి ముందు, మీ మానసిక ధైర్యానికి మరియు సరైన సలహాల కొరకు ఒక ప్రొఫెషనల్ కౌన్సిలర్‌ను సంప్రదించాల్సిందిగా మేము సూచిస్తున్నాము.'
                                  : 'Before proceeding to file an official complaint, we suggest you speak with a professional counselor for emotional support and guidance.'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Counselor Details Panel */}
                          <div className={`p-3 rounded-xl text-[10px] space-y-1.5 shadow-sm ${
                            isLight 
                              ? 'bg-purple-900 text-white' 
                              : 'bg-slate-950 text-slate-100 border border-purple-900/50'
                          }`}>
                            <div className="flex justify-between items-center border-b pb-1 border-white/10">
                              <span className="font-black uppercase tracking-wider text-[8px] opacity-90">👩‍💼 RECOMMENDED COUNSELOR</span>
                              <span className="font-bold text-[8px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">24/7 ACTIVE</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-80">Name:</span>
                              <span className="font-black">Dr. G. Hemalatha (Sr. Counselor)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="opacity-80">Contact Centre:</span>
                              <span className="font-medium">Sakhi One Stop Centre &amp; Women Helpline</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="opacity-80">Helpline:</span>
                              <div className="flex space-x-1.5 font-mono font-black text-yellow-300">
                                <a href="tel:08832441091" className="hover:underline">0883-2441091</a>
                                <span className="opacity-50">/</span>
                                <a href="tel:181" className="hover:underline">Toll-Free 181</a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 1: Info on Rights Card */}
                        <div className="bg-white p-2.5 rounded-xl border border-purple-100 space-y-1">
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">1. Legal Info &amp; Act Guidelines</p>
                          <p className="text-xs font-bold text-slate-900">
                            {matchedPath === 'DV'
                              ? 'Protection of Women from Domestic Violence Act 2005 & Dowry Prohibition Act 1961: Protects you against physical/emotional abuse, dowry harassment, and guarantees your right to reside in the shared household.'
                              : matchedPath === 'POSH'
                              ? 'POSH Act 2013 & Occupational Safety Code 2020: Guarantees a safe, secure, and harassment-free workplace. You have the right to file a complaint with the Internal Complaints Committee (ICC).'
                              : matchedPath === 'PROPERTY'
                              ? 'Hindu Succession Act (Amended 2005) & Article 300A: Daughters have equal coparcenary rights by birth in ancestral property. You are protected against illegal eviction.'
                              : matchedPath === 'CYBER'
                              ? 'IT Act 2000 (Section 66C/D, 67/67A) & BNS 2023: Protects against online morphing, cyberstalking, identity theft, and obscene content sharing. Morphing photos without consent is a crime.'
                              : matchedPath === 'RAGGING'
                              ? 'UGC Regulations 2009: Absolute right to a ragging-free campus. Educational institutions must provide a safe environment and keep ragging complaints completely confidential.'
                              : matchedPath === 'LEGAL_AID'
                              ? 'Article 39A of the Constitution & Legal Services Authorities Act, 1987: Entitles women to free legal assistance, representation, and advice through DLSA Taluk Committees without any financial burden.'
                              : matchedPath === 'ZERO_FIR'
                              ? 'Section 173 of BNSS, 2023: Absolute legal right to file a Zero FIR at ANY police station regardless of where the incident occurred. Complainant gets a free copy of the FIR.'
                              : matchedPath === 'CHILD_RIGHTS'
                              ? 'Child & Adolescent Labour Act 1986 (amended 2016) & POCSO Act 2012: Children below 18 years are protected from employment in any hazardous occupations. Girls below 18 are protected against child marriage under the Child Marriage Prohibition Act 2006.'
                              : matchedPath === 'PERSONAL_SAFETY'
                              ? 'Bharatiya Nyaya Sanhita (BNS) 2023: Protects women against offences like stalking, sexual harassment, assault, and criminal intimidation. Under Sections 34-44 of BNS, you have the absolute legal Right of Private Defence (Self-Defence) to protect yourself using reasonable force.'
                              : 'General Women Safety Rights: You have the right to privacy, dignity, and immediate medical treatment without delay under Article 21 (Right to Life).'}
                          </p>
                        </div>

                        {/* Step 2: Interactive Action Column Buttons */}
                        <div className="space-y-2">
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">2. Required Action Steps (Tap to Dispatch)</p>
                          <div className="grid grid-cols-3 gap-2">
                            {matchedPath === 'DV' ? (
                              <>
                                <button onClick={() => setActiveConfirmType('SOS')} className="p-2 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-red-600 mb-1" />
                                  <span className="text-[8px] font-black text-red-900">Call Police</span>
                                </button>
                                <button onClick={() => alert('Connected to Pro-bono Advocate Sandhya')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Legal Help</span>
                                </button>
                                <button onClick={() => alert('GGH Hospital Sakhi Centre Shelter details dispatched.')} className="p-2 bg-pink-50 hover:bg-pink-100 border border-pink-300 rounded-xl text-center flex flex-col items-center">
                                  <MapPin className="w-4 h-4 text-pink-600 mb-1" />
                                  <span className="text-[8px] font-black text-pink-900">Find Shelter</span>
                                </button>
                              </>
                            ) : matchedPath === 'POSH' ? (
                              <>
                                <button onClick={handleGenerateScript} className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-center flex flex-col items-center">
                                  <BookOpen className="w-4 h-4 text-amber-600 mb-1" />
                                  <span className="text-[8px] font-black text-amber-900">File Report</span>
                                </button>
                                <button onClick={() => alert('Scheduled call with Adv. Sharada')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Talk Lawyer</span>
                                </button>
                                <button onClick={() => alert('POSH Legal Compliance PDF Downloaded.')} className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-blue-600 mb-1" />
                                  <span className="text-[8px] font-black text-blue-900">Know Rights</span>
                                </button>
                              </>
                            ) : matchedPath === 'PROPERTY' ? (
                              <>
                                <button onClick={handleGenerateScript} className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-emerald-600 mb-1" />
                                  <span className="text-[8px] font-black text-emerald-900">File Case</span>
                                </button>
                                <button onClick={() => alert('Scheduled Land dispute desk consultation')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <User className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Talk Lawyer</span>
                                </button>
                                <button onClick={() => setActiveTab('SCHEMES')} className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl text-center flex flex-col items-center">
                                  <Award className="w-4 h-4 text-indigo-600 mb-1" />
                                  <span className="text-[8px] font-black text-indigo-900">View Schemes</span>
                                </button>
                              </>
                            ) : matchedPath === 'CYBER' ? (
                              <>
                                <button onClick={() => alert('Connected to National Cyber Crime portal www.cybercrime.gov.in to file report.')} className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-center flex flex-col items-center">
                                  <ExternalLink className="w-4 h-4 text-blue-600 mb-1" />
                                  <span className="text-[8px] font-black text-blue-900">Report Cyber</span>
                                </button>
                                <button onClick={() => alert('Morphing security guides and takedown tools loaded.')} className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-amber-600 mb-1" />
                                  <span className="text-[8px] font-black text-amber-900">Secure Profile</span>
                                </button>
                                <button onClick={() => alert('Scheduled consultation with Cyber Law panel')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Cyber Law Aid</span>
                                </button>
                              </>
                            ) : matchedPath === 'RAGGING' ? (
                              <>
                                <button onClick={() => alert('Confidential complaint dispatched to UGC Anti-Ragging Committee.')} className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-center flex flex-col items-center">
                                  <BellRing className="w-4 h-4 text-rose-600 mb-1" />
                                  <span className="text-[8px] font-black text-rose-900">Report UGC</span>
                                </button>
                                <button onClick={() => alert('Calling anti-ragging National Helpline: 1800-180-5522')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <PhoneCall className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Call Helpline</span>
                                </button>
                                <button onClick={() => alert('Anonymous alert sent to college dean portal.')} className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-center flex flex-col items-center">
                                  <Lock className="w-4 h-4 text-slate-600 mb-1" />
                                  <span className="text-[8px] font-black text-slate-800">Secret Alert</span>
                                </button>
                              </>
                            ) : matchedPath === 'LEGAL_AID' ? (
                              <>
                                <button onClick={() => alert('Contacted East Godavari DLSA panel.')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">DLSA Desk</span>
                                </button>
                                <button onClick={() => alert('Free Legal Aid request letter generated under Article 39A.')} className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-center flex flex-col items-center">
                                  <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
                                  <span className="text-[8px] font-black text-emerald-900">Free Counsel</span>
                                </button>
                                <button onClick={() => alert('Lok Adalat ADR ADR centers list downloaded.')} className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl text-center flex flex-col items-center">
                                  <MapPin className="w-4 h-4 text-indigo-600 mb-1" />
                                  <span className="text-[8px] font-black text-indigo-900">Lok Adalat</span>
                                </button>
                              </>
                            ) : matchedPath === 'ZERO_FIR' ? (
                              <>
                                <button onClick={handleGenerateScript} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <BookOpen className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Draft Zero FIR</span>
                                </button>
                                <button onClick={() => alert('BNSS Section 173 mandate: Female officer request added to report.')} className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-center flex flex-col items-center">
                                  <User className="w-4 h-4 text-emerald-600 mb-1" />
                                  <span className="text-[8px] font-black text-emerald-900">Female Police</span>
                                </button>
                                <button onClick={() => setActiveConfirmType('SOS')} className="p-2 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-red-600 mb-1" />
                                  <span className="text-[8px] font-black text-red-900">Dispatch SOS</span>
                                </button>
                              </>
                            ) : matchedPath === 'CHILD_RIGHTS' ? (
                              <>
                                <button onClick={() => alert('Anonymously reported child exploit/marriage incident to Child Welfare Committee.')} className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-center flex flex-col items-center">
                                  <BellRing className="w-4 h-4 text-rose-600 mb-1" />
                                  <span className="text-[8px] font-black text-rose-900">Report Abuse</span>
                                </button>
                                <button onClick={() => alert('Dialing National Child Helpline: 1098')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <PhoneCall className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Call 1098</span>
                                </button>
                                <button onClick={() => alert('Contacted Juvenile Justice Legal Aid Trustee.')} className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-center flex flex-col items-center">
                                  <Scale className="w-4 h-4 text-emerald-600 mb-1" />
                                  <span className="text-[8px] font-black text-emerald-900">JJ Board Counsel</span>
                                </button>
                              </>
                            ) : matchedPath === 'PERSONAL_SAFETY' ? (
                              <>
                                <button onClick={() => alert('BNSS Section 173 mandate: Dispatching immediate response unit with female police assistance.')} className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-rose-600 mb-1" />
                                  <span className="text-[8px] font-black text-rose-900">Dispatch Police</span>
                                </button>
                                <button onClick={() => alert('Self-Defence training tutorial and safety maps loaded.')} className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-center flex flex-col items-center">
                                  <Sparkles className="w-4 h-4 text-emerald-600 mb-1" />
                                  <span className="text-[8px] font-black text-emerald-900">Self-Defence</span>
                                </button>
                                <button onClick={() => setActiveConfirmType('SOS')} className="p-2 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl text-center flex flex-col items-center">
                                  <Radio className="w-4 h-4 text-red-600 mb-1" />
                                  <span className="text-[8px] font-black text-red-900">Trigger SOS</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setActiveConfirmType('SOS')} className="p-2 bg-red-50 hover:bg-red-100 border border-red-300 rounded-xl text-center flex flex-col items-center">
                                  <Shield className="w-4 h-4 text-red-600 mb-1" />
                                  <span className="text-[8px] font-black text-red-900">Call SOS</span>
                                </button>
                                <button onClick={() => alert('Connected to State Women Helpline desk')} className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-center flex flex-col items-center">
                                  <PhoneCall className="w-4 h-4 text-purple-700 mb-1" />
                                  <span className="text-[8px] font-black text-purple-950">Call Helpline</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Step 3: Script & Dispatch logs */}
                        {generatedScript && (
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                            <pre className="text-[8px] text-emerald-400 font-mono whitespace-pre-wrap">{generatedScript}</pre>
                            <button onClick={() => alert('Copied to clipboard. Dispatching complaint...')} className="w-full py-1 bg-emerald-600 text-white font-bold text-[9px] rounded shadow">
                              Submit Draft to Police Command Center
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* AP Sakhi Protection Officers Locator Directory */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>AP Sakhi Locator</span>
                      </span>
                      <select
                        value={selectedDistrictFilter}
                        onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                        className={`text-[10px] border rounded p-1 font-bold ${isLight ? 'bg-purple-50 border-purple-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                      >
                        {PROTECTION_OFFICERS.map((po) => (
                          <option key={po.district} value={po.district}>{po.district}</option>
                        ))}
                      </select>
                    </div>

                    {PROTECTION_OFFICERS.filter((po) => po.district === selectedDistrictFilter).map((po) => (
                      <div key={po.district} className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-black text-purple-950">{po.office}</p>
                            <p className="text-[10px] text-slate-700">Officer: {po.name}</p>
                            <p className="text-[9px] text-slate-500">{po.address}</p>
                          </div>
                          <a href={`tel:${po.phone}`} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[9px] flex items-center space-x-1 shadow">
                            <PhoneCall className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vernacular Legal Videos List */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900'}`}>
                    <h3 className="text-xs font-black text-purple-700 flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-fuchsia-600" />
                      <span>Vernacular Legal Video Guides (&le;90s)</span>
                    </h3>
                    <div className="space-y-2.5">
                      {LEGAL_GUIDES.map((guide) => (
                        <div key={guide.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{guide.title}</h4>
                          <p className="text-[9px] text-slate-600">{guide.advocate}</p>
                          <button onClick={() => alert(`Playing video guide: ${guide.title}`)} className="px-3 py-1 bg-purple-700 text-white font-bold rounded-lg text-[9px] shadow">Play Video</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: UPSKILL - ADISHAKTI ACADEMY */}
              {activeTab === 'UPSKILL' && (
                <div className="space-y-3.5">
                  <div className="flex items-center space-x-2 border-b pb-2 border-purple-100">
                    <Sparkles className="w-5 h-5 text-fuchsia-600" />
                    <h2 className={`text-sm font-black uppercase tracking-wider ${isLight ? 'text-purple-900' : 'text-white'}`}>
                      Adishakti Vernacular Academy
                    </h2>
                  </div>

                  {/* 1. Interactive Safe UPI simulator card */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center space-x-1.5 text-xs font-black text-purple-700">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-600 animate-pulse" />
                      <span>Safe UPI Payment Training Simulator</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Practice how to verify business details before typing your UPI PIN. Avoid cyber fraud scams.
                    </p>

                    {upiStep === 1 ? (
                      <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100 space-y-2">
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border text-[10px] font-bold">
                          <span>Pay To: Fake Winner Lottery Desk</span>
                          <span className="text-red-600 font-extrabold">₹5,000</span>
                        </div>
                        <p className="text-[9px] text-rose-700 font-bold bg-rose-50 p-1.5 rounded border border-rose-200">
                          ⚠️ warning: True merchants never ask you to enter your UPI PIN to RECEIVE money.
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              alert('Excellent Choice! You successfully rejected a lottery payment scam.');
                              setUpiStep(1);
                              setSimPin('');
                            }}
                            className="flex-1 py-1.5 bg-emerald-600 text-white font-bold text-[10px] rounded-lg shadow"
                          >
                            Decline &amp; Report Scam
                          </button>
                          <button
                            onClick={() => setUpiStep(2)}
                            className="flex-1 py-1.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg"
                          >
                            Proceed to Practice PIN
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5 text-white">
                        <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-1">
                          <span className="text-slate-400">NPCI Simulator screen</span>
                          <span className="text-amber-400 font-bold">Secure Keyboard</span>
                        </div>
                        
                        <div className="text-center py-1">
                          <p className="text-[9px] text-slate-400">ENTER 4-DIGIT UPI PIN</p>
                          <div className="flex justify-center space-x-2.5 mt-1.5">
                            {[0, 1, 2, 3].map((idx) => (
                              <div key={idx} className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900">
                                {simPin.length > idx && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom security Keypad click simulator */}
                        <div className="grid grid-cols-3 gap-1 max-w-[150px] mx-auto">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                            <button
                              key={num}
                              onClick={() => {
                                if (simPin.length < 4) {
                                  const nextPin = simPin + num;
                                  setSimPin(nextPin);
                                  if (nextPin.length === 4) {
                                    alert('Simulator verified: Practice session completed successfully! Never share this PIN with anyone.');
                                    setUpiStep(1);
                                    setSimPin('');
                                  }
                                }
                              }}
                              className="py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded font-bold text-[10px]"
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Self Help Group (SHG) Enterprise Incubation Cards */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center space-x-1.5 text-xs font-black text-purple-700">
                      <Award className="w-4.5 h-4.5 text-indigo-600" />
                      <span>SHG Enterprise Incubation Center</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { title: 'Organic Food & Pickle Units', steps: 'Get FSSAI license, design packaging, enroll in DWCRA bazaar distribution.', icon: '🥗' },
                        { title: 'Uppada Handloom Marketing', steps: 'Create digital posters, sell directly on SHG Market tab to eliminate middlemen.', icon: '🧵' },
                        { title: 'Rural Tailoring & Garments', steps: 'Register for AP Government tailoring machines subsidy scheme under DWCRA.', icon: '✂️' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-purple-100 bg-purple-50/20 flex space-x-2.5 items-start">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <h4 className="text-[10px] font-black text-purple-950">{item.title}</h4>
                            <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed">{item.steps}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. AP Government Skill Development (APSSDC) integration */}
                  <div className={`border p-3.5 rounded-2xl space-y-3 shadow-sm ${isLight ? 'bg-white border-purple-200' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-center space-x-1.5 text-xs font-black text-purple-700">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>AP Government Free Certificate Programs</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { course: 'Digital Marketing & Social Media for Artisans', duration: '4 weeks • Hindi/Telugu', status: 'APSSDC Verified' },
                        { course: 'Basic Computers, Excel & Online Banking', duration: '2 weeks • Telugu', status: 'DWCRA Approved' }
                      ].map((c, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center text-[10px]">
                          <div>
                            <p className="font-bold text-slate-900">{c.course}</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">{c.duration} • {c.status}</p>
                          </div>
                          <button
                            onClick={() => alert(`Registration request submitted for: ${c.course}`)}
                            className="px-2.5 py-1 bg-purple-700 text-white font-bold rounded-lg text-[9px] shadow"
                          >
                            Register
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MARKET */}
              {activeTab === 'MARKET' && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-purple-700 uppercase tracking-wider">SHG Direct Marketplace</h2>
                  <div className="bg-white border border-purple-200 p-3.5 rounded-xl space-y-2 shadow-sm">
                    <span className="text-emerald-600 text-xs font-black">₹4,500</span>
                    <h3 className="text-xs font-bold text-slate-900">Handcrafted Uppada Silk Saree</h3>
                    <a href="tel:+919440188234" className="block text-center py-1.5 bg-purple-700 text-white font-bold text-[10px] rounded-lg shadow">Call Artisan Direct</a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Nav Bar */}
            <div
              className={`px-2 py-2 flex items-center justify-around border-t transition-colors ${
                isLight ? 'bg-white border-purple-100' : 'bg-slate-950 border-purple-900/30 backdrop-blur-md'
              }`}
            >
              <button onClick={() => setActiveTab('HOME')} className={`flex flex-col items-center ${activeTab === 'HOME' ? 'text-fuchsia-600 font-bold' : 'text-slate-400'}`}>
                <Shield className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{T[language].home}</span>
              </button>
              <button onClick={() => setActiveTab('SCHEMES')} className={`flex flex-col items-center ${activeTab === 'SCHEMES' ? 'text-fuchsia-600 font-bold' : 'text-slate-400'}`}>
                <Award className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{T[language].schemes}</span>
              </button>
              <button onClick={() => setActiveTab('LEGAL')} className={`flex flex-col items-center ${activeTab === 'LEGAL' ? 'text-fuchsia-600 font-bold' : 'text-slate-400'}`}>
                <Scale className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{T[language].legal}</span>
              </button>
              <button onClick={() => setActiveTab('UPSKILL')} className={`flex flex-col items-center ${activeTab === 'UPSKILL' ? 'text-fuchsia-600 font-bold' : 'text-slate-400'}`}>
                <BookOpen className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{T[language].upskill}</span>
              </button>
              <button onClick={() => setActiveTab('MARKET')} className={`flex flex-col items-center ${activeTab === 'MARKET' ? 'text-fuchsia-600 font-bold' : 'text-slate-400'}`}>
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{T[language].market}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
