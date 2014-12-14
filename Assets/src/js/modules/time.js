// Calculates the time for a given watch
function calcTime(id, time) {
	var $time = $('#' + id).find('.time'),
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

function padZeroes(number) {
	if (number < 10) {
		return "0" + number;
	}
	else {
		return number;
	}
}

exports.calcTime = calcTime;