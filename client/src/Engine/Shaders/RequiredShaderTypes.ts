export type Uniforms = {
    chunkOffset: WebGLUniformLocation | null
    cameraProjection: WebGLUniformLocation | null
    cameraRotation: WebGLUniformLocation | null
    cameraPosition: WebGLUniformLocation | null
    sunPosition: WebGLUniformLocation | null
    atlasCropWidth: WebGLUniformLocation | null
    atlasCropHeight: WebGLUniformLocation | null
}

export type Attributes = {
    vertexData: number
    blockData: number
    blockOffset: number
    vertexTexCoords: number
    faceTextureNZ: number
    faceTexturePZ: number
    faceTexturePY: number
    faceTextureNY: number
    faceTextureNX: number
    faceTexturePX: number
}