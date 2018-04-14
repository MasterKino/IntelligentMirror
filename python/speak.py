from gtts import gTTS
import os

def speak_out_loud(text=''):
    tts = gTTS(text=text, lang='en-uk')
    tts.save("tmp.mp3")
    os.system("mpg321 tmp.mp3")
    os.system("rm tmp.mp3")


def compare(text=''):
    if

def answer(raw_input=''):
   input = raw_input.split()




