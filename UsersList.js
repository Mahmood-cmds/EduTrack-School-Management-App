import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UsersList = ({ route }) => {
  const { users, currentRole, currentUsername } = route.params;
  const navigation = useNavigation();

  const handleUserClick = (user) => {
    navigation.navigate(`${user.role}Home`, {
      phoneNumber: user.phoneNumber,
      role: user.role,
      username: user.username,
      users,
      switchableRoles: users.map((u) => u.role),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Users List</Text>
      {users.map((user, index) => (
        <TouchableOpacity key={index} onPress={() => handleUserClick(user)}>
          <View style={styles.userContainer}>
            <Text>{`Username: ${user.username}, Role: ${user.role}`}</Text>
            <Text style={styles.switchButton}>{`Switch to ${user.username}`}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  switchButton: {
    color: 'blue',
    marginTop: 5,
  },
});

export default UsersList;
