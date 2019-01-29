const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
   entry: path.join(__dirname, 'src/index.js'),
   output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist')
   },
   module: {
      rules: [
         {
            test: /\.vue$/,
            loader: 'vue-loader'
         },
         {
            test: /\.css$/,
            use:[
              'style-loader',
              'css-loader' 
            ]
         },
         {
            test:/\.(gif|jpg|jpeg|png|svg)$/,
            use:[
               {
                  loader:'url-loader',
                  options:{
                     limit:1024,
                     name:'[name]-a.[ext]'
                  }
               }
            ]
         },
         {
            test:/\.styl/,
            use:[
               'style-loader',
               'css-loader',
               'stylus-loader'
            ]
         }
      ]
   },
   plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
         'process.env':{
            NODE_ENV: isDev ? '"development"' : '"production"'
         }
      })
   ]

}

if(isDev){
   config.devtool = '#cheap-module-eval-source-map'
   config.devServer = {
      port:8000, //端口号
      host:'0.0.0.0',//可用localhost:8000访问
      overlay:{
         errors:true
      },
      hot:true
   }
   config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
   )
}


module.exports = config;