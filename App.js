import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import StudentHome from './src/screens/student/studentHome';
import TeacherHome from './src/screens/teacher/teacherHome';
import ManagementHome from './src/screens/management/ManagementHome';
import UsersList from './src/screens/UsersList';
import AttendancePage from './src/screens/student/AttendancePage'; // Add import for each page
import FeesPage from './src/screens/student/FeesPage';
import AssignmentsPage from './src/screens/student/AssignmentsPage';
import ExamsPage from './src/screens/student/ExamsPage';
import ChatPage from './src/screens/student/ChatPage';
import StudentHomeworkPage from './src/screens/student/StudentHomeworkPage';
import TimetablePage from './src/screens/student/TimetablePage';
import ResultsPage from './src/screens/student/ResultsPage';
import UstaadAIPage from './src/screens/student/UstaadAIPage';
import TeacherAttendancePage from './src/screens/teacher/TeacherAttendancePage';
import TeacherAssignmentsPage from './src/screens/teacher/TeacherAssignmentsPage';
import TeacherTimetablePage from './src/screens/teacher/TeacherTimetablePage';
import TeacherResultsPage from './src/screens/teacher/TeacherResultsPage';
import TeacherChatPage from './src/screens/teacher/TeacherChatPage';
import TeacherExamsPage from './src/screens/teacher/TeacherExamsPage';
import TeacherFeesPage from './src/screens/teacher/TeacherFeesPage';
import T_AttendancePage from './src/screens/teacher/T_AttendancePage';
import TeacherSalaryPage from './src/screens/teacher/TeacherSalaryPage';
import HomeworkPostPage from './src/screens/teacher/HomeworkPostPage';
import ManagementAttendancePage from './src/screens/management/ManagementAttendancePage';
import StudentsAttendancePage from './src/screens/management/StudentsAttendancePage';
import TeachsAttendancePage from './src/screens/management/TeachsAttendancePage';
import SalariesPage from './src/screens/management/SalariesPage';
import StudentFeesPage from './src/screens/management/StudentFeesPage';
import StudentResultsPage from './src/screens/management/StudentResultsPage';
import ManagementTimetablePage from './src/screens/management/ManagementTimetablePage';
import MessagePage from './src/screens/management/MessagePage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="studentHome" component={StudentHome} />
          <Stack.Screen name="teacherHome" component={TeacherHome} />
          <Stack.Screen name="ManagementHome" component={ManagementHome} />
          <Stack.Screen name="UsersList" component={UsersList} />
          <Stack.Screen name="AttendancePage" component={AttendancePage} />
          <Stack.Screen name="FeesPage" component={FeesPage} />
          <Stack.Screen name="ChatPage" component={ChatPage} />
          <Stack.Screen name="UstaadAIPage" component={UstaadAIPage} />
          <Stack.Screen name="StudentHomeworkPage" component={StudentHomeworkPage} />
          <Stack.Screen name="AssignmentsPage" component={AssignmentsPage} />
          <Stack.Screen name="ExamsPage" component={ExamsPage} />
          <Stack.Screen name="TimetablePage" component={TimetablePage} />
          <Stack.Screen name="ResultsPage" component={ResultsPage} />
          <Stack.Screen name="TeacherAttendancePage" component={TeacherAttendancePage} />
          <Stack.Screen name="TeacherAssignmentsPage" component={TeacherAssignmentsPage} /> 
          <Stack.Screen name="TeacherTimetablePage" component={TeacherTimetablePage} /> 
          <Stack.Screen name="TeacherResultsPage" component={TeacherResultsPage} /> 
          <Stack.Screen name="TeacherExamsPage" component={TeacherExamsPage} /> 
          <Stack.Screen name="TeacherFeesPage" component={TeacherFeesPage} /> 
          <Stack.Screen name="TeacherChatPage" component={TeacherChatPage} /> 
          <Stack.Screen name="T_AttendancePage" component={T_AttendancePage} /> 
          <Stack.Screen name="TeacherSalaryPage" component={TeacherSalaryPage} /> 
          <Stack.Screen name="ManagementAttendancePage" component={ManagementAttendancePage} /> 
          <Stack.Screen name="StudentsAttendancePage" component={StudentsAttendancePage} /> 
          <Stack.Screen name="TeachsAttendancePage" component={TeachsAttendancePage} /> 
          <Stack.Screen name="SalariesPage" component={SalariesPage} /> 
          <Stack.Screen name="HomeworkPostPage" component={HomeworkPostPage} /> 
          <Stack.Screen name="StudentFeesPage" component={StudentFeesPage} /> 
          <Stack.Screen name="StudentResultsPage" component={StudentResultsPage} /> 
          <Stack.Screen name="ManagementTimetablePage" component={ManagementTimetablePage} /> 
          <Stack.Screen name="MessagePage" component={MessagePage} /> 

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
