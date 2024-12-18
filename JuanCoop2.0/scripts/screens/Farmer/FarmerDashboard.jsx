import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; // For the line chart
import { useNavigation } from '@react-navigation/native'; // Assuming navigation is set up
import styles from './css/styles';
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getCoopProducts } from '@redux/Actions/productActions'
import { singleInventory } from '@redux/Actions/inventoryActions'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { coopProducts } = useSelector((state) => state.CoopProduct);
  const { Invsuccess } = useSelector((state) => state.sinvent);
  const screenWidth = Dimensions.get('window').width;
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const InventoryInfo = Invsuccess?.details;


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
          if (userId) {
            dispatch(Profileuser(userId, res));
            dispatch(singleInventory(userId, res));
 
          } else {
            setErrors('User ID is missing.');
          }
        } else {
          setErrors('No JWT token found.');
        }
      } catch (error) {
        console.error('Error retrieving JWT:', error);
        setErrors('Failed to retrieve JWT token.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  useEffect(() => {
    let interval;
    if (InventoryInfo?.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % InventoryInfo?.length);
      }, 4000); // Set to 4 seconds (4000 ms)

      return () => clearInterval(interval); // Cleanup interval on component unmount or length changeA
    }

    return () => {}; // Cleanup function if no outOfStockProducts
  }, [InventoryInfo?.length]);

  const [selectedTab, setSelectedTab] = useState('Weekly');

  // Sample line chart data
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [500, 1000, 1500, 3000, 1200, 2500, 2400],
        strokeWidth: 2, // line thickness
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange line
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black labels
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#FFA500', // Orange stroke
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Out of Stock Banner */}
      <View style={styles.bannerContainer}>
  <Text style={styles.bannerText}>⚠️ Out of Stock:</Text>
  <FlatList
  data={InventoryInfo?.length > 0 ? [InventoryInfo[currentIndex]] : []}
  keyExtractor={(item) => `${item._id}`} // Use product _id for unique key
  renderItem={({ item }) =>
    item ? (
      <View style={styles.productContainer}>
        <View style={styles.centeredContent}>
          {/* Render product name from productId object */}
          <Text style={styles.productText}>
            {item.productId?.productName || 'Unknown Product'}
          </Text>
          {/* Render unit details */}
          <Text style={styles.stockText}>
            {item.unitName} {item.metricUnit}
          </Text>
        </View>
      </View>
    ) : null
  }
  horizontal
  showsHorizontalScrollIndicator={false}
/>
</View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Daily' && styles.activeTab]}
          onPress={() => setSelectedTab('Daily')}
        >
          <Text style={[styles.tabText, selectedTab === 'Daily' && styles.activeTabText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Weekly' && styles.activeTab]}
          onPress={() => setSelectedTab('Weekly')}
        >
          <Text style={[styles.tabText, selectedTab === 'Weekly' && styles.activeTabText]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Monthly' && styles.activeTab]}
          onPress={() => setSelectedTab('Monthly')}
        >
          <Text style={[styles.tabText, selectedTab === 'Monthly' && styles.activeTabText]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Sales Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.salesText}>This Week Sales</Text>
        <Text style={styles.salesValue}>$2435.17</Text>
        <LineChart
          data={lineData}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>

      {/* Sales Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Gross Sales</Text>
          <Text style={styles.statValue}>$2572.73</Text>
          <Text style={styles.statChangePositive}>+ $230.34</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Net Sales</Text>
          <Text style={styles.statValue}>$2192.73</Text>
          <Text style={styles.statChangeNegative}>- $120.34</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Discount</Text>
          <Text style={styles.statValue}>- $150.06</Text>
          <Text style={styles.statChangePositive}>+ 10%</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Tax</Text>
          <Text style={styles.statValue}>$139.69</Text>
          <Text style={styles.statChangeNegative}>+ $21</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FarmerDashboard;
