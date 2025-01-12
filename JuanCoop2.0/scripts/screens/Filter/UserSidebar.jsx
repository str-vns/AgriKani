import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "@screens/stylesheets/Filter/UserSidebar"
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "@redux/Actions/Auth.actions";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "@redux/Actions/productActions";
import { useSocket } from "@SocketIo";
import { ScrollView } from "react-native-gesture-handler";

const UserSidebar = () => {
  const socket = useSocket();
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userOnly);
  const userslogin = context.stateUser?.userProfile || null;
  const [ setLoadings ] = useState(true);

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
    { label: "Notifications",  icon: "notifications-outline", key: "notifications", },
    { label: "Directions", icon: "navigate-outline", key: "CoopDistance" },
    context.stateUser?.userProfile?.roles?.includes("Customer") && 
    context.stateUser?.userProfile?.roles?.includes("Member") ? 
    { label: "Community Forum", icon: "create-outline", key: "Forum" } : null,
    { label: "Track Order", icon: "location-outline", key: "track-order" },
    { label: "Tutorial", icon: "book-outline", key: "tutorial" },
    { label: "About Us", icon: "information-circle-outline", key: "about-us" },
  ].filter(item => item !== null);

  const CoopItems = [
    { label: "Dashboard", icon: "analytics-outline", key: "dashboard" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "Product", icon: "cube-outline", key: "product" },
    { label: "Orders", icon: "clipboard-outline", key: "orders" },
    { label: "Messages", icon: "chatbubble-outline", key: "messages" },
    { label: "Notifications", icon: "notifications-outline", key: "notifications" },
    { label: "Rider", icon: "car-outline", key: "rider" },
    { label: "Members", icon: "people-outline", key: "members" },
    { label: "News", icon: "newspaper-outline", key: "news" },
    { label: "Community Forum", icon: "create-outline", key: "Forum" },
    { label: "Product Archive", icon: "archive-outline", key: "productArchive" },
   
  ]

  const AdminItems = [
    { label: "Dashboard", icon: "analytics-outline", key: "dashboard" },
    { label: "User", icon: "person-circle-outline", key: "user" }, //
    { label: "Cooperative", icon: "storefront-outline", key: "coop" },
    { label: "Driver", icon: "car-outline", key: "driver" },
    { label: "News", icon: "newspaper-outline", key: "news" }, 
    { label: "Community", icon: "people-outline", key: "community" },
    { label: "Categories", icon: "list-outline", key: "category" },
    { label: "Types", icon: "layers-outline", key: "types" },
    
  ];

  const NoItems = [
    { label: "Home", icon: "home-outline", key: "home" },
    { label: "Distance", icon: "navigate-outline", key: "CoopDistance" },
    { label: "Tutorial", icon: "book-outline", key: "tutorial" },
    { label: "About Us", icon: "information-circle-outline", key: "about-us" },
  ];

  const DriverItems = [
    { label: "Deliveries", icon: "cube-outline", key: "deliveries" },
    { label: "Profile", icon: "person-outline", key: "profile" },
    { label: "History", icon: "time-outline", key: "history" },
  ]

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
    } else if (key === "notifications"){
      navigation.navigate("Home", { screen: "NotificationList" })
    } else if (key === "Forum") {
      navigation.navigate("CommunityForum");
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
      navigation.navigate("BlogList");
    } else if (key === "Forum") {
      navigation.navigate("CommunityForum");
    } else if (key === "orders") {
      navigation.navigate("OrderList");
    } else if (key === "notifications"){
      navigation.navigate( "FNotificationList" )
    } else if (key === "members"){
      navigation.navigate( "MemberList" )
    } else if (key === "rider"){
      navigation.navigate( "Riderlist" )
    }
    

    // Add other navigation conditions for different items
  };

  const AdminPress = (key) => {
    setActiveItem(key);

    if (key === "dashboard") {
      navigation.navigate("AdminDashboards");
    } else if (key === "user") {
      navigation.navigate("UserList");
    } else if (key === "coop") {
      navigation.navigate("CoopList");
    } else if (key === "news") {
      navigation.navigate("BlogList");
    } else if (key === "driver") {
      navigation.navigate("DriverList");
    } else if (key === "community") {
      navigation.navigate("PostList");
    } else if (key === "barGraph") {
      navigation.navigate("barGraph");
    }else if (key === "category") {
      navigation.navigate("CategoryList");
    }else if (key === "types") {
      navigation.navigate("TypeList");
    }
  };

  const DriverPress = (key) => {
    setActiveItem(key);

    if (key === "deliveries") {
      navigation.navigate("Deliveries");
    } else if (key === "profile") {
      navigation.navigate("Profile");
    } else if (key === "history") {
      navigation.navigate("History");
    }
  }

  const handleLogoutSocket = () => {
    console.log(`Client emitting removeUser with socket.id: ${socket?.id}`);
    socket.emit("removeUser", socket?.id);
    console.log("User disconnected from socket.");
  };

  return (
    <View style={styles.container}>
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
        ) : 
        context?.stateUser?.isAuthenticated &&
        userslogin?.roles &&
        userslogin?.roles.includes("Driver") ? (
        <>
          <Image
            source={{ uri: user?.image?.url }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.profileRole}>Driver</Text>
        </>
      ) : null}
      </View>

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
      ) : context?.stateUser &&
      context?.stateUser?.isAuthenticated &&
      userslogin?.roles[0] &&
      userslogin?.roles[0]?.includes("Driver") ? (
      <>
        <View style={styles.menuContainer}>
          {DriverItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                activeItem === item.key
                  ? { backgroundColor: "#fef8e5" }
                  : null,
              ]}
              onPress={() => DriverPress(item.key)}
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

export default UserSidebar;
