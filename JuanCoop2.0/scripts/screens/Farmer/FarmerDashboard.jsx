import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Fragment,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  weatherDailyActions,
  weatherCurrentActions,
} from "@redux/Actions/weatherActions";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect, } from "@react-navigation/native";
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
import { WeatherModalContent } from "../../utils/weahterData";

const FarmerDashboard = ({ route }) => {
  const dispatch = useDispatch();
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
  const InventoryInfo = Invsuccess?.details;
  const { coop } = useSelector((state) => state.singleCoop);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(weatherCurrentActions());
      dispatch(weatherDailyActions());
      if (route.params?.isModal) {
        setWeatherModalVisible(true);
      }
      if (!socket) {
        console.warn("Socket is not initialized.");
        return;
      }

      if (userId) {
        socket.emit("addUser", userId);
      } else {
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
    }, [socket, userId, route.params])
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
      }, 4000);

      return () => clearInterval(interval);
    }

    return () => {};
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
        return "day"; 
      case "monthly":
        return "month"; 
      case "yearly":
        return "year"; 
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
        <li>Total Revenue: ₱${dashboard?.totalRevenue?.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</li>
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
      <h2>Sales Data (${
        selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)
      })</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>${
              selectedRange === "daily"
                ? "Date"
                : selectedRange === "monthly"
                ? "Month"
                : "Year"
            }</th>
            <th>Total Sales (₱)</th>
          </tr>
        </thead>
        <tbody>
          ${labels
            .map(
              (label, index) => `
                <tr>
                  <td>${label}</td>
                  <td>₱${data[index]?.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</td>
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
      <WeatherModalContent
        weatherModalVisible={weatherModalVisible}
        onClose={() => setWeatherModalVisible(false)}
        weatherCurrent={weatherCurrent}
        weatherDaily={weatherDaily}
        loadingWCurrent={loadingWCurrent}
        loadingWDaily={loadingWDaily}
        errorWCurrent={errorWCurrent}
        errorWDaily={errorWDaily}
      />

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
