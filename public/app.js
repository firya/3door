const express = require('express');
const app = express();
const router = express.Router();
const url = require('url');

const PuppeteerBrowser = require('./puppeteer/puppeteerBrowser.js');
const Watermark = require('./watermark/watermark.js');

const SECRET_URL = '182nKJfh8231bhdja176t38bf3888NBv237';

var puppeteerBrowser = new PuppeteerBrowser();
puppeteerBrowser.createPuppeteer();

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

app.get("/screenshot", async (request, response) => {
  var queryParams = url.parse(request.url, true).query;
  var queryURL = url.parse(request.url).query;

  const windowHeight = queryParams.sh || 300;

  var pageUrl = `http://localhost:8080/redactor${SECRET_URL}?${queryURL}`;

  await puppeteerBrowser.openPage(pageUrl);

  var ratio = await puppeteerBrowser.getViewportRatio()

  await puppeteerBrowser.setPageViewport(windowHeight * ratio, windowHeight);

  puppeteerBrowser.getImage().then(async res => {
    puppeteerBrowser.page.close();

    const im = res.split(",")[1];
    var img = Buffer.from(im, 'base64');

    if (windowHeight >= 300) {
      img = await Watermark.merge(Buffer.from(im, 'base64'), './static/images/watermark.png');
    }

    response.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });

    response.end(img);
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})