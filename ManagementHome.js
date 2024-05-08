import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ManagementHome = ({ route }) => {
  const { username, role, users } = route.params;
  console.log(username, role, users);
  const [latestData, setLatestData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      const messagesResponse = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/api/get-messages/');
      if (!messagesResponse.ok) {
        throw new Error('Failed to fetch latest messages');
      }
      const messagesData = await messagesResponse.json();

      const timetablesResponse = await fetch('https://97eb-2405-201-c007-3923-aced-a73e-1720-fd36.ngrok-free.app/get-all-timetables/');
      if (!timetablesResponse.ok) {
        throw new Error('Failed to fetch latest timetables');
      }
      const timetablesData = await timetablesResponse.json();

      // Merge messages and timetables into a single array
      const mergedData = [...messagesData.messages, ...timetablesData.timetables];

      // Sort merged data by timestamp from newest to oldest
      mergedData.sort((a, b) => {
        const timestampA = new Date(a.created_at || a.posted_on);
        const timestampB = new Date(b.created_at || b.posted_on);
        return timestampB - timestampA;
      });
      setLatestData(mergedData);
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLatestData();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchLatestData().then(() => setRefreshing(false));
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)
  
    return `${date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${hours}:${minutes < 10 ? '0' + minutes : minutes} ${amPM}`;
  };

  const navigateToPage = (page) => {
    navigation.navigate(page, { username: username, role: role, users: users });
  };

  const features = [
    { icon: 'md-calendar', label: 'Attendance', page: 'ManagementAttendancePage' },
    { icon: 'md-wallet', label: 'Salary', page: 'SalariesPage' },
    { icon: 'md-cash', label: 'Fees', page: 'StudentFeesPage' },
    { icon: 'md-trophy', label: 'Results', page: 'StudentResultsPage' },
    { icon: 'md-time', label: 'Timetable', page: 'ManagementTimetablePage' },
    { icon: 'md-mail', label: 'Messages', page: 'MessagePage' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#9Bd35A', '#689F38']}
        />
      }
    >
      <Text style={styles.username}>Welcome, {username}!</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigateToPage(feature.page)}
          >
            <Icon name={feature.icon} size={30} color="#000" />
            <Text style={styles.buttonLabel}>{feature.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Text style={styles.sectionHeader}>Latest Messages</Text>
        <View style={styles.separator}></View>
        {latestData.map((item, index) => (
          <View key={index} style={styles.item}>
            {item.message && (
              <>
                <Text style={styles.itemText}>{item.message}</Text>
                <Text style={styles.itemText}>Created By: {item.created_by}</Text>
                <Text style={styles.itemText}>Created On: {formatDate(item.created_at)}</Text>
                {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
              </>
            )}
            {item.occasion && (
              <>
                <Text style={styles.itemText}>Occasion: {item.occasion}</Text>
                <Text style={styles.itemText}>Posted At: {formatDate(item.posted_on)}</Text>
                <Text style={styles.itemText}>Class Name: {item.class_name}</Text>
                <Image source={{ uri: `data:image/jpeg;base64,${item.photo}` }} style={styles.image} />
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0', // Background color
  },
  username: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonLabel: {
    marginTop: 5,
  },
  dataContainer: {
    width: '100%',
  },
  item: {
    backgroundColor: '#ffffff', // Background color of each data item
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2, // Shadow effect
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200, // Adjust the height as needed
    resizeMode: 'cover', // Image resizing mode
    borderRadius: 10,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop:30,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
});

export default ManagementHome;
