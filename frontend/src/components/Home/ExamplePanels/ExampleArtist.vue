<template>
    <div class="example-artist">
        <div class="display-as-row">
            <img class="small-logo" src="../../../../public/spotify_logo.png" />
            <h2 class="title">#1. Miguel</h2>
        </div>
        <h4>Most Popular Track: <span>Sure Thing</span></h4>
        <div class="pfp"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {  };
    },
})
</script>

<style scoped>
h2.title {
    padding: 0;
    margin: 0 0 -25px 0;
}
h4 {
    margin: -25px 0;
    font-weight: 500;
}
span {
    font-weight: 600;
}
.example-artist {
    box-shadow: 0 0 8px #ddd;
    flex-shrink: 0;
    border-radius: 10px;
    min-width: 300px;
    height: 500px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    background-size: 400%;
    background-image: var(--tamagotchi);
    animation: bg-animation 15s infinite alternate;
}
.pfp {
    margin: 0;
    border: 1px solid #ddd;
    background-image: url('https://i.scdn.co/image/ab6761610000517402eeb5305fa7bdd9ddca42fc');
    width: 250px;
    height: 300px;
    background-position: center; 
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>