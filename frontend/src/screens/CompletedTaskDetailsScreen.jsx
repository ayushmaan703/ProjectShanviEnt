import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Card } from "react-native-paper";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/d.jpg"
import { formattedDate } from "../helper/formattedDate";

const CompletedTaskDetails = ({ route }) => {

    const { task } = route.params;

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Tasks Details"} color='#28A745' />
            {/* Task Card */}
            <Card style={styles.card}>
                <ImageBackground
                    source={image}
                    style={styles.background}
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 15, opacity: 0.685 }}
                >
                    <Card.Content>
                        <Text style={styles.taskTitle}>{task.Task}</Text>
                        <Text style={styles.label}>Remark:</Text>
                        <Text style={styles.value}>{task.DoneRemark}</Text>
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.value}>{task.Description}</Text>

                        <Text style={styles.label}>Assigned To:</Text>
                        <Text style={styles.value}>{task.AssignTo}</Text>

                        <Text style={styles.label}>Assigned Date:</Text>
                        <Text style={styles.value}>{formattedDate(task.TaskDate)}</Text>

                        <Text style={styles.label}>Completion Date:</Text>
                        <Text style={styles.value}>{formattedDate(task.DoneDate)}</Text>
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

export default CompletedTaskDetails;
