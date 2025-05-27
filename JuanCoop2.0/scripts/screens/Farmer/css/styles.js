import { StyleSheet, Dimensions, PixelRatio } from "react-native";
const { width, height } = Dimensions.get("window");
const baseWidth = 360;
const baseHeight = 640;
const scaleWidth = (size) => (width / baseWidth) * size;
const scaleHeight = (size) => (height / baseHeight) * size;

const normalize = (size, based = "width") => {
  const newSize = based === "height" ? scaleHeight(size) : scaleWidth(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const styles = StyleSheet.create({
  coopdashboardContainer: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    padding: normalize(20),
  },
  coopdashboardHeader: {
    backgroundColor: "#FFD700",
    paddingVertical: normalize(15),
    borderRadius: normalize(10),
    alignItems: "center",
    marginBottom: normalize(15),
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  coopdashboardTitle: {
    fontSize: normalize(22),
    fontWeight: "bold",
    color: "#333",
  },
  coopdashboardSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(15),
  },
  coopdashboardSummaryCard: {
    flex: 1,
    backgroundColor: "#FFD700",
    borderRadius: normalize(12),
    padding: normalize(15),
    alignItems: "center",
    marginHorizontal: normalize(5),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  coopdashboardSummaryTitle: {
    fontSize: normalize(15),
    fontWeight: "600",
    color: "#333",
  },
  coopdashboardSummaryValue: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    marginTop: normalize(5),
  },
  coopdashboardSalesContainer: {
    backgroundColor: "#fff",
    padding: normalize(15),
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    elevation: 3,
  },
  coopdashboardSalesTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
  },
  coopdashboardPicker: {
    height: normalize(55),
    width: normalize(150),
  },
  coopdashboardChart: {
    marginTop: normalize(10),
    borderRadius: normalize(10),
  },
  coopdashboardNoDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: normalize(14),
    marginTop: normalize(10),
  },
  coopdashboardTopProductsContainer: {
    backgroundColor: "#fff",
    padding: normalize(15),
    borderRadius: normalize(10),
    marginTop: normalize(10),
    elevation: 3,
  },
  coopdashboardTopProductsTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(10),
  },
  coopdashboardTopProductRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  coopdashboardTopProductText: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: normalize(16),
    margin: normalize(4),
    borderRadius: normalize(8),
    alignItems: "center",
    elevation: 2,
  },
  statTitle: {
    fontSize: normalize(16),
    color: "#777",
  },
  statValue: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "#333",
  },
  totalOrdersCard: {
    backgroundColor: "#fff",
    padding: normalize(16),
    borderRadius: normalize(8),
    alignItems: "center",
    marginBottom: normalize(16),
    elevation: 2,
  },
  totalOrdersTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#555",
  },
  totalOrdersValue: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#007BFF",
  },
  chartsContainer: {
    marginTop: normalize(16),
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: normalize(16),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    elevation: 2,
  },
  chartTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#555",
    marginBottom: normalize(8),
  },
  //container
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1", // Background color
  },
  scrollViewContainer: {
    padding: normalize(20),
    flexGrow: 1,
  },
  orderItemContainer: {
    padding: normalize(15), // Padding around the item container
    marginBottom: normalize(10), // Margin between items in the list
    backgroundColor: "#fff", // White background for better readability
    borderRadius: normalize(8), // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOpacity: normalize(0.1), // Light shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowRadius: normalize(6), // Blur radius for shadow
  },
  imageAndTextContainer: {
    flexDirection: "row", // Align the image and text in a row
    alignItems: "center", // Vertically align image and text in the center
  },

  textContainer: {
    flexDirection: "column", // Stack the text vertically
    justifyContent: "center", // Vertically center the text within the container
  },
  orderItemName: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333", // Dark color for the product name
  },
  orderItemPrice: {
    fontSize: normalize(16),
    color: "#555", // Light gray color for price
  },
  orderItemQuantity: {
    fontSize: normalize(16),
    color: "#555", // Light gray color for quantity
  },

  //header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(15),
    backgroundColor: "#fff",
    borderBottomWidth: normalize(1),
    borderBottomColor: "#ddd",
    elevation: normalize(2), // Add shadow effect
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },

  //button
  backButton: {
    marginRight: normalize(10),
  },
  addButton: {
    marginLeft: normalize(10),
  },
  iconButton: {
    marginHorizontal: normalize(10),
  },
  drawerButton: {
    marginRight: normalize(10),
  },
  menuButton: {
    marginRight: normalize(10),
  },
  saveButton: {
    backgroundColor: "#FEC120",
    padding: normalize(15),
    borderRadius: normalize(5),
    alignItems: "center",
    marginTop: normalize(30),
  },
  saveButtonText: {
    fontSize: normalize(18),
    color: "#000",
    fontWeight: "bold",
  },
  iconButtons: {
    flexDirection: "row",
  },

  //profile
  profileContainer: {
    alignItems: "center",
    marginVertical: normalize(20),
  },
  profileImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    borderWidth: normalize(2),
    borderColor: "#fff",
    marginBottom: normalize(10),
  },
  profileName: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#000",
  },
  profileFollowing: {
    fontSize: normalize(16),
    color: "#888",
    marginVertical: normalize(5),
  },
  editProfile: {
    fontSize: normalize(16),
    marginTop: normalize(10),
  },

  //profile product
  prodSection: {
    marginTop: normalize(10),
  },
  prodList: {
    paddingBottom: normalize(20),
  },
  prodrow: {
    justifyContent: "space-between",
    marginBottom: normalize(15),
  },
  prodCard: {
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    width: "47%",
    shadowColor: "#f7b900",
    shadowOffset: { width: normalize(6), height: normalize(6) },
    shadowOpacity: normalize(0.5),
    shadowRadius: normalize(5),
    elevation: normalize(3),
    padding: normalize(10),
    alignItems: "center",
    justifyContent: "center",
  },
  prodImage: {
    width: normalize(100),
    height: normalize(100),
    marginBottom: normalize(10),
  },
  prodName: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(5),
    textAlign: "center",
  },
  prodDescription: {
    fontSize: normalize(14),
    color: "#666",
    textAlign: "center",
    marginBottom: normalize(5),
  },
  prodpriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  prodprice: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  prodoldPrice: {
    fontSize: normalize(14),
    textDecorationLine: "line-through",
    color: "#999",
    marginLeft: normalize(5),
    textAlign: "center",
  },

  //product
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(15),
    borderBottomWidth: normalize(1),
    borderBottomColor: "#ccc",
  },
  productImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(15),
    marginRight: normalize(15),
  },
  productDetails: {
    flex: normalize(1),
  },
  productName: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: "#333",
  },
  productDescription: {
    fontSize: normalize(14),
    color: "#777",
  },

  // dashboard
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: normalize(20),
  },
  tabButton: {
    padding: normalize(10),
    marginHorizontal: normalize(10),
    borderBottomWidth: normalize(2),
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFA500", // Orange underline for active tab
  },
  tabText: {
    fontSize: normalize(16),
    color: "#888",
  },
  activeTabText: {
    color: "#FFA500", // Orange text for active tab
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: normalize(30),
  },
  salesText: {
    fontSize: normalize(16),
    color: "#888",
  },
  salesValue: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "#FFA500", // Orange color for sales value
    marginVertical: normalize(10),
  },
  chartStyle: {
    marginVertical: normalize(10),
    borderRadius: normalize(16),
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    marginBottom: normalize(30),
  },
  statBox: {
    width: "47%",
    backgroundColor: "#f7f7f7",
    padding: normalize(15),
    borderRadius: normalize(10),
    marginBottom: normalize(20),
  },
  statTitle: {
    fontSize: normalize(14),
    color: "#888",
  },
  statValue: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    marginVertical: normalize(5),
  },
  statChangePositive: {
    fontSize: normalize(12),
    color: "green",
  },
  statChangeNegative: {
    fontSize: normalize(12),
    color: "red",
  },
  //image picker
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(15),
    borderColor: "#ccc",
    borderWidth: normalize(1),
    borderRadius: normalize(5),
    padding: normalize(10),
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: normalize(50),
    height: normalize(50),
    marginRight: normalize(10),
  },
  imagePickerText: {
    fontSize: normalize(16),
    color: "#333",
  },
  reviewButton: {
    backgroundColor: "#4caf50",
    marginLeft: normalize(250),
  },
  ShippingButton: {
    backgroundColor: "#0000FF",
    marginLeft: normalize(250),
  },
  DeliveredButton: {
    backgroundColor: "#008000",
    marginLeft: normalize(250),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(5),
    //width: "45%",
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: normalize(10),
    padding: normalize(15), // Increased padding for more spacing
    marginVertical: normalize(10),
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderContent: {
    flexDirection: "row",
    alignItems: "flex-start", // Adjusted alignment for order content
  },
  orderImage: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(10),
    marginRight: normalize(10),
  },
  orderDetails: {
    flex: 1,
    flexDirection: "column",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(10),
  },
  orderId: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#2D3748",
  },
  orderInfo: {
    fontSize: normalize(16),
    color: "#4A5568",
    marginTop: normalize(5),
  },
  orderStatus: {
    fontSize: normalize(16),
    marginTop: normalize(10),
    fontWeight: "500",
  },
  statusPending: {
    color: "#E53E3E", // Red for pending
  },
  statusDelivered: {
    color: "#38A169", // Green for delivered
  },
  statusShipped: {
    color: "#3182CE", // Blue for shipped
  },
  statusCancelled: {
    color: "#D69E2E", // Yellow for cancelled
  },
  listContainer: {
    paddingBottom: normalize(20),
  },
  // New styles for added fields
  orderDate: {
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#718096",
    marginTop: normalize(5),
  },
  customerName: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#2C5282",
    marginTop: normalize(5),
  },
  customerContact: {
    fontSize: normalize(14),
    color: "#718096",
    marginTop: normalize(5),
  },
  deliveryAddress: {
    fontSize: normalize(14),
    color: "#4A5568",
    marginTop: normalize(5),
  },
  orderNotes: {
    fontSize: normalize(14),
    color: "#4A5568",
    fontStyle: "italic", // Make notes italic for differentiation
    marginTop: normalize(5),
  },
  paymentStatus: {
    fontSize: normalize(16),
    fontWeight: "500",
    marginTop: normalize(10),
  },
  paidStatus: {
    color: "#38A169", // Green for paid
  },
  unpaidStatus: {
    color: "#E53E3E", // Red for unpaid
  },

  // forum
  forumPost: {
    backgroundColor: "#FFFFFF",
    borderRadius: normalize(10),
    padding: normalize(15),
    marginBottom: normalize(15),
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(10),
  },
  postTopic: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#333",
  },
  postAuthor: {
    fontSize: normalize(14),
    color: "#888",
  },
  postContent: {
    fontSize: normalize(16),
    color: "#4A5568",
    marginBottom: normalize(10),
  },
  postComments: {
    fontSize: normalize(14),
    color: "#888",
  },

  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(15, "height"),
    paddingHorizontal: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatAvatar: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(15),
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#333",
  },
  chatMessage: {
    fontSize: normalize(14),
    color: "#999",
    marginTop: normalize(4, "height"),
  },
  chatTime: {
    fontSize: normalize(12),
    color: "#999",
    textAlign: "right",
  },

  // Chat
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingVertical: normalize(15, "height"),
    paddingHorizontal: normalize(10),
  },
  chatList: {
    paddingHorizontal: normalize(10),
  },
  inputContainer: {
    flexDirection: "row",
    padding: normalize(10),
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: normalize(10),
    borderRadius: normalize(25),
    backgroundColor: "#f9f9f9",
    marginRight: normalize(10),
  },
  sendButton: {
    backgroundColor: "#FFA500",
    padding: normalize(10),
    borderRadius: normalize(25),
    justifyContent: "center",
    alignItems: "center",
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: normalize(5, "height"),
  },
  botMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: normalize(5, "height"),
  },
  useravatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  userMessage: {
    maxWidth: "75%",
    backgroundColor: "#FFA500",
    padding: normalize(10),
    borderRadius: normalize(20),
    borderBottomRightRadius: 0,
    color: "#fff",
  },
  botMessage: {
    maxWidth: "75%",
    backgroundColor: "#f1f0f0",
    padding: normalize(10),
    borderRadius: normalize(20),
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: normalize(16),
    color: "#333",
  },
  messageTime: {
    fontSize: normalize(12),
    color: "#000000",
    textAlign: "right",
    marginTop: normalize(5, "height"),
  },

  // Reviews & Ratings
  reviewContainer: {
    flexDirection: "row",
    marginBottom: normalize(20, "height"),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: normalize(10),
  },
  avatar: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(10),
  },
  reviewContent: {
    flex: 1,
  },
  username: {
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  date: {
    fontSize: normalize(14),
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: normalize(5, "height"),
  },
  comment: {
    fontSize: normalize(14),
    color: "#333",
  },

  // Initiatives screen
  initiativesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: normalize(20),
  },
  initiativeButton: {
    width: "40%",
    backgroundColor: "#FFF5D7",
    alignItems: "center",
    padding: normalize(20),
    borderRadius: normalize(10),
    marginVertical: normalize(10, "height"),
  },
  initiativeIcon: {
    width: normalize(60),
    height: normalize(60),
    marginBottom: normalize(10, "height"),
  },
  initiativeTitle: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#333",
  },

  // Financial Assistance
  assistanceContainer: {
    padding: normalize(20),
  },
  assistanceButton: {
    backgroundColor: "#FFF5D7",
    padding: normalize(20),
    borderRadius: normalize(10),
    marginVertical: normalize(10, "height"),
  },
  assistanceTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
  },
  assistanceDescription: {
    fontSize: normalize(14),
    color: "#777",
    marginTop: normalize(5),
  },

  // Government Loan Program screen
  programContainer: {
    padding: normalize(20),
    alignItems: "center",
  },
  programImage: {
    width: normalize(200),
    height: normalize(200),
    marginBottom: normalize(20),
  },
  programTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: normalize(10),
  },
  programDescription: {
    fontSize: normalize(16),
    textAlign: "center",
    color: "#555",
    marginBottom: normalize(20),
  },
  moreButton: {
    backgroundColor: "#FEC120",
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(30),
    borderRadius: normalize(5),
  },
  moreButtonText: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#000",
  },

  // other
  label: {
    fontSize: normalize(16),
    fontWeight: "500",
    marginBottom: normalize(5),
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: normalize(10),
    borderRadius: normalize(5),
    marginBottom: normalize(15),
    backgroundColor: "#f9f9f9",
  },

  bannerContainer: {
    padding: normalize(10),
    backgroundColor: "#ffe6e6",
    borderRadius: normalize(8),
    marginHorizontal: normalize(10),
    marginTop: normalize(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  bannerText: {
    fontWeight: "bold",
    color: "#d9534f",
    marginRight: normalize(5),
  },

  productText: {
    color: "#d9534f",
    textAlign: "center",
    marginRight: normalize(5),
  },

  productContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  centeredContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  stockText: {
    color: "#d9534f",
    textAlign: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: normalize(10),
    marginVertical: normalize(10),
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: "#007BFF",
    marginHorizontal: normalize(5),
  },

  reviewButton: {
    backgroundColor: "#4CAF50",
  },

  ShippingButton: {
    backgroundColor: "#FFC107",
  },

  buttonText: {
    color: "#fff",
    marginLeft: normalize(5),
    fontSize: normalize(14),
  },

  buttonCancelled: {
    backgroundColor: "#4CAF50",
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(5),
    marginLeft: normalize(80),
  },

  buttonTextCancelled: {
    color: "white",
    fontWeight: "bold",
  },

  UnavailableText: {
    fontWeight: "bold",
    fontSize: normalize(16),
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(16),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },

  productName: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(12),
    textAlign: "center",
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: normalize(4),
    marginBottom: normalize(6),
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: normalize(14),
    color: "#555",
  },

  cellHeader: {
    fontWeight: "600",
    fontSize: normalize(14),
    color: "#777",
  },

  invContainer: {
    backgroundColor: "#fff",
    padding: normalize(15),
    flex: 1,
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    elevation: 3,
  },

  scrollViewContainer: {
    paddingBottom: normalize(20),
  },
});

export default styles;
