import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ChatPage = ({ route }) => {
  const { username, role, users } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const student = users.find(user => user.username === username);

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  const fetchMessageHistory = async () => {
    try {
      const class_name = String(student.class); 
      const chat_type = "group";
      const response = await fetch(`https://b7b1-2405-201-c007-3923-1514-8e5d-e869-8024.ngrok-free.app/fetch-message-history/${class_name}/${chat_type}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await fetch('https://b7b1-2405-201-c007-3923-1514-8e5d-e869-8024.ngrok-free.app/send-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_name: student.username,
          message,
          class_name: String(student.class),
          role: 'student',
          chat_type: 'group',
        }),
      });
      setMessage('');
      fetchMessageHistory();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return formattedDate;
  };

  const isCurrentUser = (sender) => {
    return sender === student.username;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Chat Page</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            isCurrentUser(item.sender_name) ? styles.currentUserMessage : styles.otherUserMessage
          ]}>
            <Text style={styles.senderName}>{item.sender_name}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.messageDetails}>
              <Text style={styles.timestamp}>{formatDateTime(item.timestamp)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Light green
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA', // Light gray
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  messageDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timestamp: {
    color: '#777',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatPage;
