import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import CustomNavBar from "../helper/CustomNavBar";
import { getUInfo } from "../store/slice/Auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { verifyCustomers } from "../store/slice/Admin.slice";
import Toast from "react-native-toast-message";
import { deleteCustomer } from "../store/slice/Customer.slice";
import { useNavigation } from "@react-navigation/native";

const CustomerDetails = ({ route }) => {
    const navigation = useNavigation()
    const { customer } = route.params;
    const dispatch = useDispatch();
    const [createdByUser, setCreatedByUser] = useState(null);
    const [verified, setVerified] = useState(customer.verified);
    const currUser = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await dispatch(getUInfo(customer?.createdBy));
                if (res.type === "getUInfo/fulfilled") {
                    setCreatedByUser(res.payload.fullName);
                }

            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, [customer]);

    const DetailRow = ({ icon, title, value }) => (
        <View style={styles.detailCard}>
            <View style={styles.iconContainer}>
                <FontAwesome6 name={icon} size={18} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{title}</Text>
                <Text style={styles.value}>
                    {value || "Not Available"}
                </Text>
            </View>
        </View>
    );
    const handleVerifyCustomer = async () => {
        const res = await dispatch(verifyCustomers({ customerId: customer?._id }));
        if (res.type === "verifyCustomers/fulfilled") {
            Toast.show({
                type: "customNotificationSuccess",
                text1: "Customer verified successfully.",
                visibilityTime: 1000,
            })
            setVerified(true);
        }
    }
    const handledeleteCustomer = async () => {
        const res = await dispatch(deleteCustomer({ customerId: customer?._id }));
        console.log(res);
        if (res.type === "deleteCustomer/fulfilled") {
            Toast.show({
                type: "customNotificationSuccess",
                text1: "Customer deleted successfully.",
                visibilityTime: 1000,
            })
            navigation.goBack()
        }
    }
    return (
        <ScrollView style={styles.container}>
            <CustomNavBar title={"Customer Details"} />
            {/* Image */}

            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri:
                            customer?.image ||
                            "https://via.placeholder.com/250x250.png?text=Customer",
                    }}
                    style={styles.image}
                />
            </View>

            {/* Name */}

            <Text style={styles.customerName}>
                {customer?.name}
            </Text>

            {/* Verified */}

            <View
                style={[
                    styles.statusContainer,
                    {
                        backgroundColor: verified
                            ? "#DCFCE7"
                            : "#FEE2E2",
                    },
                ]}
            >
                <FontAwesome6
                    name={verified ? "circle-check" : "circle-xmark"}
                    size={16}
                    color={verified ? "#16A34A" : "#DC2626"}
                />

                <Text
                    style={[
                        styles.statusText,
                        {
                            color: verified
                                ? "#16A34A"
                                : "#DC2626",
                        },
                    ]}
                >
                    {verified ? "Verified" : "Not Verified"}
                </Text>
            </View>

            {/* Details */}

            <View style={styles.card}>

                <DetailRow
                    icon="building"
                    title="Customer Name"
                    value={customer?.name}
                />

                <DetailRow
                    icon="user"
                    title="Contact Person"
                    value={customer?.contactPerson}
                />

                <DetailRow
                    icon="phone"
                    title="Contact Number"
                    value={customer?.contactNo}
                />

                <DetailRow
                    icon="wifi"
                    title="Connection Details"
                    value={customer?.connectionDetails}
                />

                <DetailRow
                    icon="user-check"
                    title="Created By"
                    value={createdByUser}
                />
            </View>

            {/* Edit Button */}
            <View style={styles.bottomBtn}>
                {(currUser?.role === "admin" && verified !== true) && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerifyCustomer}
                    >
                        <FontAwesome6
                            name="pen"
                            size={18}
                            color="#fff"
                        />

                        <Text style={styles.buttonText}>
                            Verify Customer
                        </Text>
                    </TouchableOpacity>)}
                {(currUser?.role === "admin") && (
                    <TouchableOpacity
                        style={styles.delButton}
                        onPress={handledeleteCustomer}
                    >
                        <FontAwesome6
                            name="trash"
                            size={18}
                            color="#fff"
                        />

                        <Text style={styles.buttonText}>
                            Delete Customer
                        </Text>
                    </TouchableOpacity>)}
            </View>
            <View style={{ height: 40 }} />

        </ScrollView>
    );
};

export default CustomerDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        marginTop: 20,
    },

    imageContainer: {
        alignItems: "center",
        marginTop: 25,
    },

    image: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 4,
        borderColor: "#fff",
    },

    customerName: {
        fontSize: 25,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 15,
        color: "#111827",
    },

    statusContainer: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
    },

    statusText: {
        marginLeft: 8,
        fontWeight: "600",
        fontSize: 15,
    },

    card: {
        marginHorizontal: 18,
        marginTop: 25,
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 10,
        elevation: 2,
    },

    detailCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    label: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 3,
    },

    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    bottomBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        gap: 12,
        marginHorizontal: 20
    },

    button: {
        flex: 1,
        height: 50,
        backgroundColor: "#22C55E",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    delButton: {
        flex: 1,
        height: 50,
        backgroundColor: "#EF4444",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        marginLeft: 10,
    },
});