import Ember from 'ember';
import helper from '../models/helper';

export default Ember.Component.extend({

	active: null,
	totalTime: null,
	notes: null,
	currentTheme: null,
    expanded: false,

	timerClassWithTheme: function(){
		return [ "timer",
                 this.get('currentTheme'),
                 (this.get('expanded') ? 'expanded' : '')
                ].join(' ');
	}.property('currentTheme', 'expanded'),

	themeOptions: function(){
		return helper.getThemeOptions();
	}.property(),
    
    status: function() {
        return this.get('active') ? 'ON' : 'OFF';
    }.property('active'),

    formattedTime: function() {
    	return helper.convertMsToHHMMSS(this.get('totalTime'));
    }.property('totalTime'),

    themeOptionView: Ember.View.extend({

    	classNames: "theme-option-view-wrapper",
    	click: function(){
    		this.get('parentView').sendAction('changeTheme', this.get('theme'));
    	},
    	theme: null,
    	template: Ember.Handlebars.compile('<div class="theme-option {{theme}}"><i class="fa fa-dot-circle-o"></i></div>'),
    	isVisible: function() {
    		if (this.get('parentView.currentTheme') == this.get('theme')) {
    			return false;
    		}

    		return true;
    	}.property('parentView.currentTheme')

    }),

	actions: {

		toggleStartStop: function() {
			var action = this.get('active') ? 'stop' : 'start';
			this.sendAction(action);
		},

        fastforward: function() {
            this.sendAction('fastforward');
        },

        rewind: function() {
            this.sendAction('rewind');
        },

		delete: function() {
			this.sendAction('delete');
		},

        toggleExpander: function() {
            this.set('expanded', !this.get('expanded'));
        },

        reset: function() {
            this.sendAction('reset');
        }

	}

});