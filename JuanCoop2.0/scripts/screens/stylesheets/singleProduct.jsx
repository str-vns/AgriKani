import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    carouselImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
      // resizeMode: "cover", // Ensure the image scales correctly
    },
    farmerInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    farmerInfo2: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    farmerImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    farmerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    location: {
      fontSize: 14,
      color: "#777",
    },
    ratingContainer: {
      alignItems: "flex-end",
    },
    box: {
      backgroundColor: "#fefdf9", // Slightly off-white background
      paddingHorizontal: 20, // Horizontal padding for the button
      paddingVertical: 10, // Vertical padding for the button
      borderRadius: 8, // Rounded corners
      borderWidth: 1, // Add a border for emphasis
      borderColor: "#ddd", // Light gray border
      shadowColor: "#000", // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow direction
      shadowOpacity: 0.1, // Shadow opacity
      shadowRadius: 3, // Shadow blur radius
      elevation: 2, // For Android shadow
    },
    boxText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333", // Dark text color
      textAlign: "center",
    },
    quantity: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginHorizontal: 10,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      width: "100%",
      marginVertical: 20,
    },
    scrollContainer: {
      paddingBottom: 160,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#f7b900",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    headerTitle: {
      flex: 1,
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    imageContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    garlicMainImage: {
      width: 200,
      height: 200,
    },
    productName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      marginHorizontal: 16,
      marginVertical: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#e76f51",
      marginHorizontal: 16,
    },
    stock: {
      fontSize: 14,
      alignItems: "flex-start",
      marginHorizontal: 10,
    },
    farmerInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
      marginHorizontal: 16,
    },
    farmerInfo2: {
      flexDirection: "row",
      alignItems: "center",
    },
    farmerImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    farmerName: {
      fontSize: 14, // Reduced text size
      fontWeight: "bold",
    },
    location: {
      fontSize: 12,
      color: "#888",
    },
    ratingContainer: {
      marginLeft: "auto",
    },
    productHeading: {
      fontSize: 18, // Reduced text size
      fontWeight: "bold",
      marginHorizontal: 16,
      marginTop: 8,
    },
    productDescription: {
      marginHorizontal: 16,
      marginVertical: 8,
      fontSize: 14, // Reduced text size
      color: "#666",
      lineHeight: 22,
    },
    reviewsHeader: {
      fontSize: 18, // Reduced text size
      marginHorizontal: 16,
      marginVertical: 8,
      fontWeight: "bold",
    },
    review: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 16,
    },
    reviewProfile: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    reviewContent: {
      flex: 1,
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    reviewName: {
      fontSize: 14,
      fontWeight: "bold",
    },
    reviewMessage: {
      fontSize: 14,
      lineHeight: 22,
    },
    quantityControl: {
      flexDirection: "row",
      alignItems: "center",
    },
    quantityButton: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 8,
      borderRadius: 4,
      
    },
    quantityButtonText: {
      fontSize: 18,
      color: "#333",
    },
    quantity: {
      fontSize: 16,
      color: "#333",
      marginHorizontal: 10,
    },
    rating: {
      marginLeft: 10,
    },
  
    buttonContainer: {
      flexDirection: "row", // Buttons side by side
      justifyContent: "space-between",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 65,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: "#f8f9fa",
    },
    addToCartButton: {
      backgroundColor: "#fcbf49",
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    priceAndQuantity: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 10, 
    },

    stockContainer: {
      marginHorizontal: 20,
      marginVertical: 20,
    },
    stockCard: {
      padding: 20,
      margin: 5,
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
      paddingHorizontal: 30,
    },
    stockCardSelected: {
      padding: 20,
      margin: 5,
      borderRadius: 5,
      paddingHorizontal: 30,
      backgroundColor: '#fff7e6', 
    },
    stock: {
      fontSize: 14,
    },
    StockAndQContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginHorizontal: 10,
      marginTop: 15,
    },
    stock2: {
      fontSize: 14, // Adjust font size if needed
    },
    quantityContainer2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginHorizontal: 10,
    },
    quantityButton2: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 8,
      borderRadius: 4,
      
    },
    quantityButtonText2: {
      fontSize: 18,
      color: "#333",
    },
    quantity2: {
      fontSize: 16,
      color: "#333",
      marginHorizontal: 10,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginHorizontal: 10,
    },
  });