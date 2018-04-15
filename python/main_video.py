from flask import Flask, Response
from flask_cors import CORS, cross_origin
from camera import VideoCamera

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

respuesta = None


def generate_respuesta():
    global respuesta
    respuesta = Response(gen(VideoCamera()),
                         mimetype='multipart/x-mixed-replace; boundary=frame')


def gen(camera):
    while True:
        frame = camera.get_frame()
        if frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def video_feed():
    if respuesta is None:
        generate_respuesta()
    return respuesta


if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)
