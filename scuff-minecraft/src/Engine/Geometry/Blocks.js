// https://www.reddit.com/r/Blockbench/comments/1c1eq92/is_there_any_website_where_i_can_find_basic/
// https://github.com/Mojang/bedrock-samples
// https://minecraft.fandom.com/wiki/Blocks.png-atlas
export const BLOCK_LIST =  [
    'stone_block',
    'dirt_block',
    'grass_block',
]

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
export const BLOCK_VERTICES = new Uint8Array([
    //  front
    0, 0, 1,
    0, 1, 1,
    1, 0, 1,
    
    0, 1, 1,
    1, 1, 1,
    1, 0, 1,

    // back
    1, 0, 0,
    1, 1, 0,
    0, 0, 0,
    
    1, 1, 0,
    0, 1, 0,
    0, 0, 0,

    // top
    0, 0, 0,
    0, 0, 1,
    1, 0, 0,
    
    0, 0, 1,
    1, 0, 1,
    1, 0, 0,

    // bottom
    0, 1, 1,
    0, 1, 0,
    1, 1, 1,
    
    0, 1, 0,
    1, 1, 0,
    1, 1, 1,

    // right
    1, 0, 1,
    1, 1, 1,
    1, 0, 0,
    
    1, 1, 1,
    1, 1, 0,
    1, 0, 0,
    
    // left
    0, 0, 0,
    0, 1, 0,
    0, 0, 1,
    
    0, 1, 0,
    0, 1, 1,
    0, 0, 1,
])