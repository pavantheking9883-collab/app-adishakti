import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  StatusBar
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, Radio, Phone, MapPin, Battery, Wifi, Volume2, Users, Navigation, CheckCircle } from 'lucide-react-native';
import { LotusLogo } from '../components/LotusLogo';
import { offlineSync } from '../services/offlineSync';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  // Safety Engine States
  const [warningActive, setWarningActive] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(0);
  const [redAlertActive, setRedAlertActive] = useState(false);
  const [audioConsented, setAudioConsented] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);

  // Live Telemetry
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [locationText, setLocationText] = useState('Godavari Station Rd, Rajahmundry');
  const [latLng, setLatLng] = useState({ lat: 16.9891, lng: 81.7835 });

  // Warning Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (warningActive) {
      interval = setInterval(() => {
        setWarningSeconds((prev) => {
          const next = prev + 1;
          // Auto IVR trigger if > 30 mins (1800 sec). For testing, we also trigger IVR alert at 10 seconds!
          if (next === 10 || next === 1800) {
            triggerIVRCall('30-Minute Threshold Exceeded');
          }
          return next;
        });
      }, 1000);
    } else {
      setWarningSeconds(0);
    }
    return () => clearInterval(interval);
  }, [warningActive]);

  const triggerIVRCall = (reason: string) => {
    Alert.alert(
      '🚨 AUTOMATED IVR CALL PLACED',
      `Warning Trigger has been active for ${Math.floor(warningSeconds / 60)}m. Automated IVR calls have been dispatched to your Primary & Secondary Guardians.`,
      [{ text: 'I AM SAFE NOW', onPress: () => setWarningActive(false) }, { text: 'ESCALATE TO RED', onPress: () => handleRedAlert() }]
    );
  };

  const handleToggleWarning = async () => {
    const nextState = !warningActive;
    setWarningActive(nextState);
    if (nextState) {
      const res = await offlineSync.queueEvent('WARNING', {
        userId: 'demo-user-101',
        type: 'WARNING',
        lastLat: latLng.lat,
        lastLng: latLng.lng,
        lastAddress: locationText,
        lastBattery: batteryLevel,
        lastNetworkStatus: isOnline ? '4G Active' : 'Offline',
        audioFlag: audioConsented,
        notes: 'Warning Trigger activated by user.'
      });
      setQueuedCount(offlineSync.getQueueLength());
    }
  };

  const handleRedAlert = async () => {
    setRedAlertActive(true);
    const res = await offlineSync.queueEvent('RED', {
      userId: 'demo-user-101',
      type: 'RED',
      lastLat: latLng.lat,
      lastLng: latLng.lng,
      lastAddress: locationText,
      lastBattery: batteryLevel,
      lastNetworkStatus: isOnline ? '4G Active' : 'Offline',
      audioFlag: audioConsented,
      notes: 'CRITICAL RED ALERT SOS Triggered instantly!'
    });
    setQueuedCount(offlineSync.getQueueLength());

    Alert.alert(
      '🚨 RED ALERT DISPATCHED',
      'Immediate emergency alert, GPS location, and audio stream dispatched to Rajahmundry Police Control Room and all registered Guardians.',
      [{ text: 'CANCEL / I AM SAFE', onPress: () => setRedAlertActive(false) }]
    );
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'te' ? 'en' : i18n.language === 'en' ? 'hi' : 'te';
    i18n.changeLanguage(nextLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0933" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <LotusLogo size={42} />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{t('appName')}</Text>
            <Text style={styles.headerSubtitle}>QUANTEX INTELLIGENCE SYSTEMS</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.langBadge} onPress={toggleLanguage}>
          <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Offline / Online Bar */}
      <TouchableOpacity
        style={[styles.networkStatusCard, !isOnline && styles.networkStatusOffline]}
        onPress={() => {
          const nextOnline = !isOnline;
          setIsOnline(nextOnline);
          offlineSync.setOnlineStatus(nextOnline);
          setQueuedCount(offlineSync.getQueueLength());
        }}
      >
        <Wifi size={14} color={isOnline ? '#34d399' : '#f87171'} />
        <Text style={styles.networkStatusText}>
          {isOnline ? 'Network Connected • Realtime Sync Active' : `Offline Mode • ${queuedCount} Events Queued`}
        </Text>
        <Text style={styles.toggleText}>[Tap to Toggle Sim]</Text>
      </TouchableOpacity>

      {/* Centerpiece Hero "I AM SAFE" Button */}
      <View style={styles.heroSection}>
        <TouchableOpacity
          style={[styles.safeCircleButton, redAlertActive && styles.redCircleButton]}
          activeOpacity={0.8}
          onPress={() => {
            if (warningActive || redAlertActive) {
              setWarningActive(false);
              setRedAlertActive(false);
              Alert.alert('Status Updated', 'You have marked yourself safe.');
            } else {
              Alert.alert('Status Verified', 'Your safety status is active and verified.');
            }
          }}
        >
          <View style={styles.innerSafeCircle}>
            <Shield size={38} color="#f0abfc" />
            <Text style={styles.safeButtonText}>
              {redAlertActive ? 'EMERGENCY ACTIVE' : warningActive ? 'MONITORING ON' : t('iAmSafe')}
            </Text>

            <Text style={styles.safeSubtext}>
              {warningActive ? `Timer: ${formatTime(warningSeconds)}` : 'Tap to Confirm Security'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Warning Trigger (Yellow) Control Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Radio size={20} color="#f59e0b" />
            <Text style={styles.cardTitle}>{t('warningTrigger')}</Text>
          </View>
          <Switch
            value={warningActive}
            onValueChange={handleToggleWarning}
            trackColor={{ false: '#334155', true: '#f59e0b' }}
            thumbColor={warningActive ? '#ffffff' : '#94a3b8'}
          />
        </View>

        <Text style={styles.cardDesc}>
          Turn ON when commuting alone or feeling unsafe. If left ON for &gt;30 mins without check-in, auto-places IVR call to registered guardians.
        </Text>

        {warningActive && (
          <View style={styles.timerBanner}>
            <Text style={styles.timerBannerText}>
              Active Monitoring: <Text style={styles.boldTimer}>{formatTime(warningSeconds)}</Text>
            </Text>
            <TouchableOpacity
              style={styles.simIvrBtn}
              onPress={() => triggerIVRCall('Simulated 30-min threshold')}
            >
              <Text style={styles.simIvrBtnText}>Simulate 30-Min IVR Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Red Alert Panic SOS Trigger Card */}
      <View style={[styles.card, styles.redCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <AlertTriangle size={20} color="#ef4444" />
            <Text style={[styles.cardTitle, { color: '#fca5a5' }]}>{t('redAlert')}</Text>
          </View>

          <TouchableOpacity style={styles.redSosButton} onPress={handleRedAlert}>
            <Text style={styles.redSosText}>PRESS SOS</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardDesc}>
          Quick volume-button multi-press triggers instant priority escalation to Police Control Room &amp; Guardians simultaneously without unlocking phone.
        </Text>
      </View>

      {/* Telemetry Status Bar */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryRow}>
          <MapPin size={16} color="#c026d3" />
          <Text style={styles.telemetryLocation} numberOfLines={1}>
            {locationText}
          </Text>
        </View>

        <View style={styles.telemetryStatsRow}>
          <View style={styles.telemetryItem}>
            <Battery size={14} color="#34d399" />
            <Text style={styles.telemetryItemText}>{batteryLevel}% Battery</Text>
          </View>

          <View style={styles.telemetryItem}>
            <Volume2 size={14} color={audioConsented ? '#c026d3' : '#64748b'} />
            <Text style={styles.telemetryItemText}>
              {audioConsented ? 'Audio Consent OK' : 'Audio Disabled'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Action Grid */}
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.quickActionCard} onPress={handleRedAlert}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Phone size={20} color="#f87171" />
          </View>
          <Text style={styles.quickActionLabel}>SOS Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => Alert.alert('Route Tracked', 'Live GPS route sharing active for 60 minutes.')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(192, 38, 211, 0.2)' }]}>
            <Navigation size={20} color="#e879f9" />
          </View>
          <Text style={styles.quickActionLabel}>{t('trackMe')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('Profile')}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
            <Users size={20} color="#60a5fa" />
          </View>
          <Text style={styles.quickActionLabel}>{t('myCircle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => Alert.alert('Dialing 112', 'Direct connection to National Emergency Helpline 112.')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <Shield size={20} color="#34d399" />
          </View>
          <Text style={styles.quickActionLabel}>{t('helpline')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  headerTitleContainer: { marginLeft: 10 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#f472b6', letterSpacing: 1 },
  headerSubtitle: { fontSize: 8, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 },
  langBadge: {
    backgroundColor: '#3b0764',
    borderColor: '#a855f7',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  langText: { color: '#f0abfc', fontSize: 12, fontWeight: '800' },
  networkStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064e3b',
    borderColor: '#059669',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16
  },
  networkStatusOffline: { backgroundColor: '#7f1d1d', borderColor: '#dc2626' },
  networkStatusText: { color: '#e2e8f0', fontSize: 11, fontWeight: '600', marginLeft: 6, flex: 1 },
  toggleText: { color: '#94a3b8', fontSize: 10, fontStyle: 'italic' },
  heroSection: { alignItems: 'center', marginVertical: 12 },
  safeCircleButton: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#6b21a8',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c026d3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12
  },
  redCircleButton: { backgroundColor: '#991b1b', shadowColor: '#ef4444' },
  innerSafeCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#1a0933',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  safeButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5
  },
  safeSubtext: { color: '#c084fc', fontSize: 11, marginTop: 4, fontWeight: '600' },
  card: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  redCard: { backgroundColor: '#450a0a', borderColor: '#991b1b' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#f59e0b', marginLeft: 8 },
  cardDesc: { color: '#94a3b8', fontSize: 11, marginTop: 8, lineHeight: 16 },
  timerBanner: {
    marginTop: 12,
    backgroundColor: '#451a03',
    borderColor: '#d97706',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timerBannerText: { color: '#fef3c7', fontSize: 12 },
  boldTimer: { fontWeight: '900', color: '#fbbf24' },
  simIvrBtn: { backgroundColor: '#b45309', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  simIvrBtnText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  redSosButton: { backgroundColor: '#dc2626', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  redSosText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  telemetryCard: {
    backgroundColor: '#0f172a',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16
  },
  telemetryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  telemetryLocation: { color: '#e2e8f0', fontSize: 12, fontWeight: '700', marginLeft: 6, flex: 1 },
  telemetryStatsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 },
  telemetryItem: { flexDirection: 'row', alignItems: 'center' },
  telemetryItemText: { color: '#94a3b8', fontSize: 11, marginLeft: 4, fontWeight: '600' },
  quickActionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionCard: {
    width: '23%',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center'
  },
  iconBox: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickActionLabel: { color: '#cbd5e1', fontSize: 10, fontWeight: '700', textAlign: 'center' }
});
