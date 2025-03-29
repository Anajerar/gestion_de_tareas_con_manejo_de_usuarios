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

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name":self.user_name
            # do not serialize the password, its a security breach
        }
    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), unique=False, nullable=False)
    description = db.Column(db.String(300), unique=False, nullable=False)
    completed = db.Column(db.Boolean, unique=False, nullable=False)
    user_id =  db.Column(db.Integer, ForeignKey(User.id), unique = True, nullable = False)

    def __repr__(self):
        return f'<User {self.title}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description":self.desciption,
            "user_id": self.user_id,
            "completed": self.completed
        }