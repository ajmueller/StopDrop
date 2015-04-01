var options = require('./options.js'),
	time = require('./time.js'),
	charts = require('./charts.js');

// retrieves the user's watches from their datastore
function getWatches() {
	var watches = datastore.getTable('watches');

	return watches.query();
}

function getWatch(id) {
	var watches = datastore.getTable('watches');

	return watches.get(id);
}

function createWatch() {
	var watchesTable = datastore.getTable('watches'),
		watch = null,
		watchId = null,
		watchName = window.prompt('Please enter a name for this watch:'),
		tracking = options.getOption('trackImmediately'),
		singleWatch = options.getOption('singleWatch');

	tracking = tracking.get('value');
	singleWatch = singleWatch.get('value');

	// add watch to datastore
	if (watchName) {
		if (singleWatch) {
			$('.tracking').each(function() {
				time.pauseTime($(this).attr('id'));
			});
		}

		watch = watchesTable.insert({
			name: watchName,
			sessionStart: new Date(),
			sessionEnd: new Date(),
			sessionTime: 0,
			totalTime: 0,
			tracking: tracking,
			collapsed: false,
			order: 0,
			theme: 'blue',
			note: ''
		});
	}
}

function deleteWatch(id, confirm) {
	function deleteWatchConfirmed() {
		$('#' + id).hide(500, function() {
			var watch = getWatch(id);

			removeWatch(id);
			watch.deleteRecord();
		});
	}

	if (confirm) {
		deleteWatchConfirmed();
	}
	else if (window.confirm('Are you sure you want to delete this watch?')) {
		deleteWatchConfirmed();
	}
}

function deleteAll() {
	var watches = getWatches();

	if (window.confirm('Are you sure you want to delete all watches?')) {
		watches.forEach(function(watch) {
			var id = watch.getId();

			deleteWatch(id, true);
		});
	}
}

function setTheme(id, theme) {
	var watch = getWatch(id);

	watch.set('theme', theme);
}

function expandAll() {
	var watches = getWatches();

	watches.forEach(function(watch) {
		var id = watch.getId();

		$('#' + id).removeClass('collapsed');
		watch.set('collapsed', false);
	});
}

function collapseAll() {
	var watches = getWatches();

	watches.forEach(function(watch) {
		var id = watch.getId();

		$('#' + id).addClass('collapsed');
		watch.set('collapsed', true);
	});
}

function toggleCollapsed(id) {
	var watch = getWatch(id),
		$watch = $('#' + id);

	$watch.toggleClass('collapsed');
	watch.set('collapsed', $watch.hasClass('collapsed'));
}

function updateOrder(results) {
	results.forEach(function(watchId, i) {
		var watch = getWatch(watchId);

		watch.set('order', i);
	});
}

function updateName(id, name) {
	var watch = getWatch(id);

	watch.set('name', name);
}

function updateNote(id, note) {
	var watch = getWatch(id);

	watch.set('note', note);
}

function appendWatch(id, watch) {
	var status,
		buttons,
		html,
		colors = '<div class="colors"><div class="black"></div><div class="red"></div><div class="orange"></div><div class="yellow"></div><div class="green"></div><div class="blue"></div><div class="violet"></div></div>',
		note = (watch.note == null) ? '' : watch.note;

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

	html = '<li class="stopwatch ' + watch.theme + '" id="' + id + '"><div class="properties"><span class="name">' + watch.name + '</span><span class="time">' + status + '</span><textarea class="note" placeholder="Note">' + note + '</textarea></div><div class="controls">' + buttons + '<button class="delete control"><span></span></button><button class="reset control"><span>000</span></button><button class="add control"><span></span></button><button class="subtract control"><span></span></button></div>' + colors + '</li>';
	$('.watches').append(html);
}

function appendWatches() {
	var watches = getWatches();

	if (watches.length > 0) {
		watches.forEach(function(watch) {
			var watchId = watch.getId(),
				watchToAppend = {
					name: watch.get('name'),
					theme: watch.get('theme'),
					totalTime: watch.get('totalTime'),
					tracking: watch.get('tracking'),
					collapsed: watch.get('collapsed'),
					note: watch.get('note')
				};

			appendWatch(watchId, watchToAppend);
		});

		time.calcTotalTime();
	}
}

function resetWatch(id, confirm) {
	var watch = getWatch(id);

	function resetWatch() {
		time.pauseTime(id);

		watch
			.set('sessionStart', 0)
			.set('sessionEnd', 0)
			.set('sessionTime', 0)
			.set('totalTime', 0)
			.set('note', '');
	}

	if (confirm) {
		resetWatch();
	}
	else if (window.confirm('Are you sure you want to reset this watch?')) {
		resetWatch();
	}
}

function resetAll(id) {
	var allWatches = getWatches();

	if (confirm('Are you sure you want to reset all watches?')) {
		allWatches.forEach(function(watch) {
			var id = watch.getId();

			resetWatch(id, true);
		});
	}
}

// Removes a watch from the DOM
function removeWatch(id) {
	$('#' + id).remove();
}

// sets up listener to sync watches UI
function setWatchesSync() {
	datastore.recordsChanged.addListener(function(e) {
		var watches = getWatches();

		$('.watches').empty();

		watches.forEach(function(watch) {
			var watchId = watch.getId(),
				watchToAppend = {
					name: watch.get('name'),
					theme: watch.get('theme'),
					totalTime: watch.get('totalTime'),
					tracking: watch.get('tracking'),
					collapsed: watch.get('collapsed'),
					note: watch.get('note')
				};

			appendWatch(watchId, watchToAppend);
		});

		time.calcTotalTime();
		charts.drawChart();
	});
}

exports.getWatches = getWatches;
exports.getWatch = getWatch;
exports.createWatch = createWatch;
exports.deleteWatch = deleteWatch;
exports.deleteAll = deleteAll;
exports.appendWatches = appendWatches;
exports.setTheme = setTheme;
exports.expandAll = expandAll;
exports.collapseAll = collapseAll;
exports.toggleCollapsed = toggleCollapsed;
exports.updateOrder = updateOrder;
exports.updateName = updateName;
exports.updateNote = updateNote;
exports.resetWatch = resetWatch;
exports.resetAll = resetAll;
exports.setWatchesSync = setWatchesSync;