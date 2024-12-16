import Mesh from "./mesh";

export default function createFromObj(obj, splitByMaterial = true) {
  const buffs = {};

  for (let i = 0, numFaces = obj.faces.length; i < numFaces; ++i) {
    const face          = obj.faces[i];
    const buff          = buffs[face.mtl] = buffs[face.mtl] || {
      positions: [],
      uvs: [],
      normals: [],
      indices: [],
      vIdxs: [],
      idxMap: { nextIdx: 0 }
    };

    for (let j = 0, numVerts = face.length; j < numVerts; ++j) {
      let vertex;
      const [pIdx, uvIdx, nIdx] = face[j];
      const key                 = `${pIdx};${uvIdx};${nIdx}`;

      if (buff.idxMap[key]) {
        vertex = buff.idxMap[key];
      } else {
        vertex  = buff.idxMap[key] = { pIdx, nIdx, uvIdx, vIdx: buff.idxMap.nextIdx++ };

        const position  = obj.vertices[vertex.pIdx];
        const uv        = obj.uvs[vertex.uvIdx];
        const normal    = obj.normals[vertex.nIdx];

        if (position) buff.positions.push(...position);
        if (normal)   buff.normals.push(...normal);
        if (uv)       buff.uvs.push(...uv);
      }

      if (j < 3) {
        buff.indices.push(vertex.vIdx);
      } else {
        buff.indices.push(buff.vIdxs[0], buff.vIdxs[buff.vIdxs.length - 1], vertex.vIdx);
      }

      buff.vIdxs.push(vertex.vIdx);
    }
  }

  return Object.entries(buffs).map(([name, buff]) => [
    new Mesh({
      indices: buff.indices,
      positions: buff.positions,
      normals: buff.normals,
      uvs: buff.uvs
    }),
    name
  ]);
}