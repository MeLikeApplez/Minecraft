import Blocks from "../Geometry/Blocks"
import Vector3 from "../Math/Vector3"
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
    static WIDTH = 16
    static HEIGHT = 16  
    static LENGTH = 16
    
    /**
     * @param {number} x 
     * @param {number} z
     * @param {number} [width=Chunk.WIDTH] 
     * @param {number} [height=Chunk.HEIGHT] 
     * @param {number} [length=Chunk.LENGTH] 
     */
    constructor(x, z, width=Chunk.WIDTH, height=Chunk.HEIGHT, length=Chunk.LENGTH) {
        this.x = x
        this.z = z

        this.width = width
        this.height = height
        this.length = length

        const volume = width * height * length
        this.blockIds = new Uint8Array(Array(volume).fill(2))
        this.blockPositions = new Uint8Array(volume * 3)
        this.textureCoords = new Uint8Array(volume * 2)

        // vec3[1] position + vec2[6] texture
        this._chunkBufferRowSize = 15
        this._chunkBufferByteSize = Int8Array.BYTES_PER_ELEMENT
        this._chunkBuffer = null

        this.ready = false

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

        if(width !== this.width || height !== this.height || length !== this.length) {
            this.width = width
            this.height = height
            this.length = length
        
            this.blockPositions = new Uint8Array(volume * 3)
            this.textureCoords = new Uint8Array(volume * 2)
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
     * @param {number} index 
     */
    getPositionByIndex(index) {
        return new Vector3(
            this.blockPositions[index * 3],
            this.blockPositions[index * 3 + 1],
            this.blockPositions[index * 3 + 2],
        )
    }

    /**
     * @param {number} index 
     */
    getWorldPositionByIndex(index) {
        return new Vector3(
            this.blockPositions[index * 3] + this.x,
            this.blockPositions[index * 3 + 1],
            this.blockPositions[index * 3 + 2] + this.z,
        )
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    getIndexByPosition(x, y, z) {
        return z + (this.length * (x + (this.width * y)))
    }

    /**
     * @param {number} sceneWidth 
     * @param {number} sceneLength 
     * @param {Array<Chunk>} chunks 
     */
    cullFaceTexture(sceneWidth, sceneLength, chunks) {
        
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        if(!gl) return

        gl.deleteBuffer(this._chunkBuffer)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(!gl || !program) return
        
        if(this._chunkBuffer === null) {
            this._chunkBuffer = gl.createBuffer()
        }

        const transformData = new Int8Array(this._chunkBufferRowSize * this.blockIds.length)

        let positionIndex = 0
        let idIndex = 0

        for(let i = 0; i < transformData.length; i += this._chunkBufferRowSize) {
            const blockData = Blocks.LIST[this.blockIds[idIndex]]

            transformData[i] = this.blockPositions[positionIndex] + this.x
            transformData[i + 1] = this.blockPositions[positionIndex + 1]
            transformData[i + 2] = this.blockPositions[positionIndex + 2] + this.z

            const texturePosition = blockData.cullFaceTexture(this, idIndex)

            transformData[i + 3] = texturePosition[0]
            transformData[i + 4] = texturePosition[1]  

            transformData[i + 5] = texturePosition[2]  
            transformData[i + 6] = texturePosition[3]

            transformData[i + 7] = texturePosition[4] 
            transformData[i + 8] = texturePosition[5] 

            transformData[i + 9] = texturePosition[6] 
            transformData[i + 10] = texturePosition[7] 

            transformData[i + 11] = texturePosition[8] 
            transformData[i + 12] = texturePosition[9] 

            transformData[i + 13] = texturePosition[10] 
            transformData[i + 14] = texturePosition[11] 

            positionIndex +=  3
            idIndex++
        }

        console.log(transformData)
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._chunkBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {HTMLImageElement} img 
     */
    render(gl, program, img) {
        if(!(this.ready && gl && program)) return

        gl.bindBuffer(gl.ARRAY_BUFFER, this._chunkBuffer)

        const blockOffsetAttribLocation = gl.getAttribLocation(program, 'blockOffset')

        const faceTextureNZAttribLocation = gl.getAttribLocation(program, 'faceTextureNZ')
        const faceTexturePZAttribLocation = gl.getAttribLocation(program, 'faceTexturePZ')
        const faceTexturePYAttribLocation = gl.getAttribLocation(program, 'faceTexturePY')
        const faceTextureNYAttribLocation = gl.getAttribLocation(program, 'faceTextureNY')
        const faceTextureNXAttribLocation = gl.getAttribLocation(program, 'faceTextureNX')
        const faceTexturePXAttribLocation = gl.getAttribLocation(program, 'faceTexturePX')

        const stride = this._chunkBufferRowSize * this._chunkBufferByteSize

        gl.vertexAttribPointer(blockOffsetAttribLocation, 3, gl.BYTE, false, stride, 0)

        gl.vertexAttribPointer(faceTextureNZAttribLocation, 2, gl.BYTE, false, stride, 3)
        gl.vertexAttribPointer(faceTexturePZAttribLocation, 2, gl.BYTE, false, stride, 5)
        gl.vertexAttribPointer(faceTexturePYAttribLocation, 2, gl.BYTE, false, stride, 7)
        gl.vertexAttribPointer(faceTextureNYAttribLocation, 2, gl.BYTE, false, stride, 9)
        gl.vertexAttribPointer(faceTextureNXAttribLocation, 2, gl.BYTE, false, stride, 11)
        gl.vertexAttribPointer(faceTexturePXAttribLocation, 2, gl.BYTE, false, stride, 13)

        gl.enableVertexAttribArray(blockOffsetAttribLocation)

        gl.enableVertexAttribArray(faceTextureNZAttribLocation)
        gl.enableVertexAttribArray(faceTexturePZAttribLocation)
        gl.enableVertexAttribArray(faceTexturePYAttribLocation)
        gl.enableVertexAttribArray(faceTextureNYAttribLocation)
        gl.enableVertexAttribArray(faceTextureNXAttribLocation)
        gl.enableVertexAttribArray(faceTexturePXAttribLocation)
        
        gl.vertexAttribDivisor(blockOffsetAttribLocation, 1)

        gl.vertexAttribDivisor(faceTextureNZAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePZAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNXAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePXAttribLocation, 1)


    }
}