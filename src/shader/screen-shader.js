import gl from '../gl';
import vsc from './vs/screen.js';
import fsc from './fs/screen.js';

const vs = gl.VertexShader(vsc);
const fs = gl.FragmentShader(fsc);
const program = gl.Program(vs, fs);

export default program;