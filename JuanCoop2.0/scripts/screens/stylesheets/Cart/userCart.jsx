import { StyleSheet, Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const scaleFont = (size) => (width / 375) * size; 

const scale = (size) => (width / 375) * size;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
    paddingHorizontal: scale(20), 
    backgroundColor: "#f7b900",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: scaleFont(20), 
    fontWeight: "bold",
    textAlign: "center",
  },
  itemCount: {
    fontSize: scaleFont(18), 
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(15), 
    backgroundColor: "#FFFFFF",
    borderRadius: scale(10), 
    marginHorizontal: scale(15), 
    marginVertical: scale(8), 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: {
    width: scale(60), 
    height: scale(60), 
    borderRadius: scale(10), 
    marginRight: scale(15),
  },
  itemDetails: {
    flex: 1,
  },
  unitName: {
    fontSize: 12, 
    color: "#333",
  },
  itemName: {
    fontSize: scaleFont(16), 
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: scaleFont(14), 
    color: "#ff6347",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: scale(10), 
    padding: scale(5), 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartButton: {
    paddingHorizontal: scale(10), 
  },
  cartButtonText: {
    fontSize: scaleFont(18), 
    fontWeight: "bold",
    color: "#3b82f6",
  },
  quantity: {
    fontSize: scaleFont(16), 
    fontWeight: "600",
    paddingHorizontal: scale(10),
  },
  emptyCart: {
    fontSize: scaleFont(18), 
    textAlign: "center",
    marginTop: scale(20),
    color: "#888",
  },
  totalContainer: {
    padding: scale(40),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: scale(20), 
    borderTopRightRadius: scale(20), 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
    marginBottom: scale(50), 
  },
  totalText: {
    fontSize: scaleFont(18), 
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#f7b900",
    borderRadius: scale(10), 
    bottom: scale(10), 
    paddingVertical: scale(10), 
    paddingHorizontal: scale(100), 
    marginTop: scale(15), 
  },
  buttonText: {
    color: "#FFF",
    fontSize: scaleFont(16), 
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff6347",
    fontSize: scaleFont(11), 
    marginTop: scale(10),
    marginBottom: scale(5),
  },
  ShippingFeeText: {
    fontSize: scaleFont(15), 
    color: "#333",
    marginBottom: scale(5),
  },
});
