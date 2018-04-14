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
	'click .toggle-listening'(event, instance) {
		instance.listening.set(!instance.listening.get());
	},
	'click .js-submit-text'(event, instance) {
		sendTextToVoice(document.querySelector('.js-input-text').value);
	}
};

function sendTextToVoice(text) {
	console.log('---[Sending Text Voice via Ajax]: ' + text);

	$.ajax({
		type: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		url: 'http://localhost:5000/load_ajax',
		data: JSON.stringify({
			text: text
		}),
		success: function(response) {
			console.log('---[OK]: ');
			console.log(response);
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
