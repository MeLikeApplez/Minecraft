import Blocks from "../Geometry/Blocks"
import Block from "../Geometry/Block"
import Vector3 from "../../DistortionGL/Math/Vector3"
import Scene from "../../DistortionGL/Scenes/Scene"
import WorldScene from '../Scenes/WorldScene'

import GameObject from "../../DistortionGL/Core/GameObject"

export default class Chunk extends GameObject {
    static WIDTH = 16
    static HEIGHT = 16
    static LENGTH = 16
    static VOLUME = this.WIDTH * this.HEIGHT * this.LENGTH

    static _transformRowSize = 15
    static _transformStride = this._transformRowSize * Uint8Array.BYTES_PER_ELEMENT

    position: Vector3
    blockIds: Uint8Array
    ready: boolean
    _transformData: Uint8Array
    _transformBuffer: WebGLBuffer | null
    _sceneIndex: number

    constructor(x: number, z: number) {
        super()
        this.position = new Vector3(x, 0, z)

        this.blockIds = new Uint8Array(Array(Chunk.VOLUME).fill(1))

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
        // vec3[1] + vec2[6]
        this._transformData = new Uint8Array(Chunk.VOLUME * Chunk._transformRowSize)
        this._transformBuffer = null
        this._sceneIndex = -1

        this.ready = false
    }

    dispose() {
        
    }

    getBlockByIndex(index: number): Block | null {
        if(index < 0 || index >= this.blockIds.length) return null

        return Blocks.LIST[this.blockIds[index]]
    }

    getBlockByPosition(x: number, y: number, z: number): Block | null {
        const index = this.getIndexByPosition(x, y, z)

        if(index < 0 || index >= this.blockIds.length) return null

        return Blocks.LIST[this.blockIds[index]]
    }

    getIndexByPosition(x: number, y: number, z: number): number | -1 {
        const index = z * (Chunk.WIDTH * Chunk.HEIGHT) + y * Chunk.WIDTH + x

        return (index < 0 || index >= this.blockIds.length) ? -1 : index
    }

    getPositionByIndex(index: number): Vector3 | null {
        if(index < 0 || index >= this.blockIds.length) return null

        return new Vector3(
            this._transformData[index * Chunk._transformRowSize],
            this._transformData[index * Chunk._transformRowSize + 1],
            this._transformData[index * Chunk._transformRowSize + 2],
        )
    }

    create() {
        let offset = 0
        for(let z = 0; z < Chunk.LENGTH; z++) {
            for(let y = 0; y < Chunk.HEIGHT; y++) {
                for(let x = 0; x < Chunk.WIDTH; x++) {
                    this._transformData[offset] = x
                    this._transformData[offset + 1] = y
                    this._transformData[offset + 2] = z

                    offset += Chunk._transformRowSize
                }
            }
        }
    }

    cullFaceTexture(scene: WorldScene) {
        const { px, nx, pz, nz } = scene.getNeighboringChunks(this.position)

        let index = 0
        for(let y = 0; y < Chunk.HEIGHT; y++) {
            for(let x = 0; x < Chunk.WIDTH; x++) {
                if(px) {
                    index = this.getIndexByPosition(Chunk.LENGTH - 1, y, x)
                    const position = px.getBlockByPosition(0, y, x)
                    
                    if(position && (position.type === Block.States.SOLID)) {
                        this._transformData[index * Chunk._transformRowSize + 3] |= Block.TEXTURE_HIDE_BUFFER_BIT
                    }
                }

                if(nx) {
                    index = this.getIndexByPosition(0, y, x)
                    const position = nx.getBlockByPosition(Chunk.LENGTH - 1, y, x)
                    
                    if(position && (position.type === Block.States.SOLID)) {
                        this._transformData[index * Chunk._transformRowSize + 5] |= Block.TEXTURE_HIDE_BUFFER_BIT
                    }
                }

                if(pz) {
                    index = this.getIndexByPosition(x, y, Chunk.WIDTH - 1)
                    const position = pz.getBlockByPosition(x, y, 0)
                    
                    if(position && (position.type === Block.States.SOLID)) {
                        this._transformData[index * Chunk._transformRowSize + 11] |= Block.TEXTURE_HIDE_BUFFER_BIT
                    }
                    
                }

                if(nz) {
                    index = this.getIndexByPosition(x, y, 0)
                    const position = nz.getBlockByPosition(x, y, Chunk.WIDTH - 1)
                    
                    if(position && (position.type === Block.States.SOLID)) {
                        this._transformData[index * Chunk._transformRowSize + 13] |= Block.TEXTURE_HIDE_BUFFER_BIT
                    }

                }
            }
        }
    }

