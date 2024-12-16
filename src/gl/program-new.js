import GL from './rendering-context-base';

const UNIFORM_SETTER = (() => {
  let setter = {
    BOOL(location, value)         { this.uniform1i(location, value); },
    FLOAT(location, value)        { this.uniform1f(location, value); },
    FLOAT_VEC2(location, value)   { this.uniform2fv(location, value); },
    FLOAT_VEC3(location, value)   { this.uniform3fv(location, value); },
    FLOAT_VEC4(location, value)   { this.uniform4fv(location, value); },
    FLOAT_MAT2(location, value)   { this.uniformMatrix2fv(location, false, value); },
    FLOAT_MAT3(location, value)   { this.uniformMatrix3fv(location, false, value); },
    FLOAT_MAT4(location, value)   { this.uniformMatrix4fv(location, false, value); },
    SAMPLER_2D(location, value)   { this.uniform1i(location, value); },
    SAMPLER_CUBE(location, value) { this.uniform1i(location, value); },
  };

  setter = Object.entries(setter).map(([key, value]) => [GL[key], value]);
  setter = Object.fromEntries(setter);

  return Object.freeze(setter);
})();

function linkAttribLocations() {
  const gl          = this.gl;
  const numUniforms = gl.getProgramParameter(this.value, gl.ACTIVE_ATTRIBUTES);

  for (let i = 0; i < numUniforms; ++i) {
    const info      = gl.getActiveAttrib(this.value, i);
    const location  = gl.getAttribLocation(this.value, info.name);

    Object.defineProperty(this, info.name, {
      get: function() { return location },
      set: function(buffer) {
        buffer.bind();
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, buffer.size, gl.FLOAT, false, 0, 0);
      }
    });
  }
}

function linkUniformLocations() {
  const gl          = this.gl;
  const numUniforms = gl.getProgramParameter(this.value, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < numUniforms; ++i) {
    const info      = gl.getActiveUniform(this.value, i);
    const location  = gl.getUniformLocation(this.value, info.name);

    Object.defineProperty(this, info.name, {
      get: function() { return location },
      set: UNIFORM_SETTER[info.type].bind(gl, location)
    });
  }
}

export default class Program {
  constructor(gl, ...shaders) {
    this.gl = gl;
    this.value = gl.createProgram();

    shaders.forEach((shader) => gl.attachShader(this.value, shader));

    gl.linkProgram(this.value);

    linkAttribLocations.call(this);
    linkUniformLocations.call(this);
  }

  use() {
    this.gl.useProgram(this.value);
    return this;
  }
}