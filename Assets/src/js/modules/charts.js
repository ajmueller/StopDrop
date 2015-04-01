var watches = require('./watches'),
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

function getGraphData() {
	var graphData = [],
		allWatches = watches.getWatches();

	allWatches.forEach(function(watch) {
		var name = watch.get('name'),
			time = watch.get('totalTime'),
			color = watch.get('theme'),
			watchData = {
				name: name,
				y: time,
				color: colors[color]
			};

		if (time > 0) {
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
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Percentage',
				data: getGraphData()
			}]
		});
	});
}

$(window).on('resize', function() {
	clearTimeout(windowResize);
	windowResize = setTimeout(drawChart, 100);
});

exports.drawChart = drawChart;