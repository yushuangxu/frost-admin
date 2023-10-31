import React from 'react';
import { Spin } from 'antd';
const Loading = () => {
    return (
        <div
            style={{
                width: '100%',
                paddingTop: (global?.innerHeight || 0) * 0.4 || 100,
                textAlign: 'center',
                height: '100vh',
            }}
        >
            <Spin spinning size="large" />
            <div style={{ color: '#666', marginTop: 10 }}>加载中,请稍后</div>
        </div>
    );
};
export default Loading;
