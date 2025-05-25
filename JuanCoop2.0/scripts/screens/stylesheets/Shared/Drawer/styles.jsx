import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    width: width,
    shoppingHeader: {
      backgroundColor: "#f7b900",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: "#e1e1e1",
      width: width,
    },
  },
  burgerIconContainer: {
    marginRight: width * 0.02,
  },
  titleText: {
    fontSize: Math.round(width * 0.05),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "black",
  },
  backMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backMessageImage: {
    width: Math.round(width * 0.08),
    height: Math.round(width * 0.08),
    borderRadius: Math.round(width * 0.04),
  },
  backMessageText: {
    fontSize: Math.round(width * 0.05),
    fontWeight: "bold",
    marginLeft: width * 0.02,
    color: "#666b5e",
  },
  onlinePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: Math.round(width * 0.06),
    height: Math.round(width * 0.06),
    borderRadius: Math.round(width * 0.04),
  },
  picker: {
    width: Math.round(width * 0.08),
    height: Math.round(width * 0.08),
    borderRadius: Math.round(width * 0.04),
  },
});
