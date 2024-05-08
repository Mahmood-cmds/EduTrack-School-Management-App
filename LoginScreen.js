// // LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

// const LoginScreen = ({ navigation }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     // Replace the handleLogin function
//     const handleLogin = async () => {
//         try {
//             const response = await fetch('https://ab46-2409-408c-1dcf-3912-950f-3d52-77b7-5d4.ngrok.io/api/login/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username,
//                     password,
//                 }),
//             });

//             const data = await response.json();

//             if (data.message === 'Yes, logged in!') {
//                 console.log("Logged in")
//                 // Navigate to the next screen upon successful login
//                 navigation.navigate('Home');
//             } else {
//                 // Handle invalid credentials
//                 alert('Invalid credentials. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error during login:', error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text>Login</Text>
//             <TextInput
//                 placeholder="Username"
//                 onChangeText={(text) => setUsername(text)}
//                 value={username}
//             />
//             <TextInput
//                 placeholder="Password"
//                 secureTextEntry
//                 onChangeText={(text) => setPassword(text)}
//                 value={password}
//             />
//             <Button title="Login" onPress={handleLogin} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default LoginScreen;


import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://3293-2405-201-c007-3923-952-ace6-73e-6950.ngrok-free.app/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                }),
            });

            const data = await response.json();

            if (data.message === 'Yes, logged in!') {
                console.log(data.role, 'Logged in');
                // Navigate to the home page based on the current role
                navigation.navigate(`${data.role}Home`, {
                    username:data.username,
                    phoneNumber: data.phoneNumber,
                    role: data.role,
                    switchableRoles: data.switchable_roles,
                    users:data.users
                });
            } else {
                // Handle invalid credentials
                alert('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <Background>
            <Logo />
            <Text style={styles.headerText}>Welcome to EduTrack</Text>
            <Text style={styles.headerText}>LOG IN</Text>
            <TextInput
                label="Phone Number"
                placeholder="Enter your phone number"
                returnKeyType="done"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />

            <Button mode="contained" onPress={handleLogin}>
                Login
            </Button>
        </Background>
    );
};
const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default LoginScreen;
