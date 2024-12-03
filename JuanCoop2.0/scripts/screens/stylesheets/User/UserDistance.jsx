import { Container } from "native-base";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overallContainer: {
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 550,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  imageContainer: 
 {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  detailContainerNull: {
    backgroundColor: 'white',
    padding: 16,
    margin: 10,
    borderRadius: 8,
  },
  textNullDetail: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
