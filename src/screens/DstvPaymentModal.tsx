// components/DstvPaymentModal.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setAmountDueC } from '../../redux/dstvCatalogPaymentSlice';

interface DstvPaymentModalProps {
    visible: boolean;
    showReceipt: boolean;
    styles: Record<string, any>;
    accountNumber?: string;
    subscriberMobile?: string;
    onCancel: () => void;
    onOkay: () => void;
    onGoHome: () => void;
    onPrint: () => void;
    onShare: () => void;
    onPrintReceipt: () => void;
    calcModalVisible: boolean;
    setCalcModalVisible: (visible: boolean) => void;
    amount: string;
}

const SuccessContent: React.FC<{
    amount: string;
    message: string;
    reference: string;
    bcardNumber?: string;
    showReceipt: boolean;
    accountNumber?: string;
    subscriberMobile?: string;
    styles: Record<string, any>;
    onPrint: () => void;
    onShare: () => void;
    onCancel: () => void;
    onOkay: () => void;
    onGoHome: () => void;
    onPrintReceipt: () => void;
}> = ({
    amount,
    message,
    reference,
    bcardNumber,
    showReceipt,
    accountNumber,
    subscriberMobile,
    styles,
    onPrint,
    onShare,
    onCancel,
    onOkay,
    onGoHome,
    onPrintReceipt,
}) => {
        if (!showReceipt) {
            return (
                <View style={styles.modalContainer2}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="white" />
                    </View>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.successMessageText}>{message}</Text>
                    <Text style={styles.refText}>Ref # {reference}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.newPaymentButton} onPress={onOkay}>
                            <Ionicons name="arrow-forward" size={18} color="white" />
                            <Text style={styles.buttonText}>New DStv Payment</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
                            <Ionicons name="home-outline" size={18} color="white" />
                            <Text style={styles.buttonText}>Home Screen</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.printButton} onPress={onPrintReceipt}>
                        <Ionicons name="print-outline" size={18} color="black" />
                        <Text style={styles.printButtonText}>Print Receipt</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View>
                <View style={styles.receiptModal}>
                    <ScrollView contentContainerStyle={styles.receiptCard}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerText}>MONETA AGENTS (SUPER AGENT)</Text>
                        <Text style={styles.subHeaderText}>ADDIS ABABA</Text>
                        <Text style={styles.subHeaderText}>TRANSACTION RECEIPT</Text>

                        {[
                            ['01-05-2025', '9:24AM'],
                            ['Terminal ID:', 'MICHAELM'],
                            ['Cash Till #:', '7212401'],
                            ['Cashier:', 'Michaelm'],
                            ['RefNo:', reference],
                            ['ConfNo:', 'n/a'],
                        ].map(([label, value], index) => (
                            <View key={index} style={styles.row1}>
                                <Text style={styles.label1}>{label}</Text>
                                <Text style={styles.value1}>{value}</Text>
                            </View>
                        ))}

                        <View style={styles.separator} />
                        <View style={styles.row1}>
                            <Text style={styles.boldText}>Description</Text>
                            <Text style={styles.boldText}>Amount</Text>
                        </View>

                        {[
                            ['DSTV payment at Moneta Agents', amount],
                            ['(Super Agent) Card:', accountNumber || 'N/A'],
                            ['Mob:', subscriberMobile || 'N/A'],
                            ['Service Fee', '7.00'],
                            ['Total Paid', amount],
                        ].map(([label, value], index) => (
                            <View key={index} style={styles.row1}>
                                <Text style={styles.label1}>{label}</Text>
                                <Text style={styles.value1}>{value}</Text>
                            </View>
                        ))}

                        <View style={styles.separator} />
                        <Text style={styles.textLine}>{bcardNumber}</Text>
                        <Text style={styles.textLine}>Mobile: +251923782471</Text>
                        <Text style={styles.textLine}>Acct#: *********8216</Text>
                        <Text style={styles.textLine}>Customer: Michael Mengistu Tekle</Text>

                        <View style={styles.footer}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.footerLogo}
                            />
                            <Text style={styles.footerText}>Enabling Commerce in the New Service Economy</Text>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.container3}>
                    <TouchableOpacity style={[styles.button, styles.print]} onPress={onPrint}>
                        <Ionicons name="print" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.share]} onPress={onShare}>
                        <Ionicons name="share-social" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                        <Ionicons name="close" size={16} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

