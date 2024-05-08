import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const TeacherAssignmentsPage = ({ route }) => {
    const { username, role, users } = route.params;
    const [assignmentDetails, setAssignmentDetails] = useState('');
    const [lastDateOfSubmission, setLastDateOfSubmission] = useState(new Date());
    const [subject, setSubject] = useState('');
    const [className, setClassName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        getPermissionAsync();
    }, []);

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const handleSubmit = async () => {
        try {
            // Construct the request body
            const formData = new FormData();
            formData.append('assignment_details', assignmentDetails);
            formData.append('last_date_of_submission', lastDateOfSubmission.toISOString());
            formData.append('teacher_name', username);
            formData.append('subject', subject);
            formData.append('class_name', className);
            formData.append('photo', {
                uri: photo,
                type: 'image/jpeg',
                name: 'assignment.jpg',
            });

            // Make API call to post assignment data
            const response = await fetch('https://47d2-2405-201-c007-3923-5c88-922f-571-e635.ngrok-free.app/post-assignment/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to post assignment');
            }

            // Reset form fields
            setAssignmentDetails('');
            setLastDateOfSubmission(new Date());
            setSubject('');
            setClassName('');
            setPhoto(null);

            // Notify the user about successful submission
            alert('Assignment posted successfully');
        } catch (error) {
            console.error('Error posting assignment:', error);
            // Notify the user about the error
            alert('Failed to post assignment. Please try again later.');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastDateOfSubmission;
        setShowDatePicker(false);
        setLastDateOfSubmission(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Post Assignment</Text>
            <Text style={styles.label}>Teacher Name: {username}</Text>
            <Text style={styles.label}>Subject</Text>
            <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Subject"
            />
            <Text style={styles.label}>Class Name</Text>
            <TextInput
                style={styles.input}
                value={className}
                onChangeText={setClassName}
                placeholder="Class Name"
            />
            <Text style={styles.label}>Assignment Details</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={assignmentDetails}
                onChangeText={setAssignmentDetails}
                placeholder="Assignment Details"
                multiline
            />
            <Text style={styles.label}>Last Date of Submission</Text>
            <View style={styles.datePicker}>
                <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
                <Text>{lastDateOfSubmission.toDateString()}</Text>
                {showDatePicker && (
                    <DateTimePicker
                        value={lastDateOfSubmission}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>
            <Button title="Choose Photo" onPress={pickImage} />
            {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
            <View style={styles.buttonContainer}>
                <Button title="Post Assignment" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default TeacherAssignmentsPage;
