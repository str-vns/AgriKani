import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

const UserList = () => {
  const navigation = useNavigation();
  const users = [
    {
      id: '1',
      name: 'George Lindsell',
      role: 'User',
      email: 'george@mail.com',
      picture: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Erik Dyer',
      role: 'User',
      email: 'erik@mail.com',
      picture: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      name: 'Håsten Arnessen',
      role: 'User',
      email: 'hasten@mail.com',
      picture: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      name: 'Michael Campbell',
      role: 'User',
      email: 'michael@mail.com',
      picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      id: '5',
      name: 'Ashley Williams',
      role: 'User',
      email: 'ashley@mail.com',
      picture: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
        id: '1',
        name: 'George Lindsell',
        role: 'User',
        email: 'george@mail.com',
        picture: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        id: '2',
        name: 'Erik Dyer',
        role: 'User',
        email: 'erik@mail.com',
        picture: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        id: '3',
        name: 'Håsten Arnessen',
        role: 'User',
        email: 'hasten@mail.com',
        picture: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      {
        id: '4',
        name: 'Michael Campbell',
        role: 'User',
        email: 'michael@mail.com',
        picture: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      {
        id: '5',
        name: 'Ashley Williams',
        role: 'User',
        email: 'ashley@mail.com',
        picture: 'https://randomuser.me/api/portraits/women/5.jpg',
      }
  ];

  const renderUser = ({ item }) => (
    
    <View style={styles.userRow}>
      <Image source={{ uri: item.picture }} style={styles.profilePicture} />
      
      {/* User info (name, email, role) */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>

      {/* Action icons */}
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
        <FontAwesome6 name="pencil" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    
    <View style={styles.container}>
             <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={34} color="black" />
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  userRole: {
    fontSize: 14,
    color: '#888',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default UserList;
