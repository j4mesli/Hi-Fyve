<template>
    <div id="Worldwyde-wrapper" class="Worldwyde-wrapper" v-if="handleComponent === 'home'">
        <h1 style="font-size: 40px;">Worldw<span style="color: rgb(29,185,84)">y</span>de 🌎</h1>
        <div class="worldwyde-content">
            <div class="worldwyde-block forty" v-if="width <= 910">
                <div class="comparison-title">
                    <h2>Compare <span class="worldwyde-swap-comparison-type" @click="handleSwapComparisons">
                        {{ swapComparisons === 'viral' ? 'Viral' : 'Played' }} Songs
                    </span></h2>
                    <p>Select up to 3 countries to compare statistics!</p>
                    <p>Want to compare the <span @click="handleSwapComparisons" class="worldwyde-swap-comparison-type">Most {{ 
                    swapComparisons === 'viral' ? 'Played' : 'Viral' 
                    }} Songs</span> instead? <span class="worldwyde-swap-comparison-type" @click="handleSwapComparisons">Click here to swap</span>!</p>
                </div>
                <form id="autocomplete" class="autocomplete" @submit.prevent="handleAutocompleteSubmission()">
                    <input id="text-input" class="autocomplete-input" type="text" v-model="dropdown_selection" @input="searchHTML(swapComparisons)" :class="{ off: (swapComparisons === 'viral' ? viral_countries.length === 0 : played_countries.length === 0) || comparisons.length === 3 }" />
                </form>
                <div class="autofill-matches-wrapper" v-if="matches.length > 0 && showMatches">
                    <div class="autofill-matches" v-for="match in matches" :key="match.id" @click="handleAutocompleteSubmission(match)">
                        <p>{{ match.country }}</p>
                    </div>
                </div>
                <div class="comparison-countries">
                    <h3>Selected Countries: <span :style="{ color: comparisons.length < 2 ? 'rgb(220, 51, 0)' : comparisons.length === 2 ? 'rgb(1, 250, 200)' : '#0069c2' }">({{ comparisons.length }}/3)</span></h3>
                    <div class="selections">
                        <div class="selection" v-for="comparison in comparisons" :key="comparison.id" @click="popListing(comparison)">
                            <p>{{ comparison.country }}</p>
                            <span class="material-symbols-outlined close-icon">close</span>
                        </div>
                    </div>
                </div>
                <button class="worldwyde-home-button" @click="comparisons.length >= 2 ? handleComponent = 'comparisons' : ''" :class="{ off: comparisons.length < 2 }">Start Comparison</button>
            </div>
            <div class="worldwyde-block sixty">
                <div class="dropdown-container">
                    <h2>Most Viral Tracks</h2>
                    <div class="dropdown-wrapper" :style="{ 
                        'max-height': !dropdowns[0].show ? 'none' : '220px',
                        'overflow-y': !dropdowns[0].show ? 'visible' : 'scroll',
                        'z-index': dropdowns[0].show ? 10 : 9,
                    }" :class="{ off: viral_countries.length === 0, 'small-dropdown': width <= 1000 }">
                        <span class="material-symbols-outlined show-more" :class="{ flipped: dropdowns[0].show }" v-if="width > 500">expand_more</span>
                        <div class="dropdown-choice dropdown-active" @click="viral_countries.length === 0 ? '' : handleDropdown(0, 'viral')" style="border-radius: 10px;" v-if="!dropdowns[0].show">
                            <p class="dropdown-p">{{ individual_country.country }}</p>
                        </div>
                        <div :id="country.country === individual_country.country ? 'current-country' : ''" class="dropdown-choice" :class="{ 'dropdown-active': country.country === individual_country.country }" v-for="country in viral_countries" :key="country.id" @click="handleDropdown(0, 'viral', country)" v-if="dropdowns[0].show">
                            <p class="dropdown-p">{{ country.country }}</p>
                        </div>
                    </div>
                </div>
                <div class="worldwyde-top-songs-wrapper">
                    <div class="worldwyde-top-songs" v-for="index in 3" :key="index" :class="{ 'worldwyde-top-songs-top': index === 1, 'worldwyde-top-songs-bottom': index === 3 }">
                        <h4 v-if="Object.keys(viral_playlist).length === 0">Loading...</h4>
                        <div class="playlist-song" v-else>
                            <div class="worldwyde-top-songs-image" :style="{ 'background-image': `url(${viral_playlist[index-1].album.images[0].url})`, 'opacity': '0.9' }"></div>
                            <div class="worldwyde-top-songs-text">
                                <h4>{{ viral_playlist[index-1].name }}<a target="_blank" :href="viral_playlist[index-1].external_urls.spotify" style="font-weight: bold;"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h4>
                                <p><span v-for="(artist, i) in viral_playlist[index-1].artists" :key="artist.id">
                                    <a target="_blank" :href="artist.external_urls.spotify">{{ artist.name }}</a>
                                    <span v-if="i < Object.keys(viral_playlist[index-1].artists).length-1">, </span>
                                </span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <button :class="{ off: viral_countries.length === 0 }" class="worldwyde-home-button no-margin" @click="viral_countries.length !== 0 ? handleComponent = 'viral' : ''">Show Me More!</button>
            </div>
            <div class="worldwyde-block forty" v-if="width > 910">
                <div class="comparison-title">
                    <h2>Compare <span class="worldwyde-swap-comparison-type" @click="handleSwapComparisons">
                        {{ swapComparisons === 'viral' ? 'Viral' : 'Played' }} Songs
                    </span></h2>
                    <p>Select up to 3 countries to compare statistics!</p>
                    <p>Want to compare the <span @click="handleSwapComparisons" class="worldwyde-swap-comparison-type">Most {{ 
                    swapComparisons === 'viral' ? 'Played' : 'Viral' 
                    }} Songs</span> instead? <span class="worldwyde-swap-comparison-type" @click="handleSwapComparisons">Click here to swap</span>!</p>
                </div>
                <form id="autocomplete" class="autocomplete" @submit.prevent="handleAutocompleteSubmission()">
                    <input id="text-input" class="autocomplete-input" type="text" v-model="dropdown_selection" @input="searchHTML(swapComparisons)" @focus="searchHTML(swapComparisons)" :class="{ off: (swapComparisons === 'viral' ? viral_countries.length === 0 : played_countries.length === 0) || comparisons.length === 3 }" />
                </form>
                <div class="autofill-matches-wrapper" v-if="matches.length > 0 && showMatches">
                    <div class="autofill-matches" v-for="match in matches" :key="match.id" @click="handleAutocompleteSubmission(match)">
                        <p>{{ match.country }}</p>
                    </div>
                </div>
                <div class="comparison-countries">
                    <h3>Selected Countries: <span :style="{ color: comparisons.length < 2 ? 'rgb(220, 51, 0)' : comparisons.length === 2 ? 'rgb(1, 250, 200)' : '#0069c2' }">({{ comparisons.length }}/3)</span></h3>
                    <div class="selections">
                        <div class="selection" v-for="comparison in comparisons" :key="comparison.id" @click="popListing(comparison)">
                            <p>{{ comparison.country }}</p>
                            <span class="material-symbols-outlined close-icon">close</span>
                        </div>
                    </div>
                </div>
                <button class="worldwyde-home-button" @click="comparisons.length > 1 ? startComparison() : ''" :class="{ off: comparisons.length < 2 }">Start Comparison</button>
            </div>
        </div>
        <div class="worldwyde-content">
            <div class="worldwyde-block" :class="{ 'big-block': width < 1000 }">
                <div class="dropdown-container">
                    <h2>Most Played Tracks</h2>
                    <div class="dropdown-wrapper" :style="{ 
                        'max-height': !dropdowns[1].show ? 'none' : '220px',
                        'overflow-y': !dropdowns[1].show ? 'visible' : 'scroll',
                        'z-index': dropdowns[1].show ? 10 : 9,
                    }" :class="{ off: played_countries.length === 0 }">
                        <span class="material-symbols-outlined show-more" :class="{ flipped: dropdowns[1].show }" v-if="width > 500">expand_more</span>
                        <div class="dropdown-choice dropdown-active" @click="played_countries.length === 0 ? '' : handleDropdown(1, 'played')" style="border-radius: 10px;" v-if="!dropdowns[1].show">
                            <p class="dropdown-p">{{ global_selected_country.country }}</p>
                        </div>
                        <div :id="country.country === global_selected_country.country ? 'current-country' : ''" class="dropdown-choice" :class="{ 'dropdown-active': country.country === global_selected_country.country }" v-for="country in played_countries" :key="country.id" @click="handleDropdown(1, 'played', country)" v-if="dropdowns[1].show">
                            <p class="dropdown-p">{{ country.country }}</p>
                        </div>
                    </div>
                </div>
                <div class="worldwyde-top-songs-wrapper" :class="{ 'big-wrapper': width > 910 }">
                    <div class="worldwyde-top-songs" v-for="index in 3" :key="index" :class="{ 'worldwyde-top-songs-top': index === 1, 'worldwyde-top-songs-bottom': index === 3 }">
                        <h4 v-if="Object.keys(played_playlist).length === 0">Loading...</h4>
                        <div class="playlist-song" v-else>
                            <div class="worldwyde-top-songs-image" :style="{ 'background-image': `url(${played_playlist[index-1].album.images[0].url})`, 'opacity': '0.9' }"></div>
                            <div class="worldwyde-top-songs-text">
                                <h4>
                                    {{ played_playlist[index-1].name }}
                                    <a target="_blank" :href="played_playlist[index-1].external_urls.spotify" style="font-weight: bold;">
                                        <span id="hyperlink" class="material-symbols-outlined">launch</span>
                                    </a>
                                </h4>
                                <p><span v-for="(artist, i) in played_playlist[index-1].artists" :key="artist.id">
                                    <a target="_blank" :href="artist.external_urls.spotify">{{ artist.name }}</a>
                                    <span v-if="i < Object.keys(played_playlist[index-1].artists).length-1">, </span>
                                </span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <button :class="{ off: played_countries.length === 0 }" class="worldwyde-home-button no-margin" @click="played_countries.length !== 0 ? handleComponent = 'played' : ''">Show Me More!</button>
            </div>
        </div>
    </div>
    <MostPlayed 
        @go-home="handleComponentChange" 
        @new-country="handleCountrySwapFromComponent" 
        :played_countries="played_countries" 
        :global_selected_country="global_selected_country" 
        :played_playlist="played_playlist" 
        v-else-if="handleComponent === 'played'" 
    />
    <MostViral 
        @go-home="handleComponentChange" 
        @new-country="handleCountrySwapFromComponent" 
        :viral_countries="viral_countries" 
        :individual_country="individual_country" 
        :viral_playlist="viral_playlist" 
        v-else-if="handleComponent === 'viral'" 
    />
    <CountryComparisons 
        @go-home="handleComponentChange"
        :comparisons="comparisons" 
        v-else-if="handleComponent === 'comparisons'" 
    />
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, ref, watchEffect } from 'vue';
import * as htmlToImage from 'html-to-image';
import { countryPlaylist } from '../interfaces/countryPlaylist';
import { handleLogIn } from '../functions/handleLogIn';
import MostPlayed from './MostPlayed.vue';
import MostViral from './MostViral.vue';
import CountryComparisons from './CountryComparisons.vue';
import { Top50PlaylistContainer } from '../interfaces/Top50PlaylistContainer';

