<template>
    <div class="comparison-page-headings">
        <h3 :class="{ off: country_statistics.length === 0 }" @click.prevent="country_statistics.length !== 0 ? handleHome() : ''" class="worldwyde-heading-title-text-go-back"><span class="material-symbols-outlined">keyboard_backspace</span><span v-if="width > 725">&nbsp;&nbsp;Go Back</span></h3>
        <h1 class="comparison-page-title">Country Comparisons</h1>
    </div>
    <div class="loading-with-text" v-if="country_statistics.length === 0">
        <LoadingSpinnerVue />
        <label>Formulating statistics, please sit tight!</label>
    </div>
    <div class="worldwyde-statistic-comparison" v-else>
        <div class="worldwyde-comparison-blurbs">
            <div class="country-flags">
                <div v-for="country in country_flags" :key="country.country" class="worldwyde-display-country-flag">
                    <h2 class="comparison-component-title" @click="showCountryDisplay">{{ country.country }}</h2>
                    <img @click="showCountryDisplay" class="worldwyde-display-country-flag-image" :src="country.flag"/>
                </div>
            </div>
            <div class="worldwyde-comparison-buttons">
                <button @click="swapDisplayOfStatistics" :class="{ 'comparison-active': showBlurbs }"><h3>Show Blurbs</h3></button>
                <button @click="swapDisplayOfStatistics" :class="{ 'comparison-active': !showBlurbs }"><h3>Raw Stats</h3></button>
            </div>
            <h2 class="comparison-component-title" v-if="showBlurbs">Statistic Blurbs</h2>
            <ul class="attribute-list" v-if="showBlurbs">
                <h3><li v-for="index in 24" :key="index">{{ country_statistics[index-1] }}</li></h3>
            </ul>
            <div class="attribute-list" v-else>
                <div class="type-selector">
                    <span id="go-back" @click="showIndividualCountryStatistics !== 'min' ? handleCustomizationChange(false, showIndividualCountryStatistics) : ''" class="material-symbols-outlined go-back" :class="{ off: showIndividualCountryStatistics === 'min' }">chevron_left</span>
                    <h2 class="comparison-component-title">{{ showIndividualCountryStatistics === 'raw' ? "Statistics by Country" : showIndividualCountryStatistics === 'min' ? 'Minimum Statistics' : "Maximum Statistics" }}</h2>
                    <span id="go-forward" @click="showIndividualCountryStatistics !== 'raw' ? handleCustomizationChange(true, showIndividualCountryStatistics) : ''" class="material-symbols-outlined go-forward" :class="{ off: showIndividualCountryStatistics === 'raw' }">chevron_right</span>
                </div>
                <div class="comparison-component-statistics" v-if="showIndividualCountryStatistics !== 'raw'">
                    <div class="min-max-wrapper" v-if="showIndividualCountryStatistics === 'min'">
                        <ul class="attribute-list">
                            <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                <span style="color: rgb(255, 50, 150)">Lowest</span> Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}: <span class="worldwyde-country-name">{{ handleCountryName(max_min_obj.min_statistics[ArrayOfSongStatistics[index-1]][0]) }}</span>, with an <span class="worldwyde-country-duration">average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'duration' : ArrayOfSongStatistics[index-1] }} value</span> of <span style="color: rgb(255, 150, 255)" class="worldwyde-country-percentage">{{ handlePercentages(ArrayOfSongStatistics[index-1], max_min_obj.min_statistics[ArrayOfSongStatistics[index-1]]) }}</span>
                            </li></h3>
                        </ul>
                    </div>
                    <div class="min-max-wrapper" v-else>
                        <ul class="attribute-list">
                            <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                <span style="color: rgb(100, 250, 250)">Highest</span> Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}: <span class="worldwyde-country-name">{{ handleCountryName(max_min_obj.max_statistics[ArrayOfSongStatistics[index-1]][0]) }}</span>, with an <span class="worldwyde-country-duration">average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'duration' : ArrayOfSongStatistics[index-1] }} value</span> of <span class="worldwyde-country-percentage">{{ handlePercentages(ArrayOfSongStatistics[index-1], max_min_obj.max_statistics[ArrayOfSongStatistics[index-1]]) }}</span>
                            </li></h3>
                        </ul>
                    </div>
                </div>
                <div class="comparison-component-statistics" v-else>
                    <div :id="country.country" class="min-max-wrapper country" v-for="country in countries" :key="country.country">
                        <h2 class="comparison-component-title">{{ handleCountryName(country.country) }}&nbsp;&nbsp;{{ getCountryEmoji(country.country) }}</h2>
                        <ul class="attribute-list">
                            <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                <span class="worldwyde-country-percentage">Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}</span>: <span class="worldwyde-country-name">{{ handlePercentages(ArrayOfSongStatistics[index-1], [country.country, country_to_playlist[country.country]["average_attributes"][ArrayOfSongStatistics[index-1] as keyof songStatistics] as number]) }}</span>
                            </li></h3>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent, Ref, ref, onMounted } from 'vue';
