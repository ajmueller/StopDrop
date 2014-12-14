require('./vendor/jquery.min.js');
require('./vendor/jquery.ui-custom.min.js');
require('./vendor/jquery.ui-touch-punch.min.js');
require('./vendor/jquery.mobile-events.min.js');
var dataLayer = require('./modules/dataLayer.js'),
	options = require('./modules/options.js'),
	watches = require('./modules/watches.js'),
	client = null;

$(function() {
	// binds all clicks and change events to UI elements
	function bindInteractions() {
		$('.new').click(function(e) {
			watches.createWatch();
		});

		$('#authenticate').click(function(e) {
			client.authenticate();
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