const DstvPaymentModal: React.FC<DstvPaymentModalProps> = ({
    visible,
    showReceipt,
    styles,
    accountNumber,
    subscriberMobile,
    onCancel,
    onOkay,
    onGoHome,
    onPrint,
    onShare,
    onPrintReceipt,

    amount,
}) => {
    const [calcModalVisible, setCalcModalVisible] = useState(false);

    const dispatch = useDispatch();
    const { dstvPayment, dstvCatalogPayment, dstvState, dstvCatalog, dstvCalculation } = useSelector((state: RootState) => ({
        dstvPayment: state.dstvPayment,
        dstvCatalogPayment: state.dstvCatalogPayment,
        dstvState: state.dstv,
        dstvCatalog: state.dstvCatalog,
        dstvCalculation: state.dstvCalculation,
    }));

    const renderLoading = (text: string = 'Processing Payment...') => (
        <View style={styles.modalContainer3}>
            <ActivityIndicator size="large" color="#015CB7" />
            <Text style={styles.modalText}>{text}</Text>
        </View>
    );

    const renderError = (errorMessage: string) => (
        <View style={styles.modalContainer3}>
            <Ionicons name="close-circle-outline" size={48} color="red" />
            <Text style={styles.modalText}>Payment Failed</Text>
            <Text style={styles.modalSubText}>{errorMessage}</Text>
        </View>
    );

    const renderModalContent = () => {
        if (dstvPayment.loading || dstvCatalogPayment.loading) return renderLoading();
        if (dstvPayment.error) return renderError(dstvPayment.error);
        if (dstvPayment.shortMessage) {
            return renderSuccess(
                dstvPayment.amount,
                dstvPayment.shortMessage,
                dstvPayment.referenceNumber,
                dstvPayment.bcardNumber
            );
        }
        if (dstvCatalogPayment.status === 'succeeded') {
            return renderSuccess(
                dstvCatalogPayment.amount,
                dstvCatalogPayment.shortMessage,
                dstvCatalogPayment.referenceNumber
            );
        }
        return null;
    };

    const renderSuccess = (
        amount: string,
        message: string,
        reference: string,
        bcardNumber?: string
    ) => (
        <SuccessContent
            amount={amount}
            message={message}
            reference={reference}
            bcardNumber={bcardNumber}
            showReceipt={showReceipt}
            accountNumber={accountNumber}
            subscriberMobile={subscriberMobile}
            styles={styles}
            onPrint={onPrint}
            onShare={onShare}
            onCancel={onCancel}
            onOkay={onOkay}
            onGoHome={onGoHome}
            onPrintReceipt={onPrintReceipt}
        />
    );

    return (
        <>
            {/* Main Payment Modal */}
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalBackground}>{renderModalContent()}</View>
            </Modal>

            {/* Calculation Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent
                visible={calcModalVisible}
                onRequestClose={() => setCalcModalVisible(false)}
            >
                <View style={styles.modalOverlay1}>
                    <View style={styles.modalContainer1}>
                        <Text style={styles.header}>DStv Payment Confirmation</Text>

                        {[
                            ['Account Number', accountNumber || 'N/A'],
                            ['Subscriber Mobile', subscriberMobile || 'N/A'],
                            ['Package Amount', 'N/A'],
                            ['Exchange Rate', 'N/A'],
                            ['Payment Amount', dstvCatalogPayment?.amountDueC || 'N/A'],
                            ['Admin Fee', 'N/A'],
                            ['Subtotal Amount', 'N/A'],
                            ['VAT', 'N/A'],
                            ['Service Fee', '7.00 ETB'],
                        ].map(([label, value], index) => (
                            <View key={index} style={styles.row}>
                                <Text style={styles.label1}>{label}</Text>
                                <Text style={styles.value}>{value}</Text>
                            </View>
                        ))}

                        <View style={styles.rowTotal}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>
                                <Text>Amount: {amount} ETB</Text>
                            </Text>
                        </View>

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

            {/* Error Modals */}
            <Modal
                visible={dstvPayment.status === 'failed' || dstvCatalogPayment.status === 'failed'}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer2}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="alert-circle" size={60} color="#e60000" />
                        </View>
                        <Text style={styles.description}>
                            {dstvPayment.status === 'failed'
                                ? dstvPayment.longMessage || 'Invalid DSTV Smart Card Number'
                                : dstvCatalogPayment.longMessage || 'Failed to fetch DSTV catalog'}
                        </Text>
                        <TouchableOpacity style={styles.tryAgainButton} onPress={onOkay}>
                            <View style={styles.row}>
                                <Text style={styles.buttonText}>Try Again</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Loading Modals */}
            <Modal visible={dstvState.status === 'loading'} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    {renderLoading('Looking up bill...')}
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
        </>
    );
};

export default DstvPaymentModal;