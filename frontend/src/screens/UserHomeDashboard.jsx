import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Animated,
    ImageBackground
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllTask } from '../store/slice/Task.slice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Card } from 'react-native-paper';
import { RefreshControl } from 'react-native-gesture-handler';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Toast from 'react-native-toast-message';
import image from "../data/PremiumVector.jpg"
import { formattedDate } from '../helper/formattedDate';

const UserHomeDashboard = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [showFrom, setFromShow] = useState(false);
    const [toDate, setToDate] = useState(new Date());
    const [showTo, setToShow] = useState(false);
    const navigation = useNavigation();
    const [tasks, setTasks] = useState([]);
    const [showDate, setShowDate] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const empDetails = useSelector((state) => state.auth.userData);
    const drawerNavigation = navigation.getParent();
    const isFocused = useIsFocused();

    const onRefresh = async () => {
        let formattedFromDate = moment(fromDate).format('DD-MMM-YYYY');
        let formattedToDate = moment(toDate).format('DD-MMM-YYYY');
        let empId = empDetails.EmpId;
        setRefreshing(true);
        const data = await dispatch(getAllTask({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate }));
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
            const data = await dispatch(getAllTask({ EmpId: empId, FromDate: formattedFromDate, ToDate: formattedToDate }));
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

    useEffect(() => {
        if (isFocused) {
            onRefresh()
        }
    }, [isFocused]);
    const renderTask = ({ item }) => (

        <Pressable onPress={() => navigation.navigate("TaskDetails", { task: item })}>

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
                            <Text style={styles.cardContentHeading}>Assigned To  :   </Text>
                            <Text style={styles.cordContentData}>{item.AssignTo}</Text>
                        </Text>

                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Assigned On :   </Text>
                            <Text style={styles.cordContentData}> {formattedDate(item?.TaskDate)}</Text>
                        </Text>

                        <Text style={styles.cardContentContainer}>
                            <Text style={styles.cardContentHeading}>Description  :     </Text>
                            <Text style={styles.cordContentData}>
                                {item?.Description?.length > 30 ? item.Description.substring(0, 25) + "..." : item.Description}
                            </Text>
                        </Text>
                    </Card.Content>
                </ImageBackground>
            </Card >

        </Pressable >
    );

    // for animation
    const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen (left)
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showDate) {
            // Slide in from left + Fade in
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0, // Move into view (center)
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Slide out to right + Fade out
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300, // Move out of view (right)
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showDate]);

    return (

        <View style={styles.container}>

            {/* navbar */}
            <View style={styles.navContainer}>

                {/* Left Menu Button */}
                <TouchableOpacity
                    style={[styles.iconButton, styles.leftButton]}
                    onPress={() => drawerNavigation?.openDrawer()}>
                    <FontAwesome6 name="bars" size={24} color="white" />
                </TouchableOpacity>

                {/* Navbar Content */}
                <View style={styles.navbar}>
                    <Text style={styles.title}>SE WorkFlow</Text>
                </View>

                {/* Right Calendar Button */}
                <TouchableOpacity
                    style={[styles.iconButton, styles.rightButton]}
                    onPress={() => setShowDate(!showDate)}>
                    <FontAwesome6 name="calendar" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* date container */}
            {showDate && <Animated.View
                style={[
                    styles.dateContainer,
                    { transform: [{ translateX: slideAnim }], opacity: fadeAnim },
                ]}
                pointerEvents={showDate ? "auto" : "none"}
            >
                <Pressable onPress={() => setFromShow(true)} style={styles.dateButton}>
                    <Text style={styles.boldText}>From:</Text>
                    <Text>{moment(fromDate).format("DD/MM/YYYY")}</Text>
                </Pressable>
                <Pressable onPress={() => setToShow(true)} style={styles.dateButton}>
                    <Text style={styles.boldText}>To:</Text>
                    <Text>{moment(toDate).format("DD/MM/YYYY")}</Text>
                </Pressable>

                {showFrom && (
                    <DateTimePicker
                        value={fromDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setFromShow(false);
                            setFromDate(date || fromDate);
                        }}
                    />
                )}
                {showTo && (
                    <DateTimePicker
                        value={toDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setToShow(false);
                            setToDate(date || toDate);
                        }}
                    />
                )}
            </Animated.View>}

            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={tasks}
                keyExtractor={item => item.TaskId}
                renderItem={renderTask}
                ListEmptyComponent={<Text style={styles.noTaskText}>No Tasks Assigned Today.</Text>}
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
    navContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 5
    },
    navbar: {
        width: "96%",
        height: 65,
        backgroundColor: "rgba(74, 144, 226, 0.85)",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 30,
    },
    title: {
        fontSize: 20,
        color: "white",
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 3,
    },
    iconButton: {
        position: "absolute",
        zIndex: 20,
        backgroundColor: "rgba(255,255,255,0.3)",
        padding: 12,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 20,
    },
    leftButton: {
        left: 20,
        top: 6,
    },
    rightButton: {
        right: 20,
        top: 6,
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
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: "#000",
        paddingBottom: 2,
        alignSelf: "flex-start",
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
    },
    cardContentContainer: {
        marginVertical: 2,
        paddingHorizontal: 5,
    },
    cardContentHeading: {
        fontSize: 15,
        marginBottom: 5,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.3,
    },
    cordContentData: {
        fontSize: 12,
        color: '#333',
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1.3,
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
        fontSize: 17,
        color: '#666',
        fontFamily: "Merriweather_24pt_SemiCondensed-Regular",
        letterSpacing: 2,

    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default UserHomeDashboard;
