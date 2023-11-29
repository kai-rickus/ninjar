import * as Phaser      from 'phaser';
import { Scene, Types } from 'phaser';
import { WASDControls } from './controls';

export class Ninjar
{
    get spriteBody(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    {
        return this._spriteBody;
    }

    /* TODO: dashrichtung von bewegungsvector abhängig machen (Dann auch solo-dash ohne bewegung möglich) */
    /* TODO: dashdauer erstellen */

    public static readonly DASH_VELOCITY  = 1500;
    public static readonly MOVEMENT_SPEED = 320;
    public static readonly JUMP_HEIGHT    = -200;
    private static readonly _RUN_KEY      = 'ninjar_run';
    private static readonly _IDLE_KEY     = 'ninjar_idle';
    private static readonly _JUMP_KEY     = 'ninjar_jump';
    private static readonly _FALL_KEY     = 'ninjar_fall';
    private static readonly _DASH_KEY     = 'ninjar_dash';
    private static readonly _CROUCH_KEY   = 'ninjar_crouch';

    private readonly _spriteBody: Types.Physics.Arcade.SpriteWithDynamicBody;
    private _dashDirection = 'right';
    private _allowedToDash = true;

    public constructor( x: number, y: number, scene: Scene, private _controls: WASDControls )
    {
        this._spriteBody = scene.physics.add.sprite( x, y, Ninjar._IDLE_KEY );
        this._spriteBody.setBounce( 0 );
        this._spriteBody.setCollideWorldBounds( true );

        this._spriteBody.setSize( 40, 80 );

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

    public static loadSpriteSheets( scene: Scene )
    {
        scene.load.setPath( 'assets/spritesheets/player/' );

        scene.load.spritesheet( Ninjar._RUN_KEY,
            'run.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._IDLE_KEY,
            'idle.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._JUMP_KEY,
            'jump.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._FALL_KEY,
            'fall.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._DASH_KEY,
            'dash.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
        scene.load.spritesheet( Ninjar._CROUCH_KEY,
            'crouch.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );

        scene.load.setPath();
    }

    public update()
    {
        const ninjarVelocityY              = this.spriteBody.body.velocity.y;
        const { w, a, s, d, shift, space } = this._controls;

        if ( d.isDown )
        {
            this._dashDirection = 'right';
            this.spriteBody.setVelocityX( Ninjar.MOVEMENT_SPEED );
            this.spriteBody.setFlipX( false );
            this.spriteBody.anims.play( 'right', true );

        }else if ( a.isDown )
        {
            this._dashDirection = 'left';
            this.spriteBody.setVelocityX( -Ninjar.MOVEMENT_SPEED );
            this.spriteBody.setFlipX( true );
            this.spriteBody.anims.play( 'left', true );

        }else if ( s.isDown )
        {
            this.spriteBody.body.setVelocityX( 0 );
            this.spriteBody.anims.play( 'crouch' );

        }else
        {
            this.spriteBody.setVelocityX( 0 );
            this.spriteBody.anims.play( 'idle' );
        }

        if ( this.spriteBody.body.touching.down && w.isDown && !shift.isDown ||
            this.spriteBody.body.touching.down && space.isDown && !shift.isDown )
        {
            this.spriteBody.setVelocityY( Ninjar.JUMP_HEIGHT );
            this.spriteBody.anims.play( 'jump' );
        }

        if ( !this.spriteBody.body.touching.down && !shift.isDown )
        {
            this.spriteBody.anims.play( 'jump' );
        }

        if ( ninjarVelocityY > 50 && !shift.isDown )
        {
            this.spriteBody.anims.play( 'fall' );
        }
        if ( shift.isDown )
        {
            this.handleDash( this._dashDirection );
        }
    }

    handleDash( dashDirection )
    {
        /* TODO: dash-cooldown */
        console.log( this.spriteBody.body.touching.none );
        const dashDuration = this._controls.shift.getDuration();

        if ( dashDuration >= 300 )
        {
            return;
        }
        if ( !this._allowedToDash )
        {
            return;
        }

        if ( dashDirection === 'right' )
        {
            this.spriteBody.setVelocityX( Ninjar.DASH_VELOCITY );
            this.spriteBody.anims.play( 'dash' );

        }else if ( dashDirection === 'left' )
        {
            this.spriteBody.setVelocityX( -Ninjar.DASH_VELOCITY );
            this.spriteBody.anims.play( 'dash' );
        }
    }
}
