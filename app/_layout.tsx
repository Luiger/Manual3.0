// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../hooks/useAuth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Mantenemos la pantalla de carga nativa visible mientras preparamos lo mínimo necesario.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Cargamos las fuentes para evitar parpadeos de texto en la app (buena práctica).
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    // Ocultamos la pantalla de carga una vez que las fuentes están listas.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // No renderizamos nada hasta que las fuentes estén cargadas.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // 1. AuthProvider sigue siendo necesario para que el resto de la app
    // (Login, Formularios, etc.) pueda gestionar la sesión.
    <AuthProvider>
      {/* 2. GestureHandlerRootView es requerido por el Stack Navigator para
          funcionar correctamente. Es una excelente práctica incluirlo aquí. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 3. SafeAreaProvider asegura que los SafeAreaView en toda la app
            funcionen de manera óptima. */}
        <SafeAreaProvider>
          <Stack>
            {/* Definimos nuestros grupos de rutas y pantallas */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen
              name="manual-form" // Corregido para coincidir con nuestro nombre de archivo
              options={{ title: 'Manual de Contrataciones' }}
            />
            
            <Stack.Screen name="repository" options={{ title: 'Repositorio Legal' }} />
            <Stack.Screen name="courses" options={{ title: 'Cursos Virtuales' }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}