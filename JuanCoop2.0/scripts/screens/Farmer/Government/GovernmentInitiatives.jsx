import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for the back button
import styles from '../css/styles.js';

const initiatives = [
  { id: '1', title: 'Financial Assistance', screen: 'FinancialAssistance' },
  { id: '2', title: 'Training', screen: 'Training' },
  { id: '3', title: 'Farm Inputs & Machinery', screen: 'FarmInputs' },
  { id: '4', title: 'Marketing Assistance', screen: 'MarketingAssistance' },
  { id: '5', title: 'Land Tenure & Security', screen: 'LandSecurity' },
];

const GovernmentInitiatives = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Government Initiatives</Text>
      </View>

      <View style={styles.initiativesContainer}>
        {initiatives.map((initiative) => (
          <TouchableOpacity key={initiative.id} style={styles.initiativeButton} onPress={() => navigation.navigate(initiative.screen)}>
            <Image source={require('@assets/img/Loogo.png')} style={styles.initiativeIcon} />
            <Text style={styles.initiativeTitle}>{initiative.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default GovernmentInitiatives;