import json
from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
from camera import VideoCamera
from services import answer, speak_out_loud

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
def gen(camera):
    while True:
        frame = camera.get_frame()
        if frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/speak', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def speak():
    data = request.data
    text = json.loads(data)['text']
    print(text)
    # speak_out_loud(text)
    return '200'


@app.route('/answer', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def answer_question():
    data = request.data
    text = json.loads(data)['text']
    # text = request.form['text']
    # print(text)
    response = answer(text)
    return response


if __name__ == '__main__':
    app.run(host='localhost', debug=True)
