import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';

const SalariesPage = () => {
    const [teacherList, setTeacherList] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [month, setMonth] = useState('');
    const [dateOfPayment, setDateOfPayment] = useState(new Date());
    const [paidAmount, setPaidAmount] = useState('');
    const [due, setDue] = useState('');
    const [receiptImage, setReceiptImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchTeacherList();
    }, []);

    const fetchTeacherList = async () => {
        try {
            const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/teachers/');
            if (!response.ok) {
                throw new Error('Failed to fetch teacher list');
            }
            const data = await response.json();
            setTeacherList(data.teachers_data);
        } catch (error) {
            console.error('Error fetching teacher list:', error);
        }
    };

    const requestCameraPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permission to upload photo.');
            }
        }
    };

    const pickImage = async () => {
        await requestCameraPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setReceiptImage(result.uri);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfPayment;
        setShowDatePicker(Platform.OS === 'ios');
        setDateOfPayment(currentDate);
    };

    const handleSubmit = async () => {
        try {
            const formattedDate = dateOfPayment.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
            console.log(selectedTeacher,teacherDetails)
            const formData = new FormData();
            formData.append('teacher_name', selectedTeacher.username);
            formData.append('month', month);
            formData.append('date_of_payment', formattedDate); // Use formatted date
            formData.append('paid_amount', paidAmount);
            formData.append('due', due);
            formData.append('class_name', teacherDetails.class_name);
            formData.append('phone_number', teacherDetails.phone_number);
            formData.append('receipt_image', {
                uri: receiptImage,
                type: 'image/jpeg',
                name: 'salary_receipt.jpg',
            });

            const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/post-salary/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Salary posted successfully.');
            } else {
                Alert.alert('Error', 'Failed to post salary. Please try again.');
            }
        } catch (error) {
            console.error('Error posting salary:', error);
            Alert.alert('Error', 'Failed to post salary. Please try again.');
        }
    };

    const handleTeacherChange = async (value) => {
        setSelectedTeacher(value);
        console.log("hi",teacherList,value.username,value.class_name)
        const selectedTeacherDetails = teacherList.find((teacher) => teacher === value);
        setTeacherDetails(selectedTeacherDetails);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Post Salary</Text>
            <View style={styles.field}>
                <Text style={styles.label}>Teacher Name:</Text>
                <Picker
                    selectedValue={selectedTeacher}
                    style={{ height: 50, width: '100%' }}
                    onValueChange={handleTeacherChange}>
                    <Picker.Item label="Select Teacher" value={null} />
                    {teacherList.map((teacher) => (
                        <Picker.Item key={teacher.username} label={teacher.username} value={teacher} />
                    ))}
                </Picker>
            </View>
            {teacherDetails && (
                <View style={styles.teacherDetailsContainer}>
                    <Text style={styles.teacherDetailLabel}>Teacher Details:</Text>
                    <Text>{`Phone Number: ${teacherDetails.phone_number}`}</Text>
                    <Text>{`Father's Name: ${teacherDetails.father_name}`}</Text>
                    <Text>{`Mother's Name: ${teacherDetails.mother_name}`}</Text>
                    <Text>{`Class: ${teacherDetails.class_name}`}</Text>
                </View>
            )}
            <TextInput
                style={styles.input}
                value={month}
                onChangeText={setMonth}
                placeholder="Month"
            />
            <View style={styles.field}>
                <Text style={styles.label}>Date of Payment:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text>{dateOfPayment.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={dateOfPayment}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>
            <TextInput
                style={styles.input}
                value={String(paidAmount)} // Convert to string
                onChangeText={setPaidAmount}
                placeholder="Paid Amount"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                value={String(due)} // Convert to string
                onChangeText={setDue}
                placeholder="Due"
                keyboardType="numeric"
            />
            <Button title="Upload Receipt Image" onPress={pickImage} />
            {receiptImage && <Text>Receipt Image Selected</Text>}
            <Button title="Post Salary" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    teacherDetailsContainer: {
        marginBottom: 20,
    },
    teacherDetailLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    field: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default SalariesPage;
