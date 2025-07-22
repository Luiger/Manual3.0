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
import { Feather, FontAwesome5 } from '@expo/vector-icons'; // Librerías para los íconos
import Colors from '../../constants/Colors';

// --- DATOS DE LAS TARJETjetas ---
// Se añade la información de íconos y variantes de botones según la guía.
const cardData = [
  {
    id: '1',
    icon: { family: Feather, name: 'file-text' },
    title: 'Manual Express',
    subtitle: 'Elabora tu Manual Express',
    buttonText: 'Elaborar',
    buttonVariant: 'express',
    action: (router) => router.push('/manual-express-form'),
  },
  {
    id: '2',
    title: 'Manual PRO',
    subtitle: 'Elabora tu Manual PRO',
    icon: { family: Feather, name: 'file-text' },
    buttonText: 'Elaborar',
    buttonVariant: 'pro',
    action: (router) => router.push('/manual-form'),
  },
  {
    id: '3',
    title: 'Repositorio legal',
    subtitle: 'Consulta nuestro Repositorio Legal',
    icon: { family: FontAwesome5, name: 'gavel' },
    buttonText: 'Explorar',
    buttonVariant: 'transparent',
    action: (router) => router.push('/repository'),
  },
  {
    id: '4',
    title: 'Soporte',
    subtitle: 'Soporte técnico',
    icon: { family: FontAwesome5, name: 'whatsapp' },
    buttonText: 'Contactar',
    buttonVariant: 'transparent',
    action: () => console.log('Abriendo Soporte...'), // Acción futura
  },
  {
    id: '5',
    title: 'Asesoría',
    subtitle: 'Agenda una asesoría con nuestros expertos',
    icon: { family: Feather, name: 'calendar' },
    buttonText: 'Agendar',
    buttonVariant: 'transparent',
    action: () => console.log('Abriendo Asesoría...'), // Acción futura
  },
  {
    id: '6',
    title: 'Formación',
    subtitle: 'Conoce nuestros cursos',
    icon: { family: Feather, name: 'laptop' },
    buttonText: 'Ver cursos',
    buttonVariant: 'transparent',
    action: (router) => router.push('/courses'),
  },
];

// --- COMPONENTE REUTILIZABLE PARA LAS TARJETAS ---
const Card = ({ icon, title, subtitle, buttonText, buttonVariant, onPress }) => {
  const IconComponent = icon.family;
  
  const buttonStyle = [
    styles.cardButton,
    buttonVariant === 'express' && styles.buttonExpress,
    buttonVariant === 'pro' && styles.buttonPro,
    buttonVariant === 'transparent' && styles.buttonTransparent,
  ];
  
  const buttonTextStyle = [
    styles.cardButtonText,
    buttonVariant === 'express' && styles.buttonTextExpress,
    (buttonVariant === 'pro' || buttonVariant === 'transparent') && styles.buttonTextLight,
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <View>
            <IconComponent name={icon.name} size={32} color={Colors.textLight} />
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- PANTALLA PRINCIPAL ---
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(profile)/menu')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LS</Text>
          </View>
        </TouchableOpacity>
        <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerTitle}>Manuales de Contrataciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardRow}>
          {cardData.map(card => (
            <Card
              key={card.id}
              icon={card.icon}
              title={card.title}
              subtitle={card.subtitle}
              buttonText={card.buttonText}
              buttonVariant={card.buttonVariant}
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
    fontFamily: 'Roboto_500Medium',
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
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    height: 220,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    color: Colors.textLight,
    fontSize: 18,
    marginTop: 8,
  },
  cardButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  cardButtonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
  },
  buttonExpress: {
    backgroundColor: Colors.accentExpress,
  },
  buttonTextExpress: {
    color: Colors.primary,
  },
  buttonPro: {
    backgroundColor: Colors.accentPRO,
  },
  buttonTransparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonTextLight: {
    color: Colors.textLight,
  },
});