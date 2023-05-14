class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("MyWebpackPlugin", (compilation, callback) => {
      const source = compilation.assets['main.js'].source();
      const banner = [
        '/**',
        ' * 이것은 BannerPlugin이 처리한 결과입니다.',
        ' * Build Date: 2023-05-14',
        ' */',
        ''
      ].join('\n');
      console.log(banner)
      const newBanner = banner + '\n' + source;
      compilation.assets['main.js'] = {
        source: ()=> newBanner,
        size: ()=> newBanner.length
      }

      callback();
    })
  }
}

module.exports = MyWebpackPlugin;