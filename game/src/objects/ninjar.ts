import * as Phaser   from 'phaser';
import { Types }     from 'phaser';
import { MainScene } from '../scenes/MainScene';
import { Controls }  from '../objects/controls';

export class Ninjar
{
    get spriteBody(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    {
        return this._spriteBody;
    }

    /* TODO: dashrichtung von bewegungsvector abhängig machen (Dann auch solo-dash ohne bewegung möglich) */
    /* TODO: dashdauer erstellen */

    public static readonly dashDistanceRight  = 10;
    public static readonly dashDistanceLeft   = -10;
    public static readonly movementSpeedRight = 320;
    public static readonly movementSpeedLeft  = -320;
    public static readonly jumpHeight         = -200;

    private static readonly _RUN_KEY    = 'ninjar_run';
    private static readonly _IDLE_KEY   = 'ninjar_idle';
    private static readonly _JUMP_KEY   = 'ninjar_jump';
    private static readonly _FALL_KEY   = 'ninjar_fall';
    private static readonly _DASH_KEY   = 'ninjar_dash';
    private static readonly _CROUCH_KEY = 'ninjar_crouch';

    private _controls: Controls;
    private _spriteBody: Types.Physics.Arcade.SpriteWithDynamicBody;

    public constructor( x: number, y: number, scene: MainScene )
    {
        this._spriteBody = scene.physics.add.sprite( x, y, Ninjar._IDLE_KEY );
        this._spriteBody.setBounce( 0 );
        this._spriteBody.setCollideWorldBounds( true );
        this._controls = new Controls();

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
            repeat    : -1,
            frameRate : 20,
        } );
        scene.anims.create( {
            key       : 'crouch',
            frames    : scene.anims.generateFrameNumbers( Ninjar._CROUCH_KEY, { start : 0, end : 0 } ),
            repeat    : -1,
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
        scene.load.spritesheet( Ninjar._CROUCH_KEY,
            'assets/spritesheets/player/crouch.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
    }

    static update()
    {
        /* TODO: eigene animationen handlen */
        // const ninjarVelocityY        = this._player.spriteBody.body.velocity.y;
        // const dashKeyPressedDuration = this._cursors.shift.getDuration();
        // const { pressedKeys }        = _controls;

        //     if ( pressedKeys.right )
        //     {
        //         this._player.spriteBody.setVelocityX( Ninjar.movementSpeedRight );
        //         this._player.spriteBody.setFlipX( false );
        //         this._player.spriteBody.anims.play( 'right', true );
        //
        //         if ( this._cursors.shift.isDown )
        //         {
        //             if ( dashKeyPressedDuration > Ninjar.dashDuration )
        //             {
        //                 return;
        //             }
        //
        //             this._player.spriteBody.setX( this._player.spriteBody.x + Ninjar.dashDistanceRight );
        //             this._player.spriteBody.anims.play( 'dash' );
        //         }
        //     }else if ( pressedKeys.left )
        //     {
        //         this._player.spriteBody.setVelocityX( Ninjar.movementSpeedLeft );
        //         this._player.spriteBody.setFlipX( true );
        //         this._player.spriteBody.anims.play( 'left', true );
        //
        //         if ( this._cursors.shift.isDown )
        //         {
        //             if ( dashKeyPressedDuration > Ninjar.dashDuration )
        //             {
        //                 return;
        //             }
        //
        //             this._player.spriteBody.setX( this._player.spriteBody.x + Ninjar.dashDistanceLeft );
        //             this._player.spriteBody.anims.play( 'dash' );
        //         }
        //     }else if ( pressedKeys.down )
        //     {
        //         this._player.spriteBody.body.setVelocityX( 0 );
        //         this._player.spriteBody.anims.play( 'crouch' );
        //
        //     }else
        //     {
        //         this._player.spriteBody.setVelocityX( 0 );
        //         this._player.spriteBody.anims.play( 'idle' );
        //     }
        //
        //     if ( this._player.spriteBody.body.touching.down && this._controls.pressedKeys.up ||
        //         this._player.spriteBody.body.touching.down && this._controls.pressedKeys.spacebar )
        //     {
        //         this._player.spriteBody.setVelocityY( Ninjar.jumpHeight );
        //         this._player.spriteBody.anims.play( 'jump' );
        //     }
        //
        //     if ( !this._player.spriteBody.body.touching.down )
        //     {
        //         this._player.spriteBody.anims.play( 'jump' );
        //     }
        //
        //     if ( ninjarVelocityY > 50 )
        //     {
        //         this._player.spriteBody.anims.play( 'fall' );
        //     }
        // }
    }
}
