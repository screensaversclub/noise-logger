(function ($) {
	var myDataset;

	var randomColor = function () {
		var c;
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		c = "rgba(" + r + ", " + g + ", " + b + ", 1)";
		return c;
	};

	myDataset = LOGS.reduce(function (p, c, i, arr) {
		var id = c.name.trim().toLowerCase();
		c.x = new Date(c.timestamp);
		c.y = c.loudness * c.duration;
		if (!p[id]) {
			var rc = randomColor();
			p[id] = {
				label: c.name,
				borderColor: rc,
				backgroundColor: rc,
				data: [c],
			};
		} else {
			p[id].data.push(c);
		}
		return p;
	}, {});

	myDataset = Object.values(myDataset);

	var ctx = $("#canvas");

	var scatterChart = new Chart(ctx, {
		type: "scatter",
		data: {
			datasets: myDataset,
		},
		options: {
			scales: {
				xAxes: [
					{
						type: "time",
						time: {
							unit: "hour",
							round: "hour",
							tooltipFormat: "ll HH:mm",
						},
						scaleLabel: {
							display: true,
							labelString: "Date",
						},
					},
				],
				yAxes: [
					{
						scaleLabel: {
							display: true,
							labelString: "Loudness (1 to 5) x Duration (s)",
						},
					},
				],
			},
		},
	});
})(jQuery);
