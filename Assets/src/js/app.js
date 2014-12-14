require('./vendor/jquery.min.js');
require('./vendor/jquery.ui-custom.min.js');
require('./vendor/jquery.ui-touch-punch.min.js');
require('./vendor/jquery.mobile-events.min.js');
var dataLayer = require('./modules/dataLayer.js'),
	client = null,
	datastore = null;

$(function() {
	var StopDrop = {
		datastoreManager: null
	};

	var Global = Global || {};
	var Commodal = Commodal || {};

	// binds all clicks and change events to UI elements
	StopDrop.bindInteractions = function() {
		$('#authenticate').click(function(e) {
			client.authenticate();
		});

		$('#singleWatch').on('change', function() {
			StopDrop.updateOption('singleWatch', $(this).is(':checked'));
		});

		$('#trackImmediately').on('change', function() {
			StopDrop.updateOption('trackImmediately', $(this).is(':checked'));
		});

		console.log('interactions bound');
	};

	// retrieves the user's options from their datastore
	StopDrop.getOptions = function() {
		StopDrop.options = datastore.getTable('options');

		if (StopDrop.options.query().length === 0) {
			StopDrop.initializeOptions();
		}
		else {
			StopDrop.setOptionsUI();
		}
	};

	// returns an instance of an option record
	StopDrop.getOption = function(name) {
		return StopDrop.options.get(name);
	};

	// initialize all options in the datastore
	StopDrop.initializeOptions = function() {
		$('.options input').each(function() {
			var $input = $(this);

			StopDrop.setOption($input.attr('id'), $input.is(':checked'));
		});
	};

	// set an individual option in the datastore
	StopDrop.setOption = function(name, value) {
		StopDrop.options.getOrInsert(name, {
			'value': value
		});

		console.log('option ' + name + ' set with value of ' + value);
	};

	// sets up listener to sync options UI
	StopDrop.setOptionSync = function() {
		datastore.recordsChanged.addListener(function(e) {
			var options = e.affectedRecordsForTable('options');

			options.forEach(function(option) {
				var optionID = option._rid,
					$input = $('#' + optionID);

				StopDrop.setOptionUI($input, option);
			});
		});
	};

	// updates an indvidual option in the datastore
	StopDrop.updateOption = function(name, value) {
		var option = StopDrop.getOption(name);

		option.set('value', value);
	};

	// updates an option's checkbox
	StopDrop.setOptionUI = function($input, option) {
		var optionValue = option.get('value');

		$input.prop('checked', optionValue);

		console.log('option ' + option._rid + ' checkbox updated with value of ' + optionValue);
	};

	// updates the options checkboxes to match the datastore
	StopDrop.setOptionsUI = function() {
		$('.options input').each(function() {
			var $input = $(this),
				option = StopDrop.getOption($input.attr('id'));

			StopDrop.setOptionUI($input, option);
		});
	};

	StopDrop.init = function() {
		client = dataLayer.getClient();
		StopDrop.bindInteractions();

		if(client.isAuthenticated()) {
			dataLayer.getDatastoreManager();
		}
	};

	// start app function
	(function() {
		StopDrop.init();
	})();
});