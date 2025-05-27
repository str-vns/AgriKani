import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { singleDriver } from "@redux/Actions/driverActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { removeDriver } from "@redux/Actions/driverActions";
import { Alert } from "react-native";
import { SelectedTab } from "@shared/SelectedTab";
import styles from "@stylesheets/Rider/Riderlist";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const Riderlist = () => {
  const context = useContext(AuthGlobal);
  const userId = context.stateUser?.userProfile?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("Rider");

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(singleDriver(userId, token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token, userId])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(singleDriver(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  const handleDelete = async (driverId) => {
    Alert.alert(
      "Delete Driver",
      "Are you sure you want to delete this driver?",
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
              dispatch(removeDriver(driverId, token));
              console.log("Driver deleted successfully");
              onRefresh();
            } catch (error) {
              console.error("Error deleting driver: ", error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.riderContainer}>
      <Image
        source={{
          uri: item.image?.url
            ? item.image.url
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
        }}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-outline" color="red" size={20} />
          </TouchableOpacity>
        </View>
        <Text>
          Approved:{" "}
          <Text style={{ color: item.approvedAt ? "green" : "red" }}>
            {item.approvedAt ? " Approved" : " Not Approved"}
          </Text>
        </Text>

        <Text>
          Available:{" "}
          <Text style={{ color: item?.isAvailable ? "green" : "red" }}>
            {item?.isAvailable ? "Available" : "Unavailable"}
          </Text>
        </Text>
        {item.approvedAt ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => navigation.navigate("Assign", { driver: item })}
            >
              <Text style={styles.assignButtonText}>Assigned</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.assignButton}
              onPress={() =>
                navigation.navigate("RiderDetails", { driver: item })
              }
            >
              <Text style={styles.assignButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );

  const choicesTab = [
    { label: "Assign", value: "Assign" },
    { label: "Rider", value: "Rider" },
  ]

  return (
    <View style={styles.container}>
      <SelectedTab selectedTab={activeTab} tabs={choicesTab} onTabChange={setActiveTab} />
      {loading ? (
        <Loader />
      ) : drivers?.length === 0 || error ? (
        <NoItem title ="Riders"  />
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default Riderlist;

