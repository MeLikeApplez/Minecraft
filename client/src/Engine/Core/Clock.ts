
export class Clock {
    private _animationId: number
    startTime: number
    fps: number
    deltaTime: number

    constructor() {
        this._animationId = -1
        this.startTime = -1

        this.fps = 0
        this.deltaTime = 0
    }

    start() {
        this.startTime = -1
        this._animationId = window.requestAnimationFrame(this.update.bind(this))

        return this._animationId
    }

    stop() {
        window.cancelAnimationFrame(this._animationId)

        this._animationId = -1
        this.startTime = -1

        return this._animationId
    }

    update(time: number) {
        this._animationId = window.requestAnimationFrame(this.update.bind(this))

        if(this.startTime === -1) {
            this.startTime = time

            return
        }

        this.deltaTime = (time - this.startTime) / 1000
        this.fps = 1 / this.deltaTime

        this.startTime = time
    }
}