import ChunkGeneratorWorker from './Chunks/ChunkGenerator.js?worker'

import Chunk from "./Chunks/Chunk"
import Block from "./Geometry/Block"
import Vector3 from "./Math/Vector3"
import Vector2 from './Math/Vector2'
import ChunkGenerator from './Chunks/ChunkGenerator.js'

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

        this.chunks = []

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

        let index = 0
        for(let z = 0; z < length; z++) {
            for(let x = 0; x < width; x++) {
                const offsetX = x * Chunk.WIDTH
                const offsetZ = z * Chunk.LENGTH
                
                const chunk = new Chunk(offsetX, offsetZ)
                const heightMap = ChunkGenerator.GenerateSimplexNoise(seed, offsetX, offsetZ, amplitude, frequency)
                
                let heightMapIndex = 0

                chunk._sceneIndex = index
                chunk.create()
    
                for(let j = 0; j < Chunk.VOLUME; j++) {
                    chunk._transformData[j * Chunk._transformRowSize + 1] = heightMap[heightMapIndex]
    
                    heightMapIndex++
                }
    
                // chunk culling is broken
                // chunk.cullFaceTexture(this)
                this.chunks.push(chunk)
                index++
            }
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