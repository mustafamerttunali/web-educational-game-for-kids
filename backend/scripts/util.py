import os
import random

def count_game_questions(mongo):
    os.chdir("../")
    current_directory = os.getcwd()
    
    IMAGES_DIR_PATH = current_directory + "/frontend/src/images"
    SOUNDS_DIR_PATH = current_directory + "/frontend/src/sounds"

    IMAGES_DIRECTORY = os.listdir(IMAGES_DIR_PATH)
    SOUNDS_DIRECTORY =  os.listdir(SOUNDS_DIR_PATH)
    os.chdir("backend") 

    counter = 1
    for image in IMAGES_DIRECTORY:
        if image == ".DS_Store":
            continue

        name, ext = os.path.splitext(image)

        if ext == ".png":
            mongo.db.count_game_questions.insert_one({
                'name': name,
                'number': counter,
                'image_path': IMAGES_DIR_PATH + "/" + image,
                'sound_path': SOUNDS_DIR_PATH + "/" + name + ".mp3"
            })
            counter += 1

def set_user(mongo, email, password, parent_first_name, parent_last_name, child_first_name, child_last_name, created_at):
    mongo.db.users.insert_one({
        'email': email,
        'password': password,
        'parent_first_name': parent_first_name,
        'parent_last_name': parent_last_name,
        'child_first_name': child_first_name,
        'child_last_name': child_last_name,
        'created_at': created_at
    })

def set_count_game_answers(mongo, user_id):
    mongo.db.count_game_answers.insert_one({
        'user': user_id,
        '1': None,
        '2': None,
        '3': None,
        '4': None,
        '5': None,
        '6': None,
        '7': None,
        '8': None,
        '9': None,
        '10': None,
        '11': None,
        '12': None,
        '13': None,
        '14': None,
        '15': None,
        '16': None,
        '17': None,
        '18': None,
        '19': None,
        '20': None,
        '21': None,
        '22': None,
        '23': None,
        '24': None,
        'correct_answer': 0
    })

def set_math_game_answers(mongo, user_id):
    mongo.db.math_game_answers.insert_one({
        'user': user_id,
        'q1': None,
        'q2': None,
        'q3': None,
        'q4': None,
        'q5': None,
        'q6': None,
        'q7': None,
        'q8': None,
        'q9': None,
        'q10': None,
        'q11': None,
        'q12': None,
        'q13': None,
        'q14': None,
        'q15': None,
        'q16': None,
        'q17': None,
        'q18': None,
        'q19': None,
        'q20': None,
        'q21': None,
        'q22': None,
        'q23': None,
        'q24': None,
        'q25': None,
        'q26': None,
        'q27': None,
        'q28': None,
        'q29': None,
        'q30': None,
        'a1': None,
        'a2': None,
        'a3': None,
        'a4': None,
        'a5': None,
        'a6': None,
        'a7': None,
        'a8': None,
        'a9': None,
        'a10': None,
        'a11': None,
        'a12': None,
        'a13': None,
        'a14': None,
        'a15': None,
        'a16': None,
        'a17': None,
        'a18': None,
        'a19': None,
        'a20': None,
        'a21': None,
        'a22': None,
        'a23': None,
        'a24': None,
        'a25': None,
        'a26': None,
        'a27': None,
        'a28': None,
        'a29': None,
        'a30': None,
        'correct_answer': 0
    })

def create_math_question():
    while True:
        first_number = random.randint(1, 5)
        second_number = random.randint(1, 5)
        operator = random.choice(["+", "-", "*", "/"])
        answer = 0

        if operator == "+":
            answer = first_number + second_number
        
        elif operator == "-":
            answer = first_number - second_number

        elif operator == "*":
            answer = first_number * second_number

        elif operator == "/":
            answer = first_number / second_number

        if answer <= 5 and answer >= 1 and isinstance(answer, int):
            return {"first_number": first_number, "second_number": second_number, "operator": operator, "answer": answer}
    