import React from "react";
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
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: normalize(12),
    padding: normalize(16),
    marginVertical: normalize(12, "height"),
    marginHorizontal: normalize(16),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: normalize(6),
    elevation: 4,
  },
  chatButton: {
    backgroundColor: "#008CBA",
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(8),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  chatButtonText: {
    fontSize: normalize(14),
    marginLeft: normalize(8),
    color: "#fff",
    fontWeight: "600",
  },
  orderContent: {
    flex: 1,
  },
  orderDetails: {
    marginBottom: normalize(12, "height"),
  },
  orderId: {
    fontSize: normalize(16),
    marginTop: normalize(2, "height"),
    fontWeight: "bold",
    color: "#222",
  },
  customerName: {
    fontSize: normalize(14),
    color: "#444",
    marginBottom: normalize(10, "height"),
  },
  orderDate: {
    fontSize: normalize(14),
    color: "#666",
  },
  orderInfo: {
    fontSize: normalize(14),
    color: "#333",
    lineHeight: normalize(20, "height"),
  },
  label: {
    fontWeight: "bold",
    color: "#111",
  },
  paymentStatus: {
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  paidStatus: {
    marginTop: normalize(5, "height"),
    color: "#228B22",
  },
  unpaidStatus: {
    marginTop: normalize(5, "height"),
    color: "#D32F2F",
  },
  orderItemContainer: {
    flexDirection: "row",
    backgroundColor: colorCode.lightYellow,
    borderRadius: normalize(10),
    padding: normalize(12),
    marginTop: normalize(6, "height"),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  imageAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderImage: {
    width: normalize(55),
    height: normalize(55),
    borderRadius: normalize(10),
    marginRight: normalize(12),
  },
  textContainer: {
    flex: 1,
  },
  orderItemName: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#222",
  },
  orderItemPrice: {
    fontSize: normalize(14),
    color: "#555",
  },
  orderItemQuantity: {
    fontSize: normalize(14),
    color: "#777",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: normalize(12, "height"),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(8),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  reviewButton: {
    backgroundColor: "#2E7D32",
  },
  ShippingButton: {
    backgroundColor: "#1565C0",
  },
  buttonText: {
    fontSize: normalize(14),
    color: "#fff",
    fontWeight: "600",
    marginLeft: normalize(6),
  },
  buttonCancelled: {
    backgroundColor: "#B71C1C",
    paddingVertical: normalize(8, "height"),
    paddingHorizontal: normalize(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    borderRadius: normalize(6),
  },
  buttonTextCancelled: {
    color: "#fff",
    fontSize: normalize(13),
    fontWeight: "bold",
    marginLeft: normalize(6),
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: normalize(20, "height"),
    fontSize: normalize(16),
    color: "#888",
  },
  container: {
    flex: 1,
    backgroundColor: colorCode.lightYellow,
  },
  orderItemText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonCancelledContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end", marginLeft: 10
  },
});
