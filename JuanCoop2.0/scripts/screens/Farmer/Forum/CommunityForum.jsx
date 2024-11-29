import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/styles';  // Importing your shared styles

const CommunityForum = ({ navigation }) => {
  const [topic, setTopic] = useState('');
  const [postContent, setPostContent] = useState('');
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      topic: 'Best crops to grow in Bulacan this season',
      content: 'I am looking for recommendations on the best crops to plant during this time of year. Any ideas?',
      author: 'Juan dela Cruz',
      comments: 3
    },
    {
      id: 2,
      topic: 'Fertilizer usage during rainy season',
      content: 'How often should I use fertilizers for rice paddies? Should I adjust due to the rains?',
      author: 'Maria Santos',
      comments: 5
    }
  ]);

  const handlePost = () => {
    if (topic && postContent) {
      const newPost = {
        id: forumPosts.length + 1,
        topic,
        content: postContent,
        author: 'You',
        comments: 0,
      };
      setForumPosts([newPost, ...forumPosts]);
      setTopic('');
      setPostContent('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Forum</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {forumPosts.map((post) => (
          <View key={post.id} style={styles.forumPost}>
            <View style={styles.postHeader}>
              <Text style={styles.postTopic}>{post.topic}</Text>
              <Text style={styles.postAuthor}>By {post.author}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <Text style={styles.postComments}>{post.comments} comments</Text>
          </View>
        ))}

        <Text style={styles.label}>Start a New Discussion</Text>
        <TextInput
          placeholder="Topic"
          value={topic}
          onChangeText={setTopic}
          style={styles.input}
        />
        <TextInput
          placeholder="Write your post here"
          value={postContent}
          onChangeText={setPostContent}
          style={[styles.input, { height: 100 }]}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handlePost}>
          <Text style={styles.saveButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CommunityForum;