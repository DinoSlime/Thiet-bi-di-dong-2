import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import MiniPlayer from '../../components/MiniPlayer';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#121212', 
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#888',  
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 2
          }
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites" 
          options={{
            title: 'Yêu thích',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="placeholder" 
          options={{
            title: 'Mở rộng', 
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "disc" : "disc-outline"} size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Cá nhân',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <MiniPlayer />

    </View>
  );
}