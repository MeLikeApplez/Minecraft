import Perspective from "../Engine/Camera/Perspective"
import _Engine from "../Engine/Engine"
import Vector3 from "../Engine/Math/Vector3"

import KeyboardControls from "../Engine/Controls/Keyboard"
import Chunk from "../Engine/Chunks/Chunk"

const Keyboard = new KeyboardControls()

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {function?} onError 
 */
export default function Playground(canvas, onError) {
    console.clear()
    const Engine = new _Engine(canvas)

    window.Keyboard = Keyboard
    window.Engine = Engine

    Keyboard.load(canvas)
    Engine.onError = onError
    Engine.onAnimate = animate

    Engine.load()
    
    const { Scene, Renderer } = Engine
    const camera = new Perspective(75, window.innerWidth / window.innerHeight, 0.5, 500)
    
    window.onresize = () => Renderer.updateCanvasSize()
    Scene.camera = camera
    
    console.log(Engine)
    console.log(Scene)



    const chunk = new Chunk(0, 0)

    console.log(chunk)
    Scene.addChunk(chunk)
    
    camera.position.set(8, 4, 16)
    // camera.lookAt(new Vector3(0, 0, 0))
    
    // camera.position.set(0.5, 0.5, 2)
    // camera.lookAt(new Vector3(0.5, 0, 0))

    // Renderer.wireframe = true

    return () => {
        Engine.dispose()
    }
}

const HALF_PI = Math.PI / 2
const velocity = new Vector3(0, 0, 0)

/**
 * @param {_Engine} Engine 
 */
function PlayerControls(Engine) {
    const { Scene } = Engine
    const camera = Scene.camera

    let speed = Engine.delta * 5

    if(Keyboard.keys.has('w')) {
        velocity.x -= camera.rotationMatrix[8]
        velocity.y -= camera.rotationMatrix[9]
        velocity.z -= camera.rotationMatrix[10]
    }

    if(Keyboard.keys.has('a')) {
        velocity.x -= camera.rotationMatrix[0]
        velocity.y -= camera.rotationMatrix[1]
        velocity.z -= camera.rotationMatrix[2]
    }

    if(Keyboard.keys.has('s')) {
        velocity.x += camera.rotationMatrix[8]
        velocity.y += camera.rotationMatrix[9]
        velocity.z += camera.rotationMatrix[10]
    }

    if(Keyboard.keys.has('d')) {
        velocity.x += camera.rotationMatrix[0]
        velocity.y += camera.rotationMatrix[1]
        velocity.z += camera.rotationMatrix[2]
    }

    if(Keyboard.keys.has(' ')) {
        velocity.y += 1
    }

    if(Keyboard.keys.has('shift')) {
        speed *= 2
    }

    camera.position.add(velocity.normalize().multiplyScalar(speed))
    velocity.set(0, 0, 0)

    if(Keyboard.mouseDown) {
        let { dragX, dragY } = Keyboard.getUpdateDrag()

        dragX *= Engine.delta / 3
        dragY *= Engine.delta / 3

        if(dragX !== 0) {
            camera.rotation.y += dragX

            camera.updateRotationMatrix()
        }

        if(dragY !== 0 && (Math.abs(camera.rotation.x - dragY) < HALF_PI)) {
            camera.rotation.x -= dragY

            camera.updateRotationMatrix()
        }
    }

}

/**
 * @param {_Engine} Engine 
 */
function animate(Engine) {
    PlayerControls(Engine)

    
}
