import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getAllEmployeeList } from "../store/slice/Admin.slice";
import CustomNavBar from "../helper/CustomNavBar";

const AdminHome = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllEmployeeList());
    }, [dispatch]);

    return (
        <ScrollView style={{ backgroundColor: "#e2e2e2" }}>
            <View style={styles.container}>
                <CustomNavBar title={"SE Work Flow"} color="rgba(123, 126, 209, 1)" />

                <View style={styles.gridContainer}>
                    <View style={styles.row}>
                        <CustomCard
                            title="Assign Task"
                            description="Create and assign daily tasks to employees"
                            buttonText="Assign Now"
                            onPress={() => navigation.navigate("AssignTask")}
                        />
                        <CustomCard
                            title="Logged-in Employees"
                            description="See which employees are currently logged in"
                            buttonText="View List"
                            onPress={() => navigation.navigate("EmployeeList")}
                        />
                    </View>

                    <View style={styles.row}>
                        <CustomCard
                            title="Employee Expenses"
                            description="Track submitted and approved employee expenses"
                            buttonText="View"
                            onPress={() => navigation.navigate("EmployeeExpence")}
                        />
                        <CustomCard
                            title="Account Ledger"
                            description="View individual employee account balances and records"
                            buttonText="View"
                            onPress={() => navigation.navigate("EmployeeLedger")}
                        />
                    </View>

                    <View style={styles.singleRow}>
                        <CustomCard
                            title="Employee Task History"
                            description="Review completed tasks and performance history"
                            buttonText="View Task History"
                            fullWidth
                            onPress={() => navigation.navigate("EmpTaskHistSelect")}
                        />
                    </View>

                </View>
            </View>
        </ScrollView>
    );
};

const CustomCard = ({ title, description, buttonText, onPress, fullWidth }) => {
    return (
        <View style={[styles.customCard, fullWidth && styles.fullCard]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const screenWidth = Dimensions.get("window").width;
const cardMargin = 8;
const cardWidth = (screenWidth - 32 - cardMargin * 4) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e2e2e2",
        padding: 16,
    },
    gridContainer: {
        marginTop: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    singleRow: {
        alignItems: "center",
        marginBottom: 16,
    },
    customCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "#777",
        width: "45%",
        marginHorizontal: cardMargin,
        elevation: 2,
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 10
    },
    fullCard: {
        width: cardWidth * 2 + cardMargin * 2,
    },
    cardHeader: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 17,
        color: "#333",
        fontFamily: "Merriweather_24pt-Bold",
    },
    cardBody: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    cardDescription: {
        fontSize: 14,
        color: "#555",
        letterSpacing: 0.1,
        fontFamily: "Merriweather_24pt-Light",
    },
    button: {
        backgroundColor: "rgba(99, 103, 224, 0.73)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: "center",
        alignSelf: "center",
        width: "85%",
    },
    buttonText: {
        color: "#fff",
        fontFamily: "Merriweather_24pt-Bold",
        fontSize: 11,
        letterSpacing: 1
    },
});

export default AdminHome;
