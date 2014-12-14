var client = null,
	datastoreManager = null,
	appKey = 'vng10ukrxiq1gsk',
	options = require('./options.js'),
	watches = require('./watches.js');

function authenticateClient() {
	var clientAuthenticated = false;

	client = new Dropbox.Client({key: appKey});

	client.authenticate({interactive: false}, function (error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});

	if (client.isAuthenticated()) {
		// Client is authenticated. Display UI.
		console.log('user authenticated');
		$('#welcome').remove();
		$('#container').show();
		clientAuthenticated = true;
	}

	return clientAuthenticated;
}

function getClient() {
	authenticateClient();

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
			watches.getWatches();
			watches.setWatchesSync();

			console.log('datastore set');
		}
	});
}

exports.getClient = getClient;
exports.authenticateClient = authenticateClient;
exports.getDatastoreManager = getDatastoreManager;