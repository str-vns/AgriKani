import { StyleSheet } from "react-native";

export default StyleSheet.create({ 
    container: {
        padding: 16,
  
      },
      overallRating: {
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      ratingNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 4,
      },
      ratingStars: {
        flexDirection: 'row',
      },
      suggestionCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFD700',
        borderRadius: 8,
        alignItems: 'center',
      },
      suggestionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
      },
      reviewCard: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
      },
      reviewDetails: {
        flex: 1,
      },
      reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      reviewName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
      },
      reviewDate: {
        fontSize: 12,
        color: '#666',
      },
      reviewStars: {
        flexDirection: 'row',
        marginVertical: 4,
      },
      reviewComment: {
        fontSize: 14,
        color: '#333',
      },
      starIcon: {
        marginHorizontal: 2,
      },
})