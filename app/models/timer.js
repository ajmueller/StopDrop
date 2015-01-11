import DS from 'ember-data';

var Timer = DS.Model.extend({
    
    BUMP_TIME_AMT: 15 * 60 * 1000, // amount to bump time with fastforward/rewind, 15 minutes * 60 seconds * 1000 milliseconds

    title: DS.attr('string'),
    startTime: DS.attr('number', {defaultValue: 0}),
    totalTime: DS.attr('number', {defaultValue: 0}),
    active: DS.attr('boolean', {defaultValue: false}),
    notes: DS.attr('string', {defaultValue: ''}),
    theme: DS.attr('string', {defaultValue: 'blue'}),

    start: function() {

        if (this.get('startTime')) {
            return;
        }

        this.set('startTime', Date.now());
        this.set('active', true);
    },

    stop: function() {

        if (!this.get('active')) {
            return;
        }

    	var sessionTime = Date.now() - this.get('startTime');
        sessionTime = (sessionTime > 0) ? sessionTime : 0; // prevent negative time
        this.set('totalTime', this.get('totalTime') + sessionTime);

        this.set('active', false);
        this.resetStartTime();
    },

    fastforward: function() {
        var newTotalTime = this.get('totalTime') + this.BUMP_TIME_AMT;
        this.set('totalTime', newTotalTime);
    },

    rewind: function() {
        var newTotalTime = this.get('totalTime') - this.BUMP_TIME_AMT;
        this.set('totalTime', newTotalTime);
    },

    resetStartTime: function() {
        this.set('startTime', 0);
    },

    resetToNow: function() {

        this.resetStartTime();
        this.set('totalTime', 0);

    },

    setThemeOption: function(theme) {
        this.set('theme', theme);
    },

});

export default Timer;