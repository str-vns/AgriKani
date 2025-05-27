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
  container: {
    flex: 1,
    backgroundColor: colorCode.lightYellow,
    paddingBottom: normalize(15, "height"),
  },
  section: {
    marginVertical: normalize(10, "height"),
    paddingHorizontal: normalize(15),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: normalize(8, "height"),
  },
  overallRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: normalize(5, "height"),
  },
  ratingText: {
    fontSize: normalize(16),
  },
  feedback: {
    fontSize: normalize(14),
    fontStyle: "italic",
    color: colorCode.darkGray,
    marginBottom: normalize(5, "height"),
  },
  review: {
    flexDirection: "row",
    padding: normalize(10),
    marginBottom: normalize(10, "height"),
    backgroundColor: colorCode.lightYellow,
    borderRadius: normalize(8),
    elevation: 2,
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
  reviewName: {
    fontWeight: "bold",
    fontSize: normalize(14),
  },
  additionalRatings: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(3, "height"),
  },
  ratingCategory: {
    fontSize: normalize(14),
    marginRight: normalize(5),
  },
  reviewMessage: {
    fontSize: normalize(14),
    color: colorCode.darkGray,
    marginTop: normalize(5, "height"),
  },
  sentiment: {
    fontSize: normalize(14),
    color: colorCode.darkGray,
    marginTop: normalize(5, "height"),
  },
  noReviews: {
    textAlign: "center",
    fontSize: normalize(14),
    color: colorCode.lightGray,
    marginTop: normalize(10, "height"),
  },
});