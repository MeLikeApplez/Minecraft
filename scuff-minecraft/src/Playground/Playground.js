import Perspective from "../Engine/Camera/Perspective"
import Engine from "../Engine/Engine"
import Vector3 from "../Engine/Math/Vector3"

import KeyboardControls from "../Engine/Controls/Keyboard"
import Chunk from "../Engine/Chunks/Chunk"
import Texture2D from "../Engine/Texture/Texture2D"
import Scene from "../Engine/Scene"
import Renderer from "../Engine/Renderer"
import Camera from "../Engine/Camera/Camera"

const Keyboard = new KeyboardControls()

/**
 * @param {HTMLCanvasElement} canvas 
 */
export default function Playground(canvas, onLoad) {
    console.clear()
    console.log('%c[Reloading]', 'color: rgb(250, 200, 10);')

    window.Keyboard = Keyboard
    window.Engine = Engine

    Keyboard.load(canvas)
    Engine.onAnimate = () => animate(renderer, scene, camera)
    Engine.onLoad = onLoad
    
    const renderer = new Renderer({
        canvasElement: canvas,
        antialias: false
    })
    const scene = new Scene(canvas)
    const camera = new Perspective(75, window.innerWidth / window.innerHeight, 1, 100)
    // camera.position.set(1.5, 1.5, 1.5)
    camera.position.set(15.75, 20, 40)

    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
    }

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    scene.generateChunks(2, 2)

    console.log(Engine)
    console.log(scene)
    console.log(renderer)
    
    Engine.load(canvas)
    renderer.load()
    // renderer.update(scene, camera)
    // renderer.wireframe = true

    return Engine
}

const HALF_PI = Math.PI / 2
const velocity = new Vector3(0, 0, 0)

/**
 * @param {Scene} scene 
 * @param {Camera} camera 
 */
function PlayerControls(scene, camera) {
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

        dragX *= Engine.delta / (3 * camera.aspect)
        dragY *= Engine.delta / (3 * camera.aspect)

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
 * @param {Renderer} renderer 
 * @param {Scene} scene 
 * @param {Camera} camera 
 */
function animate(renderer, scene, camera) {
    PlayerControls(scene, camera)


    renderer.update(scene, camera)
}

