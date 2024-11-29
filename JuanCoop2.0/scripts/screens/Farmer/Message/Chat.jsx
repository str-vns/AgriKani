import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/styles';

const Chat = ({ route, navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you with your crops?', sender: 'bot', time: '10:08 AM' },
    { id: 2, text: 'What fertilizer should I use for rice?', sender: 'user', time: '10:08 AM' },
  ]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate a bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: 'You can use urea for better growth.',
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
      {item.sender === 'bot' && (
        <Image source={require('@assets/img/buyer.png')} style={styles.useravatar} />
      )}
      <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        
        {/* Buyer name in the center */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{route.params.buyerName}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        contentContainerStyle={styles.chatContainer}
        inverted
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          style={styles.chatInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;