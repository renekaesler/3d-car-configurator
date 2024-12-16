export default (gl) => {
  const Buffer = {
    bind() {
      gl.bindBuffer(this.type, this);
      return this;
    },
    unbind() {
      gl.bindBuffer(this.type, null);
      return this;
    }
  }

  function create(target, data, usage, size) {
    const buffer = gl.createBuffer();
    Object.assign(buffer, Buffer);

    buffer.size   = size;
    buffer.type   = target;
    buffer.length = data.length / size;

    buffer.bind();
    gl.bufferData(target, data, usage);

    return buffer.unbind();
  }

  gl.ArrayBuffer    = (data, usage = gl.STATIC_DRAW, size) => create(gl.ARRAY_BUFFER, data, usage, size);
  gl.ArrayBuffer1f  = (data, usage = gl.STATIC_DRAW) => gl.ArrayBuffer(new Float32Array(data), usage, 1);
  gl.ArrayBuffer2f  = (data, usage = gl.STATIC_DRAW) => gl.ArrayBuffer(new Float32Array(data), usage, 2);
  gl.ArrayBuffer3f  = (data, usage = gl.STATIC_DRAW) => gl.ArrayBuffer(new Float32Array(data), usage, 3);
  gl.ArrayBuffer4f  = (data, usage = gl.STATIC_DRAW) => gl.ArrayBuffer(new Float32Array(data), usage, 4);

  gl.ElementArrayBuffer     = (data, usage = gl.STATIC_DRAW, size) => create(gl.ELEMENT_ARRAY_BUFFER, data, usage, size);
  gl.ElementArrayBuffer1ui  = (data, usage = gl.STATIC_DRAW) => gl.ElementArrayBuffer(new Uint16Array(data), usage, 1);
}