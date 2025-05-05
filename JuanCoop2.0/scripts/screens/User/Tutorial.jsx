import React, { useState } from "react";
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
  },
];

// Main component
const Tutorial = () => {
  const [searchText, setSearchText] = useState("");

  const filteredVideos = tutorialVideos.filter((video) =>
    video.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleOpenLink(item.youtubeUrl)}
      >
        <Image
          source={item.thumbnail}  // Using local image here
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>📺 Tutorial Videos</Text>

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
          numColumns={2} // Display two videos per row
          columnWrapperStyle={styles.row} // Styling for each row
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