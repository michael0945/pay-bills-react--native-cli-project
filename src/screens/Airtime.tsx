import React, { use, useCallback, useState } from "react";
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
    SafeAreaView,
    Share,
    Alert
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
    setMobileNumber,
    setAmount,
    setPinType,
    submitPayment,
    clearPaymentState
} from "../../redux/paymentSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import OTP from "./OTP";
import { z } from "zod";
import { clearOtpState } from "../../redux/slices/payment/otpSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DstvModals from "./DstvModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { watchFolders } from "../../metro.config";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { clearDstvPaymentState } from "../../redux/dstvPaymentSlice";
import { cleardstvCatalogPaymentState } from "../../redux/dstvCatalogPaymentSlice";
import { clearDerashPaymentState } from "../../redux/derashPaymentSlice";



const { width, height } = Dimensions.get("window");

// Define Zod schema
const airtimeSchema = z.object({

    mobileNumber: z.string()
        .min(9, "Mobile number must be at least 9 digits")
        .max(15, "Mobile number must be at most 15 digits")
        .regex(/^\d+$/, "Subscriber Mobile is required"),
    amount: z.string()
        .regex(/^\d+$/, "Amount must be a number")
        .refine(val => parseInt(val) >= 50 && parseInt(val) <= 1000, {
            message: "Amount must be between 50 and 1000",
        }),
});

