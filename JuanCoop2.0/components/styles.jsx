import { StyleSheet } from "react-native";
//Dashboard
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  burgerIconContainer: {
    padding: 5,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#666b5e", // Adding the color here
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fefdf9",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  filterIcon: {
    marginLeft: 10,
  },
  categoryScrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingLeft: 16,
  },
  categoryBox: {
    alignItems: "center",
    backgroundColor: "#fef8e5",
    padding: 10,
    borderRadius: 8,
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
     width: '100%',
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20 ,
  },
  productBox: {
    width: 150,
    backgroundColor: "#fefdf9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",  // Keep relative positioning to allow absolute positioning of the icon
  },
  
  productImage: {
    width: 110,
    height: 120,
    marginBottom: 10,
    borderRadius: 8,  // Keep the border radius to round the corners
    overflow: "hidden",  // Ensure the wishlist icon stays inside the rounded image corners
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888888",
  },
  wishlistIcon: {
    position: "absolute",
    top: 5,  // Adjust to place icon on the top inside the image
    right: 5,  // Adjust to place icon on the right inside the image
    zIndex: 1,  // Make sure the icon stays above the image
    backgroundColor: "	rgb(232,232,232)",  // Optional: add a semi-transparent background for visibility
    borderRadius: 12,  // Optional: to give the icon a rounded background
    padding: 5,  // Optional: adjust for better touch area
  },
  plusIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#f7b900",
    padding: 8,
    borderRadius: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
