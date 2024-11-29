import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { useNavigation } from '@react-navigation/native';

const Blog = ({ navigation }) => {
  const articles = [
    {
      id: 1,
      title: '5 tips to create a modern app UI Design',
      time: '2 hr ago',
      description:
        'Recently I was given the task to "Modernize" my current companies app UI on Android. The terms modern, young, cool, etc., are all quite vague. What makes a design modern or old?',
    }
   
  ];

  return (
    <View style={styles.container}>
      {/* Drawer Button */}
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={34} color="black" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Search..." />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.activeTab]}>For You</Text>
        <Text style={styles.tab}>Creativity</Text>
        <Text style={styles.tab}>UI/UX Design</Text>
        <Text style={styles.tab}>Productivity</Text>
      </View>

      {/* Articles */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {articles.map((article) => (
          <View key={article.id} style={styles.card}>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.time}>{article.time}</Text>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {article.description}
            </Text>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    paddingTop: 40, // Adjust to account for status bar
  },
  drawerButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 5,
    elevation: 3, // Adds shadow for Android
  },
  searchBar: {
    marginTop: 50, // Pushes below the drawer button
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    marginRight: 16,
    color: '#8E8E8E',
    fontSize: 16,
  },
  activeTab: {
    color: '#000000',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  author: {
    fontWeight: 'bold',
    color: '#333333',
    fontSize: 14,
  },
  time: {
    color: '#8E8E8E',
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16,
  },
  readMoreButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Blog;
