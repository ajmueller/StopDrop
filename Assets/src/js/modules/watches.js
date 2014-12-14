var watches = null,
	options = require('./options.js'),
	time = require('./time.js');

// retrieves the user's watches from their datastore
function getWatches() {
	watches = datastore.getTable('watches');

	return watches.query();
}

function getWatch(id) {
	return watches.get(id);
}

function createWatch() {
	var watch = null,
		watchId = null,
		watchName = window.prompt('Please enter a name for this watch:'),
		tracking = options.getOption('trackImmediately');

	tracking = tracking.get('value');

	// add watch to datastore
	if (watchName) {
		watch = watches.insert({
			name: watchName,
			sessionStart: new Date(),
			sessionEnd: new Date(),
			sessionTime: 0,
			totalTime: 0,
			tracking: tracking,
			collapsed: false,
			rank: 0,
			theme: 'blue'
		});
	}
}

function setTheme(id, theme) {
	var watch = getWatch(id);

	watch.set('theme', theme);
	console.log('updated theme for ' + id + ' to ' + theme);
}

function appendWatch(id, watch) {
	var status,
		buttons,
		html,
		colors = '<div class="colors"><div class="black"></div><div class="red"></div><div class="orange"></div><div class="yellow"></div><div class="green"></div><div class="blue"></div><div class="violet"></div></div>';

	if (watch.tracking) {
		status = "Tracking...";
		watch.theme += " tracking";
		buttons = '<button class="start hide control"><span></span></button><button class="pause control"><span></span></button>';
	}
	else {
		buttons = '<button class="start control"><span></span></button><button class="pause hide control"><span></span></button>';
		status = time.calcTime(id, watch.totalTime);
	}

	if (watch.collapsed) {
		watch.theme += " collapsed";
	}

	html = '<li class="stopwatch ' + watch.theme + '" id="' + id + '"><div class="properties"><span class="handle">&#x2261;</span><span class="name">' + watch.name + '</span><span class="time">' + status + '</span></div><div class="controls">' + buttons + '<button class="delete control"><span></span></button><button class="reset control"><span>000</span></button><button class="add control"><span></span></button><button class="subtract control"><span></span></button></div>' + colors + '</li>';
	$('.watches').append(html);

	console.log('Watch with ID ' + id + ' added to UI');
}

function appendWatches() {
	getWatches();

	if (watches.query().length > 0) {
		watches.query().forEach(function(watch) {
			var watchId = watch.getId(),
				watchToAppend = {
					name: watch.get('name'),
					theme: watch.get('theme'),
					totalTime: watch.get('totalTime'),
					tracking: watch.get('tracking'),
					collapsed: watch.get('collapsed')
				};

			appendWatch(watchId, watchToAppend);
		});
	}
}

function removeWatch(id) {
	$('#' + id).remove();
}

// sets up listener to sync watches UI
function setWatchesSync() {
	datastore.recordsChanged.addListener(function(e) {
		var watchesAffected = e.affectedRecordsForTable('watches');

		watchesAffected.forEach(function(watch) {
			var watchId = watch.getId(),
				watchToAppend = {
					name: watch.get('name'),
					theme: watch.get('theme'),
					totalTime: watch.get('totalTime'),
					tracking: watch.get('tracking'),
					collapsed: watch.get('collapsed')
				};

			removeWatch(watchId);
			appendWatch(watchId, watchToAppend);
		});
	});
}

exports.getWatches = getWatches;
exports.getWatch = getWatch;
exports.createWatch = createWatch;
exports.appendWatches = appendWatches;
exports.setTheme = setTheme;
exports.setWatchesSync = setWatchesSync;