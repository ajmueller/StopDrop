require('./vendor/jquery.min.js');
require('./vendor/jquery.ui-custom.min.js');
require('./vendor/jquery.ui-touch-punch.min.js');
require('./vendor/jquery.mobile-events.min.js');
var datastore = require('./modules/datastore.js'),
	client = null;

$(function() {
	var StopDrop = {
		datastore: null,
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

	// gets the user's default datastore
	StopDrop.getDatastoreManager = function() {
		StopDrop.datastoreManager = client.getDatastoreManager();

		StopDrop.datastoreManager.openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}

			// Now you have a datastore. The next few examples can be included here.
			StopDrop.datastore = datastore;
			StopDrop.getOptions();

			StopDrop.setOptionSync();
		});
	};

	// retrieves the user's options from their datastore
	StopDrop.getOptions = function() {
		StopDrop.options = StopDrop.datastore.getTable('options');

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
		StopDrop.datastore.recordsChanged.addListener(function(e) {
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
		client = datastore.getClient();
		StopDrop.bindInteractions();

		if(client.isAuthenticated()) {
			StopDrop.getDatastoreManager();
		}
	};

	// start app function
	(function() {
		StopDrop.init();
	})();
});