import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"; // Import FontAwesome6

const CustomBtn = ({ onPress, title, icon, isActive, setActive, activeColor = "#4A90E2AA" }) => {
  return (
    <TouchableOpacity
      style={[
        styles.customButton,
        isActive && { backgroundColor: activeColor, width: "110%" } // Apply dynamic active color
      ]}
      onPress={() => {
        setActive(title);
        onPress && onPress();
      }}
      activeOpacity={1}
    >
      <View style={styles.buttonContent}>
        {/* Icon with fixed width to ensure uniform alignment */}
        <FontAwesome6 name={icon} size={20} color={isActive ? "#fff" : "#4A90E2"} style={styles.icon} />
        <Text style={[styles.buttonText, isActive && styles.activeText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row",
    alignItems: "center", // Ensure everything aligns properly
  },
  icon: {
    width: 25, // Set a fixed width for all icons
    textAlign: "center",
    marginRight: 10,
  },
  activeText: {
    color: "#fff",
  },
  customButton: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
    fontFamily: "Merriweather_24pt_SemiCondensed-Bold",
    letterSpacing: 2,
  },
});

export default CustomBtn;
