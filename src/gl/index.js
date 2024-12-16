import buffer from './buffer';
import program from './program';
import shader from './shader';
import framebuffer from './framebuffer';
import renderbuffer from './renderbuffer';
import vertexArray from './vertex-array';

const eventListeners = {
  resize: new Set()
};

const gl = document
  .createElement('canvas')
  .getContext('webgl2');

buffer(gl);
program(gl);
shader(gl);
framebuffer(gl);
renderbuffer(gl);
vertexArray(gl);

let camera;
Object.defineProperty(gl, 'camera', {
  get: function() { return camera },
  set: function(value) {
    camera = value;
    camera.aspect = gl.canvas.clientHeight ? gl.canvas.clientWidth / gl.canvas.clientHeight : 0;
   }
});

gl.loop = (render) => {
  const timer = { delta: 0, elapsed: 0 };

  const loop = (elapsed) => {
    timer.delta   = elapsed - timer.elapsed;
    timer.elapsed = elapsed;

    gl.resize();
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    render(timer);
    requestAnimationFrame(loop);
  };

  loop(0);
}

gl.addEventListener = (key, listener) => {
  eventListeners[key].add(listener);
}

gl.removeEventListener = (key, listener) => {
  eventListeners[key].delete(listener);
}

gl.resize = () => {
  const canvas = gl.canvas;
  const width  = gl.canvas.clientWidth;
  const height = gl.canvas.clientHeight;

  if(canvas.width !== width || canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;

    eventListeners.resize.forEach(listener => listener({ width, height }));
  }
}

export default gl;
