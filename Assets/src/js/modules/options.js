var options = null;

// retrieves the user's options from their datastore
function getOptions() {
	options = datastore.getTable('options');

	if (options.query().length === 0) {
		initializeOptions();
	}
	else {
		setOptionsUI();
	}
}

// returns an instance of an option record
function getOption(name) {
	return options.get(name);
}

// initialize all options in the datastore
function initializeOptions() {
	$('.options input').each(function() {
		var $input = $(this);

		setOption($input.attr('id'), $input.is(':checked'));
	});
}

// set an individual option in the datastore
function setOption(name, value) {
	options.getOrInsert(name, {
		'value': value
	});
}

// sets up listener to sync options UI
function setOptionsSync() {
	datastore.recordsChanged.addListener(function(e) {
		var optionsAffected = e.affectedRecordsForTable('options');

		optionsAffected.forEach(function(option) {
			var optionID = option._rid,
				$input = $('#' + optionID);

			setOptionUI($input, option);
		});
	});
}

// updates an indvidual option in the datastore
function updateOption(name, value) {
	var option = getOption(name);

	option.set('value', value);
}

// updates an option's checkbox
function setOptionUI($input, option) {
	var optionValue = option.get('value');

	$input.prop('checked', optionValue);
}

// updates the options checkboxes to match the datastore
function setOptionsUI() {
	$('.options input').each(function() {
		var $input = $(this),
			option = getOption($input.attr('id'));

		setOptionUI($input, option);
	});
}

exports.getOptions = getOptions;
exports.getOption = getOption;
exports.updateOption = updateOption;
exports.setOptionsSync = setOptionsSync;