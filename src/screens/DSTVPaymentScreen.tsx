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

import styles from './styles';

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
    clearDstvPaymentState,
    fetchDSTVPayment,
    setAmountDue,
    setVendorAccount,
} from "../../redux/dstvPaymentSlice";
import { Picker } from "@react-native-picker/picker";
import { cleardstvCatalogPaymentState, fetchDSTVCatalogPayment, setAmountDueC, setProductCode, setVendorAccountC } from "../../redux/dstvCatalogPaymentSlice";
import { fetchDstvCalculation, resetCalculationState, setInfo2, setInfo3 } from "../../redux/dstvCalculationSlice";
import { AppDispatch } from "../../redux/store";
import { Image } from "react-native";
import { Share } from 'react-native';
import RNPrint from 'react-native-print';
import DstvModals from "./DstvModal";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";


const schema = z.object({
    accountNumber: z.string().nonempty("Account Number is required"),
    subscriberMobile: z.string().nonempty("Subscriber Mobile is required"),
});

const DstvPaymentScreen: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Redux State Selectors
    const dstvState = useSelector((state: RootState) => state.dstv);
    const dstvPayment = useSelector((state: RootState) => state.dstvPayment);
    const dstvCatalog = useSelector((state: RootState) => state.dstvCatalog);
    const dstvCatalogPayment = useSelector((state: RootState) => state.dstvCatalogPayment);
    const dstvCalculation = useSelector((state: RootState) => state.dstvCalculation);
    const { amount, status } = dstvCalculation;
    const bcardNumber = dstvPayment.bcardNumber;

    // Local State
    const [modalVisible, setModalVisible] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [calcModalVisible, setCalcModalVisible] = useState(false);
    const [calculationTriggered, setCalculationTriggered] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string | null>('Gojo');
    const [selectedPeriod, setSelectedPeriod] = useState("1");

    const [selectedProduct, setSelectedProduct] = useState<{
        ProductCode: string;
        MonthlyPrice: string;
        YearlyPrice: string;
    } | null>(() => {
        const gojoPackage = dstvCatalog.catalog.find(item => item.Product === "Gojo");
        return gojoPackage ? {
            ProductCode: gojoPackage.ProductCode,
            MonthlyPrice: gojoPackage.MonthlyPrice,
            YearlyPrice: gojoPackage.YearlyPrice
        } : null;
    });

    // Form
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
            accountNumber: '',
        },
    });

    const subscriberMobile = watch('subscriberMobile');
    const accountNumber = watch('accountNumber');

    // useEffect: Initialize Gojo package if needed
    useEffect(() => {
        if (dstvCatalog.catalog.length > 0 && !selectedProduct) {
            const gojoPackage = dstvCatalog.catalog.find(item => item.Product === "Gojo");
            if (gojoPackage) {
                const product = {
                    ProductCode: gojoPackage.ProductCode,
                    MonthlyPrice: gojoPackage.MonthlyPrice,
                    YearlyPrice: gojoPackage.YearlyPrice,
                };
                setSelectedProduct(product);
                dispatch(setProductCode(product.ProductCode));
                dispatch(setAmountDueC(product.MonthlyPrice));
            }
        }
    }, [dstvCatalog.catalog]);

    // Handle Package Selection
    const handlePackageSelect = (item: CatalogItem) => {
        setSelectedPackage(item.Product);
        setSelectedProduct({
            ProductCode: item.ProductCode,
            MonthlyPrice: item.MonthlyPrice,
            YearlyPrice: item.YearlyPrice
        });
        dispatch(setProductCode(item.ProductCode));
        dispatch(setAmountDueC(item.MonthlyPrice));
    };

    // Get Customer Bill
    const handleGetCustomerBill = (data: any) => {
        dispatch(clearDSTVCatalog());
        dispatch(fetchDSTVData(data.accountNumber));
    };

    // Fetch DSTV Catalog
    const handleFetchCatalog = () => {
        dispatch(clearDSTVState());
        dispatch(fetchDstvCatalog());
    };

    //  Handle Payment
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

    // After Payment
    const handleOkay = () => {
        setModalVisible(false);
        reset();
        dispatch(clearDSTVState());
        dispatch(clearDSTVCatalog());
        dispatch(resetCalculationState());
        dispatch(clearDstvPaymentState());
        dispatch(cleardstvCatalogPaymentState());
        setCalculationTriggered(false);
    };

    // 🔄 Set amount from dstvState if payment data succeeds
    useEffect(() => {
        if (dstvState.status === "succeeded" && dstvState.amountDue) {
            dispatch(setAmountDue(dstvState.amountDue.toString()));
        }
    }, [dstvState.status, dstvState.amountDue]);

    // Clear everything on screen blur/unfocus
    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(clearDSTVState());
                dispatch(clearDSTVCatalog());
                reset();
            };
        }, [])
    );

    // Navigation
    const handleGoHome = () => {
        handleCancel()
        navigation.navigate("Home");
    };

    // Receipt Printing
    const handlePrintReceipt = () => {
        setShowReceipt(true);
    };
    const htmlContent = `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  font-size: 14px;
                  color: #000;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .row {
                  display: flex;
                  justify-content: space-between;
                  margin: 4px 0;
                }
                .bold {
                  font-weight: bold;
                }
                .separator {
                  border-top: 1px dashed #000;
                  margin: 12px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                }
                .footer-logo {
                  width: 80px;
                  height: auto;
                  margin-bottom: 8px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>MONETA AGENTS (SUPER AGENT)</h2>
                <p>ADDIS ABABA</p>
                <p><strong>TRANSACTION RECEIPT</strong></p>
              </div>
      
              <div class="row"><span>01-05-2025</span><span>9:24AM</span></div>
              <div class="row"><span>Terminal ID:</span><span>MICHAELM</span></div>
              <div class="row"><span>Cash Till #:</span><span>7212401</span></div>
              <div class="row"><span>Cashier:</span><span>Michaelm</span></div>
              <div class="row"><span>RefNo:</span><span></span></div>
              <div class="row"><span>ConfNo:</span><span>n/a</span></div>
      
              <div class="separator"></div>
      
              <div class="row bold"><span>Description</span><span>Amount</span></div>
              <div class="row"><span>DSTV payment at Moneta Agents</span><span>${amount || '0.00'}</span></div>
              <div class="row"><span>(Super Agent) Card:</span><span>${accountNumber || 'N/A'}</span></div>
              <div class="row"><span>Mob:</span><span>${subscriberMobile || 'N/A'}</span></div>
              <div class="row"><span>Service Fee:</span><span>7.00</span></div>
              <div class="row"><span>Total Paid:</span><span>${amount || '0.00'}</span></div>
      
              <div class="separator"></div>
              
              <p>${bcardNumber || '************'}</p>
              <p>Mobile: +251923782471</p>
              <p>Acct#: *********8216</p>
              <p>Customer: Michael Mengistu Tekle</p>
      
              <div class="footer">
                <img src="https://via.placeholder.com/100x40.png?text=Moneta+Logo" class="footer-logo" />
                <p>Enabling Commerce in the New Service Economy</p>
              </div>
            </body>
          </html>
        `;
    const handlePrint = async () => {
        try {
            await RNPrint.print({
                html: htmlContent,
            });
        } catch (error) {
            Alert.alert('Print error', error.message);
        }
    };


    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `DSTV Payment Receipt\n
            Amount: ${dstvCatalogPayment.amount}\n
            Reference: ${dstvCatalogPayment.referenceNumber}\n
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
        reset();
        dispatch(clearDSTVState());
        dispatch(clearDSTVCatalog());
        dispatch(resetCalculationState());
        dispatch(clearDstvPaymentState());
        dispatch(cleardstvCatalogPaymentState());
        setCalculationTriggered(false);
    };









    const handleCalculateAmount = () => {
        if (!selectedProduct) {
            Alert.alert("Error", "Please select a package first");
            return;
        }

        if (!selectedPeriod) {
            Alert.alert("Error", "Please select a payment period");
            return;
        }

        const info2 = selectedProduct.ProductCode;
        const info3 = selectedPeriod;

        dispatch(setInfo2(info2));
        dispatch(setInfo3(info3));
        dispatch(fetchDstvCalculation({ info2, info3 }));
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
                        <FontAwesome5Icon name="mobile-alt" size={18} color="#b0b0b0" style={styles.icon} />
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


                {/* Bill Result */}





                {/* DSTV Package Selection */}
                {dstvCalculation.status === "succeeded" ? (
                    <>
                        {/* Calculation Confirmation Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={calcModalVisible}
                            onRequestClose={() => setCalcModalVisible(false)}
                        >
                            <View style={styles.modalOverlay1}>
                                <View style={styles.modalContainer1}>
                                    <Text style={styles.header}>DStv Payment Confirmation</Text>

                                    {/* Account Details */}
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Account Number</Text>
                                        <Text style={styles.value}>{accountNumber || 'N/A'}</Text>
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.label1}>Subscriber Mobile</Text>
                                        <Text style={styles.value}>{subscriberMobile || 'N/A'}</Text>
                                    </View>

                                    {/* Payment Details */}
                                    <View style={styles.row}>
                                        <Text style={styles.label1}>Package Amount</Text>
                                        <Text style={styles.value}>
                                            {selectedProduct?.MonthlyPrice || 'N/A'} ETB
                                        </Text>
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.label1}>Selected Period</Text>
                                        <Text style={styles.value}>
                                            {selectedPeriod} Month(s)
                                        </Text>
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.label1}>Payment Amount</Text>
                                        <Text style={styles.value}>
                                            {amount || 'N/A'} ETB
                                        </Text>
                                    </View>

                                    {/* Fees and Total */}
                                    <View style={styles.row}>
                                        <Text style={styles.label1}>Service Fee</Text>
                                        <Text style={styles.value}>7.00 ETB</Text>
                                    </View>

                                    <View style={styles.rowTotal}>
                                        <Text style={styles.totalLabel}>Total Amount</Text>
                                        <Text style={styles.totalValue}>
                                            {amount ? `${amount} ETB` : 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Action Buttons */}
                                    <TouchableOpacity
                                        style={styles.continueButton}
                                        onPress={() => {
                                            if (amount) {
                                                dispatch(setAmountDueC(amount));
                                                setCalcModalVisible(false);
                                            }
                                        }}
                                    >
                                        <Text style={styles.continueText}>Confirm Payment</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setCalcModalVisible(false)}
                                    >
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                )

                    : null}









            </View>
            {dstvState.status === "succeeded" && (
                <View style={[styles.amountUI, { elevation: 3 }]}>
                    <View style={styles.responseContainer}>
                        <Text style={styles.responseText}>Amount Due: {dstvState.amountDue}</Text>
                        {[...Array(6)].map((_, i) => {
                            const line = dstvState[`line${i + 1}` as keyof typeof dstvState];
                            return line ? <Text key={i} style={styles.responseText}>{line}</Text> : null;
                        })}
                    </View>
                </View>
            )}

            {dstvCatalog.catalog.length > 0 && (
                <View style={[
                    styles.amountUICatalog,
                    dstvCatalog.status === "succeeded" && { elevation: 3 }
                ]}>
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
                                    onPress={() => handlePackageSelect(item)}
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
                </View>
            )}

            {dstvState.shortMessage === "Success" ? (
                <>
                    <OTP />
                    <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </>
            )
                // : dstvCatalog.catalog.length > 0 && selectedPackage ? (
                //     <>
                //         <OTP />
                //         <TouchableOpacity style={styles.submitButton} onPress={handlePaymentC}>
                //             <Text style={styles.submitText}>Submit</Text>
                //         </TouchableOpacity>
                //     </>
                // )
                : dstvCatalog.shortMessage === "succeeded" ? (
                    <Text style={styles.errorText}>{dstvCatalog.shortMessage}</Text>
                ) : calculationTriggered && dstvCalculation.status === "succeeded" ? (
                    <>
                        <OTP />
                        <TouchableOpacity style={styles.submitButton} onPress={handlePaymentC}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </>
                ) : null}

            <DstvModals
                showReceipt={showReceipt}
                subscriberMobile={subscriberMobile}
                accountNumber={accountNumber}
                handlePrint={handlePrint}
                handleShare={handleShare}
                handleCancel={handleCancel}
                handleOkay={handleOkay}
                handleGoHome={handleGoHome}
                handlePrintReceipt={handlePrintReceipt}
                selectedPackage={selectedPackage ?? undefined}
            />
        </ScrollView>
    );
};



export default DstvPaymentScreen; 