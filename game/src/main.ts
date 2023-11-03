import { Game as PhaserGame, Types } from 'phaser';
import { CONFIG }                    from './config';

declare const BUILD_TARGET: string;

class Game extends PhaserGame
{
    constructor( config: Types.Core.GameConfig )
    {
        super( config );
    }
}

const game = new Game( CONFIG );
