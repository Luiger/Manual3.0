// app/(auth)/register.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente reutilizable para el indicador de pasos
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepperContainer}>
    <View style={styles.step}>
      <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
        <Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text>
      </View>
      <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Credenciales</Text>
    </View>
    <View style={styles.stepperLine} />
    <View style={styles.step}>
      <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
        <Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text>
      </View>
      <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Datos personales</Text>
    </View>
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

  // Función para manejar el paso al siguiente formulario
  const handleNext = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor, rellena todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error de contraseña', 'Las contraseñas no coinciden.');
      return;
    }
    // Navega a la siguiente pantalla del registro, pasando los datos como parámetros
    router.push({
      pathname: '/(auth)/register-profile',
      params: { email, password },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header con botón de retroceso */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Crea tu cuenta</Text>
        </View>
        <Text style={styles.subtitle}>Por favor, introduce tus datos para crear tu cuenta.</Text>

        {/* Indicador de pasos */}
        <StepIndicator currentStep={1} />

        {/* Formulario */}
        <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput style={styles.input} placeholder="Ingresa tu correo" value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput style={styles.passwordInput} placeholder="Ingresa tu contraseña" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput style={styles.passwordInput} placeholder="Repite tu contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!isConfirmPasswordVisible} />
                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                        <Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
        {/* Botón de Siguiente */}
        <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

        {/* Enlace para iniciar sesión */}
        <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                    <Text style={styles.link}>Inicia sesión</Text>
                </TouchableOpacity>
            </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 24, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, width: '100%' },
  backButton: { position: 'absolute', left: 0, zIndex: 1, padding: 8 },
  title: { flex: 1, fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '80%', alignSelf: 'center' },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepText: { color: Colors.textSecondary, fontWeight: 'bold' },
  stepTextActive: { color: Colors.textLight },
  stepLabel: { marginTop: 8, color: Colors.textSecondary, fontSize: 12 },
  stepLabelActive: { color: Colors.primary, fontWeight: 'bold' },
  stepperLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: -20 },
  form: { width: '100%', gap: 16 },
  inputGroup: {},
  label: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontSize: 16 },
  button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  loginText: { color: Colors.textSecondary, fontSize: 16 },
  link: { color: Colors.accent, fontSize: 16, fontWeight: 'bold' },
});