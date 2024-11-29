import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper'; // Fixed the import for Checkbox

const UserFilter = () => {
  const [sortByName, setSortByName] = useState('A to Z');
  const [sortByRating, setSortByRating] = useState('3 - 4 Stars');
  const [sortByPrice, setSortByPrice] = useState('Low to high');
  const [sortByDiscount, setSortByDiscount] = useState('25 - 50%');
  const [inStock, setInStock] = useState(true);
  const [gAssured, setGAssured] = useState(false);

  const handleApplyFilter = () => {
    // Function to apply filter options
    console.log({
      sortByName,
      sortByRating,
      sortByPrice,
      sortByDiscount,
      inStock,
      gAssured,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By Name</Text>
        <View style={styles.optionRow}>
          <RadioButton
            value="A to Z"
            status={sortByName === 'A to Z' ? 'checked' : 'unchecked'}
            onPress={() => setSortByName('A to Z')}
          />
          <Text style={styles.optionText}>A to Z</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="Z to A"
            status={sortByName === 'Z to A' ? 'checked' : 'unchecked'}
            onPress={() => setSortByName('Z to A')}
          />
          <Text style={styles.optionText}>Z to A</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By Rating</Text>
        <View style={styles.optionRow}>
          <RadioButton
            value="1 - 2 Stars"
            status={sortByRating === '1 - 2 Stars' ? 'checked' : 'unchecked'}
            onPress={() => setSortByRating('1 - 2 Stars')}
          />
          <Text style={styles.optionText}>1 - 2 Stars</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="2 - 3 Stars"
            status={sortByRating === '2 - 3 Stars' ? 'checked' : 'unchecked'}
            onPress={() => setSortByRating('2 - 3 Stars')}
          />
          <Text style={styles.optionText}>2 - 3 Stars</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="3 - 4 Stars"
            status={sortByRating === '3 - 4 Stars' ? 'checked' : 'unchecked'}
            onPress={() => setSortByRating('3 - 4 Stars')}
          />
          <Text style={styles.optionText}>3 - 4 Stars</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="4 - 5 Stars"
            status={sortByRating === '4 - 5 Stars' ? 'checked' : 'unchecked'}
            onPress={() => setSortByRating('4 - 5 Stars')}
          />
          <Text style={styles.optionText}>4 - 5 Stars</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By Price</Text>
        <View style={styles.optionRow}>
          <RadioButton
            value="Low to high"
            status={sortByPrice === 'Low to high' ? 'checked' : 'unchecked'}
            onPress={() => setSortByPrice('Low to high')}
          />
          <Text style={styles.optionText}>Low to high</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="High to low"
            status={sortByPrice === 'High to low' ? 'checked' : 'unchecked'}
            onPress={() => setSortByPrice('High to low')}
          />
          <Text style={styles.optionText}>High to low</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By Discounts</Text>
        <View style={styles.optionRow}>
          <RadioButton
            value="10 - 25%"
            status={sortByDiscount === '10 - 25%' ? 'checked' : 'unchecked'}
            onPress={() => setSortByDiscount('10 - 25%')}
          />
          <Text style={styles.optionText}>10 - 25%</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="25 - 50%"
            status={sortByDiscount === '25 - 50%' ? 'checked' : 'unchecked'}
            onPress={() => setSortByDiscount('25 - 50%')}
          />
          <Text style={styles.optionText}>25 - 50%</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="50 - 70%"
            status={sortByDiscount === '50 - 70%' ? 'checked' : 'unchecked'}
            onPress={() => setSortByDiscount('50 - 70%')}
          />
          <Text style={styles.optionText}>50 - 70%</Text>
        </View>
        <View style={styles.optionRow}>
          <RadioButton
            value="70% above"
            status={sortByDiscount === '70% above' ? 'checked' : 'unchecked'}
            onPress={() => setSortByDiscount('70% above')}
          />
          <Text style={styles.optionText}>70% above</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By Availability</Text>
        <View style={styles.optionRow}>
          <Checkbox
            status={inStock ? 'checked' : 'unchecked'}
            onPress={() => setInStock(!inStock)}
          />
          <Text style={styles.optionText}>In stock</Text>
        </View>
        <View style={styles.optionRow}>
          <Checkbox
            status={!inStock ? 'checked' : 'unchecked'}
            onPress={() => setInStock(!inStock)}
          />
          <Text style={styles.optionText}>Out of stock</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
        <Text style={styles.applyButtonText}>Apply Filter </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  applyButton: {
    backgroundColor: '#f7b900',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom:20,
    
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 15,
  },
});

export default UserFilter;
