import React from 'react';
import style from '@/App.scss';
import wechat from '@/assets/imgs/wechat.png';
function App() {
    return (
        <div>
            <img src={wechat} alt="小于10kb的图片" />
            <div className={style['smallImg']}>小图片背景11111</div>
            <h2 className={style.h}>Hello East_White11111111111</h2>
        </div>
    );
}

export default App;
