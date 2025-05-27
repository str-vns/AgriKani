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
    flex: 1,
    padding: normalize(20),
    backgroundColor: colorCode.lightYellow,
  },
  label: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginTop: normalize(10, "height"),
    color: "#333",
  },
  info: {
    fontSize: normalize(18),
    paddingVertical: normalize(5, "height"),
    color: "#555",
  },
  buttonContainer: {
    marginTop: normalize(20, "height"),
  },
  confirmButton: {
    backgroundColor: colorCode.CyberYellow,
    paddingVertical: normalize(12, "height"),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(8),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colorCode.black,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});