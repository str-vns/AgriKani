import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../../../components/styles";
import CategoryFilter from "../Filter/CategoryFilter";
import ProductList from "./ProductList";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "@redux/Actions/productActions";
import { allCoops } from "@redux/Actions/coopActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profileuser } from "@redux/Actions/userActions";
import { categoryList } from "@src/redux/Actions/categoryActions";
import messaging from "@react-native-firebase/messaging";

const ProductContainer = () => {
  const { products, error } = useSelector((state) => state.allProducts);
  const { coops } = useSelector((state) => state.allofCoops);
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const [refreshing, setRefreshing] = useState(false);
  const [focus, setFocus] = useState(false);
  const [token, setToken] = useState();
  const [active, setActive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [searchtext, setSearchText] = useState("");
  const [productFilter, setProductFilter] = useState([]);
  const [coopFilter, setCoopFilter] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const searchProduct = (text) => {
    if (!text.trim()) {
      setProductFilter(products);
      setCoopFilter(coops);
      setFocus(false);
      setSearchText("");
    } else {
      setProductFilter(
        products.filter((item) =>
          item.productName.toLowerCase().includes(text.toLowerCase())
        )
      );

      setCoopFilter(
        coops.filter((item) =>
          item.farmName.toLowerCase().includes(text.toLowerCase())
        )
      );

      setFocus(true);
      setSearchText(text);
    }
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
          messaging()
            .getToken()
            .then((token) => {
              setFcmToken(token);
            });
          dispatch(Profileuser(userId, res));
        } else {
          setErrors("No JWT token found.");
        }
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setErrors("Failed to retrieve JWT token.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);
      dispatch(getProduct());
      dispatch(categoryList());
      dispatch(allCoops());
    }, [dispatch])
  );

  const searchHandler = () => {
    navigation.navigate("SearchProduct", {
      productFilter: productFilter,
      coopFilter: coopFilter,
    });
    setSearchText("");
  };

  function shuffleArray(array) {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  const shuffledProducts =
    products && products.length > 0 ? shuffleArray(products) : [];

    const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([
      dispatch(getProduct()),
      dispatch(categoryList()),
      dispatch(allCoops()),
    ]).finally(() => setRefreshing(false));
  }, [dispatch]);
  return loading ? (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
       refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Any food search here"
          placeholderTextColor="#999"
          value={searchtext}
          onChangeText={searchProduct}
          onFocus={openList}
          onBlur={onBlur}
        />

        <TouchableOpacity
          style={styles.filterIconWrapper}
          onPress={searchHandler}
        >
          <Ionicons
            name="search-outline"
            size={28}
            color="black"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>All Categories</Text>
      <ScrollView horizontal>
        {categories && categories.length > 0 ? (
          categories.map((item) => {
            return (
              <CategoryFilter key={item?._id?.$oid || item?._id} item={item} />
            );
          })
        ) : (
          <View>
            <Text>No Categories Found</Text>
          </View>
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>All Products</Text>
      <ScrollView>
        {shuffledProducts && shuffledProducts.length > 0 ? (
          <View style={styles.productContainer}>
            {shuffledProducts.map((item) => {
              return (
                <ProductList key={item?._id?.$oid || item?._id} item={item} />
              );
            })}
          </View>
        ) : (
          <View>
            <Text>No Products Found</Text>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default ProductContainer;
