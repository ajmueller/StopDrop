import Ember from 'ember';
import helper from '../models/helper';

export default Ember.Component.extend({
	
	title: null,
	editMode: false,

	titleSpan: Ember.View.extend({
		
		titleBinding: 'parentView.title',

		doubleClick: function(event, view) {
			this.get('parentView').set('editMode', true);
		},

		isVisible: function() {
			return (!this.get('parentView.editMode')) ? true : false;
		}.property('parentView.editMode'),

		template: Ember.Handlebars.compile('<span class="timertitle">{{title}}</span>')

	}),

	titleInput: Ember.TextField.extend({

		focusOut: function(event, view) {
			this.get('parentView').set('editMode', false);
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