import Events from "../Core/Events"

/**
 * @typedef {'onstart' | 'onupdate' | 'onstop'} AnimationGameLoopEvents
 */

/**
 * @typedef {Object} _AnimationGameLoop
 * @property {Events<AnimationGameLoopEvents>} events
 * @property {number} animationId
 * @property {number} startTime
 * @property {number} fps
 * @property {number} deltaTime
 */

/**
 * @type {_AnimationGameLoop}
 * @module AnimationGameLoop
 */
export default class AnimationGameLoop {
    constructor() {
        this.events = new Events()

        this.animationId = -1
        this.startTime = -1

        this.fps = 0
        this.deltaTime = 0

        this.events.createEventDispatch('onstart')
        this.events.createEventDispatch('onupdate')
        this.events.createEventDispatch('onstop')
    }

    start() {
        this.startTime = -1
        this.animationId = window.requestAnimationFrame(this.update.bind(this))

        this.events.dispatchEvent('onstart', this)

        return this.animationId
    }

    stop() {
        window.cancelAnimationFrame(this.animationId)

        this.animationId = -1
        this.startTime = -1

        this.events.dispatchEvent('onstop', this)

        return this.animationId
    }

    update(time) {
        this.animationId = window.requestAnimationFrame(this.update.bind(this))

        if(this.startTime === -1) {
            this.startTime = time

            return
        }

        this.deltaTime = (time - this.startTime) / 1000
        this.fps = 1 / this.deltaTime

        this.startTime = time

        this.events.dispatchEvent('onupdate', this)
    }
}