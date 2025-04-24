import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";


const Airlines: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.instruction}>
                Enter PNR reservation
            </Text>
            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Account Number"
                    placeholderTextColor="#A0A0A0"
                />
                <TouchableOpacity style={styles.searchButton}>

                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#ffffff",
    },
    instruction: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
        borderRadius: 8,
        paddingHorizontal: 10,
        width: "90%",
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: "#333",
    },
    searchButton: {
        backgroundColor: "#0057b3",
        padding: 10,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
});

export default Airlines;
