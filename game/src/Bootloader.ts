import { Scene } from 'phaser';
export class Bootloader extends Scene
{
    constructor()
    {
        super( {
            key : 'Bootloader'
        } );
    }

    preload(): void
    {
        this.load.on( 'complete', () =>
        {
            this.scene.start( 'MainScene' );
        } );
    }

}
