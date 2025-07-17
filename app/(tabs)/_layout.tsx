// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Este es el layout para el grupo de rutas (tabs).
// Define el navegador de pestañas en la parte inferior de la pantalla.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultamos el header por defecto, ya que crearemos uno personalizado en la pantalla de Home
        tabBarActiveTintColor: Colors.primary, // Color del ícono de la pestaña activa
        tabBarInactiveTintColor: Colors.textSecondary, // Color del ícono de la pestaña inactiva
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0, // Opcional: para un look más limpio
          elevation: 0, // Opcional: para un look más limpio
        },
      }}
    >
      {/* Definición de la pestaña de Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home', // Título que se mostraría si el header estuviera visible
          tabBarShowLabel: false, // Ocultamos el texto debajo del ícono
          tabBarIcon: ({ color, size }) => (
            // Usamos un ícono de la librería Ionicons
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/* Aquí podrías añadir más Tabs.Screen para otras pestañas si las necesitas en el futuro */}
    </Tabs>
  );
}