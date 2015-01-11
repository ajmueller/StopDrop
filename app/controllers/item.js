import Ember from 'ember';
import AutoSaving from '../mixins/AutoSaving';

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

			timer.save();
			
		},

		stopTimerInstance: function() {

			var timer = this.get('model');
			
			timer.stop();

			if (this.get('parentController.currentTimers').contains(timer)) {
				this.get('parentController.currentTimers').removeObject(timer);
			}

			timer.save();
		},

		fastforwardTimerInstance: function() {

			var timer = this.get('model');
			timer.fastforward();

			timer.save();
		},

		rewindTimerInstance: function() {
			var timer = this.get('model');
			timer.rewind();

			timer.save();
		},

		deleteTimerInstance: function() {

			var timer = this.get('model');

			timer.destroyRecord();

			timer.save();
		},

		changeTimerInstanceTheme: function(theme) {

			var timer = this.get('model');
			timer.set('theme', theme).save();
		},

		resetTimerInstance: function() {

			var timer = this.get('model');
			timer.resetToNow();
			timer.save();
		}
  	}
});