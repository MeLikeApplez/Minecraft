## Modules

<dl>
<dt><a href="#module_Keyboard">Keyboard</a> : <code><a href="#_Keyboard">_Keyboard</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#KeyboardEvents">KeyboardEvents</a> : <code>&#x27;onkeydown&#x27;</code> | <code>&#x27;onkeyup&#x27;</code></dt>
<dd></dd>
<dt><a href="#_Keyboard">_Keyboard</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Keyboard"></a>

## Keyboard : [<code>\_Keyboard</code>](#_Keyboard)

* [Keyboard](#module_Keyboard) : [<code>\_Keyboard</code>](#_Keyboard)
    * [module.exports](#exp_module_Keyboard--module.exports) ⏏
        * [new module.exports(element, [lowerCase])](#new_module_Keyboard--module.exports_new)
        * [.load(element)](#module_Keyboard--module.exports+load)

<a name="exp_module_Keyboard--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Keyboard--module.exports_new"></a>

#### new module.exports(element, [lowerCase])

| Param | Type | Default |
| --- | --- | --- |
| element | <code>HTMLElement</code> |  | 
| [lowerCase] | <code>boolean</code> | <code>false</code> | 

<a name="module_Keyboard--module.exports+load"></a>

#### module.exports.load(element)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Keyboard--module.exports)  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="KeyboardEvents"></a>

## KeyboardEvents : <code>&#x27;onkeydown&#x27;</code> \| <code>&#x27;onkeyup&#x27;</code>
**Kind**: global typedef  
<a name="_Keyboard"></a>

## \_Keyboard : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| element | <code>HTMLElement</code> \| <code>null</code> | 
| keys | <code>Set</code> | 
| lowerCase | <code>boolean</code> | 
| events | [<code>Events.&lt;KeyboardEvents&gt;</code>](#KeyboardEvents) | 

