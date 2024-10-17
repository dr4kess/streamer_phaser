import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../game/scenes/MainMenu';
import RoomScene from '../RoomScene/RoomScene';

import UserInfo from '../UserInfo/UserInfo';
import Tapbar from '../Tapbar/Tapbar';

import './App.scss'

function App()
{
    return (
        <div className='main-wrapper'>
            <div className='room-page'>
                <UserInfo/>
                <RoomScene/>
                <div className="room-glow"></div>
            </div>

            {/* <Tapbar/> */}
        </div>
    )
}

export default App