export default defineComponent({
    components: {
        MostPlayed,
        MostViral,
        CountryComparisons,
    },
    setup() {
        const handleComponent: Ref<'home' | 'played' | 'viral' | 'comparisons'> = ref('home');
        const dropdowns = ref([
            { index: 0, show: false },
            { index: 1, show: false },
        ]);
        const width = ref(window.innerWidth);
        const master_countries = ref({}) as Ref<{ viral: Array<countryPlaylist>, played: Array<countryPlaylist> }>;
        const viral_countries = ref([]) as Ref<Array<countryPlaylist>>;
        const individual_country = ref({ country: 'Loading...', id: '' });
        const viral_playlist = ref({}) as Ref<Top50PlaylistContainer>;
        const played_countries = ref([]) as Ref<Array<countryPlaylist>>;
        const global_selected_country = ref({ country: 'Loading...', id: '' });
        const played_playlist = ref({}) as Ref<Top50PlaylistContainer>;
        const dropdown_selection = ref('');
        const comparisons = ref([]) as Ref<Array<countryPlaylist>>;
        const matches = ref([]) as Ref<Array<countryPlaylist>>;
        const showMatches = ref(false);
        const swapComparisons = ref('viral') as Ref<'viral' | 'played'>; 

        // handle share color board
        const shareColorBoard = () => {
            // need to reset margins to left due to quirk of library reading element from page left to elem width instead of elem left to elem right
            // ex: elem width 100 and margin 20 10 will have 10px background and 90px elem in final image instead
            const image = document.getElementById("Worldwyde-wrapper") as HTMLElement;
            const margins = image.style.margin;
            image.style.margin = '0';
            htmlToImage.toPng(image)
            .then((dataUrl: string) => {
                const img = new Image();
                img.src = dataUrl;
                const tab = window.open('','_blank') as Window;
                const link = document.createElement('a');
                link.download = 'mycolorboard.jpeg';
                link.href = dataUrl;
                link.style.margin = '20px auto';
                link.style.width = '100%';
                link.style.height = '10%';
                link.innerHTML = `<h1 style="margin-left: auto; margin-right: auto">Click Here To Download Your Color Board</h1>`;
                tab.document.body.appendChild(img);
                tab.document.body.appendChild(link);
                image.style.margin = margins;
            })
            .catch((err: string) => console.error('oops, something went wrong!', err));
        }

        const startComparison = () => {
            handleComponent.value = 'comparisons';
        }

        const handleSwapComparisons = () => {
            swapComparisons.value === 'viral' ? swapComparisons.value = 'played' : swapComparisons.value = 'viral';
            dropdown_selection.value = "";
            matches.value.length = 0;
            comparisons.value.length = 0;
        }

        // change component value
        const handleComponentChange = (el: 'home' | 'played' | 'viral' | 'comparisons') => {
            handleComponent.value = el;
        }

        // fetch all countries from backend
        fetch('http://localhost:3000/country_playlists')
            .then(res => res.json())
                .then(data => {
                    master_countries.value = data;
                    viral_countries.value = data.viral;
                    played_countries.value = data.plays;
                    individual_country.value = viral_countries.value[69];
                    global_selected_country.value = played_countries.value[0];
                    setupDefaultSongs('viral');
                    setupDefaultSongs('played');
                })
                .catch(err => console.log(err))
            .catch(err => console.log(err));
        
        // parent function of default songs
        const setupDefaultSongs = async (type: 'viral' | 'played') => {
            const countries = type === 'viral' ? viral_countries.value : played_countries.value;
            const country_obj: countryPlaylist = type === 'viral' ? individual_country.value : global_selected_country.value;
            const country = countries.find(el => el === country_obj) as countryPlaylist;
            const playlist_obj = await fetch('http://localhost:3000/tracks_from_playlist?id=' + country.id + '&access_token=' + localStorage.access_token);
            const playlist_json = await playlist_obj.json();
            if (Object.keys(playlist_json).length < 2) handleLogIn();
            const playlist = {} as typeof playlist_json;
            for (let i = 0; i < Object.keys(playlist_json).length; i++) {
                playlist[i] = playlist_json[i].track;
            }
            if (type === 'played') played_playlist.value = playlist; 
            else viral_playlist.value = playlist;
            showMatches.value = true;
        }

        // input listener
        const searchHTML = (type: 'viral' | 'played') => {
            showMatches.value = true;
            matches.value = (type === 'viral' ? viral_countries.value : played_countries.value).filter(country => {
                const regex = new RegExp(dropdown_selection.value, "gi");
                return country.country.match(regex) && !comparisons.value.includes(country);
            });
        };

        // disable input if countries is 0
        onMounted(() => {
            const input = document.querySelector("input#text-input") as HTMLInputElement;
            watchEffect(() => {
                // watch comparisons size and countries size to disable input
                if (comparisons.value.length === 3 || viral_countries.value.length === 0) (input as HTMLInputElement).disabled = true;
                else (input as HTMLInputElement).disabled = false;

                // change input placeholder based on countries size
                if (viral_countries.value.length === 0) (input as HTMLInputElement).placeholder = "Loading...";
                else (input as HTMLInputElement).placeholder = ""; 
            });
        });

        // remove comparison from list
        const popListing = (el: countryPlaylist) => {
            if (comparisons.value.length > 0) {
                const index = comparisons.value.indexOf(el);
                if (index !== -1) {
                    comparisons.value.splice(index, 1); 
                }
            }
        }

        // handles autocomplete submission
        const handleAutocompleteSubmission = (el?: countryPlaylist) => {
            if (matches.value.length > 0) {
                if (!comparisons.value.includes(matches.value[0])) {
                    if (el) {
                        comparisons.value.push(el);
                    }
                    else {
                        comparisons.value.push(matches.value[0]);
                    }
                    matches.value.shift();
                    const active_elem = document.activeElement as HTMLElement;
                    const input = document.querySelector("input#text-input") as HTMLElement;
                    if (active_elem !== input || comparisons.value.length === 3) {
                        (document.activeElement as HTMLElement).blur();
                        showMatches.value = false;
                    }
                    dropdown_selection.value = '';
                }
            }
        }

        // close dropdown
        document.addEventListener('click', (e) => {
            const el = e.target as HTMLElement;
            if (el.classList.length > 0) {
                if (!el.classList.contains('dropdown-p') && !el.classList.contains('dropdown-choice') && !el.classList.contains('dropdown-wrapper')) {
                    dropdowns.value.forEach(el => el.show = false);
                    showMatches.value = false;
                }
                if (el.classList[0] === 'autocomplete-input') {
                    showMatches.value = true;
                }
            }
            else {
                dropdowns.value.forEach(el => el.show = false);
                showMatches.value = false;
            }
        });

        // update width value
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        // handles dropdown
        const handleDropdown = (index: number, type: 'viral' | 'played', country?: { country: string, id: string }) => {
            dropdowns.value.forEach(el => {
                if (el.index !== index) {
                    if (el.show) el.show = false;
                }
                else {
                    el.show = !el.show;
                }
            });
            if (!dropdowns.value[index].show && country) {
                switch(index) {
                    case 0:
                        individual_country.value = country;
                        break;
                    case 1:
                        global_selected_country.value = country;
                        break;
                }
                if (type === 'viral') viral_playlist.value = {};
                else played_playlist.value = {};
                setupDefaultSongs(type);
            }
        }

        // handles a country swap from a component
        const handleCountrySwapFromComponent = (country: { country: string, id: string }, type: 'viral' | 'played') => {
            if (type === 'viral') {
                viral_playlist.value = {};
                individual_country.value = country;
            }
            else {
                played_playlist.value = {};
                global_selected_country.value = country;
            } 
            setupDefaultSongs(type);
        }

        return { shareColorBoard, handleComponent, dropdowns, width, master_countries, individual_country, viral_countries, viral_playlist, global_selected_country, played_countries, played_playlist, dropdown_selection, comparisons, matches, showMatches, swapComparisons, handleSwapComparisons, startComparison, handleCountrySwapFromComponent, handleDropdown, searchHTML, handleAutocompleteSubmission, popListing, handleComponentChange };
    },
})
</script>

