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
    justifyContent: "center",
    backgroundColor: colorCode.lightYellow,
  },
  header: {
    fontSize: normalize(26),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(30, "height"),
    textAlign: "center",
  },
  button: {
    paddingVertical: normalize(15, "height"),
    paddingHorizontal: normalize(30),
    borderRadius: normalize(10),
    alignItems: "center",
    marginVertical: normalize(12, "height"),
    elevation: 3,
  },
  buttonText: {
    color: colorCode.black,
    fontSize: normalize(18),
    fontWeight: "600",
  },
  codButton: {
    backgroundColor: "#4CAF50",
  },
  cardButton: {
    backgroundColor: colorCode.PASTELGREEN,
  },
  paypalButton: {
    backgroundColor: colorCode.PASTELBLUE,
  },
});