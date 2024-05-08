import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Modal, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const TeacherAttendancePage = ({ route }) => {
  const { username, role, users } = route.params;
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [students, setStudents] = useState([]);
  const [studentsdata, setStudentsData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const navigation = useNavigation();
  let class_name;

  // Iterate through the list of dictionaries in users to find the class name
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
        setStudentsData(data.students_data)
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [class_name]);

  const handleDateChange = (event, newDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (newDate !== undefined) {
      setSelectedDate(newDate);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleSubmit = async () => {
    try {
      console.log('Selected Date:', selectedDate);
      // Construct the request body
      const formData = {
        Name: selectedStudent,
        role: "student",
        class: class_name,
        selectedDate,
        attendanceStatus,
      };

      // Make API call to save attendance data
      const response = await fetch('https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/post-attendance/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }

      // Reset form fields
      setSelectedStudent('');
      setAttendanceStatus('');

      // Notify the user about successful submission
      alert('Attendance submitted successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      // Notify the user about the error
      alert('Failed to submit attendance. Please try again later.');
    }
  };

  const fetchTodaysAttendance = async () => {
    try {
      const response = await fetch(`https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/api/all-students-attendance/${class_name}/`);
      const data = await response.json();
      console.log("data", data)
      setTodaysAttendance(data.todays_attendance);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      alert('Failed to fetch today\'s attendance. Please try again later.');
    }
  };

  const sendReminder = (studentName) => {
    console.log("student anem", studentName)
    console.log(studentsdata)
    // Find the selected student's details from studentsdata state
    const selectedStudentDetails = studentsdata.find(student => student.username === studentName);
    console.log(selectedStudentDetails)
    // Check if the student details are found
    if (selectedStudentDetails) {
      // Send reminder message API call
      fetch('https://a2f7-2405-201-c007-3923-a528-3e75-7047-a871.ngrok-free.app/api/send-reminder-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: class_name,
          username: selectedStudentDetails.username,
          father_name: selectedStudentDetails.father_name,
          mother_name: selectedStudentDetails.mother_name,
          phone_number: selectedStudentDetails.phone_number,
          sent_by: username, // You may change this to the actual sender
          message: `Dear ${selectedStudentDetails.username}, you were marked absent today. Please make sure to attend classes regularly.`,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Reminder message sent successfully:', data);
          alert('Reminder sent successfully');
        })
        .catch(error => {
          console.error('Error sending reminder message:', error);
        });
    } else {
      console.error('Student details not found');
    }
  };


  const goToTAttendancePage = () => {
    navigation.navigate('T_AttendancePage', { username: username, role: role, users: users });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teacher Attendance</Text>
      <Button
        title="Check My Attendance"
        onPress={goToTAttendancePage}
        style={styles.checkAttendanceButton}
      />
      <Text style={styles.label}>Class: {class_name}</Text>
      <Text style={styles.label}>Teacher Name: {username}</Text>
      <Text style={styles.label}>Student Name</Text>
      <Picker
        selectedValue={selectedStudent}
        onValueChange={(itemValue) => setSelectedStudent(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Student" value="" />
        {/* Render the list of students dynamically */}
        {students.map((student, index) => (
          <Picker.Item key={index} label={student} value={student} />
        ))}
      </Picker>
      <Text style={styles.label}>Date</Text>
      <View>
        <Text>Selected Date: {selectedDate.toDateString()}</Text>
        <Button title="Select Date" onPress={toggleDatePicker} />
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <Text style={styles.label}>Attendance Status</Text>
      <TextInput
        style={styles.input}
        value={attendanceStatus}
        onChangeText={setAttendanceStatus}
        placeholder="Present, Absent, Holiday"
      />
      <Button title="Submit" onPress={handleSubmit} />

      <Button title="Today's Attendance" onPress={fetchTodaysAttendance} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>Today's Attendance</Text>
            <FlatList
              data={todaysAttendance}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.studentItem}>
                  <Text style={{ marginRight: 10 }}>{item.student_name}</Text>
                  <Text style={{ color: item.attendance_status === 'Present' ? 'green' : 'red' }}>
                    {item.attendance_status}
                  </Text>
                  {item.attendance_status === 'Absent' && (
                    <Button
                      title="Send Reminder"
                      onPress={() => sendReminder(item.student_name)}
                      color="blue"
                    />
                  )}
                </View>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
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
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default TeacherAttendancePage;
