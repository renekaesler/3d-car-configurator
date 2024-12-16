import gl from './gl';
import TextureCubeMap from './gl/texture-cube-map';
import Mat4 from './gl/math/mat4';
import { degToRad } from './gl/math/index.js';

import Dds from './loader/dds.js';
import Img from './loader/img.js';
import shader from './shader/skybox-shader';

export default class Environment {
  static async load(url) {
    const maps = await Promise.all([
      await Img.fetch(`${url}/skybox.png`),
      await Dds.fetch(`${url}/radiance.dds`),
      await Dds.fetch(`${url}/irradiance.dds`),
    ]);

    return new Environment({
      skybox: TextureCubeMap.fromVStripImage(maps[0]),
      radiance: new TextureCubeMap({ images: maps[1], internalFormat: gl.RGBA16F, minFilter: gl.LINEAR_MIPMAP_LINEAR }),
      irradiance: new TextureCubeMap({ images: maps[2], internalFormat: gl.RGBA16F })
    })
  }

  constructor({skybox, radiance, irradiance}) {
    this.skybox     = skybox;
    this.radiance   = radiance;
    this.irradiance = irradiance;
    this.background = skybox;

    this.viewProjection = new Mat4();
    this.projection     = new Mat4();
    this.fov            = degToRad(50);

    this.buffers = [
      gl.ArrayBuffer3f([
        //          v1                 v2                 v3                 v4
        -1.0,-1.0, 1.0,     1.0,-1.0, 1.0,     1.0, 1.0, 1.0,    -1.0, 1.0, 1.0, // front
        -1.0,-1.0,-1.0,    -1.0, 1.0,-1.0,     1.0, 1.0,-1.0,     1.0,-1.0,-1.0, // back
        -1.0, 1.0,-1.0,    -1.0, 1.0, 1.0,     1.0, 1.0, 1.0,     1.0, 1.0,-1.0, // top
        -1.0,-1.0,-1.0,     1.0,-1.0,-1.0,     1.0,-1.0, 1.0,    -1.0,-1.0, 1.0, // bottom
         1.0,-1.0,-1.0,     1.0, 1.0,-1.0,     1.0, 1.0, 1.0,     1.0,-1.0, 1.0, // right
        -1.0,-1.0,-1.0,    -1.0,-1.0, 1.0,    -1.0, 1.0, 1.0,    -1.0, 1.0,-1.0, // left
      ]),
      gl.ElementArrayBuffer1ui([
        //  tri1           tri2
        0, 2, 1,       0, 3, 2,   // front
        4, 6, 5,       4, 7, 6,   // back
        8, 10,9,       8,11,10,   // top
        12,14,13,      12,15,14,  // bottom
        16,18,17,      16,19,18,  // right
        20,22,21,      20,23,22   // left
      ])
    ]

    this.vao = gl.VertexArray(() => {
      const positionBuffer = this.buffers[0];
      const indexBuffer = this.buffers[1];

      positionBuffer.bind();
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, positionBuffer.size, gl.FLOAT, false, 0, 0);

      return indexBuffer.bind().length;
    });

    this.onresize({ width: gl.canvas.clientWidth, height: gl.canvas.clientHeight });

    gl.addEventListener('resize', this.onresize.bind(this))
  }

  destroy() {
    this.skybox.delete();
    this.radiance.delete();
    this.irradiance.delete();
    this.background.delete();

    this.vao.unbind();
    gl.deleteVertexArray(this.vao);

    for(let buffer of this.buffers) {
      gl.deleteBuffer(buffer);
    }
  }

  onresize({ width, height }) {
    this.projection.perspective(this.fov, width / height, 0.0, 0.0);
  }

  render(ctx) {
    ctx.switchShader(shader);

    gl.depthFunc(gl.LEQUAL);

    const view = this.viewProjection.copy(ctx.camera.view);
    view[12] = view[13] = view[14] = 0.0;

    shader.viewProjection = Mat4.mul(this.projection, view, this.viewProjection);
    shader.txtr = this.background.active(0);

    this.vao.bind();
    gl.drawElements(gl.TRIANGLES, this.vao.length, gl.UNSIGNED_SHORT, 0);

    gl.depthFunc(gl.LESS);
  }
}