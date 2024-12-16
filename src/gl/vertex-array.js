export default (gl) => {
  const VertexArray = {
    bind() { 
      gl.bindVertexArray(this);
      return this;
    },
    unbind() { 
      gl.bindVertexArray(null);
      return this; 
    }
  };

  gl.VertexArray = (block) => {
    const vao = gl.createVertexArray();

    gl.bindVertexArray(vao);
    const length = block ? block(vao) : 0;
    gl.bindVertexArray(null);

    vao.length = length;

    return Object.assign(vao, VertexArray);
  };
}