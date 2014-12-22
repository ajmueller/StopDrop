// dependencies
require('./vendor/jquery.min.js');
// require('./vendor/jquery.ui-custom.min.js');
// require('./vendor/jquery.ui-touch-punch.min.js');
require('./vendor/jquery.mobile-events.min.js');

// modules
var dataLayer = require('./modules/dataLayer.js'),
	options = require('./modules/options.js'),
	watches = require('./modules/watches.js'),
	time = require('./modules/time.js'),
	client = null;

$(function() {
	// binds all clicks and change events to UI elements
	function bindInteractions() {
		// ----- SORTING ------
		// $('.watches').sortable({
		// 	axis : 'y',
		// 	handle : 'span.handle',
		// 	placeholder : 'placeholder',
		// 	update : function() {
		// 		var results = $(this).sortable('toArray');

		// 		watches.updateOrder(results);
		// 	}
		// });

		// ----- CONTROLS ------
		$(document).on('doubletap', '.stopwatch', function(e) {
			var id = ($(e.target).is('.stopwatch')) ? $(e.target).attr('id') : $(e.target).parents('.stopwatch').attr('id');

			e.preventDefault();

			watches.toggleCollapsed(id);
		});

		$(document).on('click', '.name', function() {
			var $this = $(this),
				name = $this.text();

			$this.replaceWith('<input type="text" class="name-input" value="' + name + '" />');
			$('.name-input').focus();
		});

		$(document).on('blur', '.name-input', function() {
			var $this = $(this),
				id = $this.parents('.stopwatch').attr('id'),
				name = $this.val();

			watches.updateName(id, name);
			$this.replaceWith('<span class="name">' + $this.val() + '</span>');
		})
		.on('keydown', '.name-input', function(e) {
			if (e.keyCode === 13) {
				$(this).blur();
			}
		});

		$(document).on('click', '.start', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.startTime(id);
		});

		$(document).on('click', '.pause', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.pauseTime(id);
		});

		$(document).on('click', '.delete', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			watches.deleteWatch(id);
		});

		$(document).on('click', '.reset', function() {
			var id = $(this).parents('.stopwatch').attr('id');

			time.resetTime(id);
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


		// ------ LOGIN -------
		$('#authenticate').click(function(e) {
			client.authenticate();
		});


		// ----- OPTIONS AND PERSISTENT BUTTONS -----
		$('.new').click(function(e) {
			watches.createWatch();
		});

		$('.delete-all').click(function() {
			watches.deleteAll();
		});

		$('.reset-all').click(function() {
			time.resetAll();
		});

		$('.pause-all').click(function() {
			time.pauseAll();
		});

		$('.expand-all').click(function() {
			watches.expandAll();
		});

		$('.collapse-all').click(function() {
			watches.collapseAll();
		});

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