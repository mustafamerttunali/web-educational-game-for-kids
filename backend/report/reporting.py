from bson.objectid import ObjectId
from fpdf import FPDF
from matplotlib.pyplot import text
from more_itertools import first

class Count_Game_PDF(FPDF):
    
    def __init__(self, mongo, user_id):
        super().__init__(orientation='P', unit='mm', format='Letter')
        self.mongo = mongo
        self.user = self.mongo.db.users.find_one({'_id': ObjectId(user_id)})
        self.user_count_game_answers = self.mongo.db.count_game_answers.find_one({'user': ObjectId(user_id)})
        self.number_of_questions = self.mongo.db.count_game_questions.count_documents({})

    def header(self):
        
        title = "Web Educational Game for Kids\nAhmet Yildiz, Mustafa Mert Tunali, Emir Çetin Memis\nInstructor: Prof. Dr. Muhittin Gökmen"

        self.set_title(title.split("\n")[0])
        self.set_author("Ahmet Yildiz, Mustafa Mert Tunali, Emir Çetin Memis")

        self.draw_frame()

        if self.page_no() == 1:
            
            elements = title.split("\n")
            sizes    = [30,16,14]

            self.ln(25)
            
            self.set_line_width(1)
            
            for i in range(len(elements)) :
                element = elements[i]
                size    = sizes[i]

                self.set_font('Arial', 'B', size)
                title_w = self.get_string_width(element)
                self.set_x((self.w - title_w) / 2)
                self.cell(title_w, 10, element, align='C', ln=1)

            self.ln(50)

    def draw_frame(self) :
        self.image(f"report/frame.jpg", x=0, y=0, w=self.w, h=self.h)

    def footer(self):

        self.set_y(-10)

        self.set_font('helvetica', 'I', 8)

        self.cell(0, 10, f'Page {self.page_no()}', align='C')

    def write_initial_page(self):

        userName = self.user["child_first_name"]
        userSurname = self.user["child_last_name"]

        game_name_text = "COUNTING GAME"
        game_info_text = "Counting Game is a mini game that aims to teach children that\nbetween the ages of 4 and 6 to count and numbers through the\nobjects we use frequently in our lives."
        congratuate_text = f"Congratulations! {userName} {userSurname}\nYou have finished the game!"

        self.set_font('helvetica', 'BI', 18)

        self.set_draw_color(10, 10, 10)
        self.set_fill_color(250, 250, 250)
        self.set_text_color(0, 0, 0)

        self.set_line_width(1)

        cell_w = self.get_string_width(game_name_text) + 10
        self.set_x((self.w - cell_w) / 2)
        self.cell(cell_w, 15, f'{game_name_text}', align='C', ln=1)
        self.ln(10)

        self.set_font('Arial', 'I', 15)
        cell_w = self.get_string_width(max(game_info_text.split("\n"),key=len)) + 5
        self.set_x((self.w - cell_w) / 2)
        self.multi_cell(cell_w, 7, f'{game_info_text}', align='C')
        self.ln(30)

        self.set_font('Arial', 'I', 14)
        cell_w = self.get_string_width(max(congratuate_text.split("\n"),key=len)) + 10
        self.set_x((self.w - cell_w) / 2)
        
        start = (congratuate_text.split("\n")[0][0:congratuate_text.split("\n")[0].find("!")+1])
        name = " ".join(congratuate_text.split("\n")[0].split(" ")[1:])
        end = (congratuate_text.split("\n")[1])
        
        self.set_font('Arial', 'I', 14)
        self.cell(cell_w, 8, f"{start}", align='C', ln=1)
        self.set_x((self.w - cell_w) / 2)
        self.set_font('Arial', 'B', 14)
        self.cell(cell_w, 8, f"{name}", align='C', ln=1)
        self.set_x((self.w - cell_w) / 2)
        self.set_font('Arial', 'I', 14)
        self.cell(cell_w, 8, f"{end}", align='C', ln=1)
        
        self.ln(20)

    def write_data(self) :
        
        chapter_name = "Results"

        self.add_page()

        self.ln(10)

        self.set_font('Arial', 'B', 20)

        cell_w = self.get_string_width(chapter_name) + 100
        reset_x = lambda : self.set_x((self.w - cell_w) / 2)
        image_y = 60
        image_x = 25

        self.set_text_color(0, 0, 0)

        self.set_line_width(1)

        reset_x()
        self.cell(cell_w, 15, f'{chapter_name}', align='C', ln=1)
        self.ln(19)

        self.set_font('Arial', 'B', 12)
        
        datas = []

        for i in range(1, self.number_of_questions + 1) :
            data = self.user_count_game_answers["stats" + str(i)]
            if not data == {}:
                datas.append(data)

        for i in range(1,len(datas)+1) :
            
            data = datas[i-1]

            info_texts = ""

            for j in range(1,len(data)+1) :

                error = data[str(j)]

                error_no        = j
                object_name     = error["name"]
                correct_answer  = error["correct_answer"]
                user_answer     = error["user_answer"]

                text = f"                {error_no}.     Correct Answer:   {correct_answer}          User Answer:   {user_answer}"
            
                info_texts += (text+"\n")
            
            info_texts = info_texts[:-1]
            
            for a in range(5-info_texts.count("\n")) :
                info_texts += "\n"

            reset_x()
            self.multi_cell(cell_w, 7, f'{info_texts}', align='C')

            self.image(f"report/images/{object_name}.jpg", x=image_x, y=image_y, w=32, h=32)

            if (i % 4 == 0) :
                if (i != len(datas)) :
                    self.add_page()
                    self.ln(19)
                    image_y = 0

            self.ln(15)

            image_y += 50

