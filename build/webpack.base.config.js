const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports =  {
    mode:'production',
    entry:path.resolve(__dirname,'../src/index.js'),
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'index.umd.min.js',
       /*  libaryTaget:'umd',
        globalObject:'this',
        libary:'webRabcPermissionSdk' */
        library: { // 这里有一种旧的语法形式可以使用（点击显示）
            type: "umd", // 通用模块定义
            // the type of the exported library
            name: "webRabcPermissionSdk", // string | string[]
            // the name of the exported library
      
            /* Advanced output.library configuration (click to show) */
        }
    },
    //devtool:'source-map',
    //externals:[]
    optimization:{
        //minimize:false
        minimize:true
    },
    module:{
        rules:[
            {
                test:/\.(js)$/,
                exclude:/node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin()
    ]
}