## Modules

<dl>
<dt><a href="#module_Pointer">Pointer</a> : <code><a href="#_Pointer">_Pointer</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#PointerEvents">PointerEvents</a> : <code>&#x27;onpointerdown&#x27;</code> | <code>&#x27;onpointermove&#x27;</code> | <code>&#x27;onpointerup&#x27;</code></dt>
<dd></dd>
<dt><a href="#_Pointer">_Pointer</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Pointer"></a>

## Pointer : [<code>\_Pointer</code>](#_Pointer)

* [Pointer](#module_Pointer) : [<code>\_Pointer</code>](#_Pointer)
    * [module.exports](#exp_module_Pointer--module.exports) ⏏
        * [new module.exports(element, [devicePixelRatio])](#new_module_Pointer--module.exports_new)
        * [.load(element)](#module_Pointer--module.exports+load)

<a name="exp_module_Pointer--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Pointer--module.exports_new"></a>

#### new module.exports(element, [devicePixelRatio])

| Param | Type | Default |
| --- | --- | --- |
| element | <code>HTMLElement</code> |  | 
| [devicePixelRatio] | <code>number</code> | <code>1</code> | 

<a name="module_Pointer--module.exports+load"></a>

#### module.exports.load(element)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Pointer--module.exports)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="PointerEvents"></a>

## PointerEvents : <code>&#x27;onpointerdown&#x27;</code> \| <code>&#x27;onpointermove&#x27;</code> \| <code>&#x27;onpointerup&#x27;</code>
**Kind**: global typedef  
<a name="_Pointer"></a>

## \_Pointer : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 
| position | <code>Vector2</code> | 
| down | <code>Vector2</code> | 
| drag | <code>Vector2</code> | 
| offset | <code>Vector2</code> | 
| isPointerDragging | <code>boolean</code> | 
| isPointerDown | <code>boolean</code> | 
| isPointerUp | <code>boolean</code> | 
| devicePixelRatio | <code>number</code> | 
| events | [<code>Events.&lt;PointerEvents&gt;</code>](#PointerEvents) | 

