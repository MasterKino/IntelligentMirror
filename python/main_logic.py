import json
from flask import Flask, request
from flask_cors import CORS, cross_origin
from services import answerService, store_name, speak_out_loud
# from services import answer, confirmation, speak_out_loud

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/speak', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def speak():
    data = request.data
    if isinstance(data, bytes):
        data = data.decode('utf-8')
    text = json.loads(data)['text']
    print(text)
    # speak_out_loud(text)
    return '200'


@app.route('/answer', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def answer():
    data = request.data
    if isinstance(data, bytes):
        data = data.decode('utf-8')
    text = json.loads(data)['text']
    # text = request.form['text']
    # print(text)
    response = answerService(text)
    return response


@app.route('/name', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def name():
    data = request.data
    if isinstance(data, bytes):
        data = data.decode('utf-8')
    text = json.loads(data)['text']
    # text = request.form['text']
    # print(text)
    response = store_name(text)
    return response


# @app.route('/confirmation', methods=['GET', 'POST'])
# @cross_origin(origin='*', headers=['Content-Type','Authorization'])
# def question_confirmation():
#     # data = request.data
#     # text = json.loads(data)['text']
#     # keyword = json.loads(data)['keyword']
#     text = request.form['text']
#     keyword = request.form['keyword']
#     print(text)
#     print(keyword)
#     response = confirmation(text, keyword)
#     return response


if __name__ == '__main__':
    app.run(host='localhost', debug=True)
