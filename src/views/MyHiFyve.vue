<template>
    <showIfLoggedInVue v-if="showHide"/>
    <showIfLoggedOutVue v-else />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import showIfLoggedInVue from '@/components/Hi-Fyve/showIfLoggedIn.vue';
import showIfLoggedOutVue from '@/components/Hi-Fyve/showIfLoggedOut.vue';

export default defineComponent({
    components: {
        showIfLoggedInVue, 
        showIfLoggedOutVue,
    },
    setup() {
        const showHide = ref(false);
        switch (localStorage.length) {
            case 0:
                showHide.value = false;
                break;
            default:
                showHide.value = true;
                break;
        }
        return { showHide };
    },
})
</script>

<style scoped>

</style>