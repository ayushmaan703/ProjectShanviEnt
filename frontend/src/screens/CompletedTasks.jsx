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
import { getAllTask } from '../store/slice/Task.slice';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Card } from 'react-native-paper';
import { RefreshControl } from 'react-native-gesture-handler';
import CustomNavBar from '../helper/CustomNavBar';
import Toast from 'react-native-toast-message';
import image from "../data/PremiumVector.jpg"
import { formattedDate } from '../helper/formattedDate';

const CompletedTaskDetails = () => {

    const [fromDate, setFromDate] = useState(new Date());
    const [showFrom, setFromShow] = useState(false);
    const [toDate, setToDate] = useState(new Date());
    const [showTo, setToShow] = useState(false);
    const navigation = useNavigation();
    const [tasks, setTasks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const empDetails = useSelector((state) => state.auth.userData);


    const onRefresh = async () => {
        let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
        let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
        let empId = empDetails.EmpId;
        setRefreshing(true);
        const data = await dispatch(getAllTask({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate, TaskType: 1 }));
        if (data.type === "tasks/fulfilled") setTasks(data.payload);
        else {
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Occurred",
                visibilityTime: 1000
            });
            setTasks([])
        };
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
            let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
            let empId = empDetails.EmpId;
            const data = await dispatch(getAllTask({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate, TaskType: 1 }));
            if (data.type === "tasks/fulfilled") setTasks(data.payload);
            else {
                Toast.show({
                    type: 'customNotificationError',
                    text1: "error Occurred",
                    visibilityTime: 1000
                });
                setTasks([])
            };
        };
        fetchData();
    }, [dispatch, fromDate, toDate]);

    const renderTask = ({ item }) => (
        <Pressable onPress={() => navigation.navigate("CompletedTaskDetails", { task: item })}>
            <Card style={styles.card}>
                <ImageBackground
                    source={image}
                    style={styles.background}
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 15, opacity: 0.785 }}
                >
                    <Card.Title
                        titleStyle={styles.cardTitleBox}
                        title={
                            <View>
                                <Text style={styles.cardTitleHeading}>
                                    {item.Task}
                                </Text>
                            </View>
                        }
                    />
                    <Card.Content>
                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Assigned To :  </Text>
                            <Text style={styles.cordContentData}>{item.AssignTo}</Text>
                        </Text>
                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Description : </Text>
                            <Text style={styles.cordContentData}> {item.Description.length > 40 ? item.Description.substring(0, 30) + "..." : item.Description}</Text>
                        </Text>
                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Assigned On : </Text>
                            <Text style={styles.cordContentData}> {formattedDate(item.TaskDate)}</Text>
                        </Text>
                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Done Date : </Text>
                            <Text style={styles.cordContentData}> {formattedDate(item.DoneDate)}</Text>
                        </Text>
                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Done Remark : </Text>
                            <Text style={styles.cordContentData}> {item.DoneRemark.length > 40 ? item.DoneRemark.substring(0, 30) + "..." : item.DoneRemark}</Text>
                        </Text>
                    </Card.Content>
                </ImageBackground>
            </Card>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <CustomNavBar title={"Completed Tasks"} color='#28A745' />

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
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={tasks}
                keyExtractor={item => item.TaskId}
                renderItem={renderTask}
                ListEmptyComponent={<Text style={styles.noTaskText}>No tasks completed..</Text>}
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
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "rgba(40, 167, 70, 0.66)",
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
    noTaskText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    card: {
        borderWidth: 1.5,
        backgroundColor: "#fff",
        marginTop: 10,
        marginHorizontal: 10,
    },
    cardTitleBox: {
        color: "#000",
        marginRight: 10,
    },
    cardTitleHeading: {
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: "#000",
        paddingBottom: 2,
        alignSelf: "flex-start",
    },
    cardContentContainer: {
        marginVertical: 2,
        paddingHorizontal: 5,
    },
    cardContentHeading: {
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.3,
        fontSize: 12,
        marginBottom: 5,
    },
    cordContentData: {
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1.3,
        fontSize: 11,
        color: '#333',
    },
});

export default CompletedTaskDetails;
