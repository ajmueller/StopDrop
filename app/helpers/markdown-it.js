import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(string, options) {
	return new Ember.Handlebars.SafeString(marked(string));
});