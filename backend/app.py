
from flask import Flask, request, redirect, url_for, flash, jsonify
from flask_pymongo import PyMongo
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import datetime
from bson.objectid import ObjectId
from bson.json_util import dumps
from scripts.util import count_game_questions, set_user, set_count_game_answers, set_math_game_answers, create_math_question
import random
import json

app = Flask(__name__)
app.config.from_pyfile('config.cfg')

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
mail = Mail(app)
jwt = JWTManager(app)

CORS(app)

if  mongo.db.count_game_questions.find_one():
    mongo.db.count_game_questions.drop()
count_game_questions(mongo)

@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')
    parent_first_name = request.json['parent_first_name']
    parent_last_name = request.json['parent_last_name']
    child_first_name = request.json['child_first_name']
    child_last_name = request.json['child_last_name']
    created_at = datetime.utcnow()

    user = mongo.db.users.find_one({'email': email})

    if user:
        result = jsonify({"result":"-1"})
        return result

    set_user(mongo, email, password, parent_first_name, parent_last_name, child_first_name, child_last_name, created_at)

    created_user = mongo.db.users.find_one({'email': email})
    user_id = created_user["_id"]

    set_count_game_answers(mongo, user_id)
    set_math_game_answers(mongo, user_id)

    result = jsonify({"result":"1"})
    return result

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    
    user = mongo.db.users.find_one({'email': email})

    if not user:
        result = jsonify({"status": 401})
        return result
    
    if bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        result = jsonify({"status": 200, "access_token": access_token})
        return result
    else:
        result = jsonify({"status": 401})
        return result

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        return jsonify({"status": 200,
                       "child_first_name": user['child_first_name'] + " " + user['child_last_name'],
                    })
    except:
        return jsonify({"status": 401})

@app.route('/count-game', methods=['GET', 'POST'])
@jwt_required()
def count_game():
    if request.method == "GET":
        try:
            user_id = get_jwt_identity()
            user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
            user_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})
            number_of_questions = 24 #look here
            questions = dict()
            counter = 4
            # TODO: Fix counter problem.
            for i in range(1, number_of_questions):
                if user_answers[str(i)] == None or user_answers[str(i)] == False:
                    number_of_object = random.randint(1, 5)
                    question = mongo.db.count_game_questions.find_one({'number': i})
                    question["number_of_object"] = number_of_object
                    questions[str(counter)] = question
                    counter -= 1
                if counter == 0:
                    questions["status"] = 200
                    break
            questions["player"] = user['child_first_name'] + " " + user['child_last_name']
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})
    else:
        return

@app.route('/math-game', methods=['GET', 'POST'])
@jwt_required()
def math_game():
    if request.method == "GET":
        try:
            user_id = get_jwt_identity()
            user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
            user_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})

            # Check answered number of questions
            unanswered_questions = 0
            for i in range(1, 31):
                if user_answers["q" + str(i)] == None:
                    unanswered_questions += 1

            if unanswered_questions == 0:
                return jsonify({"status": 200, "result": "1"})

            # Create math question
            if unanswered_questions > 4:
                show_question_number = 4

            else:
                show_question_number = unanswered_questions

            questions = dict()

            for i in range(show_question_number):
                question = create_math_question()
                questions[str(i + 1)] = question

            questions["status"] = 200
            questions["player"] = user['child_first_name'] + " " + user['child_last_name']
            return json.loads(dumps(questions))
            
        except:
            return jsonify({"status": 401})

    else:
        return



"""@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    email = request.form['email']
    user = mongo.db.users.find_one({'email': email})

    if not user:
        flash('Email does not exist')
        return redirect(url_for('forgot_password'))

    msg = Message('Password Reset', sender='ahmet.mail.ops@gmail.com', recipients=[email])
    msg.body = 'Your password is: ' + user.password
    mail.send(msg)

    flash('Password sent to your email')"""

if __name__ == '__main__':
    app.run(debug=True)