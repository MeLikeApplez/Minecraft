enum STATES {
    EMPTY,
    SOLID,
    PARTIAL_SOLID,
    TRANSPARENT,
    LIQUID,
    ENTITY,
}

export default class Block {
    static CUBE_VERTICES = new Float32Array([
        0, 0, 0,
        0, 0, 1,
        1, 0, 0,

        0, 0, 1,
        1, 0, 1,
        1, 0, 0,
    ])

    static FACE_VERTICES = new Float32Array([
        0, 0, 0,
        0, 0, 1,
        1, 0, 0,
        
        0, 0, 1,
        1, 0, 1,
        1, 0, 0,
    ])
    
    constructor() {
       
    }

}