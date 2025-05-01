import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { backgroundColor: "#ffffff", padding: 15, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, borderRadius: 10, marginTop: 15 },
    amountUI: { borderRadius: 10, marginTop: 5, marginBottom: -7, padding: 15, },
    amountUICatalog: { borderRadius: 10, marginTop: 7, paddingTop: 2, marginBottom: -7, padding: 15, backgroundColor: "#ffffff", },
    receiptModal: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '94%',
        height: 'auto',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 30,
        marginBottom: -15,



    },
    receiptCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        padding: 1,
        alignItems: 'flex-start',

        alignContent: 'center',
        justifyContent: "space-between",

    },
    container3: {

        flexDirection: 'row',

        gap: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 40,
        paddingTop: 10,
        paddingBottom: 10,
    },
    button1: {
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,

    },
    print: {
        backgroundColor: '#007bff',
        paddingHorizontal: 30,
        paddingVertical: 20,

        marginTop: 10,
        marginBottom: 10,

        marginRight: 40,

    },
    share: {
        backgroundColor: '#28a745',
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginBottom: 10,
        marginLeft: -30,

    },
    cancel: {
        backgroundColor: '#212121',

        paddingHorizontal: 30,
        paddingVertical: 20,
        marginBottom: 10,

    },
    cancelText: {
        color: '#fff',
        fontSize: 14,
    },
    logo: {
        width: 100,
        height: 30,
        alignSelf: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        alignSelf: 'center',
    },
    subHeaderText: {
        fontSize: 14,
        textAlign: 'center',
        alignSelf: 'center',
    },
    textLine: {
        fontSize: 13,
        marginVertical: 2,
    },
    boldText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 1,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
        width: '100%',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerLogo: {
        width: 60,
        height: 20,
        marginBottom: 4,
    },
    footerText: {
        fontSize: 11,
        color: '#777',
        textAlign: 'center',
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    label1: {
        fontSize: 14,
        color: '#000',
        flex: 1,
    },

    value1: {
        fontSize: 14,
        color: '#000',
        textAlign: 'right',
        flex: 1,
    },
    printButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 6,
    },
    printButtonText: {
        marginLeft: 5,
        fontSize: 14,
    },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
    label: { fontSize: 14, color: "#666", marginBottom: 5 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 45,
        marginBottom: 10,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 14, color: "#333" },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#015CB7",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,

    },
    // buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    errorText: { color: "red", fontSize: 14, marginTop: 5 },
    responseContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#fffff",
        borderRadius: 8,
    },
    responseText: { fontSize: 14, color: "#333", marginBottom: 5 },

    submitButton: {
        backgroundColor: "#015CB7",
        paddingVertical: 20,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 50,
        width: "90%",

    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    okayButton: {
        marginTop: 15,
        backgroundColor: "#015CB7",
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8,
    },
    okayButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",

    },
    packageButton: {
        width: "30%",
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",

    },
    packageButtonSelected: {
        backgroundColor: "#2ecc71",
    },
    packageText: {
        color: "#333",
        fontSize: 13,
        textAlign: "center",
    },
    packageTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    periodContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownMock: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 10,
    },
    dropdownText: {
        fontSize: 14,
        color: "#333",
    },
    calculateButton: {
        backgroundColor: "#015CB7",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,


    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",



    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 20,
        alignItems: "center",
    },
    modalContainer2: {
        width: "85%",
        height: "31%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,



    },
    successIconContainer: {
        backgroundColor: "#00B055",

        borderWidth: 5,
        borderColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        // elevation: 2,

        padding: 1,
        borderRadius: 50,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",


    },
    modalContainer3: {
        backgroundColor: "white",
        padding: 40,
        borderRadius: 10,
        width: "85%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5

    },
    amountText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    successMessageText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    refText: {
        fontSize: 14,
        color: "#777",
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,

    },
    newPaymentButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#015CB7",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00B055",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    buttonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "500",
    },
    printButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFD500",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 4,
        width: "115%",
    },
    printButtonText: {
        color: "black",
        marginLeft: 5,
        fontWeight: "500",
        marginTop: 2,
        paddingBottom: 2,
        width: "80%",

    },
    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    modalSubText: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginVertical: 4,
    },
    picker: {
        backgroundColor: "#f0f0f0",
        marginBottom: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#1E90FF',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalOverlay1: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer1: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        elevation: 10,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'center',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#0066cc',
    },
    rowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginTop: 8,
    },
    label1: {
        color: '#555',
        fontSize: 14,
    },
    value: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#007bff',
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    continueText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    centerContent: {
        alignItems: 'center',
    },
    iconContainer: {

        borderRadius: 50,
        padding: 10,
        marginBottom: 15,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e60000',
        marginBottom: 10,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    tryAgainButton: {
        marginTop: 30,
        flexDirection: 'row',
        backgroundColor: '#0066cc',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '116%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },




});

export default styles;
