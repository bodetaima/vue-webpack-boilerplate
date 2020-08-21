const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.common");
const isProduction = process.env.NODE_ENV === "production";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const prodWebpackConfig = merge(commonConfig, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
        filename: "js/[hash:8].js",
        chunkFilename: "js/[id].[hash:8].chunk.js",
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
                sourceMap: !isProduction,
            }),
        ],
        splitChunks: {
            chunks: "all",
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
        new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[id].[hash].css",
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
});

module.exports = prodWebpackConfig;
