import Shader from "../../../DistortionGL/Shaders/Shader"
import basicVertexSourceCode from './basicVertex.glsl?raw'
import basicFragmentSourceCode from './basicFragment.glsl?raw'
import type { Uniforms, Attributes } from '../RequiredShaderTypes'


const BasicShaders = new Shader<Uniforms, Attributes>('Basic')

BasicShaders.uniforms = {
    chunkOffset: null,
    cameraProjection: null,
    cameraRotation: null,
    cameraPosition: null,
    sunPosition: null,
    atlasCropWidth: null,
    atlasCropHeight: null,
}

BasicShaders.attributes =  {
    vertexData: -1,
    blockOffset: -1,
    vertexTexCoords: -1,
    faceTextureNZ: -1,
    faceTexturePZ: -1,
    faceTexturePY: -1,
    faceTextureNY: -1,
    faceTextureNX: -1,
    faceTexturePX: -1,
}

export default BasicShaders .preloadSourceCode(basicVertexSourceCode, basicFragmentSourceCode)