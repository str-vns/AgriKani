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
  ItemCard: {
    backgroundColor: colorCode.white,
    borderRadius: normalize(12),
    marginHorizontal: normalize(10),
    marginVertical: normalize(6),
    padding: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  ImageProps: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(10),
    marginRight: normalize(16),
    backgroundColor: "#f2f2f2",
  },
  ItemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  ItemName: {
    fontSize: normalize(17),
    fontWeight: "bold",
    color: "#222",
    marginBottom: normalize(4),
  },
  ItemDescription: {
    fontSize: normalize(14),
    color: "#777",
    marginBottom: normalize(4),
  },
   statusText: {
    fontSize: normalize(13),
    fontWeight: "bold",
    marginBottom: normalize(2),
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: normalize(8),
    justifyContent: "space-between",
    width: normalize(80),
  },
  iconButton: {
    marginHorizontal: normalize(4),
  },
  StatusDesc: {
    fontSize: normalize(12),
    color: "#555",
  },
  viewButton: {
  backgroundColor: "#FFA500",
  paddingVertical: normalize(8),
  paddingHorizontal: normalize(18),
  borderRadius: normalize(20),
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: normalize(4),
},
viewButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: normalize(16),
},
});
