'use strict';

var audio = [];
var numLoaded = 0;
var correctAnswer;
var saying = false;
var transitioning = false;

$(function() {
	loadAudio();

	setTimeout(function() {
		$('#say').focus();
	}, 0);

	$('#step-1 form').submit(function(e) {
		e.preventDefault();

		if (correctAnswer) {
			return;
		}

		var numDigits = Number($('#digits').val().replace(/\D/g, ''));
		var numSeconds = Number($('#seconds').val().replace(/\D/g, ''));
		correctAnswer = generateDigits(!isNaN(numDigits) ? numDigits : 5);
		saying = true;

		correctAnswer.forEach(function(digit, i) {
			setTimeout(function() {
				if (saying) {
					audio[digit].play();
				}
			}, i * 800);
		});

		setTimeout(function() {
			nextStep();
			saying = false;
			console.log(numSeconds);
			countdown(!isNaN(numSeconds) ? numSeconds : 30);
		}, correctAnswer.length * 800);
	});

	$('#digits')
		.val(localStorage.digits || 5)
		.change(function() {
			var val = $(this).val();
			val = !isNaN(val) && val > 0 ? val : 5
			localStorage.digits = val;
			$(this).val(val);
		})
		.keypress(function(e) {
			var val = $(this).val();
			if (val.length >= 2) {
				e.preventDefault();
			}
		});

	$('#seconds')
		.val(localStorage.seconds || 30)
		.change(function() {
			var val = $(this).val();
			val = !isNaN(val) && val > 0 ? val : 30
			localStorage.seconds = val;
			$(this).val(val);
		})
		.keypress(function(e) {
			var val = $(this).val();
			if (val.length >= 2) {
				e.preventDefault();
			}
		});

	$('#step-3 form').submit(function(e) {
		e.preventDefault();

		var answer = $('#number').val() + '';
		var correct = correctAnswer.join('');

		nextStep();
		setTimeout(function() {
			$('#retry').focus().addClass('visible');
		}, 0);

		$('#step-4').removeClass('fail');

		console.log(answer, correct);

		if (answer !== correct) {
			$('#step-4').addClass('fail');
			$('#your-answer').text(answer.length ? answer : ' ');
			$('#correct-answer').text(correct);
		}
	});

	$('#retry').click(function() {
		reset();
		nextStep();
	});

	nextStep();
})

function reset() {
	saying = false;
	$('#retry').removeClass('visible');
	$('#number').val('');
	$('#reward').attr('src', 'http://thecatapi.com/api/images/get?format=src&size=small&type=gif&v=' + new Date().getTime());
	correctAnswer = null;
	setTimeout(function() {
		$('#say').focus();
	}, 0);
}

function loadAudio() {
	for (var i = 0; i < 10; i++) {
		var newAudio = new Audio('audio/' + i + '.mp3');
		newAudio.preload = 'auto';
		audio.push(newAudio);
		newAudio.addEventListener('canplaythrough', function() {
			numLoaded++;
			if (numLoaded === 10) {
				$('#say').prop('disabled', false);
			}
		})
	}
}

function generateDigits(numDigits) {
	var digits = [];
	var random = '';

	while (digits.length < numDigits) {
		digits.push(Math.floor(Math.random() * 9));
	}

	return digits;
}

function countdown(from) {
	$('#timer').text('0:' + (from < 10 ? '0' + from : from));

	setTimeout(function() {
		if (from > 0) {
			countdown(from - 1);
		} else {
			nextStep();
			setTimeout(function() {
				$('#number').focus();
			}, 0);
		}
	}, 1000);
}

function nextStep() {
	var currentStep = Number($('body').attr('data-step'));

	if (isNaN(currentStep) || currentStep >= 4 || currentStep < 1) {
		$('body').attr('data-step', 1);
	} else {
		$('body').attr('data-step', currentStep + 1);
	}
}
