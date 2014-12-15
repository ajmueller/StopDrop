require('./vendor/jquery.min.js');
require('./vendor/jquery.ui-custom.min.js');
require('./vendor/jquery.ui-touch-punch.min.js');
require('./vendor/jquery.mobile-events.min.js');
var dataLayer = require('./modules/dataLayer.js'),
	options = require('./modules/options.js'),
	watches = require('./modules/watches.js'),
	time = require('./modules/time.js'),
	client = null;

$(function() {
	// binds all clicks and change events to UI elements
	function bindInteractions() {
		// ----- CONTROLS ------
		$(document).on('click', '.start', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.startTime(id);
		});

		$(document).on('click', '.pause', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.pauseTime(id);
		});

		$('.pause-all').click(function() {
			time.pauseAll();
		});

		$(document).on('click', '.delete', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			watches.deleteWatch(id);
		});

		$('.delete-all').click(function() {
			watches.deleteAll();
		});

		$(document).on('click', '.reset', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.resetTime(id);
		});

		$('.reset-all').click(function() {
			time.resetAll();
		});

		$(document).on('click', '.add', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.adjustTime(id, 'add');
		});

		$(document).on('click', '.subtract', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.adjustTime(id, 'subtract');
		});

		$(document).on('click', '.colors div', function() {
			var $this = $(this),
				id = $this.parents('.stopwatch').attr('id'),
				theme = $this.attr('class');

			watches.setTheme(id, theme);
		});

		$('.expand-all').click(function() {
			watches.expandAll();
		});

		$('.collapse-all').click(function() {
			watches.collapseAll();
		});

		// ----- WATCHES ------
		$('.new').click(function(e) {
			watches.createWatch();
		});


		// ------ LOGIN -------
		$('#authenticate').click(function(e) {
			client.authenticate();
		});


		// ----- OPTIONS -----
		$('#singleWatch').on('change', function() {
			options.updateOption('singleWatch', $(this).is(':checked'));
		});

		$('#trackImmediately').on('change', function() {
			options.updateOption('trackImmediately', $(this).is(':checked'));
		});

		console.log('interactions bound');
	}

	// init
	(function() {
		client = dataLayer.getClient();
		bindInteractions();

		if(client.isAuthenticated()) {
			dataLayer.getDatastoreManager();
		}
	})();
});