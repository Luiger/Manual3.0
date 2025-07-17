// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

// Layout para el grupo de rutas de autenticación.
// Define un Stack Navigator para todas las pantallas dentro de la carpeta (auth).
// 'screenOptions' se aplica a todas las pantallas de este stack.
export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </>
  );
}