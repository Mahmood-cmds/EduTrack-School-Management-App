import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';

const StudentHomeworkPage = () => {
    const [homeworkData, setHomeworkData] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    useEffect(() => {
        fetchHomeworkData();
    }, []);

    const fetchHomeworkData = async () => {
        try {
            const response = await fetch('https://e4f9-2405-201-c007-3923-cd7a-e4b6-7c39-f260.ngrok-free.app/get-all-homework/');
            if (!response.ok) {
                throw new Error('Failed to fetch homework data');
            }
            const data = await response.json();
            setHomeworkData(data.homework);
        } catch (error) {
            console.error('Error fetching homework data:', error);
            setError('Failed to fetch homework data');
        }
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const amPM = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12; // Handle midnight (0 hours)

        return `${date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${hours}:${minutes < 10 ? '0' + minutes : minutes} ${amPM}`;
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.pageTitle}>Homework</Text>
            {homeworkData && homeworkData.length > 0 ? (
                homeworkData.map((item, index) => (
                    <View key={index} style={styles.homeworkItem}>
                        {item.teacher_name && (
                            <>
                                {item.text && <Text style={styles.homeworkText}>Homework: {item.text}</Text>}
                                <Text style={styles.homeworkText}>Teacher: {item.teacher_name}</Text>
                                <Text style={styles.homeworkText}>Class Name: {item.class_name}</Text>
                                {item.posted_on && <Text style={styles.homeworkText}>Posted At: {formatDate(item.posted_on)}</Text>}
                                <TouchableHighlight onPress={() => openModal(item.photo)}>
                                    <Image
                                        key={item.id}
                                        source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                                        style={{ width: '100%', height: 200, marginTop: 10, resizeMode: 'contain' }}
                                    />
                                </TouchableHighlight>
                            </>
                        )}
                    </View>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No homework available</Text>
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                    <TouchableHighlight onPress={closeModal}>
                        <Text style={{ color: 'blue', marginTop: 20 }}>Close</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    homeworkItem: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
    },
    homeworkText: {
        fontSize: 16,
        marginBottom: 5,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default StudentHomeworkPage;
