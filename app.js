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

function escape(s) {
  console.log(s.replaceAll("'", "'"));
  // return s.replaceAll("'", "\\'");
  return s;
}

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
      var logs = results
        .map(function (r) {
          var m = moment(r.time);
          return {
            name: r.name.replace("'", "’"),
            location: r.location.replace("'", "’"),
            parsed_date: m.format("MMM Do YYYY"),
            parsed_time: m.format("h:mm:ss a"),
            timestamp: m.format("X"),
            duration: r.duration,
            loudness: r.loudness,
          };
        })
        .sort(function (a, b) {
          return b.timestamp - a.timestamp;
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

app.get(["/log/chart", "/log/chart/:date"], (req, res) => {
  NoiseLog.find({})
    .lean()
    .exec()
    .then((results) => {
      var logs = results.map(function (r) {
        var m = moment(r.time);
        return {
          name: r.name.replace("'", "’"),
          location: r.location.replace("'", "’"),
          timestamp: r.time,
          duration: r.duration,
          loudness: r.loudness,
        };
      });

      var filterDate = moment.unix(req.params.date);
      var date = false;

      if (req.params.date && filterDate) {
        logs = logs.filter(function (l) {
          return moment(l.timestamp).isSame(filterDate, "day");
        });
        date = filterDate.format("ddd, MMMM Do YYYY");
      }

      res.render("chart", {
        logs,
        date: date,
        helpers: {
          passJson: function (a) {
            return JSON.stringify(a);
          },
        },
        scripts: [
          "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js",
          "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js",
          "/js/chartview.js",
        ],
        stylesheets: [
          "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.css",
        ],
      });
    })
    .catch((err) => {
      res.send({ err });
    });
});

app.listen(3003, () => {
  console.log("listening");
});
