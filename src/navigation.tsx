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
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import PayBillsScreen from "./screens/PayBillsScreen";
import DstvPaymentScreen from "./screens/DSTVPaymentScreen";
import AirtimeScreen from "./screens/Airtime";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

// Stack navigator type
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
      return { title: "PayBills", icon: "card-outline" };
    case "DstvPayment":
      return { title: "Dstv", icon: "tv-outline" };
    case "AirtimeScreen":
      return { title: "AirtimeScreen", icon: "call-outline" };
    default:
      return { title: "MICHAELM", icon: "" };
  }
};


const CustomHeader: React.FC<{ navigation: any; routeName: string }> = ({
  navigation,
  routeName,
}) => {
  const { title, icon } = getScreenDisplayInfo(routeName);

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Ionicons name="menu" size={28} color="#fff" style={styles.menuIcon} />
        </TouchableOpacity>

        <Image source={require("../assets/p1.png.png")} style={styles.logo} />

        <View style={styles.userInfo}>
          <Text style={styles.userGreeting}>Michaelm</Text>
        </View>
      </View>

      <View style={styles.header1}>
        <View style={styles.headerTitleWithIcon}>
          <Ionicons name={icon} size={25} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.userTitle}>{title}</Text>
        </View>
        <Text style={styles.balance}>1,057,424.25 Br</Text>
      </View>
    </View>
  );
};

// Screens wrapped in Stack
const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        const routeName = route.name;
        return {
          headerStyle: { backgroundColor: "#015CB7" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitle: () => <CustomHeader navigation={navigation} routeName={routeName} />,
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


const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};


interface Style {
  header: ViewStyle;
  menuIcon: ViewStyle;
  logo: ImageStyle;
  userInfo: ViewStyle;
  userGreeting: TextStyle;
  header1: ViewStyle;
  headerTitleWithIcon: ViewStyle;
  userTitle: TextStyle;
  balance: TextStyle;
}

const styles = StyleSheet.create<Style>({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
  menuIcon: {
    padding: 4,
  },
  logo: {
    width: 70,
    height: 40,
    resizeMode: "contain",
    marginRight: 200,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userGreeting: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 30,

  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 21,
    marginLeft: 10,
    marginRight: -48,
  },
  headerTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,


  },
  balance: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,


  },
});

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


