// ResultsPage.js

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator,Modal,TouchableOpacity, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-paper';

const ResultsPage = ({ route }) => {
  const { username } = route.params;
  const [resultsData, setResultsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://5693-2405-201-c007-3923-3824-37f6-2706-44c.ngrok-free.app/get-results/?username=${username}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const resultsWithUpdatedData = data.results_data.map((result) => ({
          ...result,
          result_photo: result.result_photo, // The binary image data received from the server
        }));

        setResultsData(resultsWithUpdatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Failed to fetch results. Please try again later.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [username]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Results</Text>

      {resultsData.map((result) => (
        <Card key={result.id} style={{ marginBottom: 20 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'blue' }}>
              Exam: {result.exam_name}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              Published on: {new Date(result.created_at).toLocaleString()}
            </Text>
            <TouchableHighlight onPress={() => openModal(result.result_photo)}>
              <Image
                key={result.id}
                source={{ uri: `data:image/jpeg;base64,${result.result_photo}` }}
                style={{ width: '100%', height: 200, marginTop: 10, resizeMode: 'contain' }}
              />
            </TouchableHighlight>
            <Text style={{ marginTop: 10, marginBottom: 5 }}>Remarks: {result.remarks}</Text>
          </Card.Content>
        </Card>
      ))}

      {resultsData.length === 0 && <Text>No results available for {username}.</Text>}
    {/* Modal for displaying the full-screen image */}
    <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
          <TouchableHighlight onPress={closeModal}>
            <Text style={{ color: 'blue', marginTop: 20 }}>Close</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    </ScrollView>
  );
};


export default ResultsPage;
