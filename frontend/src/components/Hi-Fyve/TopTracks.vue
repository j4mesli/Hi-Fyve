<template>
    <LoadingSpinnerVue v-if="data.length === 0"/>
    <div v-else-if="data.length !== 0" class="top-artists-wrapper">
        <div class="artist-card" :class="{ 'open': index === 0, 'bottom': evaluateBottomWindow(index), 'top': index === 0 }" @click="e => closeHere(e)" v-for="(track, index) in (data as any[])" :key="track">
            <div class="body-paragraph" :class="{ 'closed': index > 0 }">
                <h2 class="title">#{{index + 1}}. {{ longName(track.name) }} <a target="_blank" :href="(data as any[])[index].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Artist(s): 
                    <span v-for="(artist, index) in track.artists" :key="artist" style="flex-direction: row">
                        <a target="_blank" :href="artist.external_urls.spotify">
                            {{ artist.name }}
                        </a>
                        <span v-if="index !== track.artists.length - 1" style="transform: translateY(0);">, </span>
                    </span>
                </h4>
                <h4 :class="{ 'hide-child-element': index > 0 }">Popularity: <span>{{ track.popularity }} / 100</span></h4>
                <h4 :class="{ 'hide-child-element': index > 0 }">Duration: <span>{{ convertMilliseconds(track.duration_ms) }}</span></h4>
                <h4 :class="{ 'hide-child-element': index > 0 }">Descriptors: 
                    <span class="track-attributes" v-for="(attribute, i) in track_attrs[index]" :key="attribute" style="flex-direction: row">
                        <span :style="'color:' + attribute[1]">{{attribute[0]}}</span>
                        <span v-if="i !== (track_attrs as Array<Array<string>>)[index].length - 1" style="transform: translateY(0);">, </span>
                    </span></h4>
            </div>
            <div class="pfp" :class="{ 'minimized': index > 0 }" :style="{ 'background-image': `url(${track.album.images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
    </div>
    <h1 v-if="error" style="color: red">ERROR: {{ error }}</h1>
    <LoadingSpinnerVue v-if="hideButton"/>
    <button v-if="data.length!==0 && !hideButton" class="load-more" @click="loadAllTracks()"><h3>Load 5 More</h3></button>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import { getUserInformation } from '../functions/getUserInformation';
import { addCommasToNumber } from '../functions/addCommasToNumber';
import { evaluateParameters } from '../functions/evaluateParameters';
import { attributeToColor } from '../functions/attributeToColor';
import { handleUserInformation } from '../interfaces/handleUserInformationInterface';

