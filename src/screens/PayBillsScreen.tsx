// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchVendors } from "../../redux/slices/service/vendorSlice";
// import { RootState, AppDispatch } from "../../redux/store";
// import { RootStackParamList } from "../../navigation/AppNavigator";
// import Ethswitch from "./Ethswitch";
// import BillAggrigator from "./BillAggrigator";
// import Unicash from "./Unicash";
// import { clearBilllookupState } from "../../redux/billLookupSlice";
// import { ScrollView } from "react-native-gesture-handler";

// type PayBillsScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   "PayBills"
// >;

// const PayBillsScreen: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation<PayBillsScreenNavigationProp>();

//   const { vendorCodes, loading, error } = useSelector(
//     (state: RootState) => state.vendors
//   );

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(fetchVendors());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!loading && vendorCodes.length > 0) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [loading, vendorCodes, fadeAnim]);

//   const handleVendorClick = (vendor: string) => {
//     dispatch(clearBilllookupState())
//     if (vendor.toUpperCase() === "DSTV") {
//       navigation.navigate("DstvPayment");
//     } else if (
//       [
//         "ETHSWITCH",
//         "ETAIRFLY",
//         "GUZOGO",
//         "LIYUBUS",
//         "WEBIRR",
//         "WEBSPRIX",
//       ].includes(vendor.toUpperCase())
//     ) {
//       setSelectedVendor(vendor.toUpperCase());
//     } else if (vendor.toUpperCase() === "DERASH") {
//       setSelectedVendor("DERASH");
//     } else if (vendor.toUpperCase() === "UNICASH") {
//       setSelectedVendor("UNICASH");
//     }
//   };

//   return (
//     <ScrollView>
//     <View style={styles.container}>
//       <Text style={styles.instruction}>
//         Please select the vendor or service provider for the bill you would like to pay.
//       </Text>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="c" />
//           <Text style={styles.loadingText}>Loading vendors for paybills...</Text>
//         </View>
//       ) : error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
//             <FlatList
//               data={vendorCodes}
//               numColumns={3}
//               keyExtractor={(item, index) => index.toString()}
//               contentContainerStyle={styles.grid}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.vendorButton,
//                     selectedVendor === item.toUpperCase() && styles.selectedVendor,
//                   ]}
//                   onPress={() => handleVendorClick(item)}
//                 >
//                   <Text
//                     style={[
//                       styles.vendorText,
//                       selectedVendor === item.toUpperCase() && styles.selectedVendorText,
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </Animated.View>

//           {/* Render components dynamically based on selected vendor */}
//           {selectedVendor && selectedVendor !== "DERASH" && selectedVendor !== "UNICASH" && (
//             <Ethswitch selectedVendor={selectedVendor} />
//           )}
//           {selectedVendor === "DERASH" && <BillAggrigator selectedVendor={selectedVendor} />}
//           {selectedVendor === "UNICASH" && <Unicash />}
//         </>
//       )}
//     </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     padding: 10,
//   },
//   instruction: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#333",
//     marginVertical: 15,
//   },
//   loadingContainer: {
//     marginTop: 50,
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#0057b3",
//   },
//   error: {
//     fontSize: 16,
//     color: "red",
//     textAlign: "center",
//   },
//   grid: {
//     alignItems: "center",
//     paddingBottom: 20,
//   },
//   vendorButton: {
//     backgroundColor: "#e6e6e6",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     margin: 5,
//     borderRadius: 8,
//     alignItems: "center",
//     width: "30%",
//   },
//   selectedVendor: {
//     backgroundColor: "#2AB930",
//   },
//   vendorText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//   },
//   selectedVendorText: {
//     color: "#fff",
//   },

// });

// export default PayBillsScreen;

// PayBillsScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendors } from "../../redux/slices/service/vendorSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ethswitch from "./Ethswitch";
import BillAggrigator from "./BillAggrigator";
import Unicash from "./Unicash";
import { clearBilllookupState } from "../../redux/billLookupSlice";
import { ScrollView } from "react-native-gesture-handler";

