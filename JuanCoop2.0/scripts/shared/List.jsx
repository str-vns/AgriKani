import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "@screens/stylesheets/Shared/List/style";
import { useNavigation } from "@react-navigation/native";

export const ListItems = (props) => {
  const {
    item,
    onEdit,
    onDelete,
    onActivate,
    onRestore,
    isArchive,
    isInventory,
  } = props;
  return (
    <View style={styles.ItemCard}>
      <Image
        source={
          Array.isArray(item.image) && item.image.length > 0
            ? { uri: item.image[0].url }
            : require("@assets/img/eggplant.png")
        }
        style={styles.ImageProps}
      />
      <View style={styles.ItemDetails}>
        <Text style={styles.ItemName} numberOfLines={1} ellipsizeMode="tail">
          {item.productName}
        </Text>
        <Text
          style={styles.ItemDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
        <Text style={styles.StatusDesc}>
          Status:{" "}
          <Text
            style={[
              styles.statusText,
              { color: item.activeAt === "active" ? "green" : "gray" },
            ]}
          >
            {item.activeAt === "active" ? "Active" : "Inactive"}
          </Text>
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.activeAt === "inactive" &&
          item.stock.length > 0 &&
          item.stock.some((stockItem) => stockItem.status === "active") && (
            <TouchableOpacity
              onPress={() => onActivate(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="checkmark-outline" size={22} color="green" />
            </TouchableOpacity>
          )}

        {isArchive ? (
          <>
            <TouchableOpacity
              onPress={() => onRestore(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="reload-outline" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={styles.iconButton}
            >
              <Ionicons name="pencil" size={22} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export const InventoryItems = (props) => {
  const { item, onEdit, onDelete, onActivate, onRestore, isArchive } = props;
  console.log("Inventory Item:", item);
  return (
    <View style={styles.ItemCard}>
      <View style={styles.ItemDetails}>
        <Text style={styles.ItemName} numberOfLines={1} ellipsizeMode="tail">
          {item.unitName}
          {item.metricUnit}
        </Text>
        <Text
          style={styles.ItemDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Quantity: {item.quantity}
        </Text>
        <Text style={styles.StatusDesc}>
          Status:{" "}
          <Text
            style={[
              styles.statusText,
              { color: item.status === "active" ? "green" : "gray" },
            ]}
          >
            {item.status === "active" ? "Active" : "Inactive"}
          </Text>
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.activeAt === "inactive" &&
          item.stock.length > 0 &&
          item.stock.some((stockItem) => stockItem.status === "active") && (
            <TouchableOpacity
              onPress={() => onActivate(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="checkmark-outline" size={22} color="green" />
            </TouchableOpacity>
          )}

        {isArchive ? (
          <>
            <TouchableOpacity
              onPress={() => onRestore(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="reload-outline" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={styles.iconButton}
            >
              <Ionicons name="pencil" size={22} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item._id)}
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export const InventoryData = (props) => {
  const navigation = useNavigation();
  const { item } = props;
  console.log("Inventory Data Item:", item);
  return (
    <View style={styles.ItemCard}>
      <Image
        source={{
          uri: item?.image[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.ImageProps}
      />
         <View style={styles.ItemDetails}>
      <View style={styles.ItemName}>
        <Text style={styles.ItemName}>{item?.productName}</Text>
         <Text
          style={styles.ItemDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton} 
          onPress={() => navigation.navigate("InventoryDetail", { Inv: item })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
