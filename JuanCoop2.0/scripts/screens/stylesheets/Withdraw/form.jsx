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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorCode.lightYellow,
  },
  card: {
    padding: normalize(20),
    backgroundColor: colorCode.white,
    borderRadius: normalize(10),
    shadowColor: colorCode.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    alignItems: "center",
  },
  label: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: colorCode.black,
    marginBottom: normalize(5, "height"),
  },
  input: {
    width: "100%",
    padding: normalize(10),
    borderWidth: 1,
    borderColor: colorCode.gray,
    borderRadius: normalize(5),
    marginBottom: normalize(10, "height"),
    fontSize: normalize(16),
  },
  disabledInput: {
    backgroundColor: colorCode.lightGray,
    color: colorCode.darkGray,
  },
  confirmButton: {
    backgroundColor: colorCode.CyberYellow,
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: "center",
    marginTop: normalize(20, "height"),
  },
  buttonText: {
    color: colorCode.black,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});