import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

// --- DATOS DE LAS TARJETAS ---
const cardData = [
  {
    id: '1',
    title: 'Manual Express',
    subtitle: 'Elabora tu Manual Express',
    tag: '#UniversitasLegal',
    footerText: 'Manual Express',
    //action: (router) => router.push('/manual-form'),
    action: () => console.log('Navegando al repositorio...'),
  },
  {
    id: '2',
    title: 'Manual PRO',
    subtitle: 'Elabora tu Manual PRO',
    tag: '#UniversitasLegal',
    footerText: 'Manual PRO',
    action: (router) => router.push('/manual-form'),
  },
  {
    id: '3',
    title: 'Repositorio legal',
    subtitle: 'Consulta nuestro Repositorio Legal',
    tag: '#UniversitasLegal',
    footerText: 'Repositorio legal',
    action: (router) => router.push('/repository'),
    //action: () => console.log('Navegando al repositorio...'),
  },
  {
    id: '4',
    title: 'Soporte',
    subtitle: 'Soporte técnico',
    tag: '#UniversitasLegal',
    footerText: 'Soporte',
    //action: (router) => router.push('/manual-form'),
    action: () => console.log('Navegando al repositorio...'),
  },
  {
    id: '5',
    title: 'Asesoría',
    subtitle: 'Agenda una asesoría con nuestros expertos',
    tag: '#UniversitasLegal',
    footerText: 'Asesoría',
    //action: (router) => router.push('/manual-form'),
    action: () => console.log('Navegando al repositorio...'),
  },
  {
    id: '6',
    title: 'Formación',
    subtitle: 'Conoce nuestros cursos',
    tag: '#UniversitasLegal',
    footerText: 'Formación',
    action: (router) => router.push('/courses'),
    //action: () => console.log('Navegando al repositorio...'),
  },
];

// --- COMPONENTE REUTILIZABLE PARA LAS TARJETAS ---
const Card = ({ title, subtitle, tag, footerText, onPress }) => (
  <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cardContainer}>
      <View style={styles.cardBlueSection}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{subtitle}</Text>
        <Text style={styles.cardHashtag}>{tag}</Text>
      </View>
      <View style={styles.cardWhiteSection}>
        <Text style={styles.cardActionText}>{footerText}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// --- PANTALLA PRINCIPAL ---
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right', 'top']}>
      {/* Header Fijo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(profile)/menu')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LS</Text>
          </View>
        </TouchableOpacity>
        <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerTitle}>Manuales de Contrataciones</Text>
      </View>

      {/* Contenido Deslizable */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardRow}>
          {cardData.map(card => (
            <Card
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              tag={card.tag}
              footerText={card.footerText}
              onPress={() => card.action(router)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  contentContainer: {
    padding: 8,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '50%',
    padding: 8,
  },
  cardContainer: {
    borderRadius: 12,
    backgroundColor: Colors.background,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
    flex: 1,
  },
  cardBlueSection: {
    backgroundColor: Colors.primary,
    padding: 16,
    flexGrow: 1,
  },
  cardTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 12,
  },
  cardHashtag: {
    color: Colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },
  cardWhiteSection: {
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardActionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});