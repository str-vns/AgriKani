import React from "react";
import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import { colorCode } from "@screens/stylesheets/colorCode";

const { width, height } = Dimensions.get("window");
const baseWidth = 360;
const baseHeight = 640;

const scaleWidth = (size) => (width / baseWidth) * size;
const scaleHeight = (size) => (height / baseHeight) * size;

const normalize = (size, based = "width") => {
  const newSize = based === "height" ? scaleHeight(size) : scaleWidth(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorCode.lightYellow,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8, "height"),
    backgroundColor: colorCode.white,
    elevation: 4,
  },
  menuButton: {
    padding: normalize(8),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
  },
  loader: {
    marginTop: normalize(20, "height"),
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: normalize(16),
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: normalize(18),
    color: "#777",
  },
  listContainer: {
    paddingHorizontal: normalize(16),
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: normalize(16),
    backgroundColor: colorCode.white,
    borderRadius: normalize(8),
    marginVertical: normalize(8, "height"),
    elevation: 2,
  },
  profileImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(16),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: colorCode.darkGray,
  },
  userEmail: {
    fontSize: normalize(14),
    color: colorCode.gray,
    marginVertical: normalize(4, "height"),
  },
  userRole: {
    fontSize: normalize(12),
    color: colorCode.lightGray,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(20, "height"),
  },
  tabButton: {
    padding: normalize(10),
    marginHorizontal: normalize(10),
    borderBottomWidth: normalize(2),
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colorCode.orange,
  },
  tabText: {
    fontSize: normalize(16),
    color: colorCode.gray,
  },
  activeTabText: {
    color: colorCode.orange,
  },
  viewButton: {
    color: colorCode.orange,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  coopContainer: {
    flexDirection: "row",
    margin: normalize(10),
    padding: normalize(30),
  },
  coopImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    marginRight: normalize(15),
  },
  coopDetails: {
    flex: 1,
    justifyContent: "center",
  },
  coopName: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: normalize(5, "height"),
  },
  farmName: {
    fontSize: normalize(16),
    color: "#555",
    marginBottom: normalize(5, "height"),
  },
  coopEmail: {
    fontSize: normalize(14),
    color: "#888",
    marginBottom: normalize(5, "height"),
  },
  address: {
    fontSize: normalize(14),
    color: "#666",
    marginBottom: normalize(5, "height"),
  },
  requirement: {
    fontSize: normalize(14),
    color: "#444",
    marginBottom: normalize(5, "height"),
    fontWeight: "bold",
    textAlign: "center",
  },
  status: {
    fontSize: normalize(14),
    fontWeight: "bold",
    marginTop: normalize(10, "height"),
  },
  approved: {
    color: colorCode.green,
  },
  notApproved: {
    color: colorCode.red,
  }, 
  link: {
    fontSize: normalize(14),
    color: colorCode.blue,
    textDecorationLine: "underline",
    marginBottom: normalize(5, "height"),
  },
  containerFile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: normalize(10, "height"),
    paddingHorizontal: normalize(15),
  },
  labelFile: {
    fontSize: normalize(16),
    color: colorCode.darkGray,  
    fontWeight: "bold",
    marginRight: normalize(10),
  },
  buttonFile: {
    backgroundColor: colorCode.blue,
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(5),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonTextFile: {
    color: colorCode.white,
    fontSize: normalize(14),
    fontWeight: "600",
  },
  containerFileAll: {
    padding: normalize(10),
    borderRadius: normalize(5),
    paddingHorizontal: normalize(50),
    justifyContent: "center",
    alignItems: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: normalize(20, "height"),
    marginLeft: normalize(20),
    marginRight: normalize(20),
    marginBottom: normalize(20, "height"),
  },
  approvedButton: {
    backgroundColor: colorCode.orange,
    padding: normalize(16),
    paddingHorizontal: normalize(50),
    borderRadius: normalize(5),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonApproveText: {
    color: colorCode.black,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  textProvide: {
    fontSize: normalize(14),
    color: colorCode.red,
    marginBottom: normalize(5, "height"),
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(10, "height"),
    marginBottom: normalize(10, "height"),
  },
  imageLook: {
    width: normalize(300),
    height: normalize(200, "height"),
    borderRadius: normalize(10),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    position: 'absolute',
    top: normalize(20, "height"),
    right: normalize(20),
    backgroundColor: '#fff',
    padding: normalize(10),
    borderRadius: normalize(20),
  },
  closeText: {
    color: colorCode.black,
    fontWeight: 'bold',
  },
  imageShow:{
    width: "100%",
    height: "80%",
    borderRadius: normalize(10),
  },
  headerButton: {
    backgroundColor: colorCode.blue,
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(4),
  },
  buttonText: {
    color: colorCode.white,
    fontWeight: 'bold',
  },
});