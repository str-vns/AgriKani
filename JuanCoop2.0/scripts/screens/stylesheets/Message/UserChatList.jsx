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
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: colorCode.lightYellow,
  },
  selectedChatItem: {
    backgroundColor: colorCode.lemonYellow,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
  },
  onlineIndicator: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: "green",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  offlineIndicator: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: "gray",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatTextContainer: {
    marginLeft: normalize(10),
  },
  name: {
    fontWeight: "bold",
    fontSize: normalize(16),
  },
  message: {
    color: "#777",
    marginTop: normalize(2, "height"),
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  time: {
    color: "#999",
    fontSize: normalize(12),
  },
  unreadBadge: {
    backgroundColor: "#f7b900",
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
    marginTop: normalize(5, "height"),
  },
  unreadCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: normalize(12),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15, "height"),
    paddingBottom: normalize(15, "height"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  header2: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15, "height"),
    paddingBottom: normalize(15, "height"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  headerTitle2: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});