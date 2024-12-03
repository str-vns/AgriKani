import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDailySales, getWeeklySales, getMonthlySales } from '../../redux/Actions/salesActions';
import { View, Text, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profileuser } from "@redux/Actions/userActions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;

  const { dailySales, weeklySales, monthlySales } = useSelector((state) => state.sales);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);

          dispatch(Profileuser(userId, res));
        } else {
          setErrors("No JWT token found.");
        }
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setErrors("Failed to retrieve JWT token.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getDailySales());
      dispatch(getWeeklySales());
      dispatch(getMonthlySales());
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch])
  );

  // Refresh sales data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getDailySales());
      await dispatch(getWeeklySales());
      await dispatch(getMonthlySales());
    } catch (err) {
      console.error("Error refreshing sales:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const renderSales = (sales) => {
    console.log("Rendering sales data:", JSON.stringify(sales.data, null, 2));  // Check the entire sales data
    
    if (sales.loading) {
      return <ActivityIndicator size="small" color="blue" />;
    }
  
    if (sales.error) {
      return <Text style={{ color: 'red' }}>Error: {sales.error}</Text>;
    }
  
    // Ensure sales.data.details exists and is not null
    if (sales.data && sales.data.details && Array.isArray(sales.data.details) && sales.data.details.length > 0) {
      const totalSales = sales.data.details.reduce((acc, sale) => {
        return acc + (sale.totalRevenue || 0);
      }, 0);
  
      return <Text>Total Sales: {totalSales > 0 ? totalSales : 'N/A'}</Text>;
    }
  
    return <Text>No sales data available</Text>;
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Dashboard</Text>
      </View>

      {/* Sales Content */}
      <View style={styles.salesContainer}>
        <View style={styles.salesCard}>
          <Text style={styles.cardTitle}>Daily Sales</Text>
          {renderSales(dailySales)}
        </View>

        <View style={styles.salesCard}>
          <Text style={styles.cardTitle}>Weekly Sales</Text>
          {renderSales(weeklySales)}
        </View>

        <View style={styles.salesCard}>
          <Text style={styles.cardTitle}>Monthly Sales</Text>
          {renderSales(monthlySales)}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.navigateButton} 
        onPress={() => navigation.navigate('barGraph')}
      >
        <Text style={styles.buttonText}>View Bar Graph</Text>
      </TouchableOpacity>
      {/* Refresh Control */}
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center", // Ensure the text is centered
    width: "100%",  // Make the title take full width so it can be centered
  },
  salesContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  salesCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: "#f7b900",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default Dashboard;
