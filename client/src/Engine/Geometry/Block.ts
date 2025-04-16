import Chunk from "../Chunks/Chunk"
import Vector2 from "../../DistortionGL/Math/Vector2"
import Vector3 from "../../DistortionGL/Math/Vector3"
import Texture2D from "../Textures/Texture2D"
import { extendArray } from "../../DistortionGL/Math/MathUtils"
import Blocks from "./Blocks"

type BlockStates = {
    SOLID: 0,
    PARTIAL_SOLID: 1,
    TRANSPARENT: 2,
    LIQUID: 3,
    ENTITY: 4
}

export default class Block {
    static States: BlockStates = {
        SOLID: 0,
        PARTIAL_SOLID: 1,
        TRANSPARENT: 2,
        LIQUID: 3,
        ENTITY: 4
    }

    static MISSING_TEXTURE_COLOR = new Uint8Array([255, 0, 200])


    static ATLAS_PATH = '/assets/14w25b.webp'
    static ATLAS_WIDTH = 512
    static ATLAS_HEIGHT = 512
    static ATLAS_BLOCK_SIZE = 16
    static ATLAS_TRANSPARENT_U = 30
    static ATLAS_TRANSPARENT_V = 30
    static ATLAS_VERTICES = extendArray(Texture2D.UV_SQUARE, 6) as Float32Array

    static TEXTURE_HIDE_BUFFER_BIT = 32

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
    // binary scheme
    // 0000 0000
    // 00NN NXYZ
    static VERTICES = new Int8Array([
        // right
        0b000110,
        0b000100,
        0b000111,
        
        0b000100,
        0b000101,
        0b000111,

        // left
        0b001011,
        0b001001,
        0b001010,
        
        0b001001,
        0b001000,
        0b001010,
    
        // top
        0b010011,
        0b010010,
        0b010111,
        
        0b010010,
        0b010110,
        0b010111,

        // bottom
        0b011000,
        0b011001,
        0b011100,
        
        0b011001,
        0b011101,
        0b011100,

        //  front
        0b100111,
        0b100101,
        0b100011,
        
        0b100101,
        0b100001,
        0b100011,

        // back
        0b101010,
        0b101000,
        0b101110,
        
        0b101000,
        0b101100,
        0b101110,
    ])

    name: string
    type: typeof Block.States[keyof BlockStates]
    texturePosition: Array<number>

    constructor(name: string, type: typeof Block.States[keyof BlockStates], texturePosition: Array<number>) {
        if(texturePosition.length !== 2 && texturePosition.length !== 12) throw Error('"texturePosition" uv array must be a length 12 or a length of 2!')

        this.name = name
        this.type = type

        // z-axis is flipped from traditional 3d graphs due to how project is calculated
        // right(+x) -> left(-x) -> top(+y) -> bottom(-y) ->  front(+z) -> back(-z)
        // 0000 0000 => 00HN NNNN
        // H => show(0) / hide(1) texture
        // N => texture position
        this.texturePosition = texturePosition.length === 2 ? extendArray(texturePosition, 6) as Array<number> : texturePosition
    }

    getTextureUVByNormal(normal: Vector3) {
        const uv = new Vector2(0, 0)

        if(normal.x < 0) {
            uv.set(10, 11)
        } else if(normal.x > 0) {
            uv.set(8, 9)
        } else if(normal.y < 0) {
            uv.set(4, 5)
        } else if(normal.y > 0) {
            uv.set(6, 7)
        } else if(normal.z < 0) {
            uv.set(2, 3)
        } else if(normal.z > 0) {
            uv.set(0, 1)
        } 

        return uv
    }

    cullFaceTexture(chunk: Chunk, idIndex: number) {
        const position = chunk.getPositionByIndex(idIndex)

        if(position === null) return this.texturePosition

        const newTexturePositions = Array.from(this.texturePosition)

        const pxIndex = idIndex + 1
        const px = chunk.getPositionByIndex(pxIndex)
        if(px !== null && position.y === px.y && position.z === px.z && Blocks.LIST[chunk.blockIds[pxIndex]].type === Block.States.SOLID) {
            newTexturePositions[0] = newTexturePositions[0] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[1] = newTexturePositions[1] | Block.TEXTURE_HIDE_BUFFER_BIT
        }

        const nxIndex = idIndex - 1
        const nx = chunk.getPositionByIndex(nxIndex)
        if(nx !== null && position.y === nx.y && position.z === nx.z && Blocks.LIST[chunk.blockIds[nxIndex]].type === Block.States.SOLID) {
            newTexturePositions[2] = newTexturePositions[2] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[3] = newTexturePositions[3] | Block.TEXTURE_HIDE_BUFFER_BIT
        }

        const pyIndex = idIndex + Chunk.WIDTH
        const py = chunk.getPositionByIndex(pyIndex)
        if(py !== null && position.x === py.x && position.z === py.z && Blocks.LIST[chunk.blockIds[pyIndex]].type === Block.States.SOLID) {
            newTexturePositions[4] = newTexturePositions[4] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[5] = newTexturePositions[5] | Block.TEXTURE_HIDE_BUFFER_BIT
        }

        const nyIndex = idIndex - Chunk.WIDTH
        const ny = chunk.getPositionByIndex(nyIndex)
        if(ny !== null && position.x === ny.x && position.z === ny.z && Blocks.LIST[chunk.blockIds[nyIndex]].type === Block.States.SOLID) {
            newTexturePositions[6] = newTexturePositions[6] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[7] = newTexturePositions[7] | Block.TEXTURE_HIDE_BUFFER_BIT
        }
        
        const pzIndex = idIndex + (Chunk.WIDTH * Chunk.HEIGHT)
        const pz = chunk.getPositionByIndex(pzIndex)
        if(pz !== null && position.x === pz.x && position.y === pz.y && Blocks.LIST[chunk.blockIds[pzIndex]].type === Block.States.SOLID) {
            newTexturePositions[8] = newTexturePositions[8] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[9] = newTexturePositions[9] | Block.TEXTURE_HIDE_BUFFER_BIT
        }

        const nzIndex = idIndex - (Chunk.WIDTH * Chunk.HEIGHT)
        const nz = chunk.getPositionByIndex(nzIndex)
        if(nz !== null && position.x === nz.x && position.y === nz.y && Blocks.LIST[chunk.blockIds[nzIndex]].type === Block.States.SOLID) {
            newTexturePositions[10] = newTexturePositions[10] | Block.TEXTURE_HIDE_BUFFER_BIT
            newTexturePositions[11] = newTexturePositions[11] | Block.TEXTURE_HIDE_BUFFER_BIT
        }


        return newTexturePositions
    }
}