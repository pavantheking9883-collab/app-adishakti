import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { User, ShieldCheck, Users, Globe, Volume2, Plus, Heart, Send, CheckCircle2 } from 'lucide-react-native';

const LANGUAGES = [
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
];

export const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();

  // User & Consent state
  const [name, setName] = useState('Sunitha Lakshmi');
  const [phone, setPhone] = useState('+919876543210');
  const [audioConsent, setAudioConsent] = useState(true);
  const consentTimestamp = '2026-07-21 08:30:14 UTC';

  // Guardian chain state
  const [guardians, setGuardians] = useState([
    { id: '1', name: 'Ramakrishna (Husband)', phone: '+919876543211', priority: 1, verified: true },
    { id: '2', name: 'Venkata Rao (Brother)', phone: '+919876543212', priority: 2, verified: true },
    { id: '3', name: 'Saraswathi (Sister)', phone: '+919876543213', priority: 3, verified: false }
  ]);

  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');

  // "Her Voice" community story state
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [stories, setStories] = useState([
    {
      id: 's1',
      title: 'From ₹500 Savings to a Micro-Jute Mill in Kadiyam',
      author: 'Subbalakshmi K.',
      district: 'East Godavari',
      likes: 142
    }
  ]);

  const handleAddGuardian = () => {
    if (!newGuardianName || !newGuardianPhone) {
      Alert.alert('Incomplete', 'Please provide guardian name and phone number.');
      return;
    }
    const nextPriority = guardians.length + 1;
    const newG = {
      id: `${Date.now()}`,
      name: newGuardianName,
      phone: newGuardianPhone,
      priority: nextPriority,
      verified: true
    };
    setGuardians([...guardians, newG]);
    setNewGuardianName('');
    setNewGuardianPhone('');
    Alert.alert('Guardian Added', 'Verified guardian added to escalation chain.');
  };

  const handleAddStory = () => {
    if (!storyTitle || !storyContent) {
      Alert.alert('Incomplete', 'Please enter story title and content.');
      return;
    }
    const newStory = {
      id: `s_${Date.now()}`,
      title: storyTitle,
      author: name,
      district: 'East Godavari',
      likes: 1
    };
    setStories([newStory, ...stories]);
    setStoryTitle('');
    setStoryContent('');
    Alert.alert('Story Submitted', 'Thank you! Your story will be surfaced contextually to inspire other women.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <User size={24} color="#f472b6" />
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>
      <Text style={styles.headerSub}>Self-Managed Guardian Escalation Chain &amp; Language Settings</Text>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.userRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userPhone}>{phone}</Text>
            <Text style={styles.userOrg}>Rajahmundry, AP • DWCRA Group Member</Text>
          </View>
        </View>
      </View>

      {/* Verified Guardian Escalation Chain */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Users size={18} color="#f472b6" />
          <Text style={styles.cardTitle}>{t('guardians')} (Self-Managed Chain)</Text>
        </View>
        <Text style={styles.cardDesc}>
          Auto-escalates in priority order: Guardian 1 &rarr; Guardian 2 &rarr; Guardian 3 if unreachable.
        </Text>

        <View style={{ marginTop: 10 }}>
          {guardians.map((g) => (
            <View key={g.id} style={styles.guardianRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.guardianName}>
                  #{g.priority} {g.name}
                </Text>
                <Text style={styles.guardianPhone}>{g.phone}</Text>
              </View>
              {g.verified && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={12} color="#34d399" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Add New Guardian */}
        <View style={styles.addGuardianBox}>
          <Text style={styles.addTitle}>Add Verified Guardian Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Guardian Name (e.g. Sister, Father)"
            placeholderTextColor="#64748b"
            value={newGuardianName}
            onChangeText={setNewGuardianName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Phone (+91...)"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            value={newGuardianPhone}
            onChangeText={setNewGuardianPhone}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddGuardian}>
            <Plus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add to Chain</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Consent Controls */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Volume2 size={18} color="#c026d3" />
          <Text style={styles.cardTitle}>{t('audioConsent')}</Text>
          <Switch
            value={audioConsent}
            onValueChange={setAudioConsent}
            trackColor={{ false: '#334155', true: '#c026d3' }}
            thumbColor={audioConsent ? '#ffffff' : '#94a3b8'}
          />
        </View>
        <Text style={styles.cardDesc}>
          Audio telemetry is transmitted ONLY during active Warning/Red SOS alerts. Stored immutably with timestamp:
        </Text>
        <Text style={styles.timestampText}>Immutable Consent Log: {consentTimestamp}</Text>
      </View>

      {/* "Her Voice" Community Testimonials */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Heart size={18} color="#f472b6" />
          <Text style={styles.cardTitle}>Her Voice — Community Stories</Text>
        </View>
        <Text style={styles.cardDesc}>Share your story of empowerment, overcoming hardship, or legal victory.</Text>

        <TextInput
          style={styles.input}
          placeholder="Story Title..."
          placeholderTextColor="#64748b"
          value={storyTitle}
          onChangeText={setStoryTitle}
        />
        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Share your experience..."
          placeholderTextColor="#64748b"
          multiline
          value={storyContent}
          onChangeText={setStoryContent}
        />
        <TouchableOpacity style={styles.shareBtn} onPress={handleAddStory}>
          <Send size={14} color="#ffffff" />
          <Text style={styles.shareBtnText}>Submit Story (Moderated)</Text>
        </TouchableOpacity>

        {/* Story Feed */}
        <View style={{ marginTop: 14 }}>
          {stories.map((st) => (
            <View key={st.id} style={styles.storyCard}>
              <Text style={styles.storyTitle}>{st.title}</Text>
              <Text style={styles.storyMeta}>By {st.author} • {st.district}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Language Switcher */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Globe size={18} color="#60a5fa" />
          <Text style={styles.cardTitle}>Choose Preferred Language (10+ Indian Languages)</Text>
        </View>

        <View style={styles.langGrid}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langChip, i18n.language === l.code && styles.langChipActive]}
              onPress={() => i18n.changeLanguage(l.code)}
            >
              <Text style={[styles.langChipText, i18n.language === l.code && styles.langChipTextActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#f472b6', marginLeft: 8 },
  headerSub: { color: '#94a3b8', fontSize: 11, marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#7e22ce', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  userPhone: { color: '#f472b6', fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
  userOrg: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800', marginLeft: 6, flex: 1 },
  cardDesc: { color: '#94a3b8', fontSize: 11, lineHeight: 16, marginBottom: 8 },
  guardianRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', padding: 10, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: '#334155' },
  guardianName: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  guardianPhone: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { color: '#34d399', fontSize: 9, fontWeight: '800', marginLeft: 3 },
  addGuardianBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155' },
  addTitle: { color: '#cbd5e1', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, borderRadius: 8, padding: 8, color: '#ffffff', fontSize: 11, marginBottom: 8 },
  addBtn: { backgroundColor: '#7e22ce', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '800', marginLeft: 4 },
  timestampText: { color: '#c084fc', fontSize: 10, fontFamily: 'monospace', marginTop: 4 },
  shareBtn: { backgroundColor: '#c026d3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 8 },
  shareBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '800', marginLeft: 6 },
  storyCard: { backgroundColor: '#0f172a', padding: 10, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: '#f472b6', marginBottom: 6 },
  storyTitle: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  storyMeta: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  langChip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, margin: 3 },
  langChipActive: { backgroundColor: '#2563eb', borderColor: '#60a5fa' },
  langChipText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
  langChipTextActive: { color: '#ffffff', fontWeight: '800' }
});
