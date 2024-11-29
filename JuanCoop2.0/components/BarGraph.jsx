import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const BarGraph = ({ rankedProducts }) => {
  // Extract labels (product names) and data (totalQuantitySold)
  const labels = rankedProducts.map(product => product.name);
  const dataValues = rankedProducts.map(product => product.rank);

  // Configuration for the bar chart
  const data = {
    labels, // Product names as labels
    datasets: [
      {
        data: dataValues, // Rank values (totalQuantitySold)
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Bar color
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // Round to nearest integer
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={300} // Adjust width as needed
        height={320} // Adjust height as needed
        chartConfig={chartConfig}
        verticalLabelRotation={90} // Rotate labels on X-axis if needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default BarGraph;
