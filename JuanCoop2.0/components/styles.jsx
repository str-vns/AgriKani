import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window"); // <-- Add this line

//Dashboard
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: height * 0.12, // Example: 12% of screen height
    marginTop: height * 0.025,
    paddingHorizontal: width * 0.04,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.025,
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.025,
  },
  burgerIconContainer: {
    padding: width * 0.012,
    marginRight: width * 0.025,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#666b5e",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fefdf9",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    marginBottom: height * 0.025,
    marginHorizontal: width * 0.04,
  },
  searchBar: {
    flex: 1,
    fontSize: width * 0.04,
  },
  filterIcon: {
    marginLeft: width * 0.025,
  },
  categoryScrollContainer: {
    flexDirection: "row",
    marginBottom: height * 0.025,
    paddingLeft: width * 0.04,
  },
  categoryBox: {
    alignItems: "center",
    backgroundColor: "#fef8e5",
    padding: width * 0.025,
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
    width: width * 0.21,
  },
  categoryIcon: {
    width: width * 0.15,
    height: height * 0.07,
    resizeMode: 'contain',
    marginBottom: height * 0.006,
  },
  categoryText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.012,
    paddingHorizontal: width * 0.04,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
  },
  productBox: {
    width: width * 0.38,
    height: height * 0.25,
    backgroundColor: "#fefdf9",
    padding: width * 0.025,
    borderRadius: width * 0.02,
    marginBottom: height * 0.025,
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: width * 0.31,
    height: height * 0.14,
    marginBottom: height * 0.012,
    borderRadius: width * 0.02,
    overflow: "hidden",
  },
  productName: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    marginBottom: height * 0.006,
    textAlign: "center",
  },
  productPrice: {
    fontSize: width * 0.032,
    fontWeight: "bold",
    color: "#888888",
  },
  wishlistIcon: {
    position: "absolute",
    top: height * 0.006,
    right: width * 0.012,
    zIndex: 1,
    backgroundColor: "rgb(232,232,232)",
    borderRadius: width * 0.03,
    padding: width * 0.012,
  },
  plusIcon: {
    position: "absolute",
    bottom: height * 0.012,
    right: width * 0.025,
    backgroundColor: "#f7b900",
    padding: width * 0.02,
    borderRadius: width * 0.05,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;