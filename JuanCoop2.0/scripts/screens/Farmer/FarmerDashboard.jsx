import React, { useState, useEffect, useContext, useCallback, Fragment } from "react";
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
  Modal,
} from "react-native";
import {
  weatherDailyActions,
  weatherCurrentActions,
  clearErrors,
} from "@redux/Actions/weatherActions";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./css/styles";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import {
  singleInventory,
  inventoryDashboard,
} from "@redux/Actions/inventoryActions";
import { fetchCoopDashboardData } from "@redux/Actions/orderActions";
import { getSingleCoop } from "@redux/Actions/productActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../../SocketIo";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import RNFS from "react-native-fs";

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socket = useSocket();
  const { loadingWCurrent, weatherCurrent, errorWCurrent } = useSelector(
    (state) => state.weatherCurrent
  );
  const { loadingWDaily, weatherDaily, errorWDaily } = useSelector(
    (state) => state.weatherDaily
  );
  const { Invsuccess } = useSelector((state) => state.sinvent);
  const { InvDash } = useSelector((state) => state.inventoryDashboard);
  const {
    coopdashboards: dashboard,
    coopdashboardloading: loading,
    coopdashboarderror: error,
  } = useSelector((state) => state.coopdashboards || {});
  const screenWidth = Dimensions.get("window").width;
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const userProfile = context?.stateUser?.userProfile;
  const { coops } = useSelector((state) => state.allofCoops);
  const [loadingData, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  const [type, setType] = useState("daily");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dailyWeather, setDailyWeather] = useState(null);
  const InventoryInfo = Invsuccess?.details;
  const [fcmToken, setFcmToken] = useState("");
  const { coop } = useSelector((state) => state.singleCoop);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

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
      dispatch(weatherCurrentActions());
      dispatch(weatherDailyActions());

      if (!socket) {
        console.warn("Socket is not initialized.");
        return;
      }

      if (userId) {
        socket.emit("addUser", userId);
      } else {
        // console.warn("User ID is missing.");
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
            };
            dispatch(Profileuser(userId, res));
            dispatch(singleInventory(userId, res));
            dispatch(inventoryDashboard(invItem, res));
            dispatch(getSingleCoop(userId));
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
    };
    dispatch(inventoryDashboard(invItem, token));
  };
  const [selectedRange, setSelectedRange] = useState("daily");

  const salesData = () => {
    switch (selectedRange) {
      case "daily":
        return dashboard?.formattedSalesPerDay || [];
      case "monthly":
        return dashboard?.formattedSalesPerMonth || [];
      case "yearly":
        return dashboard?.formattedSalesPerYear || [];
      default:
        return dashboard?.formattedSalesPerDay || [];
    }
  };

  const formatLabel = (id) => {
    switch (selectedRange) {
      case "daily":
        return "day"; // "May 1", "May 2", etc.
      case "monthly":
        return "month"; // "April 2025", "May 2025", etc.
      case "yearly":
        return "year"; // "2025"
      default:
        return "day";
    }
  };

  const COLORS = ["#FFD700", "#FFA500", "#FF8C00"];

  const orderStatusData = Object.entries(
    dashboard?.orderStatusCounts || {}
  ).map(([status, count], index) => ({
    name: `${status} (${count})`, // 👈 Include count in label
    population: count,
    color: COLORS[index % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  // Weather Modal Content
  const WeatherModalContent = () => (
    <Modal
      visible={weatherModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setWeatherModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            Weather Information
          </Text>
          <View style={{ marginBottom: 16 }}>
            {loadingWCurrent ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : errorWCurrent || weatherCurrent === null ? (
              <Text style={{ color: "#b00", textAlign: "center" }}>
                Weather is Unavailable Currently...
              </Text>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={
                    weatherIcons[weatherCurrent?.data[0]?.weather?.icon] ||
                    weatherIcons["default"]
                  }
                  style={{ width: 80, height: 80, marginBottom: 8 }}
                />
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  City: {weatherCurrent?.data[0].city_name}
                </Text>
                <Text>Temperature: {weatherCurrent?.data[0].temp}°C</Text>
                <Text>
                  Weather: {weatherCurrent?.data[0].weather.description}
                </Text>
                <Text>Wind Speed: {weatherCurrent?.data[0].wind_spd} m/s</Text>
              </View>
            )}
          </View>
          <View>
            {loadingWDaily ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : errorWDaily ||
              !weatherDaily ||
              !weatherDaily.data ||
              weatherDaily.data.length === 0 ? (
              <Text style={{ color: "#b00", textAlign: "center" }}>
                Weather is Unavailable Currently...
              </Text>
            ) : (
              <ScrollView horizontal={true} style={{ marginBottom: 8 }}>
                {weatherDaily.data.map((item, index) => (
                  <View
                    key={item._id || index}
                    style={{
                      backgroundColor: "#f7f7f7",
                      borderRadius: 10,
                      marginRight: 10,
                      padding: 10,
                      alignItems: "center",
                      minWidth: 100,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                      {item.valid_date}
                    </Text>
                    <Image
                      source={
                        weatherIcons[item?.weather?.icon] ||
                        weatherIcons["default"]
                      }
                      style={{ width: 40, height: 40, marginBottom: 4 }}
                    />
                    <Text
                      style={{ fontSize: 12, color: "#555" }}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {item.weather.description}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>{item.temp}°C</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: "#EDC001",
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: "center",
            }}
            onPress={() => setWeatherModalVisible(false)}
          >
            <Text style={{ color: "#222", fontWeight: "bold" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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

  const chartData = {
    labels: salesData().map((item) => item[formatLabel(selectedRange)]),
    datasets: [
      {
        data: salesData().map((item) => item.totalSales),
      },
    ],
  };

  const filteredChartData = {
    labels: chartData.labels.filter(
      (_, index) => chartData.datasets[0].data[index] > 0
    ),
    datasets: [
      {
        data: chartData.datasets[0].data.filter((value) => value > 0),
      },
    ],
  };

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

    const labels = filteredChartData.labels;
    const data = filteredChartData.datasets[0].data;

    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const timestamp = now.toLocaleString("en-US", options); // Example: "May 24, 2025, 2:56 PM"


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
      }.timestamp {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
      }

    </style>
  </head>
  <body>
    <div class="center-container">
      <div class="inline-image">
        <img src="https://res.cloudinary.com/diljhwf3a/image/upload/v1746856018/files/mkenwabkxpdtpa6vmwul.png" alt="Inventory Icon">
        <h2>JuanKooP</h2>
      </div>
    </div>
    <div class="text-container">
      <h1>${coop?.farmName}</h1>
      <h2 style="color: gray;">${coop?.address}</h2>
      <h2>Inventory</h2>
      <p style="text-align: right;" class="timestamp">Generated on: ${timestamp}</p>
    </div>

    <div class="section">
      <h2>Dashboard Overview</h2>
      <ul>
        <li>Total Revenue: ₱${dashboard?.totalRevenue?.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
        <li>Total Orders: ${dashboard?.totalOrders || 0}</li>
        <li>Total Customers: ${dashboard?.totalCustomers || 0}</li>
      </ul>
    </div>

    <div class="section">
      <h2>Product Inventory</h2>
      ${InvDash[0]?.products
      .map(
        (product) => `
          <h3>${product?.productName}</h3>
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
                      <td>${v?.unitName} (${v?.metricUnit})</td>
                      <td>${v?.quantityDelivered}</td>
                      <td>${v?.currentStock}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        `
      )
      ?.join("")}
    </div>
      <div class="section">
          <h2>Order Status Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              ${orderStatusData
                ?.map(
                  (status) => `
                    <tr>
                      <td>${status.name}</td>
                      <td>${status.population}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div class="section"> 
      <h2>Sales Data (${selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)})</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>${selectedRange === "daily" ? "Date" : selectedRange === "monthly" ? "Month" : "Year"}</th>
            <th>Total Sales (₱)</th>
          </tr>
        </thead>
        <tbody>
          ${labels
            .map(
              (label, index) => `
                <tr>
                  <td>${label}</td>
                  <td>₱${data[index]?.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
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
      console.log("PDF saved to:", filePath);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download inventory data.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <WeatherModalContent />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        {/* Weather Icon Button */}
        <TouchableOpacity
          style={{ marginLeft: "auto", marginRight: 10 }}
          onPress={() => setWeatherModalVisible(true)}
        >
          <Ionicons name="cloud-outline" size={32} color="#EDC001" />
        </TouchableOpacity>
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
          <Text style={styles.coopdashboardTitle}>Cooperative Dashboard</Text>
        </View>

        <View style={styles.coopdashboardSummaryContainer}>
          {[
            {
              title: "Sales",
              value: `₱ ${Number(dashboard?.totalRevenue || 0).toFixed(2)}`,
            },
            { title: "Orders", value: dashboard?.totalOrders },
            { title: "Customer", value: dashboard?.totalCustomers },
          ].map((item, index) => (
            <View key={index} style={styles.coopdashboardSummaryCard}>
              <Text style={styles.coopdashboardSummaryTitle}>{item.title}</Text>
              <Text style={styles.coopdashboardSummaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Order Status Breakdown */}
        <PieChart
          data={orderStatusData}
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

        {/* Sales Overview */}
        <View style={styles.coopdashboardSalesContainer}>
          <View style={styles.coopdashboardHeader}>
            <Text style={styles.coopdashboardSalesTitle}>Sales Overview</Text>
            <Picker
              selectedValue={selectedRange}
              style={styles.coopdashboardPicker}
              onValueChange={(itemValue) => setSelectedRange(itemValue)}
            >
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Monthly" value="monthly" />
              <Picker.Item label="Yearly" value="yearly" />
            </Picker>
          </View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
              color: "#333",
            }}
          >
            Sales (
            {selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)})
          </Text>

          <BarChart
            data={filteredChartData}
            width={300}
            height={240}
            yAxisLabel="₱"
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(204, 153, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.6,
              propsForBackgroundLines: {
                strokeDasharray: "", // solid lines
                stroke: "#e3e3e3",
              },
            }}
            style={{
              borderRadius: 16,
              elevation: 3, // Android shadow
              shadowColor: "#000", // iOS shadow
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              backgroundColor: "#fff",
            }}
          />
        </View>

        {/* Inventory Overview */}
        <View style={styles.invContainer}>
          <View style={styles.coopdashboardHeader}>
            <Text style={styles.coopdashboardSalesTitle}>
              Inventory Overview
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

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload()}
            >
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
                    <Text style={[styles.cell, styles.cellHeader]}>
                      Delivered
                    </Text>
                    <Text style={[styles.cell, styles.cellHeader]}>
                      Current
                    </Text>
                  </View>

                  {/* Render variations of the product */}
                  {product?.variations?.map((variation, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={styles.cell}>{variation.unitName}</Text>
                      <Text style={styles.cell}>{variation.metricUnit}</Text>
                      <Text style={styles.cell}>
                        {variation.quantityDelivered}
                      </Text>
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
              Top 5 Selling Products
            </Text>
            {dashboard.topSellingProducts.map((product, index) => (
              <Fragment key={index}>
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
              </Fragment>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FarmerDashboard;
