/**
 * @typedef {Object} Shader
 * @property {string | null} vertexCode
 * @property {string | null} shaderCode
 * @property {WebGLProgram | null} program
 * @property {boolean} ready
 * @property {Error | null} error
 */

/**
 * @type {Shader}
 * @template {Record<string, WebGLUniformLocation | null>} Uniforms
 * @template {Record<string, number>} Attributes
 * @module Shader
 */
export default class Shader {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name || 'Shader'

        this.vertexCode = null
        this.shaderCode = null

        /**
         * @type {Uniforms}
         */
        this.uniforms = {}

        /**
         * @type {Attributes}
         */
        this.attributes = {}

        this.program = null

        this.preloaded = false
        this.ready = false
        this.error = null
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {Array<Shader>} shaders 
     * @param {boolean} throwError 
     * @returns {{ shaders: Array<Shader>, success: boolean, error: Error | null }}  
     */
    static loadAllPreloadedShaders(gl, shaders, throwError=false) {
        const result = {
            shaders: shaders,
            success: false,
            error: null
        }

        for(let i = 0; i < shaders.length; i++) {
            const shader = shaders[i]

            if(shader.ready) continue

            shader.loadSourceCode(gl)

            if(shader.error && throwError) throw shader.error
            if(shader.error) {
                result.success = false
                result.error = shader.error
                
                return result
            }
        }

        result.success = true

        return result
    }

    /**
     * @param {string} vertexCode 
     * @param {string} shaderCode 
     * @returns {Shader}
     */
    preloadSourceCode(vertexCode, shaderCode) {
        this.vertexCode = vertexCode
        this.shaderCode = shaderCode

        this.preloaded = true

        return this
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string} vertexCode 
     * @param {string} shaderCode 
     * @returns {Array<WebGLProgram | null, Error | null>}
     */
    compileSourceCode(gl, vertexCode, shaderCode) {
        // setup and compile glsl vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, vertexCode)
        gl.compileShader(vertexShader)

        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const compileError = gl.getShaderInfoLog(vertexShader)

            return [null, new  Error(`[Vertex Shader]: "${compileError}"`)]
        }

        // setup and compile fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, shaderCode)
        gl.compileShader(fragmentShader)

        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const compileError = gl.getShaderInfoLog(fragmentShader)

            return [null, new  Error(`[Fragment Shader]: "${compileError}"`)]
        }

        // create and attach program
        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const compileError = gl.getProgramInfoLog(program)

            return [null, new  Error(`[Link Shader]: "${compileError}"`)]
        }

        for(const key in this.uniforms) {
            const uniformLocation = gl.getUniformLocation(program, key)
            
            this.uniforms[key] = uniformLocation
        }

        
        for(const key in this.attributes) {
            const attributeLocation = gl.getAttribLocation(program, key)
            
            this.attributes[key] = attributeLocation
        }

        return [program, null]
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string=} vertexCode 
     * @param {string=} shaderCode 
     * @returns {Array<WebGLProgram | null, Error | null>}
     */
    loadSourceCode(gl, vertexCode, shaderCode) {
        if(this.preloaded && !vertexCode && !shaderCode) {
            vertexCode = this.vertexCode
            shaderCode = this.shaderCode
        }

        const [ program, error ] = this.compileSourceCode(gl, vertexCode, shaderCode)
        
        this.program = error ? null : program
        this.ready = error === null
        this.error = error

        return [program, error]
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string} [vertexSrc=] 
     * @param {string} [shaderSrc=] 
     * @returns {Array<WebGLProgram | null, Error | null>}
     */
    async fetch(gl, vertexSrc, shaderSrc) {
        if(!(gl instanceof WebGL2RenderingContext)) {
            this.ready = false
         
            return [null, new  Error('No WebGL2 context provided!')]
        }

        let [ vertexRespone, shaderResponse ] = await Promise.all([
            fetch(vertexSrc),
            fetch(shaderSrc)
        ])
        
        if(!vertexRespone.ok) {
            this.ready = false
            
            return [null, new  Error('Vertex Source failed to load!')]
        }
        
        if(!shaderResponse.ok) {
            this.ready = false
            
            return [null, new  Error('Fragment Source failed to load!')]
        }

        const [ vertexCode, shaderCode ] = await Promise.all([
            vertexRespone.text(),
            shaderResponse.text()
        ])

        return this.loadSourceCode(gl, vertexCode, shaderCode)
    }
}