<template>
    <div class="Hi-Fyve-Content-wrapper logged-in" :style="{ 'background-image': colors }">
        <div class="type-selector">
            <span id="go-back" @click="toggleClicks ? goBack() : ''" class="material-symbols-outlined" :class="{ off: item === 'Artists' || !toggleClicks }">chevron_left</span>
            <h2>Your Top {{ item }}</h2>
            <span id="go-forward" @click="toggleClicks ? goForward() : ''" class="material-symbols-outlined" :class="{ off: item === 'Tracks' || !toggleClicks }">chevron_right</span>
        </div>
        <nav :class="{ 'off': !toggleClicks }">
            <a @click="toggleClicks ? timeframe = 'short_term' : ''" :class="{ active: timeframe === 'short_term', off: !toggleClicks }"><h3>1 Month</h3></a>
            <a @click="toggleClicks ? timeframe = 'medium_term' : ''" :class="{ active: timeframe === 'medium_term', off: !toggleClicks }"><h3>6 Months</h3></a>
            <a @click="toggleClicks ? timeframe = 'long_term' : ''" :class="{ active: timeframe === 'long_term', off: !toggleClicks }"><h3>All Time</h3></a>
        </nav>
        <!-- <TopRecommendationsVue @allowClicks="allowClicks" :item="item.toLowerCase()" :timeframe="timeframe" v-if="item === 'Recommendations'" /> -->
        <TopArtistsVue @allowClicks="allowClicks" :item="item.toLowerCase()" :timeframe="timeframe" v-if="item === 'Artists'" />
        <TopTracksVue @allowClicks="allowClicks" :item="item.toLowerCase()" :timeframe="timeframe" v-else-if="item === 'Tracks'" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import TopRecommendationsVue from './TopRecommendations.vue';
import TopArtistsVue from './TopArtists.vue';
import TopTracksVue from './TopTracks.vue';

export default defineComponent({
    components: {
        // TopRecommendationsVue,
        TopArtistsVue,
        TopTracksVue,
    },
    setup() {
        // properties
        const item = ref('Artists');
        const timeframe = ref('short_term');
        const counter = ref(5);
        const colors = ref('var(--info-text-synesthesia)');
        const toggleClicks = ref(false);
        // methods
        const goBack = () => {
            if (toggleClicks.value) {
                switch (item.value) {
                    case 'Tracks':
                        item.value = 'Artists';
                        colors.value = 'var(--info-text-synesthesia)';
                        break;
                }
            }
        }
        const goForward = () => {
            if (toggleClicks.value) {
                switch (item.value) {
                    case 'Artists':
                        item.value = 'Tracks';
                        colors.value = 'var(--rengoku)';
                        break;
                }
            }
        }
        const allowClicks = (value: boolean) => {
            switch (value) {
                case true:
                    toggleClicks.value = true;
                    break;
                case false:
                    toggleClicks.value = false;
                    break;
            }
        }

        return { item, counter, timeframe, colors, goBack, goForward, allowClicks, toggleClicks };
    },
})
</script>

<style scoped>
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
.type-selector {
    transition: .1s ease-in-out;
    margin: 40px auto;
    min-width: 60%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
}
img {
    width: 100%;
    height: 100%;
}
h1 {
    transition: .2s ease-in-out;
}
nav a::before {
    box-shadow: 0 0 8px #fff;
    background-color: #D3499A;
    content: "";
    position: absolute;
    width: calc(100% + 4px);
    height: 60%;
    left: -2px;
    bottom: 0;
    z-index: -1;
    transform: rotate(-2deg);
}
nav a:hover, .active {
    transform: translateY(1px);
}
.active:hover {
    color: #fff;
}
nav a {
    position: relative;
    cursor: pointer;
    margin: 0 20px;
    padding: auto 50px;
    transition: .1s ease-in-out;
}
nav {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
}
.Hi-Fyve-Content-wrapper .logged-in {
    justify-content: space-evenly;
}
@media (max-width: 1250px) {
    .type-selector {
        min-width: 80%;
    }
}
@media (max-width: 710px) {
    nav {
        width: 80%;
    }
}
@media (max-width: 450px) {
    nav {
        width: 100%;
    }
    nav h3 {
        font-size: 16px;
    }
}
@media (max-width: 330px) {
    nav h3 {
        font-size: 10px;
    }
}
</style>