import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

type DstvModalProps = {
    visible: boolean;
    onClose: () => void;
    // States
    dstvPayment: any;
    dstvCatalogPayment: any;
    dstvState: any;
    dstvCatalog: any;
    dstvCalculation: any;
    // Handlers
    handleOkay: () => void;
    handleGoHome: () => void;
    handlePrintReceipt: () => void;
};

const DstvModal = ({
    visible,
    onClose,
    dstvPayment,
    dstvCatalogPayment,
    dstvState,
    dstvCatalog,
    dstvCalculation,
    handleOkay,
    handleGoHome,
    handlePrintReceipt,
}: DstvModalProps) => {
    const renderLoading = (message: string) => (
        <View style={styles.modalContainer3}>
            <ActivityIndicator size="large" color="#015CB7" />
            <Text style={styles.modalText}>Processing</Text>
            <Text style={styles.modalSubText}>{message}</Text>
        </View>
    );

    const renderError = (errorMessage: string) => (
        <View style={styles.modalContainer3}>
            <Ionicons name="close-circle-outline" size={48} color="red" />
            <Text style={styles.modalText}>Payment Failed</Text>
            <Text style={styles.modalSubText}>{errorMessage}</Text>
        </View>
    );

    const renderLookupError = (errorMessage?: string) => (
        <View style={styles.modalContainer2}>
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={60} color="#e60000" />
            </View>
            <Text style={styles.errorTitle}>Invalid Card Num</Text>
            <Text style={styles.description}>
                {errorMessage ||
                    "The DSTV Smart Card Number provided is invalid. It must be a 10-digit number."}
            </Text>
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleOkay}>
                <View style={styles.row}>
                    <Text style={styles.buttonText}>Try Again</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderSuccess = (amount: string, message: string, reference: string) => (
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
    );

    const getModalContent = () => {
        // Payment Loading
        if (dstvPayment.loading || dstvCatalogPayment.loading) {
            return renderLoading("Processing Payment...");
        }

        // DSTV Lookup Loading
        if (dstvState.status === "loading") {
            return renderLoading("Looking up bill...");
        }

        // DSTV Catalog Fetching
        if (dstvCatalog.loading) {
            return renderLoading("Fetching Packages...");
        }

        // DSTV Calculation Loading
        if (dstvCalculation.status === "loading") {
            return renderLoading("Processing...");
        }

        // Payment Error
        if (dstvPayment.error) {
            return renderError(dstvPayment.error);
        }

        // DSTV Lookup Error
        if (dstvState.status === "failed") {
            return renderLookupError(dstvState.longMessage);
        }

        // Catalog Payment Success
        if (dstvCatalogPayment.status === "succeeded") {
            return renderSuccess(
                dstvCatalogPayment.amount,
                dstvCatalogPayment.shortMessage,
                dstvCatalogPayment.referenceNumber
            );
        }

        // Regular Payment Success
        if (dstvPayment.shortMessage) {
            return renderSuccess(
                dstvPayment.amount,
                dstvPayment.shortMessage,
                dstvPayment.referenceNumber
            );
        }

        return null;
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                {getModalContent()}
            </View>
        </Modal>
    );
};

export default DstvModal;