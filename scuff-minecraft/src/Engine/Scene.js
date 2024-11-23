import Camera from "./Camera/Camera"
import Chunk from "./Chunks/Chunk"
import Mesh from "./Mesh/Mesh"
import Renderer from "./Renderer"
import Texture2D from "./Texture/Texture2D"

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
        
        this.loadTextureMap()
    }

    async loadTextureMap() {
        Mesh.TEXTURE_MAP_IMG = await Texture2D.loadImage(Texture2D.TEXTURE_MAP_PATH)

        if(Mesh.TEXTURE_MAP_IMG !== null) {
            for(let i = 0; i < this.chunks.length; i++) {
                const chunk = this.chunks[i]

                chunk.update(this.gl, this.Renderer.programs.main)
                chunk.initialized = true
            }
        }
    }

    /**
     * @param {Chunk} chunk 
     */
    addChunk(chunk) {
        if(chunk.initialized) return

        this.chunks.push(chunk)

        if(Mesh.TEXTURE_MAP_IMG !== null) {
            chunk.update(this.gl, this.Renderer.programs.main)
            chunk.initialized = true
        }
    }
}