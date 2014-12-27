import Ember from 'ember';
import AutoSaving from '../mixins/AutoSaving';

console.log(AutoSaving);

export default Ember.ObjectController.extend(AutoSaving, {
	
	// leverage the AutoSaving mixin
	bufferedFields: ['title', 'notes'],
  	instaSaveFields: ['active', 'totalTime', 'startTime'],

  	actions: {

		startTimerInstance: function() {

			var timer = this.get('model');
			
			timer.start();

			if (!this.get('parentController.currentTimers').contains(timer)) {
				this.get('parentController.currentTimers').addObject(timer);
			}
			
		},

		stopTimerInstance: function() {

			var timer = this.get('model');
			
			timer.stop();

			if (this.get('parentController.currentTimers').contains(timer)) {
				this.get('parentController.currentTimers').removeObject(timer);
			}
		},

		deleteTimerInstance: function() {

			var timer = this.get('model');

			console.log('deleting');
			timer.destroyRecord();
		},
  	}
});