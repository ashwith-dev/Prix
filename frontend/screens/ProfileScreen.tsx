import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Edit2 } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState('Aditi Rao');
  const [email, setEmail] = useState('');

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(true)}>
                <Edit2 color={Colors.textSoft} size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.phone}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Tracked items</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Saved so far</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.listGroup}>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Push notifications</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: Colors.line, true: Colors.accentPos }}
              thumbColor={'#fff'}
            />
          </View>
          <View style={[styles.listRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.listLabel}>Price drop alerts</Text>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: Colors.line, true: Colors.accentPos }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <View style={styles.listGroup}>
          <TouchableOpacity style={styles.listRow} activeOpacity={0.7}>
            <Text style={styles.listLabel}>Alert threshold</Text>
            <Text style={styles.listValue}>5% drop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.listRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
            <Text style={styles.listLabel}>Default wishlist</Text>
            <Text style={styles.listValue}>All Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.listGroup}>
          <TouchableOpacity style={styles.listRow} activeOpacity={0.7}>
            <Text style={styles.listLabel}>Help & support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.listRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
            <Text style={styles.listLabel}>Privacy policy</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Auth')}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalOpen} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setIsEditModalOpen(false)} activeOpacity={1} />
          
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>NAME</Text>
            <TextInput
              style={[styles.input, styles.inputActive]}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>PHONE NUMBER</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value="+91 98765 43210"
              editable={false}
            />

            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your email"
              placeholderTextColor={Colors.textFaint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditModalOpen(false)}>
              <Text style={styles.saveButtonText}>Save changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalOpen(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#E2D8C9', // Slightly darker than background for contrast
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 28,
    color: Colors.text,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
  },
  phone: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: Colors.textSoft,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#E2D8C9',
    borderRadius: 16,
    padding: 16,
  },
  statValue: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: Colors.textSoft,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: Colors.textSoft,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  listGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: 24,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  listLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  listValue: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: Colors.textSoft,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 15,
    color: Colors.text,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: Colors.textSoft,
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 20,
  },
  inputActive: {
    borderColor: '#0A58FF', // Blue focus ring shown in PDF
    borderWidth: 1.5,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.background,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: Colors.textSoft,
  },
});
