import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image } from 'react-native'; // Import Image component
import * as ImagePicker from 'expo-image-picker';

const MessagePage =  ({ route }) => {
    const { username, users } = route.params;

    const [message, setMessage] = useState('');
    const [photo, setPhoto] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const submitMessage = async () => {
        try {
            // Send message data to backend API endpoint
            const formData = new FormData();
            formData.append('message', message);
            if (photo) {
                let localUri = photo;
                let filename = localUri.split('/').pop();

                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                // Create the file object
                formData.append('photo', { uri: localUri, name: filename, type });
            }
            formData.append('username', username);

            const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/save-message/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to save message');
            }

            // Reset form fields after successful submission
            setMessage('');
            setPhoto(null);
            alert('Message saved successfully!');
        } catch (error) {
            console.error('Error saving message:', error);
            alert('Failed to save message. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Post Message</Text>
            <Text>Message:</Text>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your message"
                multiline
            />
            <Button title="Add Photo" onPress={pickImage} />
            {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
            <Button title="Submit" onPress={submitMessage} />
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
    input: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default MessagePage;
