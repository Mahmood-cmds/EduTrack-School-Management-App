from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UsersData,Attendance,Exam,Message,ReminderMessage,Homework, Fees,Salary,Result,Assignments,Timetable
import json
from django.utils.timezone import now

class LoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phoneNumber', '').strip()

        print(f"Received Phone Number: {phone_number}")

        # Check if the phone number is in the UsersData table
        users_data = UsersData.objects.filter(phone_number=phone_number).first()
        if users_data:
            print("Valid phone number")
            switchable_roles =[]
            # Extract and print user details associated with the phone number
            users = users_data.users
            father_name = users_data.father_name
            mother_name = users_data.mother_name
            for user in users:
                switchable_roles.append(user['role'])
                print(user)
            print(switchable_roles)
            print(f"Users Data: {users}")
            print(users[0]["username"])
            return Response(
                {"role":switchable_roles[0],
                 "username":users[0]["username"],
                 "message": "Yes, logged in!",
                 "phoneNumber":phone_number,
                 "switchable_roles":switchable_roles,
                 "users":users,
                 "father_name": father_name,
                "mother_name": mother_name,
                },
                status=status.HTTP_200_OK,
            )

        # If no match is found
        print("Invalid phone number")
        return Response(
            {"message": "Invalid phone number"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

from django.http import JsonResponse
class AttendanceView(APIView):
    def get(self, request):
        # Student page: Retrieve attendance data for the logged-in student
        username = request.query_params.get('username', '').strip()

        try:
            attendance_data = Attendance.objects.filter(username=username).all()

            if not attendance_data:
                return Response({"error": "Attendance data not found"}, status=status.HTTP_404_NOT_FOUND)

            # Convert queryset to list of dictionaries
            attendance_list = list(attendance_data.values())

            # Create a dictionary with month_year as keys and attendance_data as values
            attendance_dict = {entry['month_year']: entry['attendance_data'] for entry in attendance_list}

            return Response({"attendance_data": attendance_dict}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Teacher page: Submit attendance data
        username = request.data.get('username', '').strip()
        month_year = request.data.get('month_year', '').strip()  # Month and year in format 'YYYY-MM'
        attendance_data = request.data.get('attendance_data', {})
        print(username,month_year,attendance_data)
        try:
            # Check if attendance data already exists for the specified month and year
            existing_attendance = Attendance.objects.filter(username=username, month_year=month_year).first()

            if existing_attendance:
                # Attendance data already exists, update it
                existing_attendance.attendance_data = attendance_data
                existing_attendance.save()
            else:
                # Attendance data doesn't exist, create a new entry
                new_attendance = Attendance(username=username, month_year=month_year, attendance_data=attendance_data)
                new_attendance.save()

            return Response({"message": "Attendance data saved successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FeesView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()

        try:
            fees_data = Fees.objects.filter(username=username).all()

            if not fees_data:
                return Response({"error": "Fees data not found"}, status=status.HTTP_404_NOT_FOUND)

            # Convert queryset to list of dictionaries
            fees_list = list(fees_data.values())

            # Create a dictionary with fee_id as keys and fees_data as values
            fees_dict = {entry['fee_id']: entry for entry in fees_list}

            # Filter entries where due_amount > 0
            due_entries = {fee_id: entry for fee_id, entry in fees_dict.items() if entry['due_amount'] > 0}

            # Remove due_entries from fees_dict
            for fee_id in due_entries:
                fees_dict.pop(fee_id, None)

            print(fees_dict)

            return JsonResponse({"fees_data": fees_dict, "due_entries": due_entries}, status=200)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from uuid import uuid4
from django.core.files.base import ContentFile
from datetime import datetime

class PostAssignmentView(APIView):
    def post(self, request):
        try:
            # Extract data from the request
            assignment_details = request.data.get('assignment_details')
            last_date_of_submission = request.data.get('last_date_of_submission')[:10]  # Extract date portion
            teacher_name = request.data.get('teacher_name')
            subject = request.data.get('subject')
            class_name = request.data.get('class_name')

            # Extract the binary data from the uploaded photo
            photo_data = request.FILES['photo'].read()
            print(last_date_of_submission)
            # Save the photo data directly to the database
            assignment = Assignments.objects.create(
                photo=ContentFile(photo_data, name=f"assignments/{uuid4()}.jpg"),
                assignment_details=assignment_details,
                last_date_of_submission=last_date_of_submission,
                teacher_name=teacher_name,
                subject=subject,
                class_name=class_name,
            )

            # Print saved assignment details
            print(f"Saved Assignment: {assignment}")

            return Response({"message": "Assignment posted successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.core.files.storage import default_storage
from base64 import b64encode
from os.path import join

class GetAssignmentView(APIView):
    def get(self, request):
        try:
            class_name = request.query_params.get('class_name', '')
            assignments = Assignments.objects.filter(class_name=class_name)

            assignments_data = []
            for assignment in assignments:
                # Construct the full file path using os.path.join
                print(type(assignment.photo))
                file_path_string = assignment.photo.decode('utf-8')

                print(file_path_string)
                filename = join(default_storage.location, str(file_path_string))

                # Open the file using the constructed path
                with open(filename, 'rb') as f:
                    photo_data = f.read()

                # Base64 encode the image data
                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None

                assignment_data = {
                    'assignment_id': assignment.assignment_id,
                    'photo': photo_base64,
                    'assignment_details': assignment.assignment_details,
                    'last_date_of_submission': assignment.last_date_of_submission,
                    'teacher_name': assignment.teacher_name,
                    'subject': assignment.subject,
                    'class_name': assignment.class_name,
                }
                assignments_data.append(assignment_data)

            return Response({"assignments": assignments_data}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class PostTimetableView(APIView):
    def post(self, request):
        try:
            # Extract data from the request
            occasion = request.data.get('occasion')
            class_name = request.data.get('class_name')  # Add this line

            # Extract the binary data from the uploaded photo
            photo_data = request.FILES['photo'].read()
            print(photo_data)
            print(occasion,class_name)
            # Save the photo data directly to the database
            timetable = Timetable.objects.create(
                photo=ContentFile(photo_data, name=f"timetables/{uuid4()}.jpg"),
                occasion=occasion,
                class_name=class_name,  # Add this line
            )

            # Print saved timetable details
            print(f"Saved Timetable: {timetable}")

            return Response({"message": "Timetable posted successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTimetableView(APIView):
    def get(self, request):
        try:
            class_name = request.query_params.get('class_name', '')
            timetables = Timetable.objects.filter(class_name=class_name)

            timetables_data = []
            for timetable in timetables:
                # Construct the full file path using os.path.join
                file_path_string = timetable.photo.name

                filename = join(default_storage.location, str(file_path_string))

                # Open the file using the constructed path
                with open(filename, 'rb') as f:
                    photo_data = f.read()

                # Base64 encode the image data
                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None
                timetable_data = {
                    'timetable_id': timetable.id,
                    'photo': photo_base64,
                    'occasion': timetable.occasion,
                    'class_name': timetable.class_name,
                    'posted_on': timetable.posted_at.isoformat(),  # Include the posted on time
                }
                timetables_data.append(timetable_data)
                

            return Response({"timetables": timetables_data}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PostResultView(APIView):
    def post(self, request):
        try:
            # Extract data from the request
            student_name = request.data.get('student_name')
            class_name = request.data.get('class_name')
            exam_name = request.data.get('exam_name')

            # Check if the result entry already exists for the student and exam
            existing_result = Result.objects.filter(student_name=student_name, class_name=class_name).first()


            # Extract the binary data from the uploaded photo
            photo_data = request.FILES['result_photo'].read()

            if existing_result:
                # Update the existing result entry
                existing_result.exam_name = request.data.get('exam_name', existing_result.exam_name)
                existing_result.result_photo = ContentFile(photo_data, name=f"results/photos/{uuid4()}.jpg")
                existing_result.remarks = request.data.get('remarks', existing_result.remarks)
                existing_result.save()
            else:
                # Save a new result entry
                result = Result.objects.create(
                    student_name=student_name,
                    class_name=class_name,
                    exam_name=exam_name,
                    result_photo=ContentFile(photo_data, name=f"results/photos/{uuid4()}.jpg"),
                    remarks=request.data.get('remarks', ''),
                )

                # Print saved result details
                print(f"Saved Result: {result}")

            return Response({"message": "Results posted successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class GetResultsView(APIView):
    def get(self, request):
        try:
            username = request.query_params.get('username', '')
            print(username)
            results_data = Result.objects.filter(student_name=username)

            if not results_data:
                print("not found Adat")
                return Response({"error": "Results data not found for the student"}, status=status.HTTP_404_NOT_FOUND)

            results_data_list = []
            for result in results_data:
                # Construct the full file path
                file_path_string = result.result_photo.name
                filename = join(default_storage.location, str(file_path_string))

                try:
                    # Open the file using the constructed path
                    with open(filename, 'rb') as f:
                        photo_data = f.read()

                    # Base64 encode the image data
                    photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None
                except Exception as file_error:
                    # Handle file operation errors
                    print(f"Error reading photo file: {file_error}")
                    photo_base64 = None

                result_data = {
                    'result_id': result.id,
                    'result_photo': photo_base64,
                    'exam_name': result.exam_name,
                    'remarks': result.remarks,
                    'created_at': result.created_at.isoformat(),
                }
                results_data_list.append(result_data)

            return Response({"results_data": results_data_list}, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle general exceptions
            print(f"Error fetching results: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PostExamView(APIView):
    def post(self, request):
        try:
            # Extract data from the request
            subject = request.data.get('subject')
            exam_name = request.data.get('exam_name')
            remarks = request.data.get('remarks', '')
            student_name = request.data.get('student_name')  # New field
            class_name = request.data.get('class_name')  # New field
            paper_files = request.FILES.getlist('paper_file_path')  # Retrieve multiple files
            print(subject,exam_name,remarks,student_name,class_name, paper_files)
            # Save each paper file data to the database
            for paper_file in paper_files:
                exam = Exam.objects.create(
                    subject=subject,
                    exam_name=exam_name,
                    paper_file_path=ContentFile(paper_file.read(), name=f"exam_papers/{uuid4()}.jpg"),
                    remarks=remarks,
                    student_name=student_name,  # New field
                    class_name=class_name  # New field
                )

                # Print saved exam details
                print(f"Saved Exam: {exam}")

            return Response({"message": "Exams posted successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from collections import defaultdict

class GetExamView(APIView):
    def get(self, request):
        try:
            username = request.query_params.get('username', '')

            exams = Exam.objects.filter(student_name=username)

            if not exams:
                return Response({"error": "Exam data not found"}, status=status.HTTP_404_NOT_FOUND)

            # Group exams by subject and exam name
            grouped_exams = defaultdict(list)
            for exam in exams:
                key = (exam.subject, exam.exam_name)
                grouped_exams[key].append(exam)

            exams_data_list = []
            for (subject, exam_name), exams_list in grouped_exams.items():
                paper_files = []
                for exam in exams_list:
                    # Construct the full file path
                    file_path_string = exam.paper_file_path.name
                    filename = join(default_storage.location, str(file_path_string))

                    # Open the file using the constructed path
                    with open(filename, 'rb') as f:
                        paper_data = f.read()

                    # Base64 encode the file data
                    paper_base64 = b64encode(paper_data).decode('utf-8') if paper_data else None

                    if paper_base64:
                        paper_files.append(paper_base64)
                exam_data = {
                    'subject': subject,
                    'exam_name': exam_name,
                    'paper_file_paths': paper_files,
                    'remarks': exams_list[0].remarks,  # Assuming remarks are the same for all exams of the same subject and exam name
                    'created_at': exams_list[0].created_at.isoformat(),  # Assuming created_at is the same for all exams of the same subject and exam name
                }
                exams_data_list.append(exam_data)

            return Response({"exams_data": exams_data_list}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClassStudentsView(APIView):
    def get(self, request, class_name):
        
        try:
            student_names = []
            students_data = []

            users_data = UsersData.objects.all()
            class_name = int(class_name)

            for user_data in users_data:
                
                for user in user_data.users:
                    
                    if user["role"] == "student" and user["class"] == class_name:
                        student_names.append(user["username"])
                        student_details = {
                            "username": user["username"],
                            "phone_number": user_data.phone_number,
                            "father_name": user_data.father_name,
                            "mother_name": user_data.mother_name,
                            "class_name": class_name,
                        }
                        students_data.append(student_details)

            return Response({"students": student_names,"students_data": students_data}, status=200)
        
        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=500)

class ClassTeachersView(APIView):
    def get(self, request):
        try:
            teacher_names = []
            teachers_data = []
            users_data = UsersData.objects.all()
            for user_data in users_data:
                for user in user_data.users:
                    if user["role"] == "teacher":
                        print(user)
                        teacher_names.append(user["username"])
                        teachers_details = {
                            "username": user["username"],
                            "phone_number": user_data.phone_number,
                            "father_name": user_data.father_name,
                            "mother_name": user_data.mother_name,
                            "class_name": user["class"],
                        }
                        teachers_data.append(teachers_details)
                print(teachers_data)
            return Response({"teachers": teacher_names, "teachers_data":teachers_data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
          

from datetime import datetime
class PostAttendanceView(APIView):
    def post(self, request):
        try:
            name = request.data.get('Name')
            role = request.data.get('role')
            class_name = request.data.get('class')
            selected_date = request.data.get('selectedDate')
            attendance_status = request.data.get('attendanceStatus')
            print(name,role,class_name, selected_date, attendance_status)
            # Extract year, month, and day from the selected date
            year_month_day = selected_date[:10] 
            year_month = year_month_day[:7]
            day = year_month_day[8:10]

            # Retrieve attendance data for the month_year
            try:
                attendance_obj = Attendance.objects.get(month_year=year_month, role=role, username=name,class_name =class_name)
            except Attendance.DoesNotExist:
                # If data for the month_year is not found, create a new object
                attendance_obj = Attendance(month_year=year_month, role=role, username=name, attendance_data={},class_name=class_name)
            
            # Update attendance status for the selected day
            attendance_data = attendance_obj.attendance_data
            attendance_data[str(day)] = str(attendance_status)  # Update attendance status for the day
            attendance_obj.attendance_data = attendance_data  # Assign updated data back to the object
            attendance_obj.save()  # Save the object to update or create the row in the database

            return Response({'message': 'Attendance submitted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class GetFeesDetails(APIView):
    def get(self, request, class_name):
        try:
            # Get current month and year
            current_month = datetime.now().month            
            current_year = datetime.now().year
            print(current_month,current_year)
            # Get students of the specified class
            class_students_response = ClassStudentsView().get(request, class_name)
            print(class_students_response)
            if class_students_response.status_code == status.HTTP_200_OK:
                class_students = class_students_response.data.get('students', [])
                print(class_students)
                # Get fees data for students of the specified class for the current month
                fees_data = Fees.objects.filter(username__in=class_students, date_of_payment__year=current_year, date_of_payment__month=current_month).values('username', 'due_amount','last_date_of_payment')             
                print(list(fees_data))
                return Response(list(fees_data), status=status.HTTP_200_OK)
            else:
                return class_students_response
        
        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetSalary(APIView):
    def get(self, request):
        try:
            username = request.query_params.get('username', '')
            salaries = Salary.objects.filter(teacher_name=username)

            salary_list = []
            for salary in salaries:
                file_path_string = salary.receipt_image.name

                filename = join(default_storage.location, str(file_path_string))

                with open(filename, 'rb') as f:
                    photo_data = f.read()

                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None

                salary_dict = {
                    'id': salary.id,
                    'teacher_name': salary.teacher_name,
                    'month': salary.month,
                    'date_of_payment': salary.date_of_payment,
                    'paid_amount': salary.paid_amount,
                    'due': salary.due,
                    'time_of_payment': salary.time_of_payment.strftime("%Y-%m-%d %H:%M:%S") if salary.time_of_payment else None,
                    'class_name': salary.class_name,
                    'phone_number': salary.phone_number,
                    'receipt_image': photo_base64
                }
                salary_list.append(salary_dict)

            return JsonResponse({"salaries_data": salary_list}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
           
class PostSalary(APIView):
    def post(self, request):
        try:
            # Extract data from the request
            teacher_name = request.data.get('teacher_name')
            month = request.data.get('month')
            date_of_payment = request.data.get('date_of_payment')
            paid_amount = request.data.get('paid_amount')
            due = request.data.get('due')
            class_name = request.data.get('class_name')
            phone_number = request.data.get('phone_number')
            photo_data = request.FILES['receipt_image'].read()  # Extract the binary data from the uploaded photo

            # Save the photo data directly to the database
            salary = Salary.objects.create(
                receipt_image=ContentFile(photo_data, name=f"salary_receipts/{uuid4()}.jpg"),  # Save the receipt photo
                teacher_name=teacher_name,
                month=month,
                date_of_payment=date_of_payment,
                paid_amount=paid_amount,
                due=due,
                time_of_payment=now(),
                class_name=class_name,
                phone_number=phone_number,
            )

            # Print saved salary details
            print(f"Saved Salary: {salary}")

            return Response({"message": "Salary posted successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.db.models import Count

class AllStudentsAttendanceView(APIView):
    def get(self, request, class_name):
        try:
            students_attendance = []
            todays_attendance = []
            today = datetime.now().date()
            year_month = today.strftime('%Y-%m')
            
            print(year_month)
            todays_attendance_data = Attendance.objects.filter(class_name=class_name, month_year=year_month, role="student")
            for data in todays_attendance_data:
                if str(today.day) in data.attendance_data:
                    today_status = data.attendance_data[str(today.day)]
                    print("todays status",today_status)
                    if today_status is not None:
                        today_status = today_status.strip().lower()  # Convert to lowercase and remove leading/trailing whitespaces
                        
                        # Append student's attendance status for today
                        todays_attendance.append({
                            'student_name': data.username,
                            'attendance_status': today_status.capitalize()  # Capitalize the status (e.g., 'Present')
                        })
                    else:
                        # If no data present for today, indicate it
                        todays_attendance.append({
                            'student_name': data.username,
                            'attendance_status': 'No data present for today'
                        })
            print(todays_attendance)
            # Filter attendance data for all students in the specified class
            attendance_data = Attendance.objects.filter(class_name=class_name,role = "student")
            
            for student_attendance in attendance_data:
                student_name = student_attendance.username
                month_year = student_attendance.month_year
                attendance_dict = student_attendance.attendance_data
                print(student_name,month_year,attendance_dict,today.day)
            
                # Calculate the number of days present and absent
                
                days_present = sum(1 for status in attendance_dict.values() if status.strip().lower() == 'present')
                days_absent = sum(1 for status in attendance_dict.values() if status.strip().lower() == 'absent')
                print(days_present,days_absent)
                students_attendance.append({
                    'student_name': student_name,
                    'month_year': month_year,
                    'days_present': days_present,
                    'days_absent': days_absent
                })

            return Response({'students_attendance': students_attendance, 'todays_attendance':todays_attendance}, status=200)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        

class AllTeachersAttendanceView(APIView):
    def get(self, request,class_name):
        try:
            print(class_name)
            # Fetch all teachers' attendance data
            attendance_data = Attendance.objects.filter(role="teacher",class_name = class_name)
            serialized_data = []

            for teacher_attendance in attendance_data:
                teacher_name = teacher_attendance.username
                month_year = teacher_attendance.month_year
                attendance_dict = teacher_attendance.attendance_data
                teacher_class = teacher_attendance.class_name
                print(teacher_name,month_year,attendance_dict,teacher_class)
                # Filter attendance data by class name
                days_present = sum(1 for status in attendance_dict.values() if status.strip().lower() == 'present')
                days_absent = sum(1 for status in attendance_dict.values() if status.strip().lower() == 'absent')
                print(days_present,days_absent)
                serialized_data.append({
                        'teacher_name': teacher_name,
                        'month_year': month_year,
                        'days_present': days_present,
                        'days_absent': days_absent
                    })

            return Response({"attendance": serialized_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetStudentFeesDetails(APIView):
    def get(self, request, username):
        try:
            fees_data = Fees.objects.filter(username=username)
            if fees_data.exists():
                serialized_data = []
                for fee_instance in fees_data:
                    serialized_fee = {
                        'username': fee_instance.username,
                        'date_of_payment': fee_instance.date_of_payment,
                        'last_date_of_payment': fee_instance.last_date_of_payment,
                        'receipt_number': fee_instance.receipt_number,
                        'month': fee_instance.month,
                        'fees_paid_amount': fee_instance.fees_paid_amount,
                        'due_amount': fee_instance.due_amount,
                        'fee_categories': fee_instance.fee_categories
                        # Add other fields as needed
                    }
                    serialized_data.append(serialized_fee)
                return Response(serialized_data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No fee details found for the student"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class SaveMessageView(APIView):
    def post(self, request):
        try:
            message_text = request.data.get('message')
            photo = request.data.get('photo')
            created_by =  request.data.get('username', '')
            print(created_by)# Assuming you are using Django authentication

            # Save the message
            message = Message.objects.create(message=message_text, photo=photo, created_by=created_by)
            
            return Response({"message_id": message.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error saving message: {e}")
            return Response({"error": "Failed to save message"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetMessagesView(APIView):
    def get(self, request):
        try:
            # Fetch latest messages
            latest_messages = Message.objects.all()  # Fetching the latest 10 messages
            
            messages_data = []
            for message in latest_messages:
                print(message)
                message_data = {
                    'id': message.id,
                    'message': message.message,
                    'created_at': message.created_at.isoformat(),
                    'created_by': message.created_by,  # Assuming User model has a username field
                    # Add other message fields as needed
                }
                messages_data.append(message_data)
                
            return Response({"messages": messages_data}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error fetching messages: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetAllAssignmentsView(APIView):
    def get(self, request):
        try:
            assignments = Assignments.objects.all()
            assignments_data = []
            for assignment in assignments:
                file_path_string = assignment.photo.decode('utf-8')

                print(file_path_string)
                filename = join(default_storage.location, str(file_path_string))

                # Open the file using the constructed path
                with open(filename, 'rb') as f:
                    photo_data = f.read()

                # Base64 encode the image data
                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None


                if assignment.photo:
                    photo_url = request.build_absolute_uri(default_storage.url(assignment.photo.name))
                assignment_data = {
                    'assignment_id': assignment.assignment_id,
                    'photo': photo_url,
                    'assignment_details': assignment.assignment_details,
                    'last_date_of_submission': assignment.last_date_of_submission,
                    'teacher_name': assignment.teacher_name,
                    'subject': assignment.subject,
                    'class_name': assignment.class_name,
                }
                assignments_data.append(assignment_data)
            return Response({"assignments": assignments_data}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetAllTimetablesView(APIView):
    def get(self, request):
        try:
            timetables = Timetable.objects.all()
            timetables_data = []
            for timetable in timetables:
                # Construct the full file path using os.path.join
                file_path_string = timetable.photo.name

                filename = join(default_storage.location, str(file_path_string))

                # Open the file using the constructed path
                with open(filename, 'rb') as f:
                    photo_data = f.read()

                # Base64 encode the image data
                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None
                timetable_data = {
                    'timetable_id': timetable.id,
                    'photo': photo_base64,
                    'occasion': timetable.occasion,
                    'class_name': timetable.class_name,
                    'posted_on': timetable.posted_at.isoformat(),  # Include the posted on time
                }
                timetables_data.append(timetable_data)
                

            return Response({"timetables": timetables_data}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SendReminderMessage(APIView):
    def post(self, request):
        try:
            data = request.data
            print(data)
            reminder_message = ReminderMessage.objects.create(
                class_name=data['class'],
                username=data['username'],
                father_name=data['father_name'],
                mother_name=data['mother_name'],
                phone_number=data['phone_number'],
                sent_by=data['sent_by'],
                message=data['message']
            )
            reminder_message.save()
            return Response('Reminder message sent successfully', status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetReminderMessages(APIView):
    def get(self, request):
        try:
            reminder_messages = ReminderMessage.objects.all()
            messages_data = []
            for message in reminder_messages:
                print(message)
                message_data = {
                    'id': message.id,
                    'class_name': message.class_name,
                    'username': message.username,
                    'father_name': message.father_name,
                    'mother_name': message.mother_name,
                    'phone_number': message.phone_number,
                    'sent_by': message.sent_by,
                    'reminder_message': message.message,
                    'posted_on':message.sent_datetime
                }
                messages_data.append(message_data)
            print(messages_data)
            return Response({"reminder_data":messages_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
class HomeworkView(APIView):
    def post(self, request):
        if request.method == 'POST':
            class_name = request.data.get('class_name')
            teacher_name = request.data.get('teacher_name')
            homework_text = request.data.get('text', '')
            homework_photo = request.FILES.get('photo')
            print(class_name,teacher_name,homework_text)
            if not class_name or not teacher_name:
                return Response({'error': 'Class name and teacher name are required'}, status=400)

            # Save homework details to the database
            try:
                homework = Homework.objects.create(
                    class_name=class_name,
                    teacher_name=teacher_name,
                    text=homework_text,
                    photo=homework_photo
                )
                return Response({'message': 'Homework posted successfully', 'homework_id': homework.id}, status=201)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            return Response({'error': 'Method not allowed'}, status=405)
        
class GetAllHomeworkView(APIView):
    def get(self, request):
        try:
            homework = Homework.objects.all()
            homework_data = []
            for hw in homework:
                file_path_string = hw.photo.name
                filename = join(default_storage.location, str(file_path_string))
                with open(filename, 'rb') as f:
                    photo_data = f.read()
                photo_base64 = b64encode(photo_data).decode('utf-8') if photo_data else None
                hw_data = {
                    'homework_id': hw.id,
                    'photo': photo_base64,
                    'class_name': hw.class_name,
                    'teacher_name': hw.teacher_name,
                    'text': hw.text,
                    'posted_on': hw.posted_on.isoformat(),
                }
                homework_data.append(hw_data)
            return Response({"homework": homework_data}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.http import JsonResponse
from django.views import View
from .models import ChatMessage

class SendMessageView(APIView):
    def post(self, request):
        if request.method == 'POST':
            sender_name = request.data.get('sender_name')
            message = request.data.get('message')
            class_name = request.data.get('class_name')
            role = request.data.get('role')
            chat_type = request.data.get('chat_type')
            print(sender_name,message,class_name,role,chat_type)
            # Save message to database
            ChatMessage.objects.create(
                sender_name=sender_name,
                message=message,
                class_name=class_name,
                role=role,
                chat_type=chat_type,
                timestamp=datetime.now()
            )
            return JsonResponse({'success': True})
        else:
            return Response({'error': 'Method not allowed'}, status=405)
class FetchMessageHistoryView(View):
    def get(self, request, class_name, chat_type):
        print(class_name,chat_type)
        try:
            # Fetch message history from database
            messages = ChatMessage.objects.filter(
                class_name=class_name,
                chat_type=chat_type
            ).order_by('-timestamp')[:50]

            serialized_messages = [
                {
                    'id': msg.id,
                    'sender_name': msg.sender_name,
                    'message': msg.message,
                    'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                } 
                for msg in messages
            ]
            return JsonResponse(serialized_messages, safe=False)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": "Internal Server Error"}, status=500)
        

from django.http import JsonResponse
from django.views import View
import openai,requests
class ChatGPTView(APIView):
    def post(self, request):
        # Retrieve the question from the request data
        question = request.data.get('question', '')
        print(question)
        
        # Define the Gemini Pro AI API endpoint and headers
        url = "https://gemini-pro-ai.p.rapidapi.com/"
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": "733cabeaeemsh593af10d6c66349p12c2b0jsn43d40511b70e",
            "X-RapidAPI-Host": "gemini-pro-ai.p.rapidapi.com"
        }

        # Define the payload with the question
        payload = {
            "contents": [{
                "parts": [{
                    "text": question
                }]
            }]
        }

        try:
            # Send a POST request to the Gemini Pro AI API
            response = requests.post(url, json=payload, headers=headers)
            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Parse the JSON response
                data = response.json()
                # Extract and return the answer from the response
                answer = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                print(answer)
                return Response({"answer": answer})
            else:
                # Return an error response if the request was not successful
                return Response({"error": "Failed to get response from Gemini Pro AI API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # Handle any exceptions that may occur
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)