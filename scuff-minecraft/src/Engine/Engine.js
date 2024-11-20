import Renderer from "./Renderer"
import Scene from "./Scene"

/**
 * @typedef {Object} EngineType
 * @property {HTMLCanvasElement} canvasElement
 * @property {WebGL2RenderingContext} gl
 * @property {Scene} Scene
 * @property {Renderer} Renderer
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
export default class Engine {
    /**
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        this.canvasElement = canvasElement
        this.gl = null

        this.Scene = null
        this.Renderer = null

        this._raf = null
        this._timeNow = 0

        this.fps =  0
        this.delta = 0

        this.onAnimate = null
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
        }

        if(this.onError !== null) this.onError(message)

        this.ready = false
    }

    load() {
        this.gl = this.canvasElement.getContext('webgl2')

        if(!this.gl) return this.ERROR('Your device does not support webgl2!')

        try {
            this.Renderer = new Renderer(this.gl, this.canvasElement)
            this.Scene = new Scene(this.gl, this.Renderer)

            this._raf = window.requestAnimationFrame(this.animate.bind(this))
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
        this.delta = 0

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

        this.delta = (timestamp - this._timeNow) / 1000
        this.fps = 1 / this.delta

       try {
           this.Renderer.update(this.Scene)
            
           if(this.onAnimate !== null) this.onAnimate(this)
       } catch(error) {
            this.ERROR(String(error))
            this.pause()
        }
        
        this._timeNow = timestamp
    }
}

