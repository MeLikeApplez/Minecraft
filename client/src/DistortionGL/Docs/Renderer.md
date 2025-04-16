## Modules

<dl>
<dt><a href="#module_Renderer">Renderer</a> : <code><a href="#_Renderer">_Renderer</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_Renderer">_Renderer</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Renderer"></a>

## Renderer : [<code>\_Renderer</code>](#_Renderer)

* [Renderer](#module_Renderer) : [<code>\_Renderer</code>](#_Renderer)
    * [module.exports](#exp_module_Renderer--module.exports) ⏏
        * [new module.exports(canvasElement)](#new_module_Renderer--module.exports_new)
        * [.setSize(width, height, [devicePixelRatio])](#module_Renderer--module.exports+setSize)
        * [.loadScene(scene)](#module_Renderer--module.exports+loadScene)
        * [.render(...any)](#module_Renderer--module.exports+render)

<a name="exp_module_Renderer--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Renderer--module.exports_new"></a>

#### new module.exports(canvasElement)

| Param | Type |
| --- | --- |
| canvasElement | <code>HTMLCanvasElement</code> | 

<a name="module_Renderer--module.exports+setSize"></a>

#### module.exports.setSize(width, height, [devicePixelRatio])
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Renderer--module.exports)  

| Param | Type | Default |
| --- | --- | --- |
| width | <code>number</code> |  | 
| height | <code>number</code> |  | 
| [devicePixelRatio] | <code>number</code> | <code>1</code> | 

<a name="module_Renderer--module.exports+loadScene"></a>

#### module.exports.loadScene(scene)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Renderer--module.exports)  

| Param | Type |
| --- | --- |
| scene | <code>Scene</code> | 

<a name="module_Renderer--module.exports+render"></a>

#### module.exports.render(...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Renderer--module.exports)  

| Param | Type |
| --- | --- |
| ...any | <code>any</code> | 

<a name="_Renderer"></a>

## \_Renderer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| scene | <code>Scene</code> \| <code>null</code> | 
| canvasElement | <code>HTMLCanvasElement</code> | 
| devicePixelRatio | <code>number</code> | 

