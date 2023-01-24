<template>
    <div class="wrapper">
        <h1 style="font-size: 40px;">Analytics 📈</h1>
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
            Analytics for you, by you! <span style="color: rgb(29,185,84)">Hi-Fyve</span>'s analytics service pulls data from a user's Spotify account and generates detailed analytics and statistics from it!
            Users can sync their accounts with our service and view the different songs and genres that they favor, and which ones they listened more/less to recently! On top of that, a user can
            compare their listening habits within the past month to a country of their choosing to see analytics on similarities and differences between their habits and the country's habits!
        </p>
        <demoAnalyticsVue v-if="showDemo" />
        <h3 @click="showDemo = !showDemo" class="show-hide-demo" v-if="!showDemo">Click Here to See What Our Analytics 📈 Can Show You!!</h3>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import demoAnalyticsVue from './demoAnalytics.vue';

export default defineComponent({
    components: {
        LoadingSpinnerVue,
        demoAnalyticsVue,
    },
    setup() {
        const spinner = ref(false);
        const showDemo = ref(false);
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
        
        return { spinner, login, showDemo };
    },
})
</script>

<style scoped>
.show-hide-demo {
    margin: 90px auto 40px; 
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
    font-weight: 500;
}
.wrapper {
    width: 90%;
    min-height: 100px;
    margin: 20px auto;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 0 4px #ddd;
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
    margin-top: 40px;
}
button:hover {
    transform: translateY(1px);
    background-color: rgba(32, 218, 97, 0.6);
    color: #f3f3f3;
}
@media (max-width: 1000px) {
    h1 {
        font-size: 32px;
    }
    .description {
        width: 80%;
    }
}
@media (max-width: 500px) {
    p {
        width: 80%;
        font-size: 12px;
    }
    p.button {
        font-size: 12px;
    }
    .wrapper {
        width: 80%;
    }
}
</style>