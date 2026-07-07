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
import { userLogout } from '../store/slice/Auth.slice';
import { CommonActions } from '@react-navigation/native';
import CustomBtn from '../helper/CustomBtn';
import { useState } from 'react';

const logout = <Icon name="right-from-bracket" size={20} color="#fff" />;

const CustomDrawer = (props) => {

    const [activeButton, setActiveButton] = useState("Home");
    const empName = useSelector((state) => state.auth.userData?.Emp);
    const { navigation } = props;
    const dispatch = useDispatch();
    const EmpId = useSelector((state) => state.auth.userData?.EmpId)
    const isLoading = useSelector(state => state.auth.loading);

    const handleLogout = async () => {
        const res = await dispatch(userLogout({ EmpId }))
        if (res.type === "logout/fulfilled") {
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
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
                <CustomBtn
                    title="Assign Task"
                    icon="square-check"
                    onPress={() => navigation.navigate("Home", { screen: "AssignTask" })}
                    isActive={activeButton === "Assign Task"}
                    setActive={setActiveButton}
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
                <CustomBtn
                    title="Logged In Employee"
                    icon="user"
                    onPress={() => navigation.navigate("Home", { screen: "EmployeeList" })}
                    isActive={activeButton === "Logged In Employee"}
                    setActive={setActiveButton}
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
                <CustomBtn
                    title="Expense History"
                    icon="indian-rupee-sign"
                    onPress={() => navigation.navigate("Home", { screen: "EmployeeExpence" })}
                    isActive={activeButton === "Expense History"}
                    setActive={setActiveButton}
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
                <CustomBtn
                    title="Account Ledger"
                    icon="newspaper"
                    onPress={() => navigation.navigate("Home", { screen: "EmployeeLedger" })}
                    isActive={activeButton === "Ledger Report"}
                    setActive={setActiveButton}
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
                <CustomBtn
                    title="Task History"
                    icon="clock"
                    onPress={() => navigation.navigate("Home", { screen: "EmpTaskHistSelect" })}
                    isActive={activeButton === "Task History"}
                    setActive={setActiveButton}
                    activeColor="rgba(123, 126, 209, 0.52)"
                />
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
        backgroundColor: 'rgba(123, 126, 209, 0.72)',
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
