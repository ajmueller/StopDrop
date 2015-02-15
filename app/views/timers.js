export default Ember.View.extend({

	// might need templateName: 'timers' if resolver doesn't wire it up automagically
	didInsertElement: function() {

		new Sortable($('.timers').get(0), {
			
			draggable: '.timer-container',
			onEnd: function(e) {

				var childViews = this.get('childViews');
				// get DOM elements of each node
				var childViewNodes = $(childViews.map(function(childView){ return childView.$().get(0) }));
				
				// jQuery will return the timer class in order as it appears in the DOM, this gives us the new order
				var orderedModels = $('.timer').map(function(i, timer){
					// find the matching index of the view, and return the corresponding view
					var childViewNodeIndex = $(childViewNodes).index($(timer).parent('.ember-view'));
					return childViews[childViewNodeIndex].get('itemController').get('model');
				});

				this.get('controller').send('finishedSorting', orderedModels);
			}.bind(this)
		});
	}

});