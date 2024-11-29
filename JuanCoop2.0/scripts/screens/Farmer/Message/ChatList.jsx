import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/styles';

const ChatList = ({ navigation }) => {
  const chatList = [
    { id: 1, name: 'Jenny Doe', lastMessage: 'Hey there, this is my test...', time: '4 mins ago', avatar: require('@assets/img/buyer.png') },
    { id: 2, name: 'John Doe', lastMessage: 'Hey there, this is my test...', time: '2 hours ago', avatar: require('@assets/img/buyer.png') },
    { id: 3, name: 'Ken William', lastMessage: 'Hey there, this is my test...', time: '1 day ago', avatar: require('@assets/img/buyer.png') },
    { id: 4, name: 'Selina Paul', lastMessage: 'Hey there, this is my test...', time: '2 days ago', avatar: require('@assets/img/buyer.png') },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatListItem} 
      onPress={() => navigation.navigate('Chat', { buyerName: item.name })}
    >
     <Image source={item.avatar} style={styles.chatAvatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.chatTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with menu button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat List</Text>
      </View>
      
      {/* Chat list */}
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ChatList;