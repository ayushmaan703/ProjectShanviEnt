import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, } from "react-native";
import { Button, Card, Modal } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/expHist.jpg"
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { approveExpense } from "../store/slice/Admin.slice";
import { useNavigation } from "@react-navigation/native";
import { formattedDate } from "../helper/formattedDate";

const ExpHistDetailsScreenAdmin = ({ route }) => {

    const { data, status } = route.params;
    const [showModal, setShowModal] = useState(false);
    const CashBankList = useSelector((state) => state.admin.cashBankList);
    const [selectedCategory, setSelectedCategory] = useState()
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const handleApproveTask = async () => {
        try {
            const response = await dispatch(approveExpense({ EmpId: data.id, CashBankId: selectedCategory }));

            if (response.type === "approveExpense/fulfilled" || response.payload[0]?.Status === "Success") {
                navigation.goBack()
                Toast.show({
                    type: 'customNotificationSuccess',
                    text1: "Expence Approved",
                    visibilityTime: 1000
                });
            }
            else {
                Toast.show({
                    type: 'customNotificationError',
                    text1: "Error Approving Expence",
                    visibilityTime: 1000
                });
            }
        } catch (error) {
            Toast.show({
                type: 'customNotificationError',
                text1: "Internal Server Error",
                visibilityTime: 1000
            });
        }
    }
    return (
        <View style={styles.container}>
            <CustomNavBar title={"Approve Expense"} color="rgba(123, 126, 209, 1)" />
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

            <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
                <Text style={styles.buttonText}>✔  Approve</Text>
            </TouchableOpacity>

            <Modal transparent visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Expense</Text>
                        <SelectDropdown
                            data={CashBankList}
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
                                            {(selectedItem && selectedItem.Name) || 'Select Expense'}
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
                        <View style={styles.modalButtons}>
                            <Button
                                mode="contained"
                                buttonColor="#B80F0ACC"
                                labelStyle={styles.modalButtonText}
                                onPress={() => {
                                    setShowModal(false)
                                }}>
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                buttonColor="#28A745CC"
                                labelStyle={styles.modalButtonText}
                                onPress={() => {
                                    handleApproveTask()
                                    setShowModal(false);
                                }}
                            >
                                Approve
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
    modalContainer: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    },
    dropdownButtonStyle: {
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 15
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        color: '#151E26',
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1.3,
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
        borderBottomWidth: 0.5,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        color: '#151E26',
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1.3,
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export default ExpHistDetailsScreenAdmin;
