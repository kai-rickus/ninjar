import { Scene, Physics }              from 'phaser';
import { FinishingFlag }               from '../objects/finishing-flag';
import { Ninjar }                      from '../objects/ninjar';
import { WASD_CONTROLS, WASDControls } from '../objects/controls';

export class MainScene extends Scene
{
    private static readonly _SKYBG_KEY       = 'sky';
    private static readonly _MOUNTAINBG_KEY  = 'mountain';
    private static readonly _GRASSLANDBG_KEY = 'grassland';
    private static readonly _GRASSTILE_KEY   = 'grasstile';

    private _player: Ninjar;
    private _finishingFlag: FinishingFlag;
    private _groundPlatforms: Physics.Arcade.StaticGroup;
    private _controls: WASDControls;
    private _PlatformSpawnY = 560;
    private _SpawnY         = this._PlatformSpawnY - 50;

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

        this._controls = this.input.keyboard.addKeys( WASD_CONTROLS ) as WASDControls;

        Ninjar.loadSpriteSheets( this );
        FinishingFlag.loadSpriteSheet( this );
    }

    create(): void
    {
        this.createBackground();

        this._player        = new Ninjar( 400, this._SpawnY, this, this._controls );
        this._finishingFlag = new FinishingFlag( 800, this._SpawnY, this );

        this.addCollisions();

        this.physics.add.overlap( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel, undefined, this );

    }

    addCollisions()
    {
        const platforms = this.createPlatforms();

        this.physics.add.collider( this._player.spriteBody, platforms );
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms );
        this.physics.add.collider( this._finishingFlag.spriteBody, this._groundPlatforms );
    }

    finishLevel( context, )
    {
        /* TODO: add leveltransition */
        /* TODO: dem level-controller die Steuerung der level handlen lassen  */

        this.scene.start( 'SceneTwo' );
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
            setXY  : { x : 0, y : this._PlatformSpawnY, stepX : 15 }
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

