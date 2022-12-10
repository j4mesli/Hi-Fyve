<template>
  <div id="app">
    <HomeDecorationVue />
  </div>
</template>

<script lang="ts">
import HomeDecorationVue from "@/components/Home/HomeDecoration.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {

  },
  components: {
    HomeDecorationVue,
  },
  setup() {
      return {  };
  },
})
</script>

<style>
#app {
  font-family: 'Figtree','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f3f3f3;
  
}
</style>
