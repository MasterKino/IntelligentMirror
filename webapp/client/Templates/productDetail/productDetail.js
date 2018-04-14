const opts = {
	mirrorClass: '.js-openModal',
	intelligentClass: 'modal--open'
};

// Template.productDetail
Template.productDetail.created = function() {
	let instance = this;

	instance.transcript = new ReactiveVar('');
	instance.transcriptFinalized = new ReactiveVar(false);
	instance.listening = new ReactiveVar(false);
	instance.recastResult = new ReactiveVar(null);
	instance.language = new ReactiveVar('English');

	// handle if language is changed
	let lastLanguage;
	instance.autorun(() => {
		let currentLanguage = instance.language.get();

		if (currentLanguage !== lastLanguage) {
			lastLanguage = currentLanguage;

			if (instance.recognition) {
				instance.recognition.stop();
			}

			// https://github.com/ArnaudGallardo/transcripter/blob/d231930043b9bdb603bc41b29cfcc2e3fbedf2c5/transcripter/client/room.js
			instance.recognition = new webkitSpeechRecognition();
			setupRecognition(instance, currentLanguage);
		}
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

Template.productDetail.rendered = function() {
	let instance = this;

	// TODO: connect to webcam and do it live

	// instance.recognition.lang = instance.data.language;
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
	getLanguage() {
		return Template.instance().language.get();
	},
	recastColor() {
		let { entities } = Template.instance().recastResult.get();

		return (
			entities && entities.color && entities.color[0].raw.toLowerCase()
		);
	}
});

Template.productDetail.events = {
	// 'click .toggle-listening'(event, instance) {
	// 	instance.listening.set(!instance.listening.get());
	// },
	// 'click .select-english'(event, instance) {
	// 	instance.language.set('English');
	// },
	'click .js-submit-text': sendTextToVoice
};

function sendTextToVoice() {
	var text = document.querySelector('.js-input-text').value;
	console.log("---[Sending Ajax]: " + text);

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
			console.log('---[OK] : ');
			console.log(response);
		},
		error: function(response, error) {
			console.log('---[KO] : ');
			console.log(response);
			console.log(error);
		}
	});
}

function setupRecognition(instance, language) {
	instance.recognition.continuous = true;
	instance.recognition.interimResults = true;

	instance.recognition.lang = language === 'English' ? 'en' : 'fr';

	instance.recognition.onresult = function(event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			let result = event.results[i];
			let { transcript } = result[0];

			instance.transcriptFinalized.set(result.isFinal);
			instance.transcript.set(transcript);

			if (result.isFinal) {
				Meteor.call(
					'getRecastIntent',
					transcript,
					language,
					(error, result) => {
						console.log('result:', result);

						if (result.intent.confidence > 0.6) {
							instance.recastResult.set(result);

							let thing = '';
							if (
								result.intent &&
								result.intent.slug === 'change-shirt-color' &&
								result.entities.color
							) {
								console.log('sending down the thing');
								// $.ajax({
								//   type : "POST",
								//   url : "http://localhost:5000/load_ajax",
								//   data: JSON.stringify(result.entities.color[0].rgb, null, '\t'),
								//   contentType: 'application/json;charset=UTF-8',
								// });
								$.ajax({
									type: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									url: 'http://localhost:5000/load_ajax',
									data: JSON.stringify({
										color: result.entities.color[0].rgb
									}),
									success: function(response) {
										console.log('OK : ');
										console.log(response);
									},
									error: function(response, error) {
										console.log('KO : ');
										console.log(response);
										console.log(error);
									}
								});
							}
						}
					}
				);
			}
		}
	};
	instance.recognition.onerror = function(event) {
		console.log('error', event);
	};
}
