const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const extractStyle = new MiniCssExtractPlugin({
    filename: "style.css",
    disable: false
});
console.log('devMode=' + devMode)

module.exports = {
    entry: ['@babel/polyfill', './src/index.jsx'],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        library: 'DemoApp',
        libraryTarget: 'umd',
        publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {name: 'assets/[name].[ext]'}
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.ya?ml$/,
                loader: ['json-loader', 'yaml-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        extractStyle,
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    devServer: {
        publicPath: '/',
        historyApiFallback: true,
        contentBase: path.join(__dirname, "build"),
        proxy: {
            '/api/**': {
                target: 'http://localhost:8081/'
            }
        }
    }
};