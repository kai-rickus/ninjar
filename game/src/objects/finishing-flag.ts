import { MainScene }    from '../scenes/MainScene';
import { Scene, Types } from 'phaser';

export class FinishingFlag
{
    get spriteBody(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    {
        return this._spriteBody;
    }

    private static readonly _FLAG_MOVEMENT = 'finishing-flag';
    private readonly _spriteBody: Types.Physics.Arcade.SpriteWithDynamicBody;

    public constructor( x: number, y: number, scene: Scene )
    {
        this._spriteBody = scene.physics.add.sprite( x, y, FinishingFlag._FLAG_MOVEMENT );
        this._spriteBody.setBounce( 0 );
        this._spriteBody.setCollideWorldBounds( true );

        scene.anims.create( {
            key       : 'move',
            frames    : scene.anims.generateFrameNumbers( FinishingFlag._FLAG_MOVEMENT ),
            repeat    : -1,
            frameRate : 10
        } );

        this._spriteBody.anims.play( 'move' );
    }

    static loadSpriteSheet( scene )
    {
        scene.load.spritesheet( FinishingFlag._FLAG_MOVEMENT,
            'assets/spritesheets/level/finishing-flag.png',
            {
                frameWidth : 60, frameHeight : 60
            }
        );
    }
}
