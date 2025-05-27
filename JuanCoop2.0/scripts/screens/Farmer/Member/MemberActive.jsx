import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { memberList } from "@redux/Actions/memberActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const MemberActive = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const [refreshing, setRefreshing] = useState(false);
  const { loading, members, error } = useSelector((state) => state.memberList);
  const [selectedTab, setSelectedTab] = useState("MApproved");
  const [token, setToken] = useState(null);

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(memberList(userId, token));
    }, [userId, token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(memberList(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token]);

  const choicesTab = [
    { label: "Pending", value: "MPending" },
    { label: "Approved", value: "MApproved" },
  ];

  return (
    <View style={styles.container}>
      <SelectedTab
        selectedTab={selectedTab}
        tabs={choicesTab}
        onTabChange={setSelectedTab}
      />

      {/* Content */}
      {loading ? (
        <Loader />
      ) : members?.length === 0 || error ? (
        <NoItem title={"members"} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={
            !members || members.length === 0
              ? styles.centering
              : styles.listContainer
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image
                source={{
                  uri:
                    item?.userId?.image?.url ||
                    "https://via.placeholder.com/150", 
                }}
                style={styles.profileImage}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {item?.userId?.firstName} {item?.userId?.lastName}
                </Text>
                <Text style={styles.userEmail}>{item?.userId?.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MemberSingle", { member: item })
                }
              >
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default MemberActive;