class Math_Game_PDF(FPDF):
    
    def __init__(self, mongo, user_id):
        super().__init__(orientation='P', unit='mm', format='Letter')
        self.mongo = mongo
        self.user = self.mongo.db.users.find_one({'_id': ObjectId(user_id)})
        self.user_math_game_answers = self.mongo.db.math_game_answers.find_one({'user': ObjectId(user_id)})
        self.number_of_questions = 30

    def header(self):
        
        title = "Web Educational Game for Kids\nAhmet Yildiz, Mustafa Mert Tunali, Emir Çetin Memis\nInstructor: Prof. Dr. Muhittin Gökmen"

        self.set_title(title.split("\n")[0])
        self.set_author("Ahmet Yildiz, Mustafa Mert Tunali, Emir Çetin Memis")

        self.draw_frame()

        if self.page_no() == 1:
            
            elements = title.split("\n")
            sizes    = [30,16,14]

            self.ln(25)
            
            self.set_line_width(1)
            
            for i in range(len(elements)) :
                element = elements[i]
                size    = sizes[i]

                self.set_font('Arial', 'B', size)
                title_w = self.get_string_width(element)
                self.set_x((self.w - title_w) / 2)
                self.cell(title_w, 10, element, align='C', ln=1)

            self.ln(50)

    def draw_frame(self) :
        self.image(f"report/frame.jpg", x=0, y=0, w=self.w, h=self.h)

    def footer(self):

        self.set_y(-10)

        self.set_font('helvetica', 'I', 8)

        self.cell(0, 10, f'Page {self.page_no()}', align='C')

    def write_initial_page(self):

        userName = self.user["child_first_name"]
        userSurname = self.user["child_last_name"]

        game_name_text = "MATH GAME"
        game_info_text = "Math Game is a mini game that aims to teach children that\nbetween the ages of 4 and 6 basic math and numbers."
        congratuate_text = f"Congratulations! {userName} {userSurname}\nYou have finished the game!"

        self.set_font('helvetica', 'BI', 18)

        self.set_draw_color(10, 10, 10)
        self.set_fill_color(250, 250, 250)
        self.set_text_color(0, 0, 0)

        self.set_line_width(1)

        cell_w = self.get_string_width(game_name_text) + 10
        self.set_x((self.w - cell_w) / 2)
        self.cell(cell_w, 15, f'{game_name_text}', align='C', ln=1)
        self.ln(10)

        self.set_font('Arial', 'I', 15)
        cell_w = self.get_string_width(max(game_info_text.split("\n"),key=len)) + 5
        self.set_x((self.w - cell_w) / 2)
        self.multi_cell(cell_w, 7, f'{game_info_text}', align='C')
        self.ln(30)

        self.set_font('Arial', 'I', 14)
        cell_w = self.get_string_width(max(congratuate_text.split("\n"),key=len)) + 10
        self.set_x((self.w - cell_w) / 2)
        
        start = (congratuate_text.split("\n")[0][0:congratuate_text.split("\n")[0].find("!")+1])
        name = " ".join(congratuate_text.split("\n")[0].split(" ")[1:])
        end = (congratuate_text.split("\n")[1])
        
        self.set_font('Arial', 'I', 14)
        self.cell(cell_w, 8, f"{start}", align='C', ln=1)
        self.set_x((self.w - cell_w) / 2)
        self.set_font('Arial', 'B', 14)
        self.cell(cell_w, 8, f"{name}", align='C', ln=1)
        self.set_x((self.w - cell_w) / 2)
        self.set_font('Arial', 'I', 14)
        self.cell(cell_w, 8, f"{end}", align='C', ln=1)
        
        self.ln(20)

    def write_data(self) :
        
        chapter_name = "Results"

        self.add_page()

        self.ln(10)

        self.set_font('Arial', 'B', 20)

        cell_w = self.get_string_width(chapter_name) + 100
        reset_x = lambda : self.set_x((self.w - cell_w) / 2)
        image_y = 60
        image_x = 25

        self.set_text_color(0, 0, 0)

        self.set_line_width(1)

        reset_x()
        self.cell(cell_w, 15, f'{chapter_name}', align='C', ln=1)
        self.ln(10)

        self.set_font('Arial', 'B', 12)
        
        datas = []

        reported_question_number = 0
        reported_question_correct_answers = 0
        reported_question_wrong_answers = 0

        for i in range(1, self.number_of_questions + 1) :
            data = self.user_math_game_answers["q"+str(i)]
            if not data == None :
                datas.append(data)

                result = bool(data["result"])

                if result :
                    reported_question_correct_answers += 1
                else :
                    reported_question_wrong_answers += 1

                reported_question_number += 1
        
        is_result_head = False
        i = 1
        boundary = 4
        while i <= len(datas):

            if (i == 1 and is_result_head == False):
                
                text1 = f"Reported Question Number: {reported_question_number}"
                text2 = f"Correct Answers: {reported_question_correct_answers}"
                text3 = f"Wrong Answers: {reported_question_wrong_answers}"
                text4 = f"Total Score: {round(reported_question_correct_answers * 100 / reported_question_number, 2)}%"

                cell_pad = 5
                pad_x = self.get_string_width(text2)
                pad_y = 10
                border = 0

                self.set_text_color(0,0,0)
                self.set_font('Arial', 'I', 15)
                self.cell(cell_pad)
                self.cell(pad_x, pad_y, f'{text1}', align='L', ln=1, border=border)

                self.cell(cell_pad)
                self.cell(pad_x, pad_y, f'{text2}', align='L', ln=1, border=border)

                self.cell(cell_pad)
                self.cell(pad_x, pad_y, f'{text3}', align='L', ln=1, border=border)

                self.cell(cell_pad)
                self.cell(pad_x, pad_y, f'{text4}', align='L', ln=1, border=border)

                self.ln(15)

                is_result_head = False
            
            data = datas[i-1]

            correct_answer = data["correct_answer"]
            first_number = data["first_number"]
            second_number = data["second_number"]
            operator = "x" if data["operator"] == "*" else data["operator"]
            result = data["result"]
            user_answer = data["user_answer"]

            text1 = f"Question {i}"
            text2 = f"This question answered " + ("correctly" if bool(result) else "incorrectly" + "!")
            text3 = f"{first_number} {operator} {second_number} = {correct_answer}"
            text4 = "" if bool(result) else f"User answer: {user_answer}"

            resultTextColor = (0,255,0) if bool(result) else (255,0,0)
            cell_pad = 10
            pad_x = self.get_string_width(text2)
            pad_y = 7
            border = 0

            self.set_text_color(0,0,0)
            self.set_font('Arial', 'B', 16)
            self.cell(cell_pad)
            self.cell(pad_x, pad_y, f'{text1}', align='L', ln=1, border=border)

            self.set_text_color(*resultTextColor)
            self.set_font('Arial', 'I', 12)
            self.cell(cell_pad)
            self.cell(pad_x, pad_y, f'{text2}', align='L', ln=1, border=border)

            self.set_text_color(0,0,255)
            self.set_font('Times', 'B', 16)
            self.cell(cell_pad)
            self.cell(pad_x, pad_y, f'{text3}', align='L', ln=1, border=border)

            self.set_text_color(0,0,0)
            self.set_font('Arial', 'BU', 14)
            self.cell(cell_pad)
            self.cell(pad_x, pad_y, f'{text4}', align='L', ln=1, border=border)

            self.ln(15)

            if (i == boundary) :
                if (i != len(datas)) :
                    self.add_page()
                    self.ln(30)
                boundary+=5

            i+=1

def count_game_reporting(mongo, user_id) :
    try :
        pdf = Count_Game_PDF(mongo, user_id)
        pdf.set_auto_page_break(auto = True, margin = 15)
        pdf.set_margins(15, 15, 15)
        pdf.add_page()
        pdf.write_initial_page()
        pdf.write_data()
        pdf.output("user_reports/count_game_" + str(user_id) + ".pdf")    
    except Exception as e :
        print(e)
        print("Error in count game reporting")

def math_game_reporting(mongo, user_id) :
    try :
        pdf = Math_Game_PDF(mongo, user_id)
        pdf.set_auto_page_break(auto = True, margin = 15)
        pdf.set_margins(15, 15, 15)
        pdf.add_page()
        pdf.write_initial_page()
        pdf.write_data()
        pdf.output("user_reports/math_game_" + str(user_id) + ".pdf")    
    except Exception as e :
        print(e)
        print("Error in math_game_reporting")