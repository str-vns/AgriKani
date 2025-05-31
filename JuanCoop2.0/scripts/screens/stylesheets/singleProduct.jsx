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
    backgroundColor: "#fff",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: normalize(20),
  },
  farmerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(16),
    marginHorizontal: normalize(16),
  },
  farmerInfo2: {
    flexDirection: "row",
    alignItems: "center",
  },
  farmerImage: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    marginRight: normalize(8),
  },
  farmerName: {
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  location: {
    fontSize: normalize(12),
    color: "#888",
  },
  ratingContainer: {
    marginLeft: "auto",
  },
  box: {
    backgroundColor: "#fefdf9",
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  boxText: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  quantity: {
    fontSize: normalize(16),
    color: "#333",
    marginHorizontal: normalize(10),
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    marginVertical: normalize(20),
  },
  scrollContainer: {
    paddingBottom: normalize(160),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    backgroundColor: "#f7b900",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: normalize(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: normalize(20),
    borderRadius: normalize(20),

  },
  garlicMainImage: {
    width: normalize(200),
    height: normalize(200),
  },
  productName: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: normalize(16),
    marginVertical: normalize(10),
  },
  price: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#e76f51",
    marginHorizontal: normalize(16),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stock: {
    fontSize: normalize(14),
    alignItems: "flex-start",
    marginHorizontal: normalize(10),
  },
  productHeading: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginHorizontal: normalize(16),
    marginTop: normalize(8),
  },
  productDescription: {
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
    fontSize: normalize(14),
    color: "#666",
    lineHeight: normalize(22),
    textAlign: "justify",
  },
  reviewsHeader: {
    fontSize: normalize(18),
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
    fontWeight: "bold",
  },
  review: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(16),
  },
  reviewImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: normalize(10),
  },
  reviewDate:
{
    fontSize: normalize(10),
    color: colorCode.lightGray,
    marginBottom: normalize(4),
  },
  reviewHeaderContainer:{
    flexDirection: "row",
    flex: 1,
  },
 reviewImageContainer: {
  flexDirection: "row",
  marginTop: normalize(4),
  marginBottom: normalize(8),
  paddingHorizontal: normalize(0), 
},
reviewMessage: {
  fontSize: normalize(14),
  lineHeight: normalize(22),
  marginTop: normalize(-10), 
  color: "#333",
},
  reviewProfile: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewName: {
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  contentContainerStyle:{
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(50),
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: normalize(8),
    borderRadius: normalize(4),
  },
  quantityButtonText: {
    fontSize: normalize(18),
    color: "#333",
  },
  rating: {
    marginLeft: normalize(10),
  },
  buttonContainer: {
    position: "absolute",
    bottom: normalize(65),
    left: 0,
    right: 0,
    padding: normalize(16),
    backgroundColor: "#FFFFFF",
  },
  productNameAndWishlistContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: normalize(5),
    marginBottom: normalize(10),
  },
  addToCartButton: {
    backgroundColor: "#fcbf49",
    paddingVertical: normalize(12),
    borderRadius: normalize(5),
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  priceAndQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(10),
  },
  stockContainer: {
    marginHorizontal: normalize(20),
    marginVertical: normalize(20),
  },
  stockCard: {
    padding: normalize(20),
    margin: normalize(5),
    backgroundColor: "#f2f2f2",
    borderRadius: normalize(5),
    paddingHorizontal: normalize(30),
  },
  stockCardSelected: {
    padding: normalize(20),
    margin: normalize(5),
    borderRadius: normalize(5),
    paddingHorizontal: normalize(30),
    backgroundColor: "#fff7e6",
  },
  StockAndQContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: normalize(10),
    marginTop: normalize(15),
  },
  stock2: {
    fontSize: normalize(14),
  },
  quantityContainer2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: normalize(10),
  },
  quantityButton2: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: normalize(8),
    borderRadius: normalize(4),
  },
  quantityButtonText2: {
    fontSize: normalize(18),
    color: "#333",
  },
  quantity2: {
    fontSize: normalize(16),
    color: "#333",
    marginHorizontal: normalize(10),
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: normalize(10),
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: normalize(10),
  },
  reviewFooterText: {
    fontSize: normalize(12),
    color: "#888",
  },
});