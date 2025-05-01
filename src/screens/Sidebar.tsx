import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import QRCode from "react-native-qrcode-svg";

const Sidebar = (props: any) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');

    const renderLabelPair = (label: string, value: string) => (
        <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* QR Code Section */}
                <View style={styles.qrContainer}>
                    <QRCode value="MICHAELM-72122401" size={120} />
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                    {renderLabelPair("Cashier:", "Michaelm")}
                    {renderLabelPair("Date:", formattedDate)}
                    {renderLabelPair("Login Time:", "10:46 AM")}
                    {renderLabelPair("Device ID:", "MICHAELM")}
                    {renderLabelPair("Till Number:", "72122401")}
                    {renderLabelPair("Version:", "4.4-MPOS-terminal-MPOS")}
                </View>

                {/* Drawer Items */}
                <View style={styles.menuOptions}>
                    <DrawerItem label="User Profile" labelStyle={styles.drawerItemLabel} onPress={() => { }} />
                    <DrawerItem label="Change Password" labelStyle={styles.drawerItemLabel} onPress={() => { }} />
                    <DrawerItem label="Request Help" labelStyle={styles.drawerItemLabel} onPress={() => { }} />
                    <DrawerItem label="Setting" labelStyle={styles.drawerItemLabel} onPress={() => { }} />
                    <DrawerItem label="Logout" labelStyle={styles.drawerItemLabel} onPress={() => { }} />
                </View>
            </SafeAreaView>
        </DrawerContentScrollView>
    );
};

export default Sidebar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    qrContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    userInfo: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    labelRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginRight: 5,
    },
    value: {
        fontSize: 14,
        fontWeight: "400",
        color: "#333",
    },
    menuOptions: {
        marginTop: 20,
    },
    drawerItemLabel: {
        fontSize: 16,
        color: "#015CB7",
        fontWeight: "500",
    },
});
