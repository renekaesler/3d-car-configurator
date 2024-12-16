import Mat4 from "./gl/math/mat4";
import Vec3 from "./gl/math/vec3";

const xz    = new Vec3(0, 1, 0);

let fwd   = new Vec3();
let up    = new Vec3();
let right = new Vec3();

export default class Camera {
  constructor({aspect, fov, near, far}) {
    this.projection = new Mat4();
    this.view       = new Mat4();
    this._viewProjection = new Mat4();
    this._viewProjection.dirty = true;

    this.position = new Vec3(0,0,0);
    this.center = new Vec3(0,0,0);
    this.minPolar = 0.2;
    this.maxPolar = Math.PI / 2.1;

    this.perspective(aspect, fov, near, far);
    this.lookAt(0,0,0);
  }

  get viewProjection() {
    if (this._viewProjection.dirty) {
      Mat4.mul(this.projection, this.view, this._viewProjection);
      this._viewProjection.dirty = false;
    }

    return this._viewProjection;
  }

  get polar() {
    const pos = this.position;
    return Math.acos(pos.y / this.distance);
  }

  get azimuth() {
    const pos = this.position;
    return Math.atan2(pos.x, pos.z);
  }

  get distance() {
    return this.position.dist(this.center);
  }

  update(ctrl) {

  }

  perspective(aspect, fov = this.fov, near = this.near, far = this.far) {
    this.aspect = aspect;
    this.fov    = fov;
    this.near   = near;
    this.far    = far;

    this.projection.perspective(fov, aspect, near, far);
    this._viewProjection.dirty = true;
  }

  spherical(polar, azimuth, radius = this.distance) {
    polar = Math.min(
      Math.max(polar, this.minPolar),
      this.maxPolar
    );

    const sinPolar = Math.sin(polar);

    this.position.set(
      radius * sinPolar * Math.sin(azimuth),
      radius * Math.cos(polar),
      radius * sinPolar * Math.cos(azimuth)
    );

    this.lookAt();
  }

  lookAt(x = 0, y = 0, z = 0) {
    this.center.set(x, y, z);
    const eye = this.position;
    fwd   = Vec3.sub(this.position, this.center, fwd).normalize();
    right = Vec3.cross(xz, fwd, right).normalize();

    up  = Vec3.cross(fwd, right, up);
    const v   = this.view;
    this._viewProjection.dirty = true;

    // creates the inverse of the camera model matrix
    //     X-Axis            Y-Axis              Z-Axis
    v[0] = right.x;   v[4] = right.y;   v[8]   = right.z;
    v[1] = up.x;      v[5] = up.y;      v[9]   = up.z;
    v[2] = fwd.x;     v[6] = fwd.y;     v[10]  = fwd.z;

    v[12] = -right.x * eye.x  - right.y * eye.y - right.z * eye.z;
    v[13] = -up.x * eye.x     - up.y * eye.y    - up.z * eye.z;
    v[14] = -fwd.x * eye.x    - fwd.y * eye.y   - fwd.z * eye.z;
  }
}