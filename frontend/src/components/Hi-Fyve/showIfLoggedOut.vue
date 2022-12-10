<template>
    <div class="Hi-Fyve-Content-wrapper">
        <rotatingWordsVue />
        <div class="Hi-Fyve-Content-nested-wrapper">
            <div class="Hi-Fyve-Content">
                <h1>Your Favorite Artists, Tracks, and More</h1>
               
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import rotatingWordsVue from './rotatingWords.vue';

export default defineComponent({
    components: {
        rotatingWordsVue,
    },
    setup() {
        
        return {  };
    },
})
</script>

<style>
.Hi-Fyve-Content {
    border: 1px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 80%;
    min-height: 100px;
    border-radius: 20px;
    margin: 20px auto;
}
.Hi-Fyve-Content-nested-wrapper { 
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
}
.Hi-Fyve-Content-wrapper {
    background-image: var(--hi-fyve-wrapper);
    margin: 20px auto;
    width: 90%;
    min-height: 600px;
    border-radius: 40px;
    background-position: left;
    transition: 0.5s ease-in-out;
    animation: bg-animation 30s infinite alternate;
    background-size: 400%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
}
.Hi-Fyve-Content-wrapper:hover{ 
    width: 95%;
    box-shadow: 0 -2px 10px 10px rgb(58, 58, 58);
}

@media (max-width: 1250px) {
    .Hi-Fyve-Content { 
        width: 80%;
    }
    .Hi-Fyve-Content-nested-wrapper { 
        flex-direction: column;
    }
    .Hi-Fyve-Content-wrapper {
        flex-direction: column;
        width: 98%;
    }
    .Hi-Fyve-Content-wrapper:hover{ 
        width: 100%;
    }
}
@media (max-width: 500px) {
    .Hi-Fyve-Content { 
        width: 95%;
    }
}
</style>