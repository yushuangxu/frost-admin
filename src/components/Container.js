import React, { useState, useEffect } from 'react';
import {
    useNavigate,
    Outlet,
    useLocation,
    matchRoutes,
} from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import menuList from '@/routes/menu';
const { Header, Content, Footer, Sider } = Layout;
import routes from '@/routes/index';
// function getItem(label, key, icon, children) {
//     return {
//         key,
//         icon,
//         children,
//         label,
//     };
// }
// const items = [

// ];
const Container = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [breadItem, setBreadItem] = useState([]);
    const location = useLocation();
    useEffect(() => {
        const breadList = matchRoutes(routes, location.pathname);
        const breadItem = [];
        breadList?.forEach((item) => {
            breadItem.push(item?.route?.name);
        });
        setBreadItem([...breadItem]);
    }, [location.pathname]);
    const navigate = useNavigate();

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };
    const checkedMenu = (e) => {
        navigate(e.key);
    };
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => onCollapse(value)}
                style={{
                    background: colorBgContainer,
                }}
            >
                <div className="demo-logo-vertical" />
                {/* <Menu
                    theme="light"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={menuList}
                /> */}
                <Menu
                    theme="light"
                    onClick={(e) => checkedMenu(e)}
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuList}
                    defaultOpenKeys={[location.pathname.split('/')[1]]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        {breadItem.map((item, index) => (
                            <Breadcrumb.Item key={index}>
                                {item}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Container;
