import { StyleSheet } from "react-native";

const dashboards = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
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
    backgroundColor: "#fff",
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
    paddingHorizontal: 16,
  },
  productBox: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  productDiscount: {
    fontSize: 12,
    color: "#FF5722",
  },
  wishlistIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  plusIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#4CAF50",
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

export default dashboards;
