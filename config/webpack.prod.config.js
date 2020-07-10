"use strict";

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const helpers = require("./helpers");
const commonConfig = require("./webpack.common.config");
const isProduction = process.env.NODE_ENV === "production";
const environment = isProduction ? require("./env/prod.env") : require("./env/staging.env");

const prodWebpackConfig = merge(commonConfig, {
    output: {
        path: helpers.root("dist"),
        publicPath: "/",
        filename: "js/[hash].js",
        chunkFilename: "js/[id].[hash].chunk.js",
    },
    optimization: {
        runtimeChunk: "single",
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ["default", { discardComments: { removeAll: true } }],
                },
            }),
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: !isProduction
            }),
        ],
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace("@", "")}`;
                    },
                },
                styles: {
                    test: /\.css$/,
                    name: "styles",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new webpack.EnvironmentPlugin(environment),
        new MiniCSSExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[id].[hash].css",
        }),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp("\\.(js|css)$"),
            threshold: 10240,
            minRatio: 0.8,
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
});

if (!isProduction) {
    webpackConfig.devtool = "source-map";

    if (process.env.npm_config_report) {
        const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
}

module.exports = prodWebpackConfig;
