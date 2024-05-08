from django.urls import path
from .views import LoginView,AttendanceView,ChatGPTView,GetSalary,SendMessageView,FetchMessageHistoryView,HomeworkView,GetAllHomeworkView,GetReminderMessages,GetAllAssignmentsView,SendReminderMessage,GetAllTimetablesView,GetMessagesView,SaveMessageView,ClassTeachersView,PostSalary, GetStudentFeesDetails,FeesView,AllTeachersAttendanceView,PostAttendanceView,AllStudentsAttendanceView,GetResultsView, GetFeesDetails,PostAssignmentView,ClassStudentsView, GetAssignmentView,PostTimetableView,GetTimetableView,PostResultView,GetExamView,PostExamView

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('attendance/', AttendanceView.as_view(), name='attendance'),
    path('fees/', FeesView.as_view(), name='fees'),
    path('post-assignment/', PostAssignmentView.as_view(), name='post_assignment'),
    path('get-assignments/', GetAssignmentView.as_view(), name='get-assignments'),
    path('post-timetable/', PostTimetableView.as_view(), name='post_timetable'), 
     path('get-timetables/', GetTimetableView.as_view(), name='get-timetables'),
     path('post-result/', PostResultView.as_view(), name='post_result'),
     path('get-results/', GetResultsView.as_view(), name='get_results'),
     path('post-exams/', PostExamView.as_view(), name='post_exams'),
     path('get-exams/', GetExamView.as_view(), name='get_exams'),
     path('api/students/<str:class_name>/', ClassStudentsView.as_view(), name='class_students'),
     path('api/teachers/', ClassTeachersView.as_view(), name='class_teachers'),
     path('get-fees-details/<str:class_name>/', GetFeesDetails.as_view(), name='get_fees_details'),
    path('post-attendance/', PostAttendanceView.as_view(), name='post_attendance'),
    path('get-salary/', GetSalary.as_view(), name='get_salary'),
    path('post-salary/', PostSalary.as_view(), name='post_salary'),
     path('api/all-students-attendance/<str:class_name>/', AllStudentsAttendanceView.as_view(), name='all_students_attendance'),
     path('api/all-teachers-attendance/<str:class_name>/', AllTeachersAttendanceView.as_view(), name='all_teachers_attendance'),
    path('get-student-fees-details/<str:username>/', GetStudentFeesDetails.as_view(), name='get_student_fees_details'),
    path('api/save-message/', SaveMessageView.as_view(), name='save_message'),
    path('api/get-messages/', GetMessagesView.as_view(), name='get_messages'),
    path('get-all-assignments/', GetAllAssignmentsView.as_view(), name='get_all_assignments'),
    path('get-all-timetables/', GetAllTimetablesView.as_view(), name='get_all_timetables'),
    path('api/send-reminder-message/', SendReminderMessage.as_view(), name='send_reminder_message'),
     path('api/post-homework/', HomeworkView.as_view(), name='post_homework'),
     path('get-all-homework/', GetAllHomeworkView.as_view(), name='get_all_homework'),
     path('api/get-reminder-messages/', GetReminderMessages.as_view(), name='get_reminder_messages'),
      path('send-message/', SendMessageView.as_view(), name='send_message'),
    path('fetch-message-history/<str:class_name>/<str:chat_type>/', FetchMessageHistoryView.as_view(), name='fetch_message_history'),
    path('chat/', ChatGPTView.as_view(), name='chat_gpt')
    ]

