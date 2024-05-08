import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const TeacherExamsPage = ({ route }) => {
    const { username, role } = route.params;
    const [subject, setSubject] = useState('');
    const [examName, setExamName] = useState('');
    const [remarks, setRemarks] = useState('');
    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    const pickPhotos = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true, // Allow selecting multiple photos
            });

            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri); // Extract URIs from assets
                setSelectedPhotos([...selectedPhotos, ...uris]);
            }


        } catch (error) {
            console.error('Error picking photos:', error);
            alert('Failed to pick photos. Please try again later.');
        }
    };


    const handleSubmit = async () => {
        try {
            // Construct the request body
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('exam_name', examName);
            formData.append('remarks', remarks);
            formData.append('student_name', studentName);
            formData.append('class_name', className);

            selectedPhotos.forEach((photo, index) => {
                formData.append(`paper_file_path`, {
                    uri: photo,
                    type: 'image/jpeg',
                    name: `question_paper_${index + 1}.jpg`,
                });
            });

            const response = await fetch('https://4c8c-2405-201-c007-3923-5c88-922f-571-e635.ngrok-free.app/post-exams/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to post exams');
            }

            setSubject('');
            setExamName('');
            setRemarks('');
            setStudentName('');
            setClassName('');
            setSelectedPhotos([]);

            alert('Exams posted successfully');
        } catch (error) {
            console.error('Error posting exams:', error);
            alert('Failed to post exams. Please try again later.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Post Exams</Text>
            <Text style={styles.label}>Teacher Name: {username}</Text>
            <Text style={styles.label}>Subject</Text>
            <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Subject"
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
            <Button title="Select Photos" onPress={pickPhotos} />
            <View style={styles.photosContainer}>
                {selectedPhotos.map((photo, index) => (
                    <Image key={index} source={{ uri: photo }} style={styles.photo} />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Post Exams" onPress={handleSubmit} />
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
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default TeacherExamsPage;
