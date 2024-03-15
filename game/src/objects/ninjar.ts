import { Scene, Types, Input } from "phaser"
import { WASDControls }        from "./controls"
import { NinjarStateMachine }  from "./ninjar-state-machine"

type DashDirection = "left" | "right"

export class Ninjar
{
    get spriteBody(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    {
        return this._spriteBody
    }

    public static readonly DASH_VELOCITY                    = 1500
    public static readonly MOVEMENT_SPEED                   = 320
    public static readonly JUMP_HEIGHT                      = -200
    private static readonly _RUN_KEY                        = "ninjar_run"
    private static readonly _IDLE_KEY                       = "ninjar_idle"
    private static readonly _JUMP_KEY                       = "ninjar_jump"
    private static readonly _FALL_KEY                       = "ninjar_fall"
    private static readonly _DASH_KEY                       = "ninjar_dash"
    private static readonly _CROUCH_KEY                     = "ninjar_crouch"
    private static readonly _JUMP_CUE                       = "jump_cue"
    private static readonly _SPRITE_RIGHT_MOVEMENT_OFFSET_X = 45
    private static readonly _SPRITE_RIGHT_MOVEMENT_OFFSET_Y = 43
    private static readonly _SPRITE_LEFT_MOVEMENT_OFFSET_X  = 60
    private static readonly _SPRITE_LEFT_MOVEMENT_OFFSET_Y  = 43
    private static readonly _SPRITE_OFFSET_Y                = 43

    private readonly _spriteBody: Types.Physics.Arcade.SpriteWithDynamicBody
    private _dashDirection: DashDirection = "right"
    private _allowedToDash                = true
    private _states                       = new NinjarStateMachine()
    private _jumpCue

    public constructor( x: number, y: number, private _scene: Scene, private _controls: WASDControls )
    {
        this._spriteBody = _scene.physics.add.sprite( x, y, Ninjar._IDLE_KEY )
        this._spriteBody.setBounce( 0 )
        this._spriteBody.setCollideWorldBounds( true )

        this._spriteBody.setSize( 15, 35 )

        this._spriteBody.body.setOffset( 40, 40 )

        _scene.anims.create( {
            key       : "left",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._RUN_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } )
        _scene.anims.create( {
            key       : "right",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._RUN_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } )
        _scene.anims.create( {
            key       : "idle",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._IDLE_KEY, { start : 0, end : 9 } ),
            repeat    : -1,
            frameRate : 20
        } )
        _scene.anims.create( {
            key       : "jump",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._JUMP_KEY, { start : 0, end : 2 } ),
            repeat    : 0,
            frameRate : 20,
        } )
        _scene.anims.create( {
            key       : "fall",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._FALL_KEY, { start : 0, end : 2 } ),
            repeat    : 0,
            frameRate : 20,
        } )
        _scene.anims.create( {
            key       : "dash",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._DASH_KEY, { start : 0, end : 1 } ),
            repeat    : -1,
            frameRate : 20,
        } )
        _scene.anims.create( {
            key       : "crouch",
            frames    : _scene.anims.generateFrameNumbers( Ninjar._CROUCH_KEY, { start : 0, end : 0 } ),
            repeat    : -1,
            frameRate : 20,
        } )

        this._states.activateState( "idling" )
    }

    public static loadSpriteSheets( scene: Scene )
    {
        scene.load.setPath( "assets/spritesheets/player/" )

        scene.load.spritesheet( Ninjar._RUN_KEY,
            "run.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )
        scene.load.spritesheet( Ninjar._IDLE_KEY,
            "idle.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )
        scene.load.spritesheet( Ninjar._JUMP_KEY,
            "jump.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )
        scene.load.spritesheet( Ninjar._FALL_KEY,
            "fall.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )
        scene.load.spritesheet( Ninjar._DASH_KEY,
            "dash.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )
        scene.load.spritesheet( Ninjar._CROUCH_KEY,
            "crouch.png",
            {
                frameWidth : 120, frameHeight : 80
            }
        )

        scene.load.setPath()
    }

    public static loadAudioCues( scene: Scene )
    {
        scene.load.audio( "jump", "assets/audio/jump.mp3" )
        scene.load.audio( "dash", "assets/audio/dash.mp3" )
    }

    handleAudioCues( scene: Scene, Cue: string )
    {

        const jumpCue = scene.sound.add( "jump" )
        const dashCue = scene.sound.add( "dash" )

        if ( Cue === "jumpCue" )
        {
            jumpCue.play()
            jumpCue.setVolume( 0.2 )
        }
        else if ( Cue === "dashCue" )
        {
            dashCue.play()
            dashCue.setVolume( 0.1 )
        }
    }

    public update()
    {
        const ninjarVelocityY              = this.spriteBody.body.velocity.y
        const { w, a, s, d, shift, space } = this._controls
        const isInAir                      = this.spriteBody.body.touching.none

        if ( d.isDown && !this._states.isActive( "dashing" ) )
        {
            this._spriteBody.body.setOffset( Ninjar._SPRITE_RIGHT_MOVEMENT_OFFSET_X, Ninjar._SPRITE_OFFSET_Y )

            this._dashDirection = "right"
            this.spriteBody.setVelocityX( Ninjar.MOVEMENT_SPEED )
            this.spriteBody.setFlipX( false )
            this.spriteBody.anims.play( "right", true )

        }
        else if ( a.isDown && !this._states.isActive( "dashing" ) )
        {
            this._spriteBody.body.setOffset( Ninjar._SPRITE_LEFT_MOVEMENT_OFFSET_X, Ninjar._SPRITE_OFFSET_Y )

            this._dashDirection = "left"
            this.spriteBody.setVelocityX( -Ninjar.MOVEMENT_SPEED )
            this.spriteBody.setFlipX( true )
            this.spriteBody.anims.play( "left", true )

        }
        else if ( s.isDown && !this._states.isActive( "dashing" ) )
        {
            this.spriteBody.body.setVelocityX( 0 )
            this.spriteBody.anims.play( "crouch" )
        }
        else
        {
            if ( !this._states.isActive( "dashing" ) )
            {
                this.spriteBody.setVelocityX( 0 )
                this.spriteBody.anims.play( "idle" )
            }
        }

        if ( this.spriteBody.body.touching.down && w.isDown && !shift.isDown ||
            this.spriteBody.body.touching.down && space.isDown && !shift.isDown )
        {
            this.spriteBody.setVelocityY( Ninjar.JUMP_HEIGHT )
            this.spriteBody.anims.play( "jump" )

            this.handleAudioCues( this._scene, "jumpCue" )
        }

        if ( !this.spriteBody.body.touching.down && !shift.isDown )
        {
            this.spriteBody.anims.play( "jump" )
        }

        if ( this.spriteBody.body.touching.down )
        {
            this._allowedToDash = true
        }
        if ( ninjarVelocityY > 50 && !shift.isDown )
        {
            this.spriteBody.anims.play( "fall" )
        }
        if (
            shift.isDown
            && Input.Keyboard.JustDown( shift )
            && this._allowedToDash
            && !this._states.isActive( "dashing" )
        )
        {
            this.dash( this._dashDirection )
        }
    }

    // TODO: Wenn der Spieler gegen einen Block dashed, dafür sorgen, dass er nicht in diesem stecken bleibt
    dash( dashDirection: DashDirection )
    {
        this._states.activateState( "dashing" )
        this._allowedToDash = false

        this.handleAudioCues( this._scene, "dashCue" )

        const distance               = 200
        const { x : oldX, y : oldY } = this.spriteBody
        const dashVelocity           = dashDirection === "right" ? Ninjar.DASH_VELOCITY : -Ninjar.DASH_VELOCITY

        this.spriteBody.setGravityY( -this._scene.physics.config.gravity.y )
        this.spriteBody.anims.play( "dash" )
        this.spriteBody.setVelocity( dashVelocity, 0 )

        const onUpdate = () =>
        {
            const { x, y } = this.spriteBody
            if (
                !( dashDirection === "right" && oldX + distance <= x )
                && !( dashDirection === "left" && oldX - distance >= x )
            ) return

            this.spriteBody.setGravityY( 0 )
            this.spriteBody.anims.stop()
            this._states.deactivateState( "dashing" )
            this._scene.events.off( "update", onUpdate )
        }

        this._scene.events.on( "update", onUpdate )
    }
}
