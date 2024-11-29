import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  getPost,
  approvePost,
  deletePost,
} from '@src/redux/Actions/postActions';

const PostList = () => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const { loading, posts } = postState;

  useEffect(() => {
    dispatch(getPost());
  }, [dispatch]);

  const handleApprove = async (postId) => {
    await dispatch(approvePost(postId));
    alert('Post Approved Successfully!');
    dispatch(getPost());
  };

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {loading && (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.loadingIndicator}
        />
      )}

      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.imageAndContent}>
              <Image
                source={
                  post.image && post.image.length > 0
                    ? { uri: post.image[0].url }
                    : require('@assets/img/buyer.png')
                }
                style={styles.postImage}
              />
              <View style={styles.postDetails}>
                <Text style={styles.postContent}>
                  {post.content || 'No content available'}
                </Text>
                <Text style={styles.postDate}>
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {post.status !== 'approved' && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => handleApprove(post._id)}
                    >
                    <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={() => handleDecline(post._id)}
                    >
                    <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            )}

          </View>
        ))
      ) : (
        !loading && (
          <Text style={styles.noPostsText}>No posts available.</Text>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
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
});

export default PostList;