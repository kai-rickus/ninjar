import { Scene, Physics }              from 'phaser';
import { WASD_CONTROLS, WASDControls } from '../objects/controls';
import { FinishingFlag }               from '../objects/finishing-flag';
import { Ninjar }                      from '../objects/ninjar';

export class SceneTwo extends Scene
{
    private static readonly _BACKGROUND_KEY = 'background';
    private static readonly _GRASSTILE_KEY  = 'grasstile';

    private _player: Ninjar;
    private _finishingFlag: FinishingFlag;
    private _groundPlatforms: Physics.Arcade.StaticGroup;
    private _controls: WASDControls;
    private _PlatformSpawnY = 560;
    private _SpawnY         = this._PlatformSpawnY - 50;

    constructor()
    {
        super( {
            key : 'SceneTwo'
        } );
    }

    preload()
    {

        this.load.image( SceneTwo._BACKGROUND_KEY, 'assets/images/pixel-background.jpg' );

        this._controls = this.input.keyboard.addKeys( WASD_CONTROLS ) as WASDControls;

        FinishingFlag.loadSpriteSheet( this );
        Ninjar.loadSpriteSheets( this );
    }

    create(): void
    {
        console.log( this );
        this.createBackground();

        this._player        = new Ninjar( 400, this._SpawnY, this, this._controls );
        this._finishingFlag = new FinishingFlag( 800, this._SpawnY, this );

        console.log( this._player );
        this.addCollisions();

    }

    addCollisions()
    {
        const platforms = this.createPlatforms();

        this.physics.add.collider( this._player.spriteBody, platforms );
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms );
        this.physics.add.collider( this._finishingFlag.spriteBody, this._groundPlatforms );

        this.physics.add.overlap( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel );
    }

    finishLevel()
    {
        console.log( 'scene two: goal touched' );
    }

    createBackground()
    {
        const background = this.add.image( this.scale.width / 2, this.scale.height / 2, SceneTwo._BACKGROUND_KEY );
        background.setScale( 0.5, 0.5 );
    }

    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();

        this._groundPlatforms = this.physics.add.staticGroup( {
            key    : SceneTwo._GRASSTILE_KEY,
            repeat : 150,
            setXY  : { x : 0, y : 568, stepX : 15 }
        } );

        return platforms;
    }

    update()
    {
        /* TODO: soll beim dashen die jeweilige Höhe behalten */
        /* TODO: Beschleunigung einbauen */

        this._player.update();
    }
}

