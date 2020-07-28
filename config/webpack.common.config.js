"use strict";

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const helpers = require("./helpers");
const isDevelopment = process.env.NODE_ENV === "development";
const env = process.env.NODE_ENV;

const commonWebpackConfig = {
    mode: env || "development",
    entry: {
        polyfill: "@babel/polyfill",
        main: helpers.root("src", "main"),
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            vue$: isDevelopment ? "vue/dist/vue.runtime.js" : "vue/dist/vue.runtime.min.js",
            "@": helpers.root("src"),
        },
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: "vue-loader", include: [helpers.root("src")] },
            { test: /\.js$/, loader: "babel-loader", include: [helpers.root("src")] },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: "image-webpack-loader",
                // Specify enforce: 'pre' to apply the loader
                // before url-loader/svg-url-loader
                // and not duplicate it in rules with them
                enforce: "pre",
            },
            {
                test: /\.(ico|jpg|jpeg|png|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "static/[name].[hash:8].[ext]",
                    },
                },
            },
            {
                test: /\.svg$/,
                use: {
                    loader: "svg-url-loader",
                    options: {
                        limit: 10 * 1024,
                        name: "static/[name].[hash:8].[ext]",
                        fallback: "file-loader",
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    MiniCSSExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: isDevelopment } },
                ],
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sassOptions: {
                                fiber: require("fibers"),
                                indentedSyntax: true, // optional
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlPlugin({
            template: "index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
        }),
    ],
};

module.exports = commonWebpackConfig;
