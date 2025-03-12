import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthGlobal from "@redux/Store/AuthGlobal";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { getUserPost, softDeletePost, restorePost } from '@src/redux/Actions/postActions';
import { useNavigation } from '@react-navigation/native';

const UserPostList = () => {
  const dispatch = useDispatch();
  const { stateUser } = useContext(AuthGlobal);
  const userId = stateUser?.userProfile?._id;
  const postState = useSelector((state) => state.post);
  const { loading, posts } = postState;
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      dispatch(getUserPost(userId));
    }
  }, [userId, dispatch]);

  const handleSoftDelete = (postId) => {
    dispatch(softDeletePost(postId));
    alert("Post marked as deleted!");
  };

  const handleRestore = (postId) => {
    dispatch(restorePost(postId));
    alert("Post restored successfully!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />}

      <TouchableOpacity 
        style={styles.addPostButton} 
        onPress={() => navigation.navigate('UserPostScreen', { action: 'create' })}>
        <Text style={styles.addPostText}>+ Create New Post</Text>
      </TouchableOpacity>

      {posts && posts.length > 0 ? (
        posts
        .slice() // Create a copy of the posts array to avoid mutating the original state
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((post) => (
          <View key={post._id} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            {post.image && post.image.length > 0 && (
              <View style={styles.imageContainer}>
                {post.image.map((img, index) => (
                  <Image key={index} source={{ uri: img.url }} style={styles.postImage} />
                ))}
              </View>
            )}

            <View style={styles.actionButtonsContainer}>
              {!post.isDeleted ? (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('UserPostScreen', { action: 'edit', post })}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleSoftDelete(post._id)}>
                    <Text style={styles.deleteButtonText}>Soft Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={() => handleRestore(post._id)}>
                  <Text style={styles.restoreButtonText}>Restore</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        !loading && <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // A light gray background to enhance readability
    paddingTop: 10,
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  addPostButton: {
    backgroundColor: '#f7b900',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
  },
  addPostText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600', // A bit lighter font weight for better legibility
  },
  postCard: {
    marginBottom: 10,
    padding: 10, // More padding for a comfortable card layout
    backgroundColor: 'white',
    borderRadius: 16, // Rounder corners for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  postTitle: {
    fontSize: 22, // Larger title for better visibility
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 1,
    lineHeight: 22, // Improved line height for better readability
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  postImage: {
    width: 110, 
    height: 100,
    margin: 5,
    borderRadius: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#f7b900', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#F44336', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  noPostsText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  restoreButton: {
    backgroundColor: '#f7b900', // Consistent color with the 'Create Post' button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserPostList;