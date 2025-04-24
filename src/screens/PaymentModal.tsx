import React from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface PaymentModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  loading: boolean;
  shortMessage?: string;
  longMessage?: string;
  referenceNumber?: string;
  responseAmount?: string;
  resetForm: () => void;

  onClose: () => void;
  onRetry: () => void;
  onNewTopup: () => void;
  onPrintReceipt: () => void;
}


const PaymentModal: React.FC<PaymentModalProps> = ({
  modalVisible,
  setModalVisible,
  loading,
  shortMessage,
  longMessage,
  referenceNumber,
  responseAmount,
  resetForm
}) => {
  return (
    <Modal transparent={true} visible={modalVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color="blue" />
              <Text style={styles.loadingText}>Processing Payment...</Text>
            </>
          ) : (
            <>
              {shortMessage === "Amount not available" ? (
                <View style={styles.centeredView}>
                  <Ionicons name="alert-circle" size={80} color="#D81B60" style={styles.icon} />
                  <Text style={styles.errorTitle}>No Cards Available</Text>
                  <Text style={styles.errorMessage}>
                    {longMessage || "Denomination requested not available for PIN-based topup purchase."}
                  </Text>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#007bff" }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.actionButtonText}>Try Again</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : shortMessage ? (
                <View style={styles.centeredView}>
                  <Ionicons name="checkmark-circle" size={80} color="green" style={styles.icon} />
                  <Text style={styles.successTitle}>{shortMessage}</Text>
                  <Text style={styles.infoText}>Ref # {referenceNumber}</Text>
                  <Text style={styles.infoText}>Amount: {responseAmount}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.actionButton2}
                      onPress={() => {
                        resetForm();
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.actionButtonText}>New Topup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.actionButtonText}>Home Screen</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.actionButton1}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.actionButtonText1}>Print Receipt</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.centeredView}>
                  <Text style={styles.infoText}>Payment Failed</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.errorButton}
                  >
                    <Text style={styles.errorButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10
  },
  centeredView: {
    alignItems: "center"
  },
  icon: {
    marginBottom: 10
  },
  errorTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: "#D81B60"
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    width: "100%"
  },
  actionButtonText: {
    color: "#fff",
    marginRight: 5
  },
  successTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center"
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  actionButton2: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center"
  },
  actionButton1: {
    backgroundColor: "#ffc107",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center"
  },
  actionButtonText1: {
    color: "#000",
    fontWeight: "bold"
  },
  errorButton: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
    borderRadius: 5
  },
  errorButtonText: {
    color: "white",
    textAlign: "center"
  }
});

export default PaymentModal;