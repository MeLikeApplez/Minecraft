import Vector3 from "../Math/Vector3"
import Matrix4 from "../Math/Matrix4"
import Euler from "../Math/Euler"

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection
export default class Camera {
    /**
     * @param {Number} fov 
     * @param {Number} aspect 
     * @param {Number} near 
     * @param {Number} far 
     */
    constructor(fov, aspect, near, far) {
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far
    
        this.projectionMatrix = new Matrix4()
        this.rotationMatrix = new Matrix4()
        this.viewMatrix = new Matrix4()

        this.position = new Vector3(0, 0, 0)
        this.rotation = new Euler(0, 0, 0)

        this.target = new Vector3(0, 0, 0)
    }

   /**
     * @param {Vector3} target 
     * @param {Vector3?} up 
     */
    lookAt(target, up) {
            return this
    }

    /**
     * @param {Matrix4=} matrix 
     */
    updateRotationMatrix(matrix) {
            return this
    }

    updateViewMatrix() {
        return this
    }

    updateProjectionMatrix() {
        return this
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        return this
    }
}