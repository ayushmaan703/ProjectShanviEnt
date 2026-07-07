import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomNavBar from '../helper/CustomNavBar';
import { formattedDate } from '../helper/formattedDate';

const LedgerReportDetailsScreen = ({ navigation, route }) => {
    const { width } = useWindowDimensions();
    const { data, summaryData } = route.params;

    const employeeName = data[0]?.Employee || data[1]?.Employee || 'Unknown Employee';

    const formatAmount = (value) => {
        if (value === null || value === undefined) return '0.00';
        const num = parseFloat(value);
        return Math.abs(num).toFixed(2);
    };

    const columns = [
        {
            id: 'PaymentType', title: 'Expence', width: width * 0.30
        },
        { id: 'Date', title: 'Date', width: width * 0.22 },
        { id: 'Amount', title: 'Amount', width: width * 0.20 },
        // { id: 'Debit', title: 'DR (-)', width: width * 0.18 },
        { id: 'Balance', title: 'Balance', width: width * 0.20 },
    ];

    const renderItem = ({ item }) => (


        < View style={styles.row} >
            {
                columns.map((column) => {
                    let displayValue = item[column.id];
                    let textStyle = [styles.cellText];

                    // if (["Amount", 'Balance'].includes(column.id)) {
                    //     displayValue = formatAmount(displayValue);
                    // }

                    if (column.id === 'Amount' && parseFloat(item.Debit) > 0) {
                        textStyle.push(styles.debitColor);
                        displayValue = `${item.Debit}`;
                    }

                    if (column.id === 'Amount' && parseFloat(item.Credit) > 0) {
                        textStyle.push(styles.creditColor);
                        displayValue = `${item.Credit}`;

                    }
                    if (
                        column.id === 'Balance' &&
                        item.Balance && item.Balance.trim().startsWith('-')
                    ) {
                        textStyle.push(styles.debitColor);
                        displayValue = `${displayValue.substring(1)}`;

                    }
                    if (column.id === 'Balance' &&
                        item.Balance && !item.Balance.trim().startsWith('-')) {
                        textStyle.push(styles.creditColor);
                    }
                    if (column.id === 'PaymentType' && displayValue.length > 20) {
                        displayValue = `${displayValue.substring(0, 10)}...`;
                    }
                    if (column.id === 'Date') {
                        displayValue = formattedDate(displayValue);
                    }

                    return (
                        <Pressable key={column.id} style={[styles.cell, { width: column.width }]} onPress={() => navigation.navigate('LedgerReportScreen', { data: item })}>
                            <View key={column.id} style={[styles.cell, { width: column.width }]}>
                                <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                                    {displayValue}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })
            }
        </View >

    );

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Account Ledger"} color="rgba(123, 126, 209, 1)" />

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
                <Text style={styles.employeeName}>{employeeName} Ledger Report</Text>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Opening Balance</Text>
                        <Text style={styles.summaryValue}>
                            {formatAmount(summaryData[0].openingBalance)}
                        </Text>
                        {/* <Text style={styles.summaryNote}>(on {summaryData.openingBalance.date})</Text> */}
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Debit(-)</Text>
                        <Text style={[styles.summaryValue, styles.debitColor]}>
                            {formatAmount(summaryData[0].TotDebit)}
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Credit(+)</Text>
                        <Text style={[styles.summaryValue, styles.creditColor]}>
                            {formatAmount(summaryData[0].TotCredit)}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Closing Balance</Text>
                        <Text style={[styles.summaryValue, summaryData[0].ClosingBal.trim().startsWith('-') ? styles.debitColor : styles.creditColor]}>
                            {formatAmount(summaryData[0].ClosingBal)}
                        </Text>
                        {/* <Text style={styles.summaryNote}>({summaryData.netBalance.note})</Text> */}
                    </View>
                </View>
            </View>

            {/* Table Section */}
            <View style={styles.content}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        {/* Table Header */}
                        <View style={styles.headerRow}>
                            {columns.map((column) => (
                                <View key={column.id} style={[styles.headerCell, { width: column.width }]}>
                                    <Text style={styles.headerText}>{column.title}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Table Content */}
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.BillNo}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <FontAwesome6 name="file-invoice" size={60} color="#D1D5DB" />
                                    <Text style={styles.emptyTitle}>No Ledger Report</Text>
                                    <Text style={styles.emptyText}>Try adjusting your filters or date range</Text>
                                </View>
                            }
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingVertical: 20,
    },
    summaryContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(123, 126, 209, 1)',
        marginBottom: 12,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    summaryNote: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        marginTop: 2,
    },
    debitColor: {
        color: '#EF4444',
    },
    creditColor: {
        color: '#44bd5cff',
    },
    content: {
        flex: 1,
        padding: 12,
        alignSelf: "center"
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(123, 126, 209, 1)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 12,
    },
    headerCell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    headerText: {
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        fontFamily: 'Merriweather_24pt-ExtraBold',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    cell: {
        paddingVertical: 10,
        paddingHorizontal: 6,
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
        fontFamily: 'Merriweather_24pt-Bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginTop: 20,
        width: '100%',
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

export default LedgerReportDetailsScreen;