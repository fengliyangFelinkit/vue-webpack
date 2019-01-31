<template>
<!-- .vue文件是浏览器不能识别的，webpack通过vue-loader将其打包到浏览器能够识别的js中,这里是
    dist/bundle.js -->
    <div id="app">
        <div id="cover">
          <Header></Header>
          <Footer></Footer>
          <todo></todo>
        </div>
    </div>
</template>

<script>
 import Header from './todo/header.vue'
 import Footer from './todo/footer.jsx'
 import Todo from './todo/todo.vue'
 export default {
   components:{
       Header,
       Footer,
       Todo
   }
}
</script>

<style lang="stylus" scoped>
 #app{
     position absolute
     left 0
     right 0
     top 0
     bottom 0
 }
 #cover{
     position absolute
     left 0
     right 0
     top 0
     bottom 0
     background-color #999
     opacity 0.9
     z-index -1
}

</style>

