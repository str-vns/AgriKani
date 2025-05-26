import { StyleSheet, Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width / 375; // 375 is a common base width (iPhone 11)

function normalize(size) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  weatherDailyContainer: {
    width: width * 0.92, // 92% of screen width
    backgroundColor: "#fff",
    borderRadius: normalize(16),
    padding: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: normalize(8),
    elevation: 5,
  },
  titleText: {
    fontSize: normalize(22),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: normalize(16),
    letterSpacing: 1,
  },
  marginContainer: {
    marginBottom: normalize(16),
  },
  noLoadText: {
    color: "#b00",
    textAlign: "center",
    fontSize: normalize(14),
  },
  itemsCenter: {
    alignItems: "center",
  },
  dailyImg: {
    width: normalize(80),
    height: normalize(80),
    marginBottom: normalize(8),
  },
  textdesign: {
    fontSize: normalize(18),
    fontWeight: "600",
  },
  weatherWeeklyContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: normalize(10),
    marginRight: normalize(10),
    padding: normalize(10),
    alignItems: "center",
    minWidth: normalize(100),
  },
  date: {
    fontWeight: "bold",
    marginBottom: normalize(4),
    fontSize: normalize(14),
  },
  weeklyImg: {
    width: normalize(40),
    height: normalize(40),
    marginBottom: normalize(4),
  },
  ellpses: {
    fontSize: normalize(12),
    color: "#555",
  },
  button: {
    marginTop: normalize(16),
    backgroundColor: "#EDC001",
    borderRadius: normalize(8),
    paddingVertical: normalize(10),
    alignItems: "center",
  },
  closeText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: normalize(16),
  },
});