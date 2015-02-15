import Ember from 'ember';
import helper from '../models/helper';

export default Ember.Component.extend({
	
	title: null,
	editMode: false,

	checkTimerValue: function() {
		if (this.get('title') == "" && !this.get('editMode')) {
			this.set('title', 'timer with no name');
		}
	}.observes('title'),

	titleSpan: Ember.View.extend({
		
		titleBinding: 'parentView.title',

		doubleClick: function(event, view) {
			this.get('parentView').set('editMode', true);
		},

		isVisible: function() {
			return (!this.get('parentView.editMode')) ? true : false;
		}.property('parentView.editMode'),

		template: Ember.Handlebars.compile('<div class="timertitle">{{{title}}}</div>')

	}),

	titleInput: Ember.TextField.extend({

		focusOut: function(event, view) {
			this.get('parentView').set('editMode', false);
			this.get('parentView').checkTimerValue();
		},

		insertNewline: function(event){
			this.$().focusout();
		},

		classNames: ['timertitle-input'],
		valueBinding: 'parentView.title',
		
		isVisible: function() {
			return (this.get('parentView.editMode')) ? true : false;
		}.property('parentView.editMode'),

		becameVisible: function() {
			this.$().focus().select();
		}
	}),
});