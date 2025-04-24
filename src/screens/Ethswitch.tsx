import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillLookupData, clearBillLookup, clearBilllookupState } from "../../redux/billLookupSlice";
import { RootState, AppDispatch } from "../../redux/store";

import { useFocusEffect } from "@react-navigation/native";

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
        WEBSPRIX:
            "Sweet :) Please enter your Mobile Number or Client ID registered at WebSprix and we can go lookup your bill amount due.",
        WEBIRR:
            "Sweet :) To lookup your bill at WeBirr, we need your Bill ID or Bill Code. Please enter this value below and we will search for your bill and amount due.",
        GUZOGO:
            "Awesome :) To lookup airline reservation at Guzo Go, we need your PNR which was either emailed or texted to you. Please enter your PNR from the airline below and we will go lookup the payment amount.",
        ETAIRFLY: "Enter PNR reservation.",
        LIYUBUS: "Cool! Where are we going? Let's get you a bus ticket. Please enter...",
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
        <View style={styles.container}>
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

            {/* Response Status UI */}
            <View style={styles.responseContainer}>
                {billLookup.error && (
                    <Text style={[styles.responseText, { color: "red" }]}>
                        Error: {billLookup.error}
                    </Text>
                )}

                {!billLookup.loading &&
                    !billLookup.error &&
                    billLookup.data.firstName && (
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

            {/* Modal Processing Popup */}
            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="blue" />
                        <Text style={{ textAlign: "center", marginTop: 10 }}>
                            Processing Payment...
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#ffffff",
    },
    instruction: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
        borderRadius: 8,
        width: "90%",
        marginBottom: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 17,
        paddingHorizontal: 10,
        color: "#333",
    },
    searchButton: {
        backgroundColor: "#0057b3",
        padding: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    responseContainer: {
        width: "90%",
    },
    responseText: {
        fontSize: 16,
        color: "#333",
        marginVertical: 4,
    },
    resultBox: {
        padding: 12,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#333",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 40,
        borderRadius: 10,
        width: "85%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5

    },

});

export default Ethswitch;


