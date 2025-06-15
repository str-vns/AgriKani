import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import styles from "@screens/stylesheets/User/Landing";
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
        <ImageBackground
          source={require("@assets/img/cover2.png")}
          style={styles.coverImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Image
              source={require("@assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>JuanKooP</Text>
            <Text style={styles.subtitle}>
              Empowering Cooperatives, Uniting Communities for Agricultural
              Success
            </Text>
          </View>
        </ImageBackground>
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
        A glimpse into our development journey — from ideation to coding,
        teamwork, and testing.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {processImages.map((img, index) => (
          <Image key={index} source={img} style={styles.carouselImage} />
        ))}
      </ScrollView>

      {/* Meet the Creators */}
      <Text style={styles.sectionTitle}>Meet the Creators</Text>
      <Text style={styles.sectionDescription}>
        Meet the minds and hearts behind JuanKooP — passionate IT students
        turning vision into reality.
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
        These cooperatives support local farming communities and bring you
        fresh, quality products.
      </Text>
      <View style={styles.coopContainer}>
        {cooperativeLogos.map((logo, index) => (
          <Image key={index} source={logo} style={styles.coopLogo} />
        ))}
      </View>
    </ScrollView>
  );
};


export default Landing;
