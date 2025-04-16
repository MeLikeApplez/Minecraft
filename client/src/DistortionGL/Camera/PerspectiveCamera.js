import Camera from './Camera.js'
import Matrix4 from '../Math/Matrix4.js'
import Vector3 from '../Math/Vector3.js'

/**
 * @typedef {Object} _PerspectiveCamera
 * @property {number} fov
 * @property {number} aspect
 * @property {number} near
 * @property {number} far
 * @property {Vector3} target
 */

/**
 * @type {_PerspectiveCamera}
 * @module PerspectiveCamera
 */
export default class PerspectiveCamera extends Camera {
    /**
     * @param {number} fov 
     * @param {number} aspect 
     * @param {number} near 
     * @param {number} far 
     */
    constructor(fov, aspect, near, far) {
        super()
        
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far
    
        this.rotationMatrix = new Matrix4()
        this.target = new Vector3(0, 0, 0)
        
        this.updateProjectionMatrix()
    }

    /**
     * @param {Vector3} target 
     * @param {Vector3?} up 
     */
    lookAt(target, up=null) {
        if(!up) up = new Vector3(0, 1, 0)
        
        const zAxis = this.position.clone().subtract(target).normalize()
        const xAxis = up.cross(zAxis).normalize()
        const yAxis = zAxis.cross(xAxis).normalize()

        const rotationMatrix = new Matrix4(
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            0, 0, 0, 1
        )

        this.target.set(target.x, target.y, target.z)

        this.rotationMatrix.setFromMatrix4(rotationMatrix)
        this.rotation.setFromRotationMatrix(this.rotationMatrix)

        return this
    }

    updateProjectionMatrix() {
        const fovRadian = this.fov * (Math.PI / 180)
        const f = 1 / Math.tan(fovRadian / 2)
        const rangeInv = 1 / (this.near - this.far)

        this.projectionMatrix.set(
            f / this.aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (this.near + this.far) * rangeInv, -1,
            0, 0, this.near * this.far * rangeInv * 2, 0
        )

        this.rotationMatrix.makeRotationFromEuler(this.rotation)

        return this
    }

    /**
    * @param {WebGL2RenderingContext} gl 
    * @param {WebGLProgram} program 
    * @param {WebGLUniformLocation | null} uniformPositionLocation
    * @param {WebGLUniformLocation | null} uniformProjectionMatrixLocation  
    * @param {WebGLUniformLocation | null} uniformRotationLocation
    */
   render(gl, program, uniformPositionLocation, uniformProjectionMatrixLocation, uniformRotationLocation) {
    // Write camera render code here
       gl.uniform3f(uniformPositionLocation, this.position.x, this.position.y, this.position.z)
       gl.uniformMatrix4fv(uniformProjectionMatrixLocation, false, this.projectionMatrix)
       gl.uniformMatrix4fv(uniformRotationLocation, false, this.rotationMatrix)
    }
}