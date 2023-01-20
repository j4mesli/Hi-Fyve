<template>
    <div class="analytics-wrapper" id="analytics-wrapper">
        <h1 style="font-size: 40px;">Analytics 📈</h1>
        <LoadingSpinnerVue v-if="Object.keys(userStatistics).length === 0" />
        <div class="analytics-content" v-else>
            <div class="worldwyde-comparison-buttons">
                <button @click="swapDisplayOfStatistics" :class="{ 'comparison-active': !showComparisonComponent }"><h3>View Your Metrics</h3></button>
                <button @click="swapDisplayOfStatistics" :class="{ 'comparison-active': showComparisonComponent }"><h3>Compare Your Metrics</h3></button>
            </div>
            <div class="comparison-component-statistics display-as-column" v-if="!showComparisonComponent">
                <h2 class="comparison-component-title">Your Listening Habits</h2>
                <div class="min-max-wrapper">
                    <ul class="attribute-list">
                        <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                            <span style="color: rgb(100, 250, 250)">Your</span> Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}: <span style="color: rgb(255, 150, 255)" class="worldwyde-country-percentage">{{ handlePercentages(ArrayOfSongStatistics[index-1], userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) }}</span>
                        </li></h3>
                    </ul>
                </div>
            </div>
            <div class="comparison-component-statistics display-as-column" v-else>
                <h2 class="comparison-component-title">Compare Your Listening Habits</h2>
                <div class="type-selector">
                    <span id="go-back" @click="country_playlist_type !== 'viral' ? handleCustomizationChange(country_playlist_type) : ''" class="material-symbols-outlined go-back" :class="{ off: country_playlist_type === 'viral' }">chevron_left</span>
                    <h2 class="comparison-component-title">{{ country_playlist_type === 'viral' ? "50 Most Viral" : "50 Most Played" }}</h2>
                    <span id="go-forward" @click="country_playlist_type !== 'played' ? handleCustomizationChange(country_playlist_type) : ''" class="material-symbols-outlined go-forward" :class="{ off: country_playlist_type === 'played' }">chevron_right</span>
                </div>
                <LoadingSpinnerVue v-if="Object.keys(countryStatistics).length === 0" />
                <div class="display-as-row" v-else>
                    <div class="min-max-wrapper">
                        <ul class="attribute-list">
                            <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                <span style="color: rgb(100, 250, 250)">Your</span> Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}: <span style="color: rgb(255, 150, 255)" class="worldwyde-country-percentage">{{ handlePercentages(ArrayOfSongStatistics[index-1], userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) }}</span>
                            </li></h3>
                        </ul>
                    </div>
                    <div class="min-max-wrapper">
                        <div :id="country" class="min-max-wrapper country">
                            <h2 class="comparison-component-title">{{ handleCountryName(country) }}&nbsp;&nbsp;{{ getCountryEmoji(country) }}</h2>
                            <ul class="attribute-list">
                                <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                    <span class="worldwyde-country-percentage">Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}</span>: <span class="worldwyde-country-name">{{ handlePercentages(ArrayOfSongStatistics[index-1], countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) }}</span>
                                </li></h3>
                            </ul>
                        </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue';
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue'
import { ArrayOfCountriesThatNeedTheBeforeThem } from '../interfaces/ArrayOfCountriesThatNeedTheBeforeThem';
import { songStatistics } from '../interfaces/songStatistics';
import { Top50PlaylistContainer } from '../interfaces/Top50PlaylistContainer';
import { ArrayOfSongStatistics } from '../interfaces/ArrayOfSongStatistics';
import { countryPlaylist } from '../interfaces/countryPlaylist';
import { millisecondsToMinutesAndSeconds } from '../functions/millisecondsToMinutesAndSeconds';
import { handleLogIn } from '../functions/handleLogIn';
import { countryFlagEmoji } from '../functions/countryFlagEmoji';

