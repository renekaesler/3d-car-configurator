import gl from './gl';
import Texture2D from './gl/texture-2d';

import Wheels from "./wheels";
import { degToRad } from './gl/math/index.js';
import orbitControl from './orbit-control.js';
import Camera from './camera.js';
import RenderContext from './render-context.js';
import Car from './car';
import Scene from './scene';
import Img from './loader/img';
import Quad from './mesh/quad.js';

import screenShader from './shader/screen-shader';

let fb;
let rb;
let tex;
const screen = new Quad().vao;

const ctx   = new RenderContext();
ctx.camera  = new Camera({
  aspect: gl.drawingBufferWidth / gl.drawingBufferHeight,
  fov: degToRad(40),
  near: 0.5,
  far: 1000
});

gl.addEventListener('resize', ({ width, height }) => {
  ctx.camera.perspective(height ? width / height : 0);
});

ctx.camera.spherical(Math.PI / 2.2, -0.8, 6.5);
orbitControl.attach(ctx.camera);

function arrange() {
  if(!ctx.wheels || !ctx.car) return;

  ctx.wheels.arrange(ctx.car);
  ctx.car.displacementBias = ctx.wheels.wheel.obb.max.y;
}

function renderScene() {
  if (ctx.scene)  {
    ctx.scene.environment.render(ctx);
    ctx.scene.render(ctx);
  }

  if (ctx.wheels) ctx.wheels.render(ctx);
  if (ctx.car)    ctx.car.render(ctx);

  gl.enable(gl.BLEND);

  if (ctx.car) ctx.car.renderTransparent(ctx);
  if (ctx.scene) ctx.scene.renderTransparent(ctx);

  gl.disable(gl.BLEND);
}

export default {
  async load ({ scene, car, wheels }) {
    return Promise.all([
      this.loadScene(scene),
      this.loadCar(car),
      this.loadWheels(wheels),
    ])
  },

  async loadCar(name) {
    const car = ctx.car;
    delete ctx.car;

    if (car) car.destroy();

    ctx.car = await Car.load(name);

    const img = await Img.fetch(`cars/${name}/shadow-plane_bw.png`);
    ctx.shadowPlane = new Texture2D(img, { internalFormat: gl.R8 });

    arrange();
  },

  async loadWheels(name) {
    const wheels = ctx.wheels;
    delete ctx.wheels;

    if (wheels) wheels.destroy();

    ctx.wheels = await Wheels.load(name);
    arrange();
  },

  async loadScene(name) {
    const scene = ctx.scene;
    delete ctx.scene;

    if (scene) scene.destroy();

    ctx.scene = await Scene.load(name);
  },

  get car() {
    return ctx.car;
  },

  get wheels() {
    return ctx.wheels;
  },

  get canvas() {
    return gl.canvas;
  },

  async run(configuration) {
    if(configuration) await this.load(configuration);

    gl.resize();

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.loop(() => {
      if (!ctx.scene || !ctx.car || !ctx.wheels) return;

      renderScene();
    });
  }
}