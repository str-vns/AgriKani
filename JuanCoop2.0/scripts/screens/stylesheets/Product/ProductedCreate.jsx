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
    backgroundColor: colorCode.lightYellow,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colorCode.black,
    padding: normalize(10),
    borderRadius: normalize(20),
    marginBottom: normalize(15),
    backgroundColor: colorCode.white,
  },
  dropdownText: {
    fontSize: normalize(16),
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8,
    maxHeight: height * 0.8,
    backgroundColor: colorCode.white,
    borderRadius: normalize(10),
    padding: normalize(20),
    overflow: "hidden",
  },
  checkbox: {
    width: normalize(20),
    height: normalize(20),
    borderWidth: 1,
    borderColor: colorCode.black,
    borderRadius: normalize(3),
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxTick: {
    width: normalize(12),
    height: normalize(12),
    backgroundColor: colorCode.black,
  },
  checkboxLabel: {
    marginLeft: normalize(10),
  },
  closeButton: {
    marginTop: normalize(20, "height"),
    padding: normalize(10),
    backgroundColor: colorCode.CyberYellow,
    borderRadius: normalize(15),
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: normalize(15),
    color: colorCode.black,
    fontWeight: "bold",
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginVertical: normalize(5, "height"),
  },
  selectImageButton: {
    fontSize: normalize(18),
    marginTop: normalize(10, "height"),
    marginBottom: normalize(10, "height"),
    textAlign: "center",
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
    overflow: "hidden",
  },
  deleteButton: {
    position: "absolute",
    top: normalize(5),
    right: normalize(5),
    backgroundColor: colorCode.error,
    borderRadius: normalize(12),
    padding: normalize(5),
  },
  error: {
    color: colorCode.error,
  },
  trikyHeader: {
    padding: normalize(15),
  },
  input: {
    borderWidth: 1,
    borderColor: colorCode.black,
    padding: normalize(10),
    borderRadius: normalize(20),
    marginBottom: normalize(15),
    backgroundColor: colorCode.white,
  },
  labelText: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(5, "height"),
    marginLeft: normalize(10),
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
});
