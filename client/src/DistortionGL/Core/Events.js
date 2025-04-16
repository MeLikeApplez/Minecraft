import { generateUUID } from "../Math/MathUtils.js"

/**
 * @typedef {object} _Events
 */

/**
 * @template EventNameList
 * @type {_Events}
 * @module Events
 */
export default class Events {
    constructor() {
        this._listeners = new Map()
    }
    
    /**
     * @param {EventNameKey} eventName 
     */
    createEventDispatch(eventName) {
        this._listeners.set(eventName, [])
    
        return this
    }

    /**
     * @param {EventNameList} eventName 
     */
    removeEventDispatch(eventName) {
        this._listeners.delete(eventName)
    }

    /**
     * @param {EventNameList} eventName 
     * @param {any} data 
     * @returns {boolean}
     */
    dispatchEvent(eventName, data) {
        const group = this._listeners.get(eventName)

        if(!group) return false

        for(let i = 0; i < group.length; i++) {
            const listener = group[i]
            
            listener.callback(data)
        }

        return true
    }

    /**
     * @param {EventNameList} eventName 
     * @param {Function} callback
     * @returns {string | Error}
     */
    addEventListener(eventName, callback) {
        const group = this._listeners.get(eventName)

        if(!group) return new Error(`Unable to find event eventName: "${eventName}"`)
        if(typeof callback !== 'function') return new Error('Callback function is required!')

        const uuid = generateUUID()
        
        group.push({ uuid, callback })

        return uuid
    }

    /**
     * @param {EventNameList} eventName 
     * @param {string} uuid 
     * @returns {true | Error}
     */
    removeEventListener(eventName, uuid) {
        const group = this._listeners.get(eventName)

        if(!group) return new Error(`Unable to find event eventName: "${eventName}"`)
        const index = group.findIndex(v => v.uuid === uuid)

        if(index === -1) return new Error(`Unable to find listener function with uuid: "${uuid}"`)
    
        group.splice(index, 1)
        
        return true
    }
}