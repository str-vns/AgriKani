import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Assuming navigation is set up
import styles from './css/styles';
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getCoopProducts } from '@redux/Actions/productActions'
import { singleInventory } from '@redux/Actions/inventoryActions'
import { fetchCoopDashboardData } from '@redux/Actions/orderActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { useWeather } from '../../../CurrentWeather';
import { useSocket } from "../../../SocketIo";
import messaging from '@react-native-firebase/messaging';
import Constants from "expo-constants";
import RNPickerSelect from "react-native-picker-select";

const FarmerDashboard = () => {
  const weather = useWeather();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socket = useSocket();
  const { coopProducts } = useSelector((state) => state.CoopProduct);
  const { Invsuccess } = useSelector((state) => state.sinvent);
  const { coopdashboards: dashboard, coopdashboardloading: loading, coopdashboarderror: error } = useSelector(
    (state) => state.coopdashboards || {}
  );

  const screenWidth = Dimensions.get('window').width;
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const [loadingData, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dailyWeather, setDailyWeather] = useState(null);
  const InventoryInfo = Invsuccess?.details;
  const [fcmToken, setFcmToken] = useState("");

  const weatherIcons = {
    'a01d': require('../../../assets/weather/a01d.png'),
    'a01n': require('../../../assets/weather/a01n.png'),
    'a02d': require('../../../assets/weather/a02d.png'),
    'a02n': require('../../../assets/weather/a02n.png'),
    'a03d': require('../../../assets/weather/a03d.png'),
    'a03n': require('../../../assets/weather/a03n.png'),
    'a04d': require('../../../assets/weather/a04d.png'),
    'a04n': require('../../../assets/weather/a04n.png'),
    'a05d': require('../../../assets/weather/a05d.png'),
    'a05n': require('../../../assets/weather/a05n.png'),
    'a06d': require('../../../assets/weather/a06d.png'),
    'a06n': require('../../../assets/weather/a06n.png'),
    'c01d': require('../../../assets/weather/c01d.png'),
    'c01n': require('../../../assets/weather/c01n.png'),
    'c02d': require('../../../assets/weather/c02d.png'),
    'c02n': require('../../../assets/weather/c02n.png'),
    'c03d': require('../../../assets/weather/c03d.png'),
    'c03n': require('../../../assets/weather/c03n.png'),
    'c04d': require('../../../assets/weather/c04d.png'),
    'c04n': require('../../../assets/weather/c04n.png'),
    'd01d': require('../../../assets/weather/d01d.png'),
    'd01n': require('../../../assets/weather/d01n.png'),
    'd02d': require('../../../assets/weather/d02d.png'),
    'd02n': require('../../../assets/weather/d02n.png'),
    'd03d': require('../../../assets/weather/d03d.png'),
    'd03n': require('../../../assets/weather/d03n.png'),
    'f01d': require('../../../assets/weather/f01d.png'),
    'f01n': require('../../../assets/weather/f01n.png'),
    'r01d': require('../../../assets/weather/r01d.png'),
    'r01n': require('../../../assets/weather/r01n.png'),
    'r02d': require('../../../assets/weather/r02d.png'),
    'r02n': require('../../../assets/weather/r02n.png'),
    'r03d': require('../../../assets/weather/r03d.png'),
    'r03n': require('../../../assets/weather/r03n.png'),
    'r04d': require('../../../assets/weather/r04d.png'),
    'r04n': require('../../../assets/weather/r04n.png'),
    'r05d': require('../../../assets/weather/r05d.png'),
    'r05n': require('../../../assets/weather/r05n.png'),
    'r06d': require('../../../assets/weather/r06d.png'),
    'r06n': require('../../../assets/weather/r06n.png'),
    's01d': require('../../../assets/weather/s01d.png'),
    's01n': require('../../../assets/weather/s01n.png'),
    's02d': require('../../../assets/weather/s02d.png'),
    's02n': require('../../../assets/weather/s02n.png'),
    's03d': require('../../../assets/weather/s03d.png'),
    's03n': require('../../../assets/weather/s03n.png'),
    's04d': require('../../../assets/weather/s04d.png'),
    's04n': require('../../../assets/weather/s04n.png'),
    's05d': require('../../../assets/weather/s05d.png'),
    's05n': require('../../../assets/weather/s05n.png'),
    's06d': require('../../../assets/weather/s06d.png'),
    's06n': require('../../../assets/weather/s06n.png'),
    't01d': require('../../../assets/weather/t01d.png'),
    't01n': require('../../../assets/weather/t01n.png'),
    't02d': require('../../../assets/weather/t02d.png'),
    't02n': require('../../../assets/weather/t02n.png'),
    't03d': require('../../../assets/weather/t03d.png'),
    't03n': require('../../../assets/weather/t03n.png'),
    't04d': require('../../../assets/weather/t04d.png'),
    't04n': require('../../../assets/weather/t04n.png'),
    't05d': require('../../../assets/weather/t05d.png'),
    't05n': require('../../../assets/weather/t05n.png'),
    'default': require('../../../assets/weather/c01d.png'),
  };

  useFocusEffect(
    useCallback(() => { 
        const fetchDailyWeather = async () =>
          {
              const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=Manila&country=PH&key=${Constants?.expoConfig?.extra?.WEATHER_API_KEY}`);
              const data = await response.json();
              setDailyWeather(data);
              }
              
          fetchDailyWeather();
          if (!socket) {
            console.warn("Socket is not initialized.");
            return;
          }
        
      
            if (userId) {
              socket.emit("addUser", userId);
            } else {
              console.warn("User ID is missing.");
            }
          
              socket.on("getUsers", (users) => {
                const onlineUsers = users.filter(
                  (user) => user.online && user.userId !== null
                );
          
                setOnlineUsers(onlineUsers);
              });
          
              return () => {
                socket.off("getUsers");
              };

            }, [socket, userId])       
  )
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

  useEffect(() => {
    if (userId) {
      dispatch(fetchCoopDashboardData(userId));
    }
  }, [dispatch, userId]);

  const [selectedRange, setSelectedRange] = useState("day");

  const salesData = {
    day: dashboard?.salesPerDay || [],
    week: dashboard?.salesPerWeek || [],
    month: dashboard?.salesPerMonth || [],
    year: dashboard?.salesPerYear || [],
  };

  const currentSales = salesData[selectedRange];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>⚠️ Out of Stock:</Text>
          <FlatList
            data={InventoryInfo?.length > 0 ? [InventoryInfo[currentIndex]] : []}
            keyExtractor={(item) => `${item._id}`}
            renderItem={({ item }) =>
              item ? (
                <View style={styles.productContainer}>
                  <View style={styles.centeredContent}>

                    <Text style={styles.productText}>
                      {item.productId?.productName || 'Unknown Product'}
                    </Text>

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
      
      <View style={styles.coopdatacontainer}>
      <Text style={styles.coopdatatitle}>Cooperative Dashboard</Text>

      {/* Summary Cards */}
      <View style={styles.coopdatasummaryContainer}>
        {[
          { title: "💰 Sales", value: `₱${dashboard?.totalRevenue?.toLocaleString()}` },
          { title: "📊 Orders", value: dashboard?.totalOrders },
          { title: "👥 Customers", value: dashboard?.totalCustomers },
        ].map((item, index) => (
          <View key={index} style={styles.coopdatasummaryCard}>
            <Text style={styles.coopdatasummaryTitle}>{item.title}</Text>
            <Text style={styles.coopdatasummaryValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Order Status Breakdown */}
      {dashboard?.orderStatusCounts && (
        <PieChart
          data={Object.entries(dashboard.orderStatusCounts).map(([status, count], index) => ({
            name: status,
            population: count,
            color: ["#FFD700", "#FFB703", "#FB8500", "#219EBC"][index % 4],
            legendFontColor: "#333",
            legendFontSize: 12,
          }))}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}

<View style={styles.coopdataContainer}>
      <View style={styles.coopdataheader}>
        <Text style={styles.coopdataTitle}>📊 Sales Overview</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedRange(value)}
          items={[
            { label: "Day", value: "day" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
            { label: "Year", value: "year" },
          ]}
          style={{
            inputIOS: styles.coopdatadropdown,
            inputAndroid: styles.coopdatadropdown,
          }}
          value={selectedRange}
        />
      </View>

      {currentSales.length > 0 ? (
        <BarChart
          data={{
            labels: currentSales.map((entry) => entry._id),
            datasets: [{ data: currentSales.map((entry) => entry.totalSales) }],
          }}
          width={screenWidth - 50}
          height={220}
          yAxisLabel="₱"
          chartConfig={{
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(11, 9, 1, ${opacity})`, // Orange-Yellow Tint
          }}
          style={styles.coopdataChart}
        />
      ) : (
        <Text style={styles.coopdatanoDataText}>No sales data available for this period.</Text>
      )}
    </View>

      {/* Top Selling Products */}
      {dashboard?.topSellingProducts?.length > 0 && (
        <View style={styles.coopdatatopProductsContainer}>
          <Text style={styles.coopdatatopProductsTitle}>🔥 Top 5 Selling Products</Text>
          {dashboard.topSellingProducts.map((product, index) => (
            <View key={product.productId} style={styles.coopdatatopProductRow}>
              <Text style={styles.coopdatatopProductText}>{index + 1}. {product.productName}</Text>
              <Text style={styles.coopdatatopProductText}>{product.totalSold} sold</Text>
            </View>
          ))}
        </View>
      )}
    </View>
    </ScrollView>
  );
};

export default FarmerDashboard;
