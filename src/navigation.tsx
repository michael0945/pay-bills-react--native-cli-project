import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, useWindowDimensions, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import PayBillsScreen from "./screens/PayBillsScreen";
import DstvPaymentScreen from "./screens/DSTVPaymentScreen";


// Sidebar
import Sidebar from "./screens//Sidebar";
import AirtimeScreen from "./screens/Airtime";

// Types
type RootStackParamList = {
  Home: undefined;
  PayBills: undefined;
  DstvPayment: undefined;
  AirtimeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Custom Header
const getScreenDisplayInfo = (routeName: string) => {
  switch (routeName) {
    case "PayBills": return { title: "Pay Bills", icon: "card-outline" };
    case "DstvPayment": return { title: "DSTV Payment", icon: "tv-outline" };
    case "AirtimeScreen": return { title: "Airtime", icon: "call-outline" };
    default: return { title: "MICHAELM", icon: "" };
  }
};

const CustomHeader: React.FC<{ navigation: any; routeName: string }> = ({ navigation, routeName }) => {
  const { width } = useWindowDimensions();
  const { title, icon } = getScreenDisplayInfo(routeName);

  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={{ backgroundColor: "#015CB7" }}>
      <View style={styles.header}>
        {/* If can go back, show back arrow, else show menu icon */}
        <TouchableOpacity onPress={() => canGoBack ? navigation.goBack() : navigation.openDrawer()}>
          <Ionicons
            name={canGoBack ? "arrow-back" : "menu"}
            size={28}
            color="#fff"
            style={styles.menuIcon}
          />
        </TouchableOpacity>

        <Image source={require("../assets/p1.png.png")} style={[styles.logo, { maxWidth: width * 0.25 }]} />

        <Text style={styles.userGreeting}>Michaelm</Text>
      </View>

      <View style={styles.subHeader}>
        <View style={styles.headerTitleWithIcon}>
          <Ionicons name={icon} size={24} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.userTitle}>{title}</Text>
        </View>
        <Text style={styles.balance}>1,057,424.25 Br</Text>
      </View>
    </SafeAreaView>
  );
};

// Stack inside Drawer
const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => <CustomHeader navigation={navigation} routeName={route.name} />,
      })}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PayBills" component={PayBillsScreen} />
      <Stack.Screen name="DstvPayment" component={DstvPaymentScreen} />
      <Stack.Screen name="AirtimeScreen" component={AirtimeScreen} />
    </Stack.Navigator>
  );
};


const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="StackNavigator" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingBottom: 8,
    backgroundColor: "#015CB7",
  },
  menuIcon: {
    padding: 4,
  },
  logo: {
    height: 40,
    resizeMode: "contain",

    marginRight: 100,




  },
  userGreeting: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#015CB7",
  },
  headerTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  balance: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});


