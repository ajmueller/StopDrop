$(function() {
	var StopDrop = {
		client: null,
		datastore: null,
		datastoreManager: null
	};

	var Global = Global || {};
	var Commodal = Commodal || {};

	// binds all clicks and change events to UI elements
	StopDrop.bindInteractions = function() {
		$('#authenticate').click(function(e) {
			StopDrop.client.authenticate();
		});

		$('#singleWatch').on('change', function() {
			StopDrop.updateOption('singleWatch', $(this).is(':checked'));
		});

		$('#trackImmediately').on('change', function() {
			StopDrop.updateOption('trackImmediately', $(this).is(':checked'));
		});

		console.log('interactions bound');
	};

	// gets an instance of the Dropbox client
	StopDrop.getClient = function() {
		var userAuthenticated = false;

		StopDrop.client = new Dropbox.Client({key: 'vng10ukrxiq1gsk'});

		// Try to finish OAuth authorization.
		StopDrop.client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}
		});

		if (StopDrop.client.isAuthenticated()) {
			// Client is authenticated. Display UI.
			console.log('user authenticated');
			$('#welcome').remove();
			$('#container').show();
			userAuthenticated = true;
		}

		return userAuthenticated;
	};

	// gets the user's default datastore
	StopDrop.getDatastoreManager = function() {
		StopDrop.datastoreManager = StopDrop.client.getDatastoreManager();

		StopDrop.datastoreManager.openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}

			// Now you have a datastore. The next few examples can be included here.
			StopDrop.datastore = datastore;
			StopDrop.getOptions();
		});
	};

	// retrieves the user's options from their datastore
	StopDrop.getOptions = function() {
		StopDrop.options = StopDrop.datastore.getTable('options');

		if (StopDrop.options.query().length === 0) {
			StopDrop.initializeOptions();
		}
		else {
			StopDrop.updateOptionsUI();
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

	// updates an indvidual option in the datastore
	StopDrop.updateOption = function(name, value) {
		var option = StopDrop.getOption(name);

		option.set('value', value);

		console.log('option ' + name + ' updated with value of ' + value);
	};

	// updates the options checkboxes to match the datastore
	StopDrop.updateOptionsUI = function() {
		$('.options input').each(function() {
			var $input = $(this),
				option = StopDrop.getOption($input.attr('id'));

			$input.prop('checked', option.get('value'));
		});
	};

	StopDrop.init = function() {
		StopDrop.bindInteractions();

		if(StopDrop.getClient()) {
			StopDrop.getDatastoreManager();
		}
	};

	// start app function
	(function() {
		StopDrop.init();
	})();
});