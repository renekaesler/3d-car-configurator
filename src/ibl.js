import gl from './gl';
import Texture2D from './gl/texture-2d';

import Mat4 from './gl/math/mat4';
import { degToRad } from './gl/math';

import eqrShader from './shader/eqr-shader';
import irradianceShader from './shader/irradiance-shader';
import prefilterShader from './shader/prefilter-shader';
import brdfShader from './shader/brdf-shader';

import Cube from './mesh/cube';
import Quad from './mesh/quad';

if(!gl.getExtension("EXT_color_buffer_float")) {
  throw 'WebglExtension - EXT_color_buffer_float - is required!';
}

const cube = new Cube();
const quad = new Quad();

function draw(obj) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  obj.draw();
}

export default class Ibl {
  constructor(hdri) {
    this.hdri = hdri;
    this.projection = Mat4.perspective(degToRad(90), 1, 0, 2);
    this.views = [
      Mat4.lookAt([0, 0, 0], [ 1, 0, 0], [0,-1, 0]), // posx
      Mat4.lookAt([0, 0, 0], [-1, 0, 0], [0,-1, 0]), // negx
      Mat4.lookAt([0, 0, 0], [ 0, 1, 0], [0, 0, 1]), // posy
      Mat4.lookAt([0, 0, 0], [ 0,-1, 0], [0, 0,-1]), // negy
      Mat4.lookAt([0, 0, 0], [ 0, 0, 1], [0,-1, 0]), // posz
      Mat4.lookAt([0, 0, 0], [ 0, 0,-1], [0,-1, 0]), // negz
    ];

    this.fb = gl.Framebuffer(() => {
      this.rb = gl.Renderbuffer(rb => rb
        .framebufferRenderbuffer(gl.DEPTH_ATTACHMENT)
        .renderbufferStorage(gl.DEPTH_COMPONENT24, 1024, 1024))
    });

    // this.hdrMap = gl.TextureCubeMap((map) => {
    //   map.texImage2D(0, gl.RGBA16F, hdri.width, hdri.height, 0, gl.RGBA, gl.FLOAT, null);
    //   map.texParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //   map.texParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //   map.texParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //   map.texParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //   map.texParameteri(gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    // });

    // this.generateHdrMap();
  }

  generateHdrMap() {
    gl.viewport(0, 0, this.hdri.width, this.hdri.height);
    gl.activeTexture(gl.TEXTURE0);

    const eqrTexture = new Texture2D((tex) => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      tex.texImage2D(0, gl.RGBA16F, this.hdri.width, this.hdri.height, 0, gl.RGBA, gl.FLOAT, this.hdri);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);

      tex.texParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      tex.texParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      tex.texParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      tex.texParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    });

    const bindings = [this.fb, eqrTexture].map(o => o.bind());

    eqrShader.use();
    eqrShader.projection = this.projection;
    eqrShader.equirectangularMap = 0;

    for(let i = 0; i < 6; ++i) {
      eqrShader.view = this.views[i];
      this.fb.framebufferTexture2D(gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.hdrMap, 0);
      draw(cube);
    }

    bindings.map(b => b.unbind());
  }

  generateEnvironmentMap() {
    return this.hdrMap;
  }

  generateIrradianceMap(size = 32) {
    gl.activeTexture(gl.TEXTURE0);
    gl.viewport(0, 0, size, size);

    const irradianceMap = gl.TextureCubeMap((map) => {
      map.texImage2D(0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
      map.texParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      map.texParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      map.texParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      map.texParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      map.texParameteri(gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    });

    const bindings = [this.fb, this.rb, this.hdrMap].map(b => b.bind());

    this.rb.renderbufferStorage(gl.DEPTH_COMPONENT24, size, size);

    irradianceShader.use();
    irradianceShader.projection = this.projection;
    irradianceShader.environmentMap = 0;

    for(let i = 0; i < 6; ++i) {
      irradianceShader.view = this.views[i];
      this.fb.framebufferTexture2D(gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, irradianceMap, 0);
      draw(cube);
    }

    bindings.map(b => b.unbind());

    return irradianceMap;
  }

  generatePrefilterMap(size = 1024) {
    const prefilterMap = gl.TextureCubeMap((map) => {
      map.texImage2D(0, gl.RGBA16F, size, size, 0, gl.RGBA, gl.FLOAT, null);
      map.texParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      map.texParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      map.texParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      map.texParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      map.texParameteri(gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
      map.generateMipmap();
    });

    const bindings = [this.fb, this.rb].map(b => b.bind());

    prefilterShader.use();
    prefilterShader.projection      = this.projection;
    prefilterShader.environmentMap  = this.hdrMap.active(0);

    const maxMipLevels = 5;
    for (let mip = 0; mip < maxMipLevels; ++mip) {
      const mipSize = size * Math.pow(0.5, mip);
      const roughness = mip / (maxMipLevels - 1);

      gl.viewport(0, 0, mipSize, mipSize);

      this.rb.renderbufferStorage(gl.DEPTH_COMPONENT24, mipSize, mipSize);
      prefilterShader.roughness = roughness;

      for (let i = 0; i < 6; ++i) {
        prefilterShader.view = this.views[i];
        this.fb.framebufferTexture2D(gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, prefilterMap, mip);
        draw(cube);
      }
    }

    bindings.map(b => b.unbind());

    return prefilterMap;
  }

  generateBrdfLutTexture(size = 512) {
    gl.activeTexture(gl.TEXTURE0);
    gl.viewport(0, 0, size, size);

    const brdfLUTTexture = new Texture2D(null, {
      internalFormat: gl.RGBA16F,
      width: size,
      height: size
    });

    const bindings = [this.fb, this.rb].map(b => b.bind());

    this.fb.framebufferTexture2D(gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D , brdfLUTTexture.id, 0);
    this.rb.renderbufferStorage(gl.DEPTH_COMPONENT24, size, size);
    brdfShader.use();
    draw(quad);

    bindings.map(b => b.unbind());

    return brdfLUTTexture;
  }
}