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
  productCard: {
    backgroundColor: colorCode.white,
    borderRadius: normalize(10),
    margin: normalize(10),
    padding: normalize(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(15),
    borderBottomWidth: normalize(1),
    borderBottomColor: "#ccc",
  },
  productImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(15),
    marginRight: normalize(15),
  },
   productDetails: {
    flex: normalize(1),
  },
  productName: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: "#333",
  },
  productDescription: {
    fontSize: normalize(14),
    color: "#777",
  },
});
