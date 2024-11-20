import Camera from "./Camera/Camera"
import Chunk from "./Chunks/Chunk"
import Renderer from "./Renderer"

/**
 * @typedef {Object} SceneType
 * @property {Camera} camera
 * @property {Array<Chunk>} chunks
 */

/**
 * @type {SceneType}
 */
export default class Scene {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {Renderer} Renderer 
     */
    constructor(gl, Renderer) {
        this.gl = gl
        this.Renderer = Renderer

        this.camera = null

        this.worldChunkSize = 1

        this.chunks = []
    }

    /**
     * @param {Chunk} chunk 
     */
    addChunk(chunk) {
        if(chunk.initialized) return

        this.chunks.push(chunk)

        chunk.update(this.gl, this.Renderer.programs.main)
        chunk.initialized = true
    }
}