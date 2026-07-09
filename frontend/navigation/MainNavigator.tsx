import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 22,
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 24,
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.10,
          shadowRadius: 22,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.accentPos,
        tabBarInactiveTintColor: Colors.textFaint,
        tabBarLabelStyle: {
          fontFamily: 'Manrope_600SemiBold',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: focused ? 'Manrope_700Bold' : 'Manrope_600SemiBold', fontSize: 12, color }}>Home</Text>
              {focused && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color, marginTop: 5 }} />}
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={22} strokeWidth={2.5} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: focused ? 'Manrope_700Bold' : 'Manrope_600SemiBold', fontSize: 12, color }}>Profile</Text>
              {focused && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color, marginTop: 5 }} />}
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={22} strokeWidth={2.5} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
