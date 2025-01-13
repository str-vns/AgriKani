import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff",
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 100, 
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        },
        backButton: {
          marginRight: 10,
        },
        backText: {
          fontSize: 16,
          color: "#007bff",
        },
        title: {
          fontSize: 20,
          fontWeight: "bold",
          flex: 1,
          textAlign: "center",
        },
        profileContainer: {
          alignItems: "center",
          marginBottom: 20,
        },
        profileImage: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#ddd",
          marginBottom: 10,
        },
        uploadText: {
          fontSize: 16,
          color: "#007bff",
        },
        form: {
          marginBottom: 20,
        },
        input: {
          height: 40,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 5,
          paddingHorizontal: 10,
          marginBottom: 15,
          backgroundColor: "#f9f9f9",
        },
        buttonContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
          width: "100%",
        },
        cancelButton: {
          borderWidth: 1,
          borderColor: "#f39c12",
          borderRadius: 5,
          padding: 10,
          flex: 0.45,
        },
        cancelText: {
          textAlign: "center",
          color: "#f39c12",
          fontSize: 16,
        },
        saveButton: {
          backgroundColor: "#f39c12",
          borderRadius: 5,
          padding: 10,
          flex: 0.45,
        },
        saveText: {
          textAlign: "center",
          color: "#fff",
          fontSize: 16,
        },
        ImageCard: {
            padding: height * 0.05,
            paddingHorizontal: width * 0.1,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: width * 0.02,
            marginHorizontal: width * 0.025,
            backgroundColor: "white",   
        },
        image: {
            padding: height * 0.09,
            paddingHorizontal: width * 0.17,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: width * 0.02,
            marginHorizontal: width * 0.025,
            backgroundColor: "white", 
        },
        cardContent: {
            flex: 1,
            flexDirection: "row", 
        },
        imageInfo: {
            justifyContent: "center",
        },
        imageButton:{
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: height * 0.02,
            
        },  
        imageText: {
            fontSize: width * 0.035,
            alignSelf: "flex-start", 
            textAlign: "left", 
            marginBottom: height * 0.01,
            fontWeight: "bold",
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            backgroundColor: "white",
            padding: width * 0.05,
            borderRadius: width * 0.025,
            alignItems: "center",
            elevation: 5,
        },
        errorText: {
            color: "red",
            fontSize: width * 0.035,
            textAlign: "center",
            marginTop: height * 0.01,
        },
        buttonRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            width: width * 0.70,
            marginTop: 20,
          },
          genderContainer:{
            width: "100%",
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: width * 0.025,
            marginBottom: height * 0.02,
            overflow: "hidden",
          },
          pickerStyle:{
            width: "100%",
            height: height * 0.07,
            color: "#333",
            backgroundColor: "#fff",
          },
          pickerStyle2:{
            width: "100%",
            flex: 1,
            height: height * 0.07,
            color: "#333",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            justifyContent: "center",
            paddingHorizontal: 30,
            marginBottom: 20,
            backgroundColor: "#f9f9f9",
          },
          scrollContent2: {
            padding: 20,
            paddingTop: height * 0.33, 
          },
          label: {
            fontSize: 16,
            marginBottom: 10,
            color: "#333",
          },
          result: {
            fontSize: 18,
            marginTop: 20,
            fontWeight: "bold",
          },
          showAllButton: {
            flexDirection: "row",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 5,
            marginTop: 10,
            backgroundColor: "transparent",  
          
          },
          showAllButtonText: {
            color: "#007bff",
            fontSize: 14,
            fontWeight: "bold",
            marginRight: 8, 
            marginLeft: 120,
            //textAlign: "center",
          },
          productCard: {
            padding: 10,
            marginBottom: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            backgroundColor: '#fff',
          },
          productDetails: {
            marginBottom: 10,
          },
          cityBarangayBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',  // This will push the trash icon to the right side
            alignItems: 'center', // Vertically center the text and trash icon
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 5,
            backgroundColor: '#f9f9f9',
            marginTop: 5, // Space above the city/barangay box
          },
          cityText: {
            fontSize: 16,
            fontWeight: '500',
            marginRight: 10, // Space between city text and trash icon
          },
          trashIcon: {
            marginLeft: 5,  // Ensures there's some space between the text and the icon
          },
          showAllButton: {
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
          showAllButtonText: {
            fontSize: 14,
            fontWeight: '600',
          },
          arrowIcon: {
            marginLeft: 5,
          },

      })
