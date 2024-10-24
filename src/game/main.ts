import Boot from './scenes/Boot';
import MainGame from './scenes/Game';
import Preloader from './scenes/Preloader';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 412,
    height: 500,
    transparent: true,
    // resolution: window.devicePixelRatio,
    parent: 'game-container',
    scene: [
        Boot,
        Preloader,
        MainGame,
    ],
    render: {
        pixelArt: false,
        antialias: true // Enable smooth edges
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
