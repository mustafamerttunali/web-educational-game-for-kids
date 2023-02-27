FROM python:3.9

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

ENV PORT 5000

EXPOSE 5000

CMD [ "flask", "run", "--host=0.0.0.0"]