    update(gl: WebGL2RenderingContext, program: WebGLProgram) {
        if(this._transformBuffer === null) {
            this._transformBuffer = gl.createBuffer()
        }

        let idIndex = 0
        for(let i = 0; i < this._transformData.length; i += Chunk._transformRowSize) {
            const block = this.getBlockByIndex(idIndex)

            if(block === null) continue

            const texturePosition = block.cullFaceTexture(this, idIndex)

            this._transformData[i + 3] = (this._transformData[i + 3] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[0]
            this._transformData[i + 4] = (this._transformData[i + 4] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[1]  

            this._transformData[i + 5] = (this._transformData[i + 5] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[2]  
            this._transformData[i + 6] = (this._transformData[i + 6] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[3]

            this._transformData[i + 7] = (this._transformData[i + 7] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[4] 
            this._transformData[i + 8] = (this._transformData[i + 8] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[5] 

            this._transformData[i + 9] = (this._transformData[i + 9] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[6] 
            this._transformData[i + 10] = (this._transformData[i + 10] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[7] 

            this._transformData[i + 11] = (this._transformData[i + 11] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[8] 
            this._transformData[i + 12] = (this._transformData[i + 12] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[9] 

            this._transformData[i + 13] = (this._transformData[i + 13] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[10] 
            this._transformData[i + 14] = (this._transformData[i + 14] & Block.TEXTURE_HIDE_BUFFER_BIT) | texturePosition[11] 

            idIndex++
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this._transformData, gl.STATIC_DRAW)
    }

    render(gl: WebGL2RenderingContext, program: WebGLProgram, drawMode: number) {
        if(!this.ready) throw Error('Chunk is not ready loading!')

        const chunkOffsetLocation = gl.getUniformLocation(program, 'chunkOffset')

        // uniform[1234][fi][v]() - https://stackoverflow.com/a/31052622/13159492
        gl.uniform2f(chunkOffsetLocation, this.position.x, this.position.z)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)

        const blockOffsetLocation = gl.getAttribLocation(program, 'blockOffset')

        const faceTexturePXAttribLocation = gl.getAttribLocation(program, 'faceTexturePX')
        const faceTextureNXAttribLocation = gl.getAttribLocation(program, 'faceTextureNX')
        const faceTexturePYAttribLocation = gl.getAttribLocation(program, 'faceTexturePY')
        const faceTextureNYAttribLocation = gl.getAttribLocation(program, 'faceTextureNY')
        const faceTexturePZAttribLocation = gl.getAttribLocation(program, 'faceTexturePZ')
        const faceTextureNZAttribLocation = gl.getAttribLocation(program, 'faceTextureNZ')

        gl.vertexAttribPointer(blockOffsetLocation, 3, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 0)

        gl.vertexAttribPointer(faceTexturePXAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 3)
        gl.vertexAttribPointer(faceTextureNXAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 5)
        gl.vertexAttribPointer(faceTexturePYAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 7)
        gl.vertexAttribPointer(faceTextureNYAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 9)
        gl.vertexAttribPointer(faceTexturePZAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 11)
        gl.vertexAttribPointer(faceTextureNZAttribLocation, 2, gl.UNSIGNED_BYTE, false, Chunk._transformStride, 13)

        gl.vertexAttribDivisor(blockOffsetLocation, 1)

        gl.vertexAttribDivisor(faceTexturePXAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNXAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNYAttribLocation, 1)
        gl.vertexAttribDivisor(faceTexturePZAttribLocation, 1)
        gl.vertexAttribDivisor(faceTextureNZAttribLocation, 1)
        
        gl.enableVertexAttribArray(blockOffsetLocation)

        gl.enableVertexAttribArray(faceTexturePXAttribLocation)
        gl.enableVertexAttribArray(faceTextureNXAttribLocation)
        gl.enableVertexAttribArray(faceTexturePYAttribLocation)
        gl.enableVertexAttribArray(faceTextureNYAttribLocation)
        gl.enableVertexAttribArray(faceTexturePZAttribLocation)
        gl.enableVertexAttribArray(faceTextureNZAttribLocation)

        gl.drawArraysInstanced(drawMode, 0, Block.VERTICES.length, Chunk.VOLUME)
    }
}