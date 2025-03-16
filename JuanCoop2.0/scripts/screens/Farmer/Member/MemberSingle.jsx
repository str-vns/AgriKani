import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { approveMember, rejectMember, memberRemove } from "@redux/Actions/memberActions";
import ImageViewer from 'react-native-image-zoom-viewer';

const MemberSingle = (props) => {
  const members = props.route.params.member;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);
 
  const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);
      setModalVisible(true);
  }

  const handleApprove = (memId, userId) => {
    
    setIsLoading(true);
    dispatch(approveMember(memId, userId, token));
    setIsLoading(false);
    navigation.navigate("MemberList");
  };

  const handleDelete = (memId) => {
    setIsLoading(true);
    dispatch(rejectMember(memId,token));
    setIsLoading(false);
    navigation.navigate("MemberList");
  };

  const handleRemove = (memId) => {
    setIsLoading(true);
    dispatch(memberRemove(memId,token));
    setIsLoading(false);
    navigation.navigate("MemberList");
  }

 

  return (
  
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members Details</Text>
      </View> */}
      <ScrollView>
      <View style={styles.coopContainer}>

        <Image
          source={{
            uri: members?.userId?.image?.url || "https://via.placeholder.com/150",
          }}
          style={styles.coopImage}
        />

        <View style={styles.coopDetails}>
          <Text style={styles.coopName}>
           {members?.userId?.firstName} {members?.userId?.lastName}
          </Text>
          <Text style={styles.coopEmail}>Email: {members?.userId?.email}</Text>
          <Text style={styles.address}>Address: {members?.address} </Text>
          <Text style={styles.address}>Barangay: {members?.barangay}</Text>
          <Text style={styles.address}>City: {members?.city}</Text>
          
          <Text
            style={[
              styles.status,
              members?.approvedAt === null ? styles.notApproved : styles.approved,
            ]}
          >
            Approval Status:{" "}
            {members?.approvedAt === null ? "Not Approved" : "Approved"}
          </Text>
        </View>
      </View>
     
     <Text style={styles.requirement}>Barangay Clearance</Text>
     <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => handleImageClick(members?.barangayClearance?.url)}>
       <Image source={{ uri: members?.barangayClearance?.url || "https://via.placeholder.com/150" }} style={styles.imageLook} />
       </TouchableOpacity>
      </View>
    
      <Text style={styles.requirement}>Valid ID</Text>
     <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => handleImageClick(members?.validId?.url)}>
       <Image source={{ uri: members?.validId?.url || "https://via.placeholder.com/150" }} style={styles.imageLook} />
       </TouchableOpacity>
      </View>

      {members?.approvedAt === null ? (
  <View style={styles.buttonContainer}>
    {/* Approve Button */}
    <TouchableOpacity
      style={styles.approvedButton}
      onPress={() => handleApprove(members?._id, members?.userId?._id)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text style={styles.buttonApproveText}>Approve</Text>
      )}
    </TouchableOpacity>

    {/* Decline Button */}
    <TouchableOpacity
      style={styles.approvedButton}
      onPress={() => handleDelete(members?._id)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text style={styles.buttonApproveText}>Decline</Text>
      )}
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.buttonContainer}>
    {/* Only Decline Button if already approved */}
    <TouchableOpacity
      style={styles.approvedButton}
      onPress={() => handleRemove(members?._id)}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Text style={styles.buttonApproveText}>Remove</Text>
      )}
    </TouchableOpacity>
  </View>
)}
        </ScrollView>

        <Modal 
        visible={modalVisible} 
        transparent={true} 
        onRequestClose={() => setModalVisible(false)}
      >
        
        <View style={styles.modalContainer}>
          <ImageViewer 
  imageUrls={[{ url: selectedImage || "https://via.placeholder.com/150" }]} 
  enableSwipeDown={true} 
  onSwipeDown={() => setModalVisible(false)} 
  style={styles.imageShow}
/>
        </View>
      </Modal>

    </View>
  );
};

export default MemberSingle;
