import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Shield, Award, BookOpen, ShoppingBag, User } from 'lucide-react-native';
import './src/i18n';

import { HomeScreen } from './src/screens/HomeScreen';
import { SchemesScreen } from './src/screens/SchemesScreen';
import { LearnScreen } from './src/screens/LearnScreen';
import { MarketScreen } from './src/screens/MarketScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#090d16',
            borderTopColor: '#1e293b',
            height: 60,
            paddingBottom: 8,
            paddingTop: 6
          },
          tabBarActiveTintColor: '#f472b6',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700'
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => <Shield size={size} color={color} />
          }}
        />
        <Tab.Screen
          name="Schemes"
          component={SchemesScreen}
          options={{
            tabBarLabel: 'Schemes',
            tabBarIcon: ({ color, size }) => <Award size={size} color={color} />
          }}
        />
        <Tab.Screen
          name="Learn"
          component={LearnScreen}
          options={{
            tabBarLabel: 'Learn',
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />
          }}
        />
        <Tab.Screen
          name="Market"
          component={MarketScreen}
          options={{
            tabBarLabel: 'Market',
            tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
