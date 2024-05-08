from django.db import models

class UsersData(models.Model):
    id = models.AutoField(primary_key=True)
    phone_number = models.CharField(max_length=15, unique=True)
    users = models.JSONField()
    father_name = models.CharField(max_length=255, null=True, blank=True)
    mother_name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'users_data'

class Attendance(models.Model):
    attendance_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UsersData, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    role = models.CharField(max_length=50)  # Add the role field
    month_year = models.CharField(max_length=7)
    class_name = models.CharField(max_length=255) 
    attendance_data = models.JSONField()

    class Meta:
        db_table = 'Attendance'



class Fees(models.Model):
    fee_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UsersData, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    date_of_payment = models.DateField()
    last_date_of_payment = models.DateField()
    receipt_number = models.CharField(max_length=50, unique=True)
    month = models.CharField(max_length=20)
    fees_paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    fee_categories = models.JSONField()
    
    class Meta:
        db_table = 'Fees'


class Assignments(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    photo = models.ImageField(upload_to='photos/assignments/', null=True, blank=True)
    assignment_details = models.TextField()
    last_date_of_submission = models.DateField()
    teacher_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    class_name = models.CharField(max_length=50)

    class Meta:
        db_table = 'Assignments'


class Timetable(models.Model):
    photo = models.ImageField(upload_to='photos/timetables/')
    occasion = models.CharField(max_length=255)
    posted_at = models.DateTimeField(auto_now_add=True)
    class_name = models.CharField(max_length=50)
    class Meta:
        db_table = 'Timetable'

class Result(models.Model):
    student_name = models.CharField(max_length=255)
    class_name = models.CharField(max_length=50)
    exam_name = models.CharField(max_length=255)
    result_photo = models.ImageField(upload_to='photos/results/')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'Results'
        
class Exam(models.Model):
    subject = models.CharField(max_length=255)
    exam_name = models.CharField(max_length=255)
    paper_file_path = models.FileField(upload_to='exam_papers/')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    student_name = models.CharField(max_length=255)  # New field
    class_name = models.CharField(max_length=50)  # New field

    class Meta:
        db_table = 'exams'

class Salary(models.Model):
    teacher_name = models.CharField(max_length=100)
    month = models.CharField(max_length=50)
    date_of_payment = models.DateField()
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due = models.DecimalField(max_digits=10, decimal_places=2)
    class_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    receipt_image = models.ImageField(upload_to='receipts/')
    time_of_payment = models.DateTimeField(auto_now_add=True)  
    class Meta:
        db_table = 'Salary'

class Message(models.Model):
    message = models.TextField()
    photo = models.ImageField(upload_to='messages/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=150)
    class Meta:
        db_table = 'messages'

class ReminderMessage(models.Model):
    class_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    sent_by = models.CharField(max_length=100)
    message = models.TextField()
    sent_datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reminder_message'

class Homework(models.Model):
    text = models.TextField()
    photo = models.ImageField(upload_to='homework_photos/', blank=True, null=True)
    class_name = models.CharField(max_length=100)
    teacher_name = models.CharField(max_length=100)
    posted_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'homework'

class ChatMessage(models.Model):
  
    sender_name = models.CharField(max_length=100)
    message = models.TextField()
    photo = models.ImageField(upload_to='chat_photos/', null=True, blank=True)
    class_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    chat_type = models.CharField(max_length=100)  # 'group' or 'individual'
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Chat_messages'