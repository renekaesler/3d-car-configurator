import gl from "./gl";
import Vec2 from "./gl/math/vec2";

const RAD_PER_PIXEL = (Math.PI / 450);

class OrbitControl {
  constructor() {
    this.client = new Vec2(0,0);

    const onMouseWheel = ({ deltaY }) => {
      this.radius += 0.002 * deltaY;

      this.radius = this.radius > 15 ? 15 : this.radius;
      this.radius = this.radius < 3 ? 3 : this.radius;

      this.camera.spherical(this.polar, this.azimuth, this.radius);
    }

    const onMouseMove = (e) => {
      e.preventDefault();
      const {clientX, clientY} = e;
      this.polar    -= RAD_PER_PIXEL * (clientY - this.client.y);
      this.azimuth  -= RAD_PER_PIXEL * (clientX - this.client.x);

      this.camera.spherical(this.polar, this.azimuth, this.radius);
      this.client.set(clientX, clientY);

      return false;
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      const {clientX, clientY} = e;
      const cam = this.camera;

      this.polar    = cam.polar;
      this.azimuth  = cam.azimuth;
      this.radius   = cam.distance;
      this.client.set(clientX, clientY);

      window.addEventListener('mousemove', onMouseMove);
      return false;
    };

    const onMouseUp = (e) => {
      e.preventDefault();
      window.removeEventListener('mousemove', onMouseMove);
      return false;
    };

    gl.canvas.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousewheel', onMouseWheel);
  }

  attach(cam) {
    this.camera   = cam;
    this.polar    = cam.polar;
    this.azimuth  = cam.azimuth;
    this.radius   = cam.distance;
  }
}

export default new OrbitControl();