<template>
    <div class="info head">
        <h1>Think "Wrapped++"</h1>
        <div class="body-paragraph">
            <h4>Born to show off your data, SpotiFyve brings music insights, powered by you!</h4>
            <h4>Our system lets you view your listening data in a beautified pattern at any time year-round.</h4>
            <h4>You can call it "Wrapped with Classes" - we provide "hygher" levels of analysis!</h4>
        </div>
        <div class="block">
            <div class="info">
                <h1>Music Insights, Powered by You!</h1>
                <div class="body-paragraph">
                    <h4>With SpotiFyve's Hi-Fyve, you can see how "fyre" your favorite artists, albums, and tracks really are!</h4>
                    <h4>See your most played content on Spotify from the past month, 6 months, or the full extent of your listening history.</h4>
                    <h4>Our analysis tools provide deep insights into your music, so you can discover new favorites and elevate your listening experience.</h4>
                </div>
            </div>
            <div class="info">
                <ExampleArtistVue />
            </div>
        </div>
        <div class="block">
            <div class="info">
                <h1 class="rengoku">Set Your Heart Ablaze</h1>
                <div class="body-paragraph">
                    <h4>Looking for new music to enjoy?<br>Try our song recommendation system, expertly curated based on your Spotify listening habits.</h4>
                    <h4>Our system will help you discover tracks that fit your personal taste and musical preferences. </h4>
                    <h4>No need to search endlessly - let us help you find your new go-to songs with just a few clicks.</h4>
                </div>
            </div>
            <ExampleRecommendationVue />
        </div>
        <div class="block bottom">
            <div class="info">
                <h1>Introducing <span>Synesthesia.</span></h1>
                <div class="body-paragraph">
                    <h4>With Synesthesia, you can visualize your audio in a whole new way.</h4>
                    <h4> Our service generates a unique animated pattern based on your Spotify listening habits,<br>creating a personalized and immersive experience.</h4>
                    <h4> This pattern allows you to see your music in a whole new way by letting you visualize your songs.<br>Try Synesthesia and truly see how your music sounds!</h4>
                </div>
            </div>
            <ExampleSynesthesiaVue />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExampleArtistVue from './ExamplePanels/ExampleArtist.vue';
import ExampleSynesthesiaVue from './ExamplePanels/ExampleSynesthesia.vue';
import ExampleRecommendationVue from './ExamplePanels/ExampleRecommendation.vue';

export default defineComponent({
    components: {
        ExampleArtistVue,
        ExampleSynesthesiaVue,
        ExampleRecommendationVue,
    },
    setup() {
        return {  };
    },
})
</script>

<style scoped>
.rengoku {
    color: var(--rengoku-static);
}
/*
.rengoku {
    background-image: var(--rengoku);
    background-position: left;
    background-size: 400%;
    animation: bg-animation 30s infinite alternate;
    background-clip: text;
    color: transparent;
}
*/
span {
    background-image: var(--info-text-synesthesia);
    background-position: left;
    background-size: 400%;
    animation: bg-animation 30s infinite alternate;
    background-clip: text;
    color: transparent;
}
.block.bottom {
    margin-bottom: 120px;
}
.head {
    margin-top: 50px;
}
.info {
    border-radius: 40px;
    width: 94%;
    padding: 50px 3%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
}
.block {
    margin: 180px auto 60px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
}
.body-paragraph {
    color: #ccc;
}
@media (max-width: 775px) { 
    .block { 
        flex-direction: column;
        justify-content: center;
    }
}
</style>