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
import { deleteCustomer, togglePaidStatus } from "../store/slice/Customer.slice";
import { useNavigation } from "@react-navigation/native";
// import Clipboard from '@react-native-clipboard/clipboard';


const CustomerDetails = ({ route }) => {
    const navigation = useNavigation()
    const { customer } = route.params;
    const dispatch = useDispatch();
    const [createdByUser, setCreatedByUser] = useState(null);
    const [verified, setVerified] = useState(customer.verified);
    const [isPaid, setIsPaid] = useState(customer.isPaid);
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
                <Text style={styles.value} selectable>
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

        if (res.type === "deleteCustomer/fulfilled") {
            Toast.show({
                type: "customNotificationSuccess",
                text1: "Customer deleted successfully.",
                visibilityTime: 1000,
            })
            navigation.goBack()
        }
    }

    const handleMarkAsPaid = async (id) => {
        const res = await dispatch(togglePaidStatus(id));

        if (res.type === "togglePaidStatus/fulfilled") {
            Toast.show({
                type: "customNotificationSuccess",
                text1: "Commission paid.",
                visibilityTime: 1000,
            })
            setIsPaid(true)
        }
    };

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
                    icon="user"
                    title="Customer Name"
                    value={customer?.name}
                />

                <DetailRow
                    icon="user-tie"
                    title="Contact Person"
                    value={customer?.contactPerson}
                />

                <DetailRow
                    icon="phone"
                    title="Contact Number"
                    value={customer?.contactNo}
                />

                <DetailRow
                    icon="file-lines"
                    title="Connection Details"
                    value={customer?.connectionDetails}
                />

                <DetailRow
                    icon="user-check"
                    title="Created By"
                    value={createdByUser}
                />
                <DetailRow
                    icon="money-bill"
                    title="Commission Status"
                    value={isPaid ? "Paid" : "Un-Paid"}
                />
            </View>

            {(!isPaid &&currUser?.role === "admin")&& <View style={styles.cardBottom}>
                <View style={styles.paymentRow}>
                    <View style={styles.statusContainerBottom}>
                        <View style={styles.statusDot} />
                        <View>
                            <Text style={styles.statusTitle}>Payment Pending</Text>
                            <Text style={styles.statusSubtitle}>
                                Commission not paid.
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => handleMarkAsPaid(customer._id)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome6
                            name="check"
                            size={16}
                            color="#fff"
                            solid
                        />
                        <Text style={styles.payButtonText}>Pay</Text>
                    </TouchableOpacity>
                </View>
            </View>}

            <View style={styles.bottomBtn}>
                {(currUser?.role === "admin" && verified !== true) && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerifyCustomer}
                    >
                        <FontAwesome6
                            name="check"
                            size={18}
                            color="#fff"
                        />

                        <Text style={styles.buttonText}>
                            Verify
                        </Text>
                    </TouchableOpacity>)}
                
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("EditCustomer", { customer })}
                    >
                        <FontAwesome6
                            name="pen"
                            size={18}
                            color="#fff"
                        />

                        <Text style={styles.buttonText}>
                            Edit
                        </Text>
                    </TouchableOpacity>
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
                            Delete
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
    editButton: {
        flex: 1,
        height: 50,
        backgroundColor: "rgba(74, 144, 226, 0.85)",
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
        marginLeft: 2,
    },
    cardBottom: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginVertical: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        marginHorizontal: 18
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    statusContainerBottom: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#EF4444",
        marginRight: 12,
    },

    statusTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    statusSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    payButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#22C55E",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },

    payButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
        marginLeft: 8,
    },
});