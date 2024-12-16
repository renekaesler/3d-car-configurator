import gl from '../gl';
import vsc from './vs/cubemap.js';
import fsc from './fs/prefilter.js';

const vs = gl.VertexShader(vsc);
const fs = gl.FragmentShader(fsc);
const program = gl.Program(vs, fs);

export default program;