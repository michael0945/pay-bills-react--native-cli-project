import React from 'react';
import {
    View,
    Text,
    Modal,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { RootState } from '../../redux/store';

type Props = {
    showReceipt: boolean;
    subscriberMobile?: string;
    accountNumber?: string;
    handlePrint: () => void;
    handleShare: () => void;
    handleCancel: () => void;
    handleOkay: () => void;
    handleGoHome: () => void;
    handlePrintReceipt: () => void;
    isPin?: boolean;
    DaccountNumber?: string
    package?: string
    selectedPackage?: string


};

const DstvModals: React.FC<Props> = ({
    showReceipt,
    subscriberMobile,
    DaccountNumber,
    accountNumber,
    handlePrint,
    handleShare,
    handleCancel,
    handleOkay,
    handleGoHome,
    handlePrintReceipt,
    isPin,
    selectedPackage,



}) => {
    const dstvState = useSelector((state: RootState) => state.dstv);
    const dstvPayment = useSelector((state: RootState) => state.dstvPayment);
    const dstvCatalog = useSelector((state: RootState) => state.dstvCatalog);

    const dstvCatalogPayment = useSelector((state: RootState) => state.dstvCatalogPayment);
    const submitPayment = useSelector((state: RootState) => state.payment);
    const dstvCalculation = useSelector((state: RootState) => state.dstvCalculation);
    const payment = useSelector((state: RootState) => state.payment);
    console.log('Redux Payment State:', payment);
    const longMessage = useSelector((state: RootState) => state.payment.longMessage);
    const shortMessage = useSelector((state: RootState) => state.payment.shortMessage);
    const derashPayment = useSelector((state: RootState) => state.derashPayment)
    const derashState = useSelector((state: RootState) => state.derash);
    const aggrigator = useSelector((state: RootState) => state.aggrigator);


    const { amount, status } = dstvCalculation;
    const AcardNumber = useSelector((state: RootState) => state.payment.AcardNumber);


    const bcardNumber = useSelector((state: RootState) => state.dstvPayment.bcardNumber);
    const CcardNumber = useSelector((state: RootState) => state.dstvCatalogPayment.CcardNumber);
    const DcardNumber = useSelector((state: RootState) => state.derashPayment.DcardNumber)
    let cardNumberToShow;

    if (payment.status === 'succeeded') {
        console.log('AcardNumber to show:', payment.AcardNumber);
        cardNumberToShow = payment.AcardNumber;
    } else if (dstvCatalogPayment.status === 'succeeded') {
        cardNumberToShow = CcardNumber;
    } else {
        cardNumberToShow = bcardNumber;
    }

    const renderLoading = (text: string, subText?: string) => (
        <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#015CB7" />
            <Text style={styles.modalText}>{text}</Text>
            {subText && <Text style={styles.modalSubText}>{subText}</Text>}
        </View>
    );

    const renderError = (errorMessage: string) => (
        <View style={styles.modalContainer2}>
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={60} color="#e60000" />
            </View>

            <Text style={styles.description}>
                {errorMessage}
            </Text>

            <TouchableOpacity style={styles.tryAgainButton} onPress={handleOkay} >
                <View style={styles.row}>
                    <Text style={styles.buttonText}>Try Again</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderSuccess = (
        amount: string,
        message: string,
        reference: string,
        cardNumberToShow?: string
    ) =>
        showReceipt ? (
            <View>
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

                        {payment.status === 'succeeded' ? (
                            <>
                                <View style={styles.row1}>
                                    <Text style={styles.label1}>
                                        Mobile airtime {isPin ? 'Pin' : 'Pinless'}{'\n'}
                                        purchase with {AcardNumber}
                                    </Text>
                                    <Text style={styles.value1}>{amount} Birr</Text>
                                </View>
                                <View style={styles.row1}><Text style={styles.label1}>Service Fee</Text><Text style={styles.value1}>0.00 </Text></View>
                                <View style={styles.row1}><Text style={styles.label1}>Total Paid</Text><Text style={styles.value1}>{amount} Birr</Text></View>
                            </>
                        ) : derashPayment.status === 'succeeded' ? (
                            <>
                                <View style={styles.row1}>
                                    <Text style={styles.label1}>Derash bill payment at{'\n'} purchase with {'\n'}{DcardNumber} at Moneta Agents</Text>
                                    <Text style={styles.value1}>{amount} Birr</Text>
                                </View>


                                <View style={styles.row1}><Text style={styles.label1}>Service Fee</Text><Text style={styles.value1}>0.00 </Text></View>
                                <View style={styles.row1}><Text style={styles.label1}>Total Paid</Text><Text style={styles.value1}>{amount} Birr</Text></View>
                            </>
                        ) :


                            (
                                <>
                                    <View style={styles.row1}>
                                        <Text style={styles.label1}>DSTV payment at Moneta Agents</Text>
                                        <Text style={styles.value1}>{amount}</Text>
                                    </View>
                                    <View style={styles.row1}><Text style={styles.label1}>(Super Agent) Card:</Text><Text style={styles.value1}>{accountNumber || 'N/A'}</Text></View>
                                    <View style={styles.row1}><Text style={styles.label1}>Selected Package:</Text><Text style={styles.value1}>{selectedPackage || 'N/A'}</Text></View>
                                    <View style={styles.row1}><Text style={styles.label1}>Mob:</Text><Text style={styles.value1}>{subscriberMobile || 'N/A'}</Text></View>
                                    <View style={styles.row1}><Text style={styles.label1}>Service Fee</Text><Text style={styles.value1}>7.00</Text></View>
                                    <View style={styles.row1}><Text style={styles.label1}>Total Paid</Text><Text style={styles.value1}>{amount}Br</Text></View>
                                </>
                            )}

                        <View style={styles.separator} />
                        <Text style={styles.textLine}>{cardNumberToShow}</Text>
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
                        <Ionicons name="close" size={16} color="#fff" />
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

                {payment.status === 'succeeded' ? (
                    <>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.newPaymentButton} onPress={handleOkay}>
                                <Ionicons name="arrow-forward" size={18} color="white" />
                                <Text style={styles.buttonText}>New Top up</Text>
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
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </View>

        );

    const renderModalContent = () => {
        if (
            dstvPayment.loading ||
            dstvCatalogPayment.loading ||
            payment.loading ||
            derashPayment.loading
        ) {
            return renderLoading('Processing Payment...');
        }

        if (dstvPayment.error) {
            return renderError(dstvPayment.error);
        }

        if (payment.error) {
            return renderError(payment.error);
        }

        if (dstvPayment.shortMessage && dstvPayment.MSG_ErrorCode === "00001") {
            return renderSuccess(
                dstvPayment.amount,
                dstvPayment.shortMessage,
                dstvPayment.referenceNumber
            );
        } else if (
            dstvPayment.shortMessage &&
            dstvPayment.MSG_ErrorCode &&
            dstvPayment.MSG_ErrorCode !== "00001"
        ) {
            return renderError(dstvPayment.longMessage || "Something went wrong.");
        }

        if (dstvCatalogPayment.status === 'succeeded' && dstvCatalogPayment.MSG_ErrorCode === "00001") {
            return renderSuccess(
                dstvCatalogPayment.amount,
                dstvCatalogPayment.shortMessage,
                dstvCatalogPayment.referenceNumber
            );
        } else if (
            dstvCatalogPayment.shortMessage &&
            dstvCatalogPayment.MSG_ErrorCode &&
            dstvCatalogPayment.MSG_ErrorCode !== "00001"
        ) {
            return renderError(dstvCatalogPayment.longMessage || "Something went wrong.");
        }

        if (payment.status === 'succeeded' && payment.MSG_ErrorCode === "00001") {
            return renderSuccess(
                payment.amount,
                payment.shortMessage,
                payment.referenceNumber
            );
        } else if (
            payment.shortMessage &&
            payment.MSG_ErrorCode &&
            payment.MSG_ErrorCode !== "00001"
        ) {
            return renderError(payment.longMessage || "Something went wrong.");
        }

        if (derashPayment.status === 'succeeded' && derashPayment.MSG_ErrorCode === "00001") {
            return renderSuccess(
                derashPayment.amount,
                derashPayment.shortMessage,
                derashPayment.referenceNumber
            );
        } else if (
            derashPayment.shortMessage &&
            derashPayment.MSG_ErrorCode &&
            derashPayment.MSG_ErrorCode !== "00001"
        ) {
            return renderError(derashPayment.longMessage || "Something went wrong.");
        }

        return null;
    };


    return (
        <>
            {/* Main Modal */}
            <Modal transparent visible={!!renderModalContent()} animationType="fade">
                <View style={styles.modalBackground}>{renderModalContent()}</View>
            </Modal>

            {/* Lookup Failed */}
            <Modal
                visible={dstvState.status === 'failed' || dstvCatalog.status === 'failed' || payment.status === "failed" || aggrigator.status === "failed"}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer2}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="alert-circle" size={60} color="#e60000" />
                        </View>
                        <Text style={styles.description}>
                            {dstvState.status === "failed"
                                ? dstvState.longMessage || "The DSTV Smart Card Number provided is invalid. It must be a 10-digit number."
                                : dstvCatalog.status === "failed"
                                    ? dstvCatalog.longMessage || "Failed to fetch DSTV catalog. Please try again later."
                                    : payment.status === "failed"
                                        ? payment.longMessage || "No card available."
                                        : aggrigator.status === "failed"
                                            ? aggrigator.longMessage || aggrigator.error
                                            : ""}
                        </Text>

                        <TouchableOpacity style={styles.tryAgainButton} onPress={handleOkay}>
                            <View style={styles.row}>
                                <Text style={styles.buttonText}>Try Again</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Loading for Lookup/Catalog/Calculation */}
            <Modal visible={dstvState.status === 'loading'} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {renderLoading('Processing', 'Looking up bill...')}
                </View>
            </Modal>

            <Modal visible={dstvCatalog.loading} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {renderLoading('Fetching Packages...')}
                </View>
            </Modal>

            <Modal visible={dstvCalculation.status === 'loading'} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {renderLoading('Calculating Amount...')}
                </View>
            </Modal>
            <Modal visible={aggrigator.status === 'loading'} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {renderLoading('Processing...')}
                </View>
            </Modal>
        </>
    );
};

export default DstvModals;
