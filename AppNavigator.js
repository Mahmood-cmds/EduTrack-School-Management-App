// AppNavigator.js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/LoginScreen';

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login',
    },
  },
  // Add more screens as needed
});

export default createAppContainer(AppNavigator);
