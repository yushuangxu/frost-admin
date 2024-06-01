const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path');
const Copyplugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const globAll = require('glob-all');
const prodConfig = merge(baseConfig, {
    mode: 'production', //生产模式，会开启tree-shaking和压缩代码

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true, //开启多线程压缩
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.log'],
                    },
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    //提取node_modules里面的第三方库
                    test: /node_modules/,
                    name: 'vendors', //提交文件命名为vendors,js后缀和chunkhash会自动加
                    minChunks: 1, //只要使用一次就提取出来
                    chunks: 'initial', //只提取初始化就能获取的模块,不管移步模块
                    minSize: 0, //提取代码体积大于0就提取出来
                    priority: 1, //提取优先级为1
                },
                commons: {
                    //提取公共代码
                    name: 'commons',
                    minChunks: 2, // 只要使用两次就提取出来
                    chunks: 'initial', //只提取初始化获取的模块
                    minSize: 0, //只提取体积大于0的
                },
            },
        },
        // performance: {
        //     hints: false,
        //     maxAssetSize: 4000000, // 整数类型（以字节为单位）
        //     maxEntrypointSize: 5000000, // 整数类型（以字节为单位）
        // },
    },

    plugins: [
        new Copyplugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    filter: (source) => !source.includes('index.html'), //忽略index.html文件
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css', // 抽离css的输出目录和名称
        }),
        new CompressionPlugin({
            test: /\.(js|css)$/, //只生成jss css文件
            filename: '[path][base].gz', // 文件格式命名
            algorithm: 'gzip', //默认gzip格式
            threshold: 10240, //只有大于该值的文件会被处理
            minRatio: 0.8, //默认为0.8
        }),
        new PurgeCSSPlugin({
            paths: globAll.sync([
                `${path.join(__dirname, '../src')}/**/*`,
                path.join(__dirname, '../public/index.html'),
                { nodir: true },
            ]),
            only: ['dist'],
            safelist: {
                standard: [/^ant-/], //过滤antd不使用也不管
            },
        }),
    ],
});

module.exports = prodConfig;
