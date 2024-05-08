import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const TeachsAttendancePage = ({ route }) => {
    const { username, users } = route.params;
    const [teachers, setTeachers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [attendancePresent, setAttendancePresent] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/teachers/');
            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }
            const data = await response.json();
            console.log(data)

            setTeachers(data.teachers_data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const openModal = (teacher) => {
        setSelectedTeacher(teacher);
        setAttendancePresent(false);
        setModalVisible(true);
        checkAttendanceData(teacher);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const checkAttendanceData = async (teacher) => {
        try {
            const class_name = teacher.class_name
            const response = await fetch(`https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/all-teachers-attendance/${class_name}`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }
            const data = await response.json();
            const sortedAttendanceData = data.attendance.sort((a, b) => {
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
            setAttendanceData(sortedAttendanceData);
            setAttendancePresent(data.attendance.length > 0);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setAttendancePresent(false);
        }
    };
    
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)} style={styles.teacherContainer}>
            <Text style={styles.teacherName}>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Teachers Attendance</Text>
            <FlatList
                data={teachers}
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
                    <Text style={styles.modalHeader}>Teacher Details</Text>
                    {selectedTeacher && (
                        <View style={styles.modalContent}>
                            <Text>Name: {selectedTeacher.username}</Text>
                            <Text>Phone Number: {selectedTeacher.phone_number}</Text>
                            <Text>Father's Name: {selectedTeacher.father_name}</Text>
                            <Text>Mother's Name: {selectedTeacher.mother_name}</Text>
                            <Text>Class: {selectedTeacher.class_name}</Text>
                            {attendancePresent ? (
                                <View>
                                    <Text style={styles.attendanceHeader}>Attendance Details</Text>
                                    {attendanceData.map((attendance, index) => (
                                        <View key={index}>
                                            <Text>Month: {attendance.month_year}</Text>
                                            <Text>Days Present: <Text style={styles.presentText}>{attendance.days_present}</Text></Text>
                                            <Text>Days Absent: <Text style={styles.absentText}>{attendance.days_absent}</Text></Text>
                                        </View>
                                    ))}
                                </View>
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
    teacherContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    teacherName: {
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

export default TeachsAttendancePage;
