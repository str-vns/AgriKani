import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
      },
      profileContainer: {
        alignItems: "center",
        paddingVertical: 20,
      },
      profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
      },
      profileName: {
        fontSize: 18,
        fontWeight: "bold",
      },
      profileRole: {
        fontSize: 14,
        color: "#666",
      },
      menuContainer: {
        flex: 1,
        paddingHorizontal: 20,
      },
      menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
      },
      menuLabel: {
        fontSize: 16,
        color: "#666",
        marginLeft: 15,
      },
      activeLabel: {
        color: "#000", 
      },
      footerContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
      },
      logoutButton: {
        backgroundColor: "#f7b900",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
      },
      logoutLabel: {
        fontSize: 16,
        color: "#fff",
        marginLeft: 15,
      },
})