import headerBG from '../../public/assets/Header.png'
import userPicture from '../../public/assets/user-picture.png'

import './Userinfo.scss'

const UserInfo = () => {
    return(
        <div className='user-info-wrapper'>
            <div className='user-info-picture-section'>
                <div className='user-info-picture-wrapper'>
                    <img src={userPicture}/>
                </div>
            </div>
            <div className='user-info-data-section'></div>
        </div>
    )
}

export default UserInfo