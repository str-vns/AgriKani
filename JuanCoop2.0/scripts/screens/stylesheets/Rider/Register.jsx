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
  scrollContent: {
    padding: normalize(20),
    paddingBottom: normalize(100, "height"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20, "height"),
  },
  backButton: {
    marginRight: normalize(10),
  },
  backText: {
    fontSize: normalize(16),
    color: colorCode.black,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: normalize(20, "height"),
  },
  profileImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: colorCode.lightGray,
    marginBottom: normalize(10, "height"),
  },
  uploadText: {
    fontSize: normalize(16),
    color: colorCode.black,
  },
  form: {
    marginBottom: normalize(20, "height"),
  },
  input: {
    height: normalize(40, "height"),
    borderWidth: 1,
    borderColor: colorCode.black,
    borderRadius: normalize(15),
    paddingHorizontal: normalize(10),
    marginBottom: normalize(15, "height"),
    backgroundColor: colorCode.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: normalize(20),
    borderTopWidth: 1,
    borderColor: colorCode.lightGray,
    backgroundColor: colorCode.white,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colorCode.orange,
    borderRadius: normalize(5),
    padding: normalize(10),
    flex: 0.45,
  },
  cancelText: {
    textAlign: "center",
    color: colorCode.orange,
    fontSize: normalize(16),
  },
  saveButton: {
    backgroundColor: colorCode.orange,
    borderRadius: normalize(5),
    padding: normalize(10),
    flex: 0.45,
  },
  saveText: {
    textAlign: "center",
    color: colorCode.white,
    fontSize: normalize(16),
  },
  ImageCard: {
    padding: normalize(32, "height"),
    paddingHorizontal: normalize(36),
    borderWidth: 1,
    borderColor: colorCode.black,
    borderRadius: normalize(7),
    marginHorizontal: normalize(9),
    backgroundColor: colorCode.white,
  },
  image: {
    padding: normalize(58, "height"),
    paddingHorizontal: normalize(61),
    borderWidth: 1,
    borderColor: colorCode.black,
    borderRadius: normalize(7),
    marginHorizontal: normalize(9),
    backgroundColor: colorCode.white,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
  },
  imageInfo: {
    justifyContent: "center",
  },
  imageButton: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: normalize(13, "height"),
  },
  imageText: {
    fontSize: normalize(13),
    alignSelf: "flex-start",
    textAlign: "left",
    marginBottom: normalize(7, "height"),
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: normalize(18),
    borderRadius: normalize(9),
    alignItems: "center",
    elevation: 5,
  },
  errorText: {
    color: "red",
    fontSize: normalize(13),
    textAlign: "center",
    marginTop: normalize(7, "height"),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: normalize(252),
    marginTop: normalize(20, "height"),
  },
  genderContainer: {
    width: "100%",
    borderColor: colorCode.black,
    borderWidth: 1,
    borderRadius: normalize(15),
    marginBottom: normalize(13, "height"),
    overflow: "hidden",
  },
  pickerStyle: {
    width: "100%",
    height: normalize(45, "height"),
    color: colorCode.black,
    backgroundColor: colorCode.white,
  },
  pickerStyle2: {
    width: "100%",
    flex: 1,
    height: normalize(45, "height"),
    color: colorCode.black,
    backgroundColor: colorCode.white,
    borderWidth: 1,
    borderColor: colorCode.lightGray,
    borderRadius: normalize(5),
    justifyContent: "center",
    paddingHorizontal: normalize(30),
    marginBottom: normalize(13, "height"),
    backgroundColor: colorCode.lightGray,
  },
  scrollContent2: {
    padding: normalize(20),
    paddingTop: normalize(211, "height"),
  },
  label: {
    fontSize: normalize(16),
    marginBottom: normalize(10, "height"),
    color: colorCode.black,
  },
  result: {
    fontSize: normalize(18),
    marginTop: normalize(20, "height"),
    fontWeight: "bold",
  },
  showAllButton: {
    flexDirection: "row",
    paddingVertical: normalize(10, "height"),
    alignItems: "center",
    justifyContent: "center",
  },
  showAllButtonText: {
    color: colorCode.primary ,
    fontSize: normalize(14),
    fontWeight: "bold",
    marginRight: normalize(8),
    marginLeft: normalize(40),
  },
  productCard: {
    padding: normalize(10),
    marginBottom: normalize(15, "height"),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: colorCode.lightGray,
    backgroundColor: colorCode.white,
  },
  productDetails: {
    marginBottom: normalize(10, "height"),
  },
  cityBarangayBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(10),
    borderWidth: 1,
    borderColor: colorCode.lightGray,
    borderRadius: normalize(5),
    backgroundColor: colorCode.lightGray,
    marginTop: normalize(5, "height"),
  },
  cityText: {
    fontSize: normalize(16),
    fontWeight: '500',
    marginRight: normalize(10),
  },
  trashIcon: {
    marginLeft: normalize(5),
  },
  arrowIcon: {
    marginLeft: normalize(5),
  },
  checkbox: {
    width: normalize(20),
    height: normalize(20),
    borderWidth: 2,
    borderColor: '#f2d728',
    borderRadius: normalize(4),
    marginRight: normalize(8),
  },
  checked: {
    backgroundColor: '#f2d728',
  },
  containerTermAndPolicy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(20, "height"),
  },
  agreement: {
    fontSize: normalize(12),
    color: "#777",
    textAlign: "center",
    marginTop: normalize(20, "height"),
  },
  linkText: {
    color: "#007bff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    height: "60%",
    backgroundColor: "white",
    padding: normalize(20),
    borderRadius: normalize(10),
    alignItems: "center",
  },
  modalText: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: normalize(10, "height"),
  },
  termsTextContainer: {
    flex: 1,
    maxHeight: "70%",
    width: "100%",
  },
  termsText: {
    fontSize: normalize(14),
    textAlign: "justify",
    paddingHorizontal: normalize(5),
  },
  closeButton: {
    marginTop: normalize(10, "height"),
    padding: normalize(10),
    backgroundColor: "#2196F3",
    borderRadius: normalize(5),
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});