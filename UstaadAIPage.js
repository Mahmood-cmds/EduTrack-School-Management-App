import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UstaadAIPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askQuestion = async () => {
    try {
      const response = await fetch('https://9269-2405-201-c007-3923-a8d0-2a7e-e912-7b10.ngrok-free.app/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ask Ustaad AI</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask your question..."
        multiline
      />
      <Button title="Ask" onPress={askQuestion} />
      {answer ? (
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>Answer:</Text>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      ) : null}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  answerContainer: {
    marginTop: 20,
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
  },
});

export default UstaadAIPage;
