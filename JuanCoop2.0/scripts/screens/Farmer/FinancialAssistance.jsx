import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FinancialAssistance = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Assistance</Text>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('GovLoanProgram')}>
        <Text style={styles.optionText}>Government Loan Program</Text>
        <Text style={styles.description}>
          Loans offered by government agencies with favorable interest rates and repayment terms.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('PrivateLenders')}>
        <Text style={styles.optionText}>Private Banks & Lending Institutions</Text>
        <Text style={styles.description}>
          Loans offered by private banks with competitive terms and conditions.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Microfinance')}>
        <Text style={styles.optionText}>Microfinance Institutions</Text>
        <Text style={styles.description}>
          Loans offered by microfinance institutions for small-scale farmers.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Grants')}>
        <Text style={styles.optionText}>Grants</Text>
        <Text style={styles.description}>
          Grants provided by the government and private organizations for agricultural projects.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#ffeb99',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default FinancialAssistance;