import React from 'react';
import loadable from '@loadable/component';
import Loading from '@/components/Loading';
import { SendOutlined, HomeOutlined } from '@ant-design/icons';

const rootRouter = [
    {
        name: '首页',
        path: '/',
        icon: <HomeOutlined />,
        element: loadable(() => import('@/pages/Home/Home'), {
            fallBack: <Loading />,
        }),
    },
    {
        name: '文章管理',
        path: '/article',
        icon: <SendOutlined />,
        children: [
            {
                name: '文章列表',
                path: '/article/list',
                element: loadable(() => import('@/pages/Article/List')),
            },
        ],
    },
    {
        name: '摘抄管理',
        path: '/extract',
        icon: <SendOutlined />,
        children: [
            {
                name: '文章列表',
                path: '/extract/list',
                element: loadable(() => import('@/pages/Extract/List')),
            },
        ],
    },
];
export default rootRouter;
