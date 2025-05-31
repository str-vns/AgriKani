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
    flexGrow: 1,
    backgroundColor: colorCode.lightYellow,
    padding: normalize(20),
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  productImage: {
    width: "50%",
    height: 200,
    alignSelf: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },

  subText: {
    fontSize: 14,
    textAlign: "center",
    color: colorCode.darkGray,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  textInput: {
    borderColor: colorCode.black,
    backgroundColor: "#FFFFFF",
    textAlignVertical: "top",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
    height: 120,
    width: "100%",
    fontSize: 16,
  },
  button: {
    backgroundColor: colorCode.CyberYellow,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    width: "50%",
  },
  buttonText: {
    color: colorCode.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewSection: {
    flexDirection: "column",
    alignItems: "center",
  },
  reviewCat: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  starContainer: {
    alignSelf: "center",
    paddingBottom: 10,
  },
  containerButton: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colorCode.black,
    backgroundColor: colorCode.CyberYellow,
    padding: 5,
    paddingHorizontal: 15,
  },
  imageSize: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 0,
    borderRadius: 50,
    padding: 10,
  },
});
