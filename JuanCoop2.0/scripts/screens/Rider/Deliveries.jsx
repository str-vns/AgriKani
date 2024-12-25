import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Deliveries = () => {
  const [activeTab, setActiveTab] = useState("Deliveries");
  const navigation = useNavigation();

  // Example data for deliveries and completed orders
  const deliveries = [
    { id: "1", name: "Alexandra C. Aquino", orderNumber: "190678934958" },
    { id: "2", name: "Angela C. Reyes", orderNumber: "190678934958" },
    { id: "3", name: "William", orderNumber: "190678934958" },
    { id: "4", name: "Nate", orderNumber: "190678934958" },
  ];

  const completedOrders = [
    { id: "1", name: "Nate", orderNumber: "190678934958", status: "Shipped" },
    { id: "2", name: "Henry", orderNumber: "190678934958", status: "Shipped" },
    {
      id: "3",
      name: "William",
      orderNumber: "190678934958",
      status: "Shipped",
    },
    { id: "4", name: "Henry", orderNumber: "190678934958", status: "Shipped" },
  ];

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.orderNumber}>Order # {item.orderNumber}</Text>
      </View>
      {activeTab === "Completed" ? (
        <Text style={styles.status}>{item.status}</Text>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.deliverButton}
           onPress={() => navigation.navigate("Location")}
          >
            <Text style={styles.buttonText}>Deliver now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate("Details")}
          >
            <Text style={styles.detailsText}>View Details</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Deliveries" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Deliveries")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Deliveries" && styles.activeTabText,
            ]}
          >
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Completed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={activeTab === "Deliveries" ? deliveries : completedOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#FFC107",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFC107",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  orderInfo: {
    flex: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "column", // Stack buttons vertically
    alignItems: "flex-end", // Align buttons to the right
  },
  deliverButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10, // Add space between buttons
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsText: {
    color: "#007BFF",
    fontSize: 14,
  },
});

export default Deliveries;
