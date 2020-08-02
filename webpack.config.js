const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    watch: true,
    entry: './webpack.js',
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js',
        publicPath: '.',
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/assets',
                    },
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "/stylesheets/final.css",
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /final.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        
    ]
};