import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const TeacherTimetablePage = ({ route }) => {
    const { username, role, users } = route.params;
    const [occasion, setOccasion] = useState('');
    const [className, setClassName] = useState('');
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

        if (!result.cancelled) {
            setPhoto(result.uri);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('occasion', occasion);
            formData.append('class_name', className);
            formData.append('photo', {
                uri: photo,
                type: 'image/jpeg',
                name: 'timetable.jpg',
            });

            const response = await fetch('https://47d2-2405-201-c007-3923-5c88-922f-571-e635.ngrok-free.app/post-timetable/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to post timetable');
            }

            setOccasion('');
            setClassName('');
            setPhoto(null);

            alert('Timetable posted successfully');
        } catch (error) {
            console.error('Error posting timetable:', error);
            alert('Failed to post timetable. Please try again later.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Post Timetable</Text>
            <Text style={styles.label}>Teacher Name: {username}</Text>
            <Text style={styles.label}>Occasion</Text>
            <TextInput
                style={styles.input}
                value={occasion}
                onChangeText={setOccasion}
                placeholder="Occasion"
            />
            <Text style={styles.label}>Class Name</Text>
            <TextInput
                style={styles.input}
                value={className}
                onChangeText={setClassName}
                placeholder="Class Name"
            />
            <Button title="Choose Photo" onPress={pickImage} />
            {photo && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
            <View style={styles.buttonContainer}>
                <Button title="Post Timetable" onPress={handleSubmit} />
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

export default TeacherTimetablePage;
