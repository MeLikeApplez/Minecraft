type ClipSpaceOptions = 'normalized-device-coordinates' | 'normalized-dom' | 'dom'

interface PointerOptions {
    devicePixelRatio?: number
    clipSpace?: ClipSpaceOptions
}

// Unfinished
export class Pointer {
    /*
    element: HTMLElement | null
    position: Vector2
    down: Vector2
    drag: Vector2
    offset: Vector2
    mouseScroll: number
    isPointerDragging: boolean
    isPointerDown: boolean
    isPointerUp: boolean
    devicePixelRatio: number
    clipSpace: ClipSpaceOptions

    constructor(element: HTMLElement | null, options?: PointerOptions) {
        this.element = element

        this.position = new Vector2(0, 0)
        this.down = new Vector2(0, 0)
        this.drag = new Vector2(0, 0)
        this.offset = new Vector2(0, 0)
        this.mouseScroll = 0

        this.isPointerDragging = false
        this.isPointerDown = false
        this.isPointerUp = true

        this.devicePixelRatio = options?.devicePixelRatio ?? 1
        this.clipSpace = options?.clipSpace ?? 'dom'

        if(element) this.load(element)
    }

    private _setPosition(event: PointerEvent, rect: DOMRect, offset: Vector2) {
        if(!this.element) return

        let x = this.devicePixelRatio * (event.clientX - rect.left + offset.x)
        let y = this.devicePixelRatio * (event.clientY - rect.top + offset.y)
        const width = (rect.width / 2) * this.devicePixelRatio
        const height = (rect.height / 2) * this.devicePixelRatio

        switch(this.clipSpace) {
            case 'normalized-device-coordinates': {
                x = (x - width) / width
                y = (height - y) / height

                break
            }
            case 'normalized-dom': {
                x = (x - width) / width
                y = (y - height) / height
                
                break
            }
            case 'dom': {
                x = x - width
                y = y - height

                break
            }
            default: console.error('Clip space not defined!')
        }

        this.position.set(x, y)
    }

    dispose() {
        if(!this.element) return false

        this.position.set(0, 0)
        this.down.set(0, 0)
        this.drag.set(0, 0)
        this.offset.set(0, 0)

        this.element.onpointerdown = null
        this.element.onpointermove = null
        this.element.onpointerup = null
        this.element.onwheel = null

        this.element = null

        return true
    }

    load(element: HTMLElement) {
        this.element = element

        element.onwheel = event => {
            this.mouseScroll += event.deltaY
        }

        element.onpointerdown = event => {
            this.isPointerDown = true
            this.isPointerUp = false

            const rect = element.getBoundingClientRect()

            this._setPosition(event, rect, this.offset)
            this.drag.set(0, 0)

            if(!this.isPointerDragging && this.isPointerDown) {
                this.isPointerDragging = true

                this.down.copy(this.position)
            }
        }

        element.onpointermove = event => {
            const rect = element.getBoundingClientRect()

            this._setPosition(event, rect, this.offset)

            if(this.isPointerDown) {
                this.drag.set(
                    this.position.x - this.down.x,
                    this.position.y - this.down.y,
                )
            }
        }

        element.onpointerup = event => {
            this.isPointerDown = false
            this.isPointerUp = true
        
            if(this.isPointerDragging) {
                this.isPointerDragging = false
         
                this.down.set(0, 0)
                this.drag.set(0, 0)
            }
        }

        return true
    }
    */
}