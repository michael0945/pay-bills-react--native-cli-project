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


const schema = z.object({
    accountNumber: z.string().nonempty("Account Number is required"),
    subscriberMobile: z.string().nonempty("Subscriber Mobile is required"),
});

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
    const [showReceipt, setShowReceipt] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [calcModalVisible, setCalcModalVisible] = useState(false);

    const bcardNumber = useSelector((state: RootState) => state.dstvPayment.bcardNumber);

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
        dispatch(clearDstvPaymentState());
        dispatch(cleardstvCatalogPaymentState());
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
        setShowReceipt(true);

    }

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
    const renderModalContent = () => {
        if (dstvPayment.loading || dstvCatalogPayment.loading) {
            return renderLoading();
        }

        if (dstvPayment.error) {
            return renderError(dstvPayment.error);
        }

        if (dstvPayment.shortMessage) {
            return renderSuccess(
                dstvPayment.amount,
                dstvPayment.shortMessage,
                dstvPayment.referenceNumber,
                dstvPayment.bcardNumber
            );
        }

        if (dstvCatalogPayment.status === "succeeded") {
            return renderSuccess(
                dstvCatalogPayment.amount,
                dstvCatalogPayment.shortMessage,
                dstvCatalogPayment.referenceNumber
            );
        }

        return null;
    };

    const renderLoading = () => (
        <View style={styles.modalContainer3}>
            <ActivityIndicator size="large" color="#015CB7" />
            <Text style={styles.modalText}>Processing Payment...</Text>
        </View>
    );

    const renderError = (errorMessage: string) => (
        <View style={styles.modalContainer3}>
            <Ionicons name="close-circle-outline" size={48} color="red" />
            <Text style={styles.modalText}>Payment Failed</Text>
            <Text style={styles.modalSubText}>{errorMessage}</Text>
        </View>
    );

    const renderSuccess = (amount: string, message: string, reference: string, bcardNumber: string) => (
        showReceipt ? (
            <View >


                <View style={styles.receiptModal}>
                    <ScrollView contentContainerStyle={styles.receiptCard}>
                        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.headerText}>MONETA AGENTS (SUPER AGENT)</Text>
                        <Text style={styles.subHeaderText}>ADDIS ABABA</Text>
                        <Text style={styles.subHeaderText}>TRANSACTION RECEIPT</Text>

                        <View style={styles.row1}><Text style={styles.label1}>01-05-2025</Text><Text style={styles.value1}>9:24AM</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Terminal ID:</Text><Text style={styles.value1}>MICHAELM</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Cash Till #:</Text><Text style={styles.value1}>7212401</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Cashier:</Text><Text style={styles.value1}>Michaelm</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>RefNo:</Text><Text style={styles.value1}>{reference}</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>ConfNo:</Text><Text style={styles.value1}>n/a</Text></View>

                        <View style={styles.separator} />

                        <View style={styles.row1}><Text style={styles.boldText}>Description</Text><Text style={styles.boldText}>Amount</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>DSTV payment at Moneta Agents</Text><Text style={styles.value1}>{amount}</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>(Super Agent) Card:</Text><Text style={styles.value1}>{accountNumber || 'N/A'}</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Mob:</Text><Text style={styles.value1}>{subscriberMobile || 'N/A'}</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Service Fee</Text><Text style={styles.value1}>7.00</Text></View>
                        <View style={styles.row1}><Text style={styles.label1}>Total Paid</Text><Text style={styles.value1}>{amount}</Text></View>

                        <View style={styles.separator} />
                        <Text style={styles.textLine}>{bcardNumber}</Text>
                        <Text style={styles.textLine}>Mobile: +251923782471</Text>
                        <Text style={styles.textLine}>Acct#: *********8216</Text>
                        <Text style={styles.textLine}>Customer: Michael Mengistu Tekle</Text>

                        <View style={styles.footer}>
                            <Image source={require('../../assets/logo.png')} style={styles.footerLogo} />
                            <Text style={styles.footerText}>Enabling Commerce in the New Service Economy</Text>
                        </View>
                    </ScrollView>

                </View>


                <View style={styles.container3}>
                    <TouchableOpacity style={[styles.button, styles.print]} onPress={handlePrint}>
                        <Ionicons name="print" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.share]} onPress={handleShare}>
                        <Ionicons name="share-social" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={handleCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                        <Ionicons name="close" size={16} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>


            </View>

        ) : (
            <View style={styles.modalContainer2}>
                <View style={styles.successIconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="white" />
                </View>
                <Text style={styles.amountText}>{amount}</Text>
                <Text style={styles.successMessageText}>{message}</Text>
                <Text style={styles.refText}>Ref # {reference}</Text>

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

                <TouchableOpacity style={styles.printButton} onPress={handlePrintReceipt}>
                    <Ionicons name="print-outline" size={18} color="black" />
                    <Text style={styles.printButtonText}>Print Receipt</Text>
                </TouchableOpacity>
            </View>
        )
    );



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




                {/* Payment Modal */}

                {/* )} */}
                {/* Payment Modal */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        {renderModalContent()}
                    </View>
                </Modal>

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
                    dstvCatalog.status === "succeeded" && { elevation: 3 } // apply elevation only when succeeded
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
                : dstvCatalog.shortMessage === "Success" ? (
                    <Text style={styles.errorText}>{dstvCatalog.shortMessage}</Text>
                ) : calculationTriggered && dstvCalculation.status === "succeeded" ? (
                    <>
                        <OTP />
                        <TouchableOpacity style={styles.submitButton} onPress={handlePaymentC}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </>
                ) : null}
        </ScrollView>
    );
};



export default DstvPaymentScreen; 