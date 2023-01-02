<template>
    <div class="logged-in-synesthesia-wrapper">
        <h1>Introducing <span>Synesthesia🎜</span></h1>
        <h2><span><strong>Let's get started.</strong></span></h2>
        <div class="select-menu" v-if="!isGenerating">
            <div class="type-selector">
                <span id="go-back" @click="!isCustomize ? handleCustomizationChange() : ''" class="material-symbols-outlined go-back" :class="{ off: isCustomize }">chevron_left</span>
                <h3>{{ isCustomize ? "Customize your Synesthesia🎜" : "Make It For Me! 🎜" }}</h3>
                <span id="go-forward" @click="isCustomize ? handleCustomizationChange() : ''" class="material-symbols-outlined go-forward" :class="{ off: !isCustomize }">chevron_right</span>
            </div>
            <div class="select-menu-no-bg" v-if="isCustomize">
                <div class="select-menu-centered">
                    <div class="buttons">
                        <h2 class="select-menu-heading-text">Select a Time Frame</h2>
                    </div>
                    <h3 class="select-menu-heading-text">Current selection: <span id="time-frame-identifier">
                    {{ 
                        !time_frame ? 'None' 
                        : time_frame === 'short_term' ? 'One Month'
                        : time_frame === 'medium_term' ? '6 Months'
                        : 'All Time'
                    }}
                    </span></h3>
                    <div class="buttons">
                        <h3 class="select-menu-options" @click="time_frame==='short_term' ? time_frame=null : time_frame='short_term'" :class="{ active: time_frame==='short_term', mark: time_frame==='short_term' }">One Month</h3>
                        <h3 class="select-menu-options" @click="time_frame==='medium_term' ? time_frame=null : time_frame='medium_term'" :class="{ active: time_frame==='medium_term', mark: time_frame==='medium_term' }">6 Months</h3>
                        <h3 class="select-menu-options" @click="time_frame==='long_term' ? time_frame=null : time_frame='long_term'" :class="{ active: time_frame==='long_term', mark: time_frame==='long_term' }">All Time</h3>
                    </div>
                </div>
                <div class="select-menu-centered">
                    <div class="buttons">
                        <h2 class="select-menu-heading-text">Adjust Item Quantity</h2>
                    </div>
                    <h3 class="select-menu-heading-text">Current quantity: <span style="color: #a9d2f5">{{ range }}</span></h3>
                    <div class="buttons">
                        <input type="range" id="" min="1" max="50" v-model="range">
                    </div>
                </div>
            </div>
            <div v-else>
                <br>                
                <br>                
                <br>                 
            </div>
            <p style="color: #ff4000" v-if="!time_frame">Please select a Time Frame to continue!</p>
            <br>
            <button class="let-there-be-color" :class="{ off: !time_frame }" @click="time_frame ? generateSynesthesia() : ''"><h3>Let there be COLOR!</h3></button>
            <br>
            <br>
        </div>
        <MediaVisualizerVue :time_frame="(time_frame as string)" :range="range" :type="'tracks'" v-else />
    </div> 
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import MediaVisualizerVue from './MediaVisualizer.vue';

export default defineComponent({
    components: {
        MediaVisualizerVue,
    },
    setup() {
        const time_frame = ref(null) as Ref<unknown>;
        const range = ref(26) as Ref<number>;
        const isCustomize = ref(true); 
        const isGenerating = ref(false);

        const handleCustomizationChange = () => {
            isCustomize.value = !isCustomize.value;
            if (!isCustomize.value) {
                const choice_matrix: Array<string> = [ 'short_term',  'medium_term',  'long_term' ]
                const random_time_frame = Math.floor(Math.random() * 3);
                const random_range = Math.ceil(Math.random() * 50);
                time_frame.value = choice_matrix[random_time_frame];
                range.value = random_range;
            }
            else {
                time_frame.value = null;
                range.value = 26;
            }
        }
        const generateSynesthesia = () => {
            if (time_frame.value) {
                isGenerating.value = !isGenerating.value;
            }
        }
        
        return { time_frame, range, isCustomize, isGenerating, handleCustomizationChange, generateSynesthesia, };
    },
})
</script>

<style scoped>
.let-there-be-color.off:hover {
    transform: none;
    opacity: 0.5;
}
.let-there-be-color.off {
    box-shadow: none;
    opacity: 0.5;
}
.let-there-be-color:hover {
    opacity: 1;
    transform: translateY(1px);
}
.let-there-be-color {
    box-shadow: 0 0 8px #d3d3d3;
    opacity: 0.9;
    color: #f3f3f3;
    padding: 10px 20px;
    border-radius: 20px;
    border: 0;
    margin: auto auto 20px;
    cursor: pointer;
    background-image: var(--info-text-synesthesia);
    animation: bg-animation 30s infinite alternate;
    background-size: 400%;
    background-position: left;
}
span.go-back.off, span.go-forward.off, .off { 
    opacity: .5;
    cursor: not-allowed;
}
span.go-back:hover, span.go-forward:hover {
    transform: translateY(1px);
    box-shadow: 0 0 8px #ddd;
}
span.go-back.off:hover, span.go-forward.off:hover {
    transform: none;
    box-shadow: none;
}
span.go-back, span.go-forward {
    border: 1px solid rgb(69, 69, 69);
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    color: #ddd;
    border-radius: 60px;
    padding: 4px;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    transition: .05s ease-in-out;
}
.type-selector {
    margin: 40px 0 -20px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-width: 40%;
    height: 10%;
}
span#time-frame-identifier {
    color: #a9d2f5;
}
input[type="range"] {
  width: 67%;
}
.select-menu-heading-text {
    text-shadow: 0 0 5px rgba(0,0,0,1)
}
.buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 50%;
    height: 75px;
    margin: 0 auto;
    border-radius: 20px;
}
.select-menu:hover {
    background-color: rgba(221, 221, 221, 0.125);
}
.select-menu {
    transition: .2s ease-in-out;
    width: 100%;
    margin: 40px auto;
    background-color: rgba(221, 221, 221, 0.1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 -2px 8px rgb(182, 182, 182);
}
.select-menu-no-bg {
    transition: .2s ease-in-out;
    width: 100%;
    margin: 40px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}
.select-menu-centered {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0;
}
.select-menu-options::before {
    box-shadow: 0 0 4px rgba(46, 46, 46, 0.8);
    background-color: #d3499a;
    content: "";
    position: absolute;
    width: calc(100% + 8px);
    height: 60%;
    left: -2px;
    bottom: 0;
    z-index: -1;
    transform: rotate(-2deg);
}
.select-menu-options {
    color: #EFF8FD;
    transition: .1s ease-in-out;
    position: relative;
    cursor: pointer;
}
.select-menu-options:hover, .active {
    transform: translateY(1px);
}
.active:hover {
    color: #fff;
}
.mark {
    position: relative;
}
.mark::after {
    border: .25em solid white;
    border-right: none;
    border-radius: 1.5em 1em 2em 1.5em;
    bottom: -.7em;
    content: '';
    left: -.9em;
    position: absolute;
    right: -.8em;
    top: -.3em;
    transform: rotate(-4deg) translateY(2px);
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
@media (max-width: 1000px) {
    h1 {
        font-size: 32px;
    }
}
</style>