import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Award, PhoneCall, ExternalLink, CheckCircle2 } from 'lucide-react-native';

const SCHEMES = [
  {
    id: '1',
    title: 'DWCRA Collateral-Free MSME Loan',
    code: 'DWCRA-MSME-2026',
    category: 'Loan',
    target: 'SHG / DWCRA Women',
    benefit: '₹5,000,000 Loan at 4% Effective Interest Subvention',
    eligibility: 'Active SHG member with minimum 2 years flawless repayment history.',
    contact: 'District SERP Office Rajahmundry: 0883-2476591',
    url: 'https://serp.ap.gov.in/dwcra/msme'
  },
  {
    id: '2',
    title: 'Stree Nidhi SHG Loan Scheme',
    code: 'STREE-NIDHI-01',
    category: 'Loan',
    target: 'SHG Women',
    benefit: '₹50,000 - ₹200,000 within 48 Hours',
    eligibility: 'Women aged 18 to 60 registered under SERP/MEPMA.',
    contact: 'Stree Nidhi Helpline: 1800-425-9999',
    url: 'https://streenidhi.ap.gov.in'
  },
  {
    id: '3',
    title: 'YSR Aasara Debt Waiver',
    code: 'YSR-AASARA-04',
    category: 'Grant',
    target: 'DWCRA Groups',
    benefit: 'Full reimbursement of bank loan debt in 4 installments',
    eligibility: 'Registered DWCRA self-help group members.',
    contact: 'Grama Sachivalayam Women Protection Secretary',
    url: 'https://navasakam.ap.gov.in'
  },
  {
    id: '4',
    title: 'PM Surya Ghar Muft Bijli Yojana',
    code: 'PM-SURYA-2026',
    category: 'Subsidy',
    target: 'All Households',
    benefit: 'Subsidy up to ₹78,000 for 3kW Rooftop Solar',
    eligibility: 'Low & middle-income households with own roof space.',
    contact: 'APEPDCL Helpline: 1912',
    url: 'https://pmsuryaghar.gov.in'
  }
];

export const SchemesScreen: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('ALL');

  const filtered = SCHEMES.filter(
    (s) => selectedCat === 'ALL' || s.category.toUpperCase() === selectedCat
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Award size={24} color="#f472b6" />
        <Text style={styles.headerTitle}>AP Scheme Navigator</Text>
      </View>
      <Text style={styles.headerSub}>
        Eligible AP Government Loan, Subsidy &amp; Empowering Schemes for Women &amp; SHGs
      </Text>

      {/* Category Filter Chips */}
      <View style={styles.filterRow}>
        {['ALL', 'LOAN', 'GRANT', 'SUBSIDY'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCat === cat && styles.chipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scheme Cards */}
      {filtered.map((item) => (
        <View key={item.id} style={styles.schemeCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>
            <Text style={styles.codeText}>{item.code}</Text>
          </View>

          <Text style={styles.schemeTitle}>{item.title}</Text>
          <Text style={styles.benefitText}>{item.benefit}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <CheckCircle2 size={14} color="#34d399" />
            <Text style={styles.infoText}>Eligibility: {item.eligibility}</Text>
          </View>

          <View style={styles.infoRow}>
            <PhoneCall size={14} color="#60a5fa" />
            <Text style={styles.infoText}>DPR Support: {item.contact}</Text>
          </View>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => {
              Alert.alert('Redirecting to Portal', `Opening official portal: ${item.url}`);
            }}
          >
            <Text style={styles.applyBtnText}>Apply / Official Portal</Text>
            <ExternalLink size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#f472b6', marginLeft: 8 },
  headerSub: { color: '#94a3b8', fontSize: 11, marginTop: 4, marginBottom: 16 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  chip: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8
  },
  chipActive: { backgroundColor: '#a855f7', borderColor: '#c026d3' },
  chipText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  chipTextActive: { color: '#ffffff' },
  schemeCard: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { backgroundColor: '#3b0764', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: '#f0abfc', fontSize: 10, fontWeight: '800' },
  codeText: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
  schemeTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  benefitText: { color: '#f472b6', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  infoText: { color: '#cbd5e1', fontSize: 11, marginLeft: 6, flex: 1 },
  applyBtn: {
    marginTop: 10,
    backgroundColor: '#7e22ce',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800', marginRight: 6 }
});
