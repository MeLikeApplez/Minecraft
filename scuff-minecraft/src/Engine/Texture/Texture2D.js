/**
 * @typedef {Object} Texture2DTType
 * @property {HTMLImageElement?} img
 * @property {WebGLBuffer?} uvBuffer
 * @property {WebGLTexture?} imgBuffer
 */

import Vector2 from "../Math/Vector2"
import Vector3 from "../Math/Vector3"

const MISSING_TEXTURE = new Uint8Array([255, 0, 200])

/**
 * @type {Texture2DTType}
 */
export default class Texture2D {    
    static BLOCK_WIDTH = 16
    static BLOCK_HEIGHT = 16
    static BLOCK_FACE_VERTICES = 6
    static CUBE_VERTICES = 36

    static UV_SQUARE = new Float32Array([
        0, 0,
        0, 1,
        1, 0,
    
        0, 1,
        1, 1,
        1, 0,
    ])

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

}