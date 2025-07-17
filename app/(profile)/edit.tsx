// app/(profile)/edit.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

export default function EditProfileScreen() {
    const router = useRouter();

    // Datos iniciales del usuario (en una app real vendrían del estado global o API)
    const [nombre, setNombre] = useState('Luiger');
    const [apellido, setApellido] = useState('Santana');
    const [telefono, setTelefono] = useState('4141577524');
    const [institucion, setInstitucion] = useState('Equisde');
    const [cargo, setCargo] = useState('Equisdex2');

    const handleSaveChanges = () => {
        const updatedData = { nombre, apellido, telefono, institucion, cargo };
        console.log('Guardando cambios:', updatedData);
        Alert.alert('Éxito', 'Tu perfil ha sido actualizado.', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}><Text style={styles.label}>Nombre</Text><TextInput style={styles.input} value={nombre} onChangeText={setNombre} /></View>
                    <View style={styles.inputGroup}><Text style={styles.label}>Apellido</Text><TextInput style={styles.input} value={apellido} onChangeText={setApellido} /></View>
                    <View style={styles.inputGroup}><Text style={styles.label}>Teléfono</Text><TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" /></View>
                    <View style={styles.inputGroup}><Text style={styles.label}>Institución</Text><TextInput style={styles.input} value={institucion} onChangeText={setInstitucion} /></View>
                    <View style={styles.inputGroup}><Text style={styles.label}>Cargo</Text><TextInput style={styles.input} value={cargo} onChangeText={setCargo} /></View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 24 },
    form: { width: '100%', gap: 20 },
    inputGroup: {},
    label: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
    input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
});