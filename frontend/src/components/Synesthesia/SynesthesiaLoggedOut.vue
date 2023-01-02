<template>
    <h1>Introducing <span>Synesthesia🎜</span></h1>
    <h2>Envision your music <span><strong>boldly.</strong></span></h2>
    <LoggedOutSampleSynesthesiaVue />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoggedOutSampleSynesthesiaVue from './LoggedOutSampleSynesthesia.vue';

export default defineComponent({
    components: {
        LoggedOutSampleSynesthesiaVue,
    },
    setup() {
        return {  };
    },
})
</script>

<style scoped>
span {
    background-image: var(--info-text-synesthesia);
    background-position: left;
    background-size: 400%;
    animation: bg-animation 30s infinite alternate;
    background-clip: text;
    color: transparent;
}
h1 {
    font-size: 64px;
    font-weight: 500;
}
h2 {
    font-weight: 500;
}
@media (max-width: 1000px) {
    h1 {
        font-size: 32px;
    }
}
</style>