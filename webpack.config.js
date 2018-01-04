const path = require('path')
const glob = require('glob')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const optimizeCss = require('optimize-css-assets-webpack-plugin')
const chalk = require('chalk')
const config = require('./config/webpack.conf.js')

let entries = {}
let files = fs.readdirSync('./src/js/entries/')
// let htmls = fs.readdirSync('./src/views/')

// for (let i = 0; i < htmls.length; i++) {
//     if (files)
// }

let webpackConfig = {
    devtool: config.sourceMap ? 'source-map' : 'null',
    entry: entries,
    output: {
        path: path.resolve('public'),
        filename: 'js/[name]-[hash].js',
        publicPath: config.publicPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader!postcss-loader'
                })
            },
            {
                test: /\.html|.ejs$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        // 清除上一次打包所产生的文件
        new CleanWebpackPlugin(['./public/*'], {
            root: path.resolve(),
            verbose: true,
            dry: false
        }),
        new ExtractTextPlugin('css/[name].[hash].css'),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, config.staticSrc),
                to: 'static'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, config.layoutSrc),
                to: 'layout'
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new optimizeCss()
        // 删除重复依赖
        // new webpack.optimize.DedupePlugin()
    ]
}

// 查找所有入口文件
for (let i = 0; i < files.length; i++) {

    let newEntry = {}
    let name = files[i].split('.')[0]
    let path = config.entryPath + files[i]
    newEntry[name] = path
    Object.assign(entries, newEntry)

    // 创建所有HTML
    webpackConfig.plugins.push(new HtmlWebpackPlugin(
       {
           filename: 'views/' + name + '.ejs',
           template: config.templateSrc + name + '.ejs',
           chunks: ['vendor', name]
       }
    ))

}

module.exports = webpackConfig