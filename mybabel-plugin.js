// myplugin.js:
function myBabelPlugin() {
  return {
    visitor: {
      // Identifier(path) {
      //   const name = path.node.name

      //   // 바벨이 만든 AST 노드를 출력한다
      //   console.log("Identifier() name:", name)

      //   // 변환작업: 코드 문자열을 역순으로 변환한다
      //   path.node.name = name.split("").reverse().join("");
      // },

      // VariableDeclaration(path) { // 노드의 종류를 바꾸기?
      //   console.log("VariableDeclaration() kind:", path.node.kind) // const

      //   if (path.node.kind === "const") {
      //     path.node.kind = "var"
      //   }
      // },
    },
  }
}
module.exports = myBabelPlugin




// const, let 처럼 블록 스코핑을 따르는 예약어를 함수 스코핑을 사용하는 var 변경한다.
//npm install -D @babel/plugin-transform-block-scoping
// npx babel ./src/appBabel.js --plugins @babel/plugin-transform-block-scoping

// 화살표함수 => 일반함수로
//npm install -D @babel/plugin-transform-arrow-functions
// npx babel ./src/appBabel.js --plugins @babel/plugin-transform-arrow-functions --plugins @babel/plugin-transform-block-scoping

// strict mode
//npm install -D @babel/plugin-transform-strict-mode
// npx babel ./src/appBabel.js --plugins @babel/plugin-transform-arrow-functions --plugins @babel/plugin-transform-block-scoping --plugins @babel/plugin-transform-strict-mode