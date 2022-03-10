export const CANVASWIDTH = 1000
export const CANVASHEIGHT = 1000

export class Cube {
  constructor(x, y, z, cl, env) {
    this.x = x
    this.y = y
    this.z = z
    this.cssClass = cl
    this.environment = env || 'live'
  }
  
  get asArray() {
    return [this.x, this.y, this.z, this.cssClass, this.environment]
  }
}

export function aFloor(width, length) {
  let cubes = []
  for (var x=1; x<width; x++) {
    for (var y=1; y<length; y++) {
      const cube = new Cube(x, y, 0, 'floor-cube floor', 'floor').asArray
      cubes.push(cube)
    }
  }
  return cubes
}

export function aCube(x, y, z, cl='') {
  const c = new Cube(x, y, z, cl + ' voxel-shape').asArray
  return c
}

export function coordsToPix(c, cs, horz, vert) {
    let wx = cs,
        wy = cs,
        wz = cs + cs / 3

    let x = -(c[0] - 1) * wx + CANVASWIDTH / 2 + (c[1] - 1) * wx,
        y = (c[1] - 1) * wy / 2 + CANVASHEIGHT / 2 + (c[0] - 1) * wx / 2

    // account fo z
      y = y - (c[2] - 1) * wz

    // center y
      y = y + wz * .7

    // add horx and vert adjust
      x = x + parseFloat(horz) * cs * 1.3
      y = y - parseFloat(vert) * cs * 1.4

    return {x: x, y: y, wx: wx, wy: wy, wz: wz}
}