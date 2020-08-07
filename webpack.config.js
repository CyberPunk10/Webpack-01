// basic vars
const path = require('path')

// additional plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// helping vars
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    // 'style-loader',
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
        publicPath: '../'             /* для ссылок внутри, например для fonts и bgc-image*/
      },
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

// module settings
module.exports = {
  // базовый путь к проекту
  context: path.resolve(__dirname, 'src'),

  // точка входа js
  entry: {
    // основной файл приложения
    app: [
      '@babel/polyfill',
      './js/app.js',
      './sass/style.sass'
    ],
  },

  // путь для собранных файлов
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist')
  },

  // dev-server configuration
  devServer: {
    contentBase: './app',
    port: 9000,

  },

  devtool: isDev ? 'source-map' : '',

  module: {
    rules: [

      // CSS, SASS, SCSS, LESS
      {
        test: /\.css$/i,
        use: cssLoaders()
      }, {
        test: /\.less$/i,
        use: cssLoaders('less-loader')
      }, {
        test: /\.s[ac]ss$/i,
        use: cssLoaders('sass-loader')
      },

      // IMAGES
      {
        test: /\.(png|jpe?g|gif)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
        ]
      },

      // FONTS
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
        ]
      },

      // BABEL
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './images',
        to: 'images',
        ignore: ['svg/*'],
      }
    ]),
    new HTMLWebpackPlugin(
      {
        template: '../app/index.html',
        // minify: {
        //   collapseWhitespace: isProd
        // }
      }
    ),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`
    }),
  ]
}

// PRODUCTION ONLY
// if (isProd) {
//   module.exports.plugins.push(
//     new 
//   )
// }
