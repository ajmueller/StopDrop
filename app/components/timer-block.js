export default Ember.Component.extend({

	active: null,
    
    status: function() {
        return this.get('active') ? 'ON' : 'OFF';
    }.property('active'),

	actions: {

		start: function() {
			this.sendAction('start', this.get('timer'));
		},

		stop: function() {
			this.sendAction('stop', this.get('timer'));
		}

	}

});