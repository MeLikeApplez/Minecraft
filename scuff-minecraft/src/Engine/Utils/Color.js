export default class Color extends Uint8Array {
    constructor(r, g, b) {
        super([r, g, b])
    }

    /**
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    setRgb(r=0, g=0, b=0) {
        this[0] = r
        this[1] = g
        this[2] = b
    
        return this
    }

    /**
     * @param {number} hex 
     */
    setHex(hex=0) {
        this[2] = hex & 0xFF
        this[1] = (hex & 0x00FF00) >> 8
        this[0] = (hex & 0xFF0000) >> 16

        return this
    }
}