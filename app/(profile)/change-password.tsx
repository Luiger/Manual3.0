// app/(profile)/change-password.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente de indicador de pasos
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <View style={styles.stepperContainer}>
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text></View><Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Verificar</Text></View>
        <View style={styles.stepperLine} />
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text></View><Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Establecer</Text></View>
    </View>
);

export default function ChangePasswordScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleVerify = () => {
        if (!currentPassword) {
            Alert.alert('Error', 'Ingresa tu contraseña actual.');
            return;
        }
        console.log('Verificando contraseña actual...');
        setStep(2); // Avanza al siguiente paso
    };

    const handleSaveChanges = () => {
        if (!newPassword || newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las nuevas contraseñas no coinciden o están vacías.');
            return;
        }
        console.log('Guardando nueva contraseña...');
        Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
             {/* El Stack.Screen permite personalizar el header de esta pantalla específica */}
            <Stack.Screen options={{ 
                headerShown: true,
                title: step === 1 ? 'Verificar Identidad' : 'Establecer Nueva Contraseña',
            }} />
            <View style={styles.container}>
                {step === 1 ? (
                    // --- VISTA PASO 1 ---
                    <>
                        <Text style={styles.subtitle}>Para continuar, ingresa tu contraseña actual.</Text>
                        <StepIndicator currentStep={1} />
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contraseña Actual</Text>
                            <TextInput style={styles.input} placeholder='Ingresa tu contraseña actual' value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleVerify}>
                            <Text style={styles.buttonText}>Verificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgotLink} onPress={() => router.push('/(auth)/forgot-password')}>
                            <Text style={styles.link}>¿Olvidaste tu Contraseña? Ingresa aquí</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // --- VISTA PASO 2 ---
                    <>
                        <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>
                        <StepIndicator currentStep={2} />
                        <View style={styles.inputGroup}><Text style={styles.label}>Nueva Contraseña</Text><TextInput style={styles.input} placeholder='Ingresa tu nueva contraseña' value={newPassword} onChangeText={setNewPassword} secureTextEntry /></View>
                        <View style={styles.inputGroup}><Text style={styles.label}>Confirmar Nueva Contraseña</Text><TextInput style={styles.input} placeholder='Confirma tu nueva contraseña' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry /></View>
                        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                            <Text style={styles.buttonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1, padding: 24 },
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
    inputGroup: { width: '100%', marginBottom: 16 },
    label: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
    input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
    buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
    forgotLink: { marginTop: 24, alignItems: 'center' },
    link: { color: Colors.accent, fontSize: 16, fontWeight: 'bold' },
});