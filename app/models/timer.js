import DS from 'ember-data';

var Timer = DS.Model.extend({
    
    title: DS.attr('string'),
    startTime: DS.attr('int', {defaultValue: 0}),
    totalTime: DS.attr('int', {defaultValue: 0}),
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

Timer.reopenClass({
    FIXTURES: [
        {
        	id: 1,
            title: "Making money rain",
            notes: "TESTING THESE NOTES"
        },
        {
        	id: 2,
            title: "Running till I die",
            notes: "TESTING THESE NOTES AGAIN"
        },
        {
        	id: 3,
            title: "Solve world hunger (with Ember)",
            notes: "TESTING THESE NOTES AGAIN AGAIN"
        }
    ]
});

export default Timer;