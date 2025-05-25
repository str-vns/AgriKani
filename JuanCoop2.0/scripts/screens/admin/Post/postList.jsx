import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import {
  getPost,
  approvePost,
  deletePost,
} from '@src/redux/Actions/postActions';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { SelectedTab } from "@shared/SelectedTab";

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const { loading, posts } = postState;
  const navigation = useNavigation(); 
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [refreshing, setRefreshing] = useState(false); 

  useEffect(() => {
    dispatch(getPost());
  }, [dispatch]);

  const handleApprove = async (postId) => {
    await dispatch(approvePost(postId));
    alert('Post Approved Successfully!');
    dispatch(getPost());
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
    dispatch(getPost());
  }, [dispatch, navigation]);

  const handleDecline = async (postId) => {
    try {
      await dispatch(deletePost(postId));
      alert('Post deleted successfully!');
      dispatch(getPost());
    } catch (error) {
      await dispatch(deletePost(postId));
      alert('Post deleted successfully!');
      dispatch(getPost());
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getPost()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const filteredPosts = posts?.filter(post => 
    selectedTab === "Pending" ? post.status !== "approved" : post.status === "approved"
  );

  const choicesTab = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
  ];

  return (
    <View style={styles.container}>
      <SelectedTab selectedTab={selectedTab} tabs={choicesTab} onTabChange={setSelectedTab} />
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
     

      {/* ✅ Display Filtered Posts */}
      {loading && (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
      )}

      {filteredPosts && filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.imageAndContent}>
              <Image
                source={post.image?.length > 0 ? { uri: post.image[0].url } : require('@assets/img/buyer.png')}
                style={styles.postImage}
              />
              <View style={styles.postDetails}>
                <Text style={styles.postContent}>{post.content || 'No content available'}</Text>
                <Text style={styles.postDate}>Posted on: {new Date(post.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>

            {selectedTab === "Pending" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => handleApprove(post._id)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={() => handleDecline(post._id)}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      ) : (
        !loading && <Text style={styles.noPostsText}>No posts available.</Text>
      )}

    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 15,
    marginBottom: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  imageAndContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
  },
  postDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  postContent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 14,
    color: '#777',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#f7b900',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noPostsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFA500',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#FFA500', 
  },
});

export default PostList;