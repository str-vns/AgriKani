import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import { useNavigation } from "@react-navigation/native"; // Navigation hook

const SidebarA = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isUsersExpanded, setUsersExpanded] = useState(false); // State to manage submenu visibility
  const navigation = useNavigation(); // Hook for navigation

  const menuItems = [
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Dashboard", icon: "speedometer-outline", key: "dashboard" },
    {
      label: "Users",
      icon: "people-outline",
      key: "users",
      hasSubMenu: true, // Indicate that this has a submenu
      subMenu: [
        { label: "Farmers", icon: "leaf-outline", key: "farmers" },
        { label: "Buyers", icon: "cart-outline", key: "buyers" },
      ],
    },
    { label: "Community Forum", icon: "chatbubbles-outline", key: "community-forum" },
  ];

  const handlePress = (key) => {
    setActiveItem(key);

    // Navigate based on the selected menu item
    if (key === "profile") {
      navigation.navigate("Profile");
    } else if (key === "dashboard") {
      navigation.navigate("Dashboard");
    } else if (key === "farmers") {
      navigation.navigate("Farmers");
    } else if (key === "buyers") {
      navigation.navigate("Buyers");
    } else if (key === "community-forum") {
      navigation.navigate("Community Forum");
    }
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
          <View key={item.key}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                activeItem === item.key ? { backgroundColor: "#fef8e5" } : null,
              ]}
              onPress={() => {
                if (item.hasSubMenu) {
                  setUsersExpanded(!isUsersExpanded);
                } else {
                  handlePress(item.key);
                }
              }}
            >
              <Ionicons
                name={item.icon}
                size={28} // Bigger icon size
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
              {/* Dropdown Icon for Users */}
              {item.hasSubMenu && (
                <Ionicons
                  name={isUsersExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                  size={24}
                  color="#666"
                  style={styles.dropdownIcon}
                />
              )}
            </TouchableOpacity>

            {/* Render Submenu for Users */}
            {item.subMenu && isUsersExpanded && (
              <View style={styles.subMenuContainer}>
                {item.subMenu.map((subItem) => (
                  <TouchableOpacity
                    key={subItem.key}
                    style={styles.subMenuItem}
                    onPress={() => handlePress(subItem.key)}
                  >
                    <Ionicons name={subItem.icon} size={24} color="#666" />
                    <Text
                      style={[
                        styles.subMenuLabel,
                        activeItem === subItem.key ? styles.activeSubLabel : null,
                      ]}
                    >
                      {subItem.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
  dropdownIcon: {
    marginLeft: "auto", // Align the dropdown icon to the right
  },
  subMenuContainer: {
    paddingLeft: 30,
    marginTop: 5,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  subMenuLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 15,
  },
});

export default SidebarA;
