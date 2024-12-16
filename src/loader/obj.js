class Obj {
  static async fetch(objPath) {
    const response  = await fetch(objPath);
    const content   = await response.text();

    const obj = new Obj().parse(content);

    // let mtlPath = objPath.split('/');
    // mtlPath.splice(-1,1);
    // mtlPath.push(obj.mtllib);
    // mtlPath = mtlPath.join('/');

    // try {
    //   obj.mtl = await Mtl.fetch(mtlPath);
    // } catch(e) {
    //   obj.mtl = {};
    // }

    return obj;
  }

  constructor() {
    this.vertices = [];
    this.uvs = [];
    this.normals = [];
    this.materials = new Set();
    this.faces = [];

    this.currentMtl = 'NONE';
  }

  parse(content) {
    const lines = content.split("\n");

    for (let i = 0, len = lines.length; i < len; ++i) {
      this.parseLine(lines[i]);
    }

    return this;
  }

  parseLine(line) {
    const [type, ...values] = line.trim().split(/\s+/);
    const parseLineType     = this[type];
    let parsedLine;

    if (typeof parseLineType === 'function') {
      parsedLine = parseLineType.call(this, values);
    }

    return parsedLine;
  }

  mtllib([filename]) {
    this.mtllib = filename;
  }

  v(coords) {
    return this.vertices.push(map(coords, parseFloat));
  }

  vt(coords) {
    return this.uvs.push(map(coords, parseFloat))
  }

  vn(coords) {
    return this.normals.push(map(coords, parseFloat));
  }

  usemtl([name]) {
    this.materials.add(name);
    return this.currentMtl = name;
  }

  f(vertices) {
    const face = [];
    face.mtl = this.currentMtl;

    for(let vertex of vertices) {
      const indices = vertex.split('/');
      face.push(map(indices, parseIndex));
    }

    return this.faces.push(face);
  }
}

function map(arr, func) {
  for (let i = 0, len = arr.length; i < len; ++i) {
    arr[i] = func(arr[i]);
  }

  return arr;
}

function parseIndex(i) {
  return i - 1;
}

export default Obj;