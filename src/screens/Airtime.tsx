import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    SafeAreaView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
    setMobileNumber,
    setAmount,
    setPinType,
    submitPayment
} from "../../redux/paymentSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import OTP from "./OTP";

const { width, height } = Dimensions.get("window");

const AirtimeScreen = () => {
    const [selectedTopup, setSelectedTopup] = useState<"PIN" | "PINLESS">("PIN");
    const [selectedAmount, setSelectedAmount] = useState<number>(25);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);

    const amounts = [25, 50, 100, 250, 500, 1000];
    const dispatch = useDispatch<AppDispatch>();

    const {
        loading,
        shortMessage,
        referenceNumber,
        responseAmount,
        longMessage,
        error,
    } = useSelector((state: RootState) => state.payment);

    const handlePayment = () => {
        setModalVisible(true);
        dispatch(submitPayment());
    };

    const resetForm = () => {
        setCustomAmount("");
        setSelectedAmount(25);
        setSelectedTopup("PIN");

    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {/* Phone Number */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Send Minutes To</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="phone-pad"
                                placeholder="Mobile Number"
                                onChangeText={(text) => dispatch(setMobileNumber(text))}
                            />
                        </View>

                        {/* Topup Type */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Topup Type</Text>
                            <View style={styles.topupContainer}>
                                {["PIN", "PINLESS"].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.topupOption,
                                            selectedTopup === type && styles.selectedTopup
                                        ]}
                                        onPress={() => {
                                            setSelectedTopup(type as "PIN" | "PINLESS");
                                            dispatch(setPinType(type === "PIN" ? "P" : "B"));
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.radioCircle,
                                                selectedTopup === type && styles.selectedRadioCircle
                                            ]}
                                        />
                                        <Text style={styles.topupText}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Amount Selection */}
                        {selectedTopup === "PIN" ? (
                            <View style={styles.section}>
                                <Text style={styles.topupDescription}>
                                    PIN: Topup prepaid airtime with PIN to be sent to customer mobile phone in text message.
                                </Text>
                                <Text style={styles.label}>Card Amount</Text>
                                <View style={styles.amountContainer}>
                                    {amounts.map((amt) => (
                                        <TouchableOpacity
                                            key={amt}
                                            style={[
                                                styles.amountButton,
                                                selectedAmount === amt && styles.selectedAmount
                                            ]}
                                            onPress={() => {
                                                setSelectedAmount(amt);
                                                dispatch(setAmount(amt.toString()));
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.amountText,
                                                    selectedAmount === amt && styles.selectedAmountText
                                                ]}
                                            >
                                                Br {amt}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <Text style={styles.label}>Amount (50 to 100)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter custom amount"
                                    keyboardType="numeric"
                                    value={customAmount}
                                    onChangeText={(text) => {
                                        setCustomAmount(text);
                                        dispatch(setAmount(text));
                                    }}
                                />
                            </View>
                        )}

                        <View style={{ padding: 15 }}>
                            <OTP />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>

                        {/* Modal */}
                        <Modal transparent={true} visible={modalVisible}>
                            <View style={styles.modalOverlay}>
                                {loading ? (
                                    <View style={styles.modalContainer}>
                                        <ActivityIndicator size="large" color="blue" />
                                        <Text style={{ textAlign: "center", marginTop: 10 }}>
                                            Processing Payment...
                                        </Text>
                                    </View>
                                ) : shortMessage ? (
                                    <View style={styles.modalContainer1}>
                                        <View style={styles.successIconContainer}>
                                            <Ionicons name="checkmark-circle" size={80} color="white" />
                                        </View>
                                        <Text style={styles.amountText1}>{responseAmount}</Text>
                                        <Text style={styles.successMessageText}>{shortMessage}</Text>
                                        <Text style={styles.refText}>Ref # {referenceNumber}</Text>

                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity
                                                style={styles.actionButton2}
                                                onPress={() => {
                                                    resetForm();
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <Ionicons name="arrow-forward" size={18} color="white" />
                                                <Text style={styles.actionButtonText} >New Topup</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Ionicons name="home-outline" size={18} color="white" />
                                                <Text style={styles.actionButtonText}>Home Screen</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.printButton}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Ionicons name="print-outline" size={18} color="black" />
                                            <Text style={styles.actionButtonText1}>Print Receipt</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: "center" }}>
                                        <Text>{error}</Text>
                                        <Text>{longMessage}</Text>
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                            style={styles.errorButton}
                                        >
                                            <Text style={{ color: "white" }}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, backgroundColor: "#f8f9fa", },
    section: { padding: 15 },
    label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
    input: {
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#666"
    },
    topupContainer: { flexDirection: "row", justifyContent: "flex-start" },
    topupOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        paddingVertical: 5
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#015CB7",
        marginRight: 8
    },
    selectedRadioCircle: { backgroundColor: "#2ecc71" },
    topupText: { fontSize: 16, fontWeight: "bold", color: "#015CB7" },
    topupDescription: { fontSize: 12, color: "#555", marginTop: 5 },
    amountContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    amountButton: {
        width: "30%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 5
    },
    selectedAmount: {
        backgroundColor: "#2ecc71",
        borderColor: "#2ecc71"
    },
    amountText: { fontSize: 16, fontWeight: "bold", color: "#333" },
    selectedAmountText: { color: "#fff" },
    submitButton: {
        backgroundColor: "#015CB7",
        paddingVertical: 20,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 50,



    },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
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
    modalContainer1: {
        width: "85%",
        height: "30%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,



    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00B055",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    actionButton2: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#015CB7",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    actionButton1: {
        backgroundColor: "#FFD700",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
        width: "100%"
    },
    actionButtonText: { color: "#fff", textAlign: "center" },
    actionButtonText1: { color: "#fff", textAlign: "center" },
    errorButton: {
        backgroundColor: "red",
        padding: 10,
        marginTop: 10,
        borderRadius: 5
    },
    successText: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 5,
        textAlign: "center"
    },
    errorTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        color: "#D81B60"
    },
    modalText: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 20
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,

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
    amountText1: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
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
});

export default AirtimeScreen;


