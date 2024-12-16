export default (gl) => {
  const Program = {
    use() {
      gl.useProgram(this);
      return this;
    }
  }

  function createAttibLocation(program, name) {
    const location = gl.getAttribLocation(program, name);
    Object.defineProperty(program, name, {
      get: function() { return location },
      set: function(buffer) {
        gl.enableVertexAttribArray(location);
        buffer.bind();
        gl.vertexAttribPointer(location, buffer.size, gl.FLOAT, false, 0, 0);
       }
    });
  }

  function createUniformLocation(program, name, type) {
    const location = gl.getUniformLocation(program, name);
    const setter = {
      mat4: function(value) { gl.uniformMatrix4fv(location, false, value); },
      mat3: function(value) { gl.uniformMatrix3fv(location, false, value); },
      vec2: function(value) { gl.uniform2fv(location, value); },
      vec3: function(value) { gl.uniform3fv(location, value); },
      vec4: function(value) { gl.uniform4fv(location, value); },
      bool: function(value) { gl.uniform1i(location, value)},
      float: function(value) { gl.uniform1f(location, value); },
      sampler2D: function(value) { gl.uniform1i(location, value); },
      samplerCube: function(value) { gl.uniform1i(location, value); }
    }

    Object.defineProperty(program, name, {
      get: function() { return location },
      set: setter[type]
    });
  }

  gl.Program = (...shaders) => {
    const program = gl.createProgram();
    const attributes = new Set();
    const uniforms = new Set();

    shaders.forEach((shader) => {
      gl.attachShader(program, shader);
      shader.attributes.forEach(attr => attributes.add(attr));
      shader.uniforms.forEach(uni => uniforms.add(uni));
    });

    gl.linkProgram(program);

    attributes.forEach(({name}) => createAttibLocation(program, name));
    uniforms.forEach(({name, dataType}) => createUniformLocation(program, name, dataType));

    return Object.assign(program, Program);
  };
};
