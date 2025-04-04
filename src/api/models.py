from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from flask import jsonify

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)

    tasks = db.relationship("Task", back_populates="user")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name":self.user_name
            # do not serialize the password, its a security breach
        }
    
    def tasks_serialized(self):
        tasks_serialize=[]
        for task_list in self.tasks:
            tasks_serialize.append({'taskId':task_list.id, 'taskTitle':task_list.title,
                                    'taskDescription':task_list.description,'taskCompleted':task_list.completed
                                    })
        return {'userId':self.id, 'userName':self.user_name,
                         'tasks':tasks_serialize}
    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=False, nullable=False)
    description = db.Column(db.String(300), unique=False, nullable=False)
    completed = db.Column(db.Boolean, unique=False, nullable=False)
    user_id =  db.Column(db.Integer, ForeignKey(User.id), unique = False, nullable = False)
    priority_id = db.Column(db.Integer, unique=False, nullable=True)
    comments = db.Column(db.String(1000), unique=False, nullable=True)

    user = db.relationship("User", back_populates="tasks")

    def __repr__(self):
        return f'<User {self.title}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description":self.description,
            "user_id": self.user_id,
            "completed": self.completed
        }
    
class Priority(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    priority_description = db.Column(db.String(15), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.priority_description}>'
