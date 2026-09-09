import { WebGL2ShaderLoader } from 'distortiongl'
import OverworldVertexCode from './Overworld.vert?raw'
import OverworldFragCode from './Overworld.frag?raw'

export default new WebGL2ShaderLoader({
    vertexShader: OverworldVertexCode,
    fragmentShader: OverworldFragCode
})