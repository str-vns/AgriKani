import React from "react";
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
import { DrawerActions, useNavigation } from "@react-navigation/native"; // For drawer navigation
import styles from "../../../components/styles";
import ProductCard from "./ProductCard";

const ProductList = (props) => {
  const { item } = props;
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("SingleProduct", { item: item })}>
      <View>
        <ProductCard {...item} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductList;
