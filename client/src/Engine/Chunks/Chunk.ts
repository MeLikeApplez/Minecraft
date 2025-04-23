import Blocks from "../Geometry/Blocks"
import Block from "../Geometry/Block"
import Vector3 from "../../DistortionGL/Math/Vector3"
import Scene from "../../DistortionGL/Scenes/Scene"
import WorldScene from '../Scenes/WorldScene'

import GameObject from "../../DistortionGL/Core/GameObject"
import type WebGL2Renderer from "../../DistortionGL/Renderers/WebGL2"
import type { Uniforms as RequiredUniform, Attributes as RequiredAttributes } from '../Shaders/RequiredShaderTypes.js'
import type Shader from "../../DistortionGL/Shaders/Shader.js"

export default class Chunk extends GameObject {
    static MAX_VOLUME = 65536
    static MAX_WIDTH = 16
    static MAX_HEIGHT = 256
    static MAX_LENGTH = 16

    static MAX_BIT_WIDTH = 4
    static MAX_BIT_HEIGHT = 8
    static MAX_BIT_LENGTH = 4


    static WIDTH = 16
    static HEIGHT = 32
    static LENGTH = 16
    static VOLUME = this.WIDTH * this.HEIGHT * this.LENGTH

    position: Vector3
    blockIds: Uint8Array
    ready: boolean
    _transformInstanceCount: number
    _transformBuffer: WebGLBuffer | null
    _sceneIndex: number

    constructor(x: number, z: number) {
        super()
        this.position = new Vector3(x, 0, z)

        this.blockIds = new Uint8Array(Array(Chunk.VOLUME).fill(1))

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
        this._transformInstanceCount = 0
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
            index % Chunk.WIDTH,
            Math.floor(index / Chunk.WIDTH) % Chunk.HEIGHT,
            Math.floor(index / (Chunk.WIDTH * Chunk.HEIGHT))
        )
    }

    update(gl: WebGL2RenderingContext, scene: WorldScene) {
        if(this._transformBuffer === null) {
            this._transformBuffer = gl.createBuffer()
        }

        const { px, nx, pz, nz } = scene.getNeighboringChunks(this)
        const preTransformData: Array<number> = []

        for(let i = 0; i < this.blockIds.length; i++) {
            let block = this.getBlockByIndex(i)

            if(block === null) continue
            const { x, y, z } = this.getPositionByIndex(i) as Vector3
            const excludeAxis = {
                px: false, nx: false,
                py: false, ny: false,
                pz: false, nz: false
            }

            if(px) {
                const otherBlock = px.getBlockByPosition(0, y, z) as Block

                if(x === Chunk.WIDTH - 1 && otherBlock.type === Block.States.SOLID) {
                    excludeAxis.px = true
                }
            }

            if(nx) {
                const otherBlock = nx.getBlockByPosition(Chunk.WIDTH - 1, y, z) as Block

                if(x === 0 && (otherBlock.type === Block.States.SOLID)) {
                    excludeAxis.nx = true
                }
            }

            if(pz) {
                const otherBlock = pz.getBlockByPosition(x, y, 0) as Block
                
                if(z === Chunk.LENGTH - 1 && (otherBlock.type === Block.States.SOLID)) {
                    excludeAxis.nz = true
                }
            }

            if(nz) {
                const otherBlock = nz.getBlockByPosition(x, y, Chunk.LENGTH - 1) as Block

                if(z === 0 && (otherBlock.type === Block.States.SOLID)) {
                    excludeAxis.pz = true
                }
            }

            
            const faces = block.cullFaceTriangles(this, i, excludeAxis)
            
            if(faces === null) continue

            preTransformData.push(...faces)
            
            // console.log(faces)
            // console.log(faces.map(v => v.toString(2).padStart(32, '0').match(/\d\d\d\d/g)?.join(' ')))
            // console.log(...faces.map(v => [v & 31, v >> 5 & 31]))
        }

        this._transformInstanceCount = preTransformData.length
        
        // vao are broken
        // gl.bindVertexArray(this._vertexArray)
        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(preTransformData), gl.STATIC_DRAW)
    }

    render(gl: WebGL2RenderingContext, shader: Shader<RequiredUniform, RequiredAttributes>, drawMode: number) {
        if(!this.ready) throw Error('Chunk is not ready loading!')

        gl.uniform2f(shader.uniforms.chunkOffset, this.position.x, this.position.z)
        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)

        // pointer
        gl.vertexAttribIPointer(shader.attributes.blockData, 1, gl.INT, 0, 0)

        // divisor
        gl.vertexAttribDivisor(shader.attributes.blockData, 1)

        // enable
        gl.enableVertexAttribArray(shader.attributes.blockData)

        gl.drawArraysInstanced(drawMode, 0, Block.FACE_VERTEX.length, this._transformInstanceCount)
    }
}