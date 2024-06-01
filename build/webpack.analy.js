const prodConfig = require('./webpack.prod.js'); // 引入打包配置
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 引入插件
const smp = new SpeedMeasurePlugin(); // 实例化插件
const { merge } = require('webpack-merge'); // 合并配置
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// 使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
module.exports = smp.wrap(
    merge(prodConfig, {
        plugins: [
            new BundleAnalyzerPlugin(), //配置分析打包工具
        ],
    }),
);
