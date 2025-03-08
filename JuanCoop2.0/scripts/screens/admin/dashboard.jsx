import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import styles from '../Farmer/css/styles';
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { singleInventory } from '@redux/Actions/inventoryActions';
import { fetchOverallDashboardData } from '@redux/Actions/orderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;

  const { overalldashboards: dashboard, overalldashboardloading: loading, overalldashboarderror: error } = useSelector(
    (state) => state.overalldashboards || {}
  );

  const screenWidth = Dimensions.get('window').width;
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const InventoryInfo = useSelector((state) => state.sinvent?.Invsuccess?.details);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
          if (userId) {
            dispatch(Profileuser(userId, res));
            dispatch(singleInventory(userId, res));
            dispatch(fetchOverallDashboardData(res));
          } else {
            setErrors('User ID is missing.');
          }
        } else {
          setErrors('No JWT token found.');
        }
      } catch (error) {
        console.error('Error retrieving JWT:', error);
        setErrors('Failed to retrieve JWT token.');
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  useEffect(() => {
    let interval;
    if (InventoryInfo?.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % InventoryInfo?.length);
      }, 4000);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [InventoryInfo?.length]);

  const salesTrends = dashboard?.salesTrends || { daily: 0, weekly: 0, monthly: 0 };
  const rankedProducts = dashboard?.rankedProducts || [];

  const salesTrendsData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        data: [salesTrends.daily || 0, salesTrends.weekly || 0, salesTrends.monthly || 0],
      },
    ],
  };

  const topProductsData = rankedProducts.map((p) => ({
    name: p.productName || "Unknown",
    population: p.totalQuantitySold || 0,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Daily Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.daily}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Weekly Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.weekly}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Monthly Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.monthly}</Text>
        </View>
      </View>

      <View style={styles.totalOrdersCard}>
        <Text style={styles.totalOrdersTitle}>Total Orders</Text>
        <Text style={styles.totalOrdersValue}>{dashboard?.totalOrders ?? 0}</Text>
      </View>

      <View style={styles.chartsContainer}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Sales Trends</Text>
          <BarChart
            data={salesTrendsData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#e5e5e5",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Selling Products</Text>
          <PieChart
            data={topProductsData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
