from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson.json_util import dumps
from scripts.util import (
    count_game_questions,
    set_user,
    set_count_game_answers,
    set_math_game_answers,
    create_math_question,
    send_count_game_report,
    send_math_game_report,
    set_choose_game_answers,
    create_choose_question,
    send_choose_game_report,
)
from report.reporting import (
    count_game_reporting,
    math_game_reporting,
    choose_game_reporting,
)
import random
import json

TOKEN_EXPIRE_TIME = 24  # HOURS
TOTAL_QUESTION_NUMBER = 30

app = Flask(__name__)
app.config.from_pyfile("config.cfg")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=TOKEN_EXPIRE_TIME)

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
mail = Mail(app)
jwt = JWTManager(app)

cors = CORS(
    app,
    resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}},
)

if mongo.db.count_game_questions.find_one():
    mongo.db.count_game_questions.drop()
count_game_questions(mongo)


def create_report_and_send_mail(user_id, report_type):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if report_type == "count_game":
            count_game_reporting(mongo, user_id)
            send_count_game_report(app, mail, user)
        elif report_type == "math_game":
            math_game_reporting(mongo, user_id)
            send_math_game_report(app, mail, user)
        elif report_type == "choose_game":
            choose_game_reporting(mongo, user_id)
            send_choose_game_report(app, mail, user)
        else:
            print("Invalid report type")

    except Exception as e:
        print(e)


@app.route("/register", methods=["POST"])
def register():
    email = request.json["email"]
    password = bcrypt.generate_password_hash(request.json["password"]).decode("utf-8")
    parent_first_name = request.json["parent_first_name"]
    parent_last_name = request.json["parent_last_name"]
    child_first_name = request.json["child_first_name"]
    child_last_name = request.json["child_last_name"]
    created_at = datetime.utcnow()

    user = mongo.db.users.find_one({"email": email})

    if user:
        result = jsonify({"result": "-1"})
        return result

    set_user(
        mongo,
        email,
        password,
        parent_first_name,
        parent_last_name,
        child_first_name,
        child_last_name,
        created_at,
    )

    created_user = mongo.db.users.find_one({"email": email})
    user_id = created_user["_id"]

    set_count_game_answers(mongo, user_id)
    set_math_game_answers(mongo, user_id)
    set_choose_game_answers(mongo, ObjectId(user_id))

    result = jsonify({"result": "1"})
    return result


@app.route("/", methods=["GET", "POST"])
def index():
    return "Hello World"


@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]

    user = mongo.db.users.find_one({"email": email})

    if not user:
        result = jsonify({"status": 401})
        return result

    if bcrypt.check_password_hash(user["password"], password):
        access_token = create_access_token(identity=str(user["_id"]))
        result = jsonify({"status": 200, "access_token": access_token})
        return result
    else:
        result = jsonify({"status": 401})
        return result


@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

        count_game_question_number = mongo.db.count_game_questions.count_documents({})
        math_game_question_number = TOTAL_QUESTION_NUMBER
        choose_game_question_number = TOTAL_QUESTION_NUMBER

        count_game_correct_answers = mongo.db.count_game_answers.find_one(
            {"user": ObjectId(user_id)}
        )["correct_answer_number"]
        math_game_answered_question_number = mongo.db.math_game_answers.find_one(
            {"user": ObjectId(user_id)}
        )["answered_question_number"]
        choose_game_answered_question_number = mongo.db.choose_game_answers.find_one(
            {"user": ObjectId(user_id)}
        )["answered_question_number"]

        return jsonify(
            {
                "status": 200,
                "child_first_name": user["child_first_name"]
                + " "
                + user["child_last_name"],
                "total_count_game": [
                    count_game_question_number,
                    count_game_correct_answers,
                ],
                "total_math_game": [
                    math_game_question_number,
                    math_game_answered_question_number,
                ],
                "total_choose_game": [
                    choose_game_question_number,
                    choose_game_answered_question_number,
                ],
            }
        )

    except:
        return jsonify({"status": 401})


