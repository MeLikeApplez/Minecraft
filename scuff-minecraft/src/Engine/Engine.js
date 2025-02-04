import Mesh from "./Mesh/Mesh"
import Renderer from "./Renderer"
import Scene from "./Scene"

/**
 * @typedef {Object} EngineType
 * @property {HTMLCanvasElement} canvasElement
 * @property {WebGL2RenderingContext} gl
 * @property {Number} _raf
 * @property {Number} _timeNow
 * @property {Number} fps
 * @property {Number} delta
 * @property {function?} onAnimate
 * @property {function?} onError
 * @property {boolean} ready
*/

/**
 * @type {EngineType}
 */
export default new class Engine {
    constructor() {
        this.canvasElement = null
        this.gl = null

        this._raf = null
        this._timeNow = 0

        this.fps =  0
        this.deltaTime = 0

        this.onAnimate = null
        this.onLoad = null
        this.onError = null

        this.ready = false
    }

    /**
     * @param {string} message 
     */
    ERROR(message=null) {
        if(message !== null) {
            console.warn('[Engine]: An Error has occured! Pausing Engine animation...')
            console.error(message)

            console.trace()
        }

        if(this.onError !== null) this.onError(message)

        this.ready = false
    }

    /**
     * @param {HTMLCanvasElement} canvasElement 
     */
    load(canvasElement) {
        this.canvasElement = canvasElement

        if(!(canvasElement instanceof HTMLCanvasElement)) return this.ERROR('Canvas Element required!')

        this.gl = this.canvasElement.getContext('webgl2')

        if(!this.gl) return this.ERROR('Your device does not support webgl2!')

        try {
            this._raf = window.requestAnimationFrame(this.animate.bind(this))

            if(this.onLoad !== null) this.onLoad(this)
        } catch(error) {
            this.ERROR(String(error))
        }

        this.ready = true
    }

    dispose() {
        this.ERROR(null)

        window.cancelAnimationFrame(this._raf)

        this._raf = null
        this.fps = 0
        this.deltaTime = 0

        this.gl = null
        this.ready = false
    }

    continue() {
        console.warn('[Engine]: Continuing Engine animation...')

        this._raf = window.requestAnimationFrame(this.animate.bind(this))
        this.ready = true
    }

    pause() {
        console.warn('[Engine]: Pausing Engine animation...')

        window.cancelAnimationFrame(this._raf)

        this._raf = null
        this.ready = false
    }

    animate(timestamp=null) {
        if(!this.ready) return

        this._raf = window.requestAnimationFrame(this.animate.bind(this))

        if(this._timeNow === null) {
            this._timeNow = timestamp

            return
        }

        this.deltaTime = (timestamp - this._timeNow) / 1000
        this.fps = 1 / this.deltaTime

       try {
           if(this.onAnimate !== null) this.onAnimate()
       } catch(error) {
            this.ERROR(String(error?.stack || error))
            this.pause()
        }
        
        this._timeNow = timestamp
    }
}

