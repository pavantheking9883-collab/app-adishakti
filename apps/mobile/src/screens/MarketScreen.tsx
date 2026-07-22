import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ShoppingBag, PhoneCall, MessageCircle, MapPin, Tag } from 'lucide-react-native';

const PRODUCTS = [
  {
    id: '1',
    title: 'Handcrafted Uppada Pure Silk Saree',
    price: 4500,
    category: 'Handlooms',
    shgGroup: 'Godavari Sri Mahila DWCRA Sangham',
    district: 'East Godavari',
    phone: '+919440188234',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
    desc: 'Authentic Jamdani weave silk saree handcrafted by Godavari Sri Mahila SHG weavers.'
  },
  {
    id: '2',
    title: 'Organic Turmeric & Chilly Powder (1kg Pack)',
    price: 280,
    category: 'Organic Food',
    shgGroup: 'Kadiyam Annapurna Mahila Group',
    district: 'East Godavari',
    phone: '+919848123456',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600',
    desc: 'Pure, pesticide-free stone-ground spices cultivated by Kadiyam Organic Farmers SHG.'
  },
  {
    id: '3',
    title: 'Eco-Friendly Palm Leaf Baskets & Crafts',
    price: 350,
    category: 'Handicrafts',
    shgGroup: 'Giri Sampada Craft Federation',
    district: 'Alluri Sitharama Raju',
    phone: '+919490554433',
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600',
    desc: 'Traditional durable utility baskets woven by tribal self-help women artisans.'
  }
];

export const MarketScreen: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('ALL');

  const filtered = PRODUCTS.filter(
    (p) => selectedCat === 'ALL' || p.category.toUpperCase() === selectedCat
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ShoppingBag size={24} color="#f472b6" />
        <Text style={styles.headerTitle}>SHG Direct Marketplace</Text>
      </View>
      <Text style={styles.headerSub}>Buy directly from AP Women Self-Help Groups • 0% Middleman Commission</Text>

      {/* Categories */}
      <View style={styles.filterRow}>
        {['ALL', 'HANDLOOMS', 'ORGANIC FOOD', 'HANDICRAFTS'].map((cat) => (
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

      {/* Product List */}
      {filtered.map((item) => (
        <View key={item.id} style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productBody}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>₹{item.price}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>

            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productDesc}>{item.desc}</Text>

            <View style={styles.shgRow}>
              <MapPin size={12} color="#c026d3" />
              <Text style={styles.shgText}>{item.shgGroup} • {item.district}</Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.callSellerBtn}
                onPress={() => Alert.alert('Calling Artisan', `Dialing direct SHG contact: ${item.phone}`)}
              >
                <PhoneCall size={14} color="#ffffff" />
                <Text style={styles.btnText}>Call Artisan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={() => Alert.alert('Opening WhatsApp', `Messaging ${item.shgGroup} directly.`)}
              >
                <MessageCircle size={14} color="#ffffff" />
                <Text style={styles.btnText}>WhatsApp Direct</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6
  },
  chipActive: { backgroundColor: '#a855f7', borderColor: '#c026d3' },
  chipText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  chipTextActive: { color: '#ffffff' },
  productCard: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16
  },
  productImage: { width: '100%', height: 160 },
  productBody: { padding: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  priceText: { color: '#34d399', fontSize: 18, fontWeight: '900' },
  badge: { backgroundColor: '#3b0764', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#f0abfc', fontSize: 10, fontWeight: '800' },
  productTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  productDesc: { color: '#94a3b8', fontSize: 11, lineHeight: 16, marginBottom: 8 },
  shgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  shgText: { color: '#f0abfc', fontSize: 10, fontWeight: '700', marginLeft: 4 },
  btnRow: { flexDirection: 'row', gap: 10 },
  callSellerBtn: {
    flex: 1,
    backgroundColor: '#7e22ce',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 6
  },
  whatsappBtn: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 6
  },
  btnText: { color: '#ffffff', fontSize: 11, fontWeight: '800', marginLeft: 6 }
});
