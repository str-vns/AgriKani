import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  SafeAreaView,
  Image,
} from "react-native";
import AuthGlobal from "@redux/Store/AuthGlobal";

// Your tutorial video data
const tutorialVideos = [
  {
    id: "1",
    title: "App Preview",
    youtubeUrl: "https://youtube.com/shorts/p3MGIlqlPLo",
    thumbnail: require('@/assets/images/app-preview.png'), // Local image path
  },
  {
    id: "2",
    title: "User Registration",
    youtubeUrl: "https://youtube.com/shorts/0dMjcAPXu9c",
    thumbnail: require('@/assets/images/registration.png'), // Local image path
  },{
    id: "3",
    title: "Buying Products",
    youtubeUrl: "https://youtube.com/shorts/p3MGIlqlPLo",
    thumbnail: require('@/assets/images/buy-product.jpg'), // Local image path
  },
  {
    id: "4",
    title: "Product and Seller Review",
    youtubeUrl: "https://youtube.com/shorts/0dMjcAPXu9c",
    thumbnail: require('@/assets/images/productseller-review.jpg'), // Local image path
  },{
    id: "5",
    title: "Member Registration",
    youtubeUrl: "https://youtube.com/shorts/p3MGIlqlPLo",
    thumbnail: require('@/assets/images/member-registration.jpg'), // Local image path
  },
  {
    id: "6",
    title: "Cooperative Registration",
    youtubeUrl: "https://youtube.com/shorts/0dMjcAPXu9c",
    thumbnail: require('@/assets/images/registercooperative.jpg'), // Local image path
  },{
    id: "7",
    title: "Driver",
    youtubeUrl: "https://youtube.com/shorts/p3MGIlqlPLo",
    thumbnail: require('@/assets/images/driver.jpg'), // Local image path
  },
  {
    id: "8",
    title: "Cooperative",
    youtubeUrl: "https://youtube.com/shorts/0dMjcAPXu9c",
    thumbnail: require('@/assets/images/cooperative.jpg'), // Local image path
  },
];

// Main component
const Tutorial = () => {
  const [searchText, setSearchText] = useState("");
  const context = useContext(AuthGlobal);
  const userRole = context?.stateUser?.userProfile || null;

  // Filter videos based on role
  const accessibleVideos = tutorialVideos.filter((video) => {
    if (
      context?.stateUser?.isAuthenticated &&
      userRole?.roles.includes("Customer") &&
      userRole?.roles.includes("Cooperative")
    ) {
      return true; // Coop can view all videos
    } else if (context?.stateUser?.isAuthenticated &&
      userRole?.roles.includes("Admin")) {
      return true; 
    } else if (context?.stateUser?.isAuthenticated &&
      userRole?.roles.includes("Driver")) {
      return parseInt(video.id) <= 7; 
    } else if (context?.stateUser?.isAuthenticated &&
      userRole?.roles.includes("Customer")) {
      return parseInt(video.id) <= 6; 
    }else {
    return parseInt(video.id) <= 6;
  }
  });

  // Apply search filter on accessible videos
  const filteredVideos = accessibleVideos.filter((video) =>
    video.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleOpenLink(item.youtubeUrl)}
    >
      <Image
        source={item.thumbnail}
        style={styles.thumbnail}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}> Tutorial Videos </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search videos..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </SafeAreaView>
  );
};


// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1f2937",
  },
  searchInput: {
    height: 45,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  videoItem: {
    flex: 1, // Make each video item take equal width
    margin: 8, // Add spacing between video items
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: "100%",
    height: 300, // Adjust height to fit image proportion
    borderRadius: 12,
  },
  row: {
    justifyContent: "space-between", // Space out items within a row
  },
});

export default Tutorial;