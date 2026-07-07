import React from "react";
import { View, Text, StyleSheet, ImageBackground, } from "react-native";
import { Card } from "react-native-paper";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/download.jpg"
import { formattedDate } from "../helper/formattedDate";

const LedgerReportScreen = ({ route }) => {

    const { data } = route.params;

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Detailed Ledger"} color="rgba(123, 126, 209, 1)" />
            {/* Task Card */}
            <Card style={styles.card}>
                <ImageBackground
                    source={image}
                    style={styles.background}
                    resizeMode=""
                    imageStyle={{ borderRadius: 15, opacity: 0.685, }}
                >
                    <Card.Content>
                        <Text style={styles.taskTitle}>{data.Employee}</Text>

                        <Text style={styles.label}>PaymentType:</Text>
                        <Text style={styles.value}>{data.PaymentType}</Text>

                        <Text style={styles.label}>Bill Number:</Text>
                        <Text style={styles.value}>{data.BillNo}</Text>

                        <Text style={styles.label}>From:</Text>
                        <Text style={styles.value}>{data.From}</Text>

                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>{formattedDate(data.Date)}</Text>

                        <Text style={styles.label}>Debit:</Text>
                        <Text style={[styles.value, { color: "red" }]}>{data.Debit} DR</Text>

                        <Text style={styles.label}>Credit:</Text>
                        <Text style={[styles.value, { color: "green" }]}>{data.Credit} CR</Text>

                        <Text style={styles.label}>Balance:</Text>
                        <Text style={[styles.value, data.Balance.trim().startsWith('-') && { color: "red" }]}>{data.Balance.substring(1)}</Text>

                        <Text style={styles.label}>Remark:</Text>
                        <Text style={styles.value}>{data.Remark}</Text>

                    </Card.Content>
                </ImageBackground>
            </Card>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#e2e2e2"
    },
    card: {
        borderRadius: 10,
        backgroundColor: "white",
        marginBottom: 20,
        marginTop: 10,
        borderWidth: 2,
        height: "auto",
    },
    taskTitle: {
        fontSize: 25,
        marginBottom: 2,
        color: "#333",
        fontFamily: "Merriweather_24pt-ExtraBold",
        letterSpacing: 2,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.5,
        color: "#000",
        marginTop: 10
    },
    value: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1,

    },
});

export default LedgerReportScreen;
