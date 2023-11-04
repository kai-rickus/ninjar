import { Bootloader }  from './Bootloader';
import { MainScene }   from './scenes/MainScene';
import { AUTO, Scale } from 'phaser';

export const CONFIG: any = {
    title           : 'NinJar',
    version         : '0.0.1',
    type            : AUTO,
    backgroundColor : '#22A6B3',
    scale           : {
        parent     : 'phaser_container',
        width      : 1280,
        height     : 720,
        mode       : Scale.FIT,
        autoCenter : Scale.CENTER_BOTH
    },
    dom             : {
        createContainer : true
    },
    render          : {
        pixelArt : true,
    },
    physics         : {
        default : 'arcade',
        arcade  : {
            gravity : {
                y : 300
            }
        }
    },
    scene           : [
        MainScene
    ]
};
