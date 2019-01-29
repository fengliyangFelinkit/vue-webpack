<template>
<!-- .vue文件是浏览器不能识别的，webpack通过vue-loader将其打包到浏览器能够识别的js中,这里是
    dist/bundle.js -->
    <div id="test-vue">
        {{text}}
    </div>
</template>

<script>
export default {
    data(){
        return{
            text:'webpack-vue-webpack'
        }
    }
}
</script>
<style>
#test-vue{
    color: red;
    font-size: 20px;
    font-weight: bold;
    font-style: oblique


}
</style>

