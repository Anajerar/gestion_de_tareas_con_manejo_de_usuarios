"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, desc
from api.models import db, User, Task, Priority
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

import math

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signin', methods=['POST'])
def sign_in():
    data = request.json

    user_name = data.get("user_name")
    email = data.get("email")
    password = data.get("password")

    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if user_exist==None:
        password_hash = generate_password_hash(password)

        new_user = User(
            user_name = user_name,
            email=email,
            password_hash=password_hash,
            
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            return jsonify({"message": "Error saving user to database"}), 500

        return jsonify({
            "user": new_user.serialize(),
            "message": "Registration completed successfully, you will be redirected to the Log-in"
        }), 200
    else:
        return jsonify({"msg":"Credenciales de usuario ya existente, intenta de nuevo"}),400

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if user_exist==None:
        return jsonify({"msg":"invalid user or password"}),400

    user=user_exist[0]
    valid_password = check_password_hash(user.password_hash,password)
    if valid_password !=True :
        return jsonify ({'msg':'invalid user or password, try again'}),400
    access_token = create_access_token(identity=user.email)
    return jsonify ({'access token':access_token}),200


# User Profile view
@api.route('/users/me', methods=['GET'])
@jwt_required()
def profile():
    email=get_jwt_identity()
    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    return jsonify(user_exist[0].serialize()),200

@api.route('/users/tasks/<string:page>', methods=['GET'])
@jwt_required()
def tasks(page):     # Query task list for the user in pages of 5 tasks each
    email=get_jwt_identity()

    #Get user id
    logged_user = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    user_id = logged_user[0].id
    print("user id:",user_id," user name:",logged_user[0].user_name)
    db.session.close()

    # Calculating the total number of pages w/5 records each
    total_tasks = db.session.query(Task).filter(Task.user_id==user_id).count()
    pages=math.ceil(total_tasks/5)

    # calculating the page query offset
    if page=="1":
        offset=0
    elif page=="last":
        offset=(pages-1)*5
    else:
        try:
            offset=(int(page)-1)*5+1
        except:
            return {'msg':'incorrect page number'},404

    print('offset:',offset)    
    # getting the 5 task list for the page
    user_tasks = db.session.query(Task).filter(Task.user_id==user_id).order_by((Task.priority_id)).limit(5).offset(offset).all()
    task_list=[]
    for row in user_tasks:
        priority = db.session.query(Priority).filter(Priority.id==row.priority_id).first()
        print("Descripcion de prioridad:",priority.priority_description)
        task_list.append({'taskId':row.id,'taskTitle':row.title,'taskDescription':row.description, 'taskPriority':row.priority_id,
                          'priorityDescription':priority.priority_description,'taskCompleted':row.completed} ) 
    db.session.close()
    return jsonify ({'msg':'ok','userName':logged_user[0].user_name,'totalPages':pages,'userTasks':task_list})



@api.route('/users/addtask', methods=['POST'])
@jwt_required()
def add_task():
    email=get_jwt_identity()
    data = request.json
    title=data.get('task')
    description = data.get('description')
    completed = data.get('completed')
    #get user id
    try:
        logged_user = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
        user_id = logged_user[0].id
        db.session.close()
    except Exception as error:
        print('error with database', error)
        return {'msg':'database error'},500

    print('task:',title,' description:',description,' completed:',completed, ' user id:',user_id)
    new_task = Task(
            title = title,
            description=description,
            completed=completed,
            user_id=user_id     
        )
    
    try:
            db.session.add(new_task)
            db.session.commit()
    except Exception as error:
            db.session.rollback()
            return jsonify({"message": "Error saving user to database"}), 500

    return {'msg':'task saved'}


@api.route('/priorities', methods=['GET'])
def get_priorities():
    priorities = db.session.query(Priority).all()
    priority_list=[]
    for row in priorities:
        priority_list.append({'id':row.id,'description':row.priority_description})
    db.session.close()
    return jsonify(priority_list),200

@api.route('/users/task/<int:id>', methods=['GET','PUT', 'DELETE'])
@jwt_required()
def update_task(id):
    email=get_jwt_identity()

    #Get user id
    try:
        logged_user = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
        user_id = logged_user[0].id
    except:
        return jsonify({'msg':'Database access error'}),500

    if request.method=='GET':
        user_task = db.session.execute(db.select(Task).filter_by(user_id=user_id, id=id)).one_or_none()
        task=user_task[0].serialize()
        print('this the user task:', task)
        return jsonify(task),200
    
    if request.method=='PUT':
        data=request.json
        title=data.get('title')
        description=data.get('description')
        completed=data.get('completed')
        notes=data.get('notes')
        print("task id:",id," user id:",user_id," title:",title," description:",description," completed:",completed)
        task_to_update = db.session.query(Task).filter_by(id=id,user_id=user_id).first()
        if task_to_update:
            task_to_update.title=title
            task_to_update.description=description
            task_to_update.comments=notes
            task_to_update.completed=completed
            db.session.commit()
            db.session.close()
            return {"msg":"task updated"},200
        else:
            db.session.close()
            return jsonify({'msg':'task and related user not found'}),404
        
    if request.method=='DELETE':
        task_to_update = db.session.query(Task).filter_by(id=id,user_id=user_id).first()
        if task_to_update:
            print(task_to_update.description)
            db.session.delete(task_to_update)
            db.session.commit()
            db.session.close()
            return jsonify({"msg":"task deleted"}),200
        else:
            db.session.close()
            return jsonify({"msg":"task and related user not found"}),404
        
    return {"msg":"under construction"}
