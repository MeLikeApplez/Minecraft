// https://github.com/jwagner/simplex-noise.js
import { createNoise2D, createNoise3D } from 'simplex-noise'
import alea from 'alea'
import Chunk from './Chunk.js'
import { clamp } from '../Utils/Utils.js'

export default class ChunkGenerator {
    /**
     * @param {string?} seed 
     * @param {number} offsetX
     * @param {number} offsetZ
     * @param {number} amplitude
     * @param {number} frequency  
     */
   static GenerateSimplexNoise(seed, offsetX, offsetZ, amplitude=3, frequency=0.03) {
       const noise = createNoise2D(typeof seed !== 'string' ? undefined : alea(seed))
       const buffer = new Int32Array(Chunk.WIDTH * Chunk.LENGTH)
   
       let index = 0

        for(let z = 0; z < Chunk.LENGTH; z++) {
            for(let x = 0; x < Chunk.WIDTH; x++) {
                const height = Math.round(noise((x + offsetX) * frequency, (z + offsetZ) * frequency) * amplitude) + amplitude
                
                buffer[index] = height

                index++
            }
        }
       
       return buffer
    }
}

