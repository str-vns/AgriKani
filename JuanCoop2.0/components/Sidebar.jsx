import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { useNavigation } from "@react-navigation/native"; // Hook to access navigation

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation(); // Hook to use navigation

  const menuItems = [
    { label: "Home", icon: "home-outline", key: "home" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Messages", icon: "chatbubble-outline", key: "messages" },
    {
      label: "Notifications",
      icon: "notifications-outline",
      key: "notifications",
    },
    { label: "Track Order", icon: "location-outline", key: "track-order" },
    { label: "Tutorial", icon: "book-outline", key: "tutorial" },
    { label: "About Us", icon: "information-circle-outline", key: "about-us" },
  ];

  const handlePress = (key) => {
    setActiveItem(key);

    // Navigate to the appropriate screen
    if (key === "home") {
      navigation.navigate("Home");
    } else if (key === "profile") {
      navigation.navigate("Profile");
    } else if (key === "messages") {
      navigation.navigate("Chat List");
    }  else if (key === "track-order") {
      navigation.navigate("Order List");
    } else if (key === "tutorial") {
      navigation.navigate("Tutorial");
    }
    

    // Add other navigation conditions for different items
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/img/farmer1.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Alexandra Aquino</Text>
        <Text style={styles.profileRole}>User</Text>
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
    justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
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
    paddingVertical: 15,
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

export default Sidebar;