export default defineComponent({
    emits: ['allowClicks'],
    components: {
        LoadingSpinnerVue,
    },
    props: {
        item: String,
        timeframe: String,
    },
    setup(props, context) {
        const hideButton = ref(false);
        const data = ref([]) as Ref<unknown[]>;
        const error = ref(null);
        const track_attrs = ref([]) as Ref<unknown[]>;
        // watch hook for updated time-frame value
        watch(() => props.timeframe, async (newValue) => {
            data.value = [] as unknown[];
            track_attrs.value = [] as unknown[];
            context.emit('allowClicks', false as boolean);
            const params: handleUserInformation = {
                request_type: props.item as string,
                time_range: newValue as string,
                limit: "5",
                offset: "0",
            };
            await getUserInformation(params)
                .then(async res => {
                    const items: Array<typeof res.items> = res.items;
                    for await (const item of items) {
                        await fetch('http://localhost:3000/getTrackFeatures?id=' + item.id + '&access_token=' + sessionStorage.access_token)
                            .then(res => { return res.json() })
                                .then(res => {
                                    let attributes: { [key: string]: Array<string | number> } = evaluateParameters(res);
                                    const attrs: Array<Array<string>> = attributeToColor(attributes);
                                    track_attrs.value.push(attrs);
                                    if (track_attrs.value.length === items.length) {
                                        data.value = items.slice(0,items.length);
                                        context.emit('allowClicks', true as boolean);
                                    }
                                })
                                .catch(err => error.value = err)
                            .catch(err => error.value = err);
                    }
                })
                .catch(err => error.value = err);
        });
        // update function for showAll button click
        const loadAllTracks = async () => {
            const bottomElement = (document.querySelector('.bottom') as HTMLElement) as HTMLElement;
            hideButton.value = !hideButton.value;
            context.emit('allowClicks', false as boolean);
            const params: handleUserInformation = {
                request_type: props.item as string,
                time_range: props.timeframe as string,
                limit: "5",
                offset: (data.value.length + 5).toString(),
            };
            await getUserInformation(params)
                .then(async res => {
                    const items: Array<typeof res.items> = res.items;
                    for await (const item of items) {
                    await fetch('http://localhost:3000/getTrackFeatures?id=' + item.id + '&access_token=' + sessionStorage.access_token)
                        .then(res => { return res.json() })
                            .then(res => {
                                let attributes: { [key: string]: Array<string | number> } = evaluateParameters(res);
                                const attrs: Array<Array<string>> = attributeToColor(attributes);
                                track_attrs.value.push(attrs);
                                if (track_attrs.value.length === (data.value.length+5)) {
                                    data.value.push(...items.slice(0,items.length));
                                    context.emit('allowClicks', true as boolean);
                                    hideButton.value = !hideButton.value;
                                    // the following reiteration of the 'close/open' function patches the bug that the .artist-card bottom
                                    // automatically closes on loading of additional cards and doesn't close the card contents with it
                                    if (bottomElement.classList.contains('open')) {
                                        bottomElement.children[1].classList.toggle('minimized');
                                        for (let i = 2; i < bottomElement.children[0].children.length; i++) {
                                            bottomElement.children[0].children[i].classList.toggle('hide-child-element');
                                            bottomElement.children[0].classList.toggle('closed');
                                        }
                                    }
                                }
                            })
                            .catch(err => error.value = err)
                        .catch(err => error.value = err);
                    }
                })
                .catch(err => error.value = err);
        };
        
        // js QOL functions
        const addCommas = (x: string | number) => {
            return typeof x === 'string' ? addCommasToNumber(parseInt(x)) : addCommasToNumber(x);
        };
        const evaluateBottomWindow = (num: number) => {
            return num+1 === data.value.length;
        };
        const convertMilliseconds = (num: number) => {
            const date = new Date(num);
            return date.getMinutes() + ' min, ' + date.getSeconds() + ' sec'
        };
        const longName = (name: string) => {
            return name.length > 23 ? name.slice(0,21) + '...' : name;
        };

        // get data
        const params: handleUserInformation = {
            request_type: props.item as string,
            time_range: props.timeframe as string,
            limit: "5",
            offset: "0",
        };
        onMounted(async () => {
            data.value = [] as unknown[];
            track_attrs.value = [] as unknown[];
            context.emit('allowClicks', false as boolean);
            await getUserInformation(params)
                .then(async res => {
                    const items: Array<typeof res.items> = res.items;
                    for await (const item of items) {
                        await fetch('http://localhost:3000/getTrackFeatures?id=' + item.id + '&access_token=' + sessionStorage.access_token)
                            .then(res => { return res.json() })
                                .then(res => {
                                    let attributes: { [key: string]: Array<string | number> } = evaluateParameters(res);
                                    const attrs: Array<Array<string>> = attributeToColor(attributes);
                                    track_attrs.value.push(attrs);
                                    if (track_attrs.value.length === items.length) {
                                        data.value = items.slice(0,items.length);
                                        context.emit('allowClicks', true as boolean);
                                    }
                                })
                                .catch(err => error.value = err)
                            .catch(err => error.value = err);
                    }
                })
                .catch(err => error.value = err);
        });

        // close/open window
        const closeHere = (e: MouseEvent) => {
            // CURRENTTARGET ONLY TARGETS THE ELEM WITH LISTENER
            if ((e.target as Element).id !== 'hyperlink') {
                const elem: Element = e.currentTarget as Element;
                if (elem.classList.contains('open')) {
                    elem.children[1].classList.toggle('minimized');
                    for (let i = 2; i < elem.children[0].children.length; i++) {
                        elem.children[0].children[i].classList.toggle('hide-child-element');
                        elem.children[0].classList.toggle('closed');
                    }
                }
                else {
                    setTimeout(() => {
                        elem.children[1].classList.toggle('minimized');
                        for (let i = 2; i < elem.children[0].children.length; i++) {
                            elem.children[0].children[i].classList.toggle('hide-child-element');
                            elem.children[0].classList.toggle('closed');
                        }
                    }, 300);
                }
                elem.classList.toggle('open');
            }
        }

        return { closeHere, data, error, addCommas, longName, track_attrs, evaluateBottomWindow, convertMilliseconds, loadAllTracks, hideButton };
    },
})
</script>

