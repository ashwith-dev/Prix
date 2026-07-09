import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { Colors } from '../theme/colors';
import { ArrowRight } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');

  const handleSignUp = () => {
    if (phone.length === 10) {
      navigation.navigate('Otp');
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Image source={require('../assets/finallogo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Track smart, save big.</Text>
            <Text style={styles.subtitle}>We watch prices so you never miss a deal.</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <View style={styles.inputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.textFaint}
                keyboardType="numeric"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Sign up</Text>
              <ArrowRight color={Colors.background} size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.legalText}>By continuing, you agree to our</Text>
          <Text style={styles.legalText}><Text style={styles.boldText}>Terms of Service</Text> and <Text style={styles.boldText}>Privacy Policy</Text>.</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 160,
    height: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: Colors.textSoft,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  fieldLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: Colors.textSoft,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  countryCode: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.text, // Dark button as per design
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: Colors.background,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  legalText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: Colors.textSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Manrope_700Bold',
    color: Colors.text,
  },
});
