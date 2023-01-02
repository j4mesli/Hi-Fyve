<template>
    <button v-if="(!spinner)" @click="login">
            <div class="logo">
                <img src="../../../public/spotify_logo.png">
            </div>
            <p class="button">Continue With Spotify</p>
    </button>
    <LoadingSpinnerVue v-else />
    <div class="blurb">
        <h4>Hi-Fyve is the perfect tool for music enthusiasts who want to understand their listening habits in greater detail. Our service generates personalized analytics and statistics based on a user's online music activity, presenting the information in a visually appealing, minimalistic format. With Hi-Fyve, users can easily see their favorite artists and tracks, and get a deeper understanding of their music tastes. Give it a try and get to know your music listening habits like never before.</h4>
    </div>
    <h3 style="margin-top: 90px;">What your Hi-Fyve could look like!</h3>
    <div class="type-selector">
        <span id="go-back" @click="item === 'Tracks' ? goBack() : ''" class="material-symbols-outlined" :class="{ off: item === 'Artists' }">chevron_left</span>
        <h2>Demo Top {{ item }}</h2>
        <span id="go-forward" @click="item === 'Artists' ? goForward() : ''" class="material-symbols-outlined" :class="{ off: item === 'Tracks' }">chevron_right</span>
    </div>
    <demoArtistsVue v-if="item === 'Artists'"/>
    <demoTracksVue v-else-if="item === 'Tracks'"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import demoArtistsVue from './demoArtists.vue';
import demoTracksVue from './demoTracks.vue';

export default defineComponent({
    components: {
        demoArtistsVue,
        demoTracksVue,
        LoadingSpinnerVue,
    },
    setup() {
        const item = ref('Artists');
        const goBack = () => { item.value === 'Tracks' ? item.value = 'Artists' : '' };
        const goForward = () => { item.value === 'Artists' ? item.value = 'Tracks' : '' };
        const spinner = ref(false);
        // login function
        const login = async () => {
            spinner.value = true;
            await fetch('http://localhost:3000/getURL')
            .then(res => {
                return res.json();
            })
                .then(data => {
                    window.open(data.url, '_self');
                })
                .catch(err => console.log(err))
            .catch(err => console.log(err));
        };

        return { item, spinner, goBack, goForward, login };
    },
})
</script>

<style scoped>
@media (max-width: 1250px) {
    .type-selector {
        min-width: 80%;
    }
    span {
        margin: auto 20px;
    }
}
.blurb {
    width: 60%;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
p.button {
    font-family: 'Figtree', 'Avenir', sans-serif;
    background-image: var(--home-panel-sync-button);
    background-clip: text;
    background-size: 400%;
    animation: bg-animation 30s infinite alternate;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
}
p.button:hover {
    background-image: var(--home-panel-sync-button-hover);
}
.logo {
    width: 1.5rem;
    height: 1.5rem;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
}
img {
    width: 100%;
    height: 100%;
}
button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 30px;
    border-radius: 20px;
    border: 1px solid #f3f3f3;
    transition: .1s ease-in-out;
    background-color: rgba(255, 255, 255, 0.2);
    color: transparent;
}
button:hover {
    transform: translateY(1px);
    background-color: rgba(32, 218, 97, 0.6);
    color: #f3f3f3;
}
.type-selector {
    transition: .1s ease-in-out;
    margin: 40px auto;
    min-width: 60%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
}
span#go-back.off:hover, span#go-forward.off:hover {
    transform: none;
    box-shadow: none;
}
span#go-back:hover, span#go-forward:hover {
    transform: translateY(1px);
    box-shadow: 0 0 8px #ddd;
}
span#go-back, span#go-forward {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 60px;
    padding: 4px;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    transition: .05s ease-in-out;
}
span#go-back.off, span#go-forward.off, .off { 
    opacity: .5;
    cursor: not-allowed;
}
@media (max-width: 900px) {
    .blurb {
        width: 80%;
    }
}
@media (max-width: 500px) {
    button {
        margin-top: 40px;
    }
}
</style>