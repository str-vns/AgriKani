import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovedPosts, likePost } from '@src/redux/Actions/postActions';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AuthGlobal from "@redux/Store/AuthGlobal";

const CommunityForum = ({ navigation }) => {
  const dispatch = useDispatch();
  const { stateUser } = useContext(AuthGlobal);
  const userId = stateUser?.userProfile?._id;
  const [comments, setComments] = useState({});
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchApprovedPosts());
  }, [dispatch]);

  const handleLike = (postId, userId) => {
    dispatch(likePost(postId, userId)); // Dispatch like action
    dispatch(fetchApprovedPosts()); // Re-fetch posts to reflect updated like count
    alert("Like a Post successfully!");
  };  

  const handleShare = (postId) => {
    console.log('Shared post with ID:', postId);
  };

  const handleComment = (postId) => {
    const comment = comments[postId];
    if (comment) {
      console.log(`Comment on Post ${postId}: ${comment}`);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments({
      ...comments,
      [postId]: value,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loaderText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View > 
       <View style={styles.header2}>
                        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
                          <Ionicons name="menu" size={34} color="black" />
                        </TouchableOpacity>
                
                        <Text style={styles.headerTitle2}>Profile</Text>
                      </View>

    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Community Forum</Text>
        <TouchableOpacity style={styles.userPostsButton} onPress={() => navigation.navigate("UserPostList")}>
          <Text style={styles.userPostsButtonText}>View My Posts</Text>
        </TouchableOpacity>
      </View>
      {posts &&
        posts.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postContent}>{post.content}</Text>
              {post.image &&
                post.image.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img.url }}
                    style={styles.postImage}
                  />
                ))}
            </View>
            <View style={styles.postAuthor}>
              <Text style={styles.authorText}>Author: {post.author?.firstName} {post.author?.lastName}</Text>
            </View>

            <View style={styles.postActions}>
              <TouchableOpacity onPress={() => handleLike(post._id, userId)} style={styles.actionButton}>
                <FontAwesome5 name="heart" size={20} color="#E63946" />
                <Text style={styles.actionText}>Like ({post.likeCount})</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleShare(post._id)} style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={20} color="#007bff" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.commentsHeader}>Comments</Text>
              {post.comment &&
                post.comment.map((comment, idx) => (
                  <View key={idx} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Image
                        source={{ uri: comment.avatar?.url }}
                        style={styles.commentAvatar}
                      />
                      <Text style={styles.commentName}>{comment.firstName} {comment.lastName}</Text>
                      <Text style={styles.commentRating}>Rating: {comment.rating}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    {comment.image &&
                      comment.image.map((img, idx) => (
                        <Image
                          key={idx}
                          source={{ uri: img.url }}
                          style={styles.commentImage}
                        />
                      ))}
                  </View>
                ))}
              <View style={styles.addComment}>
                <TextInput
                  style={styles.commentInput}
                  value={comments[post._id] || ''}
                  onChangeText={(text) => handleCommentChange(post._id, text)}
                  placeholder="Add a comment..."
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => handleComment(post._id)} style={styles.addCommentButton}>
                  <Text style={styles.addCommentButtonText}>Add Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userPostsButton: {
    backgroundColor: '#f7b900',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  userPostsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    marginBottom: 10,
  },
  postContent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 10,
  },
  postAuthor: {
    marginBottom: 10,
  },
  authorText: {
    fontSize: 14,
    color: '#555',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#007bff',
    marginLeft: 5,
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  commentCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentName: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentRating: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
  },
  commentImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 5,
    borderRadius: 8,
  },
  addComment: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    marginRight: 10,
  },
  addCommentButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f7b900',
    color: '#fff',
    borderRadius: 5,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
},
headerTitle2: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
},
});

export default CommunityForum;