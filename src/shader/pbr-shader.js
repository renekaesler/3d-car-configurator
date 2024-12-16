import gl from '../gl';
import vsc from './vs/pbr.js';
import fsc from './fs/pbr.js';

const vs = gl.VertexShader(vsc);
const fs = gl.FragmentShader(fsc);
const program = gl.Program(vs, fs);

export default program;