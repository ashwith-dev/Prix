import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Bell, Search, Plus, ChevronDown, Heart, Share, X, Grid2x2, ImageOff } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // 20px padding each side

const CATEGORIES = ['All Wishlist', 'Electronics', 'Clothing', 'Footwear', 'Beauty', 'Home & Kitchen', 'Books'];

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Wishlist');
  const [linkInput, setLinkInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationPromptOpen, setIsNotificationPromptOpen] = useState(false);
  const [isAddedToastVisible, setIsAddedToastVisible] = useState(false);

  useEffect(() => {
    if (!isAddedToastVisible) return;

    const timer = setTimeout(() => setIsAddedToastVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [isAddedToastVisible]);

  const handleAddProduct = () => {
    // In a real integration this data (and the image, if one exists)
    // comes back from scraping `linkInput`. image is intentionally
    // optional — renderProductCard() falls back to a name-only card
    // when it's missing.
    const newProduct = {
      id: Date.now().toString(),
      name: 'Solid Round Neck Cotton T-shirt',
      brand: 'TOMMY HILFIGER',
      currentPrice: '1,799',
      originalPrice: '3,599',
      discount: '50%',
      savings: '1,800',
      image: null as any, // e.g. require('../assets/product1.png') when available
    };
    setProducts([newProduct, ...products]);
    setIsSheetOpen(false);
    setIsNotificationPromptOpen(true);
    setIsAddedToastVisible(true);
    setLinkInput('');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.heartIconContainer}>
        <Heart color={Colors.textFaint} size={48} strokeWidth={1.5} />
        <View style={styles.sparkle1}><Plus color={Colors.textFaint} size={14} /></View>
      </View>
      <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptySubtitle}>Save the items you love and find them{'\n'}all in one place.</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsSheetOpen(true)} activeOpacity={0.8}>
        <Plus color={Colors.background} size={20} style={{ marginRight: 8 }} />
        <Text style={styles.addButtonText}>Add your first item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = (item: any) => (
    <TouchableOpacity
      style={styles.card}
      key={item.id}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      {/* Left: Product Image (falls back to a name placeholder if no photo) */}
      <View style={styles.cardImageContainer}>
        {item.image ? (
          <Image source={typeof item.image === 'number' ? item.image : { uri: item.image }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <ImageOff color={Colors.textFaint} size={22} strokeWidth={1.5} />
            <Text style={styles.cardImagePlaceholderText} numberOfLines={3}>{item.name}</Text>
          </View>
        )}
      </View>

      {/* Right: Info */}
      <View style={styles.cardContent}>
        {/* Top Dark Section */}
        <View style={styles.priceBox}>
          <Text style={styles.priceDropLabel}>⌄ Price Dropped</Text>
          <Text style={styles.currentPrice}>₹{item.currentPrice}</Text>
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>↓ {item.discount}</Text>
          </View>
        </View>

        {/* Middle Light Section */}
        <View style={styles.productBox}>
          <Text style={styles.productBrandLabel}>PRODUCT</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.getDealButton} activeOpacity={0.8}>
            <Text style={styles.getDealText}>Get Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
            <Share color={Colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const displayProducts = searchQuery ? filteredProducts : products;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/finallogo.png')} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity style={styles.iconButton}>
          <Bell color={Colors.text} size={22} />
          {products.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Search Bar + Plus Button */}
        <View style={styles.searchRow}>
          {/* Search Bar — opens inline search */}
          <TouchableOpacity
            style={styles.searchBox}
            onPress={() => setIsSearchActive(true)}
            activeOpacity={0.9}
          >
            <Search color={Colors.textSoft} size={18} style={{ marginRight: 10 }} />
            {isSearchActive ? (
              <TextInput
                style={styles.searchInput}
                placeholder="Search your products..."
                placeholderTextColor={Colors.textFaint}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                onBlur={() => { if (!searchQuery) setIsSearchActive(false); }}
              />
            ) : (
              <Text style={styles.searchText}>Search your products or paste link</Text>
            )}
            {isSearchActive && searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setIsSearchActive(false); }}>
                <X color={Colors.textSoft} size={18} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Plus Button — opens add sheet */}
          <TouchableOpacity style={styles.searchPlusButton} onPress={() => setIsSheetOpen(true)} activeOpacity={0.8}>
            <Plus color={Colors.background} size={24} />
          </TouchableOpacity>
        </View>

        {/* Savings Box */}
        <View style={styles.savingsBox}>
          <Text style={styles.savingsLabel}>Amount you've saved</Text>
          <Text style={styles.savingsAmount}>₹0</Text>
        </View>

        {/* Filter / Category Dropdown */}
        <TouchableOpacity style={styles.filterBox} onPress={() => setIsCategoryOpen(true)} activeOpacity={0.8}>
          <View style={styles.filterLeft}>
            <Grid2x2 color={Colors.textSoft} size={18} style={{ marginRight: 10 }} />
            <Text style={styles.filterText}>{selectedCategory}</Text>
          </View>
          <ChevronDown color={Colors.text} size={20} />
        </TouchableOpacity>

        {displayProducts.length === 0 && !searchQuery ? (
          renderEmptyState()
        ) : displayProducts.length === 0 && searchQuery ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try searching with a different keyword.</Text>
          </View>
        ) : (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>PRICE DROPS FOR YOU</Text>
            {displayProducts.map(renderProductCard)}
          </View>
        )}

      </ScrollView>

      {/* Category Picker Modal */}
      <Modal visible={isCategoryOpen} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.categoryOverlay} onPress={() => setIsCategoryOpen(false)} activeOpacity={1}>
          <View style={styles.categorySheet}>
            <Text style={styles.categorySheetTitle}>Select Category</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryItem, selectedCategory === cat && styles.categoryItemActive]}
                onPress={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryItemText, selectedCategory === cat && styles.categoryItemTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={isNotificationPromptOpen} animationType="fade" transparent={true}>
        <BlurView intensity={18} tint="dark" style={styles.promptOverlay}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationIcon}>
              <Bell color={Colors.text} size={24} strokeWidth={2} />
            </View>
            <Text style={styles.notificationTitle}>Never miss a price drop</Text>
            <Text style={styles.notificationCopy}>
              Turn on notifications and PRIX will tell you the moment a price falls or an item is back in stock.
            </Text>
            <TouchableOpacity style={styles.notificationButton} onPress={() => setIsNotificationPromptOpen(false)} activeOpacity={0.85}>
              <Text style={styles.notificationButtonText}>Allow notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notNowButton} onPress={() => setIsNotificationPromptOpen(false)} activeOpacity={0.75}>
              <Text style={styles.notNowText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {isAddedToastVisible && (
        <View pointerEvents="none" style={styles.toast}>
          <Text style={styles.toastText}>Added to your wishlist</Text>
        </View>
      )}

      {/* Add to Wishlist Sheet Modal */}
      <Modal visible={isSheetOpen} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setIsSheetOpen(false)} activeOpacity={1} />

          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add to your wishlist</Text>
            <Text style={styles.sheetSubtitle}>Paste a product link from Amazon, Flipkart, Myntra, Nykaa and more.</Text>

            <TextInput
              style={styles.sheetInput}
              placeholder="https://amazon.in/product/..."
              placeholderTextColor={Colors.textFaint}
              value={linkInput}
              onChangeText={setLinkInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.chipsRow}>
              {['Amazon', 'Flipkart', 'Myntra', 'Nykaa'].map((store) => (
                <View key={store} style={styles.chip}>
                  <Text style={styles.chipText}>{store}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.sheetButton} onPress={handleAddProduct} activeOpacity={0.8}>
              <Text style={styles.sheetButtonText}>Add to wishlist</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: {
    height: 32,
    width: 90,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.accentPos,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Manrope_800ExtraBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },

  // Search Row
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#D8CDBC',
    borderWidth: 1,
    borderColor: '#D8CDBC',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  searchText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: Colors.textSoft,
  },
  searchPlusButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.text,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 5,
  },

  // Savings Box
  savingsBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  savingsAmount: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.accentPos,
  },

  // Filter
  filterBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.text,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  heartIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  emptyTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: Colors.textSoft,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: Colors.text,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.background,
  },

  // Category Modal
  categoryOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 30,
  },
  categorySheet: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
  },
  categorySheetTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  categoryItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryItemActive: {
    backgroundColor: Colors.accentBg,
  },
  categoryItemText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  categoryItemTextActive: {
    fontFamily: 'Manrope_700Bold',
    color: Colors.accentPos,
  },

  // Notification Prompt
  promptOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 34,
    backgroundColor: 'rgba(43,35,29,0.36)',
  },
  notificationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 28,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 8,
  },
  notificationIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#DCD4CA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  notificationTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 10,
  },
  notificationCopy: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: Colors.textSoft,
    lineHeight: 23,
    marginBottom: 28,
  },
  notificationButton: {
    backgroundColor: Colors.text,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationButtonText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 16,
    color: Colors.background,
  },
  notNowButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  notNowText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 15,
    color: Colors.textSoft,
  },
  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 104,
    alignItems: 'center',
  },
  toastText: {
    overflow: 'hidden',
    backgroundColor: Colors.text,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: Colors.background,
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  // Sheet Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lineStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: Colors.textSoft,
    marginBottom: 24,
    lineHeight: 20,
  },
  sheetInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  chip: {
    backgroundColor: Colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: Colors.textSoft,
  },
  sheetButton: {
    backgroundColor: Colors.text,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  sheetButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.background,
  },

  // Product Card Styles
  productsSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: Colors.textSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 10,
    marginBottom: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 3,
  },
  cardImageContainer: {
    width: CARD_WIDTH * 0.34,
    minHeight: 218,
    backgroundColor: '#EBEBEB',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 14,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardImagePlaceholderText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: Colors.textFaint,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  cardContent: {
    flex: 1,
  },
  priceBox: {
    backgroundColor: '#2B231D',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    minHeight: 110,
    justifyContent: 'center',
  },
  priceDropLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    marginBottom: 6,
  },
  currentPrice: {
    color: '#fff',
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 26,
    marginBottom: 0,
  },
  originalPrice: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginBottom: 10,
  },
  discountBadge: {
    backgroundColor: Colors.accentPos,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 11,
  },
  productBox: {
    backgroundColor: '#DCD4CA',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
    minHeight: 72,
  },
  productBrandLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: '#80776C',
    letterSpacing: 1,
    marginBottom: 2,
  },
  productName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  getDealButton: {
    flex: 1,
    backgroundColor: '#2B231D',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getDealText: {
    color: Colors.background,
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
  },
  shareButton: {
    width: 48,
    height: 48,
    backgroundColor: '#DCD4CA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});