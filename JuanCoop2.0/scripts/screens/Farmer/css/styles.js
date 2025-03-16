// styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  coopdashboardContainer: {
    flex: 1,
    backgroundColor: "#FFF8E1", // Light Yellow Background
    padding: 20,
  },
  coopdashboardHeader: {
    backgroundColor: "#FFD700", // Gold Header
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4, // Android Shadow
    shadowColor: "#000", // iOS Shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  coopdashboardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  coopdashboardSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  coopdashboardSummaryCard: {
    flex: 1,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  coopdashboardSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  coopdashboardSummaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  coopdashboardSalesContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
  },
  coopdashboardSalesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  coopdashboardPicker: {
    height: 50,
    width: 150,
  },
  coopdashboardChart: {
    marginTop: 10,
    borderRadius: 10,
  },
  coopdashboardNoDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  coopdashboardTopProductsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
  },
  coopdashboardTopProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  coopdashboardTopProductRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  coopdashboardTopProductText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  statTitle: {
    fontSize: 16,
    color: "#777",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  totalOrdersCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  totalOrdersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  totalOrdersValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
  },
  chartsContainer: {
    marginTop: 16,
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
//container
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Background color
    },
    scrollViewContainer: {
        padding: 20,
    },
    orderItemContainer: {
      padding: 15,               // Padding around the item container
      marginBottom: 10,          // Margin between items in the list
      backgroundColor: '#fff',   // White background for better readability
      borderRadius: 8,           // Rounded corners
      shadowColor: '#000',       // Shadow color
      shadowOpacity: 0.1,        // Light shadow
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowRadius: 6,           // Blur radius for shadow
    },
    imageAndTextContainer: {
      flexDirection: 'row',      // Align the image and text in a row
      alignItems: 'center',      // Vertically align image and text in the center
    },

    textContainer: {
      flexDirection: 'column',   // Stack the text vertically
      justifyContent: 'center',  // Vertically center the text within the container
    },
    orderItemName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',             // Dark color for the product name
    },
    orderItemPrice: {
      fontSize: 16,
      color: '#555',             // Light gray color for price
    },
    orderItemQuantity: {
      fontSize: 16,
      color: '#555',             // Light gray color for quantity
    },

//header    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
        color: '#333',
    },

//button
    backButton: {
        marginRight: 10,
    },    
    addButton: {
        marginLeft: 10,
    },
    iconButton: {
        marginHorizontal: 10,
    },
    drawerButton: {
        marginRight: 10,
    },
    menuButton: {
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#FEC120',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    iconButtons: {
        flexDirection: 'row',
    },

//profile
    profileContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#fff',
      marginBottom: 10,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    profileFollowing: {
      fontSize: 16,
      color: '#888',
      marginVertical: 5,
    },
    editProfile: {
      fontSize: 16,
      marginTop: 10,
    },

//profile product
    prodSection: {
      marginTop: 10,
    },
    prodList: {
      paddingBottom: 20,
    },
    prodrow: {
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    prodCard: {
      backgroundColor: '#fff',
      borderRadius: 20,
      width: '47%',
      shadowColor: '#f7b900',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 3,
      padding: 10,
      alignItems: 'center', 
      justifyContent: 'center', 
      
    },
    prodImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    prodName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
      textAlign: 'center',
    },
    prodDescription: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 5,
    },
    prodpriceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    prodprice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
    },
    prodoldPrice: {
      fontSize: 14,
      textDecorationLine: 'line-through',
      color: '#999',
      marginLeft: 5,
      textAlign: 'center',
    },

//product
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 15,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#777',
    },

