// components/PaymentModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from 'react-redux';
import styles2 from './styles2';
import styles from './styles';
import { clearOtpState } from '../../redux/slices/payment/otpSlice';


// Props
interface Props {
  visible: boolean;
  loading: boolean;
  shortMessage?: string;
  longMessage?: string;
  referenceNumber?: string;
  responseAmount?: string;
  onClose: () => void;
  onNewPayment: () => void;
  onTryAgain: () => void;
  showReceipt: boolean;
  reference?: string;
  amount?: string;
  accountNumber?: string;
  subscriberMobile?: string;
  bcardNumber?: string;
  handlePrint: () => void;
  handleShare: () => void;
  handleCancel: () => void;
}

const PaymentModal: React.FC<Props> = ({
  visible,
  loading,
  shortMessage,
  longMessage,
  referenceNumber,
  responseAmount,
  onClose,
  onNewPayment,
  onTryAgain,
  showReceipt,
  reference,
  amount,
  accountNumber,
  subscriberMobile,
  bcardNumber,
  handlePrint,
  handleShare,
  handleCancel,
}) => {
  const dispatch = useDispatch();

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        {loading ? (
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Processing Payment...</Text>
          </View>
        ) : showReceipt ? (
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
        ) : shortMessage ? (
          <View style={styles.modalContainer1}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="white" />
            </View>
            <Text style={styles.amountText1}>{responseAmount}</Text>
            <Text style={styles.successMessageText}>{shortMessage}</Text>
            <Text style={styles.refText}>Ref # {referenceNumber}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton2}
                onPress={() => {
                  onNewPayment();
                  dispatch(clearOtpState());
                }}
              >
                <Ionicons name="arrow-forward" size={18} color="white" />
                <Text style={styles.actionButtonText}>New Topup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                <Ionicons name="home-outline" size={18} color="white" />
                <Text style={styles.actionButtonText}>Home Screen</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.printButton} onPress={onNewPayment}>
              <Ionicons name="print-outline" size={18} color="black" />
              <Text style={styles.actionButtonText1}>Print Receipt</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer2}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={60} color="#e60000" />
              </View>
              {longMessage ? (
                <Text style={{ color: 'green', fontSize: 16, marginTop: 10, textAlign: 'center' }}>{longMessage}</Text>
              ) : (
                <Text style={styles.description}>Something went wrong.</Text>
              )}
              <TouchableOpacity style={styles.tryAgainButton} onPress={onTryAgain}>
                <View style={styles.row}>
                  <Text style={styles.buttonText}>Try Again</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 200 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PaymentModal;
