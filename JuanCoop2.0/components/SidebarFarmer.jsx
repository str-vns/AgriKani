import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { useNavigation } from "@react-navigation/native"; // Hook to access navigation

const SidebarFarmer = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation(); // Hook to use navigation

  const menuItems = [
    {label: "Home", icon: "home-outline", key: "dashboard" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Messages", icon: "chatbox-outline", key: "chat" },
    { label: "Product", icon: "pricetag", key: "product" },
    { label: "Order", icon: "cube", key: "order" }, 
    { label: "Government Initiatives", icon: "business", key: "initiatives" },
    { label: "Community Forum", icon: "people", key: "forum" },
    { label: "Reviews and Ratings", icon: "star", key: "rating" },  
    { label: "Settings", icon: "settings-outline", key: "settings" } 
  ];

  //   { name: 'Home', icon: 'home-outline', screen: 'FarmerDashboard' },
//     { name: 'Profile', icon: 'person-outline', screen: 'FarmerProfile' },
//     { name: 'Messages', icon: 'chatbox-outline', screen: 'ChatList' }, // Example, add this screen if it's defined
//     { name: 'Product', icon: 'pricetag', screen: 'ProductList' }, // Example, link to Product List screen
//     { name: 'Order', icon: 'cube', screen: 'OrderList' }, // Example
//     { name: 'Government Initiatives', icon: 'business', screen: 'GovernmentInitiatives' }, // Example
//     { name: 'Community Forum', icon: 'people', screen: 'CommunityForum' },
//     { name: 'Reviews and Ratings', icon: 'star', screen: 'RatingandReview' },  
//     { name: 'Settings', icon: 'settings-outline', screen: 'Settings' } // Example

  const handlePress = (key) => {
    setActiveItem(key);

    // Navigate to the appropriate screen
    if (key === "dashboard") {
      navigation.navigate("FarmerDashboard");
    } else if (key === "profile") {
      navigation.navigate("FarmerProfile");
    } else if (key === "chat") {
      navigation.navigate("ChatList");
    } else if (key === "product") {
      navigation.navigate("ProductList");
    } else if (key === "order") {
      navigation.navigate("OrderList");
    } else if (key === "initiatives") {
      navigation.navigate("GovernmentInitiatives");
    } else if (key === "forum") {
      navigation.navigate("CommunityForum");
    } else if (key === "rating") {
      navigation.navigate("RatingandReview");
    } else if (key === "settings") {
      navigation.navigate("Settings");
    } 
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/img/buyer.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Princess Romero</Text>
        <Text style={styles.profileRole}>Farmer</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuItem,
              activeItem === item.key ? { backgroundColor: "#fef8e5" } : null,
            ]}
            onPress={() => handlePress(item.key)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={activeItem === item.key ? "#000" : "#666"}
            />
            <Text
              style={[
                styles.menuLabel,
                activeItem === item.key ? styles.activeLabel : null,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={() => {
            navigation.navigate("start");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 15,
  },
  activeLabel: {
    color: "#000", // Make the text black when active
  },
  footerContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#f7b900",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutLabel: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 15,
  },
});

export default SidebarFarmer;