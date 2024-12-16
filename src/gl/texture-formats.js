import gl from './index.js';

const internal = [];

internal[gl.R8]       = { format: gl.RED,   type: gl.UNSIGNED_BYTE };
internal[gl.RG16F]    = { fromat: gl.RGB,   type: gl.FLOAT };
internal[gl.RGB]      = { format: gl.RGB,   type: gl.UNSIGNED_BYTE };
internal[gl.RGBA]     = { format: gl.RGBA,  type: gl.UNSIGNED_BYTE };
internal[gl.RGB16F]   = { format: gl.RGB,   type: gl.FLOAT };
internal[gl.RGBA16F]  = { format: gl.RGBA,  type: gl.FLOAT };

export default internal;