import Camera from "./Camera/Camera"
import Chunk from "./Chunks/Chunk"
import Block from "./Geometry/Block"
import Mesh from "./Mesh/Mesh"
import Renderer from "./Renderer"
import Texture2D from "./Texture/Texture2D"

/**
 * @typedef {Object} SceneType
 * @property {Camera} camera
 * @property {Array<Chunk>} chunks
 * @property {HTMLImageElement} textureAtlasImg
 * @property {WebGLBuffer} _blockBuffer
 * @property {WebGLBuffer} _textureVerticesBuffer
 * @property {WebGLTexture} _textureImgBuffer
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
        this.textureAtlasImg = null

        this.chunks = []

        this._blockBuffer = null
        this._textureVerticesBuffer = null
        this._textureImgBuffer = null
        
        this.ready = false
    }

    dispose() {
        if(!this.gl) return

        // this.gl.deleteBuffer(this._blockBuffer)
        // this.gl.deleteTexture(this._textureImgBuffer)

        for(let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]

            chunk.dispose(this.gl)
        }

        this.chunks = []

        this.ready = false
    }

    async load() {
        this.textureAtlasImg = await Texture2D.loadImage(Texture2D.ATLAS_PATH)

        if(this._blockBuffer === null) {
            this._blockBuffer = this.gl.createBuffer()

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._blockBuffer)
            this.gl.bufferData(this.gl.ARRAY_BUFFER, Block.VERTICES, this.gl.STATIC_DRAW)
        }

        if(this._textureVerticesBuffer === null) {
            this._textureVerticesBuffer = this.gl.createBuffer()

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._textureVerticesBuffer)
            this.gl.bufferData(this.gl.ARRAY_BUFFER, Texture2D.extendArrayBuffer(Texture2D.UV_SQUARE, 6), this.gl.STATIC_DRAW)
        }

        if(this._textureImgBuffer === null) {
            this._textureImgBuffer = this.gl.createTexture()
        }

        this.ready = true

        if(this.textureAtlasImg !== null) {
            for(let i = 0; i < this.chunks.length; i++) {
                const chunk = this.chunks[i]

                chunk.update(this.gl, this.Renderer.programs.main)
                chunk.ready = true
            }
        }
    }

    /**
     * @param {Chunk} chunk 
     */
    addChunk(chunk) {
        if(chunk.ready) return

        this.chunks.push(chunk)

        if(this.textureAtlasImg !== null) {
            chunk.update(this.gl, this.Renderer.programs.main)
            chunk.ready = true
        }
    }

    /**
     * @param {WebGLProgram} program 
     */
    renderInstancedBlock(program) {
        if(!(this.ready && this.gl && program)) return
        const vertexDataAttribLocation = this.gl.getAttribLocation(program, 'vertexData')

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._blockBuffer)
        
        // https://stackoverflow.com/a/18926905/13159492
        this.gl.vertexAttribIPointer(vertexDataAttribLocation, 1, this.gl.BYTE, false, 0, 0)
        this.gl.enableVertexAttribArray(vertexDataAttribLocation)
    }
    
}