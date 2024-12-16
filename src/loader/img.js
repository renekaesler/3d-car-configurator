export default class Img extends Uint8Array {
  static async fetch(path) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload  = () => resolve(img);
      img.onerror = reject;
      img.src = path;
    });
  }

  get channels() {
    return this.length / this.width / this.height;
  }

  constructor({width, height, data}) {
    super(data);

    this.width = width;
    this.height = height;
  }
}