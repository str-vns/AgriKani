import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create ({
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backGroundContainer: {
  minWidth: width * 0.35,
  maxWidth: width * 0.7, 
  minHeight: height * 0.04,
  backgroundColor: "#FFC000",
  borderRadius: 16,
  padding: width * 0.04,
  alignSelf: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
  marginTop: height * 0.20,
  justifyContent: "center",
  alignItems: "center",
    
  },
  contentText: {
    fontSize: Math.round(width * 0.042),
    textAlign: "center",
    color: "#333",
    marginBottom: height * 0.01,
    flexWrap: "wrap",
  },
});
