
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
    ImageBackground
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Card } from 'react-native-paper';
import { RefreshControl } from 'react-native-gesture-handler';
import { seeEmployeeExpences } from '../store/slice/Admin.slice';
import CustomNavBar from '../helper/CustomNavBar';
import Toast from 'react-native-toast-message';
import image from "../data/PremiumVector.jpg"

const ExpenceHistoryForEmp = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [showFrom, setFromShow] = useState(false);
    const [toDate, setToDate] = useState(new Date());
    const [showTo, setToShow] = useState(false);
    const navigation = useNavigation();
    const [tasks, setTasks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [PayType, setPayType] = useState(3);
    const dispatch = useDispatch();
    const empDetails = useSelector((state) => state.auth.userData);


    const onRefresh = async () => {
        let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
        let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
        let empId = empDetails.EmpId;
        setRefreshing(true);
        const responce = await dispatch(seeEmployeeExpences({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate }));
        if (responce.type === "seeEmployeeExpences/fulfilled") {
            setTasks(responce.payload);
        }
        else {
            setTasks([])
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Fetching Expence List",
                visibilityTime: 1000
            });
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
            let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
            let empId = empDetails.EmpId;
            const responce = await dispatch(seeEmployeeExpences({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate }));
            if (responce.type === "seeEmployeeExpences/fulfilled") {
                setTasks(responce.payload);
            }
            else {
                setTasks([])
                Toast.show({
                    type: 'customNotificationError',
                    text1: "Error Fetching Expence List",
                    visibilityTime: 1000
                });
            }

        };
        fetchData();
    }, [dispatch, fromDate, toDate]);

    const renderTask = ({ item }) => (
        <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('ExpHistDetailsScreen', { data: item })}
        >
            <Text style={styles.cell}>{item.Expence}</Text>
            <Text style={styles.cell}>{item.BillAmount}</Text>
            <Text style={styles.cell}>{item.Date}</Text>
            <Text style={styles.cell}>{item.Approved ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>{item.Approved ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>{item.Approved ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>
                {item.Remark.length > 20 ? item.Remark.substring(0, 17) + '...' : item.Remark}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Expence History"} />

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
            <View style={styles.dateContainer}>
                <Pressable onPress={() => setPayType(3)} style={[styles.dateButton, PayType === 3 && { backgroundColor: '#4ae25cff' }]}>
                    <Text style={styles.boldText}>Approved</Text>
                </Pressable>
                <Pressable onPress={() => setPayType(5)} style={styles.dateButton}>
                    <Text style={styles.boldText}>Not Approved</Text>
                </Pressable>
            </View>
            <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Expense</Text>
                <Text style={styles.headerCell}>Amount</Text>
                <Text style={styles.headerCell}>Date</Text>
                <Text style={styles.headerCell}>Approved</Text>
                <Text style={styles.headerCell}>Remark</Text>
                <Text style={styles.headerCell}>Remark</Text>
                <Text style={styles.headerCell}>Remark</Text>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderTask}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.noDataText}>No Expense History..</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "rgba(74, 144, 226, 0.70)",
        borderRadius: 30,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        marginHorizontal: 10
    },
    dateButton: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 20,
        width: "45%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        color: '#000',
        marginRight: 5,
        fontFamily: "Merriweather_24pt-ExtraBold",
        letterSpacing: 1.3
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 10,
        // width: '94%',
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#bbb',
        // width: '94%',
        alignSelf: 'center',
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        fontFamily: "Merriweather_24pt_SemiCondensed-Bold",
        // letterSpacing: 1.2,
        color: "white",
        height: 25,
        textAlignVertical: 'center',
    },
    cell: {
        flex: 1,
        fontSize: 13,
        textAlign: 'center',
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 1.2,
        color: "black",
        height: 40,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#888',
        fontFamily: "Merriweather_24pt_SemiCondensed-Bold",
    },
});

export default ExpenceHistoryForEmp;