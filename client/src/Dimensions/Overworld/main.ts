import { Clock, Keyboard, OrbitControls, PerspectiveCamera, Pointer, Scene, Vector3, WebGL2Renderer } from 'distortiongl'
import OverworldScene from './OverworldScene'

export default function main(canvas: HTMLCanvasElement) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    const scene = new OverworldScene()
    const renderer = new WebGL2Renderer(canvas, {
        antialias: true,
        powerPreference: 'high-performance'
    })

    const clock = new Clock()
    const pointer = new Pointer(canvas)
    const controls = new OrbitControls(canvas, camera)
    const keyboard = new Keyboard(canvas, true)

    window.addEventListener('resize', resize)
    clock.addEventListener('onupdate', animate)
    
    resize()
    clock.start()

    console.log(scene)
    console.log(camera)

    function animate() {
        // renderer.render(scene, camera)
    }

    function resize() {
         renderer.setSize(window.innerWidth, window.innerHeight, window.devicePixelRatio)

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
    }
}