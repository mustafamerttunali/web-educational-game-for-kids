import os

def count_game_questions(mongo):
    os.chdir("../")
    current_directory = os.getcwd()
    
    IMAGES_DIR_PATH = current_directory + "/frontend/src/images"
    SOUNDS_DIR_PATH = current_directory + "/frontend/src/sounds"

    IMAGES_DIRECTORY = os.listdir(IMAGES_DIR_PATH)
    SOUNDS_DIRECTORY =  os.listdir(SOUNDS_DIR_PATH)
    os.chdir("backend") 

    for image in IMAGES_DIRECTORY:
        if image == ".DS_Store":
            continue

        name, ext = os.path.splitext(image)

        if ext == ".png":
            mongo.db.count_game_questions.insert_one({
                'name': name,
                'image_path': IMAGES_DIR_PATH + "/" + image,
                'sound_path': SOUNDS_DIR_PATH + "/" + name + ".mp3"
            })