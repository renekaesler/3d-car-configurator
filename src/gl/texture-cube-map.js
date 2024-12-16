import gl from './index';
import textureFormats from './texture-formats';

export default class CubeMap {
  static fromVStripImage(image, params = {}) {
    const ctx = new OffscreenCanvas(image.width, image.height).getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);

    params.images = [];

    const sw = image.width;
    const sh = image.height / 6;

    for(let i = 0; i < 6; ++i) {
      let data = ctx.getImageData(0, i * sh, sw, sh);

      data        = new Uint8Array(data.data);
      data.width  = sw;
      data.height = sh;

      params.images.push(data);
    }

    return new CubeMap(params);
  }

  constructor({
    images = [],
    internalFormat = gl.RGBA,
    format,
    type,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    wrapR = gl.CLAMP_TO_EDGE
  }) {
    this.texture = gl.createTexture();
    this.bind();

    const textureFormat = textureFormats[internalFormat];
    const _format       = format    || textureFormat.format;
    const _type         = type      || textureFormat.type;

    let hasMipmap = false;

    for(let i = 0; i < 6; ++i) {
      const mipmaps = Array.isArray(images[i]) ? images[i] : [images[i]];

      for(let level = 0, len = mipmaps.length; level < len; ++level) {
        const mipmap = mipmaps[level];
        gl.texImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
          level, internalFormat, mipmap.width, mipmap.height, 0, _format, _type, mipmap);
      }

      hasMipmap = mipmaps.length > 1;
    }

    this.texParameteri({ minFilter, magFilter, wrapS, wrapT, wrapR });

    if (hasMipmap) gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    this.unbind();
  }

  texParameteri({ minFilter, magFilter, wrapS, wrapT, wrapR }) {
    if (minFilter)  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, minFilter);
    if (magFilter)  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, magFilter);
    if (wrapS)      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrapS);
    if (wrapT)      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrapT);
    if (wrapR)      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, wrapR);
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

  bind() {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

    return this;
  }

  unbind() {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }
}