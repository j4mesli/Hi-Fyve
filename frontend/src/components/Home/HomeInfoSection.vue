<template>
    <div class="info head">
        <h1>Think "Wrapped++"</h1>
        <div class="body-paragraph">
            <h4>Born to show off your data, Hi-Fyve brings music insights, powered by you!</h4>
            <h4>Our system lets you view your listening data in a beautified pattern at any time year-round.</h4>
            <h4>You can call it "Wrapped with Classes" - we provide "hygher" levels of analysis!</h4>
        </div>
        <div class="block">
            <div class="info">
                <h1>Music Insights, Powered by You!</h1>
                <div class="body-paragraph">
                    <h4>With Hi-Fyve's Hi-Fyve, you can see how "fyre 🔥" your favorite artists, albums, and tracks really are!</h4>
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
                <h1>Introducing <span>Synesthesia🎜</span></h1>
                <div class="body-paragraph">
                    <h4>With Synesthesia, you can visualize your audio in a whole new way.</h4>
                    <h4> Our service generates a unique animated pattern based on your Spotify listening habits,<br>creating a personalized and immersive experience.</h4>
                    <h4> This pattern allows you to see your music in a whole new way by letting you visualize your songs.<br>Try Synesthesia and truly see how your music sounds!</h4>
                </div>
            </div>
            <div class="info" style="height: 500px;">
                <ExampleSynesthesiaVue />
            </div>
        </div>
        <div class="block bottom">
            <div class="info">
                <h1 class="ebtr">Everything But The Rain 🌧️</h1>
                <div class="body-paragraph">
                    <h4>Want to get even more out of your music listening experience?</h4>
                    <h4>Our analytics system provides detailed analysis of your online music habits,<br>including your favorite songs and artists, listening patterns, and more.</h4>
                    <h4>With this feature, you can track and compare your listening habits over time, letting you learn everything about your music tastes.</h4>
                </div>
            </div>
            <div class="info">
                <ExampleAnalyticsVue />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExampleArtistVue from './ExamplePanels/ExampleArtist.vue';
import ExampleSynesthesiaVue from './ExamplePanels/ExampleSynesthesia.vue';
import ExampleAnalyticsVue from './ExamplePanels/ExampleAnalytics.vue';

export default defineComponent({
    components: {
        ExampleArtistVue,
        ExampleSynesthesiaVue,
        ExampleAnalyticsVue,
    },
    setup() {
        return {  };
    },
})
</script>

<style scoped>
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
.ebtr {
    color: var(--ebtr);
}
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
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}
.block {
    width: 80%;
    margin: 180px auto 60px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}
.body-paragraph {
    color: #ccc;
}
@media (max-width: 775px) { 
    .block { 
        width: 100%;
        flex-direction: column;
        justify-content: center;
    }
}
</style>