@app.route("/count-game", methods=["GET", "POST"])
@jwt_required()
def count_game():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    number_of_questions = mongo.db.count_game_questions.count_documents({})

    if request.method == "GET":
        try:
            user_answers = mongo.db.count_game_answers.find_one(
                {"user": ObjectId(user_id)}
            )

            if user_answers == None:
                set_count_game_answers(mongo, ObjectId(user_id))
                user_answers = mongo.db.count_game_answers.find_one(
                    {"user": ObjectId(user_id)}
                )

            max_shown_questions = 6
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
                    question = mongo.db.count_game_questions.find_one({"number": i})
                    question["number_of_object"] = number_of_object
                    questions[str(counter)] = question
                    counter += 1

                if counter == show_question_number:
                    questions["status"] = 200
                    break
            questions["player"] = (
                user["child_first_name"] + " " + user["child_last_name"]
            )
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})

    elif request.method == "POST":
        results = request.json
        print(results)
        correct_answer_number = mongo.db.count_game_answers.find_one(
            {"user": ObjectId(user_id)}
        )["correct_answer_number"]

        try:
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
                        {"user": ObjectId(user_id)}, {"$set": {key: True}}
                    )

                # If user answer is incorrect
                elif result == False:
                    mongo.db.count_game_answers.update_one(
                        {"user": ObjectId(user_id)}, {"$set": {key: False}}
                    )

                    question_statistics = mongo.db.count_game_answers.find_one(
                        {"user": ObjectId(user_id)}
                    )["stats" + str(key)]
                    number_of_error = len(question_statistics)
                    number_of_error += 1

                    question_statistics[str(number_of_error)] = {
                        "name": name,
                        "question_number": key,
                        "correct_answer": correct_answer,
                        "user_answer": user_answer,
                    }

                    mongo.db.count_game_answers.update_one(
                        {"user": ObjectId(user_id)},
                        {"$set": {"stats" + str(key): question_statistics}},
                    )

                # If user answer is not answered
                elif result == None:
                    mongo.db.count_game_answers.update_one(
                        {"user": ObjectId(user_id)}, {"$set": {key: None}}
                    )

                    question_statistics = mongo.db.count_game_answers.find_one(
                        {"user": ObjectId(user_id)}
                    )["stats" + str(key)]
                    number_of_error = len(question_statistics)
                    number_of_error += 1

                    question_statistics[str(number_of_error)] = {
                        "name": name,
                        "question_number": key,
                        "correct_answer": correct_answer,
                        "user_answer": None,
                    }

                    mongo.db.count_game_answers.update_one(
                        {"user": ObjectId(user_id)},
                        {"$set": {"stats" + str(key): question_statistics}},
                    )

            # Update correct number of answers
            mongo.db.count_game_answers.update_one(
                {"user": ObjectId(user_id)},
                {"$set": {"correct_answer_number": correct_answer_number}},
            )

            # Create report and send mail if game is finished
            if correct_answer_number == number_of_questions:
                create_report_and_send_mail(user_id, "count_game")

            return jsonify({"status": 200})

        except:
            return jsonify({"status": 401})

    else:
        return jsonify({"status": 401})


@app.route("/math-game", methods=["GET", "POST"])
@jwt_required()
def math_game():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    user_answers = mongo.db.math_game_answers.find_one({"user": ObjectId(user_id)})

    if request.method == "GET":
        try:
            if not user_answers:
                set_math_game_answers(mongo, ObjectId(user_id))
                user_answers = mongo.db.math_game_answers.find_one(
                    {"user": ObjectId(user_id)}
                )

            answered_questions = user_answers["answered_question_number"]
            unanswered_questions = TOTAL_QUESTION_NUMBER - answered_questions

            if unanswered_questions == 0:
                return jsonify({"status": 200, "result": "1"})

            # Create math question
            show_question_number = 6
            if unanswered_questions < show_question_number:
                show_question_number = unanswered_questions

            questions = dict()

            for i in range(show_question_number):
                question = create_math_question()
                questions[str(i)] = question

            questions["status"] = 200
            questions["player"] = (
                user["child_first_name"] + " " + user["child_last_name"]
            )
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})

    elif request.method == "POST":
        try:
            if not user_answers:
                set_math_game_answers(mongo, ObjectId(user_id))
                user_answers = mongo.db.math_game_answers.find_one(
                    {"user": ObjectId(user_id)}
                )

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

                answered_question_number += 1
                mongo.db.math_game_answers.update_one(
                    {"user": ObjectId(user_id)},
                    {
                        "$set": {
                            "q"
                            + str(answered_question_number): {
                                "first_number": first_number,
                                "second_number": second_number,
                                "operator": operator,
                                "correct_answer": correct_answer,
                                "user_answer": user_answer,
                                "result": None if result == None else bool(result),
                            }
                        }
                    },
                )

                mongo.db.math_game_answers.update_one(
                    {"user": ObjectId(user_id)},
                    {
                        "$set": {
                            "a" + str(answered_question_number): None
                            if result == None
                            else bool(result)
                        }
                    },
                )

            # Update answered number of questions
            mongo.db.math_game_answers.update_one(
                {"user": ObjectId(user_id)},
                {"$set": {"answered_question_number": answered_question_number}},
            )

            # Create report and send mail if game is finished
            if answered_question_number == TOTAL_QUESTION_NUMBER:
                create_report_and_send_mail(user_id, "math_game")

            return jsonify({"status": 200})

        except:
            return jsonify({"status": 401})

    else:
        return jsonify({"status": 401})


