import DS from 'ember-data';

var Timer = DS.Model.extend({
    
    title: DS.attr('string'),
    startTime: DS.attr('number', {defaultValue: 0}),
    totalTime: DS.attr('number', {defaultValue: 0}),
    active: DS.attr('boolean', {defaultValue: false}),
    notes: DS.attr('string', {defaultValue: ''}),

    start: function() {

        if (this.get('startTime')) {
            return;
        }

    	this.startTime = Date.now();
        this.set('active', true);
    },

    stop: function() {

        if (!this.get('active')) {
            return;
        }

    	var sessionTime = Date.now() - this.startTime;
        this.set('totalTime', this.get('totalTime') + sessionTime);

        this.set('active', false);
        this.resetStartTime();
    },

    resetStartTime: function() {
        console.log('resetting');
        this.set('startTime', 0);
    }

});

export default Timer;