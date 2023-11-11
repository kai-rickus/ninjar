import { Scene, Types, Physics } from 'phaser';
import { Ninjar }                from '../objects/ninjar';
import { Controls }                from '../objects/controls';

export class MainScene extends Scene
{
    private static readonly _SKYBG_KEY       = 'sky';
    private static readonly _MOUNTAINBG_KEY  = 'mountain';
    private static readonly _GRASSLANDBG_KEY = 'grassland';
    private static readonly _GRASSTILE_KEY   = 'grasstile';

    private _player: Ninjar;
    private _cursors: Types.Input.Keyboard.CursorKeys;
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

        Ninjar.loadSpriteSheets( this );
    }

    create(): void
    {
        this.createBackground();
        this._player = new Ninjar( 400, 520, this );
        this._controls = new Controls();

        const platforms = this.createPlatforms();

        this.physics.add.collider( this._player.spriteBody, platforms );
        this.physics.add.collider( this._player.spriteBody, this._groundPlatforms );

        this._cursors = this.input.keyboard.createCursorKeys();
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
        /* TODO: Steuerung besser/ effektiver handlen */
        /* TODO: spriteanimationen in der Ninjar-klasse handlen */

        const ninjarVelocityY = this._player.spriteBody.body.velocity.y;

        if ( this._cursors.right.isDown )
        {
            this._player.spriteBody.setVelocityX( 320 );
            this._player.spriteBody.setFlipX( false );
            this._player.spriteBody.anims.play( 'right', true );
        }else if ( this._cursors.left.isDown )
        {
            this._player.spriteBody.setVelocityX( -320 );
            this._player.spriteBody.setFlipX( true );
            this._player.spriteBody.anims.play( 'left', true );
        }else
        {
            this._player.spriteBody.setVelocityX( 0 );
            this._player.spriteBody.anims.play( 'idle' );
        }

        if ( this._player.spriteBody.body.touching.down && this._cursors.up.isDown ||
            this._player.spriteBody.body.touching.down && this._cursors.space.isDown )
        {
            this._player.spriteBody.setVelocityY( -200 );
            this._player.spriteBody.anims.play( 'jump' );
        }

        if ( !this._player.spriteBody.body.touching.down )
        {
            this._player.spriteBody.anims.play( 'jump' );
        }

        if ( ninjarVelocityY > 25 )
        {
            this._player.spriteBody.anims.play( 'fall' );
        }
    }
}
