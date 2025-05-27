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
    padding: normalize(12),
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
    color: "#666",
  },
  status: {
    color: "#FFC107",
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  deliverButton: {
    backgroundColor: colorCode.CyberYellow,
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(15),
    marginBottom: normalize(10, "height"),
  },
  buttonText: {
    color: colorCode.black,
    fontSize: normalize(14),
    fontWeight: "bold",

  },
  detailsButton: {
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(12),
  },
  detailsText: {
    color: colorCode.blue,
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
  circle: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
    left: normalize(36),
  },
  circleText: {
    color: "white",
    fontWeight: "bold",
  },
  pickerContainer: {
    marginTop: normalize(10, "height"),
    width: "10%",
    alignSelf: "flex-end",
  },
  picker: {
    height: normalize(20, "height"),
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: normalize(5),
  },
  TextTop: {
    fontSize: normalize(12),
    fontWeight: "bold",
    left: normalize(15),
    marginTop: normalize(10, "height"),
    marginBottom: normalize(5, "height"),
  },
  drawerContainer: {
    flexDirection: "column",
  },
});