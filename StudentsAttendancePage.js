import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StudentsAttendancePage = ({ route }) => {
    const { username, users } = route.params;
    const [classStudentsData, setClassStudentsData] = useState([]);
    const [className, setClassName] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [attendancePresent, setAttendancePresent] = useState(false); // State to track attendance data presence
    const navigation = useNavigation();

    useEffect(() => {
        if (classStudentsData.length > 0) {
            fetchAttendanceData();
        }
    }, [classStudentsData]);

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

    const fetchAttendanceData = async () => {
        try {
            const studentNames = classStudentsData.map(student => student.username);
            const response = await fetch(`https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/all-students-attendance/${className}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }
            const data = await response.json();
            setAttendanceData(data.students_attendance);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)} style={styles.studentContainer}>
            <Text style={styles.studentName}>{item.username}</Text>
        </TouchableOpacity>
    );

    const openModal = (student) => {
        setSelectedStudent(student);
        setAttendancePresent(false); // Reset attendance present flag
        setModalVisible(true);
        checkAttendanceData(student);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const checkAttendanceData = (student) => {

        const hasAttendanceData = attendanceData.some(data => data.student_name === student.username);
        setAttendancePresent(hasAttendanceData);
    };

    const sortedAttendanceData = [...attendanceData].sort((a, b) => {
        // Extract month and year from month_year field
        const [aYear, aMonth] = a.month_year.split('-').map(Number);
        const [bYear, bMonth] = b.month_year.split('-').map(Number);

        // Compare years first
        if (aYear !== bYear) {
            return bYear - aYear;
        }

        // If years are the same, compare months
        return bMonth - aMonth;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Students Attendance</Text>
            <Text style={styles.label}>Class Name</Text>
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
                    <Text style={styles.modalHeader}>Student Details</Text>
                    {selectedStudent && (
                        <View style={styles.modalContent}>
                            <Text>Name: {selectedStudent.username}</Text>
                            <Text>Phone Number: {selectedStudent.phone_number}</Text>
                            <Text>Father's Name: {selectedStudent.father_name}</Text>
                            <Text>Mother's Name: {selectedStudent.mother_name}</Text>
                            <Text>Class: {selectedStudent.class_name}</Text>
                            <Text style={styles.attendanceHeader}>Attendance Details</Text>
                            {attendancePresent ? (
                                sortedAttendanceData
                                    .filter(data => data.student_name === selectedStudent.username)
                                    .map((attendance, index) => (
                                        <View key={index}>
                                            <Text>Month: {attendance.month_year}</Text>
                                            <Text>Days Present: <Text style={styles.presentText}>{attendance.days_present}</Text></Text>
                                            <Text>Days Absent: <Text style={styles.absentText}>{attendance.days_absent}</Text></Text>
                                        </View>
                                    ))
                            ) : (
                                <Text>No attendance data available</Text>
                            )}
                        </View>
                    )}
                    <Button title="Close" onPress={closeModal} />
                </View>
            </Modal>
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
    studentContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        marginTop:10
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: 'blue', // Change color to blue for clickable effect
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
    attendanceHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    presentText: {
        color: 'green',
    },
    absentText: {
        color: 'red',
    },
});

export default StudentsAttendancePage;
