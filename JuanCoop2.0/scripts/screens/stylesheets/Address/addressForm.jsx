import { Dimensions, StyleSheet } from "react-native";

var { width, height } = Dimensions.get("window");
export default StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0 / 1.2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  input: {
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  mapContainer: {
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  resultsList: {
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  error: {
    color: "red",
  },
  errorContainer: {
    padding: 10,
    marginTop: -20,
    justifyContent: "center",
    alignItems: "center",
  },
});
