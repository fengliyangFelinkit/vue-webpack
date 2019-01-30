import Vue from 'vue'
import App from './app.vue'
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render:(h) => h(App)
}).$mount(root)

// 大致流程：
/**
 * 1.index.js是项目的入口文件，最终与项目其他资源(如.vue)一起被打包成可被浏览器识别的bundle.js,
    然后在html中引入这个js文件,.vue,.styl这些文件浏览器无法直接识别的
   2.index.js要import其他文件，比如app.vue,
 * 
 */