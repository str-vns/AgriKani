import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: "#fffee9",
        flex: 1,
        marginBottom: 55,
    },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },

  drawerButton: {
    marginRight: 10,
  },

  notificationsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  
},
notificationSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Adjust border color as needed
},
notifDetails: {
    flexDirection: 'row',
    alignItems: 'center',
},
notifImageContainer: {
    marginRight: 16,
},
notifImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
},
notifTextContainer: {
    flex: 1,
},
timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
},
notificationHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1
},
notificationLine: {
    fontSize: 14,
},
notifHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
},
readNotification: {
    backgroundColor: 'white',
  },

  unreadNotification: {
    backgroundColor: '#FFFBC8',
  },
  ReadAllText: {
    color: '#FFA500',
    fontSize: 16,
    textAlign: 'right',
    padding: 10,
    marginRight: 10,
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

