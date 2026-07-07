import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Animated,
    ImageBackground
} from "react-native";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployeeList } from "../store/slice/Admin.slice";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import image from "../data/PremiumVector.jpg"

const EmployeeList = () => {
    const employees = useSelector((state) => state.admin.list);
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // Function to handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        const data = await dispatch(getAllEmployeeList());
        if (!(data.type === "getAllEmployeeList/fulfilled")) {
            Toast.show({
                type: "customNotificationError",
                text1: "Error Occurred",
                visibilityTime: 1000,
            });
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const filteredEmployees = employees
        .filter((item) =>
            item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.Id.toString().includes(searchQuery)
        )
        .sort((a, b) => b.LoginStatus.localeCompare(a.LoginStatus)); // Online first


    // for animation
    const slideAnim = useRef(new Animated.Value(-300)).current; // Start off-screen (left)
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showSearch) {
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
    }, [showSearch]);

    return (
        <View style={styles.container}>
            {/* Navbar */}

            <View style={styles.navContainer}>
                {/* Left Menu Button */}
                <TouchableOpacity
                    style={[styles.iconButton, styles.leftButton]}
                    onPress={() => navigation?.openDrawer()}>
                    <FontAwesome6 name="bars" size={24} color="white" />
                </TouchableOpacity>

                {/* Navbar Content */}
                <View style={styles.navbar}>
                    <Text style={styles.title}>Employees Login Status</Text>
                </View>

                {/* Right Calendar Button */}
                <TouchableOpacity
                    style={[styles.iconButton, styles.rightButton]}
                    onPress={() => (setShowSearch(!showSearch), setSearchQuery(""))} >
                    <FontAwesome6 name="magnifying-glass" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* 🔍 Search Bar */}
            {
                showSearch && <Animated.View
                    style={[
                        // styles.dateContainer,
                        { transform: [{ translateX: slideAnim }], opacity: fadeAnim },
                    ]}
                    pointerEvents={showSearch ? "auto" : "none"}
                >
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Employee by Name or ID..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </Animated.View>
            }
            {
                employees.length > 0 && (
                    <Text style={styles.lengthContainer}>
                        <Text style={styles.lengthHeading}>Total Employees: </Text>
                        <Text style={styles.lengthText}> {filteredEmployees.length}</Text>
                    </Text>
                )
            }

            <FlatList
                data={filteredEmployees}
                keyExtractor={(item) => item.Id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    // <TouchableOpacity
                    //     onPress={() => navigation.navigate("TaskDetails", { task: item })}
                    // >
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
                                                {item.Name}
                                            </Text>
                                        </View>
                                    }
                                />
                                <Card.Content>
                                    <Text style={styles.cardContentContainer}>
                                        <Text style={styles.cardContentHeading}>Employee Name: </Text>
                                        <Text style={styles.cordContentData}>{item.Name}</Text>
                                    </Text>
                                    <Text style={styles.cardContentContainer}>
                                        <Text style={styles.cardContentHeading}>Employee ID: </Text>
                                        <Text style={styles.cordContentData}>{item.Id}</Text>
                                    </Text>
                                    <Text style={styles.cardContentContainer}>
                                        <Text style={styles.cardContentHeading}>Status: </Text>
                                        <Text
                                            style={[
                                                styles.cordContentData,
                                                item.LoginStatus === "1" ? styles.online : styles.offline,
                                            ]}
                                        >
                                            {item.LoginStatus === "1" ? "Online" : "Offline"}
                                        </Text>
                                    </Text>
                                </Card.Content>
                            </ImageBackground>
                        </Card>
                    // </TouchableOpacity>d
                )}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e2e2e2",
        padding: 16,
    },
    searchInput: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        fontSize: 17,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: "#000",
        marginHorizontal: 10,
        color: "#000",
        marginTop: 10,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 2,
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
        fontSize: 23,
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
        fontSize: 16,
        marginBottom: 5,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.3,
    },
    cordContentData: {
        fontSize: 14,
        color: '#333',
        fontFamily: "Merriweather_24pt-SemiBold",
        letterSpacing: 1.3,
    },
    online: {
        color: "green",
    },
    offline: {
        color: "red",
    },
    lengthContainer: {
        color: "#000",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 10,
        borderWidth: 1.5,
    },
    lengthHeading: {
        fontSize: 20,
        marginBottom: 5,
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.3,
    },
    lengthText: {
        fontWeight: "500",
        fontSize: 20,
        color: "#333",
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
        backgroundColor: "rgba(123, 126, 209, 1)",
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
        fontSize: 16,
        color: "white",
        fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
        letterSpacing: 1,
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
        top: 8,
    },
    rightButton: {
        right: 20,
        top: 8,
    },
});

export default EmployeeList;
