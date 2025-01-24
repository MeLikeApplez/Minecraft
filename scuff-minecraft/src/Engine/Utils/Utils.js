/**
     * @param {Array | ArrayBuffer} array 
     * @param {number} size 
     * @return {Array | ArrayBuffer}
     */
export function extendArrayBuffer(array, size) {
    const ArrayType = array.constructor
    const arrayCopy = new ArrayType(array.length * size)

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < array.length; j++) {
            arrayCopy[(array.length * i) + j] = array[j]
        }
    }

    return arrayCopy
}

/**
 * @param {ArrayBuffer} positions 
 * @param {number} size 
 * @param {Float32Array?} floatArray
 */
export function createUVCoordinates(positions, size, floatArray=null) {
    const uv = floatArray === null ? new Float32Array(positions.length * size) : floatArray

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < positions.length; j++) {
            uv[(i * positions.length) + j] = positions[j]
        }
    }

    return uv
}