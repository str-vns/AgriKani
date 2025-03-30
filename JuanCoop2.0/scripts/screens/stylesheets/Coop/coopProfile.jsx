import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10, // Reduced margin for a tighter layout
        paddingHorizontal: 16,
        marginTop: 15, // Slightly reduced top margin
    },

    headerTitle: {
        width: '100%', 
        alignItems: 'flex-start', // Aligns content to the left
        justifyContent: 'center',
        paddingHorizontal: 16, 
        fontSize: 22, // Slightly smaller for a formal look
        fontWeight: "bold",
    },
    profileContainer: {
        alignItems: "center", // Centers items horizontally
        justifyContent: "center",
        padding: 10,
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
      },
      nameAndIconContainer: {
        alignItems: "center", // Ensures both text and icon are centered
      },
      profileName: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
      },
      emailIcon: {
        alignItems: "center", // Centers the icon and text
        marginTop: 5, // Spacing between the coop name and icon
      },
      chatButton: {
        flexDirection: "row", // Arrange items in a row
        alignItems: "center", // Align icon and text vertically
        padding: 8,
        backgroundColor: "#f0f0f0", // Light gray background (optional)
        borderRadius: 5, // Rounded corners
      },
      chatNowText: {
        fontSize: 14,
        color: "black",
        marginLeft: 5, // Space between the icon and text
        fontWeight: "bold",
      },
    profileImage: {
        width: 80, // Professional size
        height: 80,
        borderRadius: 40,
        marginRight: 12, // Space between image and text
    },
    
    profileDetails: {
        flex: 1, // Takes available space
        flexDirection: 'row', // Aligns text and icon in a row
        alignItems: 'center',
        justifyContent: 'space-between', // Pushes items apart
    },
    
    profileName: {
        fontSize: 20, // Clean and readable
        fontWeight: '600', // Slightly bold for emphasis
        color: '#222',
    },
    
    emailIcon: {
        marginLeft: 10, // Ensures some spacing from the text
    },
    
    prodList: {
        padding: 12,
    },

    prodrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8, // Reduced padding on sides
        paddingBottom:20,
    
    },

    prodCard: {
        backgroundColor: 'white',
        borderRadius: 8, 
        overflow: 'hidden',
        marginVertical: 8, 
        marginHorizontal: 5, 
        width: '48%', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        padding: 5, 
       
    
    },

    prodImage: {
        width: '100%',
        height: 110, // Reduced image height for a balanced card
        borderRadius: 6,
        resizeMode: 'cover',
    },

    prodName: {
        fontSize: 14, // More compact font size
        fontWeight: 'bold',
        textAlign: 'center',
    },

    prodDescription: {
        fontSize: 11,
        color: '#555', // Slightly darker text for readability
        marginTop: 3,
        textAlign: 'center',
        height: 30, // Shortened description area
        overflow: 'hidden',
    },

    prodpriceContainer: {
        marginTop: 3, // Reduced space
    },

    prodprice: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#28a745',
    },
});
