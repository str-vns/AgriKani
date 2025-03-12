import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,  // Ensures full screen coverage
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  reasonButton: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedReason: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  bigInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Changed to white to remove gray padding
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,  // Optional: Keep a subtle border
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
});
