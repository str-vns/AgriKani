import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing icons

const Stepper = ({ currentStep }) => {
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.step, currentStep === 1 && styles.activeStep]}>
          <Icon
            name="truck" // Icon for Shipping
            size={24}
            color={currentStep === 1 ? 'white' : 'black'}
          />
          <Text style={[styles.label, currentStep === 1 && styles.activeStepText]}>Shipping</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={[styles.step, currentStep === 2 && styles.activeStep]}>
          <Icon
            name="credit-card" // Icon for Payment
            size={24}
            color={currentStep === 2 ? 'white' : 'black'}
          />
          <Text style={[styles.label, currentStep === 2 && styles.activeStepText]}>Payment</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={[styles.step, currentStep === 3 && styles.activeStep]}>
          <Icon
            name="check" // Icon for Review
            size={24}
            color={currentStep === 3 ? 'white' : 'black'}
          />
          <Text style={[styles.label, currentStep === 3 && styles.activeStepText]}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    elevation: 3, // shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  step: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  activeStep: {
    backgroundColor: '#f7b900', // Blue color for active step
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  label: {
    marginTop: 4,
    fontSize: 14,
    color: 'black',
  },
  activeStepText: {
    color: 'white', // White text for active step
  },
  separator: {
    width: 20,
    height: 2,
    backgroundColor: 'grey',
  },
});

export default Stepper;
