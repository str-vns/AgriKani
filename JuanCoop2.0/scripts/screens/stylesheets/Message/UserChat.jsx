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
    backgroundColor: "#fff",
    paddingBottom: normalize(10, "height"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10, "height"),
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: normalize(10),
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8, "height"), 
    marginRight: normalize(6),
    minHeight: normalize(40, "height"),
    maxHeight: normalize(120, "height"),
    textAlignVertical: "center",
},
  sendButton: {
    backgroundColor: "#f7b900",
    paddingVertical: normalize(10, "height"),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(10),
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    marginRight: normalize(10),
  },
  image: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(8),
  },
  deleteButton: {
    position: "absolute",
    top: normalize(5, "height"),
    right: normalize(5),
    backgroundColor: "white",
    borderRadius: normalize(12),
    padding: normalize(5),
  },
  noMessages: {
    textAlign: "center",
    marginTop: normalize(20, "height"),
    fontSize: normalize(18),
    color: "#808080",
  },
  iconRight: {
    marginRight: normalize(10),
    top: normalize(8, "height"),
  },
});