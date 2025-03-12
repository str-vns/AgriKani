import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovedPosts, likePost, addComment } from '@src/redux/Actions/postActions';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';

const CommunityForum = ({ navigation, HandleLike }) => {
  const dispatch = useDispatch();
  const { stateUser } = useContext(AuthGlobal);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const userId = stateUser?.userProfile?._id;
  const context = useContext(AuthGlobal);
  const { user } = useSelector((state) => state.userOnly);
  const userslogin = context.stateUser?.userProfile || null;
  
  const { posts, loading } = useSelector((state) => state.post);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    dispatch(fetchApprovedPosts());
  }, [dispatch]);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
        messaging().getToken().then((token) => {
          setFcmToken(token);
        });
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const likedPosts = {};
      posts.forEach((post) => {
        likedPosts[post._id] = post.likes?.some((like) => like.user === userId);
      });
      setIsLiked(likedPosts);
    }
  }, [posts, userId]);
  

  const toggleLike = (postId) => {
    handleLike(postId);
    setIsLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  
  const handleLike = async (postId) => {
    try {
      await dispatch(likePost(postId, userId));
      dispatch(fetchApprovedPosts());  // Ensure updated data is fetched
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const handleCommentChange = (postId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleComment = (postId) => {
    if (!comments[postId]) {
      alert("Please enter a comment.");
      return;
    }

    const commentData = {
      user: userId,
      post: postId,
      comment: comments[postId],
    };

    dispatch(addComment(commentData, token)).then(() => {
      alert("Comment added successfully!");
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));
      dispatch(fetchApprovedPosts());
    });
  };

  const isCooperative = userslogin?.roles?.includes("Cooperative");

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
          {/* <Text style={styles.headerTitle2}>Discussion</Text> */}
        </View>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Discussions</Text>
          {isCooperative && ( // Render button only if user has "Cooperative" role
            <TouchableOpacity 
              style={styles.userPostsButton} 
              onPress={() => navigation.navigate("UserPostList")}
            >
              <Text style={styles.userPostsButtonText}>View My Posts</Text>
            </TouchableOpacity>
          )}
        </View>
          {posts &&
            posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={styles.postContent}>{post.content}</Text>
                  {post.image &&
                    post.image
                    .map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img.url }}
                        style={styles.postImage}
                      />
                    ))}
                </View>
                <View style={styles.postAuthor}>
                  <Text style={styles.authorText}>Author: {post.author?.firstName} {post.author?.lastName}</Text>
                  <Text style={styles.authorText}>Date: 
                    {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Unknown Date"}
                  </Text>
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity onPress={() => handleLike(post._id)} style={styles.actionButton}>
                    <FontAwesome5 
                      name="heart" 
                      size={20} 
                      color={isLiked[post._id] ? "red" : "#E63946"} 
                    />
                    <Text style={styles.actionText}>
                      Like ({post.likeCount})
                    </Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleComments(post._id)} style={styles.actionButton}>
                    <FontAwesome5 
                      name="comment" 
                      size={20} 
                      color="orange" />
                    <Text style={styles.actionText}>Comment ({post.comments?.length})</Text>
                  </TouchableOpacity>
                </View>

                {showComments[post._id] && (
                  <View style={styles.forumlistCoopComments}>
                    <Text style={styles.forumlistCoopTitle}>Comments</Text>
                    {post.comments?.length > 0 ? (
                      [...post.comments] // Create a copy to avoid mutating original data
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date (most recent first)
                        .map((comment, index) => (
                          <View key={index} style={styles.forumlistCoopCommentItem}>
                            {/* Row: Name, Comment, and Sentiment Label */}
                            <View style={styles.forumlistCoopCommentContent}>
                              <Text>
                                <Text style={styles.commentUser}>
                                  {comment.user?.firstName} {comment.user?.lastName}:
                                </Text>{" "}
                                {comment.comment}
                              </Text>

                              {/* Sentiment Label */}
                              <View style={styles.sentimentLabel}>
                                {comment.sentimentLabel === "positive" && (
                                  <FontAwesome5 name="laugh-beam" size={24} color="green" />
                                )}
                                {comment.sentimentLabel === "neutral" && (
                                  <FontAwesome5 name="meh" size={24} color="yellow" />
                                )}
                                {comment.sentimentLabel === "negative" && (
                                  <FontAwesome5 name="angry" size={24} color="red" />
                                )}
                              </View>
                            </View>

                            {/* Date below */}
                            <Text style={styles.commentDate}>
                              {comment.createdAt
                                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown Date"}
                            </Text>
                          </View>
                        ))
                    ) : (
                      <Text>No comments yet.</Text>
                    )}
                  </View>
                )}
                <View style={styles.commentsSection}>
                  <View style={styles.addComment}>
                    <TextInput
                      style={styles.commentInput}
                      value={comments[post._id] || ""}
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
forumlistCoopComments: {
  padding: 10,
  backgroundColor: "#FFF9C4", // Light yellow background
  borderRadius: 10,
  marginVertical: 10,
},
forumlistCoopTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 5,
},
forumlistCoopCommentItem: {
  borderBottomWidth: 1,
  borderBottomColor: "#E0C200",
  paddingVertical: 8,
},
forumlistCoopCommentContent: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
commentUser: {
  fontWeight: "bold",
  color: "#444",
},
sentimentLabel: {
  padding: 5,
  borderRadius: 5,
},
commentDate: {
  fontSize: 12,
  color: "#666",
  marginTop: 3,
},
});

export default CommunityForum;