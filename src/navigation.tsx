// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./screens/HomeScreen";
// import PayBillsScreen from "./screens/PayBillsScreen";

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="PayBills" component={PayBillsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./screens/HomeScreen";
// import PayBillsScreen from "./screens/PayBillsScreen";

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: "#015CB7", // Set background color here
//           },
//           headerTintColor: "#fff", // Set text color to white for contrast
//           headerTitleStyle: {
//             fontWeight: "bold", // Optional: Makes title bold
//           },
//         }}
//       >
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="PayBills" component={PayBillsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import PayBillsScreen from "./screens/PayBillsScreen";
import DstvPaymentScreen from "./screens/DSTVPaymentScreen";
import AirtimeScreen from "./screens/Airtime";

type RootStackParamList = {
  Home: undefined;
  PayBills: undefined;
  DstvPayment: undefined;
  AirtimeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const getScreenDisplayInfo = (routeName: string) => {
  switch (routeName) {
    case "PayBills":
      return { title: "Pay Bills", icon: "card-outline" };
    case "DstvPayment":
      return { title: "DSTV Payment", icon: "tv-outline" };
    case "AirtimeScreen":
      return { title: "Airtime", icon: "call-outline" };
    default:
      return { title: "MICHAELM", icon: "" };
  }
};

const CustomHeader: React.FC<{ navigation: any; routeName: string }> = ({ navigation, routeName }) => {
  const { width } = useWindowDimensions();
  const { title, icon } = getScreenDisplayInfo(routeName);

  return (
    <SafeAreaView style={{ backgroundColor: "#015CB7" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Ionicons name="menu" size={28} color="#fff" style={styles.menuIcon} />
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

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        const routeName = route.name;
        return {
          header: () => <CustomHeader navigation={navigation} routeName={routeName} />,
        };
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PayBills" component={PayBillsScreen} />
      <Stack.Screen name="DstvPayment" component={DstvPaymentScreen} />
      <Stack.Screen name="AirtimeScreen" component={AirtimeScreen} />
    </Stack.Navigator>
  );
};

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

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;



// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./screens/HomeScreen";
// import PayBillsScreen from "./screens/PayBillsScreen";
// import DstvPaymentScreen from "./screens/DSTVPaymentScreen";

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: { backgroundColor: "#015CB7" },
//           headerTintColor: "#fff",
//           headerTitleStyle: { fontWeight: "bold" },
//         }}
//       >
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="PayBills" component={PayBillsScreen} />
//         <Stack.Screen name="DstvPayment" component={DstvPaymentScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./screens/HomeScreen";
// import PayBillsScreen from "./screens/PayBillsScreen";
// import DstvPaymentScreen from "./screens/DSTVPaymentScreen";
// import AirtimeScreen from "./screens/Airtime"; // Added AirtimeScreen
// import Ethswitch from "./screens/Ethswitch";

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: { backgroundColor: "#015CB7" },
//           headerTintColor: "#fff",
//           headerTitleStyle: { fontWeight: "bold" },
//         }}
//       >
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="PayBills" component={PayBillsScreen} />
//         <Stack.Screen name="DstvPayment" component={DstvPaymentScreen} />
//         <Stack.Screen name="AirtimeScreen" component={AirtimeScreen} />
//         {/* <Stack.Screen name="Ethswitch" component={Ethswitch} /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;


