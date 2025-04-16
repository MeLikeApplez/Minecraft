## Modules

<dl>
<dt><a href="#module_Euler">Euler</a> : <code><a href="#_Euler">_Euler</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_Euler">_Euler</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_Euler"></a>

## Euler : [<code>\_Euler</code>](#_Euler)

* [Euler](#module_Euler) : [<code>\_Euler</code>](#_Euler)
    * [module.exports](#exp_module_Euler--module.exports) ⏏
        * [new module.exports(x, y, z)](#new_module_Euler--module.exports_new)
        * [.set(x, y, z, [order])](#module_Euler--module.exports+set)
        * [.setFromQuaternion(quaternion)](#module_Euler--module.exports+setFromQuaternion)
        * [.setFromRotationMatrix(matrix4)](#module_Euler--module.exports+setFromRotationMatrix)
        * [.reorder(order)](#module_Euler--module.exports+reorder)
        * [.copy(euler)](#module_Euler--module.exports+copy)

<a name="exp_module_Euler--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Euler--module.exports_new"></a>

#### new module.exports(x, y, z)

| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> | <code>0</code> | 
| y | <code>number</code> | <code>0</code> | 
| z | <code>number</code> | <code>0</code> | 

<a name="module_Euler--module.exports+set"></a>

#### module.exports.set(x, y, z, [order])
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Euler--module.exports)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 
| [order] | <code>string</code> | 

<a name="module_Euler--module.exports+setFromQuaternion"></a>

#### module.exports.setFromQuaternion(quaternion)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Euler--module.exports)  

| Param | Type |
| --- | --- |
| quaternion | <code>Quaternion</code> | 

<a name="module_Euler--module.exports+setFromRotationMatrix"></a>

#### module.exports.setFromRotationMatrix(matrix4)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Euler--module.exports)  

| Param | Type |
| --- | --- |
| matrix4 | <code>Matrix4</code> | 

<a name="module_Euler--module.exports+reorder"></a>

#### module.exports.reorder(order)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Euler--module.exports)  

| Param | Type |
| --- | --- |
| order | <code>string</code> | 

<a name="module_Euler--module.exports+copy"></a>

#### module.exports.copy(euler)
**Kind**: instance method of [<code>module.exports</code>](#exp_module_Euler--module.exports)  

| Param | Type |
| --- | --- |
| euler | <code>Euler</code> | 

<a name="_Euler"></a>

## \_Euler : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 
| z | <code>number</code> | 
| order | <code>string</code> | 

