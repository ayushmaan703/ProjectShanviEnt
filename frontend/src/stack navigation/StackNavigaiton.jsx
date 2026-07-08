import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    LoginScreen,
    UserHomeDashboard,
    HomeScreen,
} from "../screens/Screens.js"
import { useSelector } from 'react-redux';
import CreateCustomer from '../screens/CreateCustomer.jsx';
import CustomerDetails from '../screens/CustomerDetails.jsx';

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
            <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
            <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
