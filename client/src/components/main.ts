import PerspectiveCamera from "../DistortionGL/Camera/PerspectiveCamera"
import Keyboard from "../DistortionGL/Controls/Keyboard"
import Pointer from "../DistortionGL/Controls/Pointer"
import Vector2 from "../DistortionGL/Math/Vector2"
import Vector3 from "../DistortionGL/Math/Vector3"
import WebGL2Renderer from "../DistortionGL/Renderers/WebGL2"
import AnimationGameLoop from "../DistortionGL/Utils/AnimationGameLoop"
import Chunk from "../Engine/Chunks/Chunk"
import WorldScene from '../Engine/Scenes/WorldScene'

export default function main(canvas: HTMLCanvasElement) {
    const gameLoop = new AnimationGameLoop()
    const keyboard = new Keyboard(canvas, true)
    const pointer = new Pointer(canvas, window.devicePixelRatio)
    
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    const scene = new WorldScene(camera)
    const renderer = new WebGL2Renderer(canvas, {
        antialias: true,
        powerPreference: 'high-performance'
    })

    renderer.setSize(window.innerWidth, window.innerHeight, window.devicePixelRatio)

    console.log(renderer)
    console.log(scene)

    camera.position.set(10, 20, 25)

    scene.generateSimplexNoiseChunks({
        seed: 'seed',
        width: 4, length: 4, // width = length must be set!
        amplitude: 3,
        frequency: 0.03
    })

    renderer.loadScene(scene)

    gameLoop.events.addEventListener('onupdate', update)
    gameLoop.start()

    const HALF_PI = Math.PI / 2
    const velocity = new Vector3(0, 0, 0)
    const lastDrag = new Vector2(0, 0)

    function playerControls(speed: number) {
        if(keyboard.keys.has('w')) {
            velocity.x -= camera.rotationMatrix[8]
            velocity.y -= camera.rotationMatrix[9]
            velocity.z -= camera.rotationMatrix[10]
        }
    
        if(keyboard.keys.has('a')) {
            velocity.x -= camera.rotationMatrix[0]
            velocity.y -= camera.rotationMatrix[1]
            velocity.z -= camera.rotationMatrix[2]
        }
    
        if(keyboard.keys.has('s')) {
            velocity.x += camera.rotationMatrix[8]
            velocity.y += camera.rotationMatrix[9]
            velocity.z += camera.rotationMatrix[10]
        }
    
        if(keyboard.keys.has('d')) {
            velocity.x += camera.rotationMatrix[0]
            velocity.y += camera.rotationMatrix[1]
            velocity.z += camera.rotationMatrix[2]
        }
    
        if(keyboard.keys.has(' ')) {
            velocity.y += 1
        }
    
        if(keyboard.keys.has('shift')) {
            speed *= 2
        }

        camera.position.add(velocity.normalize().multiplyScalar(speed))
        velocity.set(0, 0, 0)

        if(pointer.isPointerDown) {
            const drag = new Vector2(pointer.drag.x - lastDrag.x, pointer.drag.y - lastDrag.y)
    
            drag.x *= gameLoop.deltaTime / (3 * camera.aspect)
            drag.y *= gameLoop.deltaTime / (3 * camera.aspect)
    
            if(drag.x !== 0) {
                camera.rotation.y += drag.x
    
                camera.updateProjectionMatrix()
            }
    
            if(drag.y !== 0 && (Math.abs(camera.rotation.x - drag.y) < HALF_PI)) {
                camera.rotation.x += drag.y
    
                camera.updateProjectionMatrix()
            }

            lastDrag.copy(pointer.drag)
        } else {
            lastDrag.set(0, 0)
        }
    }

    function update() {
        let speed = gameLoop.deltaTime * 10

        playerControls(speed)

        renderer.render()
    }


}