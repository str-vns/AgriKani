import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overallContainer: {
    backgroundColor: "#f4f4f4", // Clean and modern background
    flex: 1,
  },
  mapContainer: {
    height: 550,
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#ccc",
    borderWidth: 1.2,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 45, // Reduced size for a more compact look
    height: 45,
    marginRight: 14, // Adjusted spacing for balance
    borderRadius: 8, // Slightly less rounded for a sharper look
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc", // Slightly darker for a more refined appearance
  },
  
  image: {
    width: "100%",
    height: "100%",
  },
  
  detailsContainer: {
    flex: 1,
  },
  
  farmName: {
    fontSize: 16, // Reduced from 18 for a more balanced look
    fontWeight: "600", // Kept strong but slightly lighter
    marginBottom: 3,
    color: "#002b5e", // A deeper blue for a more professional feel
  },
  
  address: {
    fontSize: 13, // Smaller for a subtle yet readable look
    color: "#444", // Darker for better readability
    marginBottom: 5,
  },
  
  viewButton: {
    backgroundColor: "#00489a", // Slightly darker shade for formality
    paddingVertical: 10, // Reduced padding for a sleeker button
    paddingHorizontal: 16,
    borderRadius: 8, // Slightly sharper edges for a modern look
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Softer shadow for a subtle effect
    shadowRadius: 2,
    elevation: 3,
  },
  
  buttonText: {
    color: "#ffffff",
    fontSize: 12, // Smaller text but still clear
    fontWeight: "500", // Less bold for a more elegant look
    textAlign: "center",
    letterSpacing: 0.6, // Slightly reduced spacing for a refined appearance
    textTransform: "uppercase",
  },
  
  detailContainerNull: {
    backgroundColor: "white",
    padding: 12, // Reduced padding for a more compact look
    margin: 10,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1.5,
    alignItems: "center",
  },
  
  textNullDetail: {
    textAlign: "center",
    fontSize: 14, // Reduced font size for a more formal look
    color: "#444", // Slightly darker for better readability
    fontWeight: "500", // Keeps it professional and clean
  },
  
  
});