import Euler from '../Math/Euler.js'
import Matrix4 from '../Math/Matrix4.js'
import Vector3 from '../Math/Vector3.js'

/**
 * @typedef {Object} _Camera
 * @property {Vector3} position
 * @property {Euler} rotation
 * @property {Matrix4} projectionMatrix
 * @property {boolean} autoUpdate
 * @property {boolean} needsUpdate
 */

/**
 * @type {_Camera}
 * @module Camera
 */
export default class Camera {
    constructor() {
        this.position = new Vector3(0, 0, 0)
        this.rotation = new Euler()

        this.projectionMatrix = new Matrix4()

        this.autoUpdate = false
        this.needsUpdate = false
    }

    updateProjectionMatrix() {}

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {...*} any 
     */
    render(gl, program, ...any) {}
}