import React, { Fragment, useEffect, useRef, useState } from 'react';
import './index.scss';

export default (props) => {
    const { extra, children } = props;
    const leftDom = useRef(null);
    const rightDom = useRef(null);
    const [toolbarWidth, setToolbarWidth] = useState('');
    useEffect(() => {
        const sider = document.querySelector('.ant-layout-sider');
        if (!sider) return;

        setToolbarWidth(`calc(100% - ${sider.style.width})`);
    }, []);
    return (
        <Fragment>
            <div className="toolbar" style={{ width: toolbarWidth }}>
                <div className="conWrap">
                    <div ref={leftDom} className="left">
                        {extra}
                    </div>
                    <div ref={rightDom} className="right">
                        {children}
                    </div>
                </div>
            </div>
            <div style={{ height: 56 }} />
        </Fragment>
    );
};