export default defineComponent({
    components: {
        LoadingSpinnerVue,
    },
    setup() {
        const width = ref(window.innerWidth);
        const time_frame = ref('short_term') as Ref<'short_term' | 'medium_term' | 'long_term'>;
        const userStatistics = ref({}) as Ref<songStatistics>;
        const userTopSongs = ref({}) as Ref<Top50PlaylistContainer>;
        const showComparisonComponent = ref(false);
        const country_playlist_type = ref('played') as Ref<'viral' | 'played'>;
        const country = ref("United States of America");
        const countryStatistics = ref({}) as Ref<songStatistics>;
        const countryTopSongs = ref({}) as Ref<Top50PlaylistContainer>;
        const viral_countries = ref([]) as Ref<Array<countryPlaylist>>;
        const played_countries = ref([]) as Ref<Array<countryPlaylist>>;

        // swap display of statistics
        const swapDisplayOfStatistics = () => {
            showComparisonComponent.value = !showComparisonComponent.value;
        }

        // adds 'The' to certain countries
        const handleCountryName = (country: string) => {
            return ArrayOfCountriesThatNeedTheBeforeThem.includes(country) ? country === 'Global' ? 'The World' : 'The ' + country : country;
        }

        // takes country name and turns it to emoji
        const getCountryEmoji = (country: string) => {
            const country_obj = countryFlagEmoji(country);
            return country_obj.emoji;
        }

        // handles swap type of country playlist comparison
        const handleCustomizationChange = (type: 'viral' | 'played') => {
            country_playlist_type.value = (type === 'viral' ? 'played' : 'viral');
        }

        // fetch all countries from backend
        const fetchCountryList = async () => {
            const url = 'http://localhost:3000/country_playlists';
            const country_json = await (await fetch(url)).json();
            viral_countries.value = country_json.viral;
            played_countries.value = country_json.plays;
        }

        // parses percentage data values
        const handlePercentages = (type: string, value: number) => {
            if (type !== 'loudness' && type !== 'tempo' && type !== 'duration_ms') {
                return value.toFixed(2) + '%';
            }
            else {
                switch (type) {
                    case 'loudness':
                        return value.toFixed(2) + ' dB LUFS.';
                    case 'tempo':
                        return value.toFixed(2) + ' beats per minute.';
                    case 'duration_ms': 
                        return millisecondsToMinutesAndSeconds(+(value).toFixed(0));
                    // default case will never be reached
                    default:
                        break;
                }
            }
        }

        // fetch user statistics
        const fetchUserStatistics = async () => {
            await fetchCountryList();
            const url = "http://localhost:3000/user_analytics?limit=50&offset=0&access_token=" + localStorage.access_token + "&time_range=" + time_frame.value;
            const user_analysis_json = await (await fetch(url)).json();
            if (Object.keys(user_analysis_json).length === 1) {
                handleLogIn();
            }
            else {
                userStatistics.value = user_analysis_json.average_statistics;
                userTopSongs.value = user_analysis_json.top_songs;
            }
        }

        // fetch country statistics
        const fetchCountryStatistics = async () => {
            // fetch country playlist statistics and parse through their stats
            // set them to correct objects and display them
        }

        // fetch all statistics
        const fetchStatistics = async () => {
            await fetchUserStatistics();
            await fetchCountryStatistics();
        }

        // window width value listener
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        // fetch user stats on mount to DOM
        onMounted(() => fetchStatistics());

        return { width, time_frame, country_playlist_type, userStatistics, userTopSongs, countryStatistics, countryTopSongs, showComparisonComponent, ArrayOfSongStatistics, country, viral_countries, played_countries, swapDisplayOfStatistics, handleCustomizationChange, handleCountryName, getCountryEmoji, handlePercentages };
    }
});
</script>

<style>
.analytics-content {
    width: 100%;
    margin: 20px auto;
}
.analytics-wrapper {
    border-radius: 10px;
    box-shadow: 0 0 8px white;
    width: 90%;
    min-height: 500px;
    margin: 20px auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #c48363;
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
.display-as-row {
    width: 100%;
    flex-direction: row;
}
.display-as-column {
    margin: 20px auto;
    flex-direction: column;
}
.min-max-wrapper {
    width: 80%;
    height: 80%;
    margin: 0 auto;
}
</style>