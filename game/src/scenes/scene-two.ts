import { Scene, Physics }              from "phaser"
import { FinishingFlag }               from "../objects/finishing-flag"
import { Ninjar }                      from "../objects/ninjar"
import { WASD_CONTROLS, WASDControls } from "../objects/controls"
import { SceneOne }                    from "./scene-one"

export class SceneTwo extends Scene
{
    private static readonly _BACKGROUND_KEY    = "background"
    private static readonly _DIRT_TILE_ONE_KEY = "grasstile"
    private static readonly _SPIKE_TRAP_KEY    = "spike"

    private _player: Ninjar
    private _finishingFlag: FinishingFlag
    private _groundPlatforms: Physics.Arcade.StaticGroup
    private _trapGroup: Physics.Arcade.StaticGroup
    private _controls: WASDControls
    private _PlatformSpawnY = 560
    private _SpawnY         = this._PlatformSpawnY - 50

    constructor()
    {
        super( {
            key : "SceneTwo"
        } )
    }

    preload()
    {

        this.load.image( SceneTwo._BACKGROUND_KEY, "assets/images/backgrounds/kitchen-background.png" )
        this.load.image( SceneTwo._DIRT_TILE_ONE_KEY, "assets/tiles/dirt_1.png" )
        this.load.image( SceneTwo._SPIKE_TRAP_KEY, "assets/traps/spike.png" )

        this._controls = this.input.keyboard.addKeys( WASD_CONTROLS ) as WASDControls

        FinishingFlag.loadSpriteSheet( this )
        Ninjar.loadSpriteSheets( this )
        Ninjar.loadAudioCues( this )
    }

    create(): void
    {
        this.createBackground()

        this.createTraps()

        this._player        = new Ninjar( 400, this._SpawnY, this, this._controls )
        this._finishingFlag = new FinishingFlag( 800, this._SpawnY, this )

        this.addCollisions()

    }

    addCollisions()
    {
        const platforms = this.createPlatforms()

        this.physics.add.collider( this._player.spriteBody, platforms )
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms )
        this.physics.add.collider( this._finishingFlag.spriteBody, this._groundPlatforms )

        this.physics.add.overlap( this._player.spriteBody, this._trapGroup, this.showGameOverScreen, undefined, this )
        this.physics.add.overlap( this._player.spriteBody, this._finishingFlag.spriteBody, this.finishLevel )
    }

    finishLevel()
    {
        // loading next level
    }

    showGameOverScreen(){
        // this.scene.start( "GameOver" )
        this.scene.start( "GameOver" )
    }

    createBackground()
    {
        const background = this.add.image( this.scale.width / 2, this.scale.height / 2, SceneTwo._BACKGROUND_KEY )
        background.setScale( 1.5, 1 )
    }

    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup()

        this._groundPlatforms = this.physics.add.staticGroup( {
            key    : SceneTwo._DIRT_TILE_ONE_KEY,
            repeat : 150,
            setXY  : { x : 0, y : 568, stepX : 15 }
        } )

        return platforms
    }

    createTraps()
    {
        const traps = this.physics.add.staticGroup()

        this._trapGroup = this.physics.add.staticGroup( {
            key    : SceneTwo._SPIKE_TRAP_KEY,
            repeat : 10,
            setXY  : { x : 8, y : 545, stepX : 16 }
        } )

        return traps

    }

    update()
    {
        this._player.update()
    }
}

