const express = require('express');
const app = express();
const router = express.Router();
const url = require('url');
const Generator = require('./Generator.js');

const PuppeteerBrowser = require('./puppeteer/puppeteerBrowser.js');

const SECRET_URL = '182nKJfh8231bhdja176t38bf3888NBv237';

var puppeteerBrowser = new PuppeteerBrowser();
puppeteerBrowser.createPuppeteer().then(res => {
  new Generator(puppeteerBrowser).generate();
});

const path = __dirname + '/';
const port = 8080;

app.use(express.static(path));
app.use('/', router);

router.get('/', function (req, res) {
  res.sendStatus(200);
});

router.get(`/redactor${SECRET_URL}`, function (req, res) {
  res.sendFile('index.html', {
    root: './views'
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})