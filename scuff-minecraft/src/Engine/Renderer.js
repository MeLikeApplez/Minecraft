import blockVertexCode from './gl/vertex/blockVertex.glsl?raw'
import blockFragmentCode from './gl/fragment/blockFragment.glsl?raw'

import Camera from "./Camera/Camera"
import Scene from "./Scene"
import Shader from "./Shader"
import Block from './Geometry/Block'

/**
 * @typedef {Object} RendererType
 * @property {WebGLBuffer | null} _blockBuffer
 */

/**
 * @type {RendererType}
 */
export default class Renderer {
    /**
     * @param {{
     *      canvasElement: HTMLCanvasElement
     *      antialias?: boolean
     * }} options 
    */
   constructor(options={}) {
        this.canvasElement = options.canvasElement
        this.gl = options.canvasElement.getContext('webgl2', {
            antialias: !!options.antialias
        })
        this.wireframe = false

        this.shaders = {
            current: null,
            default: new Shader('default', this.gl, blockVertexCode, blockFragmentCode)
        }

        this._textureAtlasImg = new Image()
        this._textureAtlasVertexBuffer = this.gl.createBuffer()
        this._textureAtlasImgBuffer = this.gl.createTexture()
        this._blockBuffer = this.gl.createBuffer()

        this.ready = false
    }

    clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    /**
     * @param {Shader?} shader 
     */
    load(shader=null) {
        if(shader === null) {
            this.useShader(this.shaders.default)
        }

        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._textureAtlasVertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Block.ATLAS_VERTICES, this.gl.STATIC_DRAW)

        this._textureAtlasImg.src = Block.ATLAS_PATH
        this._textureAtlasImg.onload = () => this.loadTextureAtlas()
        // this.loadTextureAtlas()

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._blockBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Block.VERTICES, this.gl.STATIC_DRAW)

        this.ready = true
    }

    /**
     * @param {Shader} shader 
     */
    useShader(shader) {
        if(shader.error) throw shader.error
        if(!shader.ready) throw Error('Shader is not ready or loaded!')

        this.shaders.current = shader

        this.gl.useProgram(shader.program)
        this.loadTextureAtlas()
    }

    renderBlockVertices() {
        const vertexDataAttribLocation = this.gl.getAttribLocation(this.shaders.current.program, 'vertexData')

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._blockBuffer)

        // this.gl.vertexAttribIPointer() - https://stackoverflow.com/a/18926905/13159492
        this.gl.vertexAttribIPointer(vertexDataAttribLocation, 1, this.gl.BYTE, 0, 0)
        this.gl.enableVertexAttribArray(vertexDataAttribLocation)
    }

    loadTextureAtlas() {
        const vertexTexCoordsLocation = this.gl.getAttribLocation(this.shaders.current.program, 'vertexTexCoords')
        const atlasCropWidthLocation = this.gl.getUniformLocation(this.shaders.current.program, 'atlasCropWidth')
        const atlasCropHeightLocation = this.gl.getUniformLocation(this.shaders.current.program, 'atlasCropHeight')

        this.gl.uniform1f(atlasCropWidthLocation, Block.ATLAS_WIDTH / Block.ATLAS_BLOCK_SIZE)
        this.gl.uniform1f(atlasCropHeightLocation, Block.ATLAS_HEIGHT / Block.ATLAS_BLOCK_SIZE)
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._textureAtlasVertexBuffer)

        this.gl.vertexAttribPointer(vertexTexCoordsLocation, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(vertexTexCoordsLocation)
        
        // https://stackoverflow.com/a/34726863/13159492
        if(this._textureAtlasImg.complete && this._textureAtlasImg.naturalHeight === 0) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._textureAtlasImgBuffer)
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, 1, 1, 0, this.gl.RGB, this.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 200]))

            return
        }

        // load texture img buffer
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false)

        this.gl.bindTexture(this.gl.TEXTURE_2D, this._textureAtlasImgBuffer)

        // texture filter
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
        
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this._textureAtlasImg)
        
        this.gl.generateMipmap(this.gl.TEXTURE_2D)
    }

    /**
     * @param {Scene} scene 
     * @param {Camera} camera 
     */
    update(scene, camera) {
        if(!this.ready) throw Error('Renderer has not called load()! Renderer is not ready!')
        if(this.shaders.current === null) throw Error('No shader is in use!')
        const glDrawMode = this.wireframe ? this.gl.LINE_STRIP : this.gl.TRIANGLES

        this.clear()

        // this.gl.useProgram(this.shaders.current.program)
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        this.gl.depthMask(true)
        this.gl.depthFunc(this.gl.LESS)
        this.gl.cullFace(this.gl.FRONT)
        // this.gl.cullFace(this.gl.BACK)

        this.renderBlockVertices()
        camera.update(this.gl, this.shaders.current.program)

        for(let i = 0; i < scene.chunks.length; i++) {
            const chunk = scene.chunks[i]
            
            if(chunk.ready) {
                chunk.render(this.gl, this.shaders.current.program, glDrawMode)
            } else {
                chunk.update(this.gl, this.shaders.current.program)
                chunk.ready = true
            }
        }
    }
}
