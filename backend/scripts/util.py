import os

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
        'answer_rate': 0
    })