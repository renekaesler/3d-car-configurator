export default class Mat3 extends Float32Array {
  normalFromMat4(mv) {
    let a00 = mv[0], a01 = mv[1], a02 = mv[2];
    let a10 = mv[4], a11 = mv[5], a12 = mv[6];
    let a20 = mv[8], a21 = mv[9], a22 = mv[10];

    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    this[0] = b01 * det;
    this[3] = (-a22 * a01 + a02 * a21) * det;
    this[6] = (a12 * a01 - a02 * a11) * det;
    this[1] = b11 * det;
    this[4] = (a22 * a00 - a02 * a20) * det;
    this[7] = (-a12 * a00 + a02 * a10) * det;
    this[2] = b21 * det;
    this[5] = (-a21 * a00 + a01 * a20) * det;
    this[8] = (a11 * a00 - a01 * a10) * det;
    
    return this;
  }

  constructor(arr = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    super(arr);
  }
}
