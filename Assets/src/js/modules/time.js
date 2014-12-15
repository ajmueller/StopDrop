var watches = require('./watches.js'),
	options = require('./options.js');

// Calculates the time for a given watch
function formatTime(time) {
	var time = Math.floor(time / 1000),		// convert milliseconds to seconds
		hours = Math.floor(time / 3600),
		quarters = Math.round((time % 3600) / 900),
		minutes = Math.floor((time % 3600) / 60),
		seconds = (time % 3600) % 60,
		bigTimeHours = hours + (quarters * 0.25),
		noun = (bigTimeHours === 1) ? 'hour' : 'hours',
		text = padZeroes(hours) + ":" + padZeroes(minutes) + ":" + padZeroes(seconds) + " (" + bigTimeHours + " " + noun + ")";

	return text;
}

// Calculates time rounded to 0.25 hours
function roundTime(time) {
	var time = Math.floor(time / 1000),		// convert milliseconds to seconds
		hours = Math.floor(time / 3600),
		quarters = Math.round((time % 3600) / 900),
		roundedTime = hours + (quarters * 0.25);

	return roundedTime;
}

// Calculates the total time for one watch
function calcTime(id, time) {
	var $time = $('#' + id).find('.time'),
		text = formatTime(time);

	$time.text(text);

	return text;
}

// Calculates the total time for all watches
function calcTotalTime() {
	var allWatches = watches.getWatches(),
		totalTime = 0,
		totalRoundedTime = 0,
		$total = $('.sum'),
		$roundedTotal = $('.rounded-sum');

	allWatches.forEach(function(watch) {
		totalTime += watch.get('totalTime');
		totalRoundedTime += roundTime(watch.get('totalTime'));
	});

	totalRoundedTime += " " + ((totalRoundedTime === 1) ? 'hour' : 'hours');

	$total.text(formatTime(totalTime));
	$roundedTotal.text(totalRoundedTime);
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

	calcTotalTime();
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

// Resets the time for a watch
function resetTime(id) {
	var watch = watches.getWatch(id);

	if (window.confirm('Are you sure you want to reset this watch?')) {
		pauseTime(id);

		watch
			.set('sessionStart', 0)
			.set('sessionEnd', 0)
			.set('sessionTime', 0)
			.set('totalTime', 0);
	}
}

// Adds 15 minutes to a watch
function addTime(id) {
	var watch = watches.getWatch(id),
		timeToAdd = 15 * 60 * 1000,
		$watch = $('#' + id);

	if ($watch.is('.tracking')) {
		pauseTime(id);
	}

	watch
		.set('totalTime', watch.get('totalTime') + timeToAdd)
		.set('tracking', false);
}

// Subtracts 15 minutes from a watch
function subtractTime(id) {
	var watch = watches.getWatch(id),
		totalTime = watch.get('totalTime'),
		timeToSubtract = 15 * 60 * 1000,
		$watch = $('#' + id);

	if ($watch.is('.tracking')) {
		pauseTime(id);
	}

	if (totalTime >= timeToSubtract) {
		watch
			.set('totalTime', watch.get('totalTime') - timeToSubtract)
			.set('tracking', false);
	}
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
exports.calcTotalTime = calcTotalTime;
exports.pauseTime = pauseTime;
exports.startTime = startTime;
exports.resetTime = resetTime;
exports.addTime = addTime;
exports.subtractTime = subtractTime;