// dashboard
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    tabButton: {
      padding: 10,
      marginHorizontal: 10,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#FFA500', // Orange underline for active tab
    },
    tabText: {
      fontSize: 16,
      color: '#888',
    },
    activeTabText: {
      color: '#FFA500', // Orange text for active tab
    },
    chartContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    salesText: {
      fontSize: 16,
      color: '#888',
    },
    salesValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFA500', // Orange color for sales value
      marginVertical: 10,
    },
    chartStyle: {
      marginVertical: 10,
      borderRadius: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 30,
    },
    statBox: {
      width: '47%',
      backgroundColor: '#f7f7f7',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    statTitle: {
      fontSize: 14,
      color: '#888',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginVertical: 5,
    },
    statChangePositive: {
      fontSize: 12,
      color: 'green',
    },
    statChangeNegative: {
      fontSize: 12,
      color: 'red',
    },
//image picker
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    imagePickerText: {
        fontSize: 16,
        color: '#333',
    },
    reviewButton: {
      backgroundColor: "#4caf50",
      marginLeft: 250,
    },
    ShippingButton: {
      backgroundColor: "#0000FF",
      marginLeft: 250,
    },
    DeliveredButton: {
      backgroundColor: "#008000",
      marginLeft: 250,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 5,
      //width: "45%",
    },
// // order
//   orderCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     shadowColor: '#333',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   orderContent: {
//     flexDirection: 'row', 
//     alignItems: 'center',
//   },
//   orderImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   orderDetails: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   orderId: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2D3748',
//   },
//   orderInfo: {
//     fontSize: 16,
//     color: '#4A5568',
//     marginTop: 5,
//   },
//   orderStatus: {
//     fontSize: 16,
//     marginTop: 10,
//     fontWeight: '500',
//   },
//   statusPending: {
//     color: '#E53E3E', // Red for pending
//   },
//   statusDelivered: {
//     color: '#38A169', // Green for delivered
//   },
//   statusShipped: {
//     color: '#3182CE', // Blue for shipped
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
// Order styles
orderCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  padding: 15,  // Increased padding for more spacing
  marginVertical: 10,
  shadowColor: '#333',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
orderContent: {
  flexDirection: 'row', 
  alignItems: 'flex-start',  // Adjusted alignment for order content
},
orderImage: {
  width: 70,
  height: 70,
  borderRadius: 10,
  marginRight: 10,
},
orderDetails: {
  flex: 1,
  flexDirection: 'column',
},
orderHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
orderId: {
  fontSize: 18,
  fontWeight: '600',
  color: '#2D3748',
},
orderInfo: {
  fontSize: 16,
  color: '#4A5568',
  marginTop: 5,
},
orderStatus: {
  fontSize: 16,
  marginTop: 10,
  fontWeight: '500',
},
statusPending: {
  color: '#E53E3E',  // Red for pending
},
statusDelivered: {
  color: '#38A169',  // Green for delivered
},
statusShipped: {
  color: '#3182CE',  // Blue for shipped
},
statusCancelled: {
  color: '#D69E2E',  // Yellow for cancelled
},
listContainer: {
  paddingBottom: 20,
},
// New styles for added fields
orderDate: {
  fontSize: 14,
  fontWeight: '400',
  color: '#718096',
  marginTop: 5,
},
customerName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#2C5282',
  marginTop: 5,
},
customerContact: {
  fontSize: 14,
  color: '#718096',
  marginTop: 5,
},
deliveryAddress: {
  fontSize: 14,
  color: '#4A5568',
  marginTop: 5,
},
orderNotes: {
  fontSize: 14,
  color: '#4A5568',
  fontStyle: 'italic',  // Make notes italic for differentiation
  marginTop: 5,
},
paymentStatus: {
  fontSize: 16,
  fontWeight: '500',
  marginTop: 10,
},
paidStatus: {
  color: '#38A169',  // Green for paid
},
unpaidStatus: {
  color: '#E53E3E',  // Red for unpaid
},

  // forum
  forumPost: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postTopic: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  postAuthor: {
    fontSize: 14,
    color: '#888',
  },
  postContent: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
  },
  postComments: {
    fontSize: 14,
    color: '#888',
  },

 // Chat List
 chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',  // Ensure vertical alignment is centered
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,  // Space between avatar and details
  },
  chatDetails: {
    flex: 1,  // Take up remaining space
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatMessage: {
    color: '#999',
    marginTop: 4,
    fontSize: 14,  // Slightly smaller font for message
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',  // Right-align the time
  },

  //Chat
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  chatList: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  botMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  useravatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userMessage: {
    maxWidth: '75%',
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    color: '#fff',
  },
  botMessage: {
    maxWidth: '75%',
    backgroundColor: '#f1f0f0',
    padding: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'right',
    marginTop: 5,
  },

  // Reviews & Ratings styles
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },

// Initiatives screen
initiativesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  initiativeButton: {
    width: '40%',
    backgroundColor: '#FFF5D7',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  initiativeIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  initiativeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Financial Assistance screen
  assistanceContainer: {
    padding: 20,
  },
  assistanceButton: {
    backgroundColor: '#FFF5D7',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  assistanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  assistanceDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },

  // Government Loan Program screen
  programContainer: {
    padding: 20,
    alignItems: 'center',
  },
  programImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  programDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  moreButton: {
    backgroundColor: '#FEC120',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  // other
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },

  bannerContainer: {
    padding: 10,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
  bannerText: {
    fontWeight: 'bold',
    color: '#d9534f',
    marginRight: 5,
  },
  
  productText: {
    color: '#d9534f',
    textAlign: 'center', 
    marginRight: 5,
  },
  
  productContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
  centeredContent: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  stockText: {
    color: '#d9534f',
    textAlign: 'center', 
  },
  weatherContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  weatherBox: {
    width: "100%",
    height: 200, 
    borderRadius: 10,
    overflow: "hidden", 
    position: "relative", 
  },
  backgroundImage: {
    position: "absolute", 
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 10, 
  },
  cloudImage: {
    position: "absolute",
    top: 40,
    right: 20, 
    width: 100, 
    height: 100,
    
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
  },
  weatherText: {
    fontSize: 16,
    color: "white", 
    marginBottom: 10,
  },
  dailyWeatherContainer: {
    width: 120, 
    height: 120, 
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#4A90E2", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyWeatherBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dailyOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyWeatherDate: {
    fontSize: 14, 
    color: "white",
    marginBottom: 5, 
    fontWeight: 'bold',
  },
  dailyWeatherCloudImage: {
    width: 40, 
    height: 40,
    marginBottom: 10, 
  },
  dailyWeatherText: {
    fontSize: 14,
    color: "white",
    marginBottom: 5, 
  },
  dailyWeatherTempText: {
    fontSize: 16, 
    color: "white",
    fontWeight: 'bold',
  },  backgroundImageDaily: {
    position: "absolute", 
    padding: 10,
    borderRadius: 10, 
  },  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Distribute buttons with space
    alignItems: 'center', // Align buttons vertically
    paddingHorizontal: 10, // Optional padding
    marginVertical: 10, // Optional vertical margin
  },
  button: {
    flexDirection: 'row', // Icon and text arranged horizontally
    alignItems: 'center', // Align content vertically in the button
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF', // Default background color
    marginHorizontal: 5, // Space between buttons
  },
  reviewButton: {
    backgroundColor: '#4CAF50', // Customize color for Review button
  },
  ShippingButton: {
    backgroundColor: '#FFC107', // Customize color for Shipping button
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5, 
    fontSize: 14,
  },
  buttonCancelled: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 80, 
  },
  
  buttonTextCancelled: {
    color: "white",
    fontWeight: "bold",
  },
});


export default styles;