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
    backgroundColor: '#fff',
  },
  messageContainer: {
    marginVertical: normalize(10, "height"),
    marginHorizontal: normalize(15),
    padding: normalize(10),
    borderRadius: normalize(10),
    maxWidth: '80%',
  },
  messageText: {
    fontSize: normalize(16),
  },
  received: {
    backgroundColor: colorCode.CyberYellow,
    alignSelf: 'flex-start',
  },
  sent: {
    backgroundColor: colorCode.lightYellow,
    alignSelf: 'flex-end',
  },
  time: {
    fontSize: normalize(12),
    color: '#555',
    alignSelf: 'flex-end',
    marginTop: normalize(5, "height"),
    paddingLeft: normalize(10),
  },
  imageContainer: {
    marginVertical: normalize(5, "height"),
  },
  messageImage: {
    width: normalize(100),
    height: normalize(100),
    marginRight: normalize(10),
    borderRadius: normalize(10),
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});