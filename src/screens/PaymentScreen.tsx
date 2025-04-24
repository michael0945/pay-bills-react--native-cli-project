import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayment } from './paymentSlice';
import { RootState } from './store';

const PaymentScreen = () => {
    const dispatch = useDispatch();
    const { loading, error, firstName, shortMessage, referenceNumber, amount } = useSelector((state: RootState) => state.payment);

    const [cardNumber, setCardNumber] = useState('');
    const [pin, setPin] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [additionalInfo2, setAdditionalInfo2] = useState('');
    const [paymentType, setPaymentType] = useState<'P' | 'B'>('P');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = () => {
        const paymentData = {
            cardNumber,
            pin,
            amount: paymentAmount,
            additionalInfo1: paymentType,
            additionalInfo2
        };

        dispatch(fetchPayment(paymentData));
        setShowModal(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Gateway</Text>

            {/* Card Number Input */}
            <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
            />

            {/* PIN Input */}
            <TextInput
                style={styles.input}
                placeholder="PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="number-pad"
            />

            {/* Amount Input */}
            <TextInput
                style={styles.input}
                placeholder="Amount"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="decimal-pad"
            />

            {/* Payment Type Selector */}
            <View style={styles.selectorContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, paymentType === 'P' && styles.selectedType]}
                    onPress={() => setPaymentType('P')}>
                    <Text style={styles.buttonText}>PIN (P)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeButton, paymentType === 'B' && styles.selectedType]}
                    onPress={() => setPaymentType('B')}>
                    <Text style={styles.buttonText}>PINLESS (B)</Text>
                </TouchableOpacity>
            </View>

            {/* Additional Info Input */}
            <TextInput
                style={styles.input}
                placeholder="Additional Information"
                value={additionalInfo2}
                onChangeText={setAdditionalInfo2}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}>
                <Text style={styles.buttonText}>Process Payment</Text>
            </TouchableOpacity>

            {/* Processing Modal */}
            <Modal visible={showModal} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {loading ? (
                            <>
                                <Text style={styles.modalTitle}>Processing Payment...</Text>
                                <Text style={styles.modalText}>Please wait</Text>
                            </>
                        ) : error ? (
                            <>
                                <Text style={[styles.modalTitle, styles.errorText]}>Payment Failed</Text>
                                <Text style={styles.modalText}>{error}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowModal(false)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.modalTitle, styles.successText]}>Payment Successful!</Text>
                                <Text style={styles.modalText}>Name: {firstName}</Text>
                                <Text style={styles.modalText}>Amount: {amount}</Text>
                                <Text style={styles.modalText}>Message: {shortMessage}</Text>
                                <Text style={styles.modalText}>Reference: {referenceNumber}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowModal(false)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    typeButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedType: {
        backgroundColor: '#015CB7',
    },
    submitButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#015CB7',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
    },
    successText: {
        color: '#2ecc71',
    },
    errorText: {
        color: '#e74c3c',
    },
});

export default PaymentScreen;