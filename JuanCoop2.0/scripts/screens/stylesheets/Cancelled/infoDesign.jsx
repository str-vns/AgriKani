import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Function to scale sizes proportionally
const scale = (size) => (width / 375) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    marginTop: moderateScale(40),
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: moderateScale(20),
  },
  cancelledByText: {
    fontSize: moderateScale(18),
    color: "#333",
    marginBottom: moderateScale(10),
  },
  boldText: {
    fontWeight: "bold",
  },
  reasonContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: moderateScale(15),
    borderRadius: scale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  reasonTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#444",
    marginBottom: moderateScale(5),
  },
  reasonText: {
    fontSize: moderateScale(14),
    color: "#666",
  },
  containerNo: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(15),
    paddingBottom: moderateScale(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  orderItemsContainer: {
    width: "90%",
    marginBottom: moderateScale(20),
    padding: moderateScale(15),
    backgroundColor: "#fff",
    borderRadius: scale(10),
    marginTop: moderateScale(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: moderateScale(10),
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: moderateScale(10),
    borderRadius: scale(8),
    marginBottom: moderateScale(10),
  },
  itemImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(5),
    marginRight: moderateScale(15),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#444",
  },
  itemQuantity: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: moderateScale(2),
  },
  noItemsText: {
    fontSize: moderateScale(14),
    color: "#888",
    textAlign: "center",
    marginTop: moderateScale(10),
  },
});
