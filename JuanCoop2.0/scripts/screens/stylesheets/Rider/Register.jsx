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
          

      })
