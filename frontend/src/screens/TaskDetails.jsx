import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { Card, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { completedTask } from "../store/slice/Task.slice";
import { useNavigation } from "@react-navigation/native";
import CustomNavBar from "../helper/CustomNavBar";
import Toast from "react-native-toast-message";
import image from "../data/d.jpg"
import { formattedDate } from "../helper/formattedDate";

const TaskDetails = ({ route }) => {
    const { task } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [remark, setRemark] = useState("");
    const dispatch = useDispatch()
    const navigation = useNavigation()


    const handleCompletedTask = async (data) => {
        const response = await dispatch(completedTask({ id: task.TaskId, remark: remark }))
        if (response.type === "completedTask/fulfilled") {
            Toast.show({
                type: 'customNotificationSuccess',
                text1: "Task Submitted",
                visibilityTime: 1000
            });
            setRemark("")
            navigation.navigate("Home")
        }
        else {
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Submitting",
                visibilityTime: 1000
            });
        }
    }

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Tasks Details"} />
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
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.value}>{task.Description}</Text>

                        <Text style={styles.label}>Assigned To:</Text>
                        <Text style={styles.value}>{task.AssignTo}</Text>

                        <Text style={styles.label}>Assigned Date:</Text>
                        <Text style={styles.value}>{formattedDate(task.TaskDate)}</Text>
                    </Card.Content>
                </ImageBackground>
            </Card>

            {/* Completed Button */}
            <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                <Text style={styles.buttonText}>✔  Mark as Completed</Text>
            </TouchableOpacity>

            {/* Remark Modal */}
            <Modal transparent visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Remark</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your remarks..."
                            value={remark}
                            onChangeText={setRemark}
                            multiline={true}
                            textAlignVertical="top"
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                mode="contained"
                                buttonColor="#B80F0ACC"
                                labelStyle={styles.modalButtonText}
                                onPress={() => {
                                    setShowModal(false),
                                        setRemark("")
                                }}>
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                buttonColor="#28A745CC"
                                labelStyle={styles.modalButtonText}
                                onPress={() => {
                                    handleCompletedTask(remark)
                                    setRemark("")
                                    setShowModal(false);
                                }}
                            >
                                Submit
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
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
    button: {
        backgroundColor: "#28A745CC",
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",

    },
    modalContent: {
        width: "85%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontFamily: "Merriweather_24pt_SemiCondensed-Regular",
        letterSpacing: 2.5,
        lineHeight: 25,
        fontSize: 17,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    modalButtonText: {
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
        color: "white",
    }
});

export default TaskDetails;
