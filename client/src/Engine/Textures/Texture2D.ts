import Vector2 from "../../DistortionGL/Math/Vector2"
import Vector3 from "../../DistortionGL/Math/Vector3"

const MISSING_TEXTURE = new Uint8Array([255, 0, 200])
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

    static async loadImage(src: string) {
        const img = new Image()

        img.src = src

        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                reject(`Cannot load image: "${src}"`)
            }
        })
    }

}