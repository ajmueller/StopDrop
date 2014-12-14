var Commodal = Commodal || {};

Commodal.speed = 500;

Commodal.close = function() {
	var $mask = $('#mask'),
		$modal = $('#modal');

	$mask.fadeOut(Commodal.speed, function() {
		$modal.html('');
	});
};

Commodal.open = function(html) {
	var $mask = $('#mask'),
		$modal = $('#modal');

	$mask.fadeIn(Commodal.speed);
	$modal.html(html);
	$('input[type="text"]').focus();
};

Commodal.confirm = function(message) {
	var html = message + '<p><button class="confirm">OK</button><button class="cancel">Cancel</button></p>';

	Commodal.open(html);
};

Commodal.prompt = function(message) {
	var html = message + '<p><input type="text" class="prompt-input" /></p><p><button class="prompt">OK</button><button class="cancel">Cancel</button></p>';

	Commodal.open(html);
};