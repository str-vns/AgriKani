import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const riders = [
  {
    id: "1",
    name: "Alexandra C. Aquino",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "2",
    name: "Angela Reyes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "3",
    name: "Kanji Delatorre",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "4",
    name: "Loki Villafuerte",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "5",
    name: "Manju Shin",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "6",
    name: "Alexandra C. Aquino",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "7",
    name: "Angela Reyes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "8",
    name: "Kanji Delatorre",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "9",
    name: "Loki Villafuerte",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
  {
    id: "10",
    name: "Manju Shin",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s",
  },
];

const Riderlist = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={styles.riderContainer}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.historyButton}
          onPress={() => navigation.navigate("History")}>
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.assignButton}
           onPress={() => navigation.navigate("Assign")}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={riders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default Riderlist;

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  riderContainer: {
    flexDirection: "row",
    alignItems: "center", 
    marginBottom: 15,
    padding: 15, 
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,
    shadowRadius: 3, 
    elevation: 4, 
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5, 
  },
  historyButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8, 
    paddingHorizontal: 20,
    borderRadius: 8, 
    marginRight: 10,
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, 
  },
  assignButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 8, 
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  assignButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, 
  },
});
