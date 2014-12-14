var client = null,
	datastore = null,
	datastoreManager = null,
	appKey = 'vng10ukrxiq1gsk';

function getClient() {
	authenticateClient();

	return client;
}

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

exports.getClient = getClient;
exports.authenticateClient = authenticateClient;