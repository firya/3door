const average = require('image-average-color');

var fs = require('fs');

class AvgColor {
  constructor() {
    this.colorRange = 12;
    this.folderPath = './textures/shpon';
    this.getAverage();
  }
  getAverage = () => {
    var resultList = [];
    var avgCOunter = 0;
    fs.readdir(this.folderPath, (err, files) => {
      files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
      files.forEach(file => {
        average(`${this.folderPath}/${file}`, (err, color) => {
          if (err) throw err;
          var [red, green, blue, alpha] = color;

          var add = true;
          for (let i = 0; i < resultList.length; i++) {
            if (Math.abs(resultList[i].red - red) < this.colorRange && Math.abs(resultList[i].green - green) < this.colorRange && Math.abs(resultList[i].blue - blue) < this.colorRange) {
              resultList[i].names.push(file);
              add = false;
              break;
            }
          }
          if (add) {
            resultList.push({
              red: red, green: green, blue: blue, names: [file]
            });
          }
          if (avgCOunter == files.length - 1) {
            console.log(resultList, resultList.length)
          }
          avgCOunter++;
        });
      });
    });
  }

}

module.exports = AvgColor;