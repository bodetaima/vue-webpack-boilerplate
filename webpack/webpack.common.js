const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV === "development";
const Analyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const commonWebpackConfig = {
    entry: {
        main: path.resolve(__dirname, "../src/main.js"),
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            vue$: isDevelopment ? "vue/dist/vue.runtime.js" : "vue/dist/vue.runtime.min.js",
            "@": path.resolve(__dirname, "../src"),
            "@styles": path.resolve(__dirname, "../src/styles"),
            "@components": path.resolve(__dirname, "../src/components"),
            "@constants": path.resolve(__dirname, "../src/constants"),
            "@utils": path.resolve(__dirname, "../src/utils"),
        },
    },
    module: {
        rules: [
            { test: /\.vue$/, loader: "vue-loader", include: [path.resolve(__dirname, "../src")] },
            { test: /\.js$/, loader: "babel-loader", include: [path.resolve(__dirname, "../src")] },
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: "image-webpack-loader",
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
            favicon: "./public/favicon.ico",
            template: "./public/index.html",
            filename: "index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
        }),
        new Analyzer({
            openAnalyzer: false,
            analyzerMode: "static",
        }),
    ],
};

module.exports = commonWebpackConfig;
