// app/(auth)/register-profile.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente reutilizable para el indicador de pasos (idéntico al anterior)
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <View style={styles.stepperContainer}>
        <View style={styles.step}><View style={[styles.stepCircle, styles.stepCircleActive]}><Text style={[styles.stepText, styles.stepTextActive]}>1</Text></View><Text style={[styles.stepLabel, styles.stepLabelActive]}>Credenciales</Text></View>
        <View style={styles.stepperLine} />
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text></View><Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Datos personales</Text></View>
    </View>
);

export default function RegisterProfileScreen() {
    const router = useRouter();
    // 'useLocalSearchParams' obtiene los parámetros pasados desde la pantalla anterior
    const { email, password } = useLocalSearchParams();

    const [nombre, setNombre] = React.useState('');
    const [apellido, setApellido] = React.useState('');
    const [telefono, setTelefono] = React.useState('');
    const [institucion, setInstitucion] = React.useState('');
    const [cargo, setCargo] = React.useState('');

    // Función para finalizar el registro
    const handleCreateAccount = () => {
        if (!nombre || !apellido || !telefono) {
            Alert.alert('Campos requeridos', 'Nombre, apellido y teléfono son obligatorios.');
            return;
        }

        const fullUser = { email, password, nombre, apellido, telefono, institucion, cargo };
        console.log('Creando cuenta con los siguientes datos:', fullUser);
        Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada.', [
            { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Completa tus datos</Text>
                </View>
                <Text style={styles.subtitle}>Por favor, introduce tus datos personales.</Text>
                
                <StepIndicator currentStep={2} />

                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Ingresa tu nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={styles.input} placeholder="Ingresa tu apellido" value={apellido} onChangeText={setApellido} />
                    <TextInput style={styles.input} placeholder="Ingresa tu número de teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
                    <TextInput style={styles.input} placeholder="Ingresa tu institución (opcional)" value={institucion} onChangeText={setInstitucion} />
                    <TextInput style={styles.input} placeholder="Ingresa tu cargo (opcional)" value={cargo} onChangeText={setCargo} />
                </View>

                <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilos (reutilizando muchos nombres de clase para consistencia)
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
    input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
});