import os

def count_game_questions(mongo):
    project_directory = os.getcwd()
    images_directory = project_directory + "\\frontend\\src\\images"
    sound_directory = project_directory + "frontend\\src\\sounds"

    os.chdir(images_directory)
    images = os.listdir()
    
    for image in images:
        name, ext = os.path.splitext(image)

        mongo.db.count_game_questions.insert_one({
            'name': name,
            'image_path': images_directory + image,
            'sound_path': sound_directory + name + ".mp3"
        })
