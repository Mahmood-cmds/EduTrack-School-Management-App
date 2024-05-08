import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ManagementAttendancePage = ({ route }) => {
  const { username, users } = route.params;
  const [selectedTeachers, setSelectedTeachers] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [Teachers, setTeachers] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  let class_name;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Fetch list of all students
        const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/teachers/');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        console.log(data)
        setTeachers(data.teachers);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchTeachers();
  }, []);

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
      // Construct the request body
      const formData = {
        Name: selectedTeachers,
        role:"teacher",
        selectedDate,
        attendanceStatus,
      };

      // Make API call to save attendance data
      const response = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/post-attendance/', {
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
      setSelectedTeachers('');
      setAttendanceStatus('');

      // Notify the user about successful submission
      alert('Attendance submitted successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      // Notify the user about the error
      alert('Failed to submit attendance. Please try again later.');
    }
  };

  const goToStudentsAttendancePage = () => {
    navigation.navigate('StudentsAttendancePage', { username, users });
  };
  const goToTeachsAttendancePage = () => {
    navigation.navigate('TeachsAttendancePage', { username, users });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teacher Attendance</Text>
      <TouchableOpacity onPress={goToStudentsAttendancePage}>
        <Text style={styles.checkAttendanceButton}>Check Students Attendance</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToTeachsAttendancePage}>
        <Text style={styles.checkAttendanceButton}>Check Teachers Attendance</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Welcome {username}</Text>
      <Text style={styles.label}>Teacher Name</Text>
      <Picker
        selectedValue={selectedTeachers}
        onValueChange={(itemValue) => setSelectedTeachers(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Teacher" value="" />
        {Teachers.map((Teacher, index) => (
          <Picker.Item key={index} label={Teacher} value={Teacher} />
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
  checkAttendanceButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 20,
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
});

export default ManagementAttendancePage;
