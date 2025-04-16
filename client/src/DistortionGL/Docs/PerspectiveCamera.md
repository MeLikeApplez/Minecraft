## Modules

<dl>
<dt><a href="#module_PerspectiveCamera">PerspectiveCamera</a> : <code><a href="#_PerspectiveCamera">_PerspectiveCamera</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_PerspectiveCamera">_PerspectiveCamera</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_PerspectiveCamera"></a>

## PerspectiveCamera : [<code>\_PerspectiveCamera</code>](#_PerspectiveCamera)

* [PerspectiveCamera](#module_PerspectiveCamera) : [<code>\_PerspectiveCamera</code>](#_PerspectiveCamera)
    * [module.exports](#exp_module_PerspectiveCamera--module.exports) ⏏
        * [new module.exports(fov, aspect, near, far)](#new_module_PerspectiveCamera--module.exports_new)
        * [.lookAt(target, up)](#module_PerspectiveCamera--module.exports+lookAt)
        * [.render(gl, program, uniformPositionLocation, uniformProjectionMatrixLocation, uniformRotationLocation)](#module_PerspectiveCamera--module.exports+render)

<a name="exp_module_PerspectiveCamera--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_PerspectiveCamera--module.exports_new"></a>

#### new module.exports(fov, aspect, near, far)

| Param | Type |
| --- | --- |
| fov | <code>number</code> | 
| aspect | <code>number</code> | 
| near | <code>number</code> | 
| far | <code>number</code> | 

<a name="module_PerspectiveCamera--module.exports+lookAt"></a>

#### module.exports.lookAt(target, up)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_PerspectiveCamera--module.exports)  

| Param | Type | Default |
| --- | --- | --- |
| target | <code>Vector3</code> |  | 
| up | <code>Vector3</code> | <code></code> | 

<a name="module_PerspectiveCamera--module.exports+render"></a>

#### module.exports.render(gl, program, uniformPositionLocation, uniformProjectionMatrixLocation, uniformRotationLocation)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_PerspectiveCamera--module.exports)  

| Param | Type |
| --- | --- |
| gl | <code>WebGL2RenderingContext</code> | 
| program | <code>WebGLProgram</code> | 
| uniformPositionLocation | <code>WebGLUniformLocation</code> \| <code>null</code> | 
| uniformProjectionMatrixLocation | <code>WebGLUniformLocation</code> \| <code>null</code> | 
| uniformRotationLocation | <code>WebGLUniformLocation</code> \| <code>null</code> | 

<a name="_PerspectiveCamera"></a>

## \_PerspectiveCamera : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| fov | <code>number</code> | 
| aspect | <code>number</code> | 
| near | <code>number</code> | 
| far | <code>number</code> | 
| target | <code>Vector3</code> | 