<style>
.worldwyde-swap-comparison-type {
    cursor: pointer;
    color: #00c3ff;
    font-weight: bold;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    transition: .2s ease-in-out;
}
.worldwyde-swap-comparison-type:hover {
    color: #00ffc8;
    text-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}
.worldwyde-top-songs-image {
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    height: 75px;
    width: 75px;
    background-position: center; 
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 10px;
    margin: auto 0 auto auto;
}
.worldwyde-top-songs-text {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.worldwyde-top-songs-text p, .worldwyde-top-songs-text h4 {
    margin: 5px auto;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    color: rgba(240, 240, 240);
}
.playlist-song {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.worldwyde-top-songs-wrapper {
    width: 90%;
    height: 276px;
    margin: 20px auto 0px;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
}
.big-wrapper {
    width: 60%;
}
.worldwyde-top-songs {
    width: 100%;
    height: 91.6px;
    background-color: #F0A47D;
    border-bottom: 1px solid rgba(0,0,0,0.5);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.worldwyde-top-songs-top {
    border-top-left-radius: 10px; 
    border-top-right-radius: 10px;
}
.worldwyde-top-songs-bottom {
    border-bottom: none;
    border-bottom-left-radius: 10px; 
    border-bottom-right-radius: 10px;
}
.dropdown-container {
    width: 100%;
}
.worldwyde-home-button {
    padding: 10px 20px;
    margin: 25px auto 10px;
    border: 1px solid #f3f3f3;
    font-weight: bold;
    color: #f3f3f3;
    background-color: transparent;
    border-radius: 20px;
    transition: .2s ease-in-out;
    box-shadow: 0px 0px 4px rgba(0,0,0,0.5);
}
.no-margin {
    margin: -10px 0 0 0;
}
.worldwyde-home-button:hover {
    box-shadow: 0px 0px 8px rgba(255,255,255,0.5);
    transform: translateY(2px);
}
.close-icon {
    font-size: 14px;
    position: absolute;
    right: 10px;
    cursor: pointer;
    transition: .2s ease-in-out;
    border-radius: 10px;
}
.close-icon:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 2px rgba(0,0,0,0.5);
}
.autofill-matches p, .selection p {
    font-size: 14px;
    margin: 0;
}
.comparison-title {
    margin: 20px;
}
.comparison-title p, .comparison-title h2 {
    margin: 5px 10px;
}
.comparison-title p {
    font-size: 14px;
}
.selection {
    padding: 10px;
    max-height: 58px;
    padding-left: 20px;
    padding-right: 30px;
    margin: auto 10px;
    border-radius: 20px;
    background-color: gainsboro;
    color: #0f0f0f;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
}
.selections {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.comparison-countries {
    width: 80%;
    min-height: 100px;
}
.autofill-matches {
    padding: 10px 20px;
    width: 230px;
    background-color: gainsboro;
    color: #0f0f0f;
    cursor: pointer;
}
.autofill-matches:hover {
    background-color: rgb(190, 190, 190);
}
.autofill-matches-wrapper {
    top: 45%;
    max-height: 200px;
    overflow-y: scroll;
    position: absolute;
    z-index: 11;
    border-radius: 20px;
}
.autocomplete-input {
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 10px;
    font-family: 'Figtree';
}
.autocomplete {
    width: 50%;
    position: relative;
}
.show-more {
    position: absolute;
    top: 10px;
    right: 10px;
}
.flipped {
    animation: rotateX180 .3s forwards;
    animation-timing-function: ease-in-out;
}
.dropdown-label {
    position: fixed;
    top: 27%;
    left: 47.75%;
    color: white;
}
.dropdown-choice {
    width: 100%;
    background-color: #dbdbdb;
    color: black;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: auto 5px;
    transition: .2s ease-in-out;
    z-index: 10;
}
.dropdown-wrapper {
    width: 40%;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height: 220px;
    z-index: 11;
    overflow-x: hidden;
    cursor: pointer;
    scroll-behavior: smooth;
    position: absolute;
}
.dropdown-wrapper::-webkit-scrollbar, .autofill-matches-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa;
    margin-right: 20px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
}
.dropdown-wrapper::-webkit-scrollbar-thumb, .autofill-matches-wrapper::-webkit-scrollbar-thumb {
    background-color: #C25900;
    border-radius: 40px;
}
.dropdown-active {
    background-color: #01a2d3;
    color: white;
}
.dropdown-choice:hover {
    background-color: #0069c2;
    color: #f3f3f3;
}
.off { 
    opacity: .5;
    cursor: not-allowed;
    transition: .1s ease-in-out;
}
input.autocomplete-input.off {
    opacity: 0.9;
}
.dropdown-choice.off {
    opacity: 1;
    background-color: rgba(110, 110, 110);
    text-decoration: line-through;
    color: black;
}
.worldwyde-block {
    background-color: rgb(16, 168, 69);
    min-height: 100px;
    width: 100%;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 500px;
}
.sixty {
    width: 80%;
    background-color: rgb(221, 165, 82);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.forty {
    width: 60%;
    background-color: rgb(209, 127, 141);
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.worldwyde-content {
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.Worldwyde-wrapper {
    width: 95%;
    min-height: 100px;
    margin: 20px auto;
    border-radius: 20px;
    padding: 20px;
}

@media (max-width: 1500px) {
    .autocomplete {
        width: 80%;
    }
    .comparison-countries {
        width: 90%;
    }
    .dropdown-wrapper {
        width: 60%;   
    }
}
@media (max-width: 1301px) {
    .autofill-matches-wrapper {
        top: 47%;
    }
}
@media (max-width: 1000px) {
    .dropdown-wrapper {
        width: 70%;   
    }
    .small-dropdown {
        width: 80%;
    }
    .sixty, .forty {
        min-width: 400px;
    }
    .big-block {
        min-width: 800px;
    }
    .Worldwyde-wrapper {
        margin: 20px auto;
        padding: 10px;
    }
}
@media (max-width: 910px) {
    .worldwyde-content {
        flex-direction: column;
    }
    .forty, .sixty, .big-block {
        width: 80%;
        min-width: 0;
    }
    .forty {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .sixty {
        border-top-left-radius: 0;
    }
    .big-block {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .autofill-matches-wrapper {
        width: 60%;
        overflow-x: hidden;
    }
    .autofill-matches {
        width: 95%;
    }
    .autofill-matches-wrapper {
        top: 45%;
    }
}
@media (max-width: 652px) {
    .autofill-matches-wrapper {
        top: 47%;
    }
}
@media (max-width: 500px) {
    .worldwyde-top-songs-text p, .worldwyde-top-songs-text h4 {
        font-size: 12px;
        margin: auto 10px;
    }
    .Worldwyde-wrapper {
        width: 90%;
    }
    .forty, .sixty, .big-block {
        width: 90%;
    }
    .autofill-matches p, .selection p {
        font-size: 12px;
    }
    .autofill-matches-wrapper {
        width: 70%;
        overflow-x: hidden;
    }
}
@media (max-width: 433px) {
    .autofill-matches-wrapper {
        top: 49%;
    }
}
@media (max-width: 375px) {
    .autofill-matches p, .selection p {
        font-size: 10px;
    }
    .autofill-matches {
        width: 85%;
    }
    .selection {
        padding: 5px;
        padding-left: 8px;
        padding-right: 12px;
    }
    .close-icon {
        right: 1px;
    }
    .comparison-title {
        width: 100%;
    }
    .comparison-title h2 {
        font-size: 20px;
    }
}
@media (max-width: 258px) {
    .autofill-matches-wrapper {
        top: 46%;
    }
}
@media (max-width: 200px) {
    .autofill-matches-wrapper {
        top: 50%;
    }
}
</style>