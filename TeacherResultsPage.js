import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const TeacherResultsPage = ({ route }) => {
    const { username, role } = route.params;
    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const [examName, setExamName] = useState('');
    const [remarks, setRemarks] = useState('');
    const [photo, setPhoto] = useState(null);

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

        if (!result.canceled) {
            setPhoto(result.uri);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('student_name', studentName);
            formData.append('class_name', className);
            formData.append('exam_name', examName);
            formData.append('remarks', remarks);
            formData.append('result_photo', {
                uri: photo,
                type: 'image/jpeg',
                name: 'result.jpg',
            });

            const response = await fetch('https://47d2-2405-201-c007-3923-5c88-922f-571-e635.ngrok-free.app/post-result/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to post result');
            }

            setStudentName('');
            setClassName('');
            setExamName('');
            setRemarks('');
            setPhoto(null);

            alert('Result posted successfully');
        } catch (error) {
            console.error('Error posting result:', error);
            alert('Failed to post result. Please try again later.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Post Result</Text>
            <Text style={styles.label}>Teacher Name: {username}</Text>
            <Text style={styles.label}>Student Name</Text>
            <TextInput
                style={styles.input}
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Student Name"
            />
            <Text style={styles.label}>Class Name</Text>
            <TextInput
                style={styles.input}
                value={className}
                onChangeText={setClassName}
                placeholder="Class Name"
            />
            <Text style={styles.label}>Exam Name</Text>
            <TextInput
                style={styles.input}
                value={examName}
                onChangeText={setExamName}
                placeholder="Exam Name"
            />
            <Text style={styles.label}>Remarks</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Remarks"
                multiline
            />
            <Button title="Choose Photo" onPress={pickImage} />
            {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
            <View style={styles.buttonContainer}>
                <Button title="Post Result" onPress={handleSubmit} />
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
    buttonContainer: {
        marginTop: 20,
    },
});

export default TeacherResultsPage;
