import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import {
    launchCamera,
    launchImageLibrary,
} from "react-native-image-picker";
import {
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import CustomNavBar from "../helper/CustomNavBar";

import { editCustomer } from "../store/slice/Customer.slice";

const Input = ({
    label,
    icon,
    value,
    field,
    handleChange,
    ...props
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputWrapper}>
                <FontAwesome6
                    name={icon}
                    size={18}
                    color="#4A90E2"
                />

                <TextInput
                    style={[
                        styles.input,
                        props.multiline &&
                        styles.multilineInput,
                    ]}
                    value={value}
                    placeholderTextColor="#999"
                    onChangeText={
                        props.onChangeText
                            ? props.onChangeText
                            : text =>
                                handleChange(field, text)
                    }
                    {...props}
                />
            </View>
        </View>
    );
};

const EditCustomer = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    const { customer } = route.params;

    const loading = useSelector(state => state.customer.loading);

    const [showImagePicker, setShowImagePicker] =
        useState(false);

    const [form, setForm] = useState({
        name: customer.name || "",
        contactPerson: customer.contactPerson || "",
        contactNo: customer.contactNo || "",
        connectionDetails: customer.connectionDetails || "",
        image: customer.image ? { uri: customer.image, } : null,
    });

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const requestCameraPermission =
        async () => {
            if (Platform.OS !== "android")
                return true;

            const granted =
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS
                        .CAMERA,
                    {
                        title: "Camera Permission",
                        message:
                            "App needs camera permission to take photos.",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel",
                    }
                );

            return (
                granted ===
                PermissionsAndroid.RESULTS.GRANTED
            );
        };



    const openCamera = async () => {
        const hasPermission =
            await requestCameraPermission();

        if (!hasPermission) {
            Alert.alert(
                "Camera permission denied"
            );
            return;
        }

        const result = await launchCamera({
            mediaType: "photo",
            cameraType: "back",
            quality: 0.8,
            saveToPhotos: false,
        });

        if (
            result.didCancel ||
            !result.assets?.length
        )
            return;

        handleChange("image", result.assets[0]);
    };

    const openGallery = async () => {
        const result =
            await launchImageLibrary({
                mediaType: "photo",
                quality: 0.8,
            });

        if (
            result.didCancel ||
            !result.assets?.length
        )
            return;

        handleChange("image", result.assets[0]);
    };

    const pickImage = () => {
        setShowImagePicker(true);
    };

    const getOptimizedImage = (url, size = 340) => {
        if (!url) return null;
        return url.replace("/upload/", `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`);
    };
    const imageSource = useMemo(
        () => ({
            uri: getOptimizedImage(form?.image?.uri) || "https://via.placeholder.com/250x250.png?text=Customer",
        }),
        [customer?.image]
    );

    const handleSubmit = async () => {
        const data = new FormData();

        data.append("name", form.name);
        data.append("customerId", customer._id);
        data.append("contactPerson", form.contactPerson);
        data.append("contactNo", form.contactNo);
        data.append("connectionDetails", form.connectionDetails);

        // Upload image only if user selected a new one
        if (form.image?.type) {
            data.append("image", {
                uri: form.image.uri,
                type: form.image.type,
                name:
                    form.image.fileName ||
                    `customer_${Date.now()}.jpg`,
            });
        }

        const res = await dispatch(editCustomer(data));

        if (res.type === "editCustomer/fulfilled") {
            Toast.show({
                type: "customNotificationSuccess",
                text1:
                    "Customer updated successfully.",
            });

            navigation.goBack();
        }
    }
    return (
        <View style={styles.container}>

            <CustomNavBar title="Edit Customer" />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.content}
                enableOnAndroid
                extraScrollHeight={30}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={pickImage}
                >
                    {form.image ? (
                        <>
                            {/* <Image
                                source={{ uri: form.image.uri }}
                                style={styles.image}
                            /> */}
                            <Image
                                source={imageSource}
                                style={styles.image}
                                resizeMode="cover"
                                fadeDuration={0}
                            />
                            <View style={styles.editBadge}>
                                <FontAwesome6
                                    name="pen"
                                    color="#fff"
                                    size={12}
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <FontAwesome6
                                name="camera"
                                size={36}
                                color="#4A90E2"
                            />
                            <Text style={styles.imageText}>
                                Tap to Upload
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <Input
                    label="Customer Name"
                    icon="user"
                    value={form.name}
                    field="name"
                    handleChange={handleChange}
                    placeholder="Enter customer name"
                />

                <Input
                    label="Contact Person"
                    icon="user-tie"
                    value={form.contactPerson}
                    field="contactPerson"
                    handleChange={handleChange}
                    placeholder="Enter contact person"
                />

                <Input
                    label="Contact Number"
                    icon="phone"
                    value={form.contactNo}
                    field="contactNo"
                    handleChange={handleChange}
                    keyboardType="number-pad"
                    maxLength={10}
                    placeholder="Enter contact number"
                    onChangeText={text =>
                        handleChange(
                            "contactNo",
                            text.replace(/[^0-9]/g, "")
                        )
                    }
                />

                <Input
                    label="Connection Details"
                    icon="file-lines"
                    value={form.connectionDetails}
                    field="connectionDetails"
                    handleChange={handleChange}
                    placeholder="Enter connection details"
                    multiline
                    numberOfLines={5}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && {
                            opacity: 0.8,
                        },
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator
                            color="#fff"
                            size="small"
                        />
                    ) : (
                        <FontAwesome6
                            name="pen"
                            color="#fff"
                            size={18}
                        />
                    )}

                    <Text style={styles.buttonText}>
                        {loading
                            ? "Updating Customer..."
                            : "Update Customer"}
                    </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

            <Modal
                isVisible={showImagePicker}
                onBackdropPress={() =>
                    setShowImagePicker(false)
                }
                onBackButtonPress={() =>
                    setShowImagePicker(false)
                }
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.45}
                style={styles.modal}
            >
                <View style={styles.modalContent}>

                    <View style={styles.dragIndicator} />

                    <Text style={styles.modalTitle}>
                        Select Customer Image
                    </Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                            setShowImagePicker(false);
                            openCamera();
                        }}
                    >
                        <FontAwesome6
                            name="camera"
                            size={20}
                            color="#4A90E2"
                        />
                        <Text style={styles.optionText}>
                            Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                            setShowImagePicker(false);
                            openGallery();
                        }}
                    >
                        <FontAwesome6
                            name="image"
                            size={20}
                            color="#4A90E2"
                        />
                        <Text style={styles.optionText}>
                            Gallery
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.option,
                            {
                                justifyContent:
                                    "center",
                            },
                        ]}
                        onPress={() =>
                            setShowImagePicker(false)
                        }
                    >
                        <Text
                            style={{
                                color: "#ff3b30",
                                fontWeight: "600",
                            }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>

        </View>
    );
}
export default EditCustomer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
        marginTop: 20,
    },
    navContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 12,
    },
    navbar: {
        width: "95%",
        height: 65,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(74,144,226,0.88)",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
    },
    title: {
        color: "#fff",
        fontSize: 21,
        letterSpacing: 2,
        fontFamily:
            "Merriweather_24pt_SemiCondensed-SemiBold",
    },
    iconButton: {
        position: "absolute",
        zIndex: 20,
        backgroundColor: "rgba(255,255,255,0.3)",
        padding: 12,
        borderRadius: 30,
        elevation: 15,
    },
    leftButton: {
        left: 20,
        top: 6,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: 55,
        width: 42, height: 42, borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,.2)"
    },
    header: { fontSize: 22, fontWeight: "700", color: "#fff" },
    content: { padding: 20, paddingBottom: 40 },
    imageWrapper: {
        width: 170, height: 170, borderRadius: 85,
        backgroundColor: "#fff",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        overflow: "hidden",
        marginBottom: 25
    },
    image: { width: "100%", height: "100%" },
    imageText: { marginTop: 10, fontWeight: "600", color: "#4A90E2" },
    editBadge: {
        position: "absolute",
        bottom: 10, right: 10,
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: { marginBottom: 18 },
    label: { marginBottom: 8, fontWeight: "600", color: "#333" },
    inputWrapper: {
        backgroundColor: "#fff",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        elevation: 3
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        height: 56,
        color: "#222"
    },
    multilineInput: {
        height: 120,
        textAlignVertical: "top",
        paddingTop: 15
    },
    button: {
        marginTop: 15,
        backgroundColor: "#4A90E2",
        height: 58,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5
    },
    buttonText: {
        color: "#fff",
        marginLeft: 10,
        fontSize: 17,
        fontWeight: "700"
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },

    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
    },

    dragIndicator: {
        width: 50,
        height: 5,
        backgroundColor: "#ddd",
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginBottom: 20,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
    },

    optionText: {
        marginLeft: 18,
        fontSize: 17,
        color: "#333",
    },
}); 