// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, SafeAreaView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

export default function LoginScreen() {
  // Hook de Expo Router para manejar la navegación programática
  const router = useRouter();

  // Estados para los inputs y la visibilidad de la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    // Lógica de validación simple
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    console.log('Login attempt:', { email, password });
    // Navegación al home. 'replace' evita que el usuario pueda volver a la pantalla de login.
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Títulos */}
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido a Universitas</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Botón Iniciar Sesión */}
          <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Enlaces */}
          <View style={styles.linksContainer}>
            <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </Link>
            
            <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.link, { fontWeight: 'bold' }]}>Regístrate</Text>
                    </TouchableOpacity>
                </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Hoja de estilos usando la API StyleSheet de React Native
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 200, height: 100, marginBottom: 40 },
  header: { width: '100%', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.text, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 16, textAlign: 'center', color: Colors.textSecondary, marginTop: 8, fontFamily: 'Inter_400Regular' },
  form: { width: '100%', gap: 20 },
  inputGroup: {},
  label: { fontSize: 16, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8, fontFamily: 'Inter_400Regular' },
  input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontSize: 16 },
  button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold', fontFamily: 'Inter_700Bold' },
  linksContainer: { width: '100%', marginTop: 24, alignItems: 'center', gap: 16 },
  link: { color: Colors.accent, fontSize: 16, fontWeight: '600', fontFamily: 'Inter_400Regular' },
  registerLinkContainer: { flexDirection: 'row', alignItems: 'center' },
  registerText: { color: Colors.textSecondary, fontSize: 16, fontFamily: 'Inter_400Regular' },
});