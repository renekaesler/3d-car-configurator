export const vert = (strings, ...values) => String
  .raw({ raw: strings }, ...values)
  .trim();

export const frag = (strings, ...values) => String
  .raw({ raw: strings }, ...values)
  .trim();

export const glsl = (strings, ...values) => String
  .raw({ raw: strings }, ...values)
  .trim();

export default (gl) => {
  function parseShader(shader, type) {
    const lines = shader.split("\n");
    const uniforms = [];
    const attributes = [];
  
    lines.forEach((line) => {
      const splitted = line.trim().replace(';','').split(' ');

      if (splitted[0] === 'uniform') {
        uniforms.push({dataType: splitted[1], name: splitted[2] });
      } else if (type === gl.VERTEX_SHADER) {
        if (splitted[0] === 'in') attributes.push({dataType: splitted[1], name: splitted[2] });
        else if (splitted[1] === 'in') attributes.push({dataType: splitted[2], name: splitted[3] });
      }
    });
  
    return [attributes, uniforms];
  }

  function create(sourceCode, type) {
    const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);

      [shader.attributes, shader.uniforms] = parseShader(sourceCode, type);

      return shader;
  }

  gl.VertexShader = sourceCode => create(sourceCode, gl.VERTEX_SHADER);
  gl.FragmentShader = sourceCode => create(sourceCode, gl.FRAGMENT_SHADER);
};