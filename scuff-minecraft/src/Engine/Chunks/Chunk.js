import Mesh from "../Mesh/Mesh"
import Texture2D from "../Texture/Texture2D"

/**
 * @typedef {Object} ChunkType
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} length
 * @property {Uint8Array} blocks
 * @property {WebGLBuffer | null} transformBuffer
 * @property {WebGLBuffer | null} textureBuffer
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
        this.textureBuffer = null

        const volume = width * height * length

        // bottom to top
        this.blockTypes = new Uint8Array(volume)
        this.blockPositions = new Uint8Array(volume * 3)
        this.texturePositions = new Float32Array(Texture2D.POINTS_PER_TRIANGLE_FACE * 2 * volume)

        this.initialized = false

        this.setChunk(width, height, length)
    }

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} length 
     */
    setChunk(width, height, length) {
        const volume = width * height * length
        let index = 0

        // create new array if size is different
        // just reuse the array if they're the same size
        // this probably should never happen
        if(width !== this.width || height !== this.height || length !== this.length) {
            this.width = width
            this.height = height
            this.length = length
        
            this.blockTypes = new Uint8Array(volume)
            this.blockPositions = new Uint8Array(volume * 3)
            this.texturePositions = new Float32Array(Texture2D.POINTS_PER_TRIANGLE_FACE * 2 * volume)
        }

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x ++) {
                for(let z = 0; z < length; z++) {
                    this.blockPositions[index] = x
                    this.blockPositions[index + 1] = y
                    this.blockPositions[index + 2] = z

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

        if(this.textureBuffer === null) {
            this.textureBuffer = gl.createBuffer()
        }

        if(Mesh.TEXTURE_MAP_IMG !== null) {
            const volume = this.width * this.height * this.length
            const uvSize = Texture2D.POINTS_PER_TRIANGLE_FACE * 2 * volume
    
            const w = Mesh.TEXTURE_MAP_IMG.width / 16
            const h = Mesh.TEXTURE_MAP_IMG.height / 16

            console.log(Mesh.TEXTURE_MAP_IMG.width)

            // The uvSize has been hard coded
            // Change this latter to dynamically change to proper size for each block type
            Texture2D.createUVCoordinates(Texture2D.UV_TRIANGLES, uvSize, this.texturePositions)
            // sides of a block
            for(let i = 0; i < 6; i++) {
                for(let j = 0; j < Texture2D.UV_TRIANGLES.length; j += 2) {
                    const index = (i * Texture2D.UV_TRIANGLES.length) + j
    
                    const u = this.texturePositions[index]
                    const v = this.texturePositions[index + 1]
    
                    // this.texturePositions[index] = (u / w) + ((w - 1) / w)
                    // this.texturePositions[index + 1] = (1 - v / h) + (15 / h)

                    this.texturePositions[index] = (u / w) + (22/w)
                    this.texturePositions[index + 1] =  (1 - v / h) + (-11/h)
    
                }
            }
        }

        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.blockPositions, gl.STATIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.texturePositions, gl.STATIC_DRAW)
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        return this.transformBuffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {
        if(!(this.initialized && this.transformBuffer && gl && program)) return null

        const meshOffsetLocation = gl.getAttribLocation(program, 'meshOffset')

        const rowSize = 3
        const stride = rowSize * Uint8Array.BYTES_PER_ELEMENT

        gl.bindBuffer(gl.ARRAY_BUFFER, this.transformBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, this.blockPositions, gl.STATIC_DRAW)

        gl.vertexAttribPointer(meshOffsetLocation, 3, gl.UNSIGNED_BYTE, false, stride, 0)

        gl.enableVertexAttribArray(meshOffsetLocation)
        gl.vertexAttribDivisor(meshOffsetLocation, 1)
    
        Texture2D.render(gl, program, Mesh.TEXTURE_MAP_IMG, this.textureBuffer, Mesh.TEXTURE_MAP_BUFFER_IMG)
    }
}