import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
    sendOtp,
    setMobileNumber1,
} from "../../redux/slices/payment/otpSlice";
import {
    setMobileNumber,

    setPin,
} from "../../redux/paymentSlice";
import { setCardNumber, setPinDp } from "../../redux/dstvPaymentSlice";
import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";
import { setCardNumberC, setPinDpC } from "../../redux/dstvCatalogPaymentSlice";
import { setCardNumberD, setPinDpD } from "../../redux/derashPaymentSlice";

const CustomToast = ({ text2 }: any) => (
    <View style={styles.customToastContainer}>
        <View style={styles.progressBar} />
        <Text style={styles.customToastText}>{text2}</Text>
    </View>
);

const toastConfig: ToastConfig = {
    success: (props) => <CustomToast {...props} />,
    error: (props) => <CustomToast {...props} />,
};

const OTP = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedTab, setSelectedTab] = useState("MobileWallet");
    const [inputValue, setInputValue] = useState("");
    const [inputValueOtp, setInputValueOtp] = useState("");

    const { amount, pinType, additionalInfo2 } = useSelector(
        (state: RootState) => state.payment
    );
    const { status, longMessage } = useSelector((state: RootState) => state.otp);

    const handleChange = (text: string) => {
        setInputValue(text);
        dispatch(setMobileNumber(text));
        dispatch(setMobileNumber1(text));
        dispatch(setCardNumber(text));
        dispatch(setCardNumberC(text));
        dispatch(setCardNumberD(text));

    };

    const handleOtp = (text: string) => {
        setInputValueOtp(text);
        dispatch(setPin(text));
        dispatch(setPinDp(text));
        dispatch(setPinDpD(text));
        dispatch(setPinDpC(text));
    };

    const handleSendOtp = async () => {
        if (!inputValue) {
            Toast.show({
                type: "error",
                text2: "Please enter your mobile number!",
            });
            return;
        }
        console.log("Sending OTP to:", inputValue);

        const timeoutId = setTimeout(() => {
            Toast.show({
                type: "error",
                text2: "OTP request timed out, please try again.",
            });
        }, 15000);

        try {
            await dispatch(sendOtp()).unwrap();
            clearTimeout(timeoutId);
            Toast.show({
                type: "success",
                text2: "OTP Sent Successfully!",
            });
        } catch (error) {
            clearTimeout(timeoutId);
            Toast.show({
                type: "error",
                text2: String(error) || "Something went wrong. Please try again.",
            });
        }
    };
    useEffect(() => {
        if (selectedTab === "Cash") {
            dispatch(setMobileNumber("CASH"));
            dispatch(setMobileNumber1("CASH"));
            dispatch(setCardNumber("CASH"));
            dispatch(setCardNumberC("CASH"));
            dispatch(setCardNumberD("CASH"));
        }
    }, [selectedTab, dispatch]);


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Payment Type</Text>

            <View style={styles.tabs}>
                {["Mobile Wallet", "Prepaid Account", "Cash"].map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedTab(tab.replace(" ", ""))}
                    >
                        <Text
                            style={[
                                styles.tab,
                                selectedTab === tab.replace(" ", "") && styles.activeTab,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedTab === "MobileWallet" && (
                <View style={styles.mobileWalletContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Mobile Number / Other"
                            keyboardType="phone-pad"
                            value={inputValue}
                            onChangeText={handleChange}
                            editable={true}
                        />
                    </View>

                    <View style={styles.otpSection}>
                        <TouchableOpacity
                            style={[
                                styles.otpButton,
                                status === "loading" && styles.disabled,
                            ]}
                            onPress={handleSendOtp}
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.otpText}>Send OTP</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="Enter OTP"
                            keyboardType="number-pad"
                            onChangeText={handleOtp}
                            maxLength={4}
                            value={inputValueOtp}
                        />

                        <Toast config={toastConfig} />
                    </View>

                </View>

            )}

            {selectedTab === "PrepaidAccount" && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Account/Card Number"
                        keyboardType="number-pad"
                        onChangeText={handleChange}

                    />
                    <TextInput
                        style={styles.input}
                        placeholder="PIN"
                        keyboardType="number-pad"
                        secureTextEntry
                        onChangeText={handleOtp}
                    />
                </View>
            )}

            {selectedTab === "Cash" && (
                <Text style={styles.infoText} onPress={() => dispatch(setCardNumber("CASH"))} >

                    Please proceed to the counter for cash payment.
                </Text>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",


        paddingBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,


        borderRadius: 10,
        elevation: 3,


        marginTop: 15,
        marginBottom: 5,
        padding: 15,








        borderColor: "#ccc",









    },
    label: {
        fontSize: 17,
        color: "#333",
        marginBottom: 10,
        fontWeight: "bold",

        marginTop: 10,

        paddingTop: 10,
        paddingBottom: 10,

        borderRadius: 8,
        paddingHorizontal: 10,



    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    tab: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: "gray",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#007bff",
    },
    mobileWalletContainer: {
        paddingVertical: 10,


    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#666",
        marginTop: 10,
        marginBottom: 1,


    },
    otpSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    otpButton: {
        backgroundColor: "#28a745",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginRight: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 50,
    },
    otpText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    otpInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        textAlign: "center",
        minHeight: 50,
    },
    disabled: {
        backgroundColor: "#A9A9A9",
    },
    infoText: {
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        marginTop: 10,
    },
    customToastContainer: {
        backgroundColor: "rgba(60, 60, 60, 0.9)",
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 30,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    customToastText: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
    },
    progressBar: {
        height: 3,
        backgroundColor: "#00ff99",
        width: "100%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 5,
    },
});

export default OTP;


