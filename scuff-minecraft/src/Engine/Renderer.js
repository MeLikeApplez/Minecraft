import vertexSourceCode from './gl/vertex/vertex.glsl?raw'
import fragmentSourceCode from './gl/fragment/fragment.glsl?raw'

import Scene from "./Scene"
import { BLOCK_VERTICES } from './Geometry/Blocks'
import Mesh from './Mesh/Mesh'

export default class Renderer {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLCanvasElement} canvasElement 
     * @property {Object<string, WebGLProgram>} programs
     */
    constructor(gl, canvasElement) {
        this.gl = gl
        this.canvasElement = canvasElement
        this.wireframe = false

        this.programs = {
            main: this.createGLProgram(vertexSourceCode, fragmentSourceCode)
        }

        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)

        this.updateCanvasSize()
    }

    createGLProgram(vertexSource, shaderSource) {
        // setup and compile glsl vertex shader
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(vertexShader, vertexSource)
        this.gl.compileShader(vertexShader)

        if(!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(vertexShader)

            throw Error(`Vertex Shader ${compileError}`)
        }

        // setup and compile fragment shader
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(fragmentShader, shaderSource)
        this.gl.compileShader(fragmentShader)

        if(!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(fragmentShader)

            throw Error(`Fragment Shader ${compileError}`)
        }

        // create and attach program
        const program = this.gl.createProgram()
        this.gl.attachShader(program, vertexShader)
        this.gl.attachShader(program, fragmentShader)
        this.gl.linkProgram(program)

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const compileError = this.gl.getProgramInfoLog(program)

            throw Error(`Link Shader ${compileError}`)
        }

        return program
    }

    updateCanvasSize() {
        this.canvasElement.width = this.canvasElement.clientWidth
        this.canvasElement.height = this.canvasElement.clientHeight
    }

    clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    /**
     * @param {Scene} scene 
     */
    update(scene) {
        const glDrawMode = this.wireframe ? this.gl.LINE_STRIP : this.gl.TRIANGLES

        this.clear()

        this.gl.useProgram(this.programs.main)
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        this.gl.depthMask(true)
        this.gl.depthFunc(this.gl.LESS)
        this.gl.cullFace(this.gl.FRONT)
        // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

        if(scene.camera !== null) {
            scene.camera.update(this.gl, this.programs.main)

            Mesh.SetGLInstancedBlock(this.gl, this.programs.main)

            for(let i = 0; i < scene.chunks.length; i++) {
                const chunk = scene.chunks[i]

                chunk.render(this.gl, this.programs.main)

                this.gl.drawArraysInstanced(glDrawMode, 0, BLOCK_VERTICES.length, chunk.blockPositions.length / 3)
            }            
        }
    }
}
