import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, Modal, TouchableOpacity, TouchableHighlight } from 'react-native';  // <-- Import TouchableOpacity
import { Card } from 'react-native-paper';

const TimetablePage = ({ route }) => {
  const { class_name } = route.params;
  const [timetables, setTimetables] = useState([]);
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
    const fetchTimetables = async () => {
      try {
        const response = await fetch(
          `https://5693-2405-201-c007-3923-3824-37f6-2706-44c.ngrok-free.app/get-timetables/?class_name=${class_name}`,
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const timetablesWithUpdatedData = data.timetables.map((timetable) => ({
          ...timetable,
          photo: timetable.photo, // The binary image data received from the server
        }));

        setTimetables(timetablesWithUpdatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetables:', error);
        setError('Failed to fetch timetables. Please try again later.');
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [class_name]);

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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Timetables</Text>

      {timetables.map((timetable) => (
        <Card key={timetable.id} style={{ marginBottom: 20 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'blue' }}>
              Occasion: {timetable.occasion}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              Posted on: {new Date(timetable.posted_on).toLocaleString()}
            </Text>
            <TouchableHighlight onPress={() => openModal(timetable.photo)}>
              <Image
                key={timetable.id}
                source={{ uri: `data:image/jpeg;base64,${timetable.photo}` }}
                style={{ width: '100%', height: 200, marginTop: 10, resizeMode: 'contain' }}
              />
            </TouchableHighlight>
            <Text style={{ marginTop: 10, marginBottom: 5 }}>Class: {timetable.class_name}</Text>
          </Card.Content>
        </Card>
      ))}

      {timetables.length === 0 && <Text>No timetables available for your class.</Text>}
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
export default TimetablePage;
