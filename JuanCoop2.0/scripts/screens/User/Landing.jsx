import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation, DrawerActions, } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

const services = [
  {
    id: "1",
    title: "Online Payment & COD",
    description: "Flexible and secure payment options, including Cash on Delivery.",
    image: require("@assets/img/1.png"),
  },
  {
    id: "2",
    title: "Real-Time Order Tracking",
    description: "Know exactly where your order is at every stage.",
    image: require("@assets/img/3.png"),
  },
  {
    id: "3",
    title: "Product Management Tools",
    description: "Easily manage product listings and inventory.",
    image: require("@assets/img/4.png"),
  },
  {
    id: "4",
    title: "Smart Reviews & Insights",
    description: "Understand customer feedback through sentiment analysis.",
    image: require("@assets/img/5.png"),
  },
  {
    id: "5",
    title: "Community Forum",
    description: "Share tips, strategies, and connect with other cooperatives.",
    image: require("@assets/img/6.png"),
  },
  {
    id: "6",
    title: "Business Analytics",
    description: "Use data to make smarter decisions and grow faster.",
    image: require("@assets/img/2.png"),
  },
];

const Landing = () => {
  const navigation = useNavigation();

  /* ------------- non-list helpers ------------- */
  const handleCall = () => Linking.openURL("tel:+91123456789");
  const handleStartShopping = () =>
    navigation.navigate("Home", { screen: "ProductContainer" });

  /* ------------- list item renderer ------------- */
  const renderService = ({ item }) => (
    <View style={styles.featureCard}>
      <Image source={item.image} style={styles.featureImage} />
      <Text style={styles.featureCardTitle}>{item.title}</Text>
      <Text style={styles.featureCardDescription}>{item.description}</Text>
    </View>
  );

  /* ------------- header (everything above the list) ------------- */
  const ListHeader = () => (
    <>
      {/* Header / burger icon */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.burgerIconContainer}
        >
          <Feather name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Hero */}
      <View style={styles.heroSection}>
        <Image source={require("@assets/images/logo.png")} style={styles.heroImage} />
        <Text style={styles.heroTitle}>JuanKooP</Text>
        <Text style={styles.heroSubtitle}>
          Empowering Cooperatives, Uniting Communities for Agricultural Success
        </Text>
        <TouchableOpacity style={styles.heroButton} onPress={handleStartShopping}>
          <Text style={styles.heroButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.title}>Built for Cooperatives</Text>
        <Text style={styles.description}>
          JuanKooP helps local cooperatives expand their reach, connect with more
          customers, and manage their business operations digitally — all in one
          platform.
        </Text>
        <Image source={require("@assets/img/9.png")} style={styles.image} />
      </View>

      {/* Section title for services */}
      <Text style={[styles.title, { marginBottom: 10 }]}>Our Services</Text>
    </>
  );
  return (
    <FlatList
      data={services}
      renderItem={renderService}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.featureRow}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  heroTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  heroButton: {
    marginTop: 10,
    backgroundColor: "#f7b900",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  heroButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 15,
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
  },
  infoBox: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
  },
  featureRow: {
  justifyContent: "space-between",
  marginBottom: 15,
},

featureCard: {
  backgroundColor: "#FFF",
  padding: 10,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
  width: "48%",
  alignItems: "center",
},

featureImage: {
  width: "100%",
  height: 100,
  borderRadius: 8,
  marginBottom: 8,
},

featureCardTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
},

featureCardDescription: {
  fontSize: 12,
  textAlign: "center",
  color: "#555",
},

});

export default Landing;