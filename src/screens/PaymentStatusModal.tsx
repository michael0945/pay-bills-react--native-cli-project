import React from 'react';
import {
    View, Text, ActivityIndicator, ScrollView,
    Image, TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

type Props = {
    loading: boolean;
    error?: string;
    shortMessage?: string;
    amount?: string;
    referenceNumber?: string;
    bcardNumber?: string;
    showReceipt: boolean;
    accountNumber?: string;
    subscriberMobile?: string;
    handlePrint: () => void;
    handleShare: () => void;
    handleCancel: () => void;
    handleOkay: () => void;
    handleGoHome: () => void;
    handlePrintReceipt: () => void;
};

const PaymentStatusModal: React.FC<Props> = ({
    loading,
    error,
    shortMessage,
    amount,
    referenceNumber,
    bcardNumber,
    showReceipt,
    accountNumber,
    subscriberMobile,
    handlePrint,
    handleShare,
    handleCancel,
    handleOkay,
    handleGoHome,
    handlePrintReceipt
}) => {

    if (loading) {
        return (
            <View style={styles.modalContainer3}>
                <ActivityIndicator size="large" color="#015CB7" />
                <Text style={styles.modalText}>Processing Payment...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.modalContainer3}>
                <Ionicons name="close-circle-outline" size={48} color="red" />
                <Text style={styles.modalText}>Payment Failed</Text>
                <Text style={styles.modalSubText}>{error}</Text>
            </View>
        );
    }

    if (shortMessage && amount && referenceNumber) {
        if (showReceipt) {
            return (
                <View style={styles.modalBackground} >
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
                            <View style={styles.row1}><Text style={styles.label1}>RefNo:</Text><Text style={styles.value1}>{referenceNumber}</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>ConfNo:</Text><Text style={styles.value1}>n/a</Text></View>

                            <View style={styles.separator} />
                            <View style={styles.row1}><Text style={styles.boldText}>Description</Text><Text style={styles.boldText}>Amount</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>DSTV payment at Moneta Agents</Text><Text style={styles.value1}>{amount}</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>(Super Agent) Card:</Text><Text style={styles.value1}>{accountNumber || 'N/A'}</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>Mob:</Text><Text style={styles.value1}>{subscriberMobile || 'N/A'}</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>Service Fee</Text><Text style={styles.value1}>7.00</Text></View>
                            <View style={styles.row1}><Text style={styles.label1}>Total Paid</Text><Text style={styles.value1}>{amount}</Text></View>

                            <View style={styles.separator} />
                            <Text style={styles.textLine}>Payment with:{bcardNumber}</Text>
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
            );
        }

        return (
            <View style={styles.modalBackground} >
                <View style={styles.modalContainer2}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="white" />
                    </View>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.successMessageText}>{shortMessage}</Text>
                    <Text style={styles.refText}>Ref # {referenceNumber}</Text>

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
            </View>
        );
    }

    return null;
};

export default PaymentStatusModal;
