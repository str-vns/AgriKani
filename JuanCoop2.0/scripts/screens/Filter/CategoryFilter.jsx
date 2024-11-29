import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import FooterNav from "../../../components/footer";
import Feather from "@expo/vector-icons/Feather";
import { DrawerActions, useNavigation } from "@react-navigation/native"; 
import styles from "../../../components/styles";
import { useSelector } from "react-redux";

const CategoryFilter = (props) => {
  const navigation = useNavigation();
  const { products, error } = useSelector(state => state.allProducts);
  const { item } = props;

  const categoryHandler = (valId) => {
    const filteredProducts = products.filter((item) => 
  item.category.some((categoryId) => categoryId === valId)
  );
    navigation.navigate('SearchProduct', { productFilter: filteredProducts });
  }

    return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
            <TouchableOpacity style={styles.categoryBox} onPress={() => categoryHandler(item?._id)} >
              <Image
                source={{ uri: item?.image?.url || "https://img.icons8.com/color/452/fruit.png" }}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryText}  ellipsizeMode="tail" numberOfLines={1} >{item?.categoryName}</Text>
            </TouchableOpacity>
         
        </ScrollView>

    )
}

export default CategoryFilter;  