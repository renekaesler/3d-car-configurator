import gl from './index.js';
import textureFormats from './texture-formats';

export default class Texture2D {
  static fromValue(value, tex = new Texture2D()) {
    let data = value.length ? [...value] : [value];
    data = data.map(v => parseInt(255 * v));

    tex.value = value;

    const format = [
      undefined,
      gl.R8,
      undefined,
      gl.RGB,
      gl.RGBA
    ];

    const image = new Uint8Array(data);
    image.width = 1;
    image.height = 1;

    return tex
      .bind()
      .texImage2D(image, { internalFormat: format[data.length] });
  }

  constructor(img, options) {
    this.id = gl.createTexture();
    this.bind();

    if(options) {
      this.texImage2D(img, options);
      this.texParameteri(options);

      if (img && img.length > 1) {
        this.generateMipmap();
      }
    }
  }

  bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    return this;
  }

  unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null);
    return this;
  }

  active(slot = 0) {
    gl.activeTexture(gl.TEXTURE0 + slot);
    this.bind();
    return slot;
  }

  delete() {
    this.unbind();
    gl.deleteTexture(this.id);
  }

  generateMipmap() {
    gl.generateMipmap(gl.TEXTURE_2D);
    return this;
  }

  texImage2D(img, {internalFormat = gl.RGB, width, height}) {
    const format  = textureFormats[internalFormat].format;
    const type    = textureFormats[internalFormat].type;

    if (img) {
      const images  = Array.isArray(img) ? img : [img];

      for(let level = 0, len = images.length; level < len; ++level) {
        let mipmap = images[level];
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, mipmap.width, mipmap.height, 0, format, type, mipmap);
      }
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
    }

    return this;
  }

  texParameteri({ minFilter = gl.LINEAR, magFilter = gl.LINEAR , wrapS = gl.CLAMP_TO_EDGE, wrapT = gl.CLAMP_TO_EDGE }) {
    if (minFilter)  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    if (magFilter)  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    if (wrapS)      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    if (wrapT)      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

    return this;
  }
}