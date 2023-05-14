const path = require('path');
const webpack = require('webpack');
const MyWebpackPlugin = require('./mywebpack-plugin');
const childProcess = require('child_process');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 윈도우 터미널 실행법:  $env:NODE_ENV = "development"; npm run build
module.exports = {
  mode: 'development',
  entry:{ //시작점 경로를 지정하는 옵션이다
    main: './src/appBabel.js'
  },
  output: { //번들링 결과물을 위치할 경로다
    path: path.resolve('./dist'),
    filename: '[name].js',
    assetModuleFilename: '[name][ext]?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.css$/, //loader가 처리해야할 파일의 패턴(정규표현식)
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader", // 개발 환경 - css를 파싱해서 실제로 쓸 수 있게 해줌
          "css-loader", // css를 자바스크립트 코드로 변환
        ],
      },
      { // webpack4까지의 방식
        test: /\.jpg$/, // .png 확장자로 마치는 모든 파일
        loader: "url-loader", //file-loader 는  js에서 import된 file을 파싱해서 사용할 수 있게 해주는 역할
        options: {
          // publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
          name: "[name].[ext]?[hash]", // 파일명 형식
          limit: 20000 //20kb
        },
      },
      // { // webpack4까지의 방식
      //   test: /\.png$/, // .png 확장자로 마치는 모든 파일
      //   loader: "file-loader", //file-loader 는  js에서 import된 file을 파싱해서 사용할 수 있게 해주는 역할
      //   options: {
      //     publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
      //     name: "[name].[ext]?[hash]", // 파일명 형식
      //   },
      // },
      {
        test: /\.(png)$/, //loader가 처리해야할 파일의 패턴(정규표현식)
        type: 'asset/resource', // webpack5부터
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  },
  // plugins: [
  //   new MyWebpackPlugin()
  // ],
  plugins: [ // 이미 완성된 번들에 뭔가 행동을 취함
    new webpack.BannerPlugin({ // 최상단에 주석을 넣어줌
      banner: `build date = ${new Date().toLocaleString()}
      Author: ${childProcess.execSync('git config user.name')}
      `
    }),
    new webpack.DefinePlugin({ // 전역 변수를 만들어줌
      TWO: JSON.stringify('1+1'),
      'api.domain': JSON.stringify('http://www.gloomy-store.com')
    }),
    new htmlWebpackPlugin({ // 템플릿으로 사용할 파일을 뭘로할지 설정 / 전역변수 설정 / 미니파이 가능
      template: './src/index.html',
      templateParameters:{
        env: process.env.NODE_ENV === 'development' ? '(development)' : '',
      },
      minify: process.env.NODE_ENV === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
      } : ''
    }),
    new CleanWebpackPlugin(), // 빌드하면 dist 폴더를 싹 날리고 다시 만듦
    ...(process.env.NODE_ENV === 'production' // js에 CSS넣지않고, 우리가 원래 하던 방식대로 css 파일을 뽑아냄
      ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
      : []),
  ],
}