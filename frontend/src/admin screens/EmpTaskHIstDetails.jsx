import React from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground } from "react-native";
import { Card } from "react-native-paper";
import CustomNavBar from "../helper/CustomNavBar";
import image from "../data/PremiumVector.jpg"
import image2 from "../data/download4.jpg"
import { formattedDate } from "../helper/formattedDate";

const EmpTaskHIstDetails = ({ route }) => {

    const { data } = route.params

    return (
        <View style={styles.container}>

            {/* navbar */}
            <CustomNavBar title={"Task History"} color="rgba(123, 126, 209, 1)" />

            {data?.length > 0 && (
                <Text style={styles.lengthContainer}>
                    <Text style={styles.lengthHeading}>Total Completed Task :  </Text>
                    <Text style={styles.lengthText}> {data?.length}</Text>
                </Text>)}

            <FlatList
                data={data}
                keyExtractor={(item) => item.TaskId}
                ListEmptyComponent={<Text style={styles.noTaskText}>No History</Text>}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <ImageBackground
                            source={!item.DoneDate ? image : image2}
                            style={styles.background}
                            resizeMode="cover"
                            imageStyle={{ borderRadius: 15, opacity: 0.485 }}
                        >
                            <Card.Title
                                titleStyle={styles.cardTitleBox}
                                title={
                                    <View>
                                        <Text style={styles.cardTitleHeading}>
                                            {item.Task}
                                        </Text>
                                    </View>
                                }
                            />

                            <Card.Content>
                                <Text style={styles.cardContentContainer}>
                                    <Text style={styles.cardContentHeading}>{!item.DoneDate ? "Title : " : "Task :"} </Text>
                                    <Text style={styles.cordContentData}>{item.Task}</Text>
                                </Text>
                                <Text style={styles.cardContentContainer}>
                                    <Text style={styles.cardContentHeading}>Description : </Text>
                                    <Text style={styles.cordContentData}> {item.Description}</Text>
                                </Text>
                                <Text style={styles.cardContentContainer}>
                                    <Text style={styles.cardContentHeading}>{!item.DoneDate ? "Journal Date : " : "Task Date : "} </Text>
                                    <Text style={styles.cordContentData}> {formattedDate(item.TaskDate)}</Text>
                                </Text>
                                {item.DoneDate && <Text style={styles.cardContentContainer}>
                                    <Text style={styles.cardContentHeading}>Done Date : </Text>
                                    <Text style={styles.cordContentData}> {formattedDate(item.DoneDate)}</Text>
                                </Text>}
                                {item.DoneRemark && <Text style={styles.cardContentContainer}>
                                    <Text style={styles.cardContentHeading}>Done Remark : </Text>
                                    <Text style={styles.cordContentData}> {item.DoneRemark}</Text>
                                </Text>}
                            </Card.Content>
                        </ImageBackground>
                    </Card>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e2e2e2",
        padding: 16,
    },
    card: {
        borderWidth: 1.5,
        backgroundColor: "#fff",
        marginTop: 10,
        marginHorizontal: 10,
        // padding: 10
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
        fontFamily: "Merriweather_24pt-Bold",
        letterSpacing: 1.3,
    },
    lengthContainer: {
        color: '#000',
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
        fontWeight: '500',
        fontSize: 20,
        color: '#333',
    },
    noTaskText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default EmpTaskHIstDetails;
