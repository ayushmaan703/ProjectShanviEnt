import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable } from "react-native";
import { Card, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import SelectDropdown from "react-native-select-dropdown";
import CustomNavBar from "../helper/CustomNavBar";
import { CashBankList } from "../store/slice/Admin.slice";


const EmployeeExpensesDetails = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [showFrom, setFromShow] = useState(false);
    const [toDate, setToDate] = useState(new Date());
    const [showTo, setToShow] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState()
    const employees = useSelector((state) => state.admin.list);
    const navigation = useNavigation()
    const dispatch = useDispatch();
    console.log(selectedCategory);

    const handleSeeExpence = async () => {
        let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
        let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
        navigation.navigate("EmployeeExpenceDetails", { data: { ToDate: formattedToDate, EmpId: selectedCategory.Id, EmpName: selectedCategory.Name, FromDate: formattedFromDate, } })
    }

    useEffect(() => {
        const getBankList = async () => {
            await dispatch(CashBankList());
        }
        getBankList()
    })
    return (
        <View style={styles.container}>

            {/* navbar */}
            <CustomNavBar title={"Expences"} color="rgba(123, 126, 209, 1)" />

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.dateContainer}>
                        <Pressable onPress={() => setFromShow(true)} style={styles.dateButton}>
                            <Text style={styles.boldText}>From:</Text>
                            <Text>{moment(fromDate).format('DD/MM/YYYY')}</Text>
                        </Pressable>
                        <Pressable onPress={() => setToShow(true)} style={styles.dateButton}>
                            <Text style={styles.boldText}>To:</Text>
                            <Text>{moment(toDate).format('DD/MM/YYYY')}</Text>
                        </Pressable>
                        {showFrom && (
                            <DateTimePicker
                                value={fromDate}
                                mode="date"
                                display="default"
                                onChange={(event, date) => { setFromShow(false); setFromDate(date || fromDate); }}
                            />
                        )}
                        {showTo && (
                            <DateTimePicker
                                value={toDate}
                                mode="date"
                                display="default"
                                onChange={(event, date) => { setToShow(false); setToDate(date || toDate); }}
                            />
                        )}
                    </View>
                    <Text style={styles.label}>Select Employee :</Text>
                    <SelectDropdown
                        data={employees}
                        search
                        dropdownOverlayColor="transparent"
                        searchPlaceHolder="Search categories..."
                        onSelect={(selectedItem, index) => {
                            setSelectedCategory(selectedItem)
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
                    <Button mode="contained" onPress={handleSeeExpence} style={styles.button}>See Expence</Button>
                </Card.Content>
            </Card>
        </View>
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
        padding: 16,
        marginTop: 10,
        borderWidth: 1.5
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
    },
    button: {
        marginTop: 8,
    },
    dropdownButtonStyle: {
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 5
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
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        // padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    boldText: {
        color: '#000',
        marginRight: 5,
        fontFamily: "Merriweather_24pt-ExtraBold",
        letterSpacing: 1.3
    },
});

export default EmployeeExpensesDetails;
