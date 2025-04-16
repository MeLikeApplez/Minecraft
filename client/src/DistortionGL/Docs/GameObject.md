## Modules

<dl>
<dt><a href="#module_GameObject">GameObject</a> : <code><a href="#_GameObject">_GameObject</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_GameObject">_GameObject</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_GameObject"></a>

## GameObject : [<code>\_GameObject</code>](#_GameObject)

* [GameObject](#module_GameObject) : [<code>\_GameObject</code>](#_GameObject)
    * [module.exports](#exp_module_GameObject--module.exports) ⏏
        * [new module.exports(material)](#new_module_GameObject--module.exports_new)
        * [.dispose(gl, ...any)](#module_GameObject--module.exports+dispose)
        * [.update(gl, ...any)](#module_GameObject--module.exports+update)
        * [.render(gl, ...any)](#module_GameObject--module.exports+render)

<a name="exp_module_GameObject--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_GameObject--module.exports_new"></a>

#### new module.exports(material)

| Param | Type | Default |
| --- | --- | --- |
| material | <code>Material</code> \| <code>null</code> | <code></code> | 

<a name="module_GameObject--module.exports+dispose"></a>

#### module.exports.dispose(gl, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_GameObject--module.exports)  

| Param | Type |
| --- | --- |
| gl | <code>WebGL2RenderingContext</code> | 
| ...any | <code>\*</code> | 

<a name="module_GameObject--module.exports+update"></a>

#### module.exports.update(gl, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_GameObject--module.exports)  

| Param | Type |
| --- | --- |
| gl | <code>WebGL2RenderingContext</code> | 
| ...any | <code>\*</code> | 

<a name="module_GameObject--module.exports+render"></a>

#### module.exports.render(gl, ...any)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_GameObject--module.exports)  

| Param | Type |
| --- | --- |
| gl | <code>WebGL2RenderingContext</code> | 
| ...any | <code>\*</code> | 

<a name="_GameObject"></a>

## \_GameObject : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| uuid | <code>string</code> | 
| type | <code>GameObjectType</code> | 
| material | <code>Material</code> \| <code>null</code> | 
| position | <code>Vector3</code> | 
| rotation | <code>Euler</code> | 
| autoUpdate | <code>boolean</code> | 
| needsUpdate | <code>boolean</code> | 

