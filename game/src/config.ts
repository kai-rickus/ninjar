import { Bootloader } from './Bootloader';
import { MainMenu }       from "./scenes/main-menu"
import { SceneOne }   from './scenes/scene-one';
import { SceneTwo }   from './scenes/scene-two';
import { AUTO, Scale, Types } from 'phaser';

export const CONFIG: Types.Core.GameConfig = {
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
            },
            debug   : true,
        }
    },
    scene           : [
        MainMenu,
        SceneOne,
        SceneTwo,
    ]
};
