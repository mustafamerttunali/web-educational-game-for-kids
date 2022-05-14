from ast import operator
from flask import Flask, request, redirect, url_for, flash, jsonify
from flask_pymongo import PyMongo
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson.json_util import dumps
from scripts.util import count_game_questions, set_user, set_count_game_answers, set_math_game_answers, create_math_question
from report.reporting import create_report
import random
import json

TOKEN_EXPIRE_TIME = 2 # HOURS

app = Flask(__name__)
app.config.from_pyfile('config.cfg')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=TOKEN_EXPIRE_TIME)

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
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    number_of_questions = mongo.db.count_game_questions.count_documents({})

    if request.method == "GET":
        try:
            user_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})

            if user_answers == None:
                set_count_game_answers(mongo, ObjectId(user_id))
                user_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})
                
            max_shown_questions = 4
            questions = dict()

            unanswered_questions = 0
            for i in range(1, number_of_questions + 1):
                if user_answers[str(i)] == None or user_answers[str(i)] == False:
                    unanswered_questions += 1

            if unanswered_questions == 0:
                return jsonify({"status": 200, "result": "1"})

            if unanswered_questions > max_shown_questions:
                show_question_number = max_shown_questions
            else:
                show_question_number = unanswered_questions

            counter = 0
            for i in range(1, number_of_questions + 1):
                if user_answers[str(i)] == None or user_answers[str(i)] == False:
                    number_of_object = random.randint(1, 5)
                    question = mongo.db.count_game_questions.find_one({'number': i})
                    question["number_of_object"] = number_of_object
                    questions[str(counter)] = question
                    counter += 1

                if counter == show_question_number:
                    questions["status"] = 200
                    break
            questions["player"] = user['child_first_name'] + " " + user['child_last_name']
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})

    elif request.method == "POST":
        try:
            results = request.json
            print(results)
            correct_answer_number = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})["correct_answer_number"]

            # Set user answers
            for key, value in results.items():
                name = value["name"]
                correct_answer = value["correct_answer"]
                user_answer = value["user_answer"]
                result = value["result"]

                # If user answer is correct
                if result:
                    correct_answer_number += 1
                    
                    mongo.db.count_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {key: True}}
                    )

                # If user answer is incorrect
                elif result == False:
                    mongo.db.count_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {key: False}}
                    )

                    question_statistics = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})['stats' + str(key)]
                    number_of_error = len(question_statistics)
                    number_of_error += 1

                    question_statistics[str(number_of_error)] = {"name": name, "question_number": key, "correct_answer": correct_answer, "user_answer": user_answer}

                    mongo.db.count_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {'stats' + str(key): question_statistics}}
                    )

                # If user answer is not answered
                elif result == None:
                    mongo.db.count_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {key: None}}
                    )

                    question_statistics = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})['stats' + str(key)]
                    number_of_error = len(question_statistics)
                    number_of_error += 1

                    question_statistics[str(number_of_error)] = {"name": name, "question_number": key, "correct_answer": correct_answer, "user_answer": None}
                    print(question_statistics)

                    mongo.db.count_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {'stats' + str(key): question_statistics}}
                    )

            # Upadate correct number of answers
            mongo.db.count_game_answers.update_one({'_id': ObjectId(user_id)}, {'$set': {'correct_answer_number': correct_answer_number}})
            return jsonify({"status": 200})

        except:
            return jsonify({"status": 401})

    else:
        return jsonify({"status": 401})

@app.route('/math-game', methods=['GET', 'POST'])
@jwt_required()
def math_game():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    TOTAL_QUESTION_NUMBER = 30
    user_answers = mongo.db.math_game_answers.find_one({'user': ObjectId(user_id)})

    if request.method == "GET":
        try:
            if not user_answers:
                set_math_game_answers(mongo, ObjectId(user_id))
                user_answers = mongo.db.math_game_answers.find_one({'user': ObjectId(user_id)})

            answered_questions = user_answers["answered_question_number"]
            unanswered_questions = TOTAL_QUESTION_NUMBER - answered_questions
            print(unanswered_questions)

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
                questions[str(i)] = question

            questions["status"] = 200
            questions["player"] = user['child_first_name'] + " " + user['child_last_name']
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})
            

    elif request.method == "POST":
        try:
            if not user_answers:
                    set_math_game_answers(mongo, ObjectId(user_id))
                    user_answers = mongo.db.math_game_answers.find_one({'user': ObjectId(user_id)})
            
            results = request.json
            answered_question_number = user_answers["answered_question_number"]
            
            # Set user answers
            for key, value in results.items():
                first_number = value["first_number"]
                second_number = value["second_number"]
                operator = value["operator"]
                correct_answer = value["correct_answer"]
                user_answer = value["user_answer"]
                result = value["result"]
                print(result)

                answered_question_number += 1
                mongo.db.math_game_answers.update_one(
                    {'user': ObjectId(user_id)},
                    {'$set': {'q' + str(answered_question_number): {
                        "first_number": first_number, 
                        "second_number": second_number, 
                        "operator": operator, 
                        "correct_answer": correct_answer, 
                        "user_answer": user_answer, 
                        "result": bool(result)}}}
                )

                mongo.db.math_game_answers.update_one(
                    {'user': ObjectId(user_id)},
                    {'$set': {'a' + str(answered_question_number): bool(result)}}
                )

            print(answered_question_number)
            # Upadate answered number of questions
            mongo.db.math_game_answers.update_one({'user': ObjectId(user_id)}, {'$set': {'answered_question_number': answered_question_number}})
            return jsonify({"status": 200})

        except:
            return jsonify({"status": 401})

    else:  
        return jsonify({"status": 401})

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

@app.route('/deneme', methods=['GET'])
@jwt_required()
def deneme():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    user_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})

    mongo.db.math_game_answers.update_one(
                        {'user': ObjectId(user_id)},
                        {'$set': {'q' + str(2): {
                            "first_number": 1, 
                            "second_number": 1, 
                            "operator": "*", 
                            "correct_answer": 1, 
                            "user_answer": 1, 
                            "result": True}}}
                    )

    return jsonify({"status": 200})

if __name__ == '__main__':
    app.run(debug=True)