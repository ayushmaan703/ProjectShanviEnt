import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExpenceType, setExpense } from '../store/slice/Expence.slice';
import Toast from 'react-native-toast-message';
import CustomNavBar from '../helper/CustomNavBar';
import image from "../data/download.jpg"

const Expenses = () => {
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [siteName, setSiteName] = useState('');
  const [tdate, setDate] = useState(new Date());
  const [categories, setCategories] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [showDate, setShowDate] = useState(false);
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    const fetchData = async () => {
      const data = await dispatch(getAllExpenceType())
      setCategories(data.payload)
    }
    fetchData()
  }, [dispatch])

  const handleSubmitExpence = async () => {
    const response = await dispatch(setExpense({ ExpDate: moment(tdate).format('DD-MMM-YYYY'), EmpId: userData.EmpId, ExpId: selectedCategory, Remark: remark, Amt: amount }))
    if (response.type === "setExpence/fulfilled") {
      setAmount('')
      setDate(new Date())
      setExpense('')
      setRemark('')
      setSiteName('')
      Toast.show({
        type: 'customNotificationSuccess',
        text1: "Expence Submitted",
        visibilityTime: 1000
      });
    }
    else {
      Toast.show({
        type: 'customNotificationError',
        text1: "Error Occured",
        visibilityTime: 1000
      });
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomNavBar title={"Expenses"} />
        <View style={styles.formContainer}>
          {/* <ImageBackground
            source={image}
            style={styles.background}
            resizeMode="cover"
            imageStyle={{ borderRadius: 15, opacity: 1}}
          > */}
            <Input
              label="Site Name"
              placeholder="Enter Site"
              multiline
              numberOfLines={3}
              value={siteName}
              onChangeText={setSiteName}
              leftIcon={<Icon name="map-marker" size={24} color="#666" />}
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              labelStyle={styles.inputLabelTextHeader}
            />
            {/* Amount Input */}
            <Input
              label="Amount"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              leftIcon={<Icon name="money" size={24} color="#666" />}
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              labelStyle={styles.inputLabelTextHeader}
            />

            {/* Category Dropdown */}
            <View style={styles.listContainer}>
              <Text style={styles.dropdownLabel}>Expence Category</Text>
              <SelectDropdown
                data={categories}
                search
                dropdownOverlayColor="transparent"
                searchPlaceHolder="Search categories..."
                onSelect={(selectedItem, index) => {
                  setSelectedCategory(selectedItem.Id)
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.xpence) || 'Select category'}
                      </Text>
                      <Icon
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: '#D2D9DF' })
                      }}>
                      <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                      <Text style={styles.dropdownItemTxtStyle}>{item.xpence}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </View>
            <View style={styles.dateContainer}>
              <Pressable onPress={() => setShowDate(true)} style={styles.dateButton}>
                <Text style={styles.boldText}>Date:</Text>
                <Text style={styles.input}>{moment(tdate).format('DD/MM/YYYY')}</Text>
              </Pressable>
            </View>
            {/* Remark Input */}
            <Input
              label="Remarks"
              placeholder="Enter remarks"
              multiline
              numberOfLines={3}
              value={remark}
              onChangeText={setRemark}
              leftIcon={<Icon name="comment" size={24} color="#666" />}
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              labelStyle={styles.inputLabelTextHeader}
            />
            {showDate && (
              <DateTimePicker
                value={tdate}
                mode="date"
                display="default"
                onChange={(event, date) => { setShowDate(false); setDate(date || tdate); }}
              />
            )}
            {/* Submit Button */}
            {amount && siteName && selectedCategory && remark && <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitExpence}
            >
              <Text style={styles.submitButtonText}>Submit Expense</Text>
            </TouchableOpacity>}
          {/* </ImageBackground> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    padding: 20,
  },
  formContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 2
  },
  inputContainer: {
    marginBottom: 2,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    color: '#333',
    fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
    letterSpacing: 1,
  },
  inputLabelTextHeader: {
    color: '#444',
    fontSize: 20,
    fontFamily: "Merriweather_24pt-ExtraBold",
    letterSpacing: 0.5,
  },
  dropdownLabel: {
    color: '#444',
    marginBottom: 8,
    fontSize: 19,
    fontWeight:600,
    // fontFamily: "Merriweather_24pt-ExtraBold",
    letterSpacing: 0.5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 20
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: "Merriweather_24pt-ExtraBold",
    letterSpacing: 2,

  },
  dropdownButtonStyle: {
    width: "95%",
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 30,

  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    color: '#151E26',
    fontFamily: "Merriweather_24pt_SemiCondensed-SemiBold",
    letterSpacing: 1,
  },
  dropdownButtonArrowStyle: {
    fontSize: 18,
    color: "#666"
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,

  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  boldText: {
    color: '#000',
    marginRight: 5,
    fontFamily: "Merriweather_24pt-ExtraBold",
    letterSpacing: 1.3,
    fontSize: 16
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E9ECEF',
    borderRadius: 10,

  },
  dateContainer: {
    marginBottom: 10,
    padding: 5,
    width: "85%",
    backgroundColor: '#E9ECEF',
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20
  },
});

export default Expenses;