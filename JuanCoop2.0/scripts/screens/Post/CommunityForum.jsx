import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovedPosts, likePost, addComment } from '@src/redux/Actions/postActions';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);

  const [showFull, setShowFull] = useState(false);
  const toggleShowFull = () => setShowFull(!showFull);
  const [expandedPostId, setExpandedPostId] = useState(null);


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
  
  const badWords = [
    // English Profanity
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dumbass", "jackass", "motherfucker",
    "dipshit", "piss", "cock", "dick", "prick", "slut", "whore", "nigger", "faggot", "twat",
    "pussy", "bollocks", "wanker", "son of a bitch", "douchebag", "arsehole", "bloody hell",
    "goddamn", "hell no", "screw you", "retard", "idiot", "moron",
  
    // Tagalog Profanity
    "tangina", "gago", "putangina", "ulol", "bobo", "tanga", "inutil", "bwisit", "pakyu", 
    "siraulo", "peste", "punyeta", "lecheng", "lintik", "hayop ka", "tarantado", "gunggong",
    "ampota", "bwesit", "kantot", "hindot", "burat", "jakol", "salsal", "iyot", "chupa",
    "pakyu ka", "hindutan", "bilat", "pokpok", "bayag", "pwet", "supalpal", "lapastangan"
  ];

  const censorComment = (comment) => {
    if (!comment) return comment;
  
    return badWords.reduce((acc, word) => {
      const regex = new RegExp(word, "gi");
      return acc.replace(regex, (match) => {
        // Keep the first letter, replace the rest with "*"
        const firstLetter = match.charAt(0);
        const stars = "*".repeat(match.length - 1);
        return firstLetter + stars;
      });
    }, comment);
  };
  

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

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchApprovedPosts()).then(() => setRefreshing(false));
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
        <ScrollView 
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        <View style={styles.header}>
          {/* <Text style={styles.headerText}>Discussions</Text> */}
          {isCooperative && ( // Render button only if user has "Cooperative" role
            <TouchableOpacity 
              style={styles.userPostsButton} 
              onPress={() => navigation.navigate("UserPostList")}
            >
              <Text style={styles.userPostsButtonText}>View My Post</Text>
            </TouchableOpacity>
          )}
        </View>
          {posts &&
            posts.map((post) => (
              <View key={post._id} style={styles.postCard}>
                <View style={styles.postHeader}>
                <Text style={styles.postContent}>
                  {expandedPostId === post._id
                    ? post.content
                    : post.content.length > 100
                      ? post.content.slice(0, 100) + '... '
                      : post.content}
                  {post.content.length > 100 && (
                    <Text
                      onPress={() =>
                        setExpandedPostId(expandedPostId === post._id ? null : post._id)
                      }
                      style={{ color: '#f7b900' }}
                    >
                      {expandedPostId === post._id ? 'Show Less' : 'Show More'}
                    </Text>
                  )}
                </Text>

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
                <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => handleLike(post._id)} style={styles.iconButton}>
                  <View style={styles.iconWithCount}>
                    <FontAwesome5 
                      name="heart"
                      solid={isLiked[post._id]}
                      size={20}
                      color={isLiked[post._id] ? "red" : "red"}
                    />
                    <Text style={styles.countText}>{post.likeCount}</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => toggleComments(post._id)} style={styles.iconButton}>
                <View style={styles.iconWithCount}>
                  <FontAwesome5 
                    name="comment"
                    size={20}
                    color="#f7b900"
                  />
                  <Text style={styles.countText}>{post.comments?.length || 0}</Text>
                </View>
              </TouchableOpacity>
                </View>

              <View style={styles.sentimentContainer}>
                <Text
                  style={[
                    styles.sentimentText,
                    post.overallSentimentLabel === "positive"
                      ? { color: "green" }
                      : post.overallSentimentLabel === "neutral"
                      ? { color: "gray" }
                      : { color: "red" },
                  ]}
                >
                  {post.overallSentimentLabel.charAt(0).toUpperCase() + post.overallSentimentLabel.slice(1)}
                </Text>
              </View>
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
                                {censorComment(comment.comment)}
                              </Text>

                              {/* Sentiment Label */}
                              <View style={styles.sentimentLabel}>
                                {comment.sentimentLabel === "positive" && (
                                  <FontAwesome5 name="laugh-beam" size={24} color="#2ECC71" /> // Vibrant green
                                )}
                                {comment.sentimentLabel === "neutral" && (
                                  <FontAwesome5 name="meh" size={24} color="#F1C40F" /> // Warm yellow
                                )}
                                {comment.sentimentLabel === "negative" && (
                                  <FontAwesome5 name="angry" size={24} color="#E74C3C" /> // Strong red
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
  iconButton: {
    marginRight: 15,
  },
  
  iconWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  countText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
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
    marginLeft: 240,
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
    height: 120,             // Reduced height for a smaller look
    resizeMode: 'cover',
    borderRadius: 12,        // Slightly rounder corners
    marginVertical: 8,       // Slightly tighter spacing
    shadowColor: '#000',     // Optional: subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,            // For Android shadow
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
  backgroundColor: "#FFFFFF", // Light yellow background
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
postActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  paddingHorizontal: 10,
},

leftActions: {
  flexDirection: 'row',
  alignItems: 'center',
},

iconButton: {
  marginRight: 15,
},

sentimentContainer: {
  alignItems: 'flex-end',
},

sentimentText: {
  fontWeight: '600',
  fontSize: 14,
},
});

export default CommunityForum;