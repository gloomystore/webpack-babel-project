const path = require('path');
const webpack = require('webpack');
const MyWebpackPlugin = require('./mywebpack-plugin');
const childProcess = require('child_process');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const apiMocker = require('connect-api-mocker');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV || 'development'
console.log(mode)
// 윈도우 터미널 실행법:  $env:NODE_ENV = "development"; npm run build
module.exports = {
  mode,
  devServer: {
    static:{
      directory:path.join(__dirname, "dist"), //정적파일을 제공할 경로. 기본값은 웹팩 아웃풋이다.
    },
    host: "192.168.0.144", //ex) "dev.domain.com" 개발환경에서 도메인을 맞추어야 하는 상황에서 사용한다. 예를들어 쿠기 기반의 인증은 인증 서버와 동일한 도메인으로 개발환경을 맞추어야 한다. 운영체제의 호스트 파일에 해당 도메인과 127.0.0.1 연결한 추가한 뒤 host 속성에 도메인을 설정해서 사용한다.
    client: {
      overlay: { errors: true, warnings: true, }, //빌드시 에러나 경고를 브라우져 화면에 표시한다.
    }, 
    // onBeforeSetupMiddleware: (devServer) => { // 수동으로 목업추가
    //   if (!devServer) {
    //     throw new Error('webpack-dev-server is not defined');
    //   }
    //   devServer.app.get("/api/users", (req, res) => {
    //     res.json([
    //       {
    //       id:1, name: 'alice'
    //       },
    //       {
    //       id:2, name: 'bek'
    //       },
    //       {
    //       id:3, name: 'chris'
    //       },
    //     ])
    //   })
    // },
    // onBeforeSetupMiddleware: (devServer) => {
    //   if (!devServer) {
    //     throw new Error('webpack-dev-server is not defined');
    //   }
    //   devServer.app.use(apiMocker('/api','mock/api'))
    // },
    proxy: {
      '/api': 'http://192.168.0.144:8082'
    },
    // setupMiddlewares: (middlewares, devServer) => {
    //   if (!devServer) {
    //     throw new Error('webpack-dev-server is not defined');
    //   }

    //   // Use the `unshift` method if you want to run a middleware before all other middlewares
    //   // or when you are migrating from the `onBeforeSetupMiddleware` option
    //   middlewares.unshift({
    //     name: 'test1',
    //     // `path` is optional
    //     path: '/api',
    //     middleware: (req, res , next) => {
    //       apiMocker('/api', 'mock/api')(req, res, next);
    //     },
    //   });
    //   return middlewares;
    // },
    port: 8081, //개발 서버 포트 번호를 설정한다. 기본값은 8080.
    devMiddleware: {
      stats: "errors-only",//메시지 수준을 정할수 있다. 'none', 'errors-only', 'minimal', 'normal', 'verbose' 로 메세지 수준을 조절한다.
      publicPath: "/", //브라우져를 통해 접근하는 경로. 기본값은 '/' 이다.
    }, 
    historyApiFallback: {
      disableDotRule: true,
      index: "/index.html"
    },//히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.
  },
  optimization:{
    minimizer: mode === 'production' ? [new CssMinimizerPlugin(), // css를 완전히 minify 해버림
      new TerserPlugin({ //js를 minify, 난독화
      terserOptions: {
        compress: {
          drop_console: true, // 콘솔 로그를 제거한다
        },
      },
    }),] : [],
    splitChunks: {
      chunks:'all', // 중복코드 제거 - code split이 목적. 파일이 나뉘면 다운로드가 나아짐.
    }
  },
  externals: {
    axios: 'axios' // axios를 빌드과정에서 뺀다. 아래 copywebpack에서 파일을 빼내서, 전역변수처럼 사용한다.
  },
  entry:{ //시작점 경로를 지정하는 옵션이다
    main: './src/app.js',
    // result: './src/result.js',
  },
  output: { //번들링 결과물을 위치할 경로다
    path: path.resolve('./dist'),
    filename: '[name].js',
    assetModuleFilename: '[name][ext]?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/, //loader가 처리해야할 파일의 패턴(정규표현식)
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader", // 개발 환경 - css를 파싱해서 실제로 쓸 수 있게 해줌
          "css-loader", // css를 자바스크립트 코드로 변환
          "sass-loader", // css를 자바스크립트 코드로 변환
        ],
      },
      { // webpack4까지의 방식
        test: /\.(jpg|png)$/, // .png 확장자로 마치는 모든 파일
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
    // new CleanWebpackPlugin(), // 빌드하면 dist 폴더를 싹 날리고 다시 만듦
    ...(process.env.NODE_ENV === 'production' // js에 CSS넣지않고, 우리가 원래 하던 방식대로 css 파일을 뽑아냄
      ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
      : []),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/favicon.ico', to: 'favicon.ico' },
          { from: './node_modules/axios/dist/axios.min.js', to: 'axios.min.js' },
        ],
      }),
  ],
}