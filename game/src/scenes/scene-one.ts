import { Scene, Physics }              from "phaser"
import { FinishingFlag }               from "../objects/finishing-flag"
import { Ninjar }                      from "../objects/ninjar"
import { WASD_CONTROLS, WASDControls } from "../objects/controls"

export class SceneOne extends Scene
{
    private static readonly _SKYBG_KEY      = "sky"
    private static readonly _MOUNTAINBG_KEY = "mountain"
    private static readonly _BACKGROUND_KEY = "grassland"
    private static readonly _GRASSTILE_KEY  = "grasstile"

    private _player: Ninjar
    private _finishingFlag: FinishingFlag
    private _groundPlatforms: Physics.Arcade.StaticGroup
    private _controls: WASDControls
    private _PlatformSpawnY = 560
    private _SpawnY         = this._PlatformSpawnY - 50
    private jump_cue

    constructor()
    {
        super( {
            key : "MainScene"
        } )
    }

    preload()
    {
        this.load.image( SceneOne._BACKGROUND_KEY, "assets/images/backgrounds/kitchen-background-straight.png" )
        this.load.image( SceneOne._GRASSTILE_KEY, "assets/tiles/green_34.png" )
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
        this._finishingFlag = new FinishingFlag( 800, this._SpawnY, this )

        this.addCollisions()

        // this.physics.add.overlap( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel, undefined, this )

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

        this.physics.add.collider( this._player.spriteBody, platforms )
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms )
        this.physics.add.collider( this._finishingFlag.spriteBody, this._groundPlatforms )
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

        this._groundPlatforms = this.physics.add.staticGroup( {
                key    : SceneOne._GRASSTILE_KEY,
                repeat : 76,
                setXY  : { x : 100, y : this._PlatformSpawnY, stepX : 15 }
            }
        )

        return platforms
    }

    update()
    {
        this._player.update()
    }
}

