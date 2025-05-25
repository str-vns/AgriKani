import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
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
  const screenWidth = Dimensions.get('window').width;

  const { overalldashboards: dashboard } = useSelector(
    (state) => state.overalldashboards || {}
  );

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
  const topCoops = dashboard?.topCoops || [];

  const topProductsData = rankedProducts.map((p) => ({
    name: p.productName || "Unknown",
    population: p.totalQuantitySold || 0,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={styles.container}>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Revenue</Text>
          <Text style={styles.statValue}>₱{dashboard?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Weekly Orders</Text>
          <Text style={styles.statValue}>{dashboard?.totalOrders || 0}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Daily Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.daily?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Weekly Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.weekly?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Monthly Sales</Text>
          <Text style={styles.statValue}>₱{salesTrends.monthly?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <View style={styles.chartsContainer}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Cooperatives</Text>
          {topCoops.length === 0 ? (
            <Text style={styles.noDataText}>No data available</Text>
          ) : (
            <View style={{ marginTop: 10 }}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>#</Text>
                <Text style={[styles.tableCell, { flex: 3, fontWeight: 'bold' }]}>Cooperative</Text>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Revenue (₱)</Text>
              </View>
              {topCoops
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map((coop, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, { flex: 3 }]}>{coop.coopName || 'Unknown'}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      ₱{(coop.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))}
            </View>
          )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEB99',
    paddingBottom: 10,
  },
  drawerButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    padding: 10,
    width: '45%',
    marginBottom: 10,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#000',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chartsContainer: {
    padding: 10,
  },
  chartCard: {
    backgroundColor: '#FFFAE5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFE082',
    paddingVertical: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#f0c14b',
  },
  tableCell: {
    fontSize: 14,
    paddingHorizontal: 5,
    color: '#000',
  },
});

export default Dashboard;