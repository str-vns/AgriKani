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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colorCode.CyberYellow,
    backgroundColor: colorCode.white,
  },
  tabButton: {
    paddingVertical: normalize(10, "height"),
    paddingHorizontal: normalize(18),
    marginHorizontal: normalize(10),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: normalize(16),
    color: "#888",
  },
  activeTab: {
    borderBottomColor: "#FFA500",
  },
  activeTabText: {
    color: "#FFA500",
  },
  isNotTabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  isNotTabButton: {
    paddingVertical: normalize(10, "height"),
    paddingHorizontal: normalize(22),
    marginHorizontal: normalize(20),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  isNotTabText: {
    fontSize: normalize(17),
    color: "#888",
  },
});