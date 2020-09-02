(function ($) {
	dataStore = window.localStorage;

	var stopWatchStartTime = 0;
	var stopWatchID = null;
	var dateID = null;

	function updateDateTimeField() {
		var d = new Date();
		$("input[name=datetime]").val(d.toLocaleString());
		$("input[name=truedatetime]").val(d);
		if (dateID) {
			window.cancelAnimationFrame(dateID);
		}
		dateID = window.requestAnimationFrame(updateDateTimeField);
	}

	function startWatch() {
		stopWatchStartTime = parseInt(new Date().getTime());
		$("button[data-action=start-watch]").hide();
		$("button[data-action=stop-watch]").show();
		updateStopwatchField();
		updateDateTimeField();
	}

	function stopWatch() {
		window.cancelAnimationFrame(stopWatchID);
		window.cancelAnimationFrame(dateID);
		$("button[data-action=start-watch]").show();
		$("button[data-action=stop-watch]").hide();
	}

	function updateStopwatchField() {
		var t = parseInt(new Date().getTime());
		var seconds = Math.floor((t - stopWatchStartTime) / 1000);
		$("input[name=duration]").val(seconds + " seconds");
		stopWatchID = window.requestAnimationFrame(updateStopwatchField);
	}

	updateDateTimeField();

	$("button[data-action=stop-watch]").hide();

	$("button[data-action=start-watch]").on("click", startWatch);
	$("button[data-action=stop-watch]").on("click", stopWatch);

	$("form button").on("click", function (e) {
		e.preventDefault();
	});

	$("input[name=name], input[name=location]").on("change", function () {
		dataStore.setItem("name", $("input[name=name]").val());
		dataStore.setItem("location", $("input[name=location]").val());
	});

	$("form input[type=submit]").on("click", function (e) {
		var that = $(this);

		$("div.confirmation").removeClass("hidden");
		that.prop("disabled", true);

		if (dateID) {
			window.cancelAnimationFrame(dateID);
		}
		dateID = window.requestAnimationFrame(updateDateTimeField);

		if (stopWatchID) {
			window.cancelAnimationFrame(stopWatchID);
			$("button[data-action=start-watch]").show();
			$("button[data-action=stop-watch]").hide();
		}

		$.ajax({
			url: "/log/new",
			method: "post",
			data: {
				name: $("input[name=name]").val(),
				location: $("input[name=location]").val(),
				time: $("input[name=truedatetime]").val(),
				duration: $("input[name=duration]").val().replace("seconds", "").trim(),
				loudness: parseInt($("input[name=loudness]:checked").val()) || null,
			},
		}).done(function () {
			window.setTimeout(function () {
				$("div.confirmation").addClass("hidden");
				that.prop("disabled", false);
				$("input[name=duration]").val("");
			}, 2000);
		});

		e.preventDefault();
	});

	$("input[name=name]").val(dataStore.getItem("name"));
	$("input[name=location]").val(dataStore.getItem("location"));
})(jQuery);
