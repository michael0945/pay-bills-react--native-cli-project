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
    Dimensions,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
    clearBilllookupState,
    fetchBillDetails,
    setBillID,
} from "../../redux/aggrigatorSlice";
import OTP from "./OTP";
import { RootStackParamList } from "../../navigation/types";
import { clearDerashPaymentState, fetchDerashPayment, setAmountD, setVendorAccountD } from "../../redux/derashPaymentSlice";
const { width } = Dimensions.get("window");


const BillAggrigator: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const derashPayment = useSelector((state: RootState) => state.derashPayment)
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


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
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
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

    const handlePayment = () => {
        if (line9) {
            const cleanedAmount = line9.split(':')[1]?.split('ETB')[0]?.trim() || "";
            console.log('Cleaned Amount:', cleanedAmount);
            dispatch(setAmountD(cleanedAmount));
        }

        setTimeout(() => {
            dispatch(fetchDerashPayment());
            setModalVisible(true);
        }, 100);
    };




    const handleChange = (text: string) => {
        setInputValue(text);
        dispatch(setBillID(text))
        dispatch(setVendorAccountD(text))

    };
    const handleGoHome = () => {
        navigation.navigate("Home");
    };

    const handleOkay = () => {
        setModalVisible(false);

        dispatch(clearDerashPaymentState());
        dispatch(clearBilllookupState());

    };
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>

                    <TextInput
                        placeholder="Enter Bill ID"
                        style={styles.input}
                        value={billID}
                        keyboardType="numeric"
                        onChangeText={handleChange}
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
                        {line9 && (
                            <Text style={styles.responseText}>
                                Amount Due: {line9.split(':')[1]?.split('ETB')[0]?.trim()} ETB
                            </Text>
                        )}

                    </View>
                )}


                {/* Error Modal */}
                <Modal
                    visible={errorModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setErrorModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer2}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="alert-circle" size={60} color="#e60000" />
                            </View>
                            <Text style={styles.errorTitle}>Invalid Card Num</Text>
                            <Text style={[styles.modalText, { color: "red" }]}>
                                {error || "Smart Card Number provided is invalid. It must be a 10-digit number."}
                            </Text>
                            <TouchableOpacity
                                style={styles.tryAgainButton}
                                onPress={() => setErrorModalVisible(false)}
                            >
                                <View style={styles.row}>
                                    <Text style={styles.buttonText}>Try Again</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
            {aggrigator.status === "succeeded" ? (
                <>
                    <OTP />
                    <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </>
            )

                : null}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {derashPayment.loading ? (
                        <View style={styles.modalContainer3}>
                            <ActivityIndicator size="large" color="#015CB7" />
                            <Text style={styles.modalText}>Processing Payment...</Text>
                        </View>
                    ) : derashPayment.error ? (
                        <View style={styles.modalContainer3}>
                            <Ionicons name="close-circle-outline" size={48} color="red" />
                            <Text style={styles.modalText}>Payment Failed</Text>
                            <Text style={styles.modalSubText}>{derashPayment.error}</Text>
                        </View>
                    ) : derashPayment.shortMessage ? (
                        <View style={styles.modalContainer2}>
                            <View style={styles.successIconContainer}>
                                <Ionicons name="checkmark-circle" size={80} color="white" />
                            </View>
                            <Text style={styles.amountText}>{derashPayment.amount}</Text>
                            <Text style={styles.successMessageText}>{derashPayment.shortMessage}</Text>
                            <Text style={styles.refText}>Ref # {derashPayment.referenceNumber}</Text>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.newPaymentButton} onPress={handleOkay}>
                                    <Ionicons name="arrow-forward" size={18} color="white" />
                                    <Text style={styles.buttonText}>New DStv Payment</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                                    <Ionicons name="home-outline" size={18} color="white" />
                                    <Text style={styles.buttonText}>Home Screen</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.printButton}>
                                <Ionicons name="print-outline" size={18} color="black" />
                                <Text style={styles.printButtonText}>Print Receipt</Text>
                            </TouchableOpacity>
                        </View>
                    ) :
                        null}
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
        flex: 1,
        padding: 20,

        backgroundColor: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        width: width * 0.9,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        paddingHorizontal: 12,
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
    modalContainer3: {
        backgroundColor: "white",
        padding: 40,
        borderRadius: 10,
        width: "85%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5

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
        width: "100%",
        padding: 10,
    },
    submitText: {
        color: "#fff",
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",

    },
    amountText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    modalContainer2: {
        width: "85%",
        height: "31%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,

    },
    modalSubText: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginVertical: 4,
    },

    iconContainer: {

        borderRadius: 50,
        padding: 10,
        marginBottom: 15,
    },
    tryAgainButton: {
        marginTop: 30,
        flexDirection: 'row',
        backgroundColor: '#0066cc',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '116%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e60000',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#0066cc',
    },
    buttonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "500",
    },
    successIconContainer: {
        backgroundColor: "#00B055",

        borderWidth: 5,
        borderColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        // elevation: 2,

        padding: 1,
        borderRadius: 50,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",


    },
    successMessageText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    refText: {
        fontSize: 14,
        color: "#777",
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,

    },
    newPaymentButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#015CB7",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00B055",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },

    printButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFD500",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 4,
        width: "115%",
    },
    printButtonText: {
        color: "black",
        marginLeft: 5,
        fontWeight: "500",
        marginTop: 2,
        paddingBottom: 2,
        width: "80%",

    },

});

export default BillAggrigator;
