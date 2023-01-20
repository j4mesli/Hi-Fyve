<template>
    <LoadingSpinnerVue v-if="data.length === 0 && top5.length === 0"/>
    <div v-else class="top-artists-wrapper">
        <div class="artist-card top open" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[0]">
            <div class="body-paragraph">
                <h2 class="title">#1. {{ (top5 as any[])[0].name }} <a target="_blank" :href="(top5 as any[])[0].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[0] }}</span></h4>
                <h4>Genre(s): 
                    <span v-if="(top5 as any[])[0].genres.length >= 1">{{ (top5 as any[])[0].genres[0] }}</span>
                    <span v-if="(top5 as any[])[0].genres.length >= 2">, {{ (top5 as any[])[0].genres[1] }}</span>
                </h4>                
                <h4>Popularity: <span>{{ (top5 as any[])[0].popularity }} / 100</span></h4>
                <h4>Followers: <span>{{ addCommas((top5 as any[])[0].followers.total) }}</span></h4>
            </div>
            <div class="pfp" :style="{ 'background-image': `url(${(top5 as any[])[0].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[1]">
            <div class="body-paragraph closed">
                <h2 class="title">#2. {{ (top5 as any[])[1].name }} <a target="_blank" :href="(top5 as any[])[1].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[1] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[1].genres.length >= 1">{{ (top5 as any[])[1].genres[0] }}</span>
                    <span v-if="(top5 as any[])[1].genres.length >= 2">, {{ (top5 as any[])[1].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[1].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[1].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[1].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[2]">
            <div class="body-paragraph closed">
                <h2 class="title">#3. {{ (top5 as any[])[2].name }} <a target="_blank" :href="(top5 as any[])[2].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[2] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[2].genres.length >= 1">{{ (top5 as any[])[2].genres[0] }}</span>
                    <span v-if="(top5 as any[])[2].genres.length >= 2">, {{ (top5 as any[])[2].genres[1] }}</span>
                </h4>                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[2].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[2].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[2].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[3]">
            <div class="body-paragraph closed">
                <h2 class="title">#4. {{ (top5 as any[])[3].name }} <a target="_blank" :href="(top5 as any[])[3].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[3] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[3].genres.length >= 1">{{ (top5 as any[])[3].genres[0] }}</span>
                    <span v-if="(top5 as any[])[3].genres.length >= 2">, {{ (top5 as any[])[3].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[3].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[3].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[3].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" :class="{ 'bottom': data.length === 0 }" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[4]">
            <div class="body-paragraph closed">
                <h2 class="title">#5. {{ (top5 as any[])[4].name }} <a target="_blank" :href="(top5 as any[])[4].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[4] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[4].genres.length >= 1">{{ (top5 as any[])[4].genres[0] }}</span>
                    <span v-if="(top5 as any[])[4].genres.length >= 2">, {{ (top5 as any[])[4].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[4].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[4].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[4].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" :class="{ 'bottom': evaluateBottomWindow(index) }" @click="e => closeHere(e)" v-if="data.length !== 0" v-for="(artist, index) in (data as Array<any>)" :key="artist">
            <div class="body-paragraph closed">
                <h2 class="title">#{{index + 6}}. {{ artist.name }} <a target="_blank" :href="(data as Array<any>)[index].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[6+index] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="artist.genres.length >= 1">{{ artist.genres[0] }}</span>
                    <span v-if="artist.genres.length >= 2">, {{ artist.genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ artist.popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas(artist.followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${artist.images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
    </div>
    <h1 v-if="error" style="color: red">ERROR: {{ error }}</h1>
    <LoadingSpinnerVue v-if="hideButton && !hideSpinner"/>
    <button v-if="top5.length!==0 && !hideButton" class="load-more" @click="loadAllTracks()"><h3>Load 5 More</h3></button>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import { getUserInformation } from '../functions/getUserInformation';
import { addCommasToNumber } from '../functions/addCommasToNumber';
import { handleUserInformation } from '../interfaces/handleUserInformationInterface';
import { handleLogIn } from '../functions/handleLogIn';

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
        const hideSpinner = ref(false);
        const debugURL = ref('url(\'https://i.scdn.co/image/ab6761610000e5eb02eeb5305fa7bdd9ddca42fc\')');
        const data = ref([]) as Ref<unknown[]>;
        const top5 = ref([]) as Ref<unknown[]>;
        const error = ref(null);
        const topTracks = ref([]) as Ref<string[]>;
        // watch hook for updated time-frame value
        watch(() => props.timeframe, async (newValue) => {
            data.value = [] as unknown[];
            top5.value = [] as unknown[];
            topTracks.value = [] as string[];
            context.emit('allowClicks', false as boolean);
            hideButton.value = false;
            hideSpinner.value = false;
            const params: handleUserInformation = {
                request_type: props.item as string,
                time_range: newValue as string,
                limit: "6",
                offset: "0",
            };
            await getUserInformation(params)
                .then(async res => {
                    const items: Array<typeof res.items> = res.items;
                    try {
                        if (items.length === 0) {
                            context.emit('allowClicks', true as boolean);
                        }
                        else {
                            for await (const item of items) {
                                await fetch('http://localhost:3000/getTopTracks?id=' + item.id + '&access_token=' + localStorage.access_token)
                                .then(res => { return res.json() })
                                    .then(res => {
                                        const name = res.tracks[0].name.length > 40 ? res.tracks[0].name.slice(0,38) + '...' as string : res.tracks[0].name as string;
                                        topTracks.value.push(name);
                                        if (topTracks.value.length === items.length) {
                                            top5.value = items.slice(0,items.length);
                                            context.emit('allowClicks', true as boolean);
                                        }
                                    })
                                    .catch(err => console.table(err))
                                .catch(err => console.table(err));
                            }
                        }
                    }
                    catch (err) {
                        handleLogIn();
                    }
                })
                .catch(err => error.value = err);
            }
        );
        // update function for load more button click
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
                    try {
                        if (items.length === 0) {
                            context.emit('allowClicks', true as boolean);
                            hideSpinner.value = true;
                            // the following reiteration of the 'close/open' function patches the bug that the .artist-card bottom
                            // automatically closes on loading of additional cards and doesn't close the card contents with it
                            if (bottomElement) {
                                if (bottomElement.classList.contains('open')) {
                                    for (let i = 2; i < bottomElement.children[0].children.length; i++) {
                                        bottomElement.children[0].children[i].classList.toggle('hide-child-element');
                                        bottomElement.children[0].classList.toggle('closed');
                                    }
                                    bottomElement.children[1].classList.toggle('minimized');
                                }
                            }
                        }
                        else {
                            for await (const item of items) {
                                await fetch('http://localhost:3000/getTopTracks?id=' + item.id + '&access_token=' + localStorage.access_token)
                                .then(res => { return res.json() })
                                    .then(res => {
                                        console.log(res)
                                        const name = res.tracks[0].name.length > 40 ? res.tracks[0].name.slice(0,38) + '...' as string : res.tracks[0].name as string;
                                        topTracks.value.push(name);
                                        if ((topTracks.value.length - items.length) === (data.value.length + items.length)) {
                                            hideButton.value = !hideButton.value;
                                            data.value.push(...items.slice(0,items.length));
                                            context.emit('allowClicks', true as boolean);
                                            // the following reiteration of the 'close/open' function patches the bug that the .artist-card bottom
                                            // automatically closes on loading of additional cards and doesn't close the card contents with it
                                            if (bottomElement.classList.contains('open')) {
                                                for (let i = 2; i < bottomElement.children[0].children.length; i++) {
                                                    bottomElement.children[0].children[i].classList.toggle('hide-child-element');
                                                    bottomElement.children[0].classList.toggle('closed');
                                                }
                                                bottomElement.children[1].classList.toggle('minimized');
                                            }
                                        }
                                    })
                                    .catch(err => console.table(err))
                                .catch(err => console.table(err));
                            }
                        }
                    }
                    catch(err) {
                        handleLogIn()
                    }
                })
                .catch(err => {
                    console.log(err);
                    error.value = err;
                });
        };
        
        // js QOL functions
        const addCommas = (x: string | number) => {
            return typeof x === 'string' ? addCommasToNumber(parseInt(x)) : addCommasToNumber(x);
        }
        const evaluateBottomWindow = (num: number) => {
            return num+1 === data.value.length;
        }

        // get data
        const params: handleUserInformation = {
            request_type: props.item as string,
            time_range: props.timeframe as string,
            limit: "6",
            offset: "0",
        };
        onMounted(async () => {
            data.value = [] as unknown[];
            top5.value = [] as unknown[];
            topTracks.value = [] as string[];
            context.emit('allowClicks', false as boolean);
            await getUserInformation(params)
            .then(async res => {
                const items: Array<typeof res.items> = res.items;
                    try {
                        if (items.length === 0) {
                            context.emit('allowClicks', true as boolean);
                        }
                        else {
                            for await (const item of items) {
                                await fetch('http://localhost:3000/getTopTracks?id=' + item.id + '&access_token=' + localStorage.access_token)
                                .then(res => { return res.json() })
                                    .then(res => {
                                        const name = res.tracks[0].name.length > 40 ? res.tracks[0].name.slice(0,38) + '...' as string : res.tracks[0].name as string;
                                        topTracks.value.push(name);
                                        if (topTracks.value.length === items.length) {
                                            top5.value = items.slice(0,items.length);
                                            context.emit('allowClicks', true as boolean);
                                        }
                                    })
                                    .catch(err => console.table(err))
                                .catch(err => console.table(err));
                            }
                        }
                    }
                    catch (err) {
                        handleLogIn();
                    }
            });
        });

        // close/open window
        const closeHere = (e: MouseEvent) => {
            // CURRENTTARGET ONLY TARGETS THE ELEM WITH LISTENER
            if ((e.target as Element).id !== 'hyperlink') {
                const elem: Element = e.currentTarget as Element;
                if (elem.classList.contains('open')) {
                    for (let i = 2; i < elem.children[0].children.length; i++) {
                        elem.children[0].children[i].classList.toggle('hide-child-element');
                        elem.children[0].classList.toggle('closed');
                    }
                    elem.children[1].classList.toggle('minimized');
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

        return { debugURL, closeHere, top5, data, error, addCommas, topTracks, evaluateBottomWindow, loadAllTracks, hideButton, hideSpinner };
    },
})
</script>

<style>
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
    width: 400px; 
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
    width: 300px;
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
    .pfp {
        width: 90%;
    }
}
</style>

<style scoped>
span {
    text-transform: capitalize;
}
</style>