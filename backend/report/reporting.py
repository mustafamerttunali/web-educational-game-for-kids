from bson.objectid import ObjectId

def create_report(mongo, user_id):
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    user_count_game_answers = mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})

    print(len(user_count_game_answers["stats" + str(1)]))
