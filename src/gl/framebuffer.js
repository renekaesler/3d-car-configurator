export default (gl) => {
  const Framebuffer = {
    bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this);
      return this;
    },
    unbind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return this;
    },
    framebufferTexture2D(...params) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, ...params);
      return this;
    }
  };

  gl.Framebuffer = (block) => {
    const fb = gl.createFramebuffer();
    Object.assign(fb, Framebuffer);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    block(fb);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return fb;
  };
};