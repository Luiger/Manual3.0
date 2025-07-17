// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Evita que la pantalla de splash se oculte automáticamente antes de que se carguen los assets
SplashScreen.preventAutoHideAsync();

// Este es el layout raíz que envuelve toda la aplicación.
// Utilizamos un Stack Navigator para manejar la navegación entre los diferentes "grupos" de rutas.
export default function RootLayout() {
  // Carga las fuentes que usaremos en la aplicación.
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // useEffect se usa para ocultar la pantalla de splash una vez que las fuentes están cargadas.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Si las fuentes no se han cargado, no renderizamos nada (la splash screen sigue visible).
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Stack.Screen define las rutas principales.
  // (auth) es el grupo para login/registro.
  // (tabs) es el grupo para la app principal (post-login).
  // (profile) es el grupo para la sección de perfil.
  // 'manual-form' es una pantalla específica que se puede abrir desde cualquier lugar.
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="manual-form" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'Manual de Contrataciones' 
        }} 
      />
    </Stack>
  );
}