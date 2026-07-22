import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { Mic, Play, Video, Scale, CreditCard, Phone, Sparkles, BookOpen } from 'lucide-react-native';

export const LearnScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTERVIEW' | 'LEGAL' | 'FINANCE'>('INTERVIEW');

  // AI Mock Interview States
  const [isRecording, setIsRecording] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<any | null>(null);

  // Legal Complaint Generator State
  const [incidentType, setIncidentType] = useState('Cyber Stalking / Online Abuse');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  // Financial Literacy Simulator state
  const [upiStep, setUpiStep] = useState(1);
  const [simPin, setSimPin] = useState('');

  const handleSimulateAudioInterview = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInterviewFeedback({
        question: 'నమస్కారం! చెప్పండి, ఈ ఉద్యోగానికి మీరు ఎందుకు సరైన వ్యక్తి? (Tell us why you are suitable for this job?)',
        userTranscript: 'నమస్కారం సార్, నేను డిగ్రీ పూర్తి చేశాను. కంప్యూటర్ టైపింగ్ మరియు అకౌంటింగ్ వచ్చు...',
        clarityScore: 88,
        confidenceScore: 84,
        communicationScore: 90,
        tip: 'Tenglish feedback: Excellent voice clarity! Try to speak slightly slower when explaining technical skills.'
      });
    }, 2500);
  };

  const handleGenerateComplaintScript = () => {
    if (!incidentDetails) {
      Alert.alert('Details Required', 'Please enter brief incident details.');
      return;
    }
    const script = `To,
The Station House Officer / National Cyber Crime Reporting Portal
Dist: East Godavari, Andhra Pradesh.

Subject: Formal Complaint regarding ${incidentType}

Respected Sir/Madam,
I am submitting this formal statement regarding an incident of ${incidentType} that occurred on ${new Date().toLocaleDateString()}.
Details: ${incidentDetails}

I request immediate investigation and filing of an FIR under relevant sections of the Information Technology Act / IPC.

Yours faithfully,
[Adishakti User Verification Timestamped]`;
    setGeneratedScript(script);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BookOpen size={24} color="#f472b6" />
        <Text style={styles.headerTitle}>Learn, Upskill &amp; Rights</Text>
      </View>
      <Text style={styles.headerSub}>AI Mock Interviews, Legal Rights &amp; Safe Financial Literacy Practice</Text>

      {/* Main Mode Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'INTERVIEW' && styles.tabBtnActive]}
          onPress={() => setActiveTab('INTERVIEW')}
        >
          <Sparkles size={14} color={activeTab === 'INTERVIEW' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'INTERVIEW' && styles.tabTextActive]}>
            AI Mock Interview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'LEGAL' && styles.tabBtnActive]}
          onPress={() => setActiveTab('LEGAL')}
        >
          <Scale size={14} color={activeTab === 'LEGAL' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'LEGAL' && styles.tabTextActive]}>Legal Rights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'FINANCE' && styles.tabBtnActive]}
          onPress={() => setActiveTab('FINANCE')}
        >
          <CreditCard size={14} color={activeTab === 'FINANCE' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'FINANCE' && styles.tabTextActive]}>UPI Practice</Text>
        </TouchableOpacity>
      </View>

      {/* Mode 1: AI Mock Interview (AASHVEE Engine Port) */}
      {activeTab === 'INTERVIEW' && (
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AASHVEE AI Voice Interviewer (Tenglish)</Text>
            <Text style={styles.cardDesc}>
              Practice interview questions in Telugu &amp; English. AI scores your clarity, confidence, and communication style.
            </Text>

            <View style={styles.promptBox}>
              <Text style={styles.promptLabel}>Prompt Question:</Text>
              <Text style={styles.promptText}>
                "నమస్కారం! మీ గురించి మరియు మీ అనుభవం గురించి వివరించండి." (Tell us about yourself and your background)
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
              onPress={handleSimulateAudioInterview}
            >
              <Mic size={22} color="#ffffff" />
              <Text style={styles.recordBtnText}>
                {isRecording ? 'Listening & Analyzing Audio...' : 'Press to Speak Answer (Tenglish Supported)'}
              </Text>
            </TouchableOpacity>

            {interviewFeedback && (
              <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>AI Evaluation Scores</Text>

                <View style={styles.scoreRow}>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreNum}>{interviewFeedback.clarityScore}%</Text>
                    <Text style={styles.scoreLabel}>Clarity</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreNum}>{interviewFeedback.confidenceScore}%</Text>
                    <Text style={styles.scoreLabel}>Confidence</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreNum}>{interviewFeedback.communicationScore}%</Text>
                    <Text style={styles.scoreLabel}>Communication</Text>
                  </View>
                </View>

                <Text style={styles.feedbackTip}>{interviewFeedback.tip}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Mode 2: Legal Awareness */}
      {activeTab === 'LEGAL' && (
        <View style={styles.sectionContainer}>
          {/* Vernacular Short Videos */}
          <Text style={styles.sectionHeading}>Vernacular Legal Videos (&le;90 sec)</Text>
          <View style={styles.card}>
            <View style={styles.videoHeader}>
              <Video size={18} color="#f472b6" />
              <Text style={styles.videoTitle}>Domestic Violence Act 2005 Explained in Telugu</Text>
            </View>
            <Text style={styles.videoMeta}>Adv. S. Lakshmi Prasanna • 85 seconds</Text>
            <TouchableOpacity
              style={styles.playVideoBtn}
              onPress={() => Alert.alert('Playing Video', 'Launching vernacular legal guide video.')}
            >
              <Play size={16} color="#ffffff" />
              <Text style={styles.playVideoText}>Watch Video</Text>
            </TouchableOpacity>
          </View>

          {/* Sakhi One Stop Centre Locator */}
          <Text style={styles.sectionHeading}>One Stop Centre (Sakhi) Locator</Text>
          <View style={styles.card}>
            <Text style={styles.oscName}>Sakhi One Stop Centre - East Godavari Hospital Compound</Text>
            <Text style={styles.oscDetail}>Officer: Mrs. Ch. Vijayalakshmi</Text>
            <Text style={styles.oscDetail}>Location: Danavaipeta, Rajahmundry</Text>
            <TouchableOpacity
              style={styles.callOfficerBtn}
              onPress={() => Alert.alert('Calling Sakhi Centre', 'Dialing Sakhi Helpline 0883-2441091')}
            >
              <Phone size={14} color="#ffffff" />
              <Text style={styles.callOfficerText}>Call Protection Officer (0883-2441091)</Text>
            </TouchableOpacity>
          </View>

          {/* Complaint Script Generator */}
          <Text style={styles.sectionHeading}>FIR / Cyber Portal Script Generator</Text>
          <View style={styles.card}>
            <Text style={styles.cardDesc}>Enter incident details to generate a pre-filled legal complaint script.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Received unknown abusive WhatsApp calls and morphed images..."
              placeholderTextColor="#64748b"
              value={incidentDetails}
              onChangeText={setIncidentDetails}
            />
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateComplaintScript}>
              <Text style={styles.generateBtnText}>Generate Complaint Script</Text>
            </TouchableOpacity>

            {generatedScript ? (
              <View style={styles.scriptBox}>
                <Text style={styles.scriptText}>{generatedScript}</Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => Alert.alert('Script Prepared', 'Script ready to submit to National Cyber Crime Portal.')}
                >
                  <Text style={styles.copyBtnText}>Copy &amp; Open Cyber Portal</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {/* Mode 3: Financial Literacy Practice */}
      {activeTab === 'FINANCE' && (
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Safe UPI Simulator (Practice Risk-Free)</Text>
            <Text style={styles.cardDesc}>
              Learn how to send money, scan QR codes, and verify bank pin safely without using real money.
            </Text>

            <View style={styles.upiSimScreen}>
              <Text style={styles.upiSimHeader}>SIMULATED BANK APP</Text>
              <Text style={styles.upiAmount}>Pay ₹250 to DWCRA SHG Account</Text>

              {upiStep === 1 ? (
                <TouchableOpacity style={styles.upiActionBtn} onPress={() => setUpiStep(2)}>
                  <Text style={styles.upiActionText}>Tap to Enter Simulated UPI PIN</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <TextInput
                    style={styles.pinInput}
                    placeholder="ENTER 4-DIGIT PIN"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={4}
                    value={simPin}
                    onChangeText={setSimPin}
                  />
                  <TouchableOpacity
                    style={styles.upiConfirmBtn}
                    onPress={() => {
                      Alert.alert('SUCCESSFUL PRACTICE!', 'You completed the simulated payment safely!');
                      setUpiStep(1);
                      setSimPin('');
                    }}
                  >
                    <Text style={styles.upiActionText}>Confirm Practice Payment</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#f472b6', marginLeft: 8 },
  headerSub: { color: '#94a3b8', fontSize: 11, marginTop: 4, marginBottom: 16 },
  tabBar: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 4, borderRadius: 12, marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#a855f7' },
  tabText: { color: '#94a3b8', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  tabTextActive: { color: '#ffffff' },
  sectionContainer: {},
  card: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  cardDesc: { color: '#94a3b8', fontSize: 11, lineHeight: 16, marginBottom: 12 },
  promptBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#3b0764', marginBottom: 12 },
  promptLabel: { color: '#f0abfc', fontSize: 10, fontWeight: '800' },
  promptText: { color: '#e2e8f0', fontSize: 12, fontWeight: '600', marginTop: 2 },
  recordBtn: { backgroundColor: '#c026d3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12 },
  recordBtnActive: { backgroundColor: '#dc2626' },
  recordBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800', marginLeft: 8 },
  feedbackCard: { marginTop: 14, backgroundColor: '#0f172a', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#475569' },
  feedbackTitle: { color: '#34d399', fontSize: 12, fontWeight: '800', marginBottom: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  scoreBox: { alignItems: 'center' },
  scoreNum: { color: '#f472b6', fontSize: 18, fontWeight: '900' },
  scoreLabel: { color: '#94a3b8', fontSize: 10 },
  feedbackTip: { color: '#cbd5e1', fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  sectionHeading: { color: '#f472b6', fontSize: 14, fontWeight: '800', marginVertical: 8 },
  videoHeader: { flexDirection: 'row', alignItems: 'center' },
  videoTitle: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  videoMeta: { color: '#64748b', fontSize: 10, marginTop: 4, marginBottom: 8 },
  playVideoBtn: { backgroundColor: '#3b0764', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, width: 120 },
  playVideoText: { color: '#f0abfc', fontSize: 11, fontWeight: '800', marginLeft: 4 },
  oscName: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
  oscDetail: { color: '#cbd5e1', fontSize: 11, marginTop: 2 },
  callOfficerBtn: { backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 8, marginTop: 10 },
  callOfficerText: { color: '#ffffff', fontSize: 11, fontWeight: '800', marginLeft: 6 },
  input: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, borderRadius: 10, padding: 10, color: '#ffffff', fontSize: 12, marginBottom: 10 },
  generateBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 10, alignItems: 'center' },
  generateBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  scriptBox: { backgroundColor: '#0f172a', padding: 12, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#475569' },
  scriptText: { color: '#cbd5e1', fontSize: 10, fontFamily: 'monospace', lineHeight: 14 },
  copyBtn: { backgroundColor: '#a855f7', padding: 8, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  copyBtnText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  upiSimScreen: { backgroundColor: '#020617', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' },
  upiSimHeader: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  upiAmount: { color: '#38bdf8', fontSize: 15, fontWeight: '900', marginVertical: 12 },
  upiActionBtn: { backgroundColor: '#0284c7', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  upiActionText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  pinInput: { backgroundColor: '#1e293b', color: '#ffffff', width: 140, textAlign: 'center', padding: 8, borderRadius: 8, marginBottom: 10, fontSize: 14, letterSpacing: 4 },
  upiConfirmBtn: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }
});
