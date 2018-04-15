import '../../Stylesheets/mirror_img.css';
import '../../Stylesheets/modal.css';
import '../../Stylesheets/microphone.css';

const opts = {
	lang: 'en',
	pythonRoute: 'name'
};

// Template.productDetail
Template.productDetail.onCreated(function() {
	let instance = this;

	instance.transcript = new ReactiveVar('');
	instance.transcriptFinalized = new ReactiveVar(false);
	instance.listening = new ReactiveVar(false);

	instance.autorun(() => {
		if (instance.recognition) {
			instance.recognition.stop();
		}

		instance.recognition = new webkitSpeechRecognition();
		setupRecognition(instance);
	});

	instance.autorun(() => {
		if (instance.listening.get()) {
			instance.recognition.start();
		} else {
			instance.recognition.stop();
		}
	});
});

Template.productDetail.destroyed = function() {
	this.recognition.stop();
};

Template.productDetail.onRendered(function () {
	let instance = this;
});

Template.productDetail.helpers({
	getTranscript() {
		return Template.instance().transcript.get();
	},
	getTranscriptFinalized() {
		return Template.instance().transcriptFinalized.get();
	},
	isListening() {
		return Template.instance().listening.get();
	}
});

Template.productDetail.events({
	'click .js-toggle-mic'(event, instance) {
		instance.listening.set(!instance.listening.get());
<<<<<<< HEAD
		document.querySelector('.js-toggle-mic').classList.toggle('microphone--active');
=======
>>>>>>> ea4b75da4e436f4801c890361afadde44e4602f7

		if (!document.querySelector('.js-modal-response').classList.contains('visible')) {

			document.querySelector('.js-modal-response').classList.add('visible');
			document.querySelector('.js-modal-header').classList.add('visible');

			let newLi = document.createElement('li');
			newLi.appendChild(document.createTextNode('What is your name?'));
			newLi.classList.add('modal__answer');
			document.querySelector('.js-modal-list').appendChild(newLi);
		}
	},
	'click .js-submit-text'(event, instance) {
		sendTextToVoice(document.querySelector('.js-input-text').value);
	},
	'click .js-modal-close'(event, instance) {
		event.currentTarget.parentElement.parentElement.classList.remove('visible');
	},
	'click .js-sa-modal'(event, instance) {
		document.getElementById('SAModal').classList.add('visible');
	},
	'click .js-audio-modal'(event, instance) {
		document.getElementById('audioModal').classList.add('visible');
	}
});

function updateScroll(){
	var element = document.querySelector(".js-modal-list");
	element.scrollTop = element.scrollHeight;
}

function sendTextToVoice(text) {
<<<<<<< HEAD

	if(Template.instance().listening.get()) {
		console.log('---[Sending Text Voice via Ajax]: ' + text);

		let newLi = document.createElement('li');
		newLi.appendChild(document.createTextNode(text));
		newLi.classList.add('modal__question');
		document.querySelector('.js-modal-list').appendChild(newLi);

		$.ajax({
			type: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			url:  'http://localhost:5000/' + opts.pythonRoute,
			data: JSON.stringify({
				text: text
			}),
			success: function(response) {
				console.log('---[OK]: ');
				console.log(response);

				opts.pythonRoute = 'answer';

				if (response == 'assist') {
					document.getElementById('audioModal').classList.remove('visible');
					document.getElementById('SAModal').classList.add('visible');
				} else {
					let newLi = document.createElement('li');
					newLi.appendChild(document.createTextNode(response));
					newLi.classList.add('modal__answer');

					setTimeout(function() {
						document.querySelector('.js-modal-list').appendChild(newLi);
						updateScroll();
					}, 300)
				}
			},
			error: function(response, error) {
				console.log('---[KO]: ');
				console.log(response);
				console.log(error);
			}
		});
	}
=======
	console.log('---[Sending Text Voice via Ajax]: ' + text);

	let newLi = document.createElement('li');
	newLi.appendChild(document.createTextNode(text));
	newLi.classList.add('modal__question');
	document.querySelector('.js-modal-list').appendChild(newLi);

	$.ajax({
		type: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		url:  'http://localhost:5000/' + opts.pythonRoute,
		data: JSON.stringify({
			text: text
		}),
		success: function(response) {
			console.log('---[OK]: ');
			console.log(response);

			opts.pythonRoute = 'answer';

			if (response == 'assist') {
				document.getElementById('audioModal').classList.remove('visible');
				document.getElementById('SAModal').classList.add('visible');
			} else {
				let newLi = document.createElement('li');
				newLi.appendChild(document.createTextNode(response));
				newLi.classList.add('modal__answer');

				setTimeout(function() {
					document.querySelector('.js-modal-list').appendChild(newLi);
					updateScroll();
				}, 300)
			}
		},
		error: function(response, error) {
			console.log('---[KO]: ');
			console.log(response);
			console.log(error);
		}
	});
>>>>>>> ea4b75da4e436f4801c890361afadde44e4602f7
}

function setupRecognition(instance) {
	instance.recognition.continuous = true;
	instance.recognition.interimResults = true;

	instance.recognition.lang = opts.lang;

	instance.recognition.onresult = function(event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			let result = event.results[i];

			let { transcript } = result[0];

			instance.transcriptFinalized.set(result.isFinal);
			instance.transcript.set(transcript);

			if (result.isFinal) {
				sendTextToVoice(transcript)
			}
		}
	};

	instance.recognition.onerror = function(event) {
		console.log('error', event);
	};
}
