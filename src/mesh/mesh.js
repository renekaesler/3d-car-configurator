import gl from '../gl';
import Obb3 from '../obb3';
import Vec3 from '../gl/math/vec3';

export default class Mesh {
  constructor({ indices, positions, normals, uvs }) {
    if (uvs && uvs.length !== positions.length / 3 * 2) {
      uvs = []
      for(let i = 0, len = positions.length / 3 * 2; i < len; ++i) {
        uvs.push(1.0);
      }
    }

    this.obb = new Obb3();
    const vec = new Vec3();

    for(let i = 0, len = positions.length; i < len; i += 3) {
      vec.x = positions[i];
      vec.y = positions[i + 1];
      vec.z = positions[i + 2];
      this.obb.surround(vec);
    }


    this.buffers = [
      positions ? gl.ArrayBuffer3f(positions) : undefined,
      normals ? gl.ArrayBuffer3f(normals) : undefined,
      uvs && uvs.length > 0 ? gl.ArrayBuffer2f(uvs) : undefined,
      indices ? gl.ElementArrayBuffer1ui(indices) : undefined
    ];

    this.vao = gl.VertexArray(() => {
      for(let i = 0; i < 3; ++i) {
        const buffer = this.buffers[i];

        if (!buffer) {
          gl.disableVertexAttribArray(i);
          continue;
        }

        buffer.bind();
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, buffer.size, gl.FLOAT, false, 0, 0);
      }

      return this.buffers[3].bind().length;
    });
  }

  destroy() {
    this.vao.unbind();
    gl.deleteVertexArray(this.vao);

    for(let buffer of this.buffers) {
      gl.deleteBuffer(buffer);
    }
  }

  draw() {
    this.vao.bind();
    gl.drawElements(gl.TRIANGLES, this.vao.length, gl.UNSIGNED_SHORT, 0);
  }
}