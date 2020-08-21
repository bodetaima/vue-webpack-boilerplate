const webpack = require("webpack");
const path = require("path");
const {merge} = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const commonConfig = require("./webpack.common");

const devWebpackConfig = merge(commonConfig, {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
        filename: "js/[name].bundle.js",
        chunkFilename: "js/[id].chunk.js",
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin(),
    ],
    devServer: {
        compress: true,
        historyApiFallback: true,
        hot: true,
        overlay: true,
        port: 3000,
        stats: {
            normal: true,
        },
    },
});

module.exports = devWebpackConfig;
