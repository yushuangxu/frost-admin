import React from 'react';
import {
    SendOutlined,
    HomeOutlined,
    CalendarOutlined,
} from '@ant-design/icons';

const menuList = [
    {
        label: '首页',
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: '文章管理',
        key: 'article',
        icon: <SendOutlined />,
        children: [
            {
                label: '文章列表',
                key: '/article/list',
            },
        ],
    },
    {
        label: '摘抄管理',
        key: 'extract',
        icon: <CalendarOutlined />,
        children: [
            {
                label: '文章列表',
                key: '/extract/list',
            },
        ],
    },
];
export default menuList;
