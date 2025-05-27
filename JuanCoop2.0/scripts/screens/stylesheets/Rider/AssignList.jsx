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
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colorCode.white,
    padding: normalize(15),
    marginHorizontal: normalize(10),
    marginVertical: normalize(5, "height"),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: colorCode.lightGray,
    elevation: 3,
  },
  orderInfo: {
    flex: 2,
  },
  name: {
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(5, "height"),
  },
  orderNumber: {
    fontSize: normalize(14),
    color: colorCode.darkGray,
  },
  status: {
    color: colorCode.warning,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  deliverButton: {
    backgroundColor: colorCode.warning,
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(15),
    marginBottom: normalize(10, "height"),
  },
  buttonText: {
    color: colorCode.white,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  detailsButton: {
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(12),
  },
  detailsText: {
    color: colorCode.primary,
    fontSize: normalize(14),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: normalize(18),
    color: colorCode.darkGray,
  },
  headerButton: {
    paddingHorizontal: normalize(12),
  },
});