@app.route("/choose-game", methods=["GET", "POST"])
@jwt_required()
def choose_game():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    user_answers = mongo.db.choose_game_answers.find_one({"user": ObjectId(user_id)})

    if request.method == "GET":

        if not user_answers:
            set_choose_game_answers(mongo, ObjectId(user_id))
            user_answers = mongo.db.choose_game_answers.find_one(
                {"user": ObjectId(user_id)}
            )

        try:
            answered_questions = user_answers["answered_question_number"]
            unanswered_questions = TOTAL_QUESTION_NUMBER - answered_questions

            if unanswered_questions == 0:
                return jsonify({"status": 200, "result": "1"})

            # Create choose game questions
            show_question_number = 6
            if unanswered_questions < show_question_number:
                show_question_number = unanswered_questions

            questions = dict()

            for i in range(show_question_number):
                question = create_choose_question(mongo)
                questions[str(i)] = question

            questions["status"] = 200
            questions["player"] = (
                user["child_first_name"] + " " + user["child_last_name"]
            )
            return json.loads(dumps(questions))
        except:
            return jsonify({"status": 401})

    elif request.method == "POST":

        if not user_answers:
            set_choose_game_answers(mongo, ObjectId(user_id))
            user_answers = mongo.db.choose_game_answers.find_one(
                {"user": ObjectId(user_id)}
            )

        results = request.json
        answered_question_number = user_answers["answered_question_number"]

        for key, value in results.items():
            first_object = value["first_object"]
            second_object = value["second_object"]
            correct_answer = value["correct_object"]
            user_answer = value["user_answer"]
            result = value["result"]

            answered_question_number += 1

            mongo.db.choose_game_answers.update_one(
                {"user": ObjectId(user_id)},
                {
                    "$set": {
                        "q"
                        + str(answered_question_number): {
                            "first_object": first_object,
                            "second_object": second_object,
                            "correct_object": correct_answer,
                            "user_answer": user_answer,
                            "result": None if result == None else bool(result),
                        }
                    }
                },
            )

            mongo.db.choose_game_answers.update_one(
                {"user": ObjectId(user_id)},
                {
                    "$set": {
                        "a" + str(answered_question_number): None
                        if result == None
                        else bool(result)
                    }
                },
            )

        # Update answered number of questions
        mongo.db.choose_game_answers.update_one(
            {"user": ObjectId(user_id)},
            {"$set": {"answered_question_number": answered_question_number}},
        )

        if answered_question_number == TOTAL_QUESTION_NUMBER:
            create_report_and_send_mail(user_id, "choose_game")

        return jsonify({"status": 200})

    else:
        return jsonify({"status": 401})


"""
@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    email = request.form['email']
    user = mongo.db.users.find_one({'email': email})

    if not user:
        flash('Email does not exist')
        return redirect(url_for('forgot_password'))

    msg = Message('Password Reset', sender='ahmet.mail.ops@gmail.com', recipients=[email])
    msg.body = 'Your password is: ' + user.password
    mail.send(msg)

    flash('Password sent to your email')
"""


@app.route("/deneme", methods=["GET"])
@jwt_required()
def deneme():
    user_id = get_jwt_identity()

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    send_count_game_report(app, mail, user)
    send_math_game_report(app, mail, user)
    send_choose_game_report(app, mail, user)

    return jsonify({"status": 200})


if __name__ == "__main__":
    app.run(debug=True)
