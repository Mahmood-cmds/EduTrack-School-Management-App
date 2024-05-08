import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TeacherFeesPage = ({ route }) => {
    const { username, role, users } = route.params;
    const [students, setStudents] = useState([]);
    const [feesDetails, setFeesDetails] = useState([]);
    let class_name;

    for (const user of users) {
        if (user.role === 'teacher') {
            class_name = user.class;
            break;
        }
    } 
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/api/students/${class_name}/`);
                const data = await response.json();
                setStudents(data.students);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        const fetchFeesDetails = async () => {
            try {
                const response = await fetch(`https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/get-fees-details/${class_name}/`);
                const data = await response.json();
                setFeesDetails(data);
            } catch (error) {
                console.error('Error fetching fees details:', error);
            }
        };

        fetchStudents();
        fetchFeesDetails();
    }, [class_name]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Fees Details for Class {class_name}</Text>
            <View style={styles.studentsContainer}>
                {feesDetails.map(studentFee => (
                    <View key={studentFee.username} style={styles.card}>
                        <Text style={styles.studentName}>{studentFee.username}</Text>
                        <Text style={styles.feeDetail}>Due Amount: {studentFee.due_amount}</Text>
                        <Text style={styles.feeDetail}>Last Date of Payment: {studentFee.last_date_of_payment}</Text>
                        <Text style={studentFee.due_amount > 0 ? styles.notClear : styles.clear}>
                            {studentFee.due_amount > 0 ? "Not Clear" : "Clear"}
                        </Text>
                    </View>
                ))}
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
    studentsContainer: {
        marginTop: 10,
    },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    feeDetail: {
        marginBottom: 5,
    },
    clear: {
        color: 'green',
    },
    notClear: {
        color: 'red',
    },
});

export default TeacherFeesPage;
