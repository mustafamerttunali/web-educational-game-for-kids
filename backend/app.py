
from flask import Flask, request, redirect, url_for, flash, jsonify
from flask_pymongo import PyMongo
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import datetime
from bson.objectid import ObjectId
from scripts.util import count_game_questions, set_user, set_count_game_answers

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

@app.route('/count_game', methods=['GET'])
@jwt_required()
def count_game():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})

        number_of_questions = mongo.db.count_game_questions.find().count()

        questions = list()
        counter = 4
        for i in range(1, number_of_questions):
            if user[str(i)] == None or user[str(i)] == False:
                question = mongo.db.count_game_questions.find_one({'number': i})
                questions.append(question)
                counter -= 1

            if counter == 0:
                break

        

    except:
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

if __name__ == '__main__':
    app.run(debug=True)