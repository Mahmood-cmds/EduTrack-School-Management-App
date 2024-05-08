import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const FeesPage = ({ route }) => {
  const { username } = route.params;
  const [feesData, setFeesData] = useState([]);
  const [dueEntries, setDueEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://5693-2405-201-c007-3923-3824-37f6-2706-44c.ngrok-free.app/fees/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setFeesData(Object.values(data.fees_data).sort((a, b) => new Date(b.date_of_payment) - new Date(a.date_of_payment)));

        // Correctly access due_entries within data.fees_data
        const dueEntries = Object.values(data.due_entries || []).filter((entry) => entry.due_amount > 0);
        setDueEntries(dueEntries);
      } catch (error) {
        console.error('Error fetching fees data:', error);
      }
    };

    fetchData();
  }, [username]);

  const handlePayOnline = () => {
    // Implement the logic to handle online payment
    console.log('Handle Pay Online');
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Top Container - Due Payments */}
      <Card style={{ marginBottom: 20 }}>
        <Card.Content>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{username}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Due Payments</Text>
          {dueEntries.map((dueEntry) => (
            <View key={dueEntry.fee_id} style={{ marginBottom: 15 }}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Due Payment: {dueEntry.due_amount}</Text>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Last Date of Payment: {dueEntry.last_date_of_payment}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Month: {dueEntry.month}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Categories:</Text>
              <View style={{ marginLeft: 10 }}>
                {Object.entries(dueEntry.fee_categories).map(([category, amount], index) => (
                  <Text key={index}>{`${index + 1}. ${category} = Rs. ${amount}`}</Text>
                ))}
              </View>
            </View>
          ))}
          {dueEntries.length === 0 && <Text>No due payments</Text>}
          <TouchableOpacity onPress={handlePayOnline} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignSelf: 'flex-end' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Pay Online</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Bottom Container - Payments Details */}
      <Card>
        <Card.Content>
          {feesData.map((fee, index) => (
            <View key={fee.fee_id} style={{ marginBottom: 20,borderBottomWidth: index < feesData.length - 1 ? 1 : 0, paddingBottom: 20  }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Payment Details {index + 1}</Text>
              <Text>Fee ID: {fee.fee_id}</Text>
              <Text>Month: {fee.month}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Categories:</Text>
              <View style={{ marginLeft: 10 }}>
                {Object.entries(fee.fee_categories).map(([category, amount], index) => (
                  <Text key={index}>{`${index + 1}. ${category} = Rs. ${amount}`}</Text>
                ))}
              </View>
              <Text>Amount Paid: {fee.fees_paid_amount}</Text>
              <Text style={{ color: fee.due_amount === 0 ? 'green' : 'black', fontWeight: 'bold', marginTop: 5 }}>
                {fee.due_amount === 0 ? 'Status: Paid' : 'Status: Due'}
              </Text>
              <Text>Paid Date: {fee.date_of_payment || 'Not Paid'}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default FeesPage;
