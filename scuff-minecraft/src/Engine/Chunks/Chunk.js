/**
 * @typedef {Object} ChunkType
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} length
 * @property {Uint8Array} blocks
 * @property {WebGLBuffer | null} transformBuffer
 */

/**
 * @type {ChunkType}
 */
export default class Chunk {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
    static BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT
    static WIDTH = 16
    static HEIGHT = 1
    static LENGTH = 16

    BYTES_PER_ELEMENT = Uint8Array.BYTES_PER_ELEMENT
    
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} [width=Chunk.WIDTH] 
     * @param {number} [height=Chunk.HEIGHT] 
     * @param {number} [length=Chunk.LENGTH] 
     */
    constructor(x, y, width=Chunk.WIDTH, height=Chunk.HEIGHT, length=Chunk.LENGTH) {
        this.x = x
        this.y = y

        this.width = width
        this.height = height
        this.length = length

        this.transformBuffer = null
        // bottom to top
        this.blocks = new Uint8Array(width * height * length * 3)

        this.initialized = false

        this.setChunk(width, height, length)
    }

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} length 
     */
    setChunk(width, height, length) {
        let index = 0

        // create new array if size is different
        // just reuse the array if they're the same size
        if(width !== this.width || height !== this.height || length !== this.length) {
            this.width = width
            this.height = height
            this.length = length
        
            this.blocks = new Uint8Array(width * height * length * 3)
        }

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x ++) {
                for(let z = 0; z < length; z++) {
                    this.blocks[index] = x
                    this.blocks[index + 1] = y
                    this.blocks[index + 2] = z

                    index += 3
                }
            }
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(!gl || !program) return null
        
        if(this.transformBuffer === null) {
            this.transformBuffer = gl.createBuffer()
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.blocks, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        return this.transformBuffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {
        if(!this.transformBuffer || !gl || !program) return null

        const meshOffsetLocation = gl.getAttribLocation(program, 'meshOffset')

        const rowSize = 3
        const stride = rowSize * Uint8Array.BYTES_PER_ELEMENT

        gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, this.blocks, gl.STATIC_DRAW)

        gl.vertexAttribPointer(meshOffsetLocation, 3, gl.UNSIGNED_BYTE, false, stride, 0)

        gl.enableVertexAttribArray(meshOffsetLocation)
        gl.vertexAttribDivisor(meshOffsetLocation, 1)
    }
}