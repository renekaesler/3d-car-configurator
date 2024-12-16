export default class Mat4 extends Float32Array {
  static multiply(out, a, b) {
    /*
     * Open Gl stores        |  [b0     b4     b8     b12]
     * matrices in           |  [b1     b5     b9     b13]
     * in column-major order |  [b2     b6     b10    b14]
     *                       |  [b3     b7     b11    b15]
     * =====================================================
     * [a0   a4   a8   a12]  |  [out0   out4   out8   out12]
     * [a1   a5   a9   a13]  |  [out1   out5   out9   out13]
     * [a2   a6   a10  a14]  |  [out2   out6   out10  out14]
     * [a3   a7   a11  a15]  |  [out3   out7   out11  out15]
     */

    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
  }

  static mul(a, b, out = new Mat4()) {
    return Mat4.multiply(out, a, b);
  }

  static invert(a, out = new Mat4()) {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }

  static mul(a, b, out = new Mat4()) {
       /*
     * Open Gl stores        |  [b0     b4     b8     b12]
     * matrices in           |  [b1     b5     b9     b13]
     * in column-major order |  [b2     b6     b10    b14]
     *                       |  [b3     b7     b11    b15]
     * =====================================================
     * [a0   a4   a8   a12]  |  [out0   out4   out8   out12]
     * [a1   a5   a9   a13]  |  [out1   out5   out9   out13]
     * [a2   a6   a10  a14]  |  [out2   out6   out10  out14]
     * [a3   a7   a11  a15]  |  [out3   out7   out11  out15]
     */

    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return out;
  }

  static perspective(fovy, aspect, near, far, out = new Mat4()) {
    const f  = 1.0 / Math.tan(fovy / 2),
          nf = 1 / (near - far);

    out[0] = f / aspect;        out[4] = 0;
    out[1] = 0;                 out[5] = f;
    out[2] = 0;                 out[6] = 0;
    out[3] = 0;                 out[7] = 0;

    out[8] = 0;                 out[12] = 0;
    out[9] = 0;                 out[13] = 0;
    out[10] = (far+near)*nf;    out[14] = (2*far*near)*nf;
    out[11] = -1;               out[15] = 0;

    return out;
  }

  static translate(out, a, x, y, z) {
    /*
     * Open Gl stores        |  [1     0     0     x]
     * matrices in           |  [0     1     0     y]
     * in column-major order |  [0     0     1     z]
     *                       |  [0     0     0     1]
     * ==================================================
     * [a0   a4   a8   a12]  |  [a0    a4    a8    out12]
     * [a1   a5   a9   a13]  |  [a1    a5    a9    out13]
     * [a2   a6   a10  a14]  |  [a2    a6    a10   out14]
     * [a3   a7   a11  a15]  |  [a3    a7    a11   out15]
     */

     const a0 = a[0],      a4 = a[4],      a8  = a[8] ,
           a1 = a[1],      a5 = a[5],      a9  = a[9] ,
           a2 = a[2],      a6 = a[6],      a10 = a[10],
           a3 = a[3],      a7 = a[7],      a11 = a[11];

    if (a !== out) {
      out[0] = a0;    out[4] = a4;    out[8]  = a8;
      out[1] = a1;    out[5] = a5;    out[9]  = a9;
      out[2] = a2;    out[6] = a6;    out[10] = a10;
      out[3] = a3;    out[7] = a7;    out[11] = a11;
    }

    out[12] = x*a0  +  y*a4  +  z*a8   +  a[12];
    out[13] = x*a1  +  y*a5  +  z*a9   +  a[13];
    out[14] = x*a2  +  y*a6  +  z*a10  +  a[14];
    out[15] = x*a3  +  y*a7  +  z*a11  +  a[15];

    return out;
  }

  static transformMat4(a, m, out) {
    let x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }

  static lookAt(eye, center, up, out = new Mat4()) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    // if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
    //     Math.abs(eyey - centery) < glMatrix.EPSILON &&
    //     Math.abs(eyez - centerz) < glMatrix.EPSILON) {
    //   return identity(out);
    // }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
  }

  static ortho(out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }

  constructor( arr = [1, 0, 0, 0,0, 1, 0, 0,0, 0, 1, 0,0, 0, 0, 1]) {
    super(arr);
  }

  lookAt(eye, center, up) {
    return Mat4.lookAt(eye, center, up, this);
  }

  copy(mat) {
    this[0]   = mat[0];
    this[1]   = mat[1];
    this[2]   = mat[2];
    this[3]   = mat[3];
    this[4]   = mat[4];
    this[5]   = mat[5];
    this[6]   = mat[6];
    this[7]   = mat[7];
    this[8]   = mat[8];
    this[9]   = mat[9];
    this[10]  = mat[10];
    this[11]  = mat[11];
    this[12]  = mat[12];
    this[13]  = mat[13];
    this[14]  = mat[14];
    this[15]  = mat[15];

    return this;
  }

  scale(v) {
    let x = v[0], y = v[1], z = v[2];
    this[0] = this[0] * x;
    this[1] = this[1] * x;
    this[2] = this[2] * x;
    this[3] = this[3] * x;
    this[4] = this[4] * y;
    this[5] = this[5] * y;
    this[6] = this[6] * y;
    this[7] = this[7] * y;
    this[8] = this[8] * z;
    this[9] = this[9] * z;
    this[10] = this[10] * z;
    this[11] = this[11] * z;
    return this;
  }

  clone() {
    return new Mat4(this);
  }

  identity() {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }

  invert() {
    return Mat4.invert(this, this);
  }

  multiply(b) {
    return Mat4.multiply(this,this,b);
  }

  perspective(fovy, aspect, near, far) {
    return Mat4.perspective(fovy, aspect, near, far, this);
  }

  rotateX(rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a10 = this[4];
    let a11 = this[5];
    let a12 = this[6];
    let a13 = this[7];
    let a20 = this[8];
    let a21 = this[9];
    let a22 = this[10];
    let a23 = this[11];

    // Perform axis-specific matrix multiplication
    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;

    return this;
  }

  rotateY(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;

    return this;
  }

  rotateZ(rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = this[0];
    let a01 = this[1];
    let a02 = this[2];
    let a03 = this[3];
    let a10 = this[4];
    let a11 = this[5];
    let a12 = this[6];
    let a13 = this[7];

    // Perform axis-specific matrix multiplication
    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;
    return this;
  }

  rotate(rad, x, y, z) {
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

   // if (len < glMatrix.EPSILON) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = this[0]; a01 = this[1]; a02 = this[2]; a03 = this[3];
    a10 = this[4]; a11 = this[5]; a12 = this[6]; a13 = this[7];
    a20 = this[8]; a21 = this[9]; a22 = this[10]; a23 = this[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  translate(x,y,z) {
    return Mat4.translate(this, this, x, y, z);
  }
}
