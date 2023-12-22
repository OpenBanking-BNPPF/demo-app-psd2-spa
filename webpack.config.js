const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.jsx'),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        library: 'DemoApp',
        libraryTarget: 'umd',
        publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {name: 'assets/[name].[ext]'}
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'assets/fonts/[hash].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        })
    ],
    devServer: {
        devMiddleware: {
            publicPath: '/'
        },
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "build")
        },
        proxy: {
            '/api/**': {
                target: 'http://localhost:8081/'
            }
        }
    }
};
