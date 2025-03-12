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
        fontSize: 22, // Slightly smaller for a formal look
        fontWeight: "bold",
        color: "#333", 
    },

    profileContainer: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
        paddingVertical: 12, // Balanced padding
        paddingHorizontal: 16, // Horizontal padding for a neat look
        backgroundColor: '#ffffff', // Clean and formal background
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', // Subtle border for division
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
        padding: 5,
    },

    prodrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8, // Reduced padding on sides
    
    },

    prodCard: {
        backgroundColor: 'white',
        borderRadius: 8, // Slightly sharper corners for a formal look
        overflow: 'hidden',
        marginVertical: 8, // Reduced vertical margin to remove excessive spacing
        marginHorizontal: 5, // Adjusted side margins
        width: '48%', // Slightly adjusted width for better alignment
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        padding: 5, // Reduced padding inside cards
       
    
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
