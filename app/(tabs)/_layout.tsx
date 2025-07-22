// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // ✅ CAMBIO: El color del ícono activo ahora es blanco
        tabBarActiveTintColor: Colors.textLight, 
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          // ✅ CAMBIO: El color de fondo de la barra ahora es el azul primario
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}