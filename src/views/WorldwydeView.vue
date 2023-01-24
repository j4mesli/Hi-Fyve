<template>
    <showIfLoggedIn v-if="isLoggedIn"/>
    <showIfLoggedOut v-else/>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from 'vue';
import showIfLoggedIn from '@/components/Worldwyde/showIfLoggedIn.vue';
import showIfLoggedOut from '@/components/Worldwyde/showIfLoggedOut.vue';

export default defineComponent({
    components: {
        showIfLoggedIn,
        showIfLoggedOut,
    },
    setup() {
        const isLoggedIn = ref(localStorage.access_token && localStorage.refresh_token && localStorage.length >= 2) as Ref<boolean>;
        return { isLoggedIn };
    },
})
</script>

<style scoped>

</style>