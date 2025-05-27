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

export default StyleSheet.create({ 
  container: {
    padding: normalize(16),
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: normalize(16, "height"),
    padding: normalize(16),
    backgroundColor: '#FFF',
    borderRadius: normalize(8),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  ratingNumber: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: normalize(4, "height"),
  },
  ratingStars: {
    flexDirection: 'row',
  },
  suggestionCard: {
    marginBottom: normalize(16, "height"),
    padding: normalize(16),
    backgroundColor: '#FFD700',
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCard: {
    flexDirection: 'row',
    padding: normalize(16),
    marginBottom: normalize(16, "height"),
    backgroundColor: '#FFF',
    borderRadius: normalize(8),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(12),
  },
  reviewDetails: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#333',
  },
  reviewDate: {
    fontSize: normalize(12),
    color: '#666',
  },
  reviewStars: {
    flexDirection: 'row',
    marginVertical: normalize(4, "height"),
  },
  reviewComment: {
    fontSize: normalize(14),
    color: '#333',
  },
  starIcon: {
    marginHorizontal: normalize(2),
  },
});