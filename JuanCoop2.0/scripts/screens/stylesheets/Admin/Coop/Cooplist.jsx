import React from "react";
import { StyleSheet, Dimensions } from "react-native";

// Get screen dimensions
var { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: width,  // Adjust width based on screen size
    height: height, // Adjust height based on screen size
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 4,
    width: width,  // Adjust width based on screen size
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
  listContainer: {
    paddingHorizontal: 16,
    width: width * 0.9, // Adjust width as a percentage of the screen
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    width: width * 0.9, // Adjust width based on screen size
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  userRole: {
    fontSize: 12,
    color: "#777",
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: width * 0.9, // Adjust width based on screen size
  },
  tabButton: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFA500',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#FFA500', 
  },
  viewButton: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coopContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 30,
    width: width * 0.9, // Adjust width based on screen size
  },
  coopImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  coopDetails: {
    flex: 1,
    justifyContent: "center",
  },
  coopName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  farmName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  coopEmail: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  requirement: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  approved: {
    color: "green",
  },
  notApproved: {
    color: "red",
  }, 
  link: {
    fontSize: 14,
    color: "#007BFF", // Blue color for the link
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  containerFile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
    width: width * 0.9, // Adjust width based on screen size
  },
  labelFile: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonFile: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonTextFile: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  containerFileAll: {
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    width: width * 0.9, // Adjust width based on screen size
  },
  approvedButton: {
    backgroundColor: "#FFA500",
    padding: 16,
    paddingHorizontal: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonApproveText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  textProvide: {
    fontSize: 14,
    color: "#FF0000",
    marginBottom: 5,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  imageLook: {
    width: "100%",
    height: 200, // Fixed height for image, can adjust if needed
    borderRadius: 10,
  },
  requirement: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  imageShow:{
    width: "100%",
    height: "80%",
    borderRadius: 10,
  }
});
