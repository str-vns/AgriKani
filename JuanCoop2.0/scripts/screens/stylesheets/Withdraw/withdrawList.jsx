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
    padding: normalize(20),
    backgroundColor: colorCode.lightYellow,
  },
  balanceContainer: {
    backgroundColor: "#6200EE",
    padding: normalize(15),
    borderRadius: normalize(10),
    alignItems: "center",
    marginBottom: normalize(10, "height"),
  },
  balanceText: {
    color: "#fff",
    fontSize: normalize(18),
    fontWeight: "bold",
  },
  withdrawButton: {
    backgroundColor: "#FF9800",
    padding: normalize(12),
    borderRadius: normalize(10),
    alignItems: "center",
    marginBottom: normalize(10, "height"),
  },
  withdrawText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: normalize(15),
    marginVertical: normalize(5, "height"),
    borderRadius: normalize(8),
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionText: {
    fontSize: normalize(14),
    color: "#333",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  dateText: {
    justifyContent: "center",
    alignItems: "flex-end",
    fontSize: normalize(14),
    color: "#333",
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
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  container2: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  withdrawConnect: {
    flexDirection: "column",
    alignItems: "center",
  },
  transactionStatus: (status) => ({
    color:
      status === "SUCCESS" ? "green" : status === "PENDING" ? "orange" : "red",
    fontWeight: "bold",
    fontSize: normalize(14),
  }),
});
