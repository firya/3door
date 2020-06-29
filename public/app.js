const express = require('express');
const app = express();
const router = express.Router();
const url = require('url');

const PuppeteerBrowser = require('./puppeteer/puppeteerBrowser.js');
const Watermark = require('./watermark/watermark.js');

var puppeteerBrowser = new PuppeteerBrowser();
puppeteerBrowser.createPuppeteer();

const path = __dirname + '/';
const port = 8080;

app.use(express.static(path));
app.use('/', router);

router.get('/', function (req, res) {
  if (process.env.NODE_ENV == 'development') {
    res.sendFile('index.html', {
      root: './views'
    });
  } else {
    res.sendStatus(200);
  }
});

app.get("/screenshot", async (request, response) => {
  var queryParams = url.parse(request.url, true).query;
  var queryURL = url.parse(request.url).query;

  const windowHeight = queryParams.sh || 300;

  var pageUrl = `http://localhost:8080/?${queryURL}`;

  await puppeteerBrowser.openPage(pageUrl);

  var ratio = await puppeteerBrowser.getViewportRatio()

  await puppeteerBrowser.setPageViewport(windowHeight * ratio, windowHeight);

  puppeteerBrowser.getImage().then(async res => {
    puppeteerBrowser.page.close();

    const im = res.split(",")[1];

    var img = await Watermark.merge(Buffer.from(im, 'base64'), './static/images/watermark.png');

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