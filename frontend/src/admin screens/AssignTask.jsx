import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { Card, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import SelectDropdown from "react-native-select-dropdown";
import { assignTask } from "../store/slice/Admin.slice";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/d.jpg"


const AssignTask = () => {
    const [taskDate, setTaskDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [task, setTask] = useState("");
    const [selectedCategory, setSelectedCategory] = useState()
    const [description, setDescription] = useState("");
    const employees = useSelector((state) => state.admin.list);
    const dispatch = useDispatch()
    const adminId = useSelector((state) => state.auth.userData?.EmpId)

    const handleAssignTask = async () => {
        const formatedDate = moment(taskDate).format('DD-MMM-YYYY')
        const response = await dispatch(assignTask({ ExpDate: formatedDate, task: task, TaskDescp: description, EmpId: selectedCategory, AdminId: adminId }))
        if (response.type === "assignTask/fulfilled") {
            setTaskDate(new Date())
            setTask("")
            setDescription("")
            Toast.show({
                type: 'customNotificationSuccess',
                text1: "Task Assigned",
                visibilityTime: 1000
            });
        }
        else {
            setTaskDate(new Date())
            setTask("")
            setDescription("")
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Assigning Task",
                visibilityTime: 1000
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

                {/* navbar */}
                <CustomNavBar title={"Assign Task"} color="rgba(123, 126, 209, 1)" />

                <Card style={styles.card}>
              
                        <Card.Content>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5, }}>
                                <Text style={styles.label}>Task Date : </Text>
                                <Text style={styles.label}>{moment(taskDate).format('DD/MM/YYYY')}</Text>
                            </View>
                            <Button mode="contained-tonal" onPress={() => setShowDatePicker(true)}>Select Date</Button>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={taskDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setTaskDate(selectedDate);
                                    }}
                                />
                            )}
                            <Text style={styles.label}>Assign To</Text>
                            <SelectDropdown
                                data={employees}
                                search
                                dropdownOverlayColor="transparent"
                                searchPlaceHolder="Search categories..."
                                onSelect={(selectedItem, index) => {
                                    setSelectedCategory(selectedItem.Id)
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {(selectedItem && selectedItem.Name) || 'Select Employee'}
                                            </Text>
                                            <Icon
                                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                style={styles.dropdownButtonArrowStyle} />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View
                                            style={{
                                                ...styles.dropdownItemStyle,
                                                ...(isSelected && { backgroundColor: '#D2D9DF' })
                                            }}>
                                            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                            <Text style={styles.dropdownItemTxtStyle}>{item.Name}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />
                            <Text style={styles.label}>Task</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter task"
                                value={task}
                                onChangeText={setTask} />
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter description"
                                value={description}
                                onChangeText={setDescription} multiline />
                            {description && task && selectedCategory && <Button mode="contained" onPress={handleAssignTask} style={styles.button}>Assign Task</Button>}
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
        fontSize: 18,
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
        fontSize: 16,
    },
    button: {
        marginTop: 8,
    },
    dropdownButtonStyle: {
        height: 50,
        backgroundColor: '#e2e2e2',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 5,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 1,
        color: '#151E26',

    },
    dropdownButtonArrowStyle: {
        fontSize: 18,
        color: "#666"
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,

    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomColor: "#000",
        borderBottomWidth: 0.5
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export default AssignTask;
