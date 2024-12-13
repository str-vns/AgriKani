import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hook to access navigation
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "@redux/Actions/Auth.actions";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "@redux/Actions/productActions";
import { getBlog } from "@redux/Actions/blogActions";
import { useSocket } from "@SocketIo";
import { ScrollView } from "react-native-gesture-handler";

const UserSidebar = () => {
  const socket = useSocket();
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const [token, setToken] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state.userOnly);
  const userslogin = context.stateUser?.userProfile || null;;
  const userId = context?.stateUser?.userProfile?._id;
  const [loadings, setLoadings] = useState(true);

     useEffect(() => {
  
       const initialize = async () => {
         await context.dispatch(isLogin(context.dispatch));
         setLoadings(false);
       };
   
       initialize();
     }, []);

  const userItems = [
    { label: "Home", icon: "home-outline", key: "home" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Address", icon: "location-outline", key: "address" },
    { label: "Messages", icon: "chatbubble-outline", key: "messages" },
    {
      label: "Notifications",
      icon: "notifications-outline",
      key: "notifications",
    },
    { label: "Directions", icon: "navigate-outline", key: "CoopDistance" },
    { label: "Track Order", icon: "location-outline", key: "track-order" },
    { label: "Tutorial", icon: "book-outline", key: "tutorial" },
    { label: "About Us", icon: "information-circle-outline", key: "about-us" },
  ];

  const CoopItems = [
    { label: "Dashboard", icon: "analytics-outline", key: "dashboard" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Product", icon: "cube-outline", key: "product" },
    { label: "Messages", icon: "chatbubble-outline", key: "messages" },
    {
      label: "Product Archive",
      icon: "archive-outline",
      key: "productArchive",
    },
    { label: "News", icon: "newspaper-outline", key: "news" },
    { label: "Community Forum", icon: "create-outline", key: "Forum" },
    { label: "Orders", icon: "clipboard-outline", key: "orders" },
  ];

  const AdminItems = [
    { label: "Dashboard", icon: "analytics-outline", key: "dashboard" },
    { label: "User", icon: "person-circle-outline", key: "user" }, //
    { label: "Cooperative", icon: "storefront-outline", key: "coop" },
    { label: "News", icon: "newspaper-outline", key: "news" }, //how to declare this
    { label: "Community", icon: "people-outline", key: "community" },
  ];

  const NoItems = [
    { label: "Home", icon: "home-outline", key: "home" },
    { label: "Distance", icon: "navigate-outline", key: "CoopDistance" },
    { label: "Tutorial", icon: "book-outline", key: "tutorial" },
    { label: "About Us", icon: "information-circle-outline", key: "about-us" },
  ];

  const handlePress = (key) => {
    setActiveItem(key);

    if (key === "home") {
      navigation.navigate("Home", { screen: "ProductContainer" });
    } else if (key === "profile") {
      navigation.navigate("Profile");
    } else if (key === "messages") {
      navigation.navigate("Messages");
    } else if (key === "address") {
      navigation.navigate("UserAddress");
    } else if (key === "track-order") {
      navigation.navigate("UserOrderList");
    } else if (key === "CoopDistance") {
      navigation.navigate("Home", { screen: "CoopDistance" });
    }
  };

  const NoPress = (key) => {
    setActiveItem(key);

    if (key === "home") {
      navigation.navigate("Home", { screen: "ProductContainer" });
    } else if (key === "CoopDistance") {
      navigation.navigate("Home", { screen: "CoopDistance" });
    }
  };

  const CoopPress = (key) => {
    setActiveItem(key);

    // Navigate to the appropriate screen
    if (key === "dashboard") {
      navigation.navigate("CoopDashboard");
    } else if (key === "profile") {
      navigation.navigate("Profile");
    } else if (key === "messages") {
      navigation.navigate("Messaging");
    } else if (key === "productArchive") {
      navigation.navigate("productArchive");
    } else if (key === "product") {
      navigation.navigate("ProductsList");
    } else if (key === "news") {
      navigation.navigate("BlogLists");
    } else if (key === "Forum") {
      navigation.navigate("CommunityForum");
    } else if (key === "orders") {
      navigation.navigate("OrderList");
    }
    // Add other navigation conditions for different items
  };

  const AdminPress = (key) => {
    setActiveItem(key);

    // Navigate to the appropriate screen
    if (key === "dashboard") {
      navigation.navigate("AdminDashboards");
    } else if (key === "user") {
      navigation.navigate("UserList");
    } else if (key === "coop") {
      navigation.navigate("CoopList");
    } else if (key === "news") {
      navigation.navigate("BlogList");
    } else if (key === "community") {
      navigation.navigate("PostList");
    } else if (key === "barGraph") {
      navigation.navigate("barGraph");
    }
  };

  const handleLogoutSocket = () => {
    console.log(`Client emitting removeUser with socket.id: ${socket?.id}`);
    socket.emit("removeUser", socket?.id);
    console.log("User disconnected from socket.");
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {context?.stateUser?.isAuthenticated &&
        userslogin?.roles &&
        userslogin?.roles.includes("Customer") &&
        userslogin?.roles.includes("Cooperative") ? (
          <>
            <Image
              source={{ uri: user?.image?.url }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileRole}>Cooperative</Text>
          </>
        ) : context?.stateUser?.isAuthenticated &&
        userslogin?.roles &&
          userslogin?.roles.includes("Customer") ? (
          <>
            <Image
              source={{ uri: user?.image?.url }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileRole}>User</Text>
          </>
        ) : context?.stateUser?.isAuthenticated &&
        userslogin?.roles &&
        userslogin?.roles.includes("Admin") ? (
          <Text style={styles.profileRole}>Admin</Text>
        ) : null}
      </View>

      {/* Menu Section */}

      {/* Logout Button */}
      {context?.stateUser &&
      context?.stateUser?.isAuthenticated &&
      userslogin?.roles[0] &&
      userslogin?.roles[0]?.includes("Customer") &&
      userslogin?.roles[1] &&
      userslogin?.roles[1]?.includes("Cooperative") ? (
        <>
          <ScrollView>
            <View style={styles.menuContainer}>
              {CoopItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.menuItem,
                    activeItem === item.key
                      ? { backgroundColor: "#fef8e5" }
                      : null,
                  ]}
                  onPress={() => CoopPress(item.key)}
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
          </ScrollView>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={() => {
                handleLogoutSocket();
                AsyncStorage.removeItem("jwt"), logoutUser(context.dispatch);
                navigation.navigate("Home");
                dispatch(getProduct());
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.logoutLabel}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : context?.stateUser &&
        context?.stateUser?.isAuthenticated &&
        userslogin?.roles[0] &&
        userslogin?.roles[0]?.includes("Customer") ? (
        <>
          <ScrollView>
          <View style={styles.menuContainer}>
            {userItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  activeItem === item.key
                    ? { backgroundColor: "#fef8e5" }
                    : null,
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
          </ScrollView>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={() => {
                handleLogoutSocket();
                AsyncStorage.removeItem("jwt"), logoutUser(context.dispatch);
                navigation.navigate("Home");
                dispatch(getProduct());
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.logoutLabel}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : context?.stateUser &&
        context?.stateUser?.isAuthenticated &&
        userslogin?.roles[0] &&
        userslogin?.roles[0]?.includes("Admin") ? (
        <>
          <View style={styles.menuContainer}>
            {AdminItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  activeItem === item.key
                    ? { backgroundColor: "#fef8e5" }
                    : null,
                ]}
                onPress={() => AdminPress(item.key)}
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
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={() => {
                handleLogoutSocket();
                AsyncStorage.removeItem("jwt"), logoutUser(context.dispatch);
                navigation.navigate("Home");
                dispatch(getProduct());
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.logoutLabel}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.menuContainer}>
            {NoItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  activeItem === item.key
                    ? { backgroundColor: "#fef8e5" }
                    : null,
                ]}
                onPress={() => NoPress(item.key)}
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

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={() => {
                navigation.navigate("RegisterScreen", { screen: "Login" });
              }}
            >
              <Ionicons name="log-in-outline" size={24} color="#fff" />
              <Text style={styles.logoutLabel}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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

export default UserSidebar;
