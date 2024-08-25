import { WASD_CONTROLS, WASDControls } from "../objects/controls"
import { Scene }              from "phaser"

export class Credits extends Scene
{
    private _buttons: Phaser.GameObjects.Image[] = []
    private _selectedButtonIndex                 = 0
    private _buttonSelectorCursor!: Phaser.GameObjects.Image

    constructor( private _controls: WASDControls, private _scene: Scene )
    {
        super( {
            key : "Credits"
        } )
    }

    preload()
    {
        this.load.image( "glass-panel", "assets/buttons/scroll-button.png" )
        this.load.image( "cursor-hand", "assets/cursors/menu-cursor.png" )
        this.load.image( "ninjar-logo", "assets/game-logos/ninjar_main-screen.png" )
        this.load.audio( "menu-change", "assets/audio/menu/menu-change.mp3" )
        this.load.audio( "menu-select", "assets/audio/menu/menu-select.mp3" )

        this._controls = this.input.keyboard.addKeys( WASD_CONTROLS ) as WASDControls

    }

    create()
    {
        const buttonWidth          = 200
        const buttonHeight         = 75
        const centeredTextValue    = 0.5
        const centeredButtonWidth  = 0.5
        const centeredButtonHeight = 0.6
        const cursorScale          = 0.4
        const buttonGap            = 10
        const playButtonText       = "CREDITS"
        const settingsButtonText   = "CREDITS"
        const creditsButtonText    = "CREDITS"
        const { width, height }    = this.scale

        this.cameras.main.setBackgroundColor( "#B2D8FF" )

        const playButton = this.add.image( width * centeredButtonWidth, height * centeredButtonHeight, "glass-panel" )
                               .setDisplaySize( buttonWidth, buttonHeight )

        this.add.text( playButton.x, playButton.y, playButtonText )
            .setOrigin( centeredTextValue )

        const settingsButton = this.add.image( playButton.x, playButton.y + playButton.displayHeight + buttonGap, "glass-panel" )
                                   .setDisplaySize( buttonWidth, buttonHeight )

        this.add.text( settingsButton.x, settingsButton.y, settingsButtonText )
            .setOrigin( centeredTextValue )

        const creditsButton = this.add.image( settingsButton.x, settingsButton.y + settingsButton.displayHeight + buttonGap, "glass-panel" )
                                  .setDisplaySize( buttonWidth, buttonHeight )

        this.add.text( creditsButton.x, creditsButton.y, creditsButtonText )
            .setOrigin( centeredTextValue )

        this._buttons.push( playButton )
        this._buttons.push( settingsButton )
        this._buttons.push( creditsButton )

        this._buttonSelectorCursor = this.add.image( 0, 0, "cursor-hand" ).setScale( cursorScale )

        this.selectButton( 0 )

        playButton.on( "selected", () =>
        {
            console.log( "play" )
            this.startLevelOne()
        } )

        settingsButton.on( "selected", () =>
        {
            // todo: settings implementieren
            console.log( "settings" )
        } )

        creditsButton.on( "selected", () =>
        {
            // todo: credits implementieren
            console.log( "credits" )
        } )
    }

    startLevelOne()
    {
        this.scene.start( "SceneOne" )
    }

    selectButton( index: number )
    {
        const currentButtonTint = 0xffffff
        const buttonTint        = 0x05bfed
        const currentButton     = this._buttons[ this._selectedButtonIndex ]

        currentButton.setTint( currentButtonTint )

        const button = this._buttons[ index ]

        button.setTint( buttonTint )

        this._buttonSelectorCursor.x = button.x + button.displayWidth * 0.5
        this._buttonSelectorCursor.y = button.y + 10

        this._selectedButtonIndex = index

    }

    selectNextButton( change = 1 )
    {
        let index = this._selectedButtonIndex + change
        this.handleAudioCues( "menu-change" )

        if ( index >= this._buttons.length )
        {
            index = 0
        }
        else if ( index < 0 )
        {
            index = this._buttons.length - 1
        }
        this.selectButton( index )
    }

    confirmSelection()
    {
        this.handleAudioCues( "menu-select" )
        const button = this._buttons[ this._selectedButtonIndex ]

        button.emit( "selected" )
    }

    handleAudioCues( Cue: string )
    {
        const menuChange = this.sound.add( "menu-change" )
        const menuSelect = this.sound.add( "menu-select" )

        if ( Cue === "menu-change" )
        {
            menuChange.setVolume( 0.1 )
            menuChange.play()
        }
        else if ( Cue === "menu-select" )
        {
            menuSelect.setVolume( 1 )
            menuSelect.play()
        }
    }

    update()
    {
        const { w, s, space } = this._controls

        if ( w.isDown )
        {
            w.reset()
            this.selectNextButton( -1 )
        }
        else if ( s.isDown )
        {
            s.reset()
            this.selectNextButton( 1 )
        }
        else if ( space.isDown )
        {
            space.reset()
            this.confirmSelection()
        }

    }
}