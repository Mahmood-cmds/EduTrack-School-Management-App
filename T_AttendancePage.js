import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const T_AttendancePage = ({ route }) => {
    const { username, role, users } = route.params;
    const [attendanceData, setAttendanceData] = useState({});
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make API call to fetch teacher's attendance data
                const response = await fetch(`https://d071-2405-201-c007-3923-ec81-3f80-2fcb-31b0.ngrok-free.app/attendance/?username=${username}`);
                const data = await response.json();
                console.log(data);

                const monthlyData = data.attendance_data; // Assuming this is the correct key

                setAttendanceData(monthlyData); // Update state with monthlyData

                const processedMarkedDates = {};

                for (const [yearMonth, monthData] of Object.entries(monthlyData)) {
                    const [year, month] = yearMonth.split('-');

                    for (let day = 1; day <= 31; day++) {
                        const date = `${year}-${month}-${day.toString().padStart(2, '0')}`;
                        const status = monthData[day.toString()] || 'default';

                        processedMarkedDates[date] = {
                            marked: true,
                            selected: true,
                            selectedColor: getStatusColor(status),
                        };
                    }
                }

                setMarkedDates(processedMarkedDates);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchData();
    }, [username]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return '#09b846';
            case 'absent':
                return '#e30707';
            case 'holiday':
                return '#0f1dba';
            default:
                return 'gray'; // You can set a default color for other statuses
        }
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);

        const selectedStatus = attendanceData[day.dateString] || 'default';

        // Update selectedStatus
        setSelectedStatus(selectedStatus);

        // Open modal
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedStatus('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.username}>{username}</Text>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={markedDates}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        <Text>Status: {selectedStatus}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getStatusColor('present') }]} />
                    <Text style={styles.legendText}>Present</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getStatusColor('absent') }]} />
                    <Text style={styles.legendText}>Absent</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getStatusColor('holiday') }]} />
                    <Text style={styles.legendText}>Holiday</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    username: {
        fontSize: 20,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    },
});

export default T_AttendancePage;
