<template>
  <LogoAndNavVue />
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LogoAndNavVue from './components/LogoAndNav.vue';

export default defineComponent({
  components: {
    LogoAndNavVue,
  },
  setup() {
    // tokens
    const access_token = ref(null);
    const refresh_token = ref(null);
    
    return { access_token, refresh_token };
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
  height: 100%;
  scroll-behavior: smooth;
  background-size: 400%;
  animation: bg-animation 60s infinite alternate;
}
</style>
