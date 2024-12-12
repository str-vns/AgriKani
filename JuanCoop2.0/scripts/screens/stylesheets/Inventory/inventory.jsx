import React from "react";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  splitContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
  },
  inputLeft: {
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    fontSize: 16,
   
  },
  inputRight: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
  },
  pickerStyle: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  scrollViewContainer: {
    padding: 20,
  },
  backButton: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FEC120",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
    marginTop: -10,
},  
error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    justifyContent: "center",
    textAlign: "center",

},
disabledButton: {
    backgroundColor: '#a0a0a0', // Dimmed color for disabled state
  },
});
