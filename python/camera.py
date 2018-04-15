import os.path
import cv2
import math
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


class MyEventHandler(PatternMatchingEventHandler):
    def __init__(self, videocam, patterns):
        PatternMatchingEventHandler.__init__(self, patterns=patterns)
        self.videocam = videocam

    def on_moved(self, event):
        super(MyEventHandler, self).on_moved(event)
        print("File %s was just moved" % event.src_path)

    def on_created(self, event):
        super(MyEventHandler, self).on_created(event)
        print("File %s was just created" % event.src_path)

    def on_deleted(self, event):
        super(MyEventHandler, self).on_deleted(event)
        print("File %s was just deleted" % event.src_path)

    def on_modified(self, event):
        super(MyEventHandler, self).on_modified(event)
        print("File %s was just modified" % event.src_path)
        with open(event.src_path, 'r') as myfile:
            data = myfile.read().replace('\n', '')
            self.videocam.set_color(data)


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)

        watched_dir = os.path.split("/tmp/hackadidas_color")[0]
        patterns = ["/tmp/hackadidas_color"]
        event_handler = MyEventHandler(self, patterns)
        self.observer = Observer()
        self.observer.schedule(event_handler, watched_dir, recursive=True)
        self.observer.start()

    def __del__(self):
        self.video.release()
        self.observer.stop()

    def get_frame(self):
        success, image = self.video.read()
        if success:
            image = cv2.flip(image, flipCode=1)
            (h, w, d) = image.shape
            # w:h == 11:16
            width = math.floor((11*h/16)/2)
            stx = math.floor(w/2) - width
            endx = math.floor(w/2) + width
            img = image[0:h, stx:endx]

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            head_x = math.floor((endx-stx)/2)
            head_y = math.floor(h*140/720)

            faces = face_cascade.detectMultiScale(gray, 1.3, 5)
            if len(faces) > 0:
                (x, y, wf, hf) = faces[0]
                x_c = math.floor(x + wf/2)
                y_c = math.floor(y + hf/2)
                if abs(head_x-x_c)+abs(head_y-y_c) < 50:
                    if wf < (endx-stx)/2:
                        cv2.rectangle(img, (x, y), (x+wf, y+hf), (0, 255, 0), 2)
                    else:
                        cv2.rectangle(img, (x, y), (x+wf, y+hf), (0, 255, 255), 2)
                else:
                    cv2.rectangle(img, (x, y), (x+wf, y+hf), (0, 0, 255), 2)
            ret, jpeg = cv2.imencode('.jpg', img)
            return jpeg.tobytes()
        else:
            return None