import { countryFlagEmoji } from '../functions/countryFlagEmoji';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import { countryPlaylist } from '../interfaces/countryPlaylist';
import { SpotifyTrackAttributes } from '../interfaces/SpotifyTrackAttributes';
import { Top50PlaylistContainer } from '../interfaces/Top50PlaylistContainer';
import { songStatistics } from '../interfaces/songStatistics';
import { ArrayOfSongStatistics } from '../interfaces/ArrayOfSongStatistics';
import { ArrayOfCountriesThatNeedTheBeforeThem } from '../interfaces/ArrayOfCountriesThatNeedTheBeforeThem';
import { handleLogIn } from '../functions/handleLogIn';
import { evaluateParameters } from '../functions/evaluateParameters';
import { attributeToColor } from '../functions/attributeToColor';
import { fillInTheBlank } from '../functions/fillInTheBlank';
import { shuffleArray } from '../functions/shuffleArray';
import { millisecondsToMinutesAndSeconds } from '../functions/millisecondsToMinutesAndSeconds';
var countryData = require('country-data');

export default defineComponent({
    emits: ['goHome'],
    props: {
        comparisons: Object as PropType<Array<countryPlaylist>>,
    },
    components: {
        LoadingSpinnerVue,
    },
    setup(props, context) {
        const countries = ref(props.comparisons) as Ref<Array<countryPlaylist>>;
        const country_flags = ref({}) as Ref<{ [country: string]: { country: string, flag: string } }>;
        const country_to_playlist = ref({}) as Ref<{ [country: string]: {country: string, playlist: Top50PlaylistContainer, average_attributes: songStatistics} }>;
        const max_min_obj = ref({}) as Ref<{ max_statistics: { [attribute: string]: [country: string, value: number], }, min_statistics: { [attribute: string]: [country: string, value: number], } }>;
        const country_statistics = ref([]) as Ref<Array<string>>;
        const showBlurbs = ref(true);
        const showIndividualCountryStatistics = ref("min") as Ref<'min' | 'max' | 'raw'>;
        const width = ref(window.innerWidth);

        // window width monitor
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        // adds 'The' to certain countries
        const handleCountryName = (country: string) => {
            return ArrayOfCountriesThatNeedTheBeforeThem.includes(country) ? country === 'Global' ? 'The World' : 'The ' + country : country;
        }

        // takes country name and turns it to emoji
        const getCountryEmoji = (country: string) => {
            const country_obj = countryFlagEmoji(country);
            return country_obj.emoji;
        }

        // allows for click of flags and name of country to display country statistics
        const showCountryDisplay = () => {
            showBlurbs.value = false;
            showIndividualCountryStatistics.value = "raw";
        }

        // parses percentage data values
        const handlePercentages = (type: string, values: [country: string, value: number]) => {
            if (type !== 'popularity' && type !== 'loudness' && type !== 'tempo' && type !== 'duration_ms') {
                return (values[1]*100).toFixed(2) + '%';
            }
            else {
                switch (type) {
                    case 'popularity':
                        return values[1].toFixed(2) + '%';
                    case 'loudness':
                        return values[1].toFixed(2) + ' dB LUFS.';
                    case 'tempo':
                        return values[1].toFixed(2) + ' beats per minute.';
                    case 'duration_ms':
                        return millisecondsToMinutesAndSeconds(+(values[1]).toFixed(0));
                    // default case will never be reached
                    default:
                        break;
                }
            }
        }

        // change comparison component from displaying either individual country statistics or min/max
        const handleCustomizationChange = (goingUp: boolean, value: 'min' | 'max' | 'raw') => {
            if (goingUp) {
                if (value === 'min') showIndividualCountryStatistics.value = 'max';
                else showIndividualCountryStatistics.value = 'raw';
            }
            else {
                if (value === 'raw') showIndividualCountryStatistics.value = 'max';
                else showIndividualCountryStatistics.value = 'min'; 
            }
        }

        // gets descriptors and colors of song attributes
        const getSongDescriptors = (song_features: SpotifyTrackAttributes) => {
            let attributes: { [key: string]: Array<string | number> } = evaluateParameters(song_features);
            const attrs: Array<Array<string>> = attributeToColor(attributes);
            return attrs;
        }

        // swaps statistics display component
        const swapDisplayOfStatistics = () => {
            showBlurbs.value = !showBlurbs.value;
            if (showBlurbs.value) setTimeout(() => styleCountryAndStat(), 500);
        }

        // gets attributes of songs in playlist
        const getSongAttributes = async (playlist: Top50PlaylistContainer) => {
            if (Object.keys(playlist).length === 0) handleLogIn();
            else {
                const average_attributes = {
                    danceability: 0,
                    energy: 0,
                    loudness: 0,
                    speechiness: 0,
                    acousticness: 0,
                    instrumentalness: 0,
                    liveness: 0,
                    valence: 0,
                    tempo: 0,
                    duration_ms: 0,
                };
                // loops through playlist and gets attributes of each song
                for (let i = 0; i < Object.keys(playlist).length; i++) {
                    const trackFeaturesURL = 'https://spotifyve-backend.herokuapp.com/getTrackFeatures?id=' + playlist[i].id + '&access_token=' + localStorage.access_token;
                    const audio_features_json = await fetch(trackFeaturesURL);
                    const audio_features = await audio_features_json.json();
                    try {
                        Object.keys(average_attributes).forEach((el: string) => {
                            average_attributes[el as keyof typeof average_attributes] += +audio_features[el].toFixed(4);
                            if (i === Object.keys(playlist).length-1) {
                                average_attributes[el as keyof typeof average_attributes] = +(average_attributes[el as keyof typeof average_attributes] / 50).toFixed(4);
                            }
                        });
                    }
                    catch(err: unknown) {
                        console.error((err as Error).message, `at item #${i+1} of 50 (index ${i}).`);
                        if (i === Object.keys(playlist).length-1) {
                            Object.keys(average_attributes).forEach((el: string) => {
                                average_attributes[el as keyof typeof average_attributes] = +(average_attributes[el as keyof typeof average_attributes] / 50).toFixed(4);
                            });
                        }
                    }
                    const attrs = getSongDescriptors(audio_features);
                    playlist[i]['attributes'] = attrs;
                }
                return [playlist, average_attributes] as [Top50PlaylistContainer, songStatistics];
            }
        }

        // Promise All of fetch songs and playlists from countries array
        const fetchSongsAndPlaylists = async () => {
            const songs_and_playlists = await Promise.all(countries.value.map(async country => {
                const playlist_json = await (await fetch('https://spotifyve-backend.herokuapp.com/tracks_from_playlist?id=' + country.id + '&access_token=' + localStorage.access_token)).json();
                const playlist = {} as typeof playlist_json;
                const explicit_popularity = [0,0];
                for (let i = 0; i < Object.keys(playlist_json).length; i++) {
                    playlist[i] = playlist_json[i].track;
                    if (playlist[i].explicit) explicit_popularity[0]++;
                    explicit_popularity[1] += playlist[i].popularity;
                    if (i === Object.keys(playlist_json).length-1) {
                        explicit_popularity[0] /= Object.keys(playlist_json).length;
                        explicit_popularity[1] /= Object.keys(playlist_json).length;
                    }
                }
                const [modified_playlist, average_attributes] = await getSongAttributes(playlist) as [Top50PlaylistContainer, songStatistics];
                average_attributes['explicit'] = explicit_popularity[0];
                average_attributes['popularity'] = explicit_popularity[1];
                return { country: country.country, playlist: modified_playlist, average_attributes: average_attributes };
            }));
            return songs_and_playlists;
        }

        const getStatSentenceFromNumbers = (max_stats: { [attribute: string]: [country: string, value: number], }, min_stats: { [attribute: string]: [country: string, value: number], }) => {
            const phrases = [] as Array<string>;
            ArrayOfSongStatistics.forEach(stat => {
                const max_data = max_stats[stat];
                const min_data = min_stats[stat];
                const max_phrase = fillInTheBlank(max_data, stat, true);
                const min_phrase = fillInTheBlank(min_data, stat, false);
                phrases.push(max_phrase);
                phrases.push(min_phrase);
            });
            return phrases;
        }

        const formulateFactoids = (obj: Array<{ country: string; playlist: Top50PlaylistContainer; average_attributes: songStatistics; }>) => {
            const maxStatistics = {} as { [attribute: string]: [country: string, value: number], };
            const minStatistics = {} as { [attribute: string]: [country: string, value: number], };
            // find min and max of each attribute
            Object.keys(obj[0].average_attributes).forEach(attribute => {
                // reduction method to find max of each attribute
                const max_obj = obj.reduce((prev, curr) => {
                    const previous = prev.average_attributes[attribute as keyof songStatistics] as number;
                    const current = curr.average_attributes[attribute as keyof songStatistics] as number;
                    return previous < current ? curr : prev;
                });
                // reduction method to find min of each attribute
                const min_obj = obj.reduce((prev, curr) => {
                    const previous = prev.average_attributes[attribute as keyof songStatistics] as number;
                    const current = curr.average_attributes[attribute as keyof songStatistics] as number;
                    return previous < current ? prev : curr;
                });
                // explicitly assign each attribute its value and append it to master object
                const max = max_obj.average_attributes[attribute as keyof songStatistics] as number;
                const min = min_obj.average_attributes[attribute as keyof songStatistics] as number;
                maxStatistics[attribute as keyof songStatistics] = [max_obj.country, max];
                minStatistics[attribute as keyof songStatistics] = [min_obj.country, min];
            });
            const factoids: Array<string> = getStatSentenceFromNumbers(maxStatistics, minStatistics);
            max_min_obj.value['max_statistics'] = maxStatistics;
            max_min_obj.value['min_statistics'] = minStatistics;
            return factoids;
        }

        // get flags from each country
        const fetchFlags = async () => {
            await Promise.all(countries.value.map(async country => {
                try {
                    const countryName = countryData.lookup.countries({name: country.country})[0];
                    const url = 'https://flagsapi.com/png/' + countryName + '/flat/64.png';
                    const fetchBlob = await fetch(url);
                    const parseBlob = await fetchBlob.blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(parseBlob); 
                    reader.onloadend = () => {
                        const string = (reader.result as string);
                        if (country.country !== 'Global') country_flags.value[country.country as string] = { country: country.country, flag: string };
                        else country_flags.value[country.country as string] = { country: country.country, flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_the_United_Nations.png/800px-Flag_of_the_United_Nations.png?20221118140253" };
                    };
                }
                catch(err: unknown) {
                    console.error((err as Error).message);
                }
            }));
        }

        const replaceDuration = (el: Element) => {
            const innerHTML = el.innerHTML;
            const split_elem = innerHTML.split('track duration of ');
            const number_constructor = [] as string[];
            for (let i = 0; i < split_elem[1].length; i++) {
                if (!isNaN(+split_elem[1][i]) || split_elem[1][i] === ':') number_constructor.push(split_elem[1][i]);
                else break;
            }
            const number = number_constructor.join('');
            const duration_span = "<span class='worldwyde-country-duration'>" + number + "</span>";
            const elem = el.innerHTML.split(number).join(duration_span);
            return elem;
        }

        const replaceBPM = (el: Element) => {
            const innerHTML = el.innerHTML;
            const split_elem = innerHTML.split(' beats per minute');
            const number_constructor = [] as string[];
            for (let i = split_elem[0].length-1; i >= 0; i--) {
                if (!isNaN(+split_elem[0][i])) number_constructor.unshift(split_elem[0][i]);
                else break;
            }
            const number = number_constructor.join('').replace(' ','');
            const bpm_span = "<span class='worldwyde-country-bpm'>" + number + " beats per minute</span>";
            const elem = el.innerHTML.split(number + ' beats per minute').join(bpm_span);
            return elem;
        }

        const replaceDecibel = (el: Element) => {
            const innerHTML = el.innerHTML;
            const split_elem = innerHTML.split(' dB LUFS');
            const number_constructor = [] as string[];
            for (let i = split_elem[0].length-1; i >= 0; i--) {
                if (!isNaN(+split_elem[0][i]) || split_elem[0][i] === '.' || split_elem[0][i] === '-') number_constructor.unshift(split_elem[0][i]);
                else break;
            }
            const number = number_constructor.join('').replace(' ','');
            const decibel_span = "<span class='worldwyde-country-decibel'>" + number + " dB LUFS</span>";
            const elem = el.innerHTML.split(number + ' dB LUFS').join(decibel_span);
            return elem;
        }

        const replacePercentages = (el: Element) => {
            const innerHTML = el.innerHTML;
            const split_elem = innerHTML.split('%');
            const number_constructor = [] as string[];
            for (let i = split_elem[0].length-1; i >= 0; i--) {
                if (!isNaN(+split_elem[0][i]) || split_elem[0][i] === '.') number_constructor.unshift(split_elem[0][i]);
                else break;
            }
            const number = number_constructor.join('').replace(' ','');
            const percentage_span = "<span class='worldwyde-country-percentage'>" + number + "%</span>";
            const elem = el.innerHTML.split(number + '%').join(percentage_span);
            return elem;
        }

        // styles all countries and stats in DOM
        const styleCountryAndStat = () => {
            countries.value.map(country => {
                const elems = document.querySelectorAll("li");
                const country_span = `<span class="worldwyde-country-name">` + (country.country === 'Global' ? "The World" : country.country) + "</span>";
                for (let x = 0; x < elems.length; x++) {
                    if (elems[x].innerHTML.includes("%") && !elems[x].innerHTML.includes("worldwyde-country-percentage")) elems[x].innerHTML = replacePercentages(elems[x]);
                    else if (elems[x].innerHTML.includes("dB LUFS") && !elems[x].innerHTML.includes("worldwyde-country-decibel")) elems[x].innerHTML = replaceDecibel(elems[x]);
                    else if (elems[x].innerHTML.includes("track duration") && !elems[x].innerHTML.includes("worldwyde-country-duration")) elems[x].innerHTML = replaceDuration(elems[x])
                    else if (elems[x].innerHTML.includes("beats per minute") && !elems[x].innerHTML.includes("worldwyde-country-bpm")) elems[x].innerHTML = replaceBPM(elems[x]);
                    elems[x].innerHTML = elems[x].innerHTML.split((country.country === 'Global' ? "The World" : country.country)).join(country_span);
                }
            });
        }
        
        // fetch stats from playlists
        const formulateStatistics = async () => {
            await fetchFlags(); // sets country flags
            const songs_and_playlists = await fetchSongsAndPlaylists();
            songs_and_playlists.forEach(country => {
                country_to_playlist.value[country.country] = country;
            })
            const factoids = formulateFactoids(songs_and_playlists);
            country_statistics.value = shuffleArray(factoids, true);
            // styles all countries and stats in DOM
            setTimeout(() => styleCountryAndStat(), 500);
        }

        // return home
        const handleHome = () => {
            context.emit('goHome', 'home');
        }

        onMounted(() => formulateStatistics());

        return { props, width, countries, ArrayOfSongStatistics, country_flags, country_to_playlist, country_statistics, max_min_obj, showBlurbs, showIndividualCountryStatistics, getCountryEmoji, handleHome, handleCountryName, swapDisplayOfStatistics, handleCustomizationChange, handlePercentages, showCountryDisplay };
    }
})
</script>

<style>
.comparison-page-headings {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 0;
}
.worldwyde-heading-title-text-go-back {
    left: 20%;
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
    position: absolute;
}
.worldwyde-heading-title-text-go-back:hover {
    color: rgba(46, 46, 46, .9);
    background-color: #f3f3f3;
    box-shadow: none;
    transform: translateY(2px);
}
.togglable {
    transition: .2s ease-in-out;
    cursor: pointer;
}
.togglable:hover {
    color: #ddd;
    transform: translateY(1px);
}
.min-max-wrapper h2 {
    margin: 0;
}
.min-max-wrapper {
    width: 400px;
    height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    margin: 10px auto;
}
.min-max-wrapper.country {
    height: 550px;
}
.comparison-component-statistics {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: auto;
}
.comparison-component-title {
    text-shadow: 0 0 4px rgba(0,0,0,0.5);
}
.worldwyde-comparison-buttons button {
    border: none;
    padding: 10px 20px;
    margin: 20px auto 0;
    border-radius: 20px;
    transition: .2s ease-in-out;
    color: #f3f3f3;
    box-shadow: 0 0 8px rgba(255,255,255,0.5);
    background-color: #9b5f40;
    cursor: pointer;
}
.worldwyde-comparison-buttons button.comparison-active {
    color: #e0e0e0;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    background-color: #1f829b;
    transform: translateY(1px);
}
.worldwyde-comparison-buttons button.comparison-active:hover {
    background-color: #2d94ad;
    color: #e0e0e0;
}
.worldwyde-comparison-buttons button:hover {
    color: #9b5f40;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    background-color: #e0e0e0;
    transform: translateY(2px);
}
.worldwyde-comparison-buttons button h3 {
    margin: 0;
    font-family: 'Figtree','Avenir', Helvetica, Arial, sans-serif;
}
.worldwyde-comparison-buttons {
    width: 60%;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
span.worldwyde-country-duration {
    color: #f7fa56;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
span.worldwyde-country-bpm {
    color: #fa56fa;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
span.worldwyde-country-decibel {
    color: #ffa33b;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
span.worldwyde-country-percentage {
    color: #56fa9a;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
span.worldwyde-country-name {
    color: #56cbfa;
    text-shadow: 0 0 3px rgba(0, 0, 0);
}
.attribute-list {
    padding: 0;
    width: 100%;
    list-style-position: inside;
}
.attribute-list li {
    margin: 10px auto;
    text-shadow: 0 0 4px rgba(0, 0, 0);
    color: #eee;
}
.attribute-list li::marker {
    color: #5B67C4;
}
.worldwyde-display-country-flag-image {
    width: 200px;
    height: 120px;
}
.worldwyde-display-country-flag {
    width: 400px;
    min-height: 150px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0.75;
    transition: .2s ease-in-out;
}
.worldwyde-display-country-flag:hover {
    opacity: 1;
}
.worldwyde-display-country-flag h2 {
    margin: 10px auto 5px;
    text-shadow: 0 0 16px rgba(0, 0, 0);
    cursor: pointer;
}
.worldwyde-display-country-flag img, img.worldwyde-display-country-flag-image {
    margin: 5px auto 10px;
    border-radius: 5px;
    box-shadow: 0 0 16px rgba(0,0,0,0.5);
    cursor: pointer;
}
.country-flags {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: auto;
}
.worldwyde-comparison-blurbs {
    width: 100%;
    margin: auto;
}
.worldwyde-statistic-comparison {
    padding: 20px;
    width: 90%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    background-color: #c48363;
}
@media (max-width: 1000px) {
    .worldwyde-heading-title-text-go-back {
        left: 10%;
    }
    img.worldwyde-display-country-flag-image{
        width: 150px;
        height: 80px;
    }
    .country-flags {
        width: 100%;
    }
    .comparison-component-statistics {
        height: 80%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
    }
    .min-max-wrapper{
        height: 80%;
    }
    .min-max-wrapper.country {
        height: 100%;
        margin: 10px 0;
        padding: 5px;
    }
}
@media (max-width: 865px) {
    .min-max-wrapper h2.comparison-component-title {
        font-size: 20px;
    }
    .attribute-list h3 {
        font-size: 16px;
    }
}
@media (max-width: 600px) { 
    .worldwyde-heading-title-text-go-back {
        left: 2%;
        padding: 0.5%;
    }
    img.worldwyde-display-country-flag-image{
        width: 100px;
        height: 60px;
    }
    .min-max-wrapper h2.comparison-component-title, h2.comparison-component-title{
        font-size: 20px;
    }
}
@media (max-width: 525px) {
    .attribute-list h3 {
        font-size: 12px;
    }
    .worldwyde-comparison-buttons {
        width: 100%;
    }
    .worldwyde-comparison-buttons button {
        font-size: 12px;
        padding: 5px 10px;
    }
    h1.comparison-page-title {
        font-size: 24px;
    }
    .worldwyde-statistic-comparison {
        width: 85%;
    }
}
@media (max-width: 400px) {
    img.worldwyde-display-country-flag-image{
        width: 80px;
        height: 50px;
    }
    .min-max-wrapper h2.comparison-component-title, h2.comparison-component-title{
        font-size: 16px;
    }
}
@media (max-width: 360px) {
    .worldwyde-comparison-buttons button {
        font-size: 10px;
    }
    h1.comparison-page-title {
        font-size: 20px;
    }
    .min-max-wrapper.country {
        padding: 2px;
    }
}
@media (max-width: 300px) {
    h1.comparison-page-title {
        font-size: 18px;
    }
    img.worldwyde-display-country-flag-image{
        width: 70px;
        height: 40px;
    }
    .min-max-wrapper.country {
        padding: 0;
    }
}
</style>

<style scoped>
span.go-back:hover, span.go-forward:hover {
    transform: translateY(1px);
    box-shadow: 0 0 8px #eee;
    border: 1px solid rgba(238, 238, 238, 0.5);
}
span.go-back.off:hover, span.go-forward.off:hover, .off:hover {
    transform: none;
    box-shadow: none;
}
span.go-back, span.go-forward {
    border: 1px solid rgb(69, 69, 69);
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
    color: #eee;
    border-radius: 60px;
    padding: 4px;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    transition: .05s ease-in-out;
}
.type-selector {
    margin: 40px auto 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-width: 40%;
    height: 10%;
    max-width: 50%;
}
@media (max-width: 1000px) {
    .type-selector {
        max-width: 80%;
    }
}
@media (max-width: 500px) {
    .type-selector {
        max-width: 100%;
    }
}
</style>