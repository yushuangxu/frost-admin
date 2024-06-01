const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'; //

const envConfig = dotenv.config({
    path: path.resolve(__dirname, '../env/.env.' + process.env.BASE_ENV),
});

const cssRegex = /\.css$/;
const sassRegex = /\.s[ac]ss$/;
const lessRegex = /\.less$/;
const stylRegex = /\.styl$/;

const styleLoadersArray = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: '[path][name]__[local]--[hash:5]',
            },
        },
    },
    'postcss-loader',
];

const baseConfig = {
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'static/js/[name].[chunkhash:8].js',
        clean: true,
        publicPath: '/',
    },
    cache: {
        type: 'filesystem', // 使用文件缓存
    },

    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                use: ['babel-loader', 'thread-loader'],
                exclude: /node_modules/,
            },
            {
                test: cssRegex, //匹配 css 文件
                use: styleLoadersArray,
                exclude: /node_modules/,
            },
            // {
            //     test: /.css$/, //匹配 css 文件
            //     use: ["style-loader", "css-loader"],
            // },
            {
                test: lessRegex,
                use: [
                    ...styleLoadersArray,
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                // 如果要在less中写类型js的语法，需要加这一个配置
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: sassRegex,
                use: [
                    ...styleLoadersArray,
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                // 如果要在sass中写类型js的语法，需要加这一个配置
                                javascriptEnabled: true,
                                module: true,
                            },
                        },
                    },
                ],
            },
            {
                test: stylRegex,
                use: [...styleLoadersArray, 'stylus-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 20 * 1024, // 小于10kb转base64
                    },
                },
                generator: {
                    filename: 'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
            },
            {
                test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64
                    },
                },
                generator: {
                    filename: 'static/fonts/[hash][ext][query]', // 文件输出目录和命名
                },
            },
            {
                test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                type: 'asset', // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64
                    },
                },
                generator: {
                    filename: 'static/media/[hash][ext][query]', // 文件输出目录和命名
                },
            },
            {
                // 匹配json文件
                test: /\.json$/,
                type: 'asset/resource', // 将json文件视为文件类型
                generator: {
                    // 这里专门针对json文件的处理
                    filename: 'static/json/[name].[hash][ext][query]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.join(__dirname, '../src'),
        },
        modules: [path.resolve(__dirname, '../node_modules')],
    },
    plugins: [
        new WebpackBar({
            color: '#85d', // 默认green，进度条颜色支持HEX
            basic: false, // 默认true，启用一个简单的日志报告器
            profile: false, // 默认false，启用探查器。
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../public/index.html'),
            filename: 'index.html',
            //压缩html资源
            minify: {
                removeAttributeQuotes: true, //去掉属性的双引号
                collapseWhitespace: true, //去空格
                removeComments: true, //去注释
                minifyJS: true, //压缩js
                minifyCSS: true, //压缩css
            },
            nodeModules: path.resolve(__dirname, '../node_modules'),
        }),
        new DefinePlugin({
            'process.env': JSON.stringify(envConfig.parsed),
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ].filter(Boolean),
};

module.exports = baseConfig;
