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
    backgroundColor: colorCode.lightYellow,
    flex: 1,
    marginBottom: normalize(60, "height"),
  },
  containerCooP: {
    backgroundColor: "#fffee9",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(25, "height"),
    paddingBottom: normalize(15, "height"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  drawerButton: {
    marginRight: normalize(10),
  },
  notificationsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  notificationSection: {
    padding: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  notifDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  notifImageContainer: {
    marginRight: normalize(16),
  },
  notifImage: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
  },
  notifTextContainer: {
    flex: 1,
  },
  timestamp: {
    fontSize: normalize(12),
    color: "#999",
    textAlign: "right",
  },
  notificationHeader: {
    fontWeight: "bold",
    fontSize: normalize(16),
    flex: 1,
  },
  notificationLine: {
    fontSize: normalize(14),
  },
  notifHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(5, "height"),
  },
  readNotification: {
    backgroundColor: "white",
  },
  unreadNotification: {
    backgroundColor: "#FFFBC8",
  },
  ReadAllText: {
    color: "#FFA500",
    fontSize: normalize(16),
    textAlign: "right",
    padding: normalize(10),
    marginRight: normalize(10),
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: normalize(16),
    color: "gray",
    marginTop: normalize(20, "height"),
  },
});