import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "./css/styles";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { getCoopProducts } from "@redux/Actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createConversation } from "@redux/Actions/converstationActions";

const FarmerProfile = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const cooperative = props.route.params.coop;
  const userItem = props.route.params.coop.user;
  const userId = context?.stateUser?.userProfile?._id;
  const { loading, coopProducts, error } = useSelector((state) => state.CoopProduct);
  const { success } = useSelector((state) => state.createConversation);
  const { conversations } = useSelector((state) => state.converList);
  const existConvo = conversations.find(
    (convo) =>
      convo.members.includes(cooperative.user?._id) &&
      convo.members.includes(userId)
  );
  console.log(success)
  const [token, setToken] = useState(null);
  const conversationExists = Boolean(existConvo);

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
      dispatch(getCoopProducts(cooperative?._id));
    }, [])
  );

const chatNow = async () => {
  const cooperativeUserId = cooperative.user?._id;
  const currentUserId = userId;

 
      if (context?.stateUser?.isAuthenticated ) {
    try {
      if (conversationExists && existConvo) {
        navigation.navigate("ChatMessages", {
          item: userItem, 
          conversations: conversations,
        });
      } else {
        const newConvo = {
          senderId: currentUserId,
          receiverId: cooperativeUserId,
        };

        dispatch(createConversation(newConvo, token)); 
        navigation.navigate("Messages")
        
      }
    } catch (error) {
      console.error("Error while creating or navigating to conversation:", error);
    }
  } else {
    navigation.navigate("Login");
  }
};

  const renderProductItem = ({ item }) => (
    <View style={styles.prodCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SingleProduct", { item })}
      >
        {Array.isArray(item?.image) && item.image.length > 0 ? (
          <Image source={{ uri: item.image[0].url }} style={styles.prodImage} />
        ) : (
          <Text>No Image</Text>
        )}
        <Text style={styles.prodName}>{item.productName}</Text>
        <Text style={styles.prodDescription}>{item.description}</Text>
        <View style={styles.prodpriceContainer}>
          <Text style={styles.prodprice}>{item.pricing}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProfileHeader = () => (
    <View style={styles.profileContainer}>
      {cooperative?.user?.image?.url ? (
        <Image
          source={{ uri: cooperative.user.image.url }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require("@assets/img/farmer.png")}
          style={styles.profileImage}
        />
      )}
      <Text style={styles.profileName}>{cooperative.farmName}</Text>
      <Text style={styles.profileFollowing}>100 Following</Text>
      <TouchableOpacity style={styles.editProfile} onPress={() => chatNow()}>
        <Text style={styles.editProfile}>Chat Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderProfileHeader}
      data={coopProducts}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={renderProductItem}
      numColumns={2}
      columnWrapperStyle={styles.prodrow}
      contentContainerStyle={styles.prodList}
    />
  );
};

export default FarmerProfile;
