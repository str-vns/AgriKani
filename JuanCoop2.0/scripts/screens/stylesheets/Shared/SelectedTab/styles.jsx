import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: width * 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  tabButton: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTab: {
    borderBottomColor: "#FFA500",
  },
  activeTabText: {
    color: "#FFA500",
  },
  isNotTabContiner: {
    flexDirection: "row",
    justifyContent: "center",
    width: width * 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  isNotTabButton: {
    padding: 10,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  isNotTabText: {
    fontSize: 17,
    color: "#888",
  },
});
