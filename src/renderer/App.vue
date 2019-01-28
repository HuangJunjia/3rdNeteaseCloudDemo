<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-demo',
    created() {
      document.onkeydown = function (event) {
        let e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 122) { // 按 Esc
          //要做的事情
          e.preventDefault()
        }
        if (e && e.keyCode == 116) { // 按 F2
          //要做的事情
          e.preventDefault()
        }
      };
    }
  }
</script>

<style>
  /* CSS */
</style>
