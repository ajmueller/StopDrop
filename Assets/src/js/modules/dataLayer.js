var client = null,
	appDatastore = null,
	datastoreManager = null,
	appKey = 'vng10ukrxiq1gsk',
	options = require('./options.js');

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
	var datastoreManagerRetrieved = false;

	datastoreManager = client.getDatastoreManager();

	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			alert('Error opening default datastore: ' + error);
		}
		else {
			datastoreManagerRetrieved = true;
			global.datastore = datastore;
			options.getOptions();
			options.setOptionsSync();
			console.log('datastore set');
		}
	});

	return datastoreManagerRetrieved;
}

exports.getClient = getClient;
exports.authenticateClient = authenticateClient;
exports.getDatastoreManager = getDatastoreManager;