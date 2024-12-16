import gl from '../gl';
import vsc from './vs/texture.js';
import fsc from './fs/texture.js';

const vs = gl.VertexShader(vsc);
const fs = gl.FragmentShader(fsc);
const program = gl.Program(vs, fs);

export default program;