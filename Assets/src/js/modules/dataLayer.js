var client = null,
	datastoreManager = null,
	appKey = 'vng10ukrxiq1gsk',
	options = require('./options.js'),
	watches = require('./watches.js'),
	charts = require('./charts.js');

function _authenticateClient() {
	var clientAuthenticated = false;

	client = new Dropbox.Client({key: appKey});

	client.authenticate({interactive: false}, function (error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});

	if (client.isAuthenticated()) {
		// Client is authenticated. Display UI.
		$('#welcome').remove();
		$('#container').show();
		clientAuthenticated = true;
	}

	return clientAuthenticated;
}

function getClient() {
	_authenticateClient();

	return client;
}

function getDatastoreManager() {
	datastoreManager = client.getDatastoreManager();

	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			alert('Error opening default datastore: ' + error);
		}
		else {
			global.datastore = datastore;

			options.getOptions();
			options.setOptionsSync();

			// initialize watches
			watches.appendWatches();
			watches.setWatchesSync();
			charts.drawChart();
		}
	});
}

exports.getClient = getClient;
exports.getDatastoreManager = getDatastoreManager;