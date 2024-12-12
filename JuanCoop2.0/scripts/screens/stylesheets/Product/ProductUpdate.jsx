import React from 'react';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        marginVertical: 10,
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      dropdown: {
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
      },
      dropdownText: {
        fontSize: 16,
      },
      modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContainer: {
        width: "80%",
        maxHeight: "80%", // Limits height to avoid exceeding screen
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        overflow: "hidden", // Ensures content stays within bounds
      },
      checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
      },
      checkboxTick: {
        width: 12,
        height: 12,
        backgroundColor: "#000",
      },
      checkboxLabel: {
        marginLeft: 10,
      },
      closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        alignItems: "center",
      },
      closeButtonText: {
        color: "#fff",
        fontSize: 16,
      },
      checkboxGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "48%",
        marginVertical: 5,
      },
      selectImageButton: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
      },
      imageContainer: {
        position: "relative",
        marginRight: 10,
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: "hidden",
      },
      deleteButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 5,
      },
      error: {
        color: "red",
      },
    
      inventoryCard: {
        padding: 10,
        paddingHorizontal: 40,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        marginHorizontal: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start', 
      },
      cardContent: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      stockInfo: {
        justifyContent: 'center',
      },
      stockTextLarge: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      stockTextSmall: {
        fontSize: 12,
        color: 'black',
      },
      actionButtons: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
     
})