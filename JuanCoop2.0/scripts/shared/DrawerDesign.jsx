import React, { Fragment, useState } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import styles from "@screens/stylesheets/Shared/Drawer/styles";
import { isWeather } from "@utils/weahterData";
import { updateAvailability } from "@redux/Actions/driverActions";
import { useSelector } from "react-redux";

export const handleBackPress = (navigation, onBack) => {
  if (!onBack) {
    navigation.goBack();
  } else {
    navigation.navigate(onBack);
  }
};

export const DrawerDesign = (props) => {
  const { title, isDelivery } = props;
  const { Profileloading, Profiledriver, ProfileError } = useSelector(
    (state) => state.driverProfile
  );
  const navigation = useNavigation();

  const handleChange = () => {
    Alert.alert(
      "Update Availability",
      "Are you sure you want to update your availability status?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              dispatch(updateAvailability(userId, token));
              setTimeout(() => {
                onRefresh();
              }, 1000);
              console.log("Availability updated successfully");
            } catch (error) {
              console.error("Error updating availability: ", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.burgerIconContainer}
      >
        <Feather name="menu" size={28} color="black" />
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>

      {isDelivery && (
        <View style={styles.onlinePickerContainer}>
          {Profileloading ? (
            <View
              style={[
                styles.circle,
                { backgroundColor: "gray", marginRight: 12 },
              ]}
            />
          ) : (
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: Profiledriver?.isAvailable
                    ? "green"
                    : "gray",
                  marginRight: 12,
                },
              ]}
            />
          )}
          <Picker
            selectedValue={Profiledriver?.isAvailable ? "true" : "false"}
            onValueChange={handleChange}
            style={styles.picker}
          >
            <Picker.Item
              label="Update Availability Status"
              value=""
              enabled={false}
            />
            {Profiledriver?.isAvailable ? (
              <Picker.Item label="Not Available" value="false" />
            ) : (
              <Picker.Item label="Available" value="true" />
            )}
          </Picker>
        </View>
      )}
    </View>
  );
};

export const BackButton = (props) => {
  const { title, onBack } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => handleBackPress(navigation, onBack)}
        style={styles.burgerIconContainer}
      >
        <Text style={{ color: "#333" }}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export const MessageBackButton = (props) => {
  const { onBack, item } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => handleBackPress(navigation, onBack)}
        style={styles.burgerIconContainer}
      >
        <Text style={{ color: "#333" }}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <View style={styles.backMessageContainer}>
        <Image
          source={{
            uri:
              item?.image?.url ||
              "https://as2.ftcdn.net/v2/jpg/02/48/15/85/1000_F_248158543_jK3q4R8EQh0AhRtjp5n6CLXGpa0lxJvX.jpg",
          }}
          style={styles.backMessageImage}
        />
        <Text style={styles.backMessageText}>
          {item?.firstName} {item?.lastName}
        </Text>
      </View>
    </View>
  );
};

export const CartBackButton = (props) => {
  const { title, onBack } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.header.shoppingHeader}>
      <TouchableOpacity
        onPress={() => handleBackPress(navigation, onBack)}
        style={styles.burgerIconContainer}
      >
        <Text style={{ color: "#333" }}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Text>
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export const OrderConfirmationHeader = (props) => {
  const { title } = props;
  return (
    <View style={styles.header}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export const ListContainer = (props) => {
  const { title, isCreate, isScreen, item, onBack } = props;
  const navigation = useNavigation();
  const [isWeather, setIsWeather] = useState(false);
  console.log("isWeather", isWeather);  
  const handleCreate = () => {
    if (isScreen === "Inventory") {
      navigation.navigate("inventoryCreate", { item: item });
      return;
    } else if (isScreen === "Product") {
      {
        navigation.navigate("ProductsCreate");
        return;
      }
    } else if (isScreen === "Rider") {
      navigation.navigate("Register");
      return;
    } else if (isScreen === "Assign History") {
      navigation.navigate("AssignHistory", { item: item });
      return;
    } else if (isScreen === "BlogList") {
      navigation.navigate("BlogCreate");
      return;
    } else if (isScreen === "CategoryList") {
      navigation.navigate("CategoryCreate");
      return;
    } else if (isScreen === "TypeList") {
      navigation.navigate("TypeCreate");
      return;
    } 
  };

  return (
    <View style={styles.header}>
      {isScreen === "Inventory" ? (
        <TouchableOpacity
          onPress={() => handleBackPress(navigation, onBack)}
          style={styles.burgerIconContainer}
        >
          <Text style={{ color: "#333" }}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.burgerIconContainer}
        >
          <Feather name="menu" size={28} color="black" />
        </TouchableOpacity>
      )}

      <Text style={styles.titleText}>{title}</Text>

      {isCreate && (
        <View style={styles.onlinePickerContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleCreate()}
          >
            {isScreen === "Assign History" ? (
              <Ionicons name="time-outline" size={28} color="black" />
            ) : isScreen === "CoopDash" ? (
              <TouchableOpacity
                onPress={() =>
                 { 
                   navigation.navigate("CoopDashboard", { isModal: true });
                }}
              >
                <Ionicons name="cloud" size={28} color="#EDC001" />
              </TouchableOpacity>
            ) : (
              <Ionicons name="add" size={28} color="black" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
