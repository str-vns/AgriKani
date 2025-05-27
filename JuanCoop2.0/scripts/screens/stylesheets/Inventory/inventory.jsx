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

  splitContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: normalize(20),
    overflow: "hidden",
    marginBottom: normalize(15),
    backgroundColor: colorCode.white,
    borderColor: colorCode.black,
  },
  inputLeft: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    backgroundColor: colorCode.white,
    borderColor: colorCode.black,
    fontSize: normalize(16),
  },
  inputRight: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colorCode.white,
    borderColor: colorCode.black,
    fontSize: normalize(16),
  },
  pickerStyle: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: colorCode.black,
    padding: normalize(10),
    paddingTop: normalize(15, "height"),
    paddingBottom: normalize(15, "height"),
    borderRadius: normalize(20),
    marginBottom: normalize(15),
    backgroundColor: colorCode.white,
  },
  scrollViewContainer: {
    padding: normalize(20),
  },
  backButton: {
    marginRight: normalize(10),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(5, "height"),
    marginLeft: normalize(10),
    color: colorCode.black,
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  saveButton: {
    backgroundColor: colorCode.CyberYellow,
    padding: normalize(15),
    borderRadius: normalize(15),
    alignItems: "center",
    marginTop: normalize(30),
  },
  saveButtonText: {
    fontSize: normalize(18),
    color: colorCode.black,
    fontWeight: "bold",
  },
  error: {
    color: colorCode.red,
    fontSize: normalize(16),
    marginBottom: normalize(10),
    justifyContent: "center",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
});