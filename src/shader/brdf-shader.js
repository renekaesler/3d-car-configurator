import gl from '../gl';
import vsc from './vs/brdf.js';
import fsc from './fs/brdf.js';

const vs = gl.VertexShader(vsc);
const fs = gl.FragmentShader(fsc);
const program = gl.Program(vs, fs);

export default program;