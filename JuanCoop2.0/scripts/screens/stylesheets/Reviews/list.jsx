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
    padding: normalize(10),
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: normalize(20),
    borderRadius: normalize(8),
    borderWidth: normalize(1),
    borderColor: colorCode.lightGray,
    marginBottom: normalize(10, "height"),
  },
  profileImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(10),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: normalize(14),
    color: "#666",
  },
  userRole: {
    fontSize: normalize(14),
    color: "#333",
  },
  viewButton: {
    color: "#FFA500",
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});