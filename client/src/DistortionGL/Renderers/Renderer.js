import Scene from "../Scenes/Scene.js"

/**
 * @typedef {Object} _Renderer
 * @property {Scene | null} scene
 * @property {HTMLCanvasElement} canvasElement
 * @property {number} devicePixelRatio
 */

/**
 * @type {_Renderer}
 * @module Renderer
 */
export default class Renderer {
    /**
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        this.scene = null

        this.canvasElement = canvasElement

        this.devicePixelRatio = 1
    }

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} [devicePixelRatio=1]
     */
    setSize(width, height, devicePixelRatio=1) {
        this.devicePixelRatio = devicePixelRatio

        this.canvasElement.width = width * devicePixelRatio
        this.canvasElement.height = height * devicePixelRatio
    }

    /**
     * @param {Scene} scene 
     */
    loadScene(scene) {
        if(this.scene !== null) this.scene.unload(this)
    
        this.scene = scene
        this.scene.load(this)
    }

    /**
     * @param  {...any} any 
     */
    render(...any) {}
}