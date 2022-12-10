<template>
    <div class="wrapper" v-if="(width >= 500)">
        <h1 class="heading">Your Top Fyves of</h1>
        <div class="words">
            <h1 class="word">the Month.</h1>
            <h1 class="word">six Months.</h1>
            <h1 class="word">all time.</h1>
            <h1 class="word">the Month.</h1>
        </div>
    </div>
    <div class="mobile-wrapper" v-else>
        <h1 class="heading">Your Top Fyves</h1>
        <h4 class="heading">All in one place</h4>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const width = ref(window.innerWidth);
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        return { width };
    },
})
</script>

<style scoped>
h4.heading {
    margin-top: 0px;
    margin-bottom: -20px;
}
.mobile-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.mobile-words {
    display: flex;
    flex-direction: row;
    align-items: center;
}
h1 {
    font-size: 30px;
}
div.wrapper > div.words {
    height: 38px;
    overflow: hidden;
}
.wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 80px;
}
.words {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
h1.word {
    padding-left: 8px;
    margin: 0;
    animation: spin-words 10s infinite alternate;
}
.heading {
    transition: 1s ease-in-out;
}
@keyframes spin-words {
    0%{
        transform: translateY(0%);
    }
    15%{
        transform: translateY(0%);
    }
    30% {
        transform: translateY(-100%);
    }
    44%{
        transform: translateY(-100%);
        margin-right: 0px;
    }
    58%{
        transform: translateY(-200%);
        margin-right: -40px;
    }
    72%{
        transform: translateY(-200%);
        margin-right: -40px;
    }
    86%{
        transform: translateY(-300%);
        margin-right: 0px;
    }
    100%{
        transform: translateY(-300%);
    }
}
@keyframes spin-words-horizontally {
    0%{
        transform: translateX(0%);
    }
    15%{
        transform: translateX(0%);
    }
    30% {
        transform: translateX(-100%);
    }
    44%{
        transform: translateX(-100%);
    }
    58%{
        transform: translateX(-200%);
    }
    72%{
        transform: translateX(-200%);
    }
    86%{
        transform: translateX(-300%);
    }
    100%{
        transform: translateX(-300%);
    }
}
</style>