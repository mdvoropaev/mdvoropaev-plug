const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].ext$`;

const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        configObj.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    return configObj;
};

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        }),

        new CopyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'app')}
            ]
        }),
    ];

    if (isProd) {
        basePlugins.push(
            new ImageminPlugin({
                bail: false,
                cache: true,
                imageminOptions: {
                  plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["jpegtran", { progressive: true }],
                    ["optipng", { optimizationLevel: 5 }],
                    [
                      "svgo",
                      {
                        plugins: [
                          {
                            removeViewBox: false
                          }
                        ]
                      }
                    ]
                  ]
                }
              })
        )
    }

    return basePlugins;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js', //вход
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
        publicPath: ''

    }, //выход
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'app'),
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map', //Если мы находимся в продакшене, то 'source-map' - не нужен и он не работает. Но если мы находимся в development, то мы используем 'source-map'
    module: {
        rules: [
            { //setting html-loader
                test: /\.html$/i,
                loader: 'html-loader',
            },
            { //setting css-loader
              test: /\.css$/i,
              use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev
                    }, 
                  },
                  'css-loader'  
              ],
            },
            { //setting scss-loader
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    }, 
                    'css-loader', 
                    'sass-loader'
                ],
            },
            { //setting image-loader
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./img/${filename('[ext]')}`
                    }
                }],
            },
            { //setting js-loader (babel-loader)
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            { //setting fonts-loader
                test: /\.(?:|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${filename('[ext]')}`
                    }
                }],
            },
        ]
    }
};