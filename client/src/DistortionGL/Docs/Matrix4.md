<a name="module_Matrix4"></a>

## Matrix4

* [Matrix4](#module_Matrix4)
    * [.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44)](#module_Matrix4+set)
    * [.setFromMatrix4(matrix)](#module_Matrix4+setFromMatrix4)
    * [.makeTranslation(x, y, z)](#module_Matrix4+makeTranslation)
    * [.translate(x, y, z)](#module_Matrix4+translate)
    * [.makeScale(x, y, z)](#module_Matrix4+makeScale)
    * [.makeRotationX(theta)](#module_Matrix4+makeRotationX)
    * [.makeRotationY(theta)](#module_Matrix4+makeRotationY)
    * [.makeRotationZ(theta)](#module_Matrix4+makeRotationZ)
    * [.makeRotationFromEuler(euler)](#module_Matrix4+makeRotationFromEuler)
    * [.makeRotationFromQuaternion(quaternion)](#module_Matrix4+makeRotationFromQuaternion)
    * [.multiply(matrix)](#module_Matrix4+multiply)
    * [.multiplyScalar(scale)](#module_Matrix4+multiplyScalar)
    * [.copy(matrix)](#module_Matrix4+copy)

<a name="module_Matrix4+set"></a>

### matrix4.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| n11 | <code>Number</code> | 
| n12 | <code>Number</code> | 
| n13 | <code>Number</code> | 
| n14 | <code>Number</code> | 
| n21 | <code>Number</code> | 
| n22 | <code>Number</code> | 
| n23 | <code>Number</code> | 
| n24 | <code>Number</code> | 
| n31 | <code>Number</code> | 
| n32 | <code>Number</code> | 
| n33 | <code>Number</code> | 
| n34 | <code>Number</code> | 
| n41 | <code>Number</code> | 
| n42 | <code>Number</code> | 
| n43 | <code>Number</code> | 
| n44 | <code>Number</code> | 

<a name="module_Matrix4+setFromMatrix4"></a>

### matrix4.setFromMatrix4(matrix)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| matrix | <code>Matrix4</code> | 

<a name="module_Matrix4+makeTranslation"></a>

### matrix4.makeTranslation(x, y, z)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| x | <code>Number</code> | 
| y | <code>Number</code> | 
| z | <code>Number</code> | 

<a name="module_Matrix4+translate"></a>

### matrix4.translate(x, y, z)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| x | <code>Number</code> | 
| y | <code>Number</code> | 
| z | <code>Number</code> | 

<a name="module_Matrix4+makeScale"></a>

### matrix4.makeScale(x, y, z)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| x | <code>Number</code> | 
| y | <code>Number</code> | 
| z | <code>Number</code> | 

<a name="module_Matrix4+makeRotationX"></a>

### matrix4.makeRotationX(theta)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| theta | <code>Number</code> | 

<a name="module_Matrix4+makeRotationY"></a>

### matrix4.makeRotationY(theta)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| theta | <code>Number</code> | 

<a name="module_Matrix4+makeRotationZ"></a>

### matrix4.makeRotationZ(theta)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| theta | <code>Number</code> | 

<a name="module_Matrix4+makeRotationFromEuler"></a>

### matrix4.makeRotationFromEuler(euler)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| euler | <code>Euler</code> | 

<a name="module_Matrix4+makeRotationFromQuaternion"></a>

### matrix4.makeRotationFromQuaternion(quaternion)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| quaternion | <code>Quaternion</code> | 

<a name="module_Matrix4+multiply"></a>

### matrix4.multiply(matrix)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| matrix | <code>Matrix4</code> | 

<a name="module_Matrix4+multiplyScalar"></a>

### matrix4.multiplyScalar(scale)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| scale | <code>Number</code> | 

<a name="module_Matrix4+copy"></a>

### matrix4.copy(matrix)
**Kind**: instance method of [<code>Matrix4</code>](#module_Matrix4)  

| Param | Type |
| --- | --- |
| matrix | <code>Matrix4</code> | 

