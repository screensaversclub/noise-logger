(function ($) {
	var myDataset;



	var colorCursor = 0;
	var randomColor = function () {
		colorCursor ++;
		var cArr = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];
		// var c;
		// var r = Math.floor(Math.random() * 255);
		// var g = Math.floor(Math.random() * 255);
		// var b = Math.floor(Math.random() * 255);
		// c = "rgba(" + r + ", " + g + ", " + b + ", 1)";

		return cArr[colorCursor % cArr.length];
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
