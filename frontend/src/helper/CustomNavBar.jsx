import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native';

const CustomNavBar = ({ title, color = "rgba(74, 144, 226, 0.85)" }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.navContainer}>
            <TouchableOpacity
                style={[styles.iconButton, styles.leftButton]}
                onPress={() => navigation?.openDrawer()}>
                <FontAwesome6 name="bars" size={24} color="white" />
            </TouchableOpacity>

            <View style={[styles.navbar, { backgroundColor: color, }]}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    navContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 20,
    },
    navbar: {
        width: "96%",
        height: 65,
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
        fontSize: 22,
        fontFamily: "Merriweather_24pt_SemiCondensed-Bold",
        letterSpacing: 2,
        color: "white",
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
})
export default CustomNavBar