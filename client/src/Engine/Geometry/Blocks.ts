// https://www.reddit.com/r/Blockbench/comments/1c1eq92/is_there_any_website_where_i_can_find_basic/
// https://github.com/Mojang/bedrock-samples
// https://minecraft.wiki/w/Textures-atlas

import Block from "./Block"

export default class Blocks {
    // cube order:
    static LIST = [
        new Block(
            'air', Block.States.TRANSPARENT,
            [31, 31],
        ),
        new Block(
            'dirt_block', Block.States.SOLID, 
            [8, 5],
        ),
        new Block(
            'grass_block', Block.States.SOLID, 
            [1, 10, 1, 10, 0, 18, 8, 5, 1, 10, 1, 10],
        ),
        new Block(
            'stone_block', Block.States.SOLID, 
            [19, 7],
        ),
        new Block(
            'missing_block', Block.States.SOLID,
            [31, 17],
        )
    ]

    static findBlockByName(name: string, useMissingBlockFallback=false) {
        const index = Blocks.LIST.findIndex(b => b.name === name)

        if(index === -1) return useMissingBlockFallback ? Blocks.LIST[Blocks.LIST.length - 1] : null

        return Blocks.LIST[index]
    }
}