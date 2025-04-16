import Camera from "../../DistortionGL/Camera/Camera";
import Block from "../Geometry/Block";
import WorldScene from "../Scenes/WorldScene";
import Color from "../../DistortionGL/Math/Color";

export default class Skybox {
    scene: WorldScene
    skyColor: Color
    _boxBuffer: WebGLBuffer | null

    constructor(scene: WorldScene) {
        this.scene = scene

        this.skyColor = new Color(120, 170, 255)
        // this.skyColor = new Color(0, 0, 0)

        this._boxBuffer = null
    }

    render(gl: WebGL2RenderingContext, program: WebGLProgram, camera: Camera) {
        // const vertexDataAttribLocation = gl.getAttribLocation(program, 'vertexData')

        // if(this._boxBuffer === null) {
        //     this._boxBuffer = gl.createBuffer()
        // }

        // camera.update(gl, program)

        // const skyColorLocation = gl.getUniformLocation(program, 'skyColor')

        // gl.uniform3f(skyColorLocation, this.skyColor[0], this.skyColor[1], this.skyColor[2])

        // gl.bindBuffer(gl.ARRAY_BUFFER, this._boxBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, Block.VERTICES, gl.STATIC_DRAW)

        // // gl.vertexAttribIPointer() - https://stackoverflow.com/a/18926905/13159492
        // gl.vertexAttribIPointer(vertexDataAttribLocation, 1, gl.BYTE, 0, 0)
        // gl.enableVertexAttribArray(vertexDataAttribLocation)

        // gl.drawArrays(gl.TRIANGLES, 0, Block.VERTICES.length)
    }
}