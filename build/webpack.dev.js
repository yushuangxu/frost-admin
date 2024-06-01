const path = require('path');

const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const baseConfig = require('./webpack.base.js');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const host = 'localhost';
const port = '3002';
const openBrowser = require('./util/openBrowser');

const devConfig = merge(baseConfig, {
    mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new ReactRefreshWebpackPlugin(), // 添加热更新插件
    ],
});
const devServer = new WebpackDevServer(
    {
        host,
        port,
        open: true, // 是否自动打开
        compress: false, // gzip压缩,开发环境不开启，提升热更新速度
        hot: true, // 开启热更新
        historyApiFallback: true, // 解决history路由404问题
        setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
        static: {
            directory: path.join(__dirname, '../public'), // 托管静态资源public文件夹
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7001',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    },
    webpack(devConfig),
);
devServer.listen(port, host, () => {
    openBrowser(`http://${host}:${port}`);
});
module.exports = devConfig;
