import * as Phaser   from 'phaser';
import { Types }     from 'phaser';
import { MainScene } from '../scenes/MainScene';

export class Ninjar
{
    get spriteBody(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    {
        return this._spriteBody;
    }

    private static readonly _RUN_KEY  = 'ninjar_run';
    private static readonly _IDLE_KEY = 'ninjar_idle';
    private static readonly _JUMP_KEY = 'ninjar_jump';
    private static readonly _FALL_KEY = 'ninjar_fall';
    private static readonly _DASH_KEY = 'ninjar_dash';

    private _spriteBody: Types.Physics.Arcade.SpriteWithDynamicBody;

    public constructor( x: number, y: number, scene: MainScene )
    {
        this._spriteBody = scene.physics.add.sprite( x, y, Ninjar._IDLE_KEY );
        this._spriteBody.setBounce( 0 );
        this._spriteBody.setCollideWorldBounds( true );

        scene.anims.create( {
            key       : 'left',
            frames    : scene.anims.generateFrameNumbers( Ninjar._RUN_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } );

        scene.anims.create( {
            key       : 'right',
            frames    : scene.anims.generateFrameNumbers( Ninjar._RUN_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } );
        scene.anims.create( {
            key       : 'idle',
            frames    : scene.anims.generateFrameNumbers( Ninjar._IDLE_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } );
        scene.anims.create( {
            key       : 'jump',
            frames    : scene.anims.generateFrameNumbers( Ninjar._JUMP_KEY, { start : 0, end : 2 } ),
            repeat    : 0,
            frameRate : 20,
        } );
        scene.anims.create( {
            key       : 'fall',
            frames    : scene.anims.generateFrameNumbers( Ninjar._FALL_KEY, { start : 0, end : 2 } ),
            repeat    : 0,
            frameRate : 20,
        } );
        scene.anims.create( {
            key       : 'dash',
            frames    : scene.anims.generateFrameNumbers( Ninjar._DASH_KEY, { start : 0, end : 1 } ),
            repeat    : 0,
            frameRate : 20,
        } );
    }

    public static loadSpriteSheets( scene: MainScene )
    {
        scene.load.spritesheet( Ninjar._RUN_KEY,
            'assets/spritesheets/player/run.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._IDLE_KEY,
            'assets/spritesheets/player/idle.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._JUMP_KEY,
            'assets/spritesheets/player/jump.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._FALL_KEY,
            'assets/spritesheets/player/fall.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._DASH_KEY,
            'assets/spritesheets/player/dash.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
    }
}
