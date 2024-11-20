import Color from "../Utils/Color"
import { BLOCK_VERTICES } from '../Geometry/Blocks'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
export default class Mesh {
    static BLOCK_BUFFER = null

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    static SetGLInstancedBlock(gl, program) {
        // https://www.youtube.com/watch?v=Ude1zZbf20s
        const vertexAttribLocation = gl.getAttribLocation(program, 'vertexPosition')
        
        if(this.BLOCK_BUFFER === null) {
            this.BLOCK_BUFFER = gl.createBuffer()
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.BLOCK_BUFFER)
        gl.bufferData(gl.ARRAY_BUFFER, BLOCK_VERTICES, gl.STATIC_DRAW)

        gl.vertexAttribPointer(vertexAttribLocation, 3, gl.UNSIGNED_BYTE, false, 0, 0)
        gl.enableVertexAttribArray(vertexAttribLocation)
    }
    
    // https://www.youtube.com/watch?v=Ude1zZbf20s
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    static SetGLInstancedData(gl, program) {
        const meshOffsetLocation = gl.getAttribLocation(program, 'meshOffset')
        const transformBuffer = gl.createBuffer()
        const transformData = new Uint8Array([
            0, 0, 0,
            0, 0, 1,
            0, 0, 2,
            0, 0, 3,
        ])

        gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW)

        const rowSize = 3
        const stride = rowSize * Uint8Array.BYTES_PER_ELEMENT

        gl.vertexAttribPointer(meshOffsetLocation, 3, gl.UNSIGNED_BYTE, false, stride, 0)

        gl.enableVertexAttribArray(meshOffsetLocation)
        gl.vertexAttribDivisor(meshOffsetLocation, 1)

        gl.drawArraysInstanced(gl.TRIANGLES, 0, BLOCK_VERTICES.length, transformData.length / 3)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    static SetGLPosition(gl, program, x, y, z) {
        const vertexAttribLocation = gl.getAttribLocation(program, 'vertexPosition')
        const positionBuffer = gl.createBuffer()

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, BLOCK_VERTICES, gl.STATIC_DRAW)

        const positionVao = gl.createVertexArray()

        gl.bindVertexArray(positionVao)
        gl.enableVertexAttribArray(positionVao)

        const size = 3
        const type = gl.UNSIGNED_BYTE
        const normalize = false
        const stride = 0
        const offset = 0

        gl.vertexAttribPointer(
            vertexAttribLocation, size, type, normalize, stride, offset
        )

        gl.bindVertexArray(positionVao)

        const meshOffsetLocation = gl.getUniformLocation(program, 'meshOffset')

        gl.uniform3f(meshOffsetLocation, x, y, z)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {Array<Color>} colors 
     */
    static SetGLColor(gl, program, colorData) {
        const colorAttribLocation = gl.getAttribLocation(program, 'vertexColor')
        const colorBuffer = gl.createBuffer()

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW)

        gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0)
        gl.enableVertexAttribArray(colorAttribLocation)
    }
    
    static createColorNormalVertices() {

    }

    /**
     * @param {number} vectorSize 
     * @param {Array<Color>} colors 
     */
    static createColorVertices(vectorSize, colors) {
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
}