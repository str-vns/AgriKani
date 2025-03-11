import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: "#fff",
    },
    logo: {
      width: 110,
      height: 110,
      marginBottom: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 10,
      width: "100%",
      paddingHorizontal: 10,
      marginBottom: 20,
      paddingLeft: 1,
    },
    passwordInput: {
      flex: 1,
      padding: 10,
      fontSize: 16,
      color: "#333",
    },
    toggleButton: {
      paddingHorizontal: 10,
    },
    registerButton: {
      width: "100%",
      backgroundColor: "#f7b900",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 100,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    loginButton: {
      marginTop: 10,
    },
    loginText: {
      color: "#007bff",
    },
    uploadButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    uploadContent: {
      alignItems: "center",
    },
    uploadIcon: {
      marginBottom: 10,
    },
    uploadText: {
      fontSize: 16,
      color: "black",
    },
    input: {
      width: "100%",
      padding: 10,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      fontSize: 15,
      color: "#333",
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 5,
      alignSelf: "flex-start",
    },
    genderContainer: {
      width: "100%",
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
      overflow: "hidden",
    },
    pickerStyle: {
      width: "100%",
      height: 50,
      color: "#333",
      backgroundColor: "#fff",
    },
    genderText: {
      fontSize: 16,
      fontWeight: "500",
    },
    genderTextSelected: {
      color: "#007bff",
    },
    agreement: {
      fontSize: 12,
      color: "#777",
      textAlign: "center",
      marginTop: 20,
    },
    linkText: {
      color: "#007bff",
    },
    buttonGroup: {
      width: "80%",
      margin: 10,
      alignItems: "center",
    },
    buttonContainer: {
      width: "80%",
      marginBottom: 80,
      marginTop: 20,
      alignItems: "center",
    },
    imageContainer: {
      width: 200,
      height: 200,
      borderStyle: "solid",
      borderWidth: 8,
      padding: 0,
      justifyContent: "center",
      borderRadius: 100,
      borderColor: "#E0E0E0",
      elevation: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    imagePicker: {
      position: "absolute",
      right: 5,
      bottom: 5,
      backgroundColor: "grey",
      padding: 8,
      borderRadius: 100,
      elevation: 20,
    },
    cameraContainer: {
      flex: 1,
      flexDirection: "row",
    },
  
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      elevation: 5,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 20,
    },
    errorText: {
      color: "red",
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#f2d728',
      borderRadius: 4,
      marginRight: 8,
    },
    checked: {
      backgroundColor: '#f2d728',
    },
    containerTermAndPolicy: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Dim background effect
    },
    modalContent: {
      width: "85%",
      height: "60%", // Adjust modal height to fit screen
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    modalText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    termsTextContainer: {
      flex: 1, // Allows scrolling inside modal
      maxHeight: "70%", // Limit height for scrolling
      width: "100%",

    },
    termsText: {
      fontSize: 14,
      textAlign: "justify",
      paddingHorizontal: 5,
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#2196F3",
      borderRadius: 5,
      alignSelf: "center", // Center button
      paddingTop: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });