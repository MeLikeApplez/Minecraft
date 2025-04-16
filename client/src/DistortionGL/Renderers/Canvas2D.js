import Renderer from '../Renderers/Renderer'

/**
 * @typedef {Object} _WebGL2Renderer
 * @property {CanvasRenderingContext2D} context2D
 */

/**
 * @type {_WebGL2Renderer}
 * @module WebGL2Renderer
 */

export default class Canvas2DRenderer extends Renderer {
    /**
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        super(canvasElement)

        this.context2D = canvasElement.getContext('2d')
    }

    render() {
        if(this.scene === null || !this.scene.enabled) return

        this.context2D.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)

        this.scene.render(this)
    }
}