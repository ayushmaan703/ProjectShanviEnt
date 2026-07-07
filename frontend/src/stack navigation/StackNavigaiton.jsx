import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    LoginScreen,
    UserHomeDashboard,
    HomeScreen,
    TaskDetails,
    CompletedTaskDetailsScreen,
    AssignTask,
    ShowLoggedInEmployees,
    EmployeeExpensesDetails,
    EpxencDetailsScreen,
    CompletedTaskDetails,
    EmpTaskHIstDetails,
    SelectEmpTaskHist,
    ExpenceHistoryForEmp,
    ExpHistDetailsScreen
} from "../screens/Screens.js"
import { useSelector } from 'react-redux';
import dailyReport from '../screens/DailyReport.jsx';
import EmployeeWiseLedger from '../admin screens/EmployeeWiseLedger.jsx';
import LedgerReportDetailsScreen from '../admin screens/LedgerReportDetailsScreen.jsx';
import LedgerReportScreen from '../admin screens/LedgerReportScreen.jsx';
import ExpHistDetailsScreenAdmin from '../admin screens/ExpHistDetailsScreenAdmin.jsx';
import accountLedgerDetailsEmp from '../screens/AccountLedgerDetailsEmp.jsx';
import accountLedgerEmp from '../screens/AccountLedgerEmp.jsx';
// import SplashScreen from '../helper/SplashScreen.jsx';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    // const [isSplashVisible, setIsSplashVisible] = useState(true);
    const auth = useSelector((state) => state.auth?.status)
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsSplashVisible(false);
    //     }, 23000);

    //     return () => clearTimeout(timer);
    // }, []);

    // if (isSplashVisible) {
    //     return <SplashScreen />;
    // }

    return (
        <Stack.Navigator
            initialRouteName={auth ? 'Home' : 'Login'}
            screenOptions={{
                headerShown: false,
                // headerStyle: { backgroundColor: '#6200ee' },
                // headerTintColor: '#fff',
                // headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            {auth ?
                <Stack.Screen name="Home" component={HomeScreen} /> :
                <Stack.Screen name="Login" component={LoginScreen} />}
            <Stack.Screen name="UserHomeDashboard" component={UserHomeDashboard} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="CompletedTaskDetails" component={CompletedTaskDetailsScreen} />
            <Stack.Screen name="AssignTask" component={AssignTask} />
            <Stack.Screen name="EmployeeList" component={ShowLoggedInEmployees} />
            <Stack.Screen name="EmployeeExpence" component={EmployeeExpensesDetails} />
            <Stack.Screen name="EmployeeLedger" component={EmployeeWiseLedger} />
            <Stack.Screen name="EmployeeExpenceDetails" component={EpxencDetailsScreen} />
            <Stack.Screen name="EmployeeExpenceDetailsAdmin" component={ExpHistDetailsScreenAdmin} />
            <Stack.Screen name="LedgerReportDetailsScreen" component={LedgerReportDetailsScreen} />
            <Stack.Screen name="AccountLedgerEmp" component={accountLedgerEmp} />
            <Stack.Screen name="AccountLedgerDetailsEmp" component={accountLedgerDetailsEmp} />
            <Stack.Screen name="LedgerReportScreen" component={LedgerReportScreen} />
            <Stack.Screen name="TaskHist" component={CompletedTaskDetails} />
            <Stack.Screen name="EmpTaskHistSelect" component={SelectEmpTaskHist} />
            <Stack.Screen name="EmpTaskHistDetails" component={EmpTaskHIstDetails} />
            <Stack.Screen name="ExpenceHistoryForEmp" component={ExpenceHistoryForEmp} />
            <Stack.Screen name="ExpHistDetailsScreen" component={ExpHistDetailsScreen} />
            <Stack.Screen name="dailyReport" component={dailyReport} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
