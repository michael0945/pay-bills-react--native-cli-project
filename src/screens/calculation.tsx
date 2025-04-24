import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

const Airtime = () => {
    const [selectedMonths, setSelectedMonths] = useState("2 Months");
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [balance, setBalance] = useState(1007694.5);
    const [amountDue, setAmountDue] = useState(190.96);
    const [totalPayment, setTotalPayment] = useState(NaN);
    const [amountToPay, setAmountToPay] = useState(NaN);
    const [otpSent, setOtpSent] = useState(false);

    const sendOtp = () => {
        if (!mobileNumber) {
            Alert.alert("Error", "Please enter a valid mobile number");
            return;
        }
        setOtpSent(true);
        Alert.alert("Success", "OTP successfully sent to customer's phone number.");
    };

    const submitPayment = () => {
        if (!otp) {
            Alert.alert("Error", "Please enter the OTP");
            return;
        }
        Alert.alert("Success", "Payment submitted successfully!");
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="arrow-back" size={24} color="#fff" />
                <Text style={styles.headerTitle}>DSTV Payment</Text>
                <Text style={styles.balance}>Balance: {balance} Br</Text>
            </View>

            {/* Payment Details */}
            <View style={styles.detailsCard}>
                <Text style={styles.label}>Total Amount: {amountDue}</Text>
                <Text style={styles.label}>Amount Due: {amountDue}</Text>

                <Text style={styles.label}>Number of Months</Text>
                <Picker
                    selectedValue={selectedMonths}
                    style={styles.picker}
                    onValueChange={(itemValue: string) => setSelectedMonths(itemValue)}
                >
                    <Picker.Item label="1 Month" value="1 Month" />
                    <Picker.Item label="2 Months" value="2 Months" />
                    <Picker.Item label="3 Months" value="3 Months" />
                </Picker>

                <Text style={styles.label}>Total Payment: {isNaN(totalPayment) ? "NaN" : totalPayment}</Text>
                <Text style={styles.label}>Amount to Pay: {isNaN(amountToPay) ? "NaN" : amountToPay}</Text>
            </View>

            {/* Payment Type Section */}
            <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Type</Text>
                <View style={styles.paymentOptions}>
                    <Text style={[styles.paymentOption, styles.activePayment]}>Mobile Wallet</Text>
                    <Text style={styles.paymentOption}>Prepaid Account</Text>
                    <Text style={styles.paymentOption}>Cash</Text>
                </View>

                {/* Mobile Number Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter Mobile Number"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                />

                {/* OTP Buttons */}
                <TouchableOpacity style={styles.otpButton} onPress={sendOtp}>
                    <Text style={styles.otpButtonText}>Send OTP</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    editable={otpSent}
                />

                <TouchableOpacity style={styles.submitButton} onPress={submitPayment}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
    header: {
        backgroundColor: "#0052CC",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
    },
    balance: {
        color: "#FFF",
        fontSize: 14,
    },
    detailsCard: {
        backgroundColor: "#FFF",
        margin: 10,
        padding: 12,
        borderRadius: 8,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
    },
    picker: {
        height: 50,
        width: "100%",
    },
    paymentSection: {
        backgroundColor: "#FFF",
        margin: 10,
        padding: 12,
        borderRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    paymentOptions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    paymentOption: {
        fontSize: 16,
        color: "#888",
    },
    activePayment: {
        color: "#0052CC",
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
    },
    otpButton: {
        backgroundColor: "#28A745",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 8,
    },
    otpButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    submitButton: {
        backgroundColor: "#0052CC",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 8,
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Airtime;
