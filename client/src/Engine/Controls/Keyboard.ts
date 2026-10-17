export class Keyboard {
    element: HTMLElement | null
    keys: Set<string>
    lowerCase: boolean

    constructor(element: HTMLElement, lowerCase=false) {
        this.element = element

        this.keys = new Set()
        this.lowerCase = lowerCase
    
        if(element) this.load(element)
    }

    dispose() {
        if(!this.element) return false

        window.onkeydown = null
        window.onkeyup = null

        this.element = null
        this.keys.clear()

        return true
    }

    hasKey(key: string) {
        return this.keys.has(key)
    }

    load(element: HTMLElement) {
        this.element = element
        this.keys.clear()

        window.onkeydown = event => {
            const key = this.lowerCase ? event.key.toLowerCase() : event.key

            if(this.keys.has(key)) return;

            this.keys.add(key)
        }

        window.onkeyup = event => {
            const key = this.lowerCase ? event.key.toLowerCase() : event.key
            
            if(!this.keys.has(key)) return;
        
            this.keys.delete(key)
        }

        return true
    }
}