import Ember from 'ember';

var Router = Ember.Router.extend({
  location: StopDropENV.locationType
});

Router.map(function() {

	this.resource('timers', {
		path: '/'
	});

});

export default Router;
