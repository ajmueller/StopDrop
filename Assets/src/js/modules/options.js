var options = null;

// set an individual option in the datastore
function _setOption(name, value) {
	options.getOrInsert(name, {
		'value': value
	});
}

// initialize all options in the datastore
function _initializeOptions() {
	$('.options input').each(function() {
		var $input = $(this);

		_setOption($input.attr('id'), $input.is(':checked'));
	});
}

// updates an option's checkbox
function _setOptionUI($input, option) {
	var optionValue = option.get('value');

	$input.prop('checked', optionValue);
}

// updates the options checkboxes to match the datastore
function _setOptionsUI() {
	$('.options input').each(function() {
		var $input = $(this),
			option = getOption($input.attr('id'));

		_setOptionUI($input, option);
	});
}

// returns an instance of an option record
function getOption(name) {
	return options.get(name);
}

// retrieves the user's options from their datastore
function getOptions() {
	options = datastore.getTable('options');

	if (options.query().length === 0) {
		_initializeOptions();
	}
	else {
		_setOptionsUI();
	}
}

// sets up listener to sync options UI
function setOptionsSync() {
	datastore.recordsChanged.addListener(function(e) {
		var optionsAffected = e.affectedRecordsForTable('options');

		optionsAffected.forEach(function(option) {
			var optionID = option._rid,
				$input = $('#' + optionID);

			_setOptionUI($input, option);
		});
	});
}

// updates an indvidual option in the datastore
function updateOption(name, value) {
	var option = getOption(name);

	option.set('value', value);
}

exports.getOption = getOption;
exports.getOptions = getOptions;
exports.setOptionsSync = setOptionsSync;
exports.updateOption = updateOption;