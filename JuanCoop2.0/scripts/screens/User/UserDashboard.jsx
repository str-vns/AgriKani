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

const UserDashboard = () => {
  const navigation = useNavigation();

  const categories = [
    { name: "Fruits", icon: "https://img.icons8.com/color/452/fruit.png" },
    { name: "Meats", icon: "https://img.icons8.com/color/452/meat.png" },
    { name: "Juice", icon: "https://img.icons8.com/color/452/juice.png" },
    { name: "Bakery", icon: "https://img.icons8.com/color/452/bakery.png" },
    { name: "Seafood", icon: "https://img.icons8.com/color/452/fish.png" },
  ];

  const products = [
    {
      name: "Avocado",
      price: "$10.00",
      discount: "10% off",
      icon: "https://img.icons8.com/color/452/avocado.png",
    },
    {
      name: "Orange",
      price: "$12.00",
      discount: "10% off",
      icon: "https://img.icons8.com/color/452/orange.png",
    },
    {
      name: "Pomegranate",
      price: "$15.00",
      discount: "5% off",
      icon: "https://img.icons8.com/color/452/pomegranate.png",
    },
    {
      name: "Peach",
      price: "$8.00",
      discount: "8% off",
      icon: "https://img.icons8.com/color/452/peach.png",
    },
  ];

  return (
    // <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.burgerIconContainer}
          >
            <Feather name="menu" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Hi, Alexandra</Text>
        </View>

        <View style={styles.searchContainer}>
          {/* Search input for typing, no navigation */}
          <TextInput
            style={styles.searchBar}
            placeholder="Any food search here"
            placeholderTextColor="#999"
            onChangeText={(text) => console.log(text)} // Replace with actual search functionality if needed
          />

          {/* Separate TouchableOpacity for the filter icon */}
          <TouchableOpacity
            style={styles.filterIconWrapper}
            onPress={() => navigation.navigate("UserFilter")} // Navigate to FilterScreen when the icon is pressed
          >
            <Icon
              name="filter-list"
              size={28}
              color="black"
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Categories Section */}
        <Text style={styles.sectionTitle}>All Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryBox}>
              <Image
                source={{ uri: category.icon }}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Products Section */}
        <Text style={styles.sectionTitle}>Top Products</Text>
        <View style={styles.productContainer}>
          {products.map((product, index) => (
            <View key={index} style={styles.productBox}>
              <TouchableOpacity style={styles.wishlistIcon}>
                <Icon name="favorite" size={20} color="#ff6961" />
              </TouchableOpacity>
              <Image
                source={{ uri: product.icon }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Text style={styles.productDiscount}>{product.discount}</Text>
              <TouchableOpacity style={styles.plusIcon}>
                <Icon
                  name="add"
                  size={14}
                  color="#fff"
                  onPress={() => navigation.navigate("SingleProduct")}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>


  );
};

export default UserDashboard;