const AirtimeScreen = () => {
    const [selectedTopup, setSelectedTopup] = useState<"PIN" | "PINLESS">("PIN");
    const [selectedAmount, setSelectedAmount] = useState<number>(25);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [errors, setErrors] = useState<{ mobileNumber?: string; amount?: string }>({});
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isPin = selectedTopup === "PIN";
    const amounts = [25, 50, 100, 250, 500, 1000];
    const dispatch = useDispatch<AppDispatch>();
    const [formResetKey, setFormResetKey] = useState(0);

    const {
        loading,
        shortMessage,
        referenceNumber,
        responseAmount,

        error,
    } = useSelector((state: RootState) => state.payment);
    const payment = useSelector((state: RootState) => state.payment)
    const longMessage = useSelector((state: RootState) => state.payment.longMessage);

    const [mobileNumberState, setMobileNumberState] = useState<string>("");
    const AcardNumber = useSelector((state: RootState) => state.payment.AcardNumber)

    const handlePayment = () => {
        const payload = {
            mobileNumber: mobileNumberState,
            amount: selectedTopup === "PIN" ? selectedAmount.toString() : customAmount,
        };

        const result = airtimeSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: { mobileNumber?: string; amount?: string } = {};
            result.error.errors.forEach(err => {
                if (err.path.includes("mobileNumber")) {
                    fieldErrors.mobileNumber = err.message;
                }
                if (err.path.includes("amount")) {
                    fieldErrors.amount = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setModalVisible(true);
        dispatch(submitPayment());
    };

    const resetForm = () => {
        setCustomAmount("");
        setSelectedAmount(25);
        setSelectedTopup("PIN");
        setMobileNumberState("");
        setErrors({});
    };
    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(clearOtpState());


            };
        }, [])
    );
    const handleOkay = () => {
        clearForm();
        setModalVisible(false);

        dispatch(clearPaymentState());
        dispatch(clearOtpState());
        dispatch(clearOtpState());
        dispatch(clearPaymentState());
        dispatch(clearDstvPaymentState());
        dispatch(cleardstvCatalogPaymentState());
        dispatch(clearDerashPaymentState());


    };
    const clearAllStates = () => {



    };

    const handleGoHome = () => {
        handleCancel()
        navigation.navigate("Home");
    };

    // Receipt Printing
    const handlePrintReceipt = () => {
        setShowReceipt(true);
    };
    const handlePrint = async () => {
        console.log("hello")
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `DSTV Payment Receipt\n
                    Amount: ${payment.amount}\n
                    Reference: ${payment.referenceNumber}\n
                    Date: ${new Date().toLocaleString()}`,
                title: 'DSTV Payment Receipt'
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                }
            }
        } catch (error) {
            Alert.alert('Share Error', 'Failed to share receipt');
        }
    };
    const handleCancel = () => {
        clearForm()
        setShowReceipt(false);
        setModalVisible(false);
        dispatch(clearOtpState());
        dispatch(clearPaymentState())


    };
    const BrCircleIcon = () => (
        <View style={styles.brCircle}>
            <Text style={styles.brText}>Br</Text>
        </View>
    );

    const clearForm = () => {
        setMobileNumberState('');
        dispatch(setMobileNumber(''));
        setSelectedTopup('PIN');

        setCustomAmount('');
        setCustomAmount("");
        setSelectedAmount(25);
        setSelectedTopup("PIN");
        setMobileNumberState("");
        setErrors({});
        dispatch(clearOtpState())
        setFormResetKey(prev => prev + 1);
        // reset other states as needed
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
                            <View style={styles.inputContainer} >
                                <FontAwesome5Icon name="mobile-alt" size={18} color="#b0b0b0" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    keyboardType="phone-pad"
                                    placeholder="Mobile Number"
                                    value={mobileNumberState}
                                    onChangeText={(text) => {
                                        setMobileNumberState(text);
                                        dispatch(setMobileNumber(text));
                                    }}
                                />
                            </View>
                            {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}

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
                            <Text style={styles.topupDescription}>
                                PIN: Topup prepaid airtime with PIN to be sent to customer mobile phone in text message.
                            </Text>
                        </View>

                        {/* Amount Selection */}
                        {selectedTopup === "PIN" ? (
                            <View style={styles.section}>

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
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <BrCircleIcon />
                                                <Text
                                                    style={[
                                                        styles.amountText,
                                                        selectedAmount === amt && styles.selectedAmountText
                                                    ]}
                                                >
                                                    {amt}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <Text style={styles.label}>Amount (50 to 1000)</Text>
                                <TextInput
                                    style={styles.inputContainer}
                                    placeholder="Enter custom amount"
                                    keyboardType="numeric"
                                    value={customAmount}
                                    onChangeText={(text) => {
                                        setCustomAmount(text);
                                        dispatch(setAmount(text));
                                    }}
                                />
                                {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                            </View>
                        )}


                        <DstvModals
                            showReceipt={showReceipt}

                            accountNumber={AcardNumber ?? undefined}
                            handlePrint={handlePrint}
                            handleShare={handleShare}
                            handleCancel={handleCancel}
                            handleOkay={handleOkay}
                            handleGoHome={handleGoHome}
                            handlePrintReceipt={handlePrintReceipt}
                            isPin={isPin}
                        />

                    </View>
                    <View key={formResetKey}>
                        <OTP />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, backgroundColor: "#f8f9fa", elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, borderRadius: 10, marginTop: 15 },
    section: { padding: 15 },
    label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
    input: { flex: 1, fontSize: 14, color: "#333" },
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
    icon: { marginRight: 10 },
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
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 50,
        width: "92.4%",




    },
    errorText: { color: "red", fontSize: 13, marginTop: -3, marginBottom: 10 },
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
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50




    },
    modalContainer2: {
        width: "85%",
        height: "31%",



        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,




    },
    iconContainer: {

        borderRadius: 50,
        padding: 10,
        marginBottom: 15,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    tryAgainButton: {
        marginTop: 75,
        flexDirection: 'row',
        backgroundColor: '#0066cc',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '126%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "white",
        marginLeft: 15,
        fontWeight: "500",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,

        paddingVertical: 6,

        paddingLeft: 5,
        borderBottomColor: '#0066cc',
        marginLeft: 5
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 45,
        marginBottom: 10,

    },
    brCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#d3d3d3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    brText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },

});


export default AirtimeScreen;
