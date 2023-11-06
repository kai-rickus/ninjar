import { Scene, GameObjects } from 'phaser';
import { Ninjar }             from '../objects/ninjar';

export class MainScene extends Scene
{
    public image: GameObjects.Image;
    public ninjar: Ninjar;

    private SKYBG_KEY       = 'sky';
    private MOUNTAINBG_KEY  = 'mountain';
    private GRASSLANDBG_KEY = 'grassland';
    private GRASSTILE_KEY   = 'grasstile';
    private PLAYER_KEY      = 'ninjar';
    private player;
    private playerRun;
    private cursors;
    private groundPlatform;

    constructor()
    {
        super( {
            key : 'MainScene'
        } );
    }

    preload()
    {
        this.load.image( this.SKYBG_KEY, 'assets/images/sky.png' );
        this.load.image( this.MOUNTAINBG_KEY, 'assets/images/mountain.png' );
        this.load.image( this.GRASSLANDBG_KEY, 'assets/images/grassland.png' );
        this.load.image( this.GRASSLANDBG_KEY, 'assets/images/grassland.png' );

        this.load.image( this.GRASSTILE_KEY, 'assets/tiles/green_34.png' );

        // this.player = this.load.spritesheet( this.PLAYER_KEY,
        //     'assets/spritesheets/player/run.png',
        //     {
        //         frameWidth : 120, frameHeight : 80
        //     }
        // );

        this.player = this.load.spritesheet( this.PLAYER_KEY,
            'assets/spritesheets/player/idle.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );

        this.playerRun = this.load.spritesheet( this.PLAYER_KEY,
            'assets/spritesheets/player/run.png',
            {
                frameWidth : 120, frameHeight : 80
            }
        );
    }

    create(): void
    {

        const sky = this.add.image( this.scale.width / 2, this.scale.height / 2, this.SKYBG_KEY );
        sky.setScale( 4 );
        const mountain = this.add.image( this.scale.width / 2, this.scale.height / 2, this.MOUNTAINBG_KEY );
        mountain.setScale( 4 );
        const grassland = this.add.image( this.scale.width / 2, this.scale.height / 2, this.GRASSLANDBG_KEY );
        grassland.setScale( 4 );

        // const grasstile = this.add.image( this.scale.width / 2, this.scale.height / 2, this.grasstile );

        // this.image = this.add.image( this.scale.width / 2, this.scale.height / 2, 'phaser3_cli' );

        this.player = this.createPlayer();
        const platforms = this.createPlatforms();

        this.physics.add.collider( this.player, platforms );
        this.physics.add.collider( this.player, this.groundPlatform );

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();

        // platforms.create( 400, 568, this.GRASSTILE_KEY ).setScale( 4 ).refreshBody();
        //
        // platforms.create( 600, 400, this.GRASSTILE_KEY );
        // platforms.create( 50, 250, this.GRASSTILE_KEY );
        // platforms.create( 750, 220, this.GRASSTILE_KEY );


        this.groundPlatform = this.physics.add.staticGroup({
            key: this.GRASSTILE_KEY,
            repeat: 150,
            setXY: { x: 0, y: 568, stepX: 15 }
        })


        // groundPlatform.children.iterate((child) => {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        // })

        return platforms;
    }

    createPlayer()
    {
        this.playerRun = this.physics.add.sprite( 400, 450, this.PLAYER_KEY );
        this.playerRun.setBounce( 0.2 );
        this.playerRun.setCollideWorldBounds( true );

        this.anims.create( {
            key       : 'left',
            frameRate : 10,
            repeat    : -1
        } );

        // this.anims.create( {
        //     key       : 'turn',
        //     frames    : [ { key : this.PLAYER_KEY, frame : 4 } ],
        //     frameRate : 20
        // } );

        this.anims.create( {
            key       : 'right',
            frameRate : 10,
            repeat    : -1
        } );

        this.anims.create( {
            key       : 'up',
            frameRate : 10,
            repeat    : -1
        } );

        return this.playerRun;
    }

    update()
    {
        if ( this.cursors.left.isDown )
        {
            this.playerRun.setVelocityX( -320 );

            this.playerRun.anims.play( 'left', true );
        }else if ( this.cursors.right.isDown )
        {
            this.playerRun.setVelocityX( 320 );

            this.playerRun.anims.play( 'right', true );
        }
        else
        {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if ( this.cursors.up.isDown && this.playerRun.body.touching.down )
        {
            this.playerRun.setVelocityY( 760 );
        }

    }
}
