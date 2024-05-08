import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const HomeworkPostPage = ({ route }) => {
    const { username, users } = route.params;
    const teacher = users.find(user => user.username === username);
    
    const [text, setText] = useState('');
    const [photo, setPhoto] = useState(null);

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

    const postHomework = async () => {
        try {
            const formData = new FormData();
            formData.append('class_name', teacher.class);
            formData.append('teacher_name', teacher.username);
            formData.append('text', text);
            if (photo) {
                const localUri = photo;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';
                formData.append('photo', { uri: localUri, name: filename, type });
            }

            const response = await fetch('https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/api/post-homework/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to post homework');
            }

            // Reset state
            setText('');
            setPhoto(null);

            // Show success message
            Alert.alert('Success', 'Homework posted successfully', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
        } catch (error) {
            console.error('Error posting homework:', error);
            // Handle error as needed
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Homework Text</Text>
            <TextInput
                style={[styles.input, styles.textInput]}
                value={text}
                onChangeText={setText}
                placeholder="Enter Homework Text"
                multiline
            />
            <TouchableOpacity style={styles.pickPhotoButton} onPress={pickImage}>
                <Text style={styles.pickPhotoButtonText}>Pick a Photo</Text>
            </TouchableOpacity>
            {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
            <Button title="Post Homework" onPress={postHomework} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    textInput: {
        height: 100,
    },
    pickPhotoButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    pickPhotoButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    photoPreview: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default HomeworkPostPage;
