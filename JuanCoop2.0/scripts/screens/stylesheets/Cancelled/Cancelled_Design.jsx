import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const scale = (size) => (width / 375) * size; 

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: scale(16),
        top: scale(30),
    },
    card: {
        backgroundColor: "white",
        padding: scale(20),
        borderRadius: scale(16),
        width: "90%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: scale(5),
    },
    title: {
        fontSize: scale(20),
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: scale(10),
    },
    description: {
        color: "#6b7280",
        marginBottom: scale(10),
        fontSize: scale(14),
    },
    reasonButton: {
        padding: scale(10),
        borderWidth: scale(1),
        borderColor: "#d1d5db",
        borderRadius: scale(8),
        marginBottom: scale(8),
        width: "100%",
        alignItems: "center",
    },
    selectedReason: {
        backgroundColor: "#d1d5db",
    },
    reasonText: {
        color: "#374151",
        fontSize: scale(14),
    },
    bigInput: {
        marginTop: scale(10),
        borderWidth: scale(1),
        borderColor: "#d1d5db",
        borderRadius: scale(8),
        padding: scale(10),
        width: "100%",
        backgroundColor: "#fff",
        height: scale(100),
        textAlignVertical: "top",
        fontSize: scale(14),
    },
    buttonGroup: {
        flexDirection: "row",
        marginTop: scale(16),
        gap: scale(10),
    },
    button: {
        padding: scale(10),
        backgroundColor: "#ddd",
        borderRadius: scale(8),
        alignItems: "center",
    },
});
