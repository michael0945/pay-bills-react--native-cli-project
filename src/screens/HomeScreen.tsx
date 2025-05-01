import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

// Dimensions for responsive scaling
const { width, height } = Dimensions.get("window");
const scale = width / 375;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const menuItems = [
  { title: "Purchase", icon: "shopping-bag", color: "#0080ff" },
  { title: "Purchase Quick", icon: "bolt", color: "#00d2ff" },
  { title: "Purchase Fuel", icon: "gas-pump", color: "#ff2b2b" },
  { title: "Content Sales", icon: "shopping-cart", color: "#ff9900" },
  { title: "Redeem Ticket", icon: "qrcode", color: "#b35200" },
  { title: "Cash-In", icon: "arrow-down", color: "#2ecc71" },
  { title: "Cash-Out", icon: "arrow-up", color: "#f1c40f" },
  { title: "Airtime", icon: "mobile-alt", color: "#3498db", screen: "AirtimeScreen" },
  { title: "Pay Bills", icon: "file-invoice-dollar", color: "#1abc9c", screen: "PayBills" },
  { title: "Reprint Receipt", icon: "receipt", color: "#9b59b6" },
  { title: "DSTV Payment", icon: "tv", color: "#e74c3c", screen: "DstvPayment" },
  { title: "Bulk Pay/Disburse", icon: "money-check-alt", color: "#27ae60" },
  { title: "Remittance", icon: "exchange-alt", color: "#2c3e50" },
  { title: "Supply Order", icon: "box-open", color: "#f39c12" },
  { title: "Loyalty Purchase", icon: "gift", color: "#c0392b" },
  { title: "Refund", icon: "undo", color: "#8e44ad" },
  { title: "Reversal", icon: "redo", color: "#16a085" },
  { title: "Balance Inquiry", icon: "info-circle", color: "#d35400" },
  { title: "Approvals", icon: "check-circle", color: "#2980b9" },
  { title: "Customer Signup", icon: "user-plus", color: "#27ae60" },
  { title: "Merchant/Agent Signup", icon: "store", color: "#e67e22" },
  { title: "Today's Sales", icon: "chart-line", color: "#1abc9c" },
  { title: "End of Day", icon: "calendar-check", color: "#34495e" },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen);
              }
            }}
          >
            <FontAwesome5
              name={item.icon}
              size={normalize(22)}
              color={item.color}
              style={styles.icon}
              solid
            />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={normalize(18)} color="#ccc" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: normalize(10),
    paddingTop: normalize(10),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: normalize(30),
    paddingHorizontal: normalize(20),
    marginVertical: normalize(4),
    borderRadius: normalize(8),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  icon: {
    marginRight: normalize(12),
  },
  menuText: {
    flex: 1,
    fontSize: normalize(15),
    fontWeight: "500",
    color: "#333",
  },
});

export default HomeScreen;
export { normalize };
export type { HomeScreenNavigationProp }; 
