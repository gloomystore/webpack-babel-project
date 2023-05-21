import nyancat from "./nyancat.jpg";
import form from './form';
import result from './result';
import MainController from "./controllers/MainController.js";
import "./app.scss";


let formEl;
let resultEl;
window.addEventListener("DOMContentLoaded", async() => {
  document.body.insertAdjacentHTML('beforeend',`<img src=${nyancat} alt='img' />`);

  formEl = document.createElement('div')
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl)

  resultEl = document.createElement('div')
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl)
  // import(/* webpackChunkName: "result" */'./result').then(async(m)=> {
  //   resultEl = document.createElement('div')
  //   resultEl.innerHTML = await result.render();
  //   document.body.appendChild(resultEl)// 이런식으로 entry 파일을 하나 더 추가할 수 있음

  // }); 

 


  new MainController();
});

if(module.hot){
  console.log('hot!')

  module.hot.accept('./result',async ()=>{
    console.log('/result 변경')
    resultEl.innerHTML = await result.render();
  })
  module.hot.accept('./form',async ()=>{
    console.log('/form 변경')
    formEl.innerHTML = form.render();
  })
}

// console.log(
//   "----------------매 우 긴 문 장 입 니 다 80자가 넘 는 코 드 입 니 다.----------------"
// )(function () {})();

// var foo = "";
console.log(1111111);





// npm i -D prettier
// npm i -D eslint-config-prettier -> 통합

/**
 * package.json에 아래 코드를 추가해서
 * 커밋 때마다 린트 작동가능
 * 
 * "husky": {
    "hooks": {
      "pre-commit": "eslint ./src/app.js --fix"
    }
  }

  하지만 모든 파일을 감시하는 것은 시간낭비 자원낭비이므로,
  !!변화가 있는 파일!!만 수정해도됨
  npm i -D lint-staged
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": "eslint --fix"
  }
 * 
 */