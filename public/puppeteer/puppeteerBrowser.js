const puppeteer = require('puppeteer');
const fs = require('fs');

class PuppeteerBrowser {
  constructor(w, h) {
    this.h = parseInt(h, 10) || 1024;
    this.w = parseInt(w, 10) || Math.round(this.h * (389 / 799));
    this.SECRET_URL = '182nKJfh8231bhdja176t38bf3888NBv237';
  }

  createPuppeteer = async () => {
    console.time("Puppeteer load");
    return new Promise(async resolve => {
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROMIUM_PATH,
        args: ['--no-sandbox']
      });
      console.timeEnd("Puppeteer load");
      resolve();
    })
  }

  batchSave = async (urlParams = [], force = false) => {
    var that = this;

    for (let i = 0; i < urlParams.length; i++) {

      var trimFileName = (urlParams[i].trim) ? '_trim' : '';
      var fileName = `door_${urlParams[i].material}_${urlParams[i].size}_${urlParams[i].figure}-${urlParams[i].texture}-${urlParams[i].bump}_${urlParams[i].side}${trimFileName}_${urlParams[i].furniture}`;

      if (force || !fs.existsSync(`uploads/${fileName}.jpg`)) {
        var url = `http://localhost:8080/redactor${this.SECRET_URL}?sh=${urlParams[i].sh}&size=${urlParams[i].size}&figure=${urlParams[i].figure}&material=${urlParams[i].material}&texture=${urlParams[i].texture}&bump=${urlParams[i].bump}&side=${urlParams[i].side}&invert=${urlParams[i].invert}&trim=${urlParams[i].trim}&furniture=${urlParams[i].furniture}`;

        console.time(`Total time`);

        await that.openPage(url).then(async res => {
          var ratio = await that.getViewportRatio();
          await that.setPageViewport(urlParams[i].sh * ratio, urlParams[i].sh);
          await that.getImage().then(async res => {
            await that.page.close();

            console.log(`Page loaded`);

            await that.saveImage(res, fileName)

            console.log(`File saved ${fileName}`);
            console.log(`${i + 1}/${urlParams.length}`)
            console.timeEnd(`Total time`);
          });
        });
      }
    }
  }

  openPage = async (url, size) => {
    this.page = await this.browser.newPage();

    this.page.on('console', consoleObj => console.log(consoleObj.text()));

    size = size || [this.w, this.h];

    // set page viewport size
    await this.page.setViewport({
      width: parseInt(size[0], 10),
      height: parseInt(size[1], 10),
      deviceScaleFactor: 1,
    });

    console.time(`Page load ${url}`);
    await this.page.goto(url);
    console.timeEnd(`Page load ${url}`);
  }

  setPageViewport = (width, height) => {
    return new Promise(async (resolve, rreject) => {
      await this.page.setViewport({
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        deviceScaleFactor: 1,
      });

      resolve();
    });
  }

  getViewportRatio = async () => {
    return await this.page.evaluate(() => {
      return new Promise((resolve, reject) => {
        var thick = setInterval(async () => {
          if (window.allResourcesLoaded) {
            clearInterval(thick);

            resolve(window.viewportRatio);
          }
        }, 10);
      });
    });
  }

  getImage = async (setParamsProps = {}) => {
    return await this.page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.saveImage().then((res) => {
          resolve(res);
        });
      });
    });
  }

  saveImage = (res, filename = 'default') => {
    const im = res.split(",")[1];

    const img = Buffer.from(im, 'base64');

    fs.writeFile(`uploads/${filename}.jpg`, img, 'binary', function (err) {
      if (err) throw err
      console.log('File saved.')
    });
  }
}

module.exports = PuppeteerBrowser;