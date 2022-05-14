import os
import random

def count_game_questions(mongo):
    os.chdir("../")
    current_directory = os.getcwd()
    
    IMAGES_DIR_PATH = current_directory + "/frontend/public/images"
    SOUNDS_DIR_PATH = current_directory + "/frontend/public/sounds"

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
        'stats1': {},
        'stats2': {},
        'stats3': {},
        'stats4': {},
        'stats5': {},
        'stats6': {},
        'stats7': {},
        'stats8': {},
        'stats9': {},
        'stats10': {},
        'stats11': {},
        'stats12': {},
        'stats13': {},
        'stats14': {},
        'stats15': {},
        'stats16': {},
        'stats17': {},
        'stats18': {},
        'stats19': {},
        'stats20': {},
        'stats21': {},
        'stats22': {},
        'stats23': {},
        'stats24': {},
        'correct_answer_number': 0
    })

def set_math_game_answers(mongo, user_id):
    mongo.db.math_game_answers.insert_one({
        'user': user_id,
        'q1': {},
        'q2': {},
        'q3': {},
        'q4': {},
        'q5': {},
        'q6': {},
        'q7': {},
        'q8': {},
        'q9': {},
        'q10': {},
        'q11': {},
        'q12': {},
        'q13': {},
        'q14': {},
        'q15': {},
        'q16': {},
        'q17': {},
        'q18': {},
        'q19': {},
        'q20': {},
        'q21': {},
        'q22': {},
        'q23': {},
        'q24': {},
        'q25': {},
        'q26': {},
        'q27': {},
        'q28': {},
        'q29': {},
        'q30': {},
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
        'answered_question_number': 0
    })

def create_math_question():
    while True:
        operator = random.choice(["+", "-", "*", "/"])
        answer = 0

        if operator == "/":
            first_number = random.randint(1, 10)
            second_number = random.randint(1, 5)
            answer = first_number / second_number
        else:
            first_number = random.randint(1, 5)
            second_number = random.randint(1, 5)

            if operator == "+":
                answer = first_number + second_number
            
            elif operator == "-":
                answer = first_number - second_number

            elif operator == "*":
                answer = first_number * second_number

        if answer <= 5 and answer >= 1 and isinstance(answer, int):
            return {"first_number": first_number, "second_number": second_number, "operator": operator, "correct_answer": answer}
    