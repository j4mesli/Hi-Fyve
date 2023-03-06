<template>
    <h1>Introducing <span>Synesthesia🎜</span></h1>
    <h2>Envision your music <span><strong>boldly.</strong></span></h2>
    <!-- <LoggedOutSampleSynesthesiaVue /> -->
    <div class="login-button">
        <button v-if="(!spinner)" @click="login">
            <div class="logo">
                <img class="small-logo" src="../../../public/spotify_logo.png">
            </div>
            <p class="button">Continue With Spotify</p>
        </button>
        <LoadingSpinnerVue v-else />
    </div>
    <p class="description">
        With Synesthesia, you can visualize your audio in a whole new way.
        Our service generates a unique animated pattern based on your Spotify listening habits,
        creating a personalized and immersive experience.
        This pattern allows you to see your music in a whole new way by letting you visualize your songs.
        Try Synesthesia and truly see how your music sounds!
    </p>
    <h3 @click="showDemo = !showDemo" class="show-hide-demo" v-if="!showDemo">Click Here to See What Your Hi-Fyve could look like!</h3>
    <!-- <img class="demo-visualizer" src="../../../public/sample_synesthesia_visualizer.gif" v-if="showDemo && item === 'Visualizer'"> -->
    <h3 v-if="showDemo">Demo Color Board</h3>
    <img class="demo-colorboard" src="../../../public/examplesynesthesia.jpeg" v-if="showDemo">
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';

export default defineComponent({
    components: {
        LoadingSpinnerVue,
    },
    setup() {
        const showDemo = ref(false);
        const item = ref('Visualizer');
        const spinner = ref(false);

        // go back/forward functions
        const goBack = () => { item.value === 'Color Board' ? item.value = 'Visualizer' : '' };
        const goForward = () => { item.value === 'Visualizer' ? item.value = 'Color Board' : '' };

        // login function
        const login = async () => {
            spinner.value = true;
            await fetch('https://spotifyve-backend.herokuapp.com/getURL')
            .then(res => {
                return res.json();
            })
                .then(data => {
                    window.open(data.url, '_self');
                })
                .catch(err => console.log(err))
            .catch(err => console.log(err));
        };
        
        return { spinner, login, showDemo, item, goBack, goForward };
    },
})
</script>

<style scoped>
.demo-colorboard {
    width: 430px;
    height: 800px;
}
.demo-visualizer{
    border-radius: 10px;
    box-shadow: 0 0 8px #ddd;
    width: 800px;
    height: 800px;
}
.type-selector {
    transition: .1s ease-in-out;
    margin: 40px auto;
    width: 60%;
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
    color: #f3f3f3;
}
span#go-back.off, span#go-forward.off, .off { 
    opacity: .5;
    cursor: not-allowed;
}
.show-hide-demo {
    margin: 90px; 
    cursor: pointer;
    color: #f3f3f3;
    transition: .2s ease-in-out;
}
.show-hide-demo:hover {
    transform: translateY(2px);
    text-decoration: underline;
    color: #01a2d3;
}
.description {
    width: 50%;
    margin: 40px auto;
}
.login-button {
    width: 100%;
    margin: 40px auto;
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: #bbb;
}
button:hover {
    transform: translateY(1px);
    background-color: rgba(32, 218, 97, 0.6);
    color: #f3f3f3;
}
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
@media (max-width: 1250px) {
    .type-selector {
        min-width: 80%;
    }
}
@media (max-width: 1000px) {
    h1 {
        font-size: 32px;
    }
}
@media (max-width: 900px) {
    .demo-visualizer {
        width: 500px;
        height: 500px;
    }
}
@media (max-width: 500px) {
    p {
        width: 80%;
        font-size: 12px;
    }
    .demo-visualizer {
        width: 300px;
        height: 300px;
    }
    .demo-colorboard {
        width: 300px;
        height: 555px;
    }
}
@media (max-width: 300px) {
    .demo-visualizer {
        width: 200px;
        height: 200px;
    }
    .demo-colorboard {
        width: 200px;
        height: 365px;
    }
}
</style>