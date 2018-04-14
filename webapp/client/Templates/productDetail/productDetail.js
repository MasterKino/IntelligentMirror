import '../../Stylesheets/mirror_img.css';
import '../../Stylesheets/modal.css';
import '../../Stylesheets/microphone.css';

const opts = {
	lang: 'en'
};

// Template.productDetail
Template.productDetail.created = function() {
	let instance = this;

	instance.transcript = new ReactiveVar('');
	instance.transcriptFinalized = new ReactiveVar(false);
	instance.listening = new ReactiveVar(false);
	instance.recastResult = new ReactiveVar(null);

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
};

Template.productDetail.destroyed = function() {
	this.recognition.stop();
};

Template.productDetail.helpers({
	getTranscript() {
		return Template.instance().transcript.get();
	},
	getTranscriptFinalized() {
		return Template.instance().transcriptFinalized.get();
	},
	isListening() {
		return Template.instance().listening.get();
	},
	recastSlugIs(compareSlug) {
		let { intent } = Template.instance().recastResult.get();

		if (intent) {
			return intent.slug === compareSlug;
		}
	},
	recastSlugKnown() {
		let result = Template.instance().recastResult.get();

		if (!result || !result.intent) return false;

		// forget why I have this check
		return result.intent.slug.length > 0;
	},
	getRecastResult() {
		return Template.instance().recastResult.get();
	},
	recastColor() {
		let { entities } = Template.instance().recastResult.get();

		return (
			entities && entities.color && entities.color[0].raw.toLowerCase()
		);
	}
});

Template.productDetail.events = {
	'click .js-toggle-mic'(event, instance) {
		instance.listening.set(!instance.listening.get());
	},
	'click .js-submit-text'(event, instance) {
		sendTextToVoice(document.querySelector('.js-input-text').value);
	},
	'click .js-modal-close'(event, instance) {
		// document.querySelector('.js-modal').classList.remove('visible');
		event.currentTarget.parentElement.parentElement.classList.remove('visible');
	},
	'click .js-sa-modal'(event, instance) {
		document.getElementById('SAModal').classList.add('visible');
	},
	'click .js-audio-modal'(event, instance) {
		document.getElementById('audioModal').classList.add('visible');
	}
};
//
// function findAncestor (el, cls) {
//     while ((el = el.parentElement) && !el.classList.contains(cls));
//     return el;
// }

function updateScroll(){
	var element = document.querySelector(".js-modal-list");
	element.scrollTop = element.scrollHeight;
}

function sendTextToVoice(text) {
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
		url: 'http://localhost:5000/speak',
		data: JSON.stringify({
			text: text
		}),
		success: function(response) {
			console.log('---[OK]: ');
			console.log(response);

			document.querySelector('.js-modal-response').classList.add('visible');
			document.querySelector('.js-modal-header').classList.add('visible');

			let newLi = document.createElement('li');
			newLi.appendChild(document.createTextNode(response));
			newLi.classList.add('modal__answer');

			setTimeout(function() {
				document.querySelector('.js-modal-list').appendChild(newLi);
				updateScroll();
			}, 300)
		},
		error: function(response, error) {
			console.log('---[KO]: ');
			console.log(response);
			console.log(error);
		}
	});
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

//---------Ajax for red colour----------

// if (result.intent.confidence > 0.6) {
// 	instance.recastResult.set(result);
//
// 	let thing = '';
// 	if (
// 		result.intent &&
// 		result.intent.slug === 'change-shirt-color' &&
// 		result.entities.color
// 	) {
//
// 		$.ajax({
// 			type: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			url: 'http://localhost:5000/load_ajax',
// 			data: JSON.stringify({
// 				color: result.entities.color[0].rgb
// 			}),
// 			success: function(response) {
// 				console.log('OK : ');
// 				console.log(response);
// 			},
// 			error: function(response, error) {
// 				console.log('KO : ');
// 				console.log(response);
// 				console.log(error);
// 			}
// 		});
// 	}
// }
