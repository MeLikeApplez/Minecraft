import ChunkGeneratorWorker from './Chunks/ChunkGenerator.js?worker'

import Chunk from "./Chunks/Chunk"
import Block from "./Geometry/Block"
import Vector3 from "./Math/Vector3"
import Vector2 from './Math/Vector2'
import ChunkGenerator from './Chunks/ChunkGenerator.js'
import Skybox from './Skybox.js'

/**
 * @typedef {Object} SceneType
 * @property {Array<Chunk>} chunks
 * @property {WebGLBuffer?} _blockBuffer
 * @property {Worker?} _chunkGeneratorWorker
*/

/**
 * @type {SceneType}
 */
export default class Scene {
    constructor() {
        this.chunkWidth = 0
        this.chunkLength = 0
        this.chunkVolume = 0
        // this.center = new Vector3(0, 0, 0)

        this.chunks = []

        this.sky = new Skybox(this)
        this.sunPosition = new Vector3(0, 0, 0)
    }

    /**
     * @param  {Array<Chunk>} chunks 
     */
    add(...chunks) {
        for(let i = 0; i < chunks.length; i++) {
            this.chunks.push(chunks[i])
        }
    }

    /**
     * @param {Vector3} worldSpacePosition
     * @returns {{
     *      px: Chunk | null,
     *      nx: Chunk | null,
     *     pz: Chunk | null,
     *     nz: Chunk | null,
     * }}
     */
    getNeighboringChunks(worldSpacePosition) {
        let px = null
        let nx = null
        let pz = null
        let nz = null
        let index = -1

        const chunkX = Math.round(worldSpacePosition.x / Chunk.WIDTH)
        const chunkZ = Math.round(worldSpacePosition.z / Chunk.LENGTH)

        if(chunkX < this.chunkWidth && chunkZ < this.chunkLength) {
            index = chunkZ * this.chunkLength + chunkX
        } else {
            return { px, nx, pz, nz }
        }

        const pxChunkIndex = index + 1
        const nxChunkIndex = index - 1
        const pzChunkIndex = index + this.chunkLength
        const nzChunkIndex = index - this.chunkLength
        
        const pxChunkZ = Math.floor(pxChunkIndex / this.chunkLength)
        const nxChunkZ = Math.floor(nxChunkIndex / this.chunkLength)
        const pzChunkX = pzChunkIndex % this.chunkWidth
        const nzChunkX = nzChunkIndex % this.chunkWidth

        const pxIsInBounds = (pxChunkIndex >= 0) && (pxChunkIndex < this.chunkVolume) && (chunkZ === pxChunkZ)
        const nxIsInBounds = (nxChunkIndex >= 0) && (nxChunkIndex < this.chunkVolume) && (chunkZ === nxChunkZ)
        const pzIsInBounds = (pzChunkIndex >= 0) && (pzChunkIndex < this.chunkVolume) && (chunkX === pzChunkX)
        const nzIsInBounds = (nzChunkIndex >= 0) && (nzChunkIndex < this.chunkVolume) && (chunkX === nzChunkX)

        if(pxIsInBounds) {
            px = this.chunks[pxChunkIndex]    
        }
        
        if(nxIsInBounds) {
            nx = this.chunks[nxChunkIndex]    
        }

        if(pzIsInBounds) {
            pz = this.chunks[pzChunkIndex]    
        }

        if(nzIsInBounds) {
            nz = this.chunks[nzChunkIndex]    
        }

        return { px, nx, pz, nz }
    }

    /**
     * @param {{
     *      seed: string?,
     *      width: number,
     *      length: number,
     *      amplitude: number,
     *      frequency: number,
     * }} param0 
     */
    generateSimplexNoiseChunks({ seed, width, length, amplitude, frequency }={}) {
        this.chunkWidth = width
        this.chunkLength = length
        this.chunkVolume = width * length

        seed = typeof seed !== 'string' ? Math.floor(Math.random() * 4294967297 - 2147483648).toString() : seed

        let index = 0
        for(let z = 0; z < length; z++) {
            for(let x = 0; x < width; x++) {
                const offsetX = x * Chunk.WIDTH
                const offsetZ = z * Chunk.LENGTH
                
                const chunk = new Chunk(offsetX, offsetZ)

                ChunkGenerator.GenerateSimplexNoise(seed, chunk, offsetX, offsetZ, amplitude, frequency)

                chunk._sceneIndex = index
                chunk.create()
    
                // chunk culling is broken
                this.chunks.push(chunk)
                index++
            }
        }

        for(let i = 0; i < this.chunkVolume; i++) {
            this.chunks[i].cullFaceTexture(this)
        }
    }

    /**
     * @param {number} width 
     * @param {number} length 
     */
    generateFilledChunks(width, length) {
        this.chunkWidth = width
        this.chunkLength = length
        this.chunkVolume = width * length

        for(let i = 0; i < this.chunks.length; i++) {
            this.chunks[i].dipose()
        }

        let index = 0
        for(let z = 0; z < length; z++) {
            for(let x = 0; x < width; x++) {
                const chunk = new Chunk(x * Chunk.WIDTH, z * Chunk.LENGTH)

                chunk._sceneIndex = index
                chunk.cullFaceTexture(this)

                this.chunks.push(chunk)

                index++
            }
        }
    }
}