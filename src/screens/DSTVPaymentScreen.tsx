import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ActivityIndicator,
    ScrollView,
    Button,
    Alert,
    Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import styles from "./styles";

import OTP from "./OTP";

import { RootState } from "../../redux/store";
import {
    fetchDSTVData,
    clearDSTVState,
} from "../../redux/slices/service/dstvSlice";
import {
    fetchDstvCatalog,
    clearDSTVCatalog,
} from "../../redux/slices/service/dstvCatalog";
import {
    fetchDSTVPayment,
    setAmountDue,
    setVendorAccount,
} from "../../redux/dstvPaymentSlice";
import { Picker } from "@react-native-picker/picker";
import { fetchDSTVCatalogPayment, setAmountDueC, setProductCode, setVendorAccountC } from "../../redux/dstvCatalogPaymentSlice";
import { fetchDstvCalculation, resetCalculationState, setInfo2, setInfo3 } from "../../redux/dstvCalculationSlice";
import { AppDispatch } from "../../redux/store";

const schema = z.object({
    accountNumber: z.string().nonempty("Account Number is required"),
    subscriberMobile: z.string().nonempty("Subscriber Mobile is required"),
});
const { width, height } = Dimensions.get('window'); // Get device dimensions

const DstvPaymentScreen: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const dstvState = useSelector((state: RootState) => state.dstv);
    const dstvPayment = useSelector((state: RootState) => state.dstvPayment);
    const dstvCatalog = useSelector((state: RootState) => state.dstvCatalog);
    const { amount, status } = useSelector((state: RootState) => state.dstvCalculation);
    const dstvCalculation = useSelector((state: RootState) => state.dstvCalculation)
    const [calculationTriggered, setCalculationTriggered] = useState(false);
    const dstvCatalogPayment = useSelector((state: RootState) => state.dstvCatalogPayment);
    const [selectedPackage, setSelectedPackage] = useState<string | null>("Gojo");
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [calcModalVisible, setCalcModalVisible] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<{ ProductCode: string; label: string } | null>(null);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            subscriberMobile: '',
            accountNumber: '',
        },
    });
    const subscriberMobile = watch('subscriberMobile');
    const accountNumber = watch('accountNumber')
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedPeriod, setSelectedPeriod] = useState("1");
    const handleGetCustomerBill = (data: any) => {
        dispatch(clearDSTVCatalog());
        dispatch(fetchDSTVData(data.accountNumber));
    };
    const handleFetchCatalog = () => {
        dispatch(clearDSTVState());
        dispatch(fetchDstvCatalog());
    };
    const handlePayment = () => {
        dispatch(fetchDSTVPayment());

        setModalVisible(true);
    };
    const handlePaymentC = () => {
        console.log("Selected Package:", dstvCatalogPayment.vendorAccountC);
        console.log("Selected Amount:", dstvCatalogPayment.amountDueC);
        console.log("Selected Product:", dstvCatalogPayment.productCode);
        dispatch(fetchDSTVCatalogPayment());

        setModalVisible(true);
    };
    const handleOkay = () => {
        setModalVisible(false);
        reset();
        dispatch(clearDSTVState());
        dispatch(clearDSTVCatalog());
        dispatch(resetCalculationState());
        setCalculationTriggered(false);
    };
    useEffect(() => {
        if (dstvState.status === "succeeded" && dstvState.amountDue) {
            dispatch(setAmountDue(dstvState.amountDue.toString()));
        }
    }, [dstvState.status, dstvState.amountDue]);
    // // Clear everything on screen blur/unfocus

    // useFocusEffect(
    //     useCallback(() => {
    //         return () => {
    //             dispatch(clearDSTVState());
    //             dispatch(clearDSTVCatalog());
    //             reset();
    //         };
    //     }, [])
    // );
    const handleGoHome = () => {
        navigation.navigate("Home");
    };

    const handlePrintReceipt = () => {

    }
    const handleCalculateAmount = () => {
        console.log('Selected Product:', selectedProduct);
        console.log('Selected Period:', selectedPeriod);
        if (!selectedProduct) return;

        const info2 = selectedProduct.ProductCode;
        const info3 = selectedPeriod;

        dispatch(setInfo2(info2));
        dispatch(setInfo3(info3));
        dispatch(fetchDstvCalculation({ info2, info3 }))
        setCalcModalVisible(true);
        setCalculationTriggered(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Form Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DSTV Customer Information</Text>

                    <Text style={styles.label}>Account Number</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="card-outline" size={18} color="#b0b0b0" style={styles.icon} />
                        <Controller
                            control={control}
                            name="accountNumber"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Account Number"
                                    placeholderTextColor="#b0b0b0"
                                    value={value}
                                    onChangeText={(text) => {
                                        onChange(text);
                                        dispatch(setVendorAccount(text));
                                        dispatch(setVendorAccountC(text));

                                    }}
                                    keyboardType="numeric"
                                />
                            )}
                        />
                    </View>
                    {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber.message}</Text>}

                    <Text style={styles.label}>Subscriber Mobile</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={18} color="#b0b0b0" style={styles.icon} />
                        <Controller
                            control={control}
                            name="subscriberMobile"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Subscriber Mobile"
                                    placeholderTextColor="#b0b0b0"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="phone-pad"
                                />
                            )}
                        />

                    </View>
                    {errors.subscriberMobile && <Text style={styles.errorText}>{errors.subscriberMobile.message}</Text>}
                </View>

                {/* Action Buttons */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit(handleGetCustomerBill)}>
                    <Text style={styles.buttonText}>Get Customer’s Bill</Text>
                    <Ionicons name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSubmit(handleFetchCatalog)}>
                    <Text style={styles.buttonText}>Pay by Selecting Package</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

                {/* Lookup Loading Modal */}
                <Modal visible={dstvState.status === "loading"} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ActivityIndicator size="large" color="#015CB7" />
                            <Text style={styles.modalText}>Processing</Text>
                            <Text style={styles.modalSubText}>Looking up bill...</Text>
                        </View>
                    </View>
                </Modal>

                {/* Bill Result */}
                {dstvState.status === "succeeded" && (
                    <View style={styles.responseContainer}>
                        {/* <Text style={styles.responseText}>{dstvState.shortMessage}</Text> */}
                        <Text style={styles.responseText}>Amount Due: {dstvState.amountDue}</Text>

                        {[...Array(6)].map((_, i) => {
                            const line = dstvState[`line${i + 1}` as keyof typeof dstvState];
                            return line ? <Text key={i} style={styles.responseText}>{line}</Text> : null;
                        })}
                    </View>
                )}
                <Modal visible={dstvState.status === "failed"} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer2}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="alert-circle" size={60} color="#e60000" />
                            </View>
                            <Text style={styles.errorTitle}>Invalid Card Num</Text>
                            <Text style={styles.description}>
                                {dstvState.longMessage || "The DSTV Smart Card Number provided is invalid. It must be a 10-digit number."}
                            </Text>

                            <TouchableOpacity style={styles.tryAgainButton} onPress={handleOkay} >
                                <View style={styles.row}>
                                    <Text style={styles.buttonText}>Try Again</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* {dstvState.status === "failed" && (
                    console.log("Error:", dstvState.longMessage),
                    <Text style={styles.errorText}>{dstvState.longMessage}</Text>
                )} */}

                {/* Catalog Modal */}
                <Modal visible={dstvCatalog.loading} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ActivityIndicator size="large" color="#015CB7" />
                            <Text style={styles.modalText}>Fetching Packages...</Text>
                        </View>
                    </View>
                </Modal>

                <Modal visible={dstvCalculation.status === "loading"} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ActivityIndicator size="large" color="#015CB7" />
                            <Text style={styles.modalText}>Processing...</Text>
                        </View>
                    </View>
                </Modal>


                {/* DSTV Package Selection */}
                {dstvCatalog.catalog.length > 0 && (
                    <View style={styles.responseContainer}>
                        <Text style={styles.sectionTitle}>Packages</Text>
                        <View style={styles.gridContainer}>
                            {dstvCatalog.catalog.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.packageButton,
                                        selectedPackage === item.Product && styles.packageButtonSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedPackage(item.Product);
                                        dispatch(setProductCode(item.ProductCode));
                                        dispatch(setAmountDueC(item.MonthlyPrice));
                                        setSelectedProduct({ ProductCode: item.ProductCode, label: item.Product });
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.packageText,
                                            selectedPackage === item.Product && styles.packageTextSelected,
                                        ]}
                                    >
                                        {item.Product}
                                    </Text>
                                    {/* <Text style={styles.responseText}> {item.ProductCode}</Text>
                                    <Text style={styles.responseText}> Monthly: {item.MonthlyPrice}</Text>
                                    <Text style={styles.responseText}>Yearly: {item.YearlyPrice}</Text> */}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Select Period and Calculate */}
                        <View style={styles.periodContainer}>
                            <Text style={styles.label}>Select Period:</Text>
                            <Picker
                                selectedValue={selectedPeriod}
                                onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
                                style={styles.dropdownMock}
                            >
                                {Array.from({ length: 11 }, (_, i) => (
                                    <Picker.Item key={i + 1} label={`${i + 1} Month${i > 0 ? 's' : ''}`} value={(i + 1).toString()} />
                                ))}
                                <Picker.Item label="1 Year" value="12" />
                            </Picker>

                            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateAmount} >
                                <Text style={styles.buttonText}>Calculate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={calcModalVisible}
                    onRequestClose={() => setCalcModalVisible(false)}
                >
                    <View style={styles.modalOverlay1}>
                        <View style={styles.modalContainer1}>
                            <Text style={styles.header}>DStv Payment Confirmation</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Account Number</Text>
                                <Text style={styles.value}>{accountNumber || 'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Subscriber Mobile</Text>
                                <Text style={styles.value}>{subscriberMobile || 'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Package Amount</Text>
                                <Text style={styles.value}>{'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Exchange Rate</Text>
                                <Text style={styles.value}>{'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Payment Amount</Text>
                                <Text style={styles.value}>{dstvCatalogPayment.amountDueC}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Admin Fee</Text>
                                <Text style={styles.value}>{'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Subtotal Amount</Text>
                                <Text style={styles.value}>{'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>VAT</Text>
                                <Text style={styles.value}>{'N/A'}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label1}>Service Fee</Text>
                                <Text style={styles.value}>7.00 ETB</Text>
                            </View>

                            <View style={styles.rowTotal}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>
                                    <Text>Amount: {amount} ETB</Text>
                                </Text>
                            </View>

                            {/* ✅ Adjusted Continue Button */}
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => {
                                    dispatch(setAmountDueC(amount ?? ""));
                                    setCalcModalVisible(false);
                                }}
                            >
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                {dstvState.shortMessage === "Success" ? (
                    <>
                        <OTP />
                        <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </>
                )

                    : dstvState.shortMessage ? (
                        <Text style={styles.errorText}>{dstvState.shortMessage}</Text>
                    ) : calculationTriggered && dstvCalculation.status === "succeeded" ? (
                        <>
                            <OTP />
                            <TouchableOpacity style={styles.submitButton} onPress={handlePaymentC}>
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </>
                    ) : null}

                {/* Payment Modal */}

                {/* )} */}
                {/* Payment Modal */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        {dstvPayment.loading ? (
                            <View style={styles.modalContainer3}>
                                <ActivityIndicator size="large" color="#015CB7" />
                                <Text style={styles.modalText}>Processing Payment...</Text>
                            </View>
                        ) : dstvPayment.error ? (
                            <View style={styles.modalContainer3}>
                                <Ionicons name="close-circle-outline" size={48} color="red" />
                                <Text style={styles.modalText}>Payment Failed</Text>
                                <Text style={styles.modalSubText}>{dstvPayment.error}</Text>
                            </View>
                        ) : dstvPayment.shortMessage ? (
                            <View style={styles.modalContainer2}>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark-circle" size={80} color="white" />
                                </View>
                                <Text style={styles.amountText}>{dstvPayment.amount}</Text>
                                <Text style={styles.successMessageText}>{dstvPayment.shortMessage}</Text>
                                <Text style={styles.refText}>Ref # {dstvPayment.referenceNumber}</Text>

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
                        ) : dstvCatalogPayment.status === "succeeded" ? (
                            <View style={styles.modalContainer2}>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark-circle" size={80} color="white" />
                                </View>
                                <Text style={styles.amountText}>{dstvCatalogPayment.amount}</Text>
                                <Text style={styles.successMessageText}>{dstvCatalogPayment.shortMessage}</Text>
                                <Text style={styles.refText}>Ref # {dstvCatalogPayment.referenceNumber}</Text>

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
                        ) : dstvCatalogPayment.loading ? (
                            <View style={styles.modalContainer3}>
                                <ActivityIndicator size="large" color="#015CB7" />
                                <Text style={styles.modalText}>Processing Payment...</Text>
                            </View>
                        ) : null}
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
};



export default DstvPaymentScreen;