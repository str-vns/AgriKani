import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";

// Assets
import AlexImage from "@assets/img/alex.jpg";
import MelgieImage from "@assets/img/melgie.jpg";
import StevensImage from "@assets/img/stevens.jpg";
import PrincessImage from "@assets/img/princess.jpg";

// Carousel Dimensions
const screenWidth = Dimensions.get("window").width;

const creators = [
  { name: "Alex", image: AlexImage },
  { name: "Melgie", image: MelgieImage },
  { name: "Stevens", image: StevensImage },
  { name: "Princess", image: PrincessImage },
];

const processImages = [
  require("@assets/img/one.jpg"),
  require("@assets/img/two.jpg"),
  require("@assets/img/three.jpg"),
  require("@assets/img/four.jpg"),
  require("@assets/img/five.jpg"),
  require("@assets/img/six.jpg"),
  require("@assets/img/seven.jpg"),
  require("@assets/img/eight.jpg"),
  require("@assets/img/nine.jpg"),
];

const cooperativeLogos = [
  require("@assets/img/a.jpg"),
  require("@assets/img/b.jpg"),
  require("@assets/img/c.jpg"),
  require("@assets/img/d.jpg"),
  require("@assets/img/e.jpg"),
  require("@assets/img/f.jpg"),
  require("@assets/img/g.jpg"),
  require("@assets/img/h.jpg"),
  require("@assets/img/i.jpg"),
  require("@assets/img/j.jpg"),
];

const Landing = () => {
  const navigation = useNavigation();

  const handleStartShopping = () => {
    navigation.navigate("Home", { screen: "ProductContainer" });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require("@assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>JuanKooP</Text>
        <Text style={styles.subtitle}>
          Empowering Cooperatives, Uniting Communities for Agricultural Success
        </Text>
      </View>

      {/* Teaser Video */}
      <Text style={styles.sectionTitle}>Featured Product Teaser</Text>
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: "https://www.youtube.com/embed/1WZ4CEtPixc" }}
          style={styles.video}
        />
      </View>

      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaButton} onPress={handleStartShopping}>
        <Text style={styles.ctaText}>Shop Now</Text>
      </TouchableOpacity>

      {/* How We Built This */}
      <Text style={styles.sectionTitle}>How We Built This</Text>
      <Text style={styles.sectionDescription}>
        A glimpse into our development journey — from ideation to coding, teamwork, and testing.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {processImages.map((img, index) => (
          <Image key={index} source={img} style={styles.carouselImage} />
        ))}
      </ScrollView>

      {/* Meet the Creators */}
      <Text style={styles.sectionTitle}>Meet the Creators</Text>
      <Text style={styles.sectionDescription}>
        Meet the minds and hearts behind JuanKooP — passionate IT students turning vision into reality.
      </Text>
      <View style={styles.creatorContainer}>
        {creators.map((creator, index) => (
          <View key={index} style={styles.creatorCard}>
            <Image source={creator.image} style={styles.creatorImage} />
            <Text style={styles.creatorName}>{creator.name}</Text>
          </View>
        ))}
      </View>

      {/* Participating Cooperatives */}
      <Text style={styles.sectionTitle}>Participating Cooperatives</Text>
      <Text style={styles.sectionDescription}>
        These cooperatives support local farming communities and bring you fresh, quality products.
      </Text>
      <View style={styles.coopContainer}>
        {cooperativeLogos.map((logo, index) => (
          <Image key={index} source={logo} style={styles.coopLogo} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    color: "#7f8c8d",
    maxWidth: 300,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "flex-start",
    lineHeight: 20,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  ctaButton: {
    backgroundColor: "#f39c12",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  carousel: {
    width: "100%",
    marginBottom: 30,
  },
  carouselImage: {
    width: screenWidth * 0.6,
    height: 160,
    marginRight: 15,
    borderRadius: 12,
  },
  creatorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  creatorCard: {
    width: "47%",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  creatorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#f39c12",
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  coopContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 40,
    gap: 10,
  },
  coopLogo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    margin: 8,
  },
});

export default Landing;