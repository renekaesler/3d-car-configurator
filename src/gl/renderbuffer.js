export default (gl) => {
  const Renderbuffer = {
    bind() {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this);
      return this;
    },
    unbind() {
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      return this;
    },
    framebufferRenderbuffer(attachment, target = gl.FRAMEBUFFER) {
      gl.framebufferRenderbuffer(target, attachment, gl.RENDERBUFFER, this)
      return this;
    },
    renderbufferStorage(...params) {
      gl.renderbufferStorage(gl.RENDERBUFFER, ...params);
      return this;
    }
  };

  gl.Renderbuffer = (block) => {
    const rb = gl.createRenderbuffer();
    Object.assign(rb, Renderbuffer);

    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    block(rb);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return rb;
  };
};