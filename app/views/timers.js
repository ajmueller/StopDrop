export default Ember.View.extend({

	// might need templateName: 'timers' if resolver doesn't wire it up automagically
	didInsertElement: function() {

		new Sortable($('.timers').get(0), {
			draggable: '.timer-container'
		});
	}

});