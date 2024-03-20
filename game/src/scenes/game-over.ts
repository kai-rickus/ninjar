import { Scene } from "phaser"

export class GameOver extends Scene
{

    constructor()
    {
        super( {
            key : "GameOver"
        } )
    }

    preload()
    {
        console.log('GAMEOVER!');
    }

    create()
    {
        console.log( "create" )
    }
}
