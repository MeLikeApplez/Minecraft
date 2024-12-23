/**
 * @typedef {object} BlockType
 * @property {string} name
 * @property {Block.SOLID | Block.PARTIAL_SOLID | Block.TRANSPARENT | Block.LIQUID | Block.ENTITY} type
 * @property {Array<number>} texturePosition
 */

import Chunk from "../Chunks/Chunk"
import Texture2D from "../Texture/Texture2D"
import Blocks from "./Blocks"

/**
 * @type {BlockType}
 */
export default class Block {
    static SOLID = 0
    static PARTIAL_SOLID = 1
    static TRANSPARENT = 2
    static LIQUID = 3
    static ENTITY = 4

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
    // binary scheme
    // 0000 0000
    // 00NN NXYZ
    static VERTICES = new Int8Array([
        //  front
        0b000111,
        0b000101,
        0b000011,
        
        0b000101,
        0b000001,
        0b000011,

        // back
        0b001010,
        0b001000,
        0b001110,
        
        0b001000,
        0b001100,
        0b001110,

        // top
        0b010000,
        0b010001,
        0b010100,
        
        0b010001,
        0b010101,
        0b010100,
    
        // bottom
        0b011011,
        0b011010,
        0b011111,
        
        0b011010,
        0b011110,
        0b011111,

        // left
        0b100011,
        0b100001,
        0b100010,
        
        0b100001,
        0b100000,
        0b100010,
    
        // right
        0b101110,
        0b101100,
        0b101111,
        
        0b101100,
        0b101101,
        0b101111,
    ])

    /**
     * @param {string} name 
     * @param {Block.SOLID | Block.PARTIAL_SOLID | Block.TRANSPARENT | Block.LIQUID | Block.ENTITY} type
     * @param {Array<number>} texturePosition  
     */
    constructor(name, type, texturePosition) {
        if(texturePosition.length !== 2 && texturePosition.length !== 12) throw Error('"texturePosition" uv array must be a length 12 or a length of 2!')

        this.name = name
        this.type = type

        // front(-z) -> back(+z) ->  bottom(-y) -> top(+y)  -> left(-x) -> right(+x)
        // 0000 0000 => 00HN NNNN
        // H => show(0) / hide(1) texture
        // N => texture position
        this.texturePosition = texturePosition.length === 2 ? Texture2D.extendArrayBuffer(texturePosition, 6) : texturePosition
    }

    /**
     * @param {Chunk} chunk 
     * @param {number} idIndex 
     */
    cullFaceTexture(chunk, idIndex) {
        const newTexturePositions = [...this.texturePosition]

        const x = chunk.blockPositions[idIndex * 3]
        const y = chunk.blockPositions[idIndex * 3 + 1]
        const z = chunk.blockPositions[idIndex * 3 + 2]

        const nz = idIndex - 1
        const nzX = chunk.blockPositions[nz * 3]
        const nzY = chunk.blockPositions[(nz * 3) + 1]
        if(x === nzX && y == nzY && Blocks.LIST[chunk.blockIds[nz]].type === Block.SOLID) {
            // newTexturePositions[2] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[2] = newTexturePositions[2] | 0b100000
            // newTexturePositions[3] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[3] = newTexturePositions[3] | 0b100000
        }
        
        const pz = idIndex + 1
        const pzX = chunk.blockPositions[pz * 3]
        const pzY = chunk.blockPositions[(pz * 3) + 1]
        if(x === pzX && y === pzY && Blocks.LIST[chunk.blockIds[pz]].type === Block.SOLID) {
            // newTexturePositions[0] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[0] = newTexturePositions[0] | 0b100000
            // newTexturePositions[1] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[1] = newTexturePositions[1] | 0b100000
        }

        const nx = idIndex + chunk.width
        const nxY = chunk.blockPositions[(nx * 3) + 1]
        const nxZ = chunk.blockPositions[(nx * 3) + 2]
        if(y === nxY && z === nxZ && Blocks.LIST[chunk.blockIds[nx]].type === Block.SOLID) {
            // newTexturePositions[10] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[10] = newTexturePositions[10] | 0b100000
            // newTexturePositions[11] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[11] = newTexturePositions[11] | 0b100000
        }

        const px = idIndex - chunk.width
        const pxY = chunk.blockPositions[(px * 3) + 1]
        const pxZ = chunk.blockPositions[(px * 3) + 2]
        if(y === pxY && z === pxZ && Blocks.LIST[chunk.blockIds[px]].type === Block.SOLID) {
            // newTexturePositions[8] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[8] = newTexturePositions[8] | 0b100000
            // newTexturePositions[9] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[9] = newTexturePositions[9] | 0b100000
        }

        const ny = idIndex - (chunk.width * chunk.length)
        const nyX = chunk.blockPositions[ny * 3]
        const nyZ = chunk.blockPositions[(ny * 3) + 2]
        if(x === nyX && z === nyZ && Blocks.LIST[chunk.blockIds[ny]].type === Block.SOLID) {
            // newTexturePositions[4] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[4] = newTexturePositions[4] | 0b100000
            // newTexturePositions[5] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[5] = newTexturePositions[5] | 0b100000
        }

        const py = idIndex + (chunk.width * chunk.length)
        const pyX = chunk.blockPositions[py * 3]
        const pyZ = chunk.blockPositions[(py * 3) + 2]
        if(x === pyX && z === pyZ && Blocks.LIST[chunk.blockIds[py]].type === Block.SOLID) {
            // newTexturePositions[6] = Texture2D.ATLAS_TRANSPARENT_U
            newTexturePositions[6] = newTexturePositions[6] | 0b100000
            // newTexturePositions[7] = Texture2D.ATLAS_TRANSPARENT_V
            newTexturePositions[7] = newTexturePositions[7] | 0b100000
        }

        return newTexturePositions
    }
}