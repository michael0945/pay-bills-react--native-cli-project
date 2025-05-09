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
    Alert,
    Share,
} from "react-native";
import { z } from "zod";
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
import DstvModals from "./DstvModal";
import { clearOtpState } from "../../redux/slices/payment/otpSlice";
import { clearPaymentState } from "../../redux/paymentSlice";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const { width } = Dimensions.get("window");


const BillAggrigator: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const derashPayment = useSelector((state: RootState) => state.derashPayment)
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [showReceipt, setShowReceipt] = useState(false);
    const DcardNumber = useSelector((state: RootState) => state.derashPayment.DcardNumber)


    const schema = z.object({
        subscriberMobile: z.string().min(10, "Mobile number must be at least 10 characters"),
        accountNumber: z.string().min(1, "Account number is required"),
        DaccountNumber: z.string().min(1, ""),
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            subscriberMobile: '',
            DaccountNumber: '',
        },
    });


    const DaccountNumber = watch('DaccountNumber');


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
                        Amount: ${aggrigator.amount}\n
                        Reference: ${aggrigator.referenceNumber}\n
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

        setShowReceipt(false);
        setModalVisible(false);
        dispatch(clearOtpState());
        dispatch(clearDerashPaymentState())
        dispatch(clearBilllookupState())


    };
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="DaccountNumber"
                        render={({ field: { onChange, value } }) => (

                            <TextInput

                                placeholder="Enter Bill ID"
                                style={styles.input}
                                value={billID}
                                keyboardType="numeric"
                                onChangeText={handleChange}
                            />
                        )}
                    />

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleSearch}
                    >
                        <Ionicons name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>




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


                <DstvModals
                    showReceipt={showReceipt}

                    DaccountNumber={DaccountNumber || undefined}
                    handlePrint={handlePrint}
                    handleShare={handleShare}
                    handleCancel={handleCancel}
                    handleOkay={handleOkay}
                    handleGoHome={handleGoHome}
                    handlePrintReceipt={handlePrintReceipt}

                />



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
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 4
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
        width: "90%",
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
