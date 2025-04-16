## Modules

<dl>
<dt><a href="#module_Scene">Scene</a> : <code><a href="#_Scene">_Scene</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_Scene">_Scene</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Scene"></a>

## Scene : [<code>\_Scene</code>](#_Scene)

* [Scene](#module_Scene) : [<code>\_Scene</code>](#_Scene)
    * [module.exports](#exp_module_Scene--module.exports) ⏏
        * [new module.exports(camera)](#new_module_Scene--module.exports_new)
        * [.add(...sceneObjects)](#module_Scene--module.exports+add)
        * [.dispose(renderer, ...any)](#module_Scene--module.exports+dispose)
        * [.load(renderer, ...any)](#module_Scene--module.exports+load)
        * [.unload(renderer, ...any)](#module_Scene--module.exports+unload)
        * [.render(renderer, ...any)](#module_Scene--module.exports+render)

<a name="exp_module_Scene--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Scene--module.exports_new"></a>

#### new module.exports(camera)

| Param | Type |
| --- | --- |
| camera | <code>Camera</code> | 

<a name="module_Scene--module.exports+add"></a>

#### module.exports.add(...sceneObjects)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Scene--module.exports)  

| Param | Type |
| --- | --- |
| ...sceneObjects | <code>GameObject</code> | 

<a name="module_Scene--module.exports+dispose"></a>

#### module.exports.dispose(renderer, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Scene--module.exports)  

| Param | Type |
| --- | --- |
| renderer | <code>Renderer</code> | 
| ...any | <code>\*</code> | 

<a name="module_Scene--module.exports+load"></a>

#### module.exports.load(renderer, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Scene--module.exports)  

| Param | Type |
| --- | --- |
| renderer | <code>Renderer</code> | 
| ...any | <code>\*</code> | 

<a name="module_Scene--module.exports+unload"></a>

#### module.exports.unload(renderer, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Scene--module.exports)  

| Param | Type |
| --- | --- |
| renderer | <code>Renderer</code> | 
| ...any | <code>\*</code> | 

<a name="module_Scene--module.exports+render"></a>

#### module.exports.render(renderer, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Scene--module.exports)  

| Param | Type |
| --- | --- |
| renderer | <code>Renderer</code> | 
| ...any | <code>\*</code> | 

<a name="_Scene"></a>

## \_Scene : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| camera | <code>Camera</code> | 
| objects | <code>Array.&lt;GameObject&gt;</code> | 
| shaders | <code>Object.&lt;string, Shader&gt;</code> | 
| enabled | <code>boolean</code> | 

