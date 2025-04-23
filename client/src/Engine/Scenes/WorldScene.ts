import ChunkGeneratorWorker from '../Chunks/ChunkGenerator.js?worker'

import Chunk from "../Chunks/Chunk"
import Block from "../Geometry/Block"
import Vector3 from "../../DistortionGL/Math/Vector3"
import ChunkGenerator from '../Chunks/ChunkGenerator.js'
import Skybox from './Skybox.js'
import Scene from '../../DistortionGL/Scenes/Scene.js'
import type Camera from '../../DistortionGL/Camera/Camera.js'
import type WebGL2Renderer from '../../DistortionGL/Renderers/WebGL2.js'
import Shader from '../../DistortionGL/Shaders/Shader.js'
import BasicShaders from '../Shaders/Basic/BasicShaders.js'
import type { Uniforms as RequiredUniform, Attributes as RequiredAttributes } from '../Shaders/RequiredShaderTypes.js'
import type PerspectiveCamera from '../../DistortionGL/Camera/PerspectiveCamera.js'

const shaderList = {
    default: BasicShaders
}

type SimplexNoiseParams = {
    seed?: string,
    area: number,
    amplitude: number,
    frequency: number,
}

export default class WorldScene extends Scene {
    camera: PerspectiveCamera
    chunkWidth: number
    chunkLength: number
    chunkVolume: number
    chunks: Array<Chunk>
    shaders: typeof shaderList
    currentShader: Shader<RequiredUniform, RequiredAttributes>
    sky: Skybox
    sunPosition: Vector3
    wireframe: boolean
    ready: boolean
    _textureAtlasImg: HTMLImageElement
    _textureAtlasVertexBuffer: WebGLBuffer | null
    _textureAtlasImgBuffer: WebGLTexture | null
    _blockBuffer: WebGLBuffer | null

    constructor(camera: PerspectiveCamera) {
        super(camera)

        this.camera = camera
        
        this.chunkWidth = 0
        this.chunkLength = 0
        this.chunkVolume = 0
        // this.center = new Vector3(0, 0, 0)

        this.chunks = []

        this.shaders = shaderList
        this.currentShader = shaderList.default

        this.sky = new Skybox(this)
        this.sunPosition = new Vector3(0, 0, 0)

        this.wireframe = false
        this.ready = false

        this._textureAtlasImg = new Image()
        this._textureAtlasVertexBuffer = null
        this._textureAtlasImgBuffer = null
        this._blockBuffer = null
    }

    add(...chunks: Array<Chunk>) {
        for(let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            
            chunk._sceneIndex = this.chunks.length

            this.chunks.push(chunk)
        }
    }

    load(renderer: WebGL2Renderer) {
        const { gl } = renderer

        if(!this.ready || !this._textureAtlasVertexBuffer || !this._textureAtlasImgBuffer || !this._blockBuffer) {
            this.currentShader.loadSourceCode(gl)

            if(this.currentShader.error) throw this.currentShader.error

            gl.useProgram(this.currentShader.program)

            // create buffers
            this._textureAtlasImg = new Image()
            this._textureAtlasVertexBuffer = gl.createBuffer()
            this._textureAtlasImgBuffer = gl.createTexture()
            this._blockBuffer = gl.createBuffer()

            gl.bindBuffer(gl.ARRAY_BUFFER, this._textureAtlasVertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, Block.ATLAS_VERTICES, gl.STATIC_DRAW)
            
            this._textureAtlasImg.src = Block.ATLAS_PATH
            this._textureAtlasImg.onload = () => this.loadTextures.bind(this)(renderer)

            gl.bindTexture(gl.TEXTURE_2D, this._textureAtlasImgBuffer)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, Block.MISSING_TEXTURE_COLOR)
            
            // render block vertices
            gl.bindBuffer(gl.ARRAY_BUFFER, this._blockBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, Block.FACE_VERTEX, gl.STATIC_DRAW)
            
            this.ready = true
        }

