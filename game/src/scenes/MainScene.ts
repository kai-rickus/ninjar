import { buildTargets }       from '../constants';
import { Scene, GameObjects } from 'phaser';
import { Ninjar }             from '../objects/ninjar';

export class MainScene extends Scene
{
    public image: GameObjects.Image;
    public ninjar: Ninjar;

    constructor()
    {
        super( {
            key : 'MainScene'
        } );
    }

    init()
    {
        console.log( 'MainScene' );
    }

    create(): void
    {
        this.image = this.add.image( this.scale.width / 2, this.scale.height / 2, 'phaser3_cli' );

    }
}
