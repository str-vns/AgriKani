import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, FlatList ,TouchableOpacity,Linking} from "react-native";

const services = [
  {
    id: "1",
    title: "Online Payment & COD",
    description:
      "We offer flexible payment options, including secure online transactions and cash on delivery (COD). This ensures convenience for both cooperatives and customers, making transactions smoother and more accessible.",
    image: require("@assets/img/1.png"),
  },
  {
    id: "2",
    title: "Real-Time Product Tracking",
    description:
      "Our platform enables real-time tracking of products, allowing cooperatives and buyers to monitor orders from dispatch to delivery. This transparency helps build trust and ensures timely fulfillment of purchases.",
    image: require("@assets/img/3.png"),
  },
  {
    id: "3",
    title: "Product Listing & Management",
    description:
      "Cooperatives can easily showcase their products through our digital marketplace. The platform allows for seamless product management, making it easier to update listings, track inventory, and reach more customers.",
    image: require("@assets/img/4.png"),
  },
  {
    id: "4",
    title: "Reviews with Sentiment Analysis",
    description:
      "Customer reviews play a vital role in improving services. Our sentiment analysis feature helps cooperatives understand customer feedback, allowing them to enhance their products and services based on real insights.",
    image: require("@assets/img/5.png"),
  },
  {
    id: "5",
    title: "Community Forum",
    description:
      "JuanKooP fosters collaboration through a community forum where cooperatives can exchange knowledge, share experiences, and discuss industry trends. This space encourages meaningful conversations that strengthen cooperative networks.",
    image: require("@assets/img/6.png"),
  },
  {
    id: "6",
    title: "Data-Driven Insights",
    description:
      "We provide cooperatives with analytics and reports that offer valuable business insights. These data-driven tools help in decision-making, improving efficiency, and identifying opportunities for growth.",
    image: require("@assets/img/2.png"),
  },
];
const handleCall = () => {
    Linking.openURL("tel:+91123456789"); // Make sure the number is correct
  };
const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.description}>
          JuanKooP is a platform designed to support cooperatives in Bulacan by providing a digital space where they can connect, collaborate, and grow. Our goal is to make it easier for cooperatives to manage their products, reach more customers, and improve their operations through accessible technology.
        </Text>
        <Image source={require("@assets/img/9.png")} style={styles.image} />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Our Services</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.serviceImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          )}
        />
        
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Contact</Text>
          <Text style={styles.infoText}>Phone: +91 123456789</Text>
    
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Our Address</Text>
          <Text style={styles.infoText}>Santa Maria, Bulacan</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Hours</Text>
          <Text style={styles.infoText}>Monday - Sunday: 9 AM - 5 PM</Text>
        </View>
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
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
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Android shadow
  },
  infoBox: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
  },
  callButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  callButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default AboutUs;