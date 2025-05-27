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
    backgroundColor: "#f9f9f9",
  },
  orderButton: {
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(8),
    backgroundColor: "#D3D3D3",
    minWidth: normalize(120),
    alignItems: "center",
  },
  status: {
    fontSize: normalize(15),
    fontWeight: "bold",
  },
  containerNo: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
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
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20, "height"),
  },
  profileImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    marginRight: normalize(10),
  },
  riderNameTitle: {
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  riderName: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: "#333",
  },
  instructions: {
    fontSize: normalize(14),
    marginBottom: normalize(10, "height"),
    color: "#555",
  },
  orderRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: normalize(15, "height"),
    borderWidth: 1,
    padding: normalize(15),
    borderRadius: normalize(15),
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryText: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: "#333",
  },
  orderText: {
    fontSize: normalize(14),
    color: "#555",
    marginBottom: normalize(5, "height"),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  trashButton: {
    padding: normalize(10),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  assignedButton: {
    backgroundColor: "#007BFF",
  },
  alreadyAssignedButton: {
    backgroundColor: "#D55AC5",
  },
  orderButtonText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    color: "#fff",
  },
  disabledButtonText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(8),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: normalize(15),
  },
  buttonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});