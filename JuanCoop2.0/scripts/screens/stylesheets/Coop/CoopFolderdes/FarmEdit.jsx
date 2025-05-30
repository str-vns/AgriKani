import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollViewContainer: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 15,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      elevation: 3,
    },
    backButton: {
      marginRight: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      flex: 1,
      textAlign: "center",
      color: "#333",
    },
    label: {
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 10,
      color: "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      backgroundColor: "#fff",
      fontSize: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    imagePicker: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 15,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      backgroundColor: "#f9f9f9",
    },
    image: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    imagePickerText: {
      fontSize: 16,
      color: "#333",
    },
    mapContainer: {
      height: 250,
      marginTop: 20,
      borderRadius: 10,
      overflow: "hidden",
      borderColor: "#ddd",
      borderWidth: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    registerButton: {
      backgroundColor: "#FEC120",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    registerButtonText: {
      fontSize: 22,
      color: "#000",
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      width: "80%",
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      borderRadius: 5,
    },
    searchButton: {
      marginLeft: 8,
      padding: 10,
      backgroundColor: "#007AFF",
      borderRadius: 5,
    },
    searchButtonText: {
      color: "#fff",
      fontSize: 16,
    },
    resultsList: {
      marginTop: 10,
    },
    resultItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    error: {
      color: "red",
    },
    selectImageButton: {
      // Add styles for your button here
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
    },
    imageContainer: {
      position: "relative", // Enables absolute positioning of children
      marginRight: 10, // Space between images
    },
    image: {
      width: 100, // Adjust this value for larger images
      height: 100, // Adjust this value for larger images
      borderRadius: 8, // Optional: for rounded corners
      overflow: "hidden", // Ensures rounded corners are applied to the image
    },
    deleteButton: {
      position: "absolute",
      top: 5, // Distance from the top of the image
      right: 5, // Distance from the right of the image
      backgroundColor: "white", // Optional: background color for better visibility
      borderRadius: 12, // Optional: rounded button
      padding: 5, // Space around the icon
    },
  });
  