import { Picker } from "@react-native-picker/picker";
import { fetchDerashBillers } from "../../redux/slices/service/derashSlice";
import { setBillerID } from "../../redux/aggrigatorSlice";
import { setAdditionalInfo2D, setVendorAccountD } from "../../redux/derashPaymentSlice";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const buttonSpacing = 10;
const buttonWidth = (screenWidth - buttonSpacing * (numColumns + 1)) / numColumns;

type PayBillsScreenNavigationProp = StackNavigationProp<RootStackParamList, "PayBills">;

const PayBillsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<PayBillsScreenNavigationProp>();

  const { vendorCodes, loading, error } = useSelector(
    (state: RootState) => state.vendors
  );

  const derashState = useSelector((state: RootState) => state.derash);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<string>("");

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && vendorCodes.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, vendorCodes, fadeAnim]);

  const handleVendorClick = (vendor: string) => {
    dispatch(clearBilllookupState());
    if (vendor.toUpperCase() === "DSTV") {
      navigation.navigate("DstvPayment");
    } else if (
      [
        "ETHSWITCH",
        "ETAIRFLY",
        "GUZOGO",
        "LIYUBUS",
        "WEBIRR",
        "WEBSPRIX",
      ].includes(vendor.toUpperCase())
    ) {
      setSelectedVendor(vendor.toUpperCase());
    } else if (vendor.toUpperCase() === "DERASH") {
      setSelectedVendor("DERASH");
      dispatch(fetchDerashBillers());
    } else if (vendor.toUpperCase() === "UNICASH") {
      setSelectedVendor("UNICASH");
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(clearBilllookupState());
      };
    }, [dispatch])
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView >
        <View style={styles.container}>
          <Text style={styles.instruction}>
            Please select the vendor or service provider for the bill you would like to pay.
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="green" />
              <Text style={styles.loadingText}>Loading vendors for paybills...</Text>
            </View>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <>
              <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
                <FlatList
                  data={vendorCodes}
                  numColumns={numColumns}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.grid}
                  scrollEnabled={false}
                  renderItem={({ item }) => {
                    const isSelected = selectedVendor === item.toUpperCase();
                    return (
                      <TouchableOpacity
                        style={[
                          styles.vendorButton,
                          { width: buttonWidth },
                          isSelected && styles.selectedVendor,
                        ]}
                        onPress={() => handleVendorClick(item)}
                      >
                        <Text style={[styles.vendorText, isSelected && styles.selectedVendorText]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </Animated.View>


            </>
          )}
        </View>
        <View style={styles.container2}>
          {selectedVendor && selectedVendor !== "DERASH" && selectedVendor !== "UNICASH" && (
            <Ethswitch selectedVendor={selectedVendor} />
          )}

          {selectedVendor === "DERASH" && (
            <>
              <View style={styles.container1}>
                {derashState.loading ? (
                  <ActivityIndicator size="large" color="#2AB930" />
                ) : derashState.error ? (
                  <Text style={styles.error}>{derashState.error}</Text>
                ) : (
                  <>
                    <Picker
                      selectedValue={selectedBiller}
                      onValueChange={(itemValue) => {
                        setSelectedBiller(itemValue);
                        dispatch(setBillerID(itemValue))
                        dispatch(setAdditionalInfo2D(itemValue));
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Biller" value="" />
                      {derashState.billers.map((biller) => (
                        <Picker.Item
                          key={biller.BillerID}
                          label={biller.Name}
                          value={biller.BillerID}
                        />
                      ))}
                    </Picker>
                    {selectedBiller ? (
                      ""
                    ) : null}
                  </>

                )}

              </View>
              <BillAggrigator />
            </>
          )}


          {selectedVendor === "UNICASH" && (
            <View style={{ marginTop: 20 }}>
              <Unicash />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#ffffff", padding: 10, shadowOpacity: 0.2, shadowRadius: 4, marginTop: 15, elevation: 4
  },
  container2: {
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, borderRadius: 10, marginTop: 15
  },
  container1: {
    backgroundColor: "#ffffff", padding: 20, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4
  },
  instruction: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginVertical: 15,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0057b3",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  grid: {
    alignItems: "center",
    paddingBottom: 20,
  },
  vendorButton: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 12,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedVendor: {
    backgroundColor: "#2AB930",
  },
  vendorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedVendorText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  picker: {
    backgroundColor: "#f0f0f0",

    borderRadius: 8,
  },
});

export default PayBillsScreen;
