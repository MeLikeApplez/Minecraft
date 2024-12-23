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
    static ATLAS_PATH = '/assets/14w25b.webp'
    static ATLAS_WIDTH = 512
    static ATLAS_HEIGHT = 512
    static BLOCK_WIDTH = 16
    static BLOCK_HEIGHT = 16
    static BLOCK_FACE_VERTICES = 6
    static CUBE_VERTICES = 36

    static ATLAS_TRANSPARENT_U = 30
    static ATLAS_TRANSPARENT_V = 30

    static UV_SQUARE = new Float32Array([
        0, 0,
        0, 1,
        1, 0,
    
        0, 1,
        1, 1,
        1, 0,
    ])

    /**
     * @param {Array | ArrayBuffer} array 
     * @param {number} size 
     * @return {Array | ArrayBuffer}
     */
    static extendArrayBuffer(array, size) {
        const ArrayType = array.constructor
        const arrayCopy = new ArrayType(array.length * size)

        for(let i = 0; i < size; i++) {
            for(let j = 0; j < array.length; j++) {
                arrayCopy[(array.length * i) + j] = array[j]
            }
        }

        return arrayCopy
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

                reject(`Cannot load image: "${src}"`)
            }
        })
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {HTMLImageElement?} img 
     * @param {number} imgWidth 
     * @param {number} imgHeight 
     * @param {WebGLBuffer} textureVertexBuffer 
     * @param {WebGLTexture} textureImgBuffer 
     */
    static renderBlock(gl, program, img=null, imgWidth, imgHeight, textureVertexBuffer, textureImgBuffer) {
        // load vertex buffer
        const textureAttribLocation = gl.getAttribLocation(program, 'aTexCoord')
        const atlasWidthLocation = gl.getUniformLocation(program, 'atlasWidth')
        const atlasHeightLocation = gl.getUniformLocation(program, 'atlasHeight')

        if(atlasWidthLocation) {
            gl.uniform1i(atlasWidthLocation, imgWidth)
        }

        if(atlasHeightLocation) {
            gl.uniform1i(atlasHeightLocation, imgHeight)
        }   
        
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
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

        gl.bindTexture(gl.TEXTURE_2D, textureImgBuffer)

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // texture filter
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        
        gl.generateMipmap(gl.TEXTURE_2D)
    }
}