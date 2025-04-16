import Renderer from '../Renderers/Renderer'

/**
 * @typedef {Object} _WebGL2Renderer
 * @property {WebGL2RenderingContext} gl
 */

/**
 * @type {_WebGL2Renderer}
 * @module WebGL2Renderer
 */
export default class WebGL2Renderer extends Renderer {
    /**
     * @param {HTMLCanvasElement} canvasElement 
     * @param {WebGLContextAttributes} [glOptions={}] 
     */
    constructor(canvasElement, glOptions={}) {
        super(canvasElement)

        this.gl = canvasElement.getContext('webgl2', glOptions)
    }

    clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    render() {
        if(this.scene === null || !this.scene.enabled) return

        this.clear()
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        this.scene.render(this)
    }
}