import React from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from '@/components/Container';

import Login from '@/pages/Login/Login';
import routes from './routes';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/index';
import RequireAuth from '@/components/RequireAuth'
function App() {
    const route = (routes) => {
        return routes.map((item) => {
            return item?.children && item.children?.length !== 0 ? (
                route(item.children)
            ) : (
                <Route path={item.path} element={<item.element />} />
            );
        });
    };
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <RequireAuth>
                            <Container />
                        </RequireAuth>
                    }>

                        {route(routes)}
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
