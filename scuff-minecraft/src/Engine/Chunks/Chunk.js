import Blocks from "../Geometry/Blocks"
import Block from "../Geometry/Block"
import Vector3 from "../Math/Vector3"
import Scene from "../Scene"

/**
 * @typedef {Object} ChunkType
 * @property {number} _transformIndexOffset
 * @property {Uint16Array} _transformData
 * @property {WebGLBuffer} _transformBuffer
 */

/**
 * @type {ChunkType}
 */
export default class Chunk {
    static WIDTH = 16
    static HEIGHT = 1
    static LENGTH = 16
    static VOLUME = this.WIDTH * this.HEIGHT * this.LENGTH

    static _transformRowSize = 15
    static _transformStride = this._transformRowSize * Uint8Array.BYTES_PER_ELEMENT
    
    /**
     * @param {number} x 
     * @param {number} z
     */
    constructor(x, z) {
        this.position = new Vector3(x, 0, z)

        this.blockIds = new Uint8Array(Array(Chunk.VOLUME).fill(1))

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
        // vec3[1] + vec2[6]
        this._transformData = new Uint8Array(Chunk.VOLUME * Chunk._transformRowSize)
        this._transformBuffer = null
        this._sceneIndex = -1

        this.ready = false
    }

    dispose() {
        
    }

