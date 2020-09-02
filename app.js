const express = require('express');
const mongoose = require('mongoose');
const app = express();
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('static'));

app.get('/', (req, res) => {
	res.render('index', {r : Math.random() });
});

app.listen(3003);
