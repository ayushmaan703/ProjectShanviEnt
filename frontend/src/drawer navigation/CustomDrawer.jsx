import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { logoutUser } from '../store/slice/Auth.slice';
import { CommonActions } from '@react-navigation/native';
import CustomBtn from '../helper/CustomBtn';
import { useState } from 'react';

const logout = <Icon name="right-from-bracket" size={20} color="#fff" />;

const CustomDrawer = (props) => {

    const [activeButton, setActiveButton] = useState("Home");
    const empName = useSelector((state) => state.auth.userData?.fullName);
    const { navigation } = props;
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.loading);
    const currUser = useSelector((state) => state.auth.userData);

    const handleLogout = async () => {
        const res = await dispatch(logoutUser())
        if (res.type === "logoutUser/fulfilled") {
            navigation.navigate('Home', { screen: 'Login' })
            navigation.dispatch(
                CommonActions.reset(
                    {
                        index: 0,
                        routes: [{ name: 'Home' }],
                    }
                )
            );
            Toast.show({
                type: 'customNotificationSuccess',
                text1: "Logged Out Successfully",
                visibilityTime: 1000
            });
        }
        else {
            Toast.show({
                type: 'customNotificationError',
                text1: "Error Logging Out",
                visibilityTime: 1000
            });
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            {/* header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}> Welcome , </Text>
                    <Text style={styles.name}> {empName} </Text>
                </View>
                {/* <TouchableOpacity
                    activeOpacity={1}
                >
                    <Image
                        style={styles.profileImage}
                        source={image}
                    />
                </TouchableOpacity> */}
            </View>

            {/* drawer options */}
            <DrawerContentScrollView {...props} style={styles.body}>
                <CustomBtn
                    title="Home"
                    icon="house"
                    onPress={() => navigation.navigate("Home", { screen: "Home" })}
                    isActive={activeButton === "Home"}
                    setActive={setActiveButton}
                />
                {currUser?.role === "admin" && <CustomBtn
                    title="Register App Users"
                    icon="user-plus"
                    onPress={() => navigation.navigate("RegisterAppUsers")}
                    isActive={activeButton === "Register App Users"}
                    setActive={setActiveButton}
                />}
                {/*<CustomBtn
                    title="Expenses History"
                    icon="clock"
                    onPress={() => navigation.navigate("Home", { screen: "ExpenceHistoryForEmp" })}
                    isActive={activeButton === "Expenses History"}
                    setActive={setActiveButton}
                />
                <CustomBtn
                    title="Account Ledger"
                    icon="newspaper"
                    onPress={() => navigation.navigate("Home", { screen: "AccountLedgerEmp" })}
                    isActive={activeButton === "Account Ledger"}
                    setActive={setActiveButton}
                />
                <CustomBtn
                    title="Task History"
                    icon="square-check"
                    onPress={() => navigation.navigate("Home", { screen: "TaskHist" })}
                    isActive={activeButton === "Task History"}
                    setActive={setActiveButton}
                />
                <CustomBtn
                    title="New Task"
                    icon="check-to-slot"
                    onPress={() => navigation.navigate("Home", { screen: "dailyReport" })}
                    isActive={activeButton === "New Task"}
                    setActive={setActiveButton}
                /> */}
            </DrawerContentScrollView>

            {/* footer logout  */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.buttonText}>{logout} </Text>
                            <Text style={styles.buttonText}> Logout</Text>

                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: "10%",
        backgroundColor: '#4A90E255',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
        borderTopRightRadius: 15,

    },
    welcome: {
        color: '#000',
        fontSize: 30,
        fontFamily: "Merriweather_24pt_SemiCondensed-Light",
        letterSpacing: 2,
        marginTop: 5
    },
    name: {
        color: '#000',
        fontSize: 20,
        marginLeft: 10,
        fontFamily: "Merriweather_24pt-Light",
        letterSpacing: 2,
        lineHeight: 30,
        marginBottom: 5
    },
    logoutButton: {
        marginVertical: 5,
        width: "50%",
        padding: 15,
        backgroundColor: '#B22222',
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 2,
    },
    body: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
        alignItems: 'center'
    },

});

export default CustomDrawer;
