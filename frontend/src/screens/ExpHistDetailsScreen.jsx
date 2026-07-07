import React from "react";
import { View, Text, StyleSheet, ImageBackground, } from "react-native";
import { Card } from "react-native-paper";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/expHist.jpg"
import { formattedDate } from "../helper/formattedDate";

const ExpHistDetailsScreen = ({ route }) => {

    const { data ,status} = route.params;

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Expence Details"} />
            {/* Task Card */}
            <Card style={styles.card}>
                <ImageBackground
                    source={image}
                    style={styles.background}
                    resizeMode=""
                    imageStyle={{ borderRadius: 15, opacity: 0.685, }}
                >
                    <Card.Content>
                        <Text style={styles.taskTitle}>{data.Expence}</Text>

                        {/* <Text style={styles.label}>Id:</Text>
                        <Text style={styles.value}>{data.id}</Text> */}

                        <Text style={styles.label}>Bill Amount:</Text>
                        <Text style={styles.value}>{data.BillAmount}</Text>

                        <Text style={styles.label}>Expence Date:</Text>
                        <Text style={styles.value}>{formattedDate(data.Date)}</Text>

                        <Text style={styles.label}>Remark:</Text>
                        <Text style={styles.value}>{data.Remark}</Text>

                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{status}</Text>

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
        fontFamily: "Merriweather_24pt-Regular",
        letterSpacing: 1,

    },
});

export default ExpHistDetailsScreen;
