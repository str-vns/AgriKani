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
    padding: normalize(20),
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: normalize(20),
    marginTop: normalize(-20),
    width: normalize(500),
    maxWidth: normalize(500),
  },
  logo: {
    width: normalize(100),
    height: normalize(100),
    resizeMode: "contain",
    marginBottom: normalize(5),
    marginTop: normalize(10),
  },
  title: {
    fontSize: normalize(30),
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: normalize(14),
    textAlign: "center",
    marginTop: normalize(6),
    color: "white",
    maxWidth: normalize(300),
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#2C3E50",
    alignSelf: "flex-start",
    marginTop: normalize(20),
  },
  sectionDescription: {
    fontSize: normalize(14),
    color: "#7f8c8d",
    marginTop: normalize(5),
    marginBottom: normalize(10),
    alignSelf: "flex-start",
    lineHeight: normalize(20),
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: normalize(12),
    overflow: "hidden",
    marginBottom: normalize(20),
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  ctaButton: {
    backgroundColor: "#f39c12",
    paddingVertical: normalize(14, "height"),
    paddingHorizontal: normalize(40),
    borderRadius: normalize(12),
    marginBottom: normalize(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: normalize(3, "height") },
    shadowOpacity: 0.1,
    shadowRadius: normalize(5),
    elevation: 5,
  },
  ctaText: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#ffffff",
  },
  carousel: {
    width: "100%",
    marginBottom: normalize(30),
  },
  carouselImage: {
    width: width * 0.6,
    height: normalize(160, "height"),
    marginRight: normalize(15),
    borderRadius: normalize(12),
  },
  creatorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: normalize(30),
  },
  creatorCard: {
    width: "47%",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    padding: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(15),
    borderWidth: normalize(1),
    borderColor: "#ececec",
  },
  creatorImage: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    marginBottom: normalize(8),
    borderWidth: normalize(2),
    borderColor: "#f39c12",
  },
  creatorName: {
    fontSize: normalize(14),
    fontWeight: "600",
    color: "#2C3E50",
  },
  coopContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: normalize(40),
    gap: normalize(10),
  },
  coopLogo: {
    width: normalize(60),
    height: normalize(60),
    resizeMode: "contain",
    margin: normalize(8),
  },
  coverImage: {
    width: "100%",
    paddingHorizontal: normalize(20),
    height: normalize(200, "height"),
    borderRadius: normalize(12),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: normalize(12),
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});