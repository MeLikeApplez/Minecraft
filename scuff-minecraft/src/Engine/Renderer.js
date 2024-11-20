import vertexSourceCode from './gl/vertex/vertex.glsl?raw'
import fragmentSourceCode from './gl/fragment/fragment.glsl?raw'

import Scene from "./Scene"
import { BLOCK_VERTICES } from './Geometry/Blocks'
import Mesh from './Mesh/Mesh'

const positions = BLOCK_VERTICES
const colorData = createColorVertices(3, positions.length, [
    [255, 0, 0],
    [255, 0, 0],

    [0, 255, 0],
    [0, 255, 0],

    [0, 0, 255],
    [0, 0, 255],

    [255, 0, 255],
    [255, 0, 255],

    [0, 255, 255],
    [0, 255, 255],

    [255, 255, 255],
    [255, 255, 255],
])

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

        if(scene.camera !== null) {
            scene.camera.update(this.gl, this.programs.main)

            Mesh.SetGLInstancedBlock(this.gl, this.programs.main)

            for(let i = 0; i < scene.chunks.length; i++) {
                const chunk = scene.chunks[i]

                chunk.render(this.gl, this.programs.main)

                this.gl.drawArraysInstanced(glDrawMode, 0, BLOCK_VERTICES.length, chunk.blocks.length)
            }
            

            // Mesh.SetGLPosition(this.gl, this.programs.main, 0, 0, 0)
            // Mesh.SetGLColor(this.gl, this.programs.main, colorData)
            
            // Mesh.SetGLInstancedBlock(this.gl, this.programs.main)
            // Mesh.SetGLInstancedData(this.gl, this.programs.main)

            // this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length)
        }
    }
}

/**
 * @param {number} pointSize 
 * @param {number} vectorSize 
 * @param {Array<[number, number, number]>} colors 
 */
function createColorVertices(pointSize, vectorSize, colors) {
    const vertices = new Uint8Array(Array(vectorSize))

    let faceCount = 0
    let colorIndex = 0
    for(let i = 0; i < vectorSize; i += 3) {
        if(faceCount >= colors.length * 3) {
            continue
        }

        vertices[i] = colors[colorIndex][0]
        vertices[i + 1] = colors[colorIndex][1]
        vertices[i + 2] = colors[colorIndex][2]
    
        faceCount++

        if(faceCount % 3 == 0) {
            colorIndex++
        }
    }

    return vertices
}