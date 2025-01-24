/**
 * @typedef {Object} ShaderType
 * @property {WebGLProgram | null} program
 */

/**
 * @type {ShaderType}
 */
export default class Shader {
    /**
     * @param {string} name 
     * @param {WebGL2RenderingContext} gl 
     * @param {string=} vertexCode 
     * @param {string=} shaderCode 
     */
    constructor(name, gl, vertexCode, shaderCode) {
        this.name = name || 'Shader'

        this.program = null

        this.ready = false
        this.error = null

        if(gl && vertexCode && shaderCode) {
            this.loadSourceCode(gl, vertexCode, shaderCode)
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string} vertexCode 
     * @param {string} shaderCode 
     * @returns {[WebGLProgram | null, Error | null]}
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

        return [program, null]
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string} vertexCode 
     * @param {string} shaderCode 
     * @returns {[WebGLProgram | null, Error | null]}
     */
    loadSourceCode(gl, vertexCode, shaderCode) {
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
     * @returns {[WebGLProgram | null, Error | null]}
     */
    async load(gl, vertexSrc, shaderSrc) {
        if(!(gl instanceof WebGL2RenderingContext)) {
            this.ready = false
         
            return [null, new  Error('No WebGL2 context provided!')]
        }

        let [ vertexRespone, shaderResponse ] = await Promise.all([
            fetch(this.vertexSrc),
            fetch(this.shaderSrc)
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