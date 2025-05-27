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
  mapContainer: {
    flex: 1,
    backgroundColor: colorCode.white,
    justifyContent: "center",
    width: "100%",
    height: height * 0.5,
  },
  mapPlaceholderText: {
    color: colorCode.white,
    fontSize: normalize(16),
  },
  detailsContainer: {
    backgroundColor: colorCode.white,
    padding: normalize(30),
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
  },
  driverInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20, "height"),
  },
  driverTextContainer: {
    marginLeft: normalize(15),
  },
  driverName: {
    fontSize: normalize(18),
    fontWeight: "bold",
  },
  driverDetails: {
    fontSize: normalize(14),
    color: "#555",
  },
  driverPhone: {
    fontSize: normalize(14),
    color: "#888",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: normalize(10, "height"),
  },
  messageButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: normalize(15, "height"),
    borderRadius: normalize(5),
    alignItems: "center",
    flex: 1,
    marginRight: normalize(10),
  },
  dropOffButton: {
    backgroundColor: "#FFC107",
    paddingVertical: normalize(15, "height"),
    borderRadius: normalize(5),
    alignItems: "center",
    flex: 1,
    marginLeft: normalize(10),
  },
  buttonText: {
    color: colorCode.black,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  alternateRouteContainer: {
    position: "absolute",
    bottom: normalize(10, "height"),
    left: normalize(10),
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: normalize(10),
    borderRadius: normalize(5),
  },
  routeOption: {
    padding: normalize(10),
  },
  routeOptionText: {
    fontSize: normalize(16),
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: normalize(18),
    color: "#fff",
    marginBottom: normalize(20, "height"),
  },
  modalRouteOption: {
    padding: normalize(10),
    backgroundColor: "#fff",
    marginBottom: normalize(10, "height"),
    borderRadius: normalize(5),
  },
  modalCloseButton: {
    marginTop: normalize(20, "height"),
    padding: normalize(10),
    backgroundColor: "#333",
    borderRadius: normalize(5),
  },
  modalCloseText: {
    color: "#fff",
    fontSize: normalize(16),
  },
  zoomUser: {
    position: "absolute",
    bottom: normalize(500, "height"),
    left: normalize(10),
    zIndex: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: normalize(10),
    borderRadius: normalize(5),
  },
  backButton: {
    position: "absolute",
    top: normalize(20, "height"),
    left: normalize(10),
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: normalize(10),
    borderRadius: normalize(20),
  },
  totalAmountContainer: {
    alignItems: "flex-end",
  },
  totalAmountText: {
    fontSize: normalize(13),
    fontWeight: "bold",
    color: colorCode.black,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: colorCode.lightYellow,
  },
 chatButton: {
  marginLeft: 10,
  alignSelf: "flex-start",
  padding: 6,
},
});