const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const config = require('./conf')
const conf = config.conf
const DEV = config.DEV
const PRO = config.PRO

// const UglifyJsPlugin = conf.env === PRO
//     ? [
//         new webpack.optimize.UglifyJsPlugin({
//             comments: false,    // 保留注释
//             compressor: {       //压缩器设置
//                 screw_ie8: true,    // 忽略IE8
//                 warnings: false,  // 显示警告
//             },
//         }),
//     ]
//     :
//     []


module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: conf.env === DEV ? 'bundle.js' : `bundle-${conf.bundle_time}.js`,
        chunkFilename: '[name].[id].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        moduleExtensions: [path.resolve(__dirname, 'node_modules')],
        alias: {
            SYS: path.resolve(__dirname, './'),
            SYSWEB: path.resolve(__dirname, './src'),
        },
    },
    module: {
        rules: [
            {
                // 后缀正则
                test: /\.js$/,
                // 加载器组
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'eslint-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
                // exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'less-loader',
                    ],
                }),
                exclude: /node_modules/,
            },

            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 10240,
                            mimetype: 'application/font-woff',
                        }
                    },
                ],
                // loaders: ['url-loader?&limit=102400&mimetype=application/font-woff'],
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 10240,
                            mimetype: 'application/octet-stream',
                        }
                    },
                ],
                // loaders: ['url-loader?name=[path][name].[ext]&limit=1024&mimetype=application/octet-stream'],
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ],
                // loaders: ['file-loader?name=[path][name].[ext]'],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
                // loaders: ['url-loader?name=[path][name].[ext]&limit=1024&mimetype=image/svg+xml'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 1,
                            name: `/v0/${conf.system}/[path][name].[ext]?[hash]`,
                            outputPath:'images' //定义输出的图片文件夹
                        },
                    },
                ],
                // loaders: ['url-loader?name=[path][name].[ext]?[hash]&limit=204800000'], // 单位bit
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        // ...UglifyJsPlugin,

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),

        // 独立打包css
        new ExtractTextPlugin(conf.env === DEV ? 'bundle.css' : `bundle-${conf.bundle_time}.css`),
    ],
}
