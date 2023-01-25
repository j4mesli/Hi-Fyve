<template>
  <LogoAndNavVue />
  <router-view/>
  <PageFooter />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogoAndNavVue from './components/LogoAndNav.vue';
import PageFooter from './PageFooter.vue';
import { handleLogIn } from './components/functions/handleLogIn';

export default defineComponent({
  components: {
    LogoAndNavVue,
    PageFooter,
  },
  setup() {
    if (localStorage.access_token && localStorage.refresh_token) {
      if (localStorage.access_token === 'undefined' || localStorage.refresh_token === 'undefined') {
        handleLogIn();
      }
    }
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
  background: #212121;
  scroll-behavior: smooth;
  background-size: 400%;
}
</style>
