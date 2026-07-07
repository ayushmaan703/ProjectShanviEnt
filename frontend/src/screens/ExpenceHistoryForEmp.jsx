import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, RefreshControl } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomNavBar from '../helper/CustomNavBar';
import { seeEmployeeExpences } from '../store/slice/Admin.slice';
import { useDispatch, useSelector } from 'react-redux';
import { formattedDate } from '../helper/formattedDate';

const ExpenseHistoryScreen = ({ navigation }) => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFrom, setFromShow] = useState(false);
    const [showTo, setToShow] = useState(false);
    const [PayType, setPayType] = useState(3); // 3: Approved, 5: Not Approved
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const empDetails = useSelector((state) => state.auth.userData);
    const [tasks, setTasks] = useState([]);

    const onRefresh = async () => {
        let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
        let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
        let empId = empDetails.EmpId;
        setRefreshing(true);
        const responce = await dispatch(seeEmployeeExpences({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate, Paytype: PayType }));
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
            const responce = await dispatch(seeEmployeeExpences({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate, Paytype: PayType }));
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
    }, [dispatch, fromDate, toDate, setPayType, PayType]);

    const renderTask = ({ item }) => (
        PayType === 3 ?
            <Pressable
                style={[styles.row, styles.approvedRow]}
                onPress={() => navigation.navigate('ExpHistDetailsScreen', { data: item, status: "Approved" })}
            >
                <Text style={[styles.cell, styles.expenseCell]}>{item.Expence}</Text>
                {/* <Text style={[styles.cell, styles.amountCell]}>{item.id}</Text> */}
                <Text style={[styles.cell, styles.amountCell]}>{item.BillAmount}</Text>
                <Text style={[styles.cell, styles.dateCell]}>{formattedDate(item.Date)}</Text>
                <Text style={[styles.cell, styles.remarkCell]}>
                    {item.Remark.length > 20 ? item.Remark.substring(0, 17) + '...' : item.Remark}
                </Text>
                {/* <View style={styles.statusCell}> */}
                {/* <FontAwesome6 name="thumbs-up" size={18} color="#10B981" solid /> */}
                {/* <Text style={styles.statusText}>Approved</Text> */}
                {/* </View> */}
            </Pressable> :
            <Pressable
                style={[styles.row, styles.pendingRow]}
                onPress={() => navigation.navigate('ExpHistDetailsScreen', { data: item, status: "Not Approved" })}
            >
                <Text style={[styles.cell, styles.expenseCell]}>{item.Expence}</Text>
                {/* <Text style={[styles.cell, styles.amountCell]}>{item.id}</Text> */}
                <Text style={[styles.cell, styles.amountCell]}>{item.BillAmount}</Text>
                <Text style={[styles.cell, styles.dateCell]}>{formattedDate(item.Date)}</Text>
                <Text style={[styles.cell, styles.remarkCell]}>
                    {item.Remark.length > 20 ? item.Remark.substring(0, 17) + '...' : item.Remark}
                </Text>
                {/* <View style={styles.statusCell}> */}
                {/* <FontAwesome6 name="thumbs-down" size={18} color="#EF4444" solid /> */}
                {/* <Text style={styles.statusText}>Pending</Text> */}
                {/* </View> */}
            </Pressable>

    );

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Expense History"} />

            <View style={styles.content}>
                <View style={styles.dateContainer}>
                    <Pressable
                        onPress={() => setFromShow(true)}
                        style={styles.dateButton}
                    >
                        <Text style={styles.dateLabel}>From:</Text>
                        <View style={styles.dateValueContainer}>
                            <Text style={styles.dateValue}>{moment(fromDate).format('DD MMM, YYYY')}</Text>
                            <FontAwesome6 name="calendar-days" size={18} color="rgba(74, 144, 226, 0.85)" />
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => setToShow(true)}
                        style={styles.dateButton}
                    >
                        <Text style={styles.dateLabel}>To:</Text>
                        <View style={styles.dateValueContainer}>
                            <Text style={styles.dateValue}>{moment(toDate).format('DD MMM, YYYY')}</Text>
                            <FontAwesome6 name="calendar-days" size={18} color="rgba(74, 144, 226, 0.85)" />
                        </View>
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

                <View style={styles.filterContainer}>
                    <Pressable
                        onPress={() => setPayType(3)}
                        style={[
                            styles.filterButton,
                            PayType === 3 && styles.activeFilter,
                            styles.approvedFilter
                        ]}
                    >
                        <FontAwesome6
                            name="thumbs-up"
                            size={16}
                            color={PayType === 3 ? "#FFFFFF" : "#10B981"}
                            solid
                        />
                        <Text style={[
                            styles.filterText,
                            PayType === 3 && styles.activeFilterText
                        ]}>
                            Approved
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setPayType(5)}
                        style={[
                            styles.filterButton,
                            PayType === 5 && styles.activeFilter,
                            styles.pendingFilter
                        ]}
                    >
                        <FontAwesome6
                            name="thumbs-down"
                            size={16}
                            color={PayType === 5 ? "#FFFFFF" : "#EF4444"}
                            solid
                        />
                        <Text style={[
                            styles.filterText,
                            PayType === 5 && styles.activeFilterText
                        ]}>
                            Not Approved
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.tableHeader}>
                    {/* <Text style={styles.headerCell}>Empolyee</Text> */}
                    {/* <Text style={styles.headerCell}>Empid</Text> */}
                    <Text style={styles.headerCell}>Expense</Text>
                    {/* <Text style={styles.headerCell}>id</Text> */}
                    <Text style={styles.headerCell}>Amount</Text>
                    <Text style={styles.headerCell}>Date</Text>
                    <Text style={styles.headerCell}>Remark</Text>
                    {/* <Text style={styles.headerCell}>Status</Text> */}
                </View>

                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTask}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4F46E5']}
                            tintColor="#4F46E5"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <FontAwesome6 name="file-invoice" size={60} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No Expense History</Text>
                            <Text style={styles.emptyText}>Try adjusting your filters or date range</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingVertical: 20
    },
    content: {
        flex: 1,
        padding: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flex: 1,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dateLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    dateValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    activeFilter: {
        backgroundColor: 'rgba(74, 144, 226, 0.85)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    approvedFilter: {},
    pendingFilter: {},
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginLeft: 8,
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'rgba(74, 144, 226, 0.85)',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    headerCell: {
        flex: 1,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    approvedRow: {
        backgroundColor: '#F0FDF4',
    },
    pendingRow: {
        backgroundColor: '#FEF2F2',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#374151',
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 0.2
    },
    expenseCell: {
        fontWeight: '500',
    },
    amountCell: {
        fontWeight: '600',
        color: '#111827',
    },
    dateCell: {
        color: '#4B5563',
    },
    statusCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '500',
    },
    remarkCell: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginTop: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 300,
    },
});

export default ExpenseHistoryScreen;