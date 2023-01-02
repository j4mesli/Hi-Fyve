<template>
    <SynesthesiaLoggedInVue v-if="showHide"/>
    <SynesthesiaLoggedOutVue v-else />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SynesthesiaLoggedInVue from '@/components/Synesthesia/SynesthesiaLoggedIn.vue';
import SynesthesiaLoggedOutVue from '@/components/Synesthesia/SynesthesiaLoggedOut.vue';

export default defineComponent({
    components: {
        SynesthesiaLoggedInVue,
        SynesthesiaLoggedOutVue,
    },
    setup() {
        const showHide = ref(false);
        switch (sessionStorage.length) {
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