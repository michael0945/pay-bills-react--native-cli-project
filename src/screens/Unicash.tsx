import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Picker } from "@react-native-picker/picker";

const Unicash = () => {
    const [enterpriseCode, setEnterpriseCode] = useState("");
    const [searchValue, setSearchValue] = useState("");





    return (
        <View style={styles.container}>
            <Picker
                selectedValue={enterpriseCode}

                style={styles.picker}
            >
                <Picker.Item label="Select Enterprise" value="" enabled={false} />
                <Picker.Item label="Sample School" value="auc001" />
                <Picker.Item label="Sample Billing" value="buc001" />
            </Picker>

            <TextInput
                placeholder="Enter Search Value"
                value={searchValue}
                onChangeText={setSearchValue}
                style={styles.input}
            />

            <TouchableOpacity



            >

            </TouchableOpacity>




        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    picker: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#a0a0a0",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },
    resultContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#e9ecef",
        borderRadius: 8,
    },
    resultText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});

export default Unicash;
