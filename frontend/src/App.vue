<template>
  <LogoAndNavVue />
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogoAndNavVue from './components/LogoAndNav.vue';

export default defineComponent({
  components: {
    LogoAndNavVue,
  },
  setup() {
    
    return {  };
  },
})
</script>

<style>
#app {
  font-family: "Figtree", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
html {
  background-image: linear-gradient(to top right, #212121, #191414, #212121);
  scroll-behavior: smooth;
  background-size: 400%;
  animation: bg-animation 60s infinite alternate;
}
</style>
