const average = require('image-average-color');
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;

class AvgColor {
  constructor() {
    this.colorRange = 10;
    this.folderPath = './textures/pvh';
    this.newFolderPath = `${this.folderPath}_new`;
    this.createDir(this.newFolderPath);
    this.getAverage();
  }
  createDir = (dirpath) => {
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath);
    }
  }
  getAverage = () => {
    var resultList = [];
    var avgCounter = 0;
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
              fs.copyFileSync(`${this.folderPath}/${file}`, `${this.newFolderPath}/${resultList[i].red}_${resultList[i].green}_${resultList[i].blue}/${file}`, COPYFILE_EXCL);
              break;
            }
          }
          if (add) {
            this.createDir(`${this.newFolderPath}/${red}_${green}_${blue}`);
            fs.copyFileSync(`${this.folderPath}/${file}`, `${this.newFolderPath}/${red}_${green}_${blue}/${file}`, COPYFILE_EXCL);
            resultList.push({
              red: red, green: green, blue: blue, names: [file]
            });
          }
          if (avgCounter == files.length - 1) {
            console.log(resultList, resultList.length)
          }
          avgCounter++;
        });
      });
    });
  }

}

module.exports = AvgColor;