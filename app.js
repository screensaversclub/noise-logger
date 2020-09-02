const moment = require("moment");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
require("dotenv").config();

mongoose.connect(process.env.MONGO_CONN, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const NoiseLog = mongoose.model("NoiseLog", {
	name: String,
	location: String,
	time: Date,
	duration: Number,
	loudness: Number,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("static"));

app.get("/", (req, res) => {
	res.render("index", { scripts: ["/js/logger.js"] });
});

app.post("/log/new", (req, res) => {
	var log = new NoiseLog(req.body);
	log
		.save()
		.then((response) => {
			console.log(response);
			res.send("ok");
		})
		.catch((err) => {
			console.log(err);
			res.send({ err });
		});
});

app.get("/log/view", (req, res) => {
	NoiseLog.find({})
		.lean()
		.exec()
		.then((results) => {
			console.log(results);
			var logs = results.map(function (r) {
				var m = moment(r.time);
				return {
					name: r.name,
					location: r.location,
					parsed_date: m.format("MMM Do YYYY"),
					parsed_time: m.format("h:mm:ss a"),
					duration: r.duration,
					loudness: r.loudness,
				};
			});
			res.render("log", {
				logs,
				scripts: [
					"https://semantic-ui.com/javascript/library/tablesort.js",
					"/js/logview.js",
				],
			});
		})
		.catch((err) => {
			res.send({ err });
		});
});

app.listen(3003);
