// https://www.reddit.com/r/Blockbench/comments/1c1eq92/is_there_any_website_where_i_can_find_basic/
// https://github.com/Mojang/bedrock-samples
// https://minecraft.fandom.com/wiki/Blocks.png-atlas

import Block from "./Block"

export default class Blocks {
    // cube order:
    static LIST = [
        new Block(
            'air', Block.TRANSPARENT,
            [31, 31],
        ),
        new Block(
            'dirt_block', Block.SOLID, 
            [8, 5],
        ),
        new Block(
            'grass_block', Block.SOLID, 
            [1, 10, 1, 10, 4, 10, 8, 5, 1, 10, 1, 10],
        ),
        new Block(
            'stone_block', Block.SOLID, 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ),
        new Block(
            'missing_block', Block.SOLID,
            [31, 17],
        )
    ]

    /**
     * @param {string} name
     *  @param {boolean} [useMissingBlockFallback=false] 
     * @returns {Block | null}
     */
    static findBlockByName(name, useMissingBlockFallback=false) {
        const index = BLOCK_LIST.findIndex(b => b.name === name)

        if(index === -1) return useMissingBlockFallback ? BLOCK_LIST[BLOCK_LIST.length - 1] : null

        return BLOCK_LIST[index]
    }
}