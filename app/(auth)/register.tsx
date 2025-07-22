import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../../services/auth.service';
import Colors from '../../constants/Colors';

// --- Componente Stepper ---
const Stepper = ({ currentStep }: { currentStep: number }) => (
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

// --- Esquema de Validación ---
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Introduce un correo válido').required('El correo es requerido'),
  password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

// --- Componente Principal ---
const RegisterCredentialsScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    validationSchema.isValid(formData).then(setIsFormValid);
  }, [formData]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNextStep = async () => {
    if (!isFormValid || loading) return;

    setError('');
    setLoading(true);

    try {
      const result = await AuthService.registerCredentials(formData.email, formData.password);
      if (result.success && result.tempToken) {
        await SecureStore.setItemAsync('tempRegToken', result.tempToken);
        router.push('/(auth)/register-profile');

        // ✅ MEJORA: Limpiamos el estado después de navegar.
        setFormData({ email: '', password: '', confirmPassword: '' });
        
      } else {
        setError(result.error || 'Ocurrió un error durante el registro.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Crea tu cuenta</Text>
              <Text style={styles.subtitle}>Por favor, introduce tus datos para iniciar sesión</Text>
            </View>
            <Stepper currentStep={1} />

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput style={styles.input} placeholder="Ingresa tu correo" value={formData.email} onChangeText={(val) => handleInputChange('email', val)} keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput style={styles.passwordInput} placeholder="Mínimo 8 caracteres" value={formData.password} onChangeText={(val) => handleInputChange('password', val)} secureTextEntry={!isPasswordVisible} />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}><Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput style={styles.passwordInput} placeholder="Repite tu contraseña" value={formData.confirmPassword} onChangeText={(val) => handleInputChange('confirmPassword', val)} secureTextEntry={!isConfirmPasswordVisible} />
                  <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}><Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} /></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]} onPress={handleNextStep} disabled={!isFormValid || loading}>
              {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Siguiente</Text>}
            </TouchableOpacity>
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <Link href="/(auth)/login" asChild><TouchableOpacity><Text style={styles.loginLink}>Inicia sesión</Text></TouchableOpacity></Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  form: {
    marginTop: 32,
  },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: Colors.text },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontSize: 16, color: Colors.text },
  footer: {
    marginTop: 40,
  },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 10, fontSize: 14 },
  button: { width: '100%', height: 56, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: Colors.textSecondary, fontSize: 16 },
  loginLink: { color: Colors.accent, fontWeight: 'bold', fontSize: 16 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', alignSelf: 'center' },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepText: { color: Colors.textSecondary, fontWeight: 'bold' },
  stepTextActive: { color: Colors.textLight },
  stepLabel: { marginTop: 8, color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  stepLabelActive: { color: Colors.primary, fontWeight: 'bold' },
  stepperLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: -20 },
});

export default RegisterCredentialsScreen;