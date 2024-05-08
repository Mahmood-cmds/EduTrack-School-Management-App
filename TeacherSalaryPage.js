import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const TeacherSalaryPage = ({ route }) => {
  const { username } = route.params;
  const [salariesData, setSalariesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://a068-2405-201-c007-3923-11dd-f50a-f6ff-1d0a.ngrok-free.app/get-salary/?username=${username}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
          setSalariesData(data.salaries_data);
      } catch (error) {
        console.error('Error fetching salaries data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {salariesData.reverse().map((salary, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.month}>Month: {salary.month}</Text>
            <Text>Date of Payment: {salary.date_of_payment}</Text>
            <Text>Paid Amount: {salary.paid_amount}</Text>
            <Text>Due: <Text style={{ color: salary.due === 0 ? 'red' : 'green' }}>{salary.due}</Text></Text>
            <Text>Class: {salary.class_name}</Text>
            <Text>Phone Number: {salary.phone_number}</Text>
            <Text>Time of Payment: {salary.time_of_payment}</Text>
            {salary.receipt_image && <Image source={{ uri: `data:image/jpeg;base64,${salary.receipt_image}` }} style={styles.image} />}
          </Card.Content>
        </Card>
      ))}
      {salariesData.length === 0 && <Text>No salary details available</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  month: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    resizeMode: 'cover',
    marginTop: 10,
  },
});

export default TeacherSalaryPage;
