var watches = require('./watches'),
	time = require('./time'),
	colors = {
		black: '#0e0e0e',
		red: '#ff3824',
		orange: '#ff9600',
		yellow: '#ffcd00',
		green: '#44db5e',
		blue: '#0076ff',
		violet: '#502f79'
	},
	windowResize;

function _getGraphData() {
	var graphData = [],
		allWatches = watches.getWatches();

	allWatches.forEach(function(watch) {
		var name = watch.get('name'),
			totalTime = watch.get('totalTime'),
			color = watch.get('theme'),
			watchData = {
				name: name,
				y: totalTime,
				color: colors[color],
				roundedTime: time.formatTime(totalTime)
			};

		if (totalTime > 0) {
			graphData.push(watchData);
		}
	});

	return graphData;
}

function drawChart() {
	$(function() {
		$('#chart:visible').highcharts({
			chart: {
				backgroundColor: 'transparent',
				plotBackgroundColor: 'transparent'
			},
			title: {
				text: 'Percentage by Task'
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>:<br>{point.percentage:.1f}%<br>{point.roundedTime}',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Percentage',
				data: _getGraphData()
			}]
		});
	});
}

$(window).on('resize', function() {
	clearTimeout(windowResize);
	windowResize = setTimeout(drawChart, 100);
});

exports.drawChart = drawChart;