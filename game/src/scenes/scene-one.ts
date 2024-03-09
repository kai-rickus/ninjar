import { Scene, Physics }              from "phaser"
import { FinishingFlag }               from "../objects/finishing-flag"
import { Ninjar }                      from "../objects/ninjar"
import { WASD_CONTROLS, WASDControls } from "../objects/controls"

export class SceneOne extends Scene
{
    private static readonly _BACKGROUND_KEY    = "grassland"
    private static readonly _DIRT_TILE_ONE_KEY = "grasstile"
    private static readonly _WARNING_SIGN_KEY  = "warning"

    private _player: Ninjar
    private _finishingFlag: FinishingFlag
    private _controls: WASDControls
    private _PlatformSpawnY = 560
    private _SpawnY         = this._PlatformSpawnY - 55
    private tilesX          = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
    private _platformSpawnX = 0

    constructor()
    {
        super( {
            key : "MainScene"
        } )
    }

    preload()
    {
        this.load.image( SceneOne._BACKGROUND_KEY, "assets/images/backgrounds/kitchen-background-straight.png" )
        this.load.image( SceneOne._DIRT_TILE_ONE_KEY, "assets/tiles/dirt_1.png" )
        this.load.image( SceneOne._WARNING_SIGN_KEY, "assets/signs/warning.png" )
        this.load.audio( "scene_1", "assets/audio/themes/scene_1.mp3" )

        this._controls = this.input.keyboard.addKeys( WASD_CONTROLS ) as WASDControls

        Ninjar.loadSpriteSheets( this )
        FinishingFlag.loadSpriteSheet( this )
        Ninjar.loadAudioCues( this )
    }

    create(): void
    {
        this.createBackground()

        // this.handleLevelTheme()

        this._player        = new Ninjar( 400, this._SpawnY, this, this._controls )
        this._finishingFlag = new FinishingFlag( 1200, this._SpawnY - 50, this )

        this.addCollisions()

        this.physics.add.overlap( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel, undefined, this )

    }

    handleLevelTheme()
    {
        const levelTheme = this.sound.add( "scene_1" ) // 'theme' should match the key used in preload
        levelTheme.play()
        levelTheme.setVolume( 0.1 )
    }

    addCollisions()
    {
        const platforms = this.createPlatforms()
        const signs = this.createSigns()

        this.physics.add.collider( this._player.spriteBody, platforms )
        this.physics.add.collider( this._finishingFlag.spriteBody, platforms )
    }

    finishLevel( context, )
    {
        /* TODO: add leveltransition */
        /* TODO: dem level-controller die Steuerung der level handlen lassen  */

        this.scene.start( "SceneTwo" )
    }

    createBackground()
    {
        const grassland = this.add.image( this.scale.width / 2, this.scale.height / 2, SceneOne._BACKGROUND_KEY )
        grassland.setScale( 1.4, 1 )
    }

    // TODO: Level designen - Löcher und Klippen einbauen
    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup()

        // const platforms = this.physics.add.staticGroup( {
        //         key    : SceneOne._DIRT_TILE_ONE_KEY,
        //         repeat : 76,
        //         setXY  : { x : 100, y : this._PlatformSpawnY, stepX : 15 }
        //     }
        // )
        // TODO: erzeugen der tiles verbessern

        for ( const tilex in this.tilesX )
        {
            console.log( this._platformSpawnX )
            platforms.create( this._platformSpawnX, this._PlatformSpawnY, SceneOne._DIRT_TILE_ONE_KEY )
            this._platformSpawnX = this._platformSpawnX + 32
        }

        this._platformSpawnX = 800
        for ( const tilex in this.tilesX )
        {
            console.log( this._platformSpawnX )
            platforms.create( this._platformSpawnX, this._PlatformSpawnY - 60, SceneOne._DIRT_TILE_ONE_KEY )
            this._platformSpawnX = this._platformSpawnX + 32
        }

        // platforms.create( 200, 500, SceneOne._DIRT_TILE_ONE_KEY ).setScale(2, 3).refreshBody()
        // platforms.create( 300, 600, SceneOne._DIRT_TILE_ONE_KEY )

        return platforms
    }

    createSigns()
    {
        const signs = this.physics.add.staticGroup()

        signs.create( 610, this._PlatformSpawnY - 30, SceneOne._WARNING_SIGN_KEY, ).setScale( 1.5 )

    }

    update()
    {
        this._player.update()
    }
}

