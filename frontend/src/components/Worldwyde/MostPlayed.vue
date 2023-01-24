<template>
    <div class="worldwyde-wrapper">
        <div class="worldwyde-heading">
            <div class="worldwyde-heading-title">
                <h3 v-if="width > 900" :class="{ off: number_shown === 0 }" @click.prevent="number_shown > 0 ? handleHome() : ''" class="worldwyde-heading-title-text"><span class="material-symbols-outlined">keyboard_backspace</span>&nbsp;&nbsp;Go Back</h3>
                <h1 class="worldwyde-component-title">Most Played Songs in {{ handleCountryName(props.global_selected_country!.country) }}</h1>
                <div id="filler" style="width: 122px;" v-if="width > 900"></div>
            </div>
            <div class="dropdown-wrapper" :style="{ 
                'max-height': !dropdown ? 'none' : '220px',
                'overflow-y': !dropdown ? 'visible' : 'scroll',
                'z-index': dropdown ? 10 : 9,
            }" :class="{ off: number_shown === 0 }" v-if="number_shown > 0">
                <span class="material-symbols-outlined show-more" :class="{ flipped: dropdown }" v-if="width > 500">expand_more</span>
                <div class="dropdown-choice dropdown-active" @click="handleDropdown()" style="border-radius: 10px;" v-if="!dropdown">
                    <p class="dropdown-p">{{ curr_country!.country }}</p>
                </div>
                <div :id="country.country === curr_country!.country ? 'current-country' : ''" class="dropdown-choice" :class="{ 'dropdown-active': country.country === curr_country!.country }" v-for="country in props.played_countries" :key="country.id" @click="handleDropdown(country)" v-if="dropdown">
                    <p class="dropdown-p">{{ country.country }}</p>
                </div>
            </div>
            <h3 v-if="width <= 900" :class="{ off: number_shown === 0 }" @click.prevent="number_shown > 0 ? handleHome() : ''" class="worldwyde-heading-title-text"><span class="material-symbols-outlined">keyboard_backspace</span>&nbsp;&nbsp;Go Back</h3>
        </div>
        <LoadingSpinnerVue v-if="number_shown === 0"/>
        <div v-if="number_shown > 0" class="top-artists-wrapper">
            <div class="artist-card" :class="{ 'open': Number(index) === 0, 'bottom': evaluateBottomWindow(Number(index)), 'top': Number(index) === 0 }" @click="e => closeHere(e)" v-for="(track, index) in playlist" :key="track.id">
                <div class="body-paragraph" :class="{ 'closed': Number(index) > 0 }">
                    <div class="display-as-row">
                        <img class="small-logo" src="../../../public/spotify_logo.png" />
                        <h2 class="title">#{{ Number(index)+1 }}. {{ longName(track.name, Number(index)) }} <a target="_blank" :href="track.external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                    </div>
                    <h4>Artist(s): 
                        <span v-for="(artist, index) in track.artists" :key="artist.id" style="flex-direction: row">
                            <a target="_blank" :href="artist.external_urls.spotify">
                                {{ artist.name }}
                            </a>
                            <span v-if="index !== track.artists.length - 1" style="transform: translateY(0);">, </span>
                        </span>
                    </h4>
                    <h4 :class="{ 'hide-child-element': Number(index) > 0 }">Popularity: <span>{{ track.popularity }} / 100</span></h4>
                    <h4 :class="{ 'hide-child-element': Number(index) > 0 }">Duration: <span>{{ convertMilliseconds(track.duration_ms) }}</span></h4>
                    <h4 :class="{ 'hide-child-element': Number(index) > 0 }">Descriptors: 
                        <span class="track-attributes" v-for="(attribute, i) in (track.attributes as string[][])" :key="i" style="flex-direction: row">
                            <span :style="'color:' + attribute[1]">{{attribute[0]}}</span>
                            <span v-if="i !== (track.attributes as string[][]).length - 1" style="transform: translateY(0);">, </span>
                        </span></h4>
                </div>
                <div class="pfp" :class="{ 'minimized': Number(index) > 0 }" :style="{ 'background-image': `url(${track.album.images[0].url})`, 'opacity': '0.9' }"></div>
            </div>
        </div>
        <LoadingSpinnerVue v-if="hideButton && number_shown > 0"/>
        <button v-if="number_shown !== 0 && !hideButton && number_shown !== 50" class="load-more" @click="getSongAttributes(number_shown, show_to, true)"><h3>Load 5 More</h3></button>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, Ref, onMounted, watch } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import { Top50PlaylistContainer } from '../interfaces/Top50PlaylistContainer';
import { SpotifyTrackAttributes } from '../interfaces/SpotifyTrackAttributes';
import { countryPlaylist } from '../interfaces/countryPlaylist';
import { ArrayOfCountriesThatNeedTheBeforeThem } from '../interfaces/ArrayOfCountriesThatNeedTheBeforeThem';
import { evaluateParameters } from '../functions/evaluateParameters';
import { attributeToColor } from '../functions/attributeToColor';
import { handleLogIn } from '../functions/handleLogIn';
import { addCommasToNumber } from '../functions/addCommasToNumber';

