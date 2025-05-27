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
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20, "height"),
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: normalize(20, "height"),
  },
  profileImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
  },
  emailText: {
    marginTop: normalize(10, "height"),
    fontSize: normalize(16),
    color: "#777",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: normalize(8),
    padding: normalize(12),
    marginVertical: normalize(10, "height"),
    borderColor: "#ddd",
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: "#f7b900",
    padding: normalize(15),
    borderRadius: normalize(8),
    alignItems: "center",
    marginTop: normalize(20, "height"),
  },
  buttonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  modalView: {
    margin: normalize(20),
    backgroundColor: "white",
    borderRadius: normalize(20),
    padding: normalize(35),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: normalize(15, "height"),
    textAlign: "center",
    fontSize: normalize(18),
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15, "height"),
    paddingBottom: normalize(15, "height"),
    backgroundColor: "#fff",
  },
  registrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(20),
  },
  registrationOptionsContainer: {
    marginTop: normalize(20, "height"),
    alignItems: "center",
  },
  editFarmButton: {
    backgroundColor: "#4CAF50",
    padding: normalize(15),
    borderRadius: normalize(10),
    marginVertical: normalize(10, "height"),
    width: "80%",
    alignItems: "center",
  },
  editFarmButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  registerCoopButton: {
    backgroundColor: "#2196F3",
    padding: normalize(15),
    borderRadius: normalize(10),
    marginVertical: normalize(10, "height"),
    width: "80%",
    alignItems: "center",
  },
  registerCoopButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  joinMemberContainer: {
    marginTop: normalize(15, "height"),
    alignItems: "center",
  },
  joinMemberText: {
    fontSize: normalize(16),
    color: "#333",
    marginBottom: normalize(5, "height"),
  },
  joinMemberLinkButton: {
    marginTop: normalize(5, "height"),
  },
  joinMemberLinkText: {
    color: "#007BFF",
    fontSize: normalize(16),
    textDecorationLine: "underline",
  },
});
