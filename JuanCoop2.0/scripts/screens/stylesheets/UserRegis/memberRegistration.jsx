import { StyleSheet, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({  
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: width * 0.05, // 5% of the width for padding
        backgroundColor: "#fff",
    },
    logo: {
        width: width * 0.3, // 30% of the screen width
        height: width * 0.3, // Maintain square shape
        marginBottom: height * 0.01, // 1% of the screen height
    },
    title: {
        fontSize: width * 0.06, // Scale font size based on screen width
        fontWeight: "bold",
        marginBottom: height * 0.02,
    },
    subtitle: {
        fontSize: width * 0.045,
        fontWeight: "500",
        marginBottom: height * 0.015,
    },
    registerButton: {
        width: "100%",
        backgroundColor: "#f7b900",
        padding: height * 0.02,
        borderRadius: width * 0.025,
        alignItems: "center",
        marginBottom: height * 0.1,
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: width * 0.045,
    },
    input: {
        width: "100%",
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: width * 0.025,
        marginBottom: height * 0.02,
        fontSize: width * 0.04,
        color: "#333",
    },
    CoopContainer: {
        width: "100%",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: width * 0.025,
        marginBottom: height * 0.02,
        overflow: "hidden",
    },
    pickerStyle: {
        width: "100%",
        height: height * 0.07,
        color: "#333",
        backgroundColor: "#fff",
    },
    image: {
        padding: height * 0.09,
        paddingHorizontal: width * 0.17,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: width * 0.02,
        marginHorizontal: width * 0.025,
        backgroundColor: "white", 
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: width * 0.05,
        borderRadius: width * 0.025,
        alignItems: "center",
        elevation: 5,
    },
    errorText: {
        color: "red",
        fontSize: width * 0.035,
        textAlign: "center",
        marginTop: height * 0.01,
    },
    ImageCard: {
        padding: height * 0.05,
        paddingHorizontal: width * 0.1,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: width * 0.02,
        marginHorizontal: width * 0.025,
        backgroundColor: "white",   
    },
    cardContent: {
        flex: 1,
        flexDirection: "row", 
    },
    imageInfo: {
        justifyContent: "center",
    },
    imageButton:{
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginBottom: height * 0.02,
        
    },
    textHeaderInput: {
        fontSize: width * 0.04,
        fontWeight: "bold",
        alignSelf: "flex-start", 
        textAlign: "left",
        marginBottom: height * 0.01, 
    },
    imageText: {
        fontSize: width * 0.035,
        alignSelf: "flex-start", 
        textAlign: "left", 
        marginBottom: height * 0.01,
        fontWeight: "bold",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: width * 0.70,
        marginTop: 20,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#fff",
      },
      headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        color: "#333",
      },
});
