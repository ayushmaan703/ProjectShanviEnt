import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { Card, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../store/slice/Admin.slice";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/d.jpg"


const DailyReport = () => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const dispatch = useDispatch()
    const empId = useSelector((state) => state.auth.userData?.EmpId)

    const handleAssignTask = async () => {
        const response = await dispatch(assignTask({ ExpDate: formattedDate, task: title, TaskDescp: description, EmpId: empId, AdminId: empId }))
        if (response.type === "assignTask/fulfilled") {
            setTitle("")
            setDescription("")
            Toast.show({
                type: 'customNotificationSuccess',
                text1: "Report Submitted",
                visibilityTime: 1000
            });
        }
        else {
            setTitle("")
            setDescription("")
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Submitting",
                visibilityTime: 1000
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

                {/* navbar */}
                <CustomNavBar title={"New Task"} />

                <Card style={styles.card}>

                    <Card.Content>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter title"
                            value={title}
                            onChangeText={setTitle} />
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input2}
                            placeholder="Enter description"
                            value={description}
                            onChangeText={setDescription} multiline />
                        {description && title && <Button mode="contained" onPress={handleAssignTask} style={styles.button}>Submit</Button>}
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e2e2e2",
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 3,
        marginTop: 10,
        borderWidth: 1.5,
        padding: 10,
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
        color: "#444",
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#fff",
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 2,
        fontSize: 14,
    },
    input2: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#fff",
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 2,
        fontSize: 14,
        height: 200,
        alignContent: 'flex-start',
        textAlignVertical: 'top',
    },
    button: {
        marginTop: 8,
        backgroundColor: "rgba(74, 144, 226, 0.85)"
    },

});

export default DailyReport;
