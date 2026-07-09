import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { ChevronLeft, ShoppingCart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { product } = route.params || {};
  const [alertPrice, setAlertPrice] = useState('1619'); // Mock value

  // Mock data if no product is passed
  const p = product || {
    name: 'Solid Round Neck Cotton T-shirt – Men\'s T-shirt · Olive Green',
    brand: 'TOMMY HILFIGER',
    currentPrice: '1,799',
    originalPrice: '3,599',
    discount: '50%',
    savings: '1,800',
    image: require('../assets/product1.png'), // Default mock to local asset
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Product Image & Price Summary */}
        <View style={styles.topSection}>
          <View style={styles.imageWrapper}>
            <Image source={typeof p.image === 'number' ? p.image : { uri: p.image }} style={styles.productImage} resizeMode="cover" />
          </View>

          <Text style={styles.brand}>{p.brand}</Text>
          <Text style={styles.shortName} numberOfLines={1}>{p.name.split('–')[0]?.trim() || p.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.currentPriceLarge}>₹{p.currentPrice}</Text>
            <Text style={styles.originalPriceLarge}>₹{p.originalPrice}</Text>
          </View>

          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeText}>Down {p.discount} • Save ₹{p.savings || '0'}</Text>
          </View>
        </View>

        {/* Detailed Info Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailLabel}>PRODUCT NAME</Text>
          <Text style={styles.detailValue}>{p.name}</Text>

          <Text style={styles.detailLabel}>CURRENT PRICE</Text>
          <Text style={styles.detailValue}>₹{p.currentPrice}</Text>

          <Text style={styles.detailLabel}>PRICE DROPPED</Text>
          <Text style={styles.droppedValue}>↓ ₹{p.savings} off ({p.discount})</Text>

          <Text style={styles.detailLabel}>ORIGINAL PRICE (MRP)</Text>
          <Text style={styles.mrpValue}>₹{p.originalPrice}</Text>
        </View>

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
          <ShoppingCart color={Colors.background} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>

        {/* Price Alert */}
        <Text style={styles.alertTitle}>Set a price alert</Text>
        <View style={styles.alertRow}>
          <TextInput
            style={styles.alertInput}
            value={alertPrice}
            onChangeText={setAlertPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.setAlertBtn} activeOpacity={0.8}>
            <Text style={styles.setAlertBtnText}>Set alert</Text>
          </TouchableOpacity>
        </View>

        {/* Remove Link */}
        <TouchableOpacity style={styles.removeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.removeBtnText}>Remove from wishlist</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E2D8C9', // Slightly darker background for top section matching design
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.line,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  brand: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: Colors.textSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  shortName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  currentPriceLarge: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 32,
    color: Colors.text,
  },
  originalPriceLarge: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: Colors.textSoft,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: Colors.accentPos,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savingsBadgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: '#fff',
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  detailLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: Colors.textSoft,
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 22,
  },
  droppedValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.accentPos,
    marginBottom: 20,
  },
  mrpValue: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: Colors.textSoft,
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: Colors.text,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  buyButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.background,
  },
  alertTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 16,
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  alertRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 40,
  },
  alertInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  setAlertBtn: {
    backgroundColor: Colors.text,
    borderRadius: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setAlertBtnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.background,
  },
  removeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  removeBtnText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: Colors.textSoft,
  },
});
