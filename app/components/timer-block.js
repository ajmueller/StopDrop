import Ember from 'ember';
import helper from '../models/helper';

export default Ember.Component.extend({

	active: null,
	totalTime: null,
    
    status: function() {
        return this.get('active') ? 'ON' : 'OFF';
    }.property('active'),

    formattedTime: function() {
    	return helper.convertMsToHHMMSS(this.get('totalTime'));
    }.property('totalTime'),

	actions: {

		start: function() {
			this.sendAction('start', this.get('timer'));
		},

		stop: function() {
			this.sendAction('stop', this.get('timer'));
		}

	}

});