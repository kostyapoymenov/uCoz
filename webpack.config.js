const   webpack         = require('webpack'),
        uglifyJSPlugin  = require('uglifyjs-webpack-plugin');

const config = {
    output: {
        filename: 'main.js'
    },
    plugins: [
        new uglifyJSPlugin({
            sourceMap: true
        })
    ]
};

module.exports = config;