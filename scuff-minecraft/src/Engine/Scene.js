import Chunk from "./Chunks/Chunk"
import Block from "./Geometry/Block"
import Vector3 from "./Math/Vector3"

/**
 * @typedef {Object} SceneType
 * @property {Array<Chunk>} chunks
 * @property {WebGLBuffer?} _blockBuffer
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
     * @param {number} width 
     * @param {number} length 
     */
    generateChunks(width, length) {
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
                chunk.create()
                chunk.cullFaceTexture(this)

                this.chunks.push(chunk)

                index++
            }
        }
    }
}