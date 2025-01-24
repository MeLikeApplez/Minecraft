import Camera from './Camera'
import Matrix4 from "../Math/Matrix4"
import Vector3 from '../Math/Vector3'

export default class Perspective extends Camera {
    /**
     * @param {Number} fov 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(fov, aspect, near, far) {
        super(fov, aspect, near, far)
    
        this.updateProjectionMatrix()
        this.lookAt(new Vector3(0, 0, -1))
    }

    /**
     * @param {Vector3} target 
     * @param {Vector3?} up 
     */
    lookAt(target, up) {
        if(!up) up = new Vector3(0, 1, 0)
        
        const zAxis = this.position.clone().subtract(target).normalize()
        const xAxis = up.cross(zAxis).normalize()
        const yAxis = zAxis.cross(xAxis).normalize()

        const rotationMatrix = new Matrix4(
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            0, 0, 0, 1
        )//.inverse()

        this.target.set(target.x, target.y, target.z)

        this.rotationMatrix.setFromMatrix4(rotationMatrix)
        this.rotation.setFromRotationMatrix(this.rotationMatrix)

        return this
    }

    /**
     * @param {Matrix4=} matrix 
     */
    updateRotationMatrix(matrix) {
        if(matrix) {
            this.rotationMatrix.setFromMatrix4(matrix)
            
            return this
        }

        this.rotationMatrix.makeRotationFromEuler(this.rotation)
        
        return this
    }

    updateViewMatrix() {
        this.viewMatrix.makeRotationFromEuler(this.rotation)

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

        return this
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        const cameraProjectionLocation = gl.getUniformLocation(program, 'cameraProjection')
        const cameraRotationLocation = gl.getUniformLocation(program, 'cameraRotation')
        const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition')
        // const viewLocation = gl.getUniformLocation(program, 'viewMatrix')

        gl.uniformMatrix4fv(cameraRotationLocation, false, this.rotationMatrix)
        gl.uniformMatrix4fv(cameraProjectionLocation, false, this.projectionMatrix)
        // gl.uniformMatrix4fv(viewLocation, false, this.viewMatrix)
        gl.uniform3f(cameraPositionLocation, this.position.x, this.position.y, this.position.z)
    }
}