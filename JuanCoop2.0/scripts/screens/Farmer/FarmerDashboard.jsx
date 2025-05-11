import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; 
import styles from "./css/styles";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { singleInventory, inventoryDashboard } from "@redux/Actions/inventoryActions";
import { fetchCoopDashboardData } from "@redux/Actions/orderActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useWeather } from "../../../CurrentWeather";
import { useSocket } from "../../../SocketIo";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import RNFS from 'react-native-fs';

const FarmerDashboard = () => {
  const weather = useWeather();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socket = useSocket();
  const { coopProducts } = useSelector((state) => state.CoopProduct);
  const { Invsuccess } = useSelector((state) => state.sinvent);
  const { InvDloading, InvDash, InvDError  } = useSelector((state) => state.inventoryDashboard);
  const {
    coopdashboards: dashboard,
    coopdashboardloading: loading,
    coopdashboarderror: error,
  } = useSelector((state) => state.coopdashboards || {});


  const screenWidth = Dimensions.get("window").width;
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const [loadingData, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  const [type, setType] = useState("daily");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dailyWeather, setDailyWeather] = useState(null);
  const InventoryInfo = Invsuccess?.details;
  const [fcmToken, setFcmToken] = useState("");

  // console.log("type", type);
  const weatherIcons = {
    a01d: require("../../../assets/weather/a01d.png"),
    a01n: require("../../../assets/weather/a01n.png"),
    a02d: require("../../../assets/weather/a02d.png"),
    a02n: require("../../../assets/weather/a02n.png"),
    a03d: require("../../../assets/weather/a03d.png"),
    a03n: require("../../../assets/weather/a03n.png"),
    a04d: require("../../../assets/weather/a04d.png"),
    a04n: require("../../../assets/weather/a04n.png"),
    a05d: require("../../../assets/weather/a05d.png"),
    a05n: require("../../../assets/weather/a05n.png"),
    a06d: require("../../../assets/weather/a06d.png"),
    a06n: require("../../../assets/weather/a06n.png"),
    c01d: require("../../../assets/weather/c01d.png"),
    c01n: require("../../../assets/weather/c01n.png"),
    c02d: require("../../../assets/weather/c02d.png"),
    c02n: require("../../../assets/weather/c02n.png"),
    c03d: require("../../../assets/weather/c03d.png"),
    c03n: require("../../../assets/weather/c03n.png"),
    c04d: require("../../../assets/weather/c04d.png"),
    c04n: require("../../../assets/weather/c04n.png"),
    d01d: require("../../../assets/weather/d01d.png"),
    d01n: require("../../../assets/weather/d01n.png"),
    d02d: require("../../../assets/weather/d02d.png"),
    d02n: require("../../../assets/weather/d02n.png"),
    d03d: require("../../../assets/weather/d03d.png"),
    d03n: require("../../../assets/weather/d03n.png"),
    f01d: require("../../../assets/weather/f01d.png"),
    f01n: require("../../../assets/weather/f01n.png"),
    r01d: require("../../../assets/weather/r01d.png"),
    r01n: require("../../../assets/weather/r01n.png"),
    r02d: require("../../../assets/weather/r02d.png"),
    r02n: require("../../../assets/weather/r02n.png"),
    r03d: require("../../../assets/weather/r03d.png"),
    r03n: require("../../../assets/weather/r03n.png"),
    r04d: require("../../../assets/weather/r04d.png"),
    r04n: require("../../../assets/weather/r04n.png"),
    r05d: require("../../../assets/weather/r05d.png"),
    r05n: require("../../../assets/weather/r05n.png"),
    r06d: require("../../../assets/weather/r06d.png"),
    r06n: require("../../../assets/weather/r06n.png"),
    s01d: require("../../../assets/weather/s01d.png"),
    s01n: require("../../../assets/weather/s01n.png"),
    s02d: require("../../../assets/weather/s02d.png"),
    s02n: require("../../../assets/weather/s02n.png"),
    s03d: require("../../../assets/weather/s03d.png"),
    s03n: require("../../../assets/weather/s03n.png"),
    s04d: require("../../../assets/weather/s04d.png"),
    s04n: require("../../../assets/weather/s04n.png"),
    s05d: require("../../../assets/weather/s05d.png"),
    s05n: require("../../../assets/weather/s05n.png"),
    s06d: require("../../../assets/weather/s06d.png"),
    s06n: require("../../../assets/weather/s06n.png"),
    t01d: require("../../../assets/weather/t01d.png"),
    t01n: require("../../../assets/weather/t01n.png"),
    t02d: require("../../../assets/weather/t02d.png"),
    t02n: require("../../../assets/weather/t02n.png"),
    t03d: require("../../../assets/weather/t03d.png"),
    t03n: require("../../../assets/weather/t03n.png"),
    t04d: require("../../../assets/weather/t04d.png"),
    t04n: require("../../../assets/weather/t04n.png"),
    t05d: require("../../../assets/weather/t05d.png"),
    t05n: require("../../../assets/weather/t05n.png"),
    default: require("../../../assets/weather/c01d.png"),
  };

  useFocusEffect(
    useCallback(() => {
      const fetchDailyWeather = async () => {
        const response = await fetch(
          `https://api.weatherbit.io/v2.0/forecast/daily?city=Bulacan&country=PH&key=${Constants?.expoConfig?.extra?.WEATHER_API_KEY}`
        );
        const data = await response.json();
        setDailyWeather(data);
      };

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
  );

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
          if (userId) {
            const invItem = {
              type: type,
              user: userId,
            }
            dispatch(Profileuser(userId, res));
            dispatch(singleInventory(userId, res));
            dispatch(inventoryDashboard(invItem, res))
          } else {
            setErrors("User ID is missing.");
          }
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
  }, [userId, dispatch, type]);

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

  const handleDashboardRefresh = (itemValue) => {
    const invItem = {
      type: itemValue,
      user: userId,
    }
    dispatch(inventoryDashboard(invItem, token))
  }
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

  console.log(PermissionsAndroid.RESULTS.GRANTED, "Platform");

async function requestStoragePermission() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "This app needs access to your storage to download files.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}

  


  const handleDownload = async () => {
  if (!InvDash?.[0]?.products || InvDash?.[0]?.products?.length === 0) {
    alert("No data available to download.");
    return;
  }

  let baseFileName = `inventory_${InvDash?.[0]?.currentDay}`;
  let fileName = `${baseFileName}.pdf`;
  const downloadsDir = RNFS.DownloadDirectoryPath;
  let filePath = `${downloadsDir}/${fileName}`;
  let counter = 1;

  while (await RNFS.exists(filePath)) {
    fileName = `${baseFileName}(${counter}).pdf`;
    filePath = `${downloadsDir}/${fileName}`;
    counter++;
  }

  const hasPermission = await requestStoragePermission();
  console.log("hasPermission", hasPermission);
  if (!hasPermission) {
    alert("Storage permission is required to download the file.");
    return;
  }

  try {
    const InventoryContent = `
     <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      h1 {
        text-align: center;
        color: #EDC001;
        -webkit-text-stroke: 1px black;
      }
      h2 {
        color: #EDC001;
        -webkit-text-stroke: 1px black;
        margin-bottom: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 40px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #EDC001;
        color: black;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      .center-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        color: #FFDA03;
        -webkit-text-stroke: 1px black;
      }
      .inline-image {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }
      .inline-image img {
        width: 50px;
        height: 50px;
        vertical-align: middle;
      }
      .text-container {
        text-align: center;
      }
      .text-container h1 {
        font-size: 36px;
        margin: 0;
      }
      .text-container .date {
        font-size: 14px;
        margin-top: 5px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="center-container">
      <div class="inline-image">
        <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1746856018/files/mkenwabkxpdtpa6vmwul.png" alt="Inventory Icon">
        <h2>JuanCoop</h2>
      </div>
    </div>
    <div class="text-container">
      <h1>Inventory</h1>
      <p class="date">Date: ${InvDash?.[0]?.currentDay}</p>
    </div>

    ${InvDash[0].products
      .map(
        (product) => `
          <h2>${product.productName}</h2>
          <table>
            <thead>
              <tr>
                <th>Unit Metric</th>
                <th>Delivered</th>
                <th>Current Stock</th>
              </tr>
            </thead>
            <tbody>
              ${product.variations
                .map(
                  (v) => `
                    <tr>
                      <td>${v.unitName} (${v.metricUnit})</td>
                      <td>${v.quantityDelivered}</td>
                      <td>${v.currentStock}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
        `
      )
      .join('')}
  </body>
</html>
    `;

    // Generate PDF in cache
    const { uri } = await Print.printToFileAsync({
      html: InventoryContent,
      base64: false,
    });

    await RNFS.moveFile(uri, filePath);

    alert(`PDF saved to Downloads`);
    console.log('PDF saved to:', filePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to download inventory data.');
  }
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
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
                    {item.productId?.productName || "Unknown Product"}
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

      <View style={styles.coopdashboardContainer}>
        {/* Dashboard Header */}
        <View style={styles.coopdashboardHeader}>
          <Text style={styles.coopdashboardTitle}>
            🚀 Cooperative Dashboard
          </Text>
        </View>

        <View style={styles.weatherContainer}>
          {weather !== null ? (
            <View style={styles.weatherBox}>
              <Image
                blurRadius={70}
                source={require("@assets/img/bg.jpg")}
                style={styles.backgroundImage}
              />

              <View style={styles.overlay}>
                <Image
                  source={
                    weatherIcons[weather?.data[0]?.weather?.icon] ||
                    weatherIcons["default"]
                  }
                  style={styles.cloudImage}
                />

                <Text style={styles.weatherText}>
                  City: {weather?.data[0].city_name}
                </Text>
                <Text style={styles.weatherText}>
                  Temperature: {weather?.data[0].temp}°C
                </Text>
                <Text style={styles.weatherText}>
                  Weather: {weather?.data[0].weather.description}
                </Text>
                <Text style={styles.weatherText}>
                  Wind Speed: {weather?.data[0].wind_spd} m/s
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.UnavailableText}>
              Weather is Unavailable Currently...
            </Text>
          )}

          {dailyWeather !== null && (
            <ScrollView horizontal={true}>
              {dailyWeather?.data?.map((item, index) => (
                <View
                  key={item._id || index}
                  style={styles.dailyWeatherContainer}
                >
                  <View style={styles.dailyWeatherBox}>
                    <Image
                      blurRadius={70}
                      source={require("../../../assets/img/bg.jpg")}
                      style={styles.backgroundImageDaily}
                    />
                    <View style={styles.dailyOverlay}>
                      <Text style={styles.dailyWeatherDate}>
                        {item.valid_date}
                      </Text>

                      <Image
                        source={
                          weatherIcons[item?.weather?.icon] ||
                          weatherIcons["default"]
                        }
                        style={styles.dailyWeatherCloudImage}
                      />

                      <Text
                        style={styles.dailyWeatherText}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {item.weather.description}
                      </Text>
                      <Text style={styles.dailyWeatherTempText}>
                        {item.temp}°C
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        {/* Summary Cards */}
        <View style={styles.coopdashboardSummaryContainer}>
          {[
            {
              title: "💰 Sales",
              value: `₱${dashboard?.totalRevenue?.toLocaleString()}`,
            },
            { title: "📊 Orders", value: dashboard?.totalOrders },
            { title: "👥 Customers", value: dashboard?.totalCustomers },
          ].map((item, index) => (
            <View key={index} style={styles.coopdashboardSummaryCard}>
              <Text style={styles.coopdashboardSummaryTitle}>{item.title}</Text>
              <Text style={styles.coopdashboardSummaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Order Status Breakdown */}
        {dashboard?.orderStatusCounts && (
          <PieChart
            data={Object.entries(dashboard.orderStatusCounts).map(
              ([status, count], index) => ({
                name: status,
                population: count,
                color: ["#FFD700", "#FFB703", "#FB8500", "#219EBC"][index % 4],
                legendFontColor: "#333",
                legendFontSize: 12,
              })
            )}
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

        {/* Sales Overview */}
        <View style={styles.coopdashboardSalesContainer}>
          <View style={styles.coopdashboardHeader}>
            <Text style={styles.coopdashboardSalesTitle}>
              📊 Sales Overview
            </Text>
            <Picker
              selectedValue={selectedRange}
              style={styles.coopdashboardPicker}
              onValueChange={(itemValue) => setSelectedRange(itemValue)}
            >
              <Picker.Item label="Daily" value="day" />
              <Picker.Item label="Weekly" value="week" />
              <Picker.Item label="Monthly" value="month" />
              <Picker.Item label="Yearly" value="year" />
            </Picker>
          </View>

          {currentSales.length > 0 ? (
            <BarChart
              data={{
                labels: currentSales.map((entry) => entry._id),
                datasets: [
                  { data: currentSales.map((entry) => entry.totalSales) },
                ],
              }}
              width={screenWidth - 50}
              height={220}
              yAxisLabel="₱"
              chartConfig={{
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange Tint
              }}
              style={styles.coopdashboardChart}
            />
          ) : (
            <Text style={styles.coopdashboardNoDataText}>
              No sales data available for this period.
            </Text>
          )}
        </View>

      {/* Inventory Overview */}
        <View style={styles.invContainer}>
          <View style={styles.coopdashboardHeader}>
            <Text style={styles.coopdashboardSalesTitle}>
              📊 Inventory Overview
            </Text>
            <Text style={styles.coopdashboardSalesTitle}>
            {InvDash?.[0]?.currentDay}
            </Text>
            <Picker
              selectedValue={selectedRange}
              style={styles.coopdashboardPicker}
              onValueChange={(itemValue) => {
                setType(itemValue);
                handleDashboardRefresh(itemValue);
              }}
            >
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
              <Picker.Item label="Yearly" value="yearly" />
            </Picker>

            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload()}>
      <Text style={styles.downloadButtonText}>Download Data</Text>
    </TouchableOpacity>
          </View>
          {InvDash?.[0]?.products?.length > 0 ? (
  <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    {InvDash?.[0]?.products.map((product, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.productName}>{product.productName}</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.cellHeader]}>Unit</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Metric</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Delivered</Text>
          <Text style={[styles.cell, styles.cellHeader]}>Current</Text>
        </View>

        {/* Render variations of the product */}
        {product.variations.map((variation, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.cell}>{variation.unitName}</Text>
            <Text style={styles.cell}>{variation.metricUnit}</Text>
            <Text style={styles.cell}>{variation.quantityDelivered}</Text>
            <Text style={styles.cell}>{variation.currentStock}</Text>
          </View>
        ))}
      </View>
    ))}
  </ScrollView>
) : (
  <Text style={styles.coopdashboardNoDataText}>
    No inventory data available for this period.
  </Text>
)}
        </View>

        {/* Top Selling Products */}
        {dashboard?.topSellingProducts?.length > 0 && (
          <View style={styles.coopdashboardTopProductsContainer}>
            <Text style={styles.coopdashboardTopProductsTitle}>
              🔥 Top 5 Selling Products
            </Text>
            {dashboard.topSellingProducts.map((product, index) => (
              <View
                key={product.productId}
                style={styles.coopdashboardTopProductRow}
              >
                <Text style={styles.coopdashboardTopProductText}>
                  {index + 1}. {product.productName}
                </Text>
                <Text style={styles.coopdashboardTopProductText}>
                  {product.totalSold} sold
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FarmerDashboard;