    /**
     * @param {number} index
     * @returns {Block?} 
     */
    getBlockByIndex(index) {
        if(index < 0 || index >= this.blockIds.length) return null

        return Blocks.LIST[this.blockIds[index]]
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Block?}
     */
    getBlockByPosition(x, y, z) {
        const index = this.getIndexByPosition(x, y, z)

        if(index < 0 || index >= this.blockIds.length) return null

        return Blocks.LIST[this.blockIds[index]]
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {number | -1}
     */
    getIndexByPosition(x, y, z) {
        const index = z * (Chunk.WIDTH * Chunk.HEIGHT) + y * Chunk.WIDTH + x

        return (index < 0 || index >= this.blockIds.length) ? -1 : index
    }

    /**
     * @param {number} index 
     * @returns {Vector3?}
     */
    getPositionByIndex(index) {
        if(index < 0 || index >= this.blockIds.length) return null

        return new Vector3(
            this._transformData[index * Chunk._transformRowSize],
            this._transformData[index * Chunk._transformRowSize + 1],
            this._transformData[index * Chunk._transformRowSize + 2],
        )
    }

    create() {
        let offset = 0
        for(let z = 0; z < Chunk.LENGTH; z++) {
            for(let y = 0; y < Chunk.HEIGHT; y++) {
                for(let x = 0; x < Chunk.WIDTH; x++) {
                    this._transformData[offset] = x
                    this._transformData[offset + 1] = y
                    this._transformData[offset + 2] = z

                    offset += Chunk._transformRowSize
                }
            }
        }
    }

    /**
     * @param {Scene} scene 
     */
    cullFaceTexture(scene) {
        const pxChunkIndex = this._sceneIndex + 1
        const nxChunkIndex = this._sceneIndex - 1
        const pzChunkIndex = this._sceneIndex + scene.chunkLength
        const nzChunkIndex = this._sceneIndex - scene.chunkLength

        const chunkX = this._sceneIndex % scene.chunkWidth
        const chunkZ = Math.floor(this._sceneIndex / scene.chunkLength)
        
        const pxChunkZ = Math.floor(pxChunkIndex / scene.chunkLength)
        const nxChunkZ = Math.floor(nxChunkIndex / scene.chunkLength)
        const pzChunkX = pzChunkIndex % scene.chunkWidth
        const nzChunkX = nzChunkIndex % scene.chunkWidth

        const pxIsInBounds = pxChunkIndex >= 0 && pxChunkIndex < scene.chunkVolume
        const nxIsInBounds = nxChunkIndex >= 0 && nxChunkIndex < scene.chunkVolume
        const pzIsInBounds = pzChunkIndex >= 0 && pzChunkIndex < scene.chunkVolume
        const nzIsInBounds = nzChunkIndex >= 0 && nzChunkIndex < scene.chunkVolume

        let index = 0
        for(let y = 0; y < Chunk.HEIGHT; y++) {
            for(let x = 0; x < Chunk.WIDTH; x++) {
                if(pxIsInBounds && chunkZ === pxChunkZ) {
                    index = this.getIndexByPosition(Chunk.LENGTH - 1, y, x)
                    
                    this._transformData[index * Chunk._transformRowSize + 3] |= Block.TEXTURE_HIDE_BUFFER_BIT
                }

                if(nxIsInBounds && chunkZ === nxChunkZ) {
                    index = this.getIndexByPosition(0, y, x)
                    
                    this._transformData[index * Chunk._transformRowSize + 5] |= Block.TEXTURE_HIDE_BUFFER_BIT
                }

                if(pzIsInBounds && chunkX === pzChunkX) {
                    index = this.getIndexByPosition(x, y, Chunk.WIDTH - 1)
                    
                    this._transformData[index * Chunk._transformRowSize + 11] |= Block.TEXTURE_HIDE_BUFFER_BIT
                }

                if(nzIsInBounds && chunkX === nzChunkX) {
                    index = this.getIndexByPosition(x, y, 0)
                    
                    this._transformData[index * Chunk._transformRowSize + 13] |= Block.TEXTURE_HIDE_BUFFER_BIT
                }
            }
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(this._transformBuffer === null) {
            this._transformBuffer = gl.createBuffer()
        }

        let idIndex = 0
        for(let i = 0; i < this._transformData.length; i += Chunk._transformRowSize) {
            const block = this.getBlockByIndex(idIndex)

            if(block === null) continue

            const texturePosition = block.cullFaceTexture(this, idIndex)

            this._transformData[i + 3] = (this._transformData[i + 3] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[0]
            this._transformData[i + 4] = (this._transformData[i + 4] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[1]  

            this._transformData[i + 5] = (this._transformData[i + 5] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[2]  
            this._transformData[i + 6] = (this._transformData[i + 6] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[3]

            this._transformData[i + 7] = (this._transformData[i + 7] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[4] 
            this._transformData[i + 8] = (this._transformData[i + 8] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[5] 

            this._transformData[i + 9] = (this._transformData[i + 9] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[6] 
            this._transformData[i + 10] = (this._transformData[i + 10] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[7] 

            this._transformData[i + 11] = (this._transformData[i + 11] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[8] 
            this._transformData[i + 12] = (this._transformData[i + 12] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[9] 

            this._transformData[i + 13] = (this._transformData[i + 13] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[10] 
            this._transformData[i + 14] = (this._transformData[i + 14] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[11] 

            idIndex++
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this._transformData, gl.STATIC_DRAW)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {number} drawMode 
     */
    render(gl, program, drawMode) {
        if(!this.ready) throw Error('Chunk is not ready loading!')

        const chunkOffsetLocation = gl.getUniformLocation(program, 'chunkOffset')

        // uniform[1234][fi][v]() - https://stackoverflow.com/a/31052622/13159492
        gl.uniform2f(chunkOffsetLocation, this.position.x, this.position.z)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)

        const blockOffsetLocation = gl.getAttribLocation(program, 'blockOffset')

        const faceTexturePXAttribLocation = gl.getAttribLocation(program, 'faceTexturePX')
        const faceTextureNXAttribLocation = gl.getAttribLocation(program, 'faceTextureNX')
        const faceTexturePYAttribLocation = gl.getAttribLocation(program, 'faceTexturePY')
        const faceTextureNYAttribLocation = gl.getAttribLocation(program, 'faceTextureNY')
        const faceTexturePZAttribLocation = gl.getAttribLocation(program, 'faceTexturePZ')
        const faceTextureNZAttribLocation = gl.getAttribLocation(program, 'faceTextureNZ')

        gl.vertexAttribPointer(blockOffsetLocation, 3, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 0)

        gl.vertexAttribPointer(faceTexturePXAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 3)
        gl.vertexAttribPointer(faceTextureNXAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 5)
        gl.vertexAttribPointer(faceTexturePYAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 7)
        gl.vertexAttribPointer(faceTextureNYAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 9)
        gl.vertexAttribPointer(faceTexturePZAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 11)
        gl.vertexAttribPointer(faceTextureNZAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 13)

        gl.vertexAttribDivisor(blockOffsetLocation, 1)

        gl.vertexAttribDivisor(faceTexturePXAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNXAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePZAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNZAttribLocation, 1)
        
        gl.enableVertexAttribArray(blockOffsetLocation)

        gl.enableVertexAttribArray(faceTexturePXAttribLocation)
        gl.enableVertexAttribArray(faceTextureNXAttribLocation)
        gl.enableVertexAttribArray(faceTexturePYAttribLocation)
        gl.enableVertexAttribArray(faceTextureNYAttribLocation)
        gl.enableVertexAttribArray(faceTexturePZAttribLocation)
        gl.enableVertexAttribArray(faceTextureNZAttribLocation)

        gl.drawArraysInstanced(drawMode, 0, Block.VERTICES.length, Chunk.VOLUME)
    }
}