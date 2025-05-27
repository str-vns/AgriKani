import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import { colorCode } from "@stylesheets/colorCode";
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
    flexGrow: 1,
    backgroundColor: colorCode.lightYellow,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
    paddingBottom: 70,
  },
  riderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Better spacing
    marginTop: 8,
  },
  historyButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  historyButtonText: {
    color: colorCode.white, 
    fontWeight: "bold",
    fontSize: 14,
  },
  assignButton: {
    backgroundColor: colorCode.CyberYellow, 
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginRight: 10, 
  },
  assignButtonText: {
    color: colorCode.black,
    fontWeight: "bold",
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: colorCode.green, 
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  viewButtonText: {
    color: colorCode.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: colorCode.gray,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: -10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorCode.black,
  },
});