        gl.useProgram(this.currentShader.program)

        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.CULL_FACE)
        gl.depthMask(true)
        gl.depthFunc(gl.LESS)
        gl.cullFace(gl.FRONT)
        // gl.cullFace(gl.BACK)
    }

    loadBlockVertices(renderer: WebGL2Renderer) {
        const { gl } = renderer

        gl.bindBuffer(gl.ARRAY_BUFFER, this._blockBuffer)

        // gl.vertexAttribIPointer() - https://stackoverflow.com/a/18926905/13159492
        gl.vertexAttribIPointer(this.currentShader.attributes.vertexData, 1, gl.BYTE, 0, 0)
        gl.enableVertexAttribArray(this.currentShader.attributes.vertexData)
    }

    loadTextures(renderer: WebGL2Renderer) {
        if(!this._textureAtlasImgBuffer) throw Error('Missing texture image buffer!')

        const { gl } = renderer

        // https://stackoverflow.com/a/34726863/13159492
        if(this._textureAtlasImg.complete && this._textureAtlasImg.naturalHeight === 0) {
            console.warn('Texture image is incomplete! Check texture atlas image!')

            // https://stackoverflow.com/a/34726863/13159492
            gl.bindTexture(gl.TEXTURE_2D, this._textureAtlasImgBuffer)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, Block.MISSING_TEXTURE_COLOR)

            return
        }

        const { attributes, uniforms } = this.currentShader

        // set uniforms
        gl.uniform1f(uniforms.atlasCropWidth, Block.ATLAS_WIDTH / Block.ATLAS_BLOCK_SIZE)
        gl.uniform1f(uniforms.atlasCropHeight, Block.ATLAS_HEIGHT / Block.ATLAS_BLOCK_SIZE)
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._textureAtlasVertexBuffer)

        gl.vertexAttribPointer(attributes.vertexTexCoords, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(attributes.vertexTexCoords)

        // load texture img buffer
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        gl.bindTexture(gl.TEXTURE_2D, this._textureAtlasImgBuffer)

        // texture filter
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._textureAtlasImg)
        
        gl.generateMipmap(gl.TEXTURE_2D)
    }

    unload() {

    }

    getNeighboringChunks(chunk: Chunk) {
        let px = null
        let nx = null
        let pz = null
        let nz = null
        let index = chunk._sceneIndex

        const pxChunkIndex = index + 1
        const nxChunkIndex = index - 1
        const pzChunkIndex = index + this.chunkWidth
        const nzChunkIndex = index - this.chunkWidth
        
        if((pxChunkIndex >= 0) && (pxChunkIndex < this.chunkVolume)) {
            const pxChunk = this.chunks[pxChunkIndex]
            
            if(pxChunk.position.z === chunk.position.z) {
                px = pxChunk
            }
        }

        if((nxChunkIndex >= 0) && (nxChunkIndex < this.chunkVolume)) {
            const nxChunk = this.chunks[nxChunkIndex]
            
            if(nxChunk.position.z === chunk.position.z) {
                nx = nxChunk
            }
        }

        if((pzChunkIndex >= 0) && (pzChunkIndex < this.chunkVolume)) {
            const pzChunk = this.chunks[pzChunkIndex]
            
            if(pzChunk.position.x === chunk.position.x) {
                pz = pzChunk
            }
        }

        if((nzChunkIndex >= 0) && (nzChunkIndex < this.chunkVolume)) {
            const nzChunk = this.chunks[nzChunkIndex]
            
            if(nzChunk.position.x  === chunk.position.x) {
                nz = nzChunk
            }
        }

        return { px, nx, pz, nz }
    }

    generateSimplexNoiseChunks({ seed, area, amplitude, frequency }: SimplexNoiseParams) {
        const root = Math.sqrt(area)

        if(Math.floor(root) !== root || Math.floor(area) !== area) throw Error('Area must be a square number!')

        this.chunkWidth = root
        this.chunkLength = this.chunkWidth
        this.chunkVolume = area

        seed = typeof seed !== 'string' ? Math.floor(Math.random() * 4294967297 - 2147483648).toString() : seed

        let index = 0
        for(let z = 0; z < this.chunkLength; z++) {
            for(let x = 0; x < this.chunkWidth; x++) {
                const offsetX = x * Chunk.WIDTH
                const offsetZ = z * Chunk.LENGTH
                
                const chunk = new Chunk(offsetX, offsetZ)

                ChunkGenerator.GenerateSimplexNoise(seed, chunk, offsetX, offsetZ, amplitude, frequency)

                chunk._sceneIndex = index
    
                this.chunks.push(chunk)
                index++
            }
        }
    }

    render(renderer: WebGL2Renderer) {
        if(!this.ready) {
            console.count('not ready')

            return
        }
        const { gl } = renderer
        const { program, uniforms } = this.currentShader
        const glDrawMode = this.wireframe ? gl.LINE_STRIP : gl.TRIANGLES

        gl.useProgram(this.currentShader.program)

        this.loadBlockVertices(renderer)
        
        this.camera.render(gl, program, uniforms.cameraPosition, uniforms.cameraProjection, uniforms.cameraRotation)

        for(let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]

            if(chunk.ready) {
                chunk.render(gl, this.currentShader, glDrawMode)
            } else {
                chunk.update(gl, this)
                chunk.ready = true
            }
        }
    }
}