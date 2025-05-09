import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');



const styles2 = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, backgroundColor: "#f8f9fa", elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, borderRadius: 10, marginTop: 15 },
    section: { padding: 15 },
    label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
    input: {
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#666"
    },
    topupContainer: { flexDirection: "row", justifyContent: "flex-start" },
    topupOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        paddingVertical: 5
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#015CB7",
        marginRight: 8
    },
    selectedRadioCircle: { backgroundColor: "#2ecc71" },
    topupText: { fontSize: 16, fontWeight: "bold", color: "#015CB7" },
    topupDescription: { fontSize: 12, color: "#555", marginTop: 5 },
    amountContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    amountButton: {
        width: "30%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 5
    },
    selectedAmount: {
        backgroundColor: "#2ecc71",
        borderColor: "#2ecc71"
    },
    amountText: { fontSize: 16, fontWeight: "bold", color: "#333" },
    selectedAmountText: { color: "#fff" },
    submitButton: {
        backgroundColor: "#015CB7",
        paddingVertical: 20,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 50,



    },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 40,
        borderRadius: 10,
        width: "85%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5

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
    modalContainer1: {
        width: "85%",
        height: "30%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,

    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#00B055",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    actionButton2: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#015CB7",
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 6,
        marginTop: 6,
        width: "55%",
    },
    actionButton1: {
        backgroundColor: "#FFD700",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
        width: "100%"
    },
    actionButtonText: { color: "#fff", textAlign: "center" },
    actionButtonText1: { color: "#fff", textAlign: "center" },
    errorButton: {
        backgroundColor: "red",
        padding: 10,
        marginTop: 10,
        borderRadius: 5
    },
    successText: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 5,
        textAlign: "center"
    },
    errorTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        color: "#D81B60"
    },
    modalText: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 20
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,

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
    amountText1: {
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
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50




    },
    modalContainer2: {
        width: "85%",
        height: "31%",



        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        marginTop: -150,




    },
    iconContainer: {

        borderRadius: 50,
        padding: 10,
        marginBottom: 15,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    tryAgainButton: {
        marginTop: 75,
        flexDirection: 'row',
        backgroundColor: '#0066cc',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '126%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "white",
        marginLeft: 15,
        fontWeight: "500",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,

        paddingVertical: 6,

        paddingLeft: 5,
        borderBottomColor: '#0066cc',
        marginLeft: 5
    },
});
export default styles2;
