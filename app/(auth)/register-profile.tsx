import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
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
  Nombre: Yup.string().required('El nombre es requerido'),
  Apellido: Yup.string().required('El apellido es requerido'),
  Telefono: Yup.string().required('El teléfono es requerido'),
  Institucion: Yup.string().required('La institución es requerida'),
  Cargo: Yup.string().required('El cargo es requerido'),
});

// --- Componente Principal ---
const RegisterProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    validationSchema.isValid(profile).then(setIsFormValid);
  }, [profile]);

  const handleInputChange = (name: keyof typeof profile, value: string) => {
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCompleteProfile = async () => {
    if (!isFormValid || loading) return;
    
    setError('');
    setLoading(true);

    const tempToken = await SecureStore.getItemAsync('tempRegToken');
    if (!tempToken) {
      Alert.alert(
        'Sesión Expirada',
        'Tu sesión de registro ha expirado. Por favor, inicia el proceso nuevamente.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/register') }]
      );
      setLoading(false);
      return;
    }

    try {
      const result = await AuthService.registerProfile(profile, tempToken);
      if (result.success) {
        await SecureStore.deleteItemAsync('tempRegToken');
        Alert.alert(
          '¡Registro completado!',
          'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      } else {
        if (result.error?.includes('expirado') || result.error?.includes('inválido')) {
            Alert.alert(
                'Sesión Expirada',
                'Tu sesión de registro ha expirado. Por favor, inicia el proceso nuevamente.',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/register') }]
            );
        } else {
            setError(result.error || 'Ocurrió un error al completar el perfil.');
        }
      }
    } catch (e) {
      setError('Ocurrió un error inesperado al conectar con el servidor.');
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
              <Text style={styles.title}>Completa tus datos</Text>
              <Text style={styles.subtitle}>Por favor, introduce tus datos personales</Text>
            </View>
            <Stepper currentStep={2} />

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput style={styles.input} placeholder="Ingresa tu nombre" value={profile.Nombre} onChangeText={(val) => handleInputChange('Nombre', val)} />
              </View>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Apellido</Text>
                  <TextInput style={styles.input} placeholder="Ingresa tu apellido" value={profile.Apellido} onChangeText={(val) => handleInputChange('Apellido', val)} />
              </View>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput style={styles.input} placeholder="Ingresa tu número" value={profile.Telefono} onChangeText={(val) => handleInputChange('Telefono', val)} keyboardType="phone-pad" />
              </View>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Institución</Text>
                  <TextInput style={styles.input} placeholder="Ingresa tu institución" value={profile.Institucion} onChangeText={(val) => handleInputChange('Institucion', val)} />
              </View>
              <View style={styles.inputContainer}>
                  <Text style={styles.label}>Cargo</Text>
                  <TextInput style={styles.input} placeholder="Ingresa tu cargo" value={profile.Cargo} onChangeText={(val) => handleInputChange('Cargo', val)} />
              </View>
            </View>
          </View>
          
          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]} onPress={handleCompleteProfile} disabled={!isFormValid || loading}>
              {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
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
    justifyContent: 'space-between'
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

export default RegisterProfileScreen;