const Jimp = require('jimp');

class Watermark {
  constructor() {

  }

  merge = async (image, watermark) => {
    [image, watermark] = await Promise.all([
      Jimp.read(image),
      Jimp.read(watermark)
    ]);

    watermark.resize(image.bitmap.width, Jimp.AUTO);

    const X = image.bitmap.width - watermark.bitmap.width;
    const Y = (image.bitmap.height - watermark.bitmap.height) / 2;

    image.composite(watermark, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 1,
        opacityDest: 1
      }
    ]);

    return new Promise((resolve, reject) => {
      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        resolve(buffer);
      });
    });
  }
}

module.exports = new Watermark();