from gtts import gTTS
import os
import spacy
import nltk
import numpy as np

nlp = spacy.load('en')

assistant_phrase_list = ['call an assistant',
                         'call some help',
                         'i need help',
                         'i need assistance']

price_phrase_list = ['how much does it cost',
                     'what is the price',
                     'how expensive is this']

size_phrase_list = ['are there other sizes',
                    'this is too small',
                    'this is too large']

keywords_list = ['assist',
                 'price',
                 'size']


def get_human_names(text=''):
    tokens = nltk.tokenize.word_tokenize(text)
    pos = nltk.pos_tag(tokens)
    sentt = nltk.ne_chunk(pos, binary=False)
    person_list = []
    person = []
    name = ""
    for subtree in sentt.subtrees(filter=lambda t: t.label() == 'PERSON'):
        for leaf in subtree.leaves():
            person.append(leaf[0])
        if len(person) > 1:
            for part in person:
                name += part + ' '
            if name[:-1] not in person_list:
                person_list.append(name[:-1])
            name = ''
        person = []
    return person_list


def speak_out_loud(text=''):
    tts = gTTS(text=text, lang='en-uk')
    tts.save("tmp.mp3")
    os.system("mpg321 tmp.mp3")
    os.system("rm tmp.mp3")


def mean_similarity_to_list(phrase=None, phrase_list=None):
    doc1 = nlp(phrase)
    if phrase_list is not None:
        mean = 0
        for phrase_other in phrase_list:
            mean += doc1.similarity(nlp(phrase_other))
        mean /= len(phrase_list)
        return mean
    else:
        return 0


def get_keyword(text=None):
    scores = list()
    scores.append(mean_similarity_to_list(text, assistant_phrase_list))
    scores.append(mean_similarity_to_list(text, price_phrase_list))
    scores.append(mean_similarity_to_list(text, size_phrase_list))
    # for key, score in zip(keywords_list, scores):
    #     print('{} has score:\t {}'.format(key, round(score, 2)))
    keyword = keywords_list[int(np.argmax(scores))]
    if np.max(scores) > 0.2:
        return keyword
    else:
        return None


def get_name(text=''):
    text = text.split()
    for i, word in enumerate(text):
        if word == 'is':
            try:
                return text[i+1]
            except:
                return ''
    return ''


def answer(raw_input=''):
    keyword = get_keyword(raw_input)
    if keyword == 'price':
        return '39.90 euros', keyword
    elif keyword == 'assist':
        return 'Do you want me to call and assistant?', keyword
    elif keyword == 'size':
        return 'Would you want to know the available sizes for this product?', keyword
    else:
        return 'I did not understand that...', 'not_understood'


def confirmation(raw_input='', keyword=''):
    yes_score = mean_similarity_to_list(raw_input, ['yes', 'affirmative', 'sure'])
    nop_score = mean_similarity_to_list(raw_input, ['no', 'negative'])
    if yes_score > nop_score:
        if keyword == 'assist':
            return 'Okay, calling an assistant!'
        elif keyword == 'size':
            return 'Glad you asked, there are sizes S, M and L available in this store.'
    else:
        return 'Okay, can I help you in anything else?'


def store_name(raw_input=''):
    try:
        _name = get_human_names(raw_input)[0].split()[0]
    except:
        _name = get_name(raw_input)
    return 'Hi ' + _name
