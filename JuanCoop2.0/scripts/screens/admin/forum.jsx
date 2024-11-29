import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
const data = [
  {
    id: '1',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '2',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '3',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '4',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '5',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '6',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '7',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    id: '8',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaSaG11R_BzczYnMVnzsutmXBES7ullWpFWQ&s',
    datePosted: 'June 23, 2024',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
];

const ListItem = ({ item }) => {
 
  return (
    <View style={styles.itemContainer}>
      
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>Date posted: {item.datePosted}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.approveButton}>
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
    </View>
        </View>
  );
};

const Forum = () => {
  const navigation = useNavigation();
  return (
<>
<TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={34} color="black" />
      </TouchableOpacity>
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={item => item.id}
    />
  </>    
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'flex-end', // Aligns buttons to the right
    paddingright:10,
  },
  approveButton: {
    backgroundColor: '#f7b900', // Updated color
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  approveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  declineButton: {
    borderColor: '#FF6666',
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  declineText: {
    color: '#FF6666',
    fontWeight: 'bold',
  },
});

export default Forum;