export default defineComponent({
    emits: ['goHome', 'newCountry'],
    props: {
        played_playlist: Object as PropType<Top50PlaylistContainer>,
        global_selected_country: Object as PropType<{ country: string, id: string }>,
        played_countries: Object as PropType<Array<countryPlaylist>>,
    },
    components: {
        LoadingSpinnerVue,
    },
    setup(props, context) {
        const playlist = ref({}) as Ref<Top50PlaylistContainer>;
        const curr_country = ref(props.global_selected_country);
        const number_shown = ref(0);
        const show_to = ref(number_shown.value + 5 < 50 ? number_shown.value + 5 : 50);
        const hideButton = ref(true);
        const width = ref(window.innerWidth);
        const dropdown = ref(false);
        const DOM_song_count = ref(0);

        // close dropdown
        document.addEventListener('click', (e) => {
            const el = e.target as HTMLElement;
            if (el.classList.length > 0) {
                if (!el.classList.contains('dropdown-p') && !el.classList.contains('dropdown-choice') && !el.classList.contains('dropdown-wrapper')) {
                    dropdown.value = false;
                }
            }
            else {
                dropdown.value = false;
            }
        });

        // watch hook for prop playlist update
        watch(() => props.played_playlist, (newValue) => {
            if (newValue) 
                if (Object.keys(newValue).length > 0) {
                    if (DOM_song_count.value > 0) {
                        show_to.value = DOM_song_count.value;
                    }
                    getSongAttributes(number_shown.value, show_to.value, false);
                }
        });

        // adds 'The' to certain countries
        const handleCountryName = (country: string) => {
            return ArrayOfCountriesThatNeedTheBeforeThem.includes(country) ? country === 'Global' ? 'the World' : 'the ' + country : country;
        }

        // update width value
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        // return home
        const handleHome = () => {
            context.emit('goHome', 'home');
        }

        // handles dropdown
        const handleDropdown = (country?: { country: string, id: string }) => {
            dropdown.value = !dropdown.value;
            if (country) {
                curr_country.value = country;
                number_shown.value = 0;
                show_to.value = number_shown.value + 5 < 50 ? number_shown.value + 5 : 50;
                context.emit('newCountry', curr_country.value, 'played');
            }
        }

        // js QOL functions
        const addCommas = (x: string | number) => {
            return typeof x === 'string' ? addCommasToNumber(parseInt(x)) : addCommasToNumber(x);
        };
        const evaluateBottomWindow = (num: number) => {
            return num + 1 === number_shown.value;
        };
        const convertMilliseconds = (num: number) => {
            const date = new Date(num);
            return date.getMinutes() + ' min, ' + date.getSeconds() + ' sec'
        };
        const longName = (name: string, index: number) => {
            // function to update count of listings injected to DOM
            DOM_song_count.value = index+1;
            return name.length > 23 ? name.slice(0,21) + '...' : name;
        };

        // gets descriptors and colors of song attributes
        const getSongDescriptors = (index: number, song_features: SpotifyTrackAttributes) => {
            let attributes: { [key: string]: Array<string | number> } = evaluateParameters(song_features);
            const attrs: Array<Array<string>> = attributeToColor(attributes);
            playlist.value[index] = (props.played_playlist as Top50PlaylistContainer)[index];
            playlist.value[index]['attributes'] = attrs;
        }

        // gets attributes of songs in playlist
        const getSongAttributes = async (start: number, end: number, checkBottom: boolean) => {
            if (props.played_playlist) {
                if (!hideButton.value) hideButton.value = true;
                if (Object.keys(props.played_playlist).length === 0) handleLogIn();
                else {
                    // loops through playlist and gets attributes of each song
                    for (let i = start; i < end; i++) {
                        const trackFeaturesURL = 'https://spotifyve-backend.herokuapp.com/getTrackFeatures?id=' + props.played_playlist[i].id + '&access_token=' + localStorage.access_token;
                        const audio_features_json = await fetch(trackFeaturesURL);
                        const audio_features = await audio_features_json.json();
                        getSongDescriptors(i, audio_features);
                    }
                    // if show_to.value \leq 45
                    if (show_to.value < 46) show_to.value += 5;
                    number_shown.value += 5;
                    hideButton.value = false;
                    if (checkBottom) {
                        const bottomElement = (document.querySelector('.bottom') as HTMLElement) as HTMLElement;
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
                }
            }
        }

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

        onMounted(() => getSongAttributes(number_shown.value, show_to.value, false));
        
        return { props, playlist, curr_country, DOM_song_count, width, dropdown, number_shown, show_to, hideButton, handleCountryName, handleHome, handleDropdown, getSongAttributes, addCommas, evaluateBottomWindow, convertMilliseconds, longName, closeHere };
    }
})
</script>

<style scoped>
.load-more {
    padding: 5px 20px;
    font-size: 12px;
}
.worldwyde-heading-title-text {
    border-radius: 20px;
    padding: 5px 15px;
    margin: 0;
    box-shadow: 0 0 4px #f3f3f3;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition: .2s ease-in-out;
    font-size: 16px;
}
.worldwyde-heading-title-text:hover {
    color: rgba(46, 46, 46, .9);
    background-color: #f3f3f3;
    box-shadow: none;
    transform: translateY(2px);
}
.worldwyde-heading-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}
.worldwyde-heading {
    width: 100%;
    margin: 20px;
    position: relative;
}
.worldwyde-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.artist-card h2 {
    font-size: 18px;
    margin-left: 20px;
}
@media (max-width: 900px) {
    .worldwyde-component-title{
        font-size: 32px;
    }
    .worldwyde-heading-title-text {
        margin: 80px auto -40px auto; 
        width: 50%;
    }
}
</style>