import React, { useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { userLogin } from '../store/slice/Auth.slice.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import logo from "../data/logo-CCalxPd4.jpg";
import messaging from '@react-native-firebase/messaging';

const LoginScreen = () => {
    const isLoading = useSelector(state => state.auth.loading);

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('Notification permission granted');
                    getFcmToken();
                }
                else {
                    // console.log('Notification permission denied');
                    getFcmToken();
                }

            } catch (err) {
                console.warn(err);
            }
        }

    };

    const getFcmToken = async () => {
        try {
            const token = await messaging().getToken();
            if (token) {
                // console.log('FCM Token:', token);
            } else {
                // console.log('Failed to get FCM token');
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);
        }
    };

    const dispatch = useDispatch();

    const handleLogin = async (values, { resetForm }) => {
        const { mobileNo, password } = values;

        const result = await dispatch(userLogin({ mobileNo, password }));
        if (result.type === "userLogin/fulfilled") {
            Toast.show({
                type: 'customNotificationSuccess',
                text1: "Login Successful",
                visibilityTime: 1000
            });
            resetForm();
        }

    };

    const loginSchema = Yup.object().shape({
        mobileNo: Yup.string()
            .min(10, "Quiet Small for A Mobile Number")
            .matches(/^\d+$/, "Invalid Mobile Number")
            .required('Mobile Number is required'),
        password: Yup.string().required('Password is required'),
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled" >

                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                </View>

                {/* Login Box */}

                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Welcome </Text>
                    <Text style={styles.subtitle}>Login to continue</Text>

                    <Formik
                        initialValues={{ mobileNo: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                <TextInput
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#666"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={handleChange('mobileNo')}
                                    onBlur={handleBlur('mobileNo')}
                                    value={values.mobileNo}
                                />
                                {touched.mobileNo && errors.mobileNo && (
                                    <Text style={styles.error}>{errors.mobileNo}</Text>
                                )}

                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#666"
                                    style={styles.input}
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}

                                {/* Social Login Buttons */}
                                {/* <View style={styles.socialContainer}>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Text style={styles.iconText}>t</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Icon name="google" size={20} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Icon name="facebook" size={20} color="black" />
                                    </TouchableOpacity>
                                </View> */}

                                {/* Submit Button */}
                                {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Let's go →</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity
                                    style={[styles.button, isLoading && styles.disabledButton]}
                                    onPress={() => {
                                        Keyboard.dismiss(); // Dismiss keyboard first
                                        handleSubmit(); // Then submit form
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#000000" />
                                    ) : (
                                        <Text style={styles.buttonText}>Let's go →</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </View>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        borderColor: "black",
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    loginContainer: {
        width: 320,
        backgroundColor: "rgba(181, 181, 190, 0.13)",
        padding: 20,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "black",
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        textAlign: "center",
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 3,
        borderBottomColor: "#000",
        borderBottomWidth: 1
    },
    subtitle: {
        fontSize: 18,
        color: "#323232",
        textAlign: "center",
        marginBottom: 15,
        fontFamily: "Merriweather_24pt-Regular",
        letterSpacing: 1,
    },
    input: {
        width: 250,
        height: 50,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "rgb(254, 252, 238)",
        paddingHorizontal: 10,
        fontSize: 15,
        color: "#323232",
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        marginBottom: 10,
        fontFamily: "Merriweather_24pt-ExtraBold",
        letterSpacing: 1.3,
    },
    socialContainer: {
        flexDirection: "row",
        gap: 20,
        marginTop: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "#FDF8DC",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    iconText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",

    },
    button: {
        marginTop: 10,
        width: 120,
        height: 50,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "rgb(254, 252, 238)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,

    },
    buttonText: {
        fontSize: 17,
        color: "#323232",
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1,
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 5,
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 0.5,
    },
    disabledButton: {
        opacity: 0.7,
    },
});

export default LoginScreen;
