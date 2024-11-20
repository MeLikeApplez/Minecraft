/**
 * @typedef {Object} KeyboardType
 * @property {HTMLElement?} element
 */

/**
 * @type {KeyboardType}
 */
export default class Keyboard {
    /**
     * @param {HTMLElement?} element 
     */
    constructor(element) {
        this.element = element

        this.keys = new Set()

        this.keyDown = false
        this.keyUp = true

        this.mouseDrag = false
        this.mouseDown = false
        this.mouseUp = true
    
        this.mouseX = 0
        this.mouseY = 0

        this.mouseDownX = 0
        this.mouseDownY = 0
    }

    /**
     * @param {HTMLElement?} element 
     */
    load(element) {
        this.dispose()
        
        if(element instanceof HTMLElement) this.element = element
        if(!this.element) throw Error('No element specified!')

        window.onkeydown = event => {
            const key = event.key.toLowerCase()

            if(this.keys.has(key)) return

            this.keys.add(key)
        }

        window.onkeyup = event => {
            this.keys.delete(event.key.toLowerCase())
        }

        /**
         * @param {MouseEvent} event 
         */
        element.onmousemove = event => {
            const rect = element.getBoundingClientRect()
        
            this.mouseX = event.clientX - rect.left
            this.mouseY = event.clientY - rect.top
        }

        element.onmousedown = () => {
            this.mouseDown = true
            this.mouseUp = false

            if(!this.mouseDrag && this.mouseDown) {
                this.mouseDrag = true

                this.mouseDownX = this.mouseX
                this.mouseDownY = this.mouseY
            }
        }

        element.onmouseup = () => {
            this.mouseDown = false
            this.mouseUp = true

            if(this.mouseDrag) {
                this.mouseDrag = false

                this.mouseDownX = 0
                this.mouseDownY = 0

                this.mouseDragX = 0
                this.mouseDragY = 0
            }
        }
    }

    getUpdateDrag() {
        if(!this.mouseDown) return { dragX: 0, dragY: 0 }

        const dragX = this.mouseX - this.mouseDownX
        const dragY = this.mouseDownY - this.mouseY

        this.mouseDownX = this.mouseX
        this.mouseDownY = this.mouseY

        return { dragX, dragY }
    }

    dispose() {
        window.onkeydown = undefined
        window.onkeyup = undefined

        if(this.element instanceof HTMLElement) {
            this.element.onmousemove = undefined
            this.element.onmousedown = undefined
            this.element.onmouseup = undefined
        }

        this.keys.clear()
    }
}