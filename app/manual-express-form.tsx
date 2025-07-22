import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { FormService } from '../services/form.service';
import Colors from '../constants/Colors';

// --- DEFINICIONES DEL FORMULARIO ---
interface FormDataState {
  nombreInstitucion: string;
  siglasInstitucion: string;
  unidadGestion: string;
  unidadSistemas: string;
}

const FORM_FIELDS: { key: keyof FormDataState; label: string; }[] = [
  { key: 'nombreInstitucion', label: '1. Indique el nombre de la institución, ente u órgano.' },
  { key: 'siglasInstitucion', label: '2. Indique el acrónimo y/o siglas de la institución.' },
  { key: 'unidadGestion', label: '3. Indique el nombre de la unidad responsable de la gestión administrativa y financiera.' },
  { key: 'unidadSistemas', label: '4. Indique el nombre de la unidad responsable del área de sistema y tecnología.' },
];

const validationSchema = Yup.object().shape({
  nombreInstitucion: Yup.string().required('Campo requerido'),
  siglasInstitucion: Yup.string().required('Campo requerido'),
  unidadGestion: Yup.string().required('Campo requerido'),
  unidadSistemas: Yup.string().required('Campo requerido'),
});

// --- COMPONENTE PRINCIPAL ---
const ManualExpressFormScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormDataState>({
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // La verificación ahora corre en segundo plano sin bloquear la UI
  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const { hasSubmitted, isRestrictionActive } = await FormService.checkExpressSubmissionStatus();
        if (isRestrictionActive && hasSubmitted) {
          Alert.alert('Límite alcanzado', 'Ya has llenado este formulario.', [{ text: 'OK', onPress: () => router.back() }]);
        }
      } catch (e) {
        console.error('Error al verificar el estado del formulario Express:', e);
      }
    };
    verifyStatus();
  }, []);

  useEffect(() => {
    validationSchema.isValid(formData).then(setIsFormValid);
  }, [formData]);

  const handleInputChange = (name: keyof FormDataState, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      const payload = {
        'Indique el nombre de la institución, ente u órgano.': formData.nombreInstitucion,
        'Indique el acrónimo y/o siglas de la institución.': formData.siglasInstitucion,
        'Indique el Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera de la Institución / Ente / Órgano.': formData.unidadGestion,
        'Indique el nombre de la unidad responsable del área de sistema y tecnología.': formData.unidadSistemas,
      };
      const result = await FormService.submitManualExpress(payload);
      if (result.success) {
        Alert.alert('Éxito', 'Formulario enviado correctamente.', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        setError(result.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Elabora tu manual express</Text>
            <Text style={styles.subtitle}>Ingresa los datos básicos para generar una demostración del manual de concurso abierto. Lo recibirás en tu correo en pocos minutos.</Text>
          </View>

          {FORM_FIELDS.map(field => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput style={styles.input} value={formData[field.key]} onChangeText={(val) => handleInputChange(field.key, val)} />
            </View>
          ))}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, (!isFormValid || isSubmitting) && styles.buttonDisabled, styles.buttonExpress]} onPress={handleSubmit} disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? <ActivityIndicator color={Colors.primary} /> : <Text style={styles.buttonTextExpress}>Elaborar manual</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: {
    padding: 24,
    paddingBottom: 48, // Padding consistente para un buen espaciado inferior
  },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text, textAlign: 'center' },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  inputContainer: { marginBottom: 20 },
  label: { fontFamily: 'Roboto_500Medium', fontSize: 16, color: Colors.text, marginBottom: 8, lineHeight: 22 },
  input: {
    height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular'
  },
  button: {
    width: '100%', height: 56, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonExpress: {
    backgroundColor: Colors.accentExpress,
  },
  buttonTextExpress: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.primary,
    fontSize: 16
  },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 12, fontFamily: 'Roboto_400Regular' },
});

export default ManualExpressFormScreen;