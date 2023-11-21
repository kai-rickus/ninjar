import { Scene, Physics } from 'phaser';
import { FinishingFlag }  from '../objects/finishing-flag';
import { Ninjar }         from '../objects/ninjar';
import { Controls }       from '../objects/controls';

export class MainScene extends Scene
{
    private static readonly _SKYBG_KEY       = 'sky';
    private static readonly _MOUNTAINBG_KEY  = 'mountain';
    private static readonly _GRASSLANDBG_KEY = 'grassland';
    private static readonly _GRASSTILE_KEY   = 'grasstile';

    private _player: Ninjar;
    private _finishingFlag: FinishingFlag;
    private _groundPlatforms: Physics.Arcade.StaticGroup;
    private _controls: Controls;

    constructor()
    {
        super( {
            key : 'MainScene'
        } );
    }

    preload()
    {
        this.load.image( MainScene._SKYBG_KEY, 'assets/images/sky.png' );
        this.load.image( MainScene._MOUNTAINBG_KEY, 'assets/images/mountain.png' );
        this.load.image( MainScene._GRASSLANDBG_KEY, 'assets/images/grassland.png' );
        this.load.image( MainScene._GRASSTILE_KEY, 'assets/tiles/green_34.png' );

        this._controls = new Controls();

        Ninjar.loadSpriteSheets( this );
        FinishingFlag.loadSpriteSheet( this );
    }

    create(): void
    {
        this.createBackground();

        this._player        = new Ninjar( 400, 520, this );
        this._finishingFlag = new FinishingFlag( 800, 520, this );

        const platforms = this.createPlatforms();

        this.physics.add.collider( this._player.spriteBody, platforms );
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms );
        this.physics.add.collider( this._finishingFlag.spriteBody, this._groundPlatforms );

        this.physics.add.collider( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel );

    }

    finishLevel()
    {
        /* TODO: add leveltransition */
        debugger
    }

    createBackground()
    {
        const sky = this.add.image( this.scale.width / 2, this.scale.height / 2, MainScene._SKYBG_KEY );
        sky.setScale( 4 );
        const mountain = this.add.image( this.scale.width / 2, this.scale.height / 2, MainScene._MOUNTAINBG_KEY );
        mountain.setScale( 4 );
        const grassland = this.add.image( this.scale.width / 2, this.scale.height / 2, MainScene._GRASSLANDBG_KEY );
        grassland.setScale( 4 );
    }

    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();

        this._groundPlatforms = this.physics.add.staticGroup( {
            key    : MainScene._GRASSTILE_KEY,
            repeat : 150,
            setXY  : { x : 0, y : 568, stepX : 15 }
        } );

        return platforms;
    }

    update()
    {
        /* TODO: soll beim dashen die jeweilige Höhe behalten */
        /* TODO: Beschleunigung einbauen */

        Ninjar.update();

        const ninjarVelocityY = this._player.spriteBody.body.velocity.y;
        const { pressedKeys } = this._controls;

        if ( pressedKeys.right )
        {
            this._player.spriteBody.setVelocityX( Ninjar.movementSpeedRight );
            this._player.spriteBody.setFlipX( false );
            this._player.spriteBody.anims.play( 'right', true );

            if ( pressedKeys.shift )
            {

                this._player.spriteBody.setX( this._player.spriteBody.x + Ninjar.dashDistanceRight );
                this._player.spriteBody.anims.play( 'dash' );
            }
        }else if ( pressedKeys.left )
        {
            this._player.spriteBody.setVelocityX( Ninjar.movementSpeedLeft );
            this._player.spriteBody.setFlipX( true );
            this._player.spriteBody.anims.play( 'left', true );

            if ( pressedKeys.shift )
            {
                this._player.spriteBody.setX( this._player.spriteBody.x + Ninjar.dashDistanceLeft );
                this._player.spriteBody.anims.play( 'dash' );
            }
        }else if ( pressedKeys.down )
        {
            this._player.spriteBody.body.setVelocityX( 0 );
            this._player.spriteBody.anims.play( 'crouch' );

        }else
        {
            this._player.spriteBody.setVelocityX( 0 );
            this._player.spriteBody.anims.play( 'idle' );
        }

        if ( this._player.spriteBody.body.touching.down && this._controls.pressedKeys.up && !pressedKeys.shift ||
            this._player.spriteBody.body.touching.down && this._controls.pressedKeys.spacebar && !pressedKeys.shift )
        {
            this._player.spriteBody.setVelocityY( Ninjar.jumpHeight );
            this._player.spriteBody.anims.play( 'jump' );
        }

        if ( !this._player.spriteBody.body.touching.down && !pressedKeys.shift )
        {
            this._player.spriteBody.anims.play( 'jump' );
        }

        if ( ninjarVelocityY > 50 && !pressedKeys.shift )
        {
            this._player.spriteBody.anims.play( 'fall' );
        }
    }
}

