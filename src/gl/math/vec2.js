export default class Vec2 extends Float32Array {
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }

  static cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }

  static dist(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
  }

  static div(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  }

  static dot(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }

  static inverse(out, a) {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    return out;
  }

  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }

  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }

  static mul(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }

  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }

  static normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
  }

  static round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }

  static scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }

  static sqDist(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
  }

  static sub(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }

  constructor(x, y) {
    super([x, y]);
  }

  get x() { return this[0]; }
  get y() { return this[1]; }

  set x(val) { this[0] = val; }
  set y(val) { this[1] = val; }

  set(x, y) { 
    this[0] = x;
    this[1] = y;
  }

  add(a) {
    return Vec2.add(this, this, a);
  }

  cross(a) {
    Vec2.cross(this, this, a);
  }

  dist(a) {
    return Vec2.dist(this,a);
  }

  div(a) {
    return Vec2.div(this, this, a);
  }

  dot(a) {
    return Vec2.dot(this,a);
  }

  floor() {
    return Vec2.floor(this,this);
  }

  inverse() {
    return Vec2.inverse(this,this);
  }

  length() {
    var x = this[0],
        y = this[1],
        z = this[2];
    return Math.sqrt(x*x + y*y + z*z);
  }

  max(a) {
    return Vec2.max(this, this, a);
  }

  min(a) {
    return Vec2.min(this, this, a);
  }

  mul(a) {
    return Vec2.mul(this, this, a);
  }

  negate() {
    return Vec2.negate(this, this);
  }

  normalize() {
    return Vec2.normalize(this,this);
  }

  round() {
    return Vec2.round(this,this);
  }

  scale(a) {
    return Vec2.scale(this,this,a);
  }

  sqDist(a) {
    return Vec2.sqDist(this,a);
  }

  sqLength() {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
  }

  sub(a) {
    return Vec2.sub(this, this, a);
  }
}