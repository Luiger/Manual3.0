// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, SafeAreaView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // 1. Volvemos a importar useRouter
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter(); // 2. Inicializamos el router

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      // 3. SI EL LOGIN ES EXITOSO, NAVEGAMOS MANUALMENTE
      // Usamos 'replace' para que el usuario no pueda volver atrás a la pantalla de login.
      router.replace('/(tabs)/home');
    } else {
      // Si falla, mostramos el error que viene del backend.
      Alert.alert('Error de inicio de sesión', result.error || 'Ocurrió un error inesperado.');
    }
  };

  // El resto del componente (el JSX) se mantiene exactamente igual.
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.container}>
          {/* ... (Todo el JSX del logo, títulos y formulario sin cambios) ... */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido a Universitas</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

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
                editable={!isLoading}
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
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} disabled={isLoading}>
                  <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, isLoading && styles.buttonInactive]}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity disabled={isLoading}>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </Link>
            
            <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity disabled={isLoading}>
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

// Los estilos se mantienen igual
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 200, height: 100, marginBottom: 40 },
  header: { width: '100%', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.text },
  subtitle: { fontSize: 16, textAlign: 'center', color: Colors.textSecondary, marginTop: 8 },
  form: { width: '100%', gap: 20 },
  inputGroup: {},
  label: { fontSize: 16, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontSize: 16 },
  button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonInactive: {
    backgroundColor: '#cccccc',
  },
  buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
  linksContainer: { width: '100%', marginTop: 24, alignItems: 'center', gap: 16 },
  link: { color: Colors.accent, fontSize: 16, fontWeight: '600' },
  registerLinkContainer: { flexDirection: 'row', alignItems: 'center' },
  registerText: { color: Colors.textSecondary, fontSize: 16 },
});