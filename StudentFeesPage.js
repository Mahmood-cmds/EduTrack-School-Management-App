import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StudentFeesPage =  ({ route }) => {
    const { username, users } = route.params;
    const [classStudentsData, setClassStudentsData] = useState([]);
    const [feesData, setFeesData] = useState([]);
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
            const response = await fetch(`https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/students/${className}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setClassStudentsData(data.students_data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchFeesData = async (studentUsername) => {
        try {
            const response = await fetch(`https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/get-student-fees-details/${studentUsername}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch student details');
            }
            const data = await response.json();
            setFeesData(data);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const selectStudent = (student) => {
        setSelectedStudent(student);
        fetchFeesData(student.username); // Fetch fees data when student is selected
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => selectStudent(item)} style={styles.studentContainer}>
            <Text style={styles.studentName}>{item.username}</Text>
        </TouchableOpacity>
    );

    const sendReminder = () => {
        if (selectedStudent) {
            // Send reminder message API call
            fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/send-reminder-message/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    class: className,
                    username: selectedStudent.username,
                    father_name: selectedStudent.father_name,
                    mother_name: selectedStudent.mother_name,
                    phone_number: selectedStudent.phone_number,
                    sent_by: username, // You may change this to the actual sender
                    message: 'Your fees is not fully clear. Please visit the school receptionist for assistance.',
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Reminder message sent successfully:', data);
            })
            .catch(error => {
                console.error('Error sending reminder message:', error);
            });
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Student Fees Details</Text>
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
                    <Text style={styles.modalHeader}>Student Fees Details</Text>
                    {selectedStudent && (
                        <FlatList
                            data={[selectedStudent]}
                            renderItem={({ item }) => (
                                <View style={styles.modalContent}>
                                    <Text>Name: {item.username}</Text>
                                    <Text>Phone Number: {item.phone_number}</Text>
                                    <Text>Father's Name: {item.father_name}</Text>
                                    <Text>Mother's Name: {item.mother_name}</Text>
                                    <Text>Class: {item.class_name}</Text>
                                    <Button title="Send Reminder" onPress={sendReminder} />
                                    <Text style={styles.feesHeader}>Fees Details</Text>
                                    <FlatList
                                        data={feesData.reverse()} // Reverse the array here
                                        renderItem={({ item }) => (
                                            <View style={styles.feesRow}>
                                                <View style={styles.feesLeft}>
                                                    <Text style={styles.feesLabel}>Month:</Text>
                                                    <Text style={styles.feesText}>{item.month}</Text>
                                                    <Text style={styles.feesLabel}>Date of Payment:</Text>
                                                    <Text style={styles.feesText}>{item.date_of_payment}</Text>
                                                </View>
                                                <View style={styles.feesRight}>
                                                    <Text style={styles.feesLabel}>Fees Paid Amount:</Text>
                                                    <Text style={[styles.feesText, { color: item.due_amount > 0 ? 'red' : 'green' }]}>{item.fees_paid_amount}</Text>
                                                    <Text style={styles.feesLabel}>Due Amount:</Text>
                                                    <Text style={[styles.feesText, { color: item.due_amount > 0 ? 'red' : 'green' }]}>{item.due_amount}</Text>
                                                </View>
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
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
        paddingVertical: 10,
    },
    feesHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    feesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    feesLeft: {
        flex: 1,
        marginRight: 10,
    },
    feesRight: {
        flex: 1,
        marginLeft: 10,
    },
    feesLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    feesText: {
        marginBottom: 10,
    },
});

export default StudentFeesPage;