<style>
span.track-attributes {
    text-shadow: 0 0 4px rgba(46, 46, 46, 0.8);
}
span a:hover {
    transform: translateY(0);
    color: rgb(46, 46, 46);
    text-shadow: 0 0 4px rgba(211, 73, 154, 0.8);
}
span a {
    text-decoration: none; 
    color: inherit; 
    transform: translateY(-1px);
    transition: .1s ease-in-out;
    padding: auto 5px;
    border-radius: 20px;
}
#hyperlink:hover {
    box-shadow: 0 0 4px rgba(46, 46, 46, 0.8);
    background-color: #f3f3f3;
    color: rgb(46, 46, 46);
}
#hyperlink {
    transition: .1s ease-in-out;
    font-size: 12px;
    padding: 6px;
    border-radius: 40px;
    color: #f3f3f3;
}
.body-paragraph.closed {
    width: 300px;
}
.body-paragraph {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    width: 300px; 
}
.load-more:hover {
    box-shadow: 0 0 4px rgba(46, 46, 46, 0.8);
    background-color: #f3f3f3;
    color: rgb(46, 46, 46);
    cursor: pointer;
}
.load-more {
    transition: .2s ease-in-out;
    padding: 5px 40px;
    margin: 20px 0 60px;
    border-radius: 30px;
    border: 1px solid #ddd;
    background-color: transparent;
    color: #f3f3f3;
    cursor: pointer;
}
.hide-child-element {
    display: none;
}
.artist-card h2::before, .artist-card h4::before, .artist-card p::before {
    /* Highlight color */
    box-shadow: 0 0 4px rgba(46, 46, 46, 0.8);
    background-color: #d3499a;
    content: "";
    position: absolute;
    width: calc(100% + 4px);
    height: 60%;
    left: -2px;
    bottom: 0;
    z-index: -1;
    transform: rotate(-2deg);
}
.artist-card h2, .artist-card h4, .artist-card p {
    transform: translateY(1px);
    color: #EFF8FD;
}
.artist-card h2 {
    font-size: 20px;
}
.pfp.minimized {
    width: 100px;
    height: 100px;
}
.pfp {
    margin: 0;
    padding: 20px auto;
    box-shadow: 0 0 8px rgba(46, 46, 46, 0.8);
    border-radius: 10px;
    width: 275px;
    height: 350px;
    background-position: center; 
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.top-artists-wrapper {
    margin: 60px 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}
.artist-card.top {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.artist-card.bottom {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.artist-card {
    cursor: pointer;
    background-color: #F0A47D;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    flex-shrink: 0;
    width: 80%;
    height: 120px;
    border: 1px solid rgba(168,114,87,0.5);
    box-shadow: 0 0 6px rgba(168,114,87,0.6);
    transition: .4s ease-in-out;
}
.artist-card.open {
    height: 500px;
}
@media (max-width: 900px) {
    .artist-card.open {
        height: 700px;
        flex-direction: column;
    }
    .pfp.minimized {
        width: 80px;
        height: 80px;
        flex-shrink: 0;
    }
    .body-paragraph.closed {
        width: 200px;
        font-size: 12px;
    }
}
@media (max-width: 500px) { 
    .artist-card {
        width: 95%;
    }
    .body-paragraph {
        width: 80%;
    }
}
@media (max-width: 325px) { 
    .body-paragraph.closed {
        width: 150px;
        font-size: 10px;
    }
    .pfp.minimized {
        width: 70px;
        height: 70px;
    }
}
</style>

<style scoped>
span {
    text-transform: capitalize;
}
</style>