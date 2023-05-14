module.exports = {
  presets: [
    // './mybabel-preset.js',
    ['@babel/preset-env', // 하위버전의 자바스크립트로 변환해주는 프리셋
    {
      targets: {
        chrome: "79", // chrome 79까지는 지원해야함
        ie:"11",
      },
      useBuiltIns: 'usage', // 폴리필 사용 방식, 'entry', false
      corejs: {
        version:2, // 폴리필 버전 지정 , 3 등
      }
    }]
  ]
}