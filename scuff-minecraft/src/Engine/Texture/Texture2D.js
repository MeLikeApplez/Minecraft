/**
 * @typedef {Object} Texture2DTType
 * @property {HTMLImageElement?} img
 * @property {WebGLBuffer?} uvBuffer
 * @property {WebGLTexture?} imgBuffer
 */

const EMPTY_TEXTURE = new Uint8Array(3)

/**
 * @type {Texture2DTType}
 */
export default class Texture2D {
    static TEXTURE_MAP_PATH = '/assets/14w25b.webp'

    static UV_TRIANGLES = new Float32Array([
        0, 0,
        0, 1,
        1, 0,
    
        0, 1,
        1, 1,
        1, 0,
    ])

    // 6 points per face * 6 sides
    // multiply this by 2 for a square
    static POINTS_PER_TRIANGLE_FACE = 36

    /**
     * @param {number} n 
     */
    static clamp(n) {
        return n > 1 ? 1 : (n < 0 ? 0 : n)
    }

    /**
     * @param {Float32Array} positions 
     */
    static clampUVCoordinates(positions) {
        for(let i = 0; i < positions.length; i++) {
            const n = positions[i]

            positions[i] = this.clamp(n)
        }
    }

    /**
     * @param {ArrayBuffer} positions 
     * @param {number} size 
     * @param {Float32Array?} floatArray
     */
    static createUVCoordinates(positions, size, floatArray=null) {
        const uv = floatArray === null ? new Float32Array(positions.length * size) : floatArray

        for(let i = 0; i < size; i++) {
            for(let j = 0; j < positions.length; j++) {
                uv[(i * positions.length) + j] = positions[j]
            }
        }

        return uv
    }

    /**
     * @param {Float32Array} positions 
     * @param {number} width 
     * @param {number} height 
     * @param {number} x 
     * @param {number} y 
     */
    static cropUVSquare(positions, width, height, x, y) {
        for(let i = 0; i < positions.length; i++) {
            const n = positions[i]


        }
    }

    /**
     * @param {string} src 
     */
    static async loadImage(src) {
        const img = new Image()

        img.src = src
        this.img = img

        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.ready = true

                resolve(img)
            }
            img.onerror = () => {
                this.ready = false

                reject('Cannot load image: ' + src)
            }
        })
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {HTMLImageElement?} img 
     * @param {WebGLBuffer} textureVertexBuffer 
     * @param {WebGLTexture} textureImgBuffer 
     */
    static render(gl, program, img=null, textureVertexBuffer, textureImgBuffer) {
        // load vertex buffer
        const textureAttribLocation = gl.getAttribLocation(program, 'aTexCoord')

        gl.bindBuffer(gl.ARRAY_BUFFER, textureVertexBuffer)

        gl.vertexAttribPointer(textureAttribLocation, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(textureAttribLocation)

        if(!img) {
            // DEFAULT FOR UNLOADED TEXTURE IMAGE
            gl.bindTexture(gl.TEXTURE_2D, textureImgBuffer)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, EMPTY_TEXTURE)

            return
        }

        // load texture img buffer
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        gl.bindTexture(gl.TEXTURE_2D, textureImgBuffer)

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // texture filter
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        
        gl.generateMipmap(gl.TEXTURE_2D)
    }
}