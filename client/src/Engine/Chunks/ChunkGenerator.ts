// https://github.com/jwagner/simplex-noise.js
import { createNoise2D, createNoise3D } from 'simplex-noise'
import alea from 'alea'
import Chunk from './Chunk.js'
import { clamp } from '../../DistortionGL/Math/MathUtils.js'

export default class ChunkGenerator {
   static GenerateSimplexNoise(seed: string | null, chunk: Chunk, offsetX: number, offsetZ: number, amplitude=3, frequency=0.03) {
        const generatedSeed = typeof seed !== 'string' ? undefined : alea(seed)
        const noise3D = createNoise3D(generatedSeed)
        const noise2D = createNoise2D(generatedSeed)

        let index = 0
        for(let z = 0; z < Chunk.LENGTH; z++) {
            for(let y = 0; y < Chunk.HEIGHT; y++) {
                for(let x = 0; x < Chunk.WIDTH; x++) {
                    // const inside = Math.round(noise3D((x + offsetX) * frequency, y * frequency, (z + offsetZ) * frequency) * amplitude) + amplitude
                    const surface = Math.round(noise2D((x + offsetX) * frequency, (z + offsetZ) * frequency) * amplitude) + amplitude

                    if(y >= Chunk.HEIGHT - surface) {
                        chunk.blockIds[index] = 0
                    } else if(y < (Chunk.HEIGHT - amplitude * 3)) {
                        chunk.blockIds[index] = 3   
                    } else if(y === Chunk.HEIGHT - surface - 1) {
                        chunk.blockIds[index] = 2
                    }

                    index++
                }
            }
        }

    }
}

