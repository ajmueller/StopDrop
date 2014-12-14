var watches = require('./watches.js'),
	options = require('./options.js');

// Calculates the time for a given watch
function calcTime(id, time) {
	var $time = $('#' + id).find('.time'),
		time = Math.floor(time / 1000),		// convert milliseconds to seconds
		hours = Math.floor(time / 3600),
		quarters = Math.round((time % 3600) / 900),
		minutes = Math.floor((time % 3600) / 60),
		seconds = (time % 3600) % 60,
		bigTimeHours = hours + (quarters * 0.25),
		noun = (bigTimeHours === 1) ? 'hour' : 'hours',
		text = padZeroes(hours) + ":" + padZeroes(minutes) + ":" + padZeroes(seconds) + " (" + bigTimeHours + " " + noun + ")";

	$time.text(text);

	return text;
}

// Pauses tracking for a watch
function pauseTime(id) {
	var watch = watches.getWatch(id),
		$watch = $('#' + id),
		$pause = $watch.find('.pause'),
		$start = $watch.find('.start'),
		sessionStart = watch.get('sessionStart'),
		sessionEnd = new Date(),
		sessionTime = sessionEnd - sessionStart,
		totalTime = watch.get('totalTime') + sessionTime;

	watch
		.set('sessionStart', sessionStart)
		.set('sessionEnd', sessionEnd)
		.set('sessionTime', sessionTime)
		.set('totalTime', totalTime)
		.set('tracking', false);

	$watch.removeClass('tracking');
	$pause.addClass('hide');
	$start.removeClass('hide');

	console.log('time paused for ' + id);
}

// Starts tracking for a watch
function startTime(id) {
	var watch = watches.getWatch(id),
		$watch = $('#' + id),
		$pause = $watch.find('.pause'),
		$start = $watch.find('.start'),
		$time = $watch.find('.time'),
		sessionStart = new Date(),
		$trackingWatches = $('.tracking');

	// pause all watches that are tracking
	if (options.getOption('singleWatch')) {
		$trackingWatches.each(function() {
			pauseTime($(this).attr('id'));
		});
	}

	watch
		.set('sessionStart', sessionStart)
		.set('tracking', true);

	$watch.addClass('tracking');
	$pause.removeClass('hide');
	$start.addClass('hide');
	$time.text("Tracking...");
}

function padZeroes(number) {
	if (number < 10) {
		return "0" + number;
	}
	else {
		return number;
	}
}

exports.calcTime = calcTime;
exports.pauseTime = pauseTime;
exports.startTime = startTime;