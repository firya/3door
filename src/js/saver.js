export default class Saver {
  constructor() {
    this.button = null;

    this.createButton();

    window.saveImage = this.saveImage;
  }

  createButton = () => {
    this.button = document.createElement("button");
    this.button.classList.add("saver");
    this.button.innerHTML = 'Save';

    document.body.append(this.button);

    this.button.addEventListener("click", this.saveImageClick);
  }

  saveImageClick = (e) => {
    e.preventDefault();

    console.time("Image to blob");
    this.saveImage().then((res) => {
      console.timeEnd("Image to blob");
    })
  }

  saveImage = () => {
    return new Promise((resolve, reject) => {
      document.querySelector('canvas').toBlob(function (blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;

          resolve(base64data);
        }
      });
    });
  }
}