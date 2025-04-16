## Modules

<dl>
<dt><a href="#module_Events">Events</a> : <code><a href="#_Events">_Events</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#_Events">_Events</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="module_Events"></a>

## Events : [<code>\_Events</code>](#_Events)

* [Events](#module_Events) : [<code>\_Events</code>](#_Events)
    * [.createEventDispatch(eventName)](#module_Events+createEventDispatch)
    * [.removeEventDispatch(eventName)](#module_Events+removeEventDispatch)
    * [.dispatchEvent(eventName, data)](#module_Events+dispatchEvent) ⇒ <code>boolean</code>
    * [.addEventListener(eventName, callback)](#module_Events+addEventListener) ⇒ <code>string</code> \| <code>Error</code>
    * [.removeEventListener(eventName, uuid)](#module_Events+removeEventListener) ⇒ <code>true</code> \| <code>Error</code>

<a name="module_Events+createEventDispatch"></a>

### events.createEventDispatch(eventName)
**Kind**: instance method of [<code>Events</code>](#module_Events)  

| Param | Type |
| --- | --- |
| eventName | <code>EventNameKey</code> | 

<a name="module_Events+removeEventDispatch"></a>

### events.removeEventDispatch(eventName)
**Kind**: instance method of [<code>Events</code>](#module_Events)  

| Param | Type |
| --- | --- |
| eventName | <code>EventNameList</code> | 

<a name="module_Events+dispatchEvent"></a>

### events.dispatchEvent(eventName, data) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Events</code>](#module_Events)  

| Param | Type |
| --- | --- |
| eventName | <code>EventNameList</code> | 
| data | <code>any</code> | 

<a name="module_Events+addEventListener"></a>

### events.addEventListener(eventName, callback) ⇒ <code>string</code> \| <code>Error</code>
**Kind**: instance method of [<code>Events</code>](#module_Events)  

| Param | Type |
| --- | --- |
| eventName | <code>EventNameList</code> | 
| callback | <code>function</code> | 

<a name="module_Events+removeEventListener"></a>

### events.removeEventListener(eventName, uuid) ⇒ <code>true</code> \| <code>Error</code>
**Kind**: instance method of [<code>Events</code>](#module_Events)  

| Param | Type |
| --- | --- |
| eventName | <code>EventNameList</code> | 
| uuid | <code>string</code> | 

<a name="_Events"></a>

## \_Events : <code>object</code>
**Kind**: global typedef  
