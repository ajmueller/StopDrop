import Ember from 'ember';
import itemController from '../controllers/item';

export default Ember.ArrayController.extend({

	currentTimers: Ember.A(),
	itemController: 'item',

	actions: {

		createNewTimerInstance: function() {

			this.store
				.createRecord('timer', {
					title: 'New timer'
				})
				.save();
		}

	}

});