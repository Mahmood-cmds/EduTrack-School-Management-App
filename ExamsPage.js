import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, Modal, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-paper';

const ExamsPage = ({ route }) => {
  const { username } = route.params;
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const openModal = (images) => {
    setSelectedImages(images);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImages([]);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`https://5693-2405-201-c007-3923-3824-37f6-2706-44c.ngrok-free.app/get-exams/?username=${username}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        setExamsData(data.exams_data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setError('Failed to fetch exams. Please try again later.');
        setLoading(false);
      }
    };

    fetchExams();
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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Exams</Text>

      {examsData.map((examGroup, index) => (
        <Card key={index} style={{ marginBottom: 20 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'blue' }}>
              Subject: {examGroup.subject}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              Exam Name: {examGroup.exam_name}
            </Text>
            <TouchableHighlight onPress={() => openModal(examGroup.paper_file_paths)}>
              <Text style={{ color: 'blue', marginTop: 10 }}>View Exam Papers</Text>
            </TouchableHighlight>
          </Card.Content>
        </Card>
      ))}

      {/* Modal for displaying the full-screen image */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ScrollView>
          {selectedImages.map((image, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${image}` }}
                style={{ width: '100%', height: 300, resizeMode: 'contain' }}
              />
            </View>
          ))}
        </ScrollView>
        <TouchableHighlight onPress={closeModal}>
          <Text style={{ color: 'blue', marginTop: 20 }}>Close</Text>
        </TouchableHighlight>
      </Modal>
    </ScrollView>
  );
};

export default ExamsPage;
