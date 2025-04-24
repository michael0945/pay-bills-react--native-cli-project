import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useFocusEffect } from "@react-navigation/native";

import {
    clearBilllookupState,
    fetchBillDetails,
    setBillID,
} from "../../redux/aggrigatorSlice";
import OTP from "./OTP";

const BillAggrigator: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const {
        billerID,
        billID,
        loading,
        amountDue,
        longMessage,
        error,
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
    } = useSelector((state: RootState) => state.aggrigator);
    const aggrigator = useSelector((state: RootState) => state.aggrigator);

    const handleSearch = () => {
        if (!billerID || !billID) return;
        dispatch(fetchBillDetails({ billerID, billID }))
            .unwrap()
            .catch(() => setErrorModalVisible(true));
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(clearBilllookupState());
                setErrorModalVisible(false);
            };
        }, [dispatch])
    );

    const renderLines = [
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
    ].filter(Boolean);

    return (

        <View style={styles.container}>
            <View style={styles.inputContainer}>

                <TextInput
                    placeholder="Enter Bill ID"
                    style={styles.input}
                    value={billID}
                    onChangeText={(text) => dispatch(setBillID(text))}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>


            {/* Loading Modal */}
            <Modal visible={loading} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#0057b3" />
                        <Text style={styles.modalText}>Processing Payment...</Text>
                    </View>
                </View>
            </Modal>

            {/* Success Result */}
            {!loading && longMessage && (
                <View style={styles.resultBox}>
                    {renderLines.map((line, index) => (
                        <Text key={index} style={styles.responseText}>
                            {line}
                        </Text>
                    ))}
                    {amountDue && (
                        <Text style={styles.responseText}>
                            Amount Due: {amountDue} ETB
                        </Text>
                    )}
                </View>
            )}
            {aggrigator.status === "succeeded" ? (
                <>
                    <OTP />
                    <TouchableOpacity style={styles.submitButton} >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </>
            )

                : null}

            {/* Error Modal */}
            <Modal
                visible={errorModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setErrorModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, { color: "red" }]}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setErrorModalVisible(false)}
                        >
                            <Ionicons name="home-outline" size={18} color="white" />
                            <Text style={styles.actionButtonText}>Home Screen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
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
    responseText: {
        fontSize: 16,
        marginVertical: 4,
    },
    resultBox: {
        width: "90%",
        backgroundColor: "#f3f3f3",
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        width: "85%",
        alignItems: "center",
        elevation: 5,
    },
    modalText: {
        marginTop: 12,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    actionButton: {
        marginTop: 16,
        backgroundColor: "#0057b3",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
    },
    actionButtonText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: "#015CB7",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
        minWidth: "90%",
    },
    submitText: {
        color: "#fff",
        fontSize: 18,
    },
});

export default BillAggrigator;
