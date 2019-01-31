<template>
   <section class="real-app">
      <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来要做什么"
      @keyup="addTodo"
      >
   </section>

</template>

<script>
export default {
    methods:{
       addTodo(){

       } 
    }
}
</script>

<style lang="stylus" scoped>
  .real-app{
      width 600px
      margin 30px auto

 }

</style>
