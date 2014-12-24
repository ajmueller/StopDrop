import Ember from 'ember';

export default Ember.ArrayController.extend({

	currentTimers: Ember.A(),

	actions: {

		startTimerInstance: function(timer) {
			
			timer.start();

			if (!this.currentTimers.contains(timer)) {
				this.currentTimers.addObject(timer);
			}
			
		},

		stopTimerInstance: function(timer) {
			
			timer.stop();

			if (this.currentTimers.contains(timer)) {
				this.currentTimers.removeObject(timer);
			}
		}

	}

});