import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Modal, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StudentResultsPage = () => {
    const [classStudentsData, setClassStudentsData] = useState([]);
    const [resultsData, setResultsData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [className, setClassName] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (className) {
            fetchClassStudents();
        }
    }, [className]);

    const fetchClassStudents = async () => {
        try {
            const response = await fetch(`https://800e-2405-201-c007-3923-fda8-4df5-3322-e26f.ngrok-free.app/api/students/${className}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            console.log(data)
            setClassStudentsData(data.students_data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchResultsData = async (studentUsername) => {
        try {
            const response = await fetch(`https://800e-2405-201-c007-3923-fda8-4df5-3322-e26f.ngrok-free.app/get-results/?username=${studentUsername}`);
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            const data = await response.json();
            console.log(data)
            setResultsData(data.results_data);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const selectStudent = (student) => {
        setSelectedStudent(student);
        fetchResultsData(student.username); // Fetch results data when student is selected
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => selectStudent(item)} style={styles.studentContainer}>
            <Text style={styles.studentName}>{item.username}</Text>
        </TouchableOpacity>
    );

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Student Results Details</Text>
            <TextInput
                style={styles.input}
                value={className}
                onChangeText={setClassName}
                placeholder="Enter Class Name"
            />
            <Button title="Get Data" onPress={fetchClassStudents} />
            <FlatList
                data={classStudentsData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Student Results Details</Text>
                    {selectedStudent && (
                        <View style={styles.modalContent}>
                            <Text>Name: {selectedStudent.username}</Text>
                            <Text>Phone Number: {selectedStudent.phone_number}</Text>
                            <Text>Father's Name: {selectedStudent.father_name}</Text>
                            <Text>Mother's Name: {selectedStudent.mother_name}</Text>
                            <Text>Class: {selectedStudent.class_name}</Text>
                            <Text style={styles.resultsHeader}>Results Details</Text>
                            {resultsData.length === 0 ? (
                                <Text>No results data found</Text>
                            ) : (
                            <FlatList
                                data={resultsData}
                                renderItem={({ item }) => (
                                    <View style={styles.resultItem}>
                                        <Image source={{ uri: `data:image/jpeg;base64,${item.result_photo}` }} style={styles.resultImage} />
                                        <Text>Exam Name: {item.exam_name}</Text>
                                        <Text>Remarks: {item.remarks}</Text>
                                        <Text>Created At: {item.created_at}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />)}
                        </View>
                    )}
                    <Button title="Close" onPress={closeModal} />
                </View>
            </Modal>
        </SafeAreaView>
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
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    studentContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        marginTop: 10
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'blue',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalContent: {
        marginBottom: 20,
    },
    resultsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    resultItem: {
        marginBottom: 20,
    },
    resultImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
});

export default StudentResultsPage;
