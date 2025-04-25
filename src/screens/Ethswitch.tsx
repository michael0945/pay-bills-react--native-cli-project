import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Dimensions,
    SafeAreaView,
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillLookupData, clearBilllookupState } from "../../redux/billLookupSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useFocusEffect } from "@react-navigation/native";

// Get device width
const { width } = Dimensions.get("window");

interface EthswitchProps {
    selectedVendor: string;
}

const Ethswitch: React.FC<EthswitchProps> = ({ selectedVendor }) => {
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const billLookup = useSelector((state: RootState) => state.billLookup);

    const handleSearch = () => {
        if (!inputValue || !selectedVendor) return;
        setShowModal(true);
        dispatch(clearBilllookupState());
        dispatch(fetchBillLookupData({ keyValue: inputValue, vendor: selectedVendor as any }));
    };

    useEffect(() => {
        if (!billLookup.loading) {
            setShowModal(false);
        }
    }, [billLookup.loading]);

    const vendorTexts: Record<string, string> = {
        WEBSPRIX: "Sweet :) Please enter your Mobile Number or Client ID registered at WebSprix and we can lookup your bill amount due.",
        WEBIRR: "Sweet :) To lookup your bill at WeBirr, we need your Bill ID or Bill Code.",
        GUZOGO: "Awesome :) Please enter your airline PNR for reservation lookup.",
        ETAIRFLY: "Enter your PNR reservation code.",
        LIYUBUS: "Cool! Let's get you a bus ticket. Enter your booking ID.",
        ETHSWITCH: "Select the service provider for the bill you would like to pay.",
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(clearBilllookupState());
            };
        }, [])
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.instruction}>
                    {vendorTexts[selectedVendor] || "Please enter the required information below."}
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        style={styles.input}
                        placeholder="Enter required value"
                        placeholderTextColor="#A0A0A0"
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Ionicons name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Response Section */}
                <View style={styles.responseContainer}>
                    {billLookup.error && (
                        <Text style={[styles.responseText, { color: "red" }]}>
                            Error: {billLookup.error}
                        </Text>
                    )}
                    {!billLookup.loading && !billLookup.error && billLookup.data.firstName && (
                        <View style={styles.resultBox}>
                            <Text style={styles.responseText}>Name: {billLookup.data.firstName}</Text>
                            <Text style={styles.responseText}>Phone: {billLookup.data.phoneNumber}</Text>
                            <Text style={styles.responseText}>Gender: {billLookup.data.gender}</Text>
                            <Text style={styles.responseText}>Amount Due: {billLookup.data.amount}</Text>
                            <Text style={styles.responseText}>Fee: {billLookup.data.fee}</Text>
                            <Text style={styles.responseText}>Total: {billLookup.data.totalAmount}</Text>
                        </View>
                    )}
                </View>

                {/* Loading Modal */}
                <Modal visible={showModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <ActivityIndicator size="large" color="#0057b3" />
                            <Text style={styles.modalText}>
                                Processing Payment...
                            </Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    instruction: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        width: width * 0.9, // 90% of screen width
        marginBottom: 20,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        paddingHorizontal: 12,
        color: "#333",
    },
    searchButton: {
        backgroundColor: "#0057b3",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    responseContainer: {
        width: width * 0.9,
        marginTop: 10,
    },
    responseText: {
        fontSize: 15,
        color: "#333",
        marginVertical: 3,
    },
    resultBox: {
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: width * 0.8,
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        elevation: 10,
    },
    modalText: {
        marginTop: 15,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
});

export default Ethswitch;
