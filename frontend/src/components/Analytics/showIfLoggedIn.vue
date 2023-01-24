<template>
    <div class="analytics-wrapper" id="analytics-wrapper">
        <h1 class="analytics-title">Analytics 📈</h1>
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
                <div class="dropdown-container">
                    <h2 class="comparison-component-title">Compare Your Listening Habits</h2>
                    <div v-if="!hideDropdown && !loadingComparison" class="dropdown-wrapper" :style="{ 
                        'max-height': !dropdown ? 'none' : '220px',
                        'overflow-y': !dropdown ? 'visible' : 'scroll',
                        'z-index': dropdown ? 10 : 9,
                    }" :class="{ off: played_countries.length === 0 }">
                        <span class="material-symbols-outlined show-more" :class="{ flipped: dropdown }" v-if="width > 500">expand_more</span>
                        <div class="dropdown-choice dropdown-active" @click="played_countries.length === 0 ? '' : handleDropdown()" style="border-radius: 10px;" v-if="!dropdown">
                            <p class="dropdown-p">{{ country.country }}</p>
                        </div>
                        <div :id="nation.country === country.country ? 'current-country' : ''" class="dropdown-choice" :class="{ 'dropdown-active': nation.country === country.country }" v-for="nation in played_countries" :key="nation.id" @click="handleDropdown(nation)" v-if="dropdown">
                            <p class="dropdown-p">{{ nation.country }}</p>
                        </div>
                    </div>
                </div>
                <LoadingSpinnerVue v-if="Object.keys(countryStatistics).length === 0 || loadingComparison" />
                <div class="comparison-component-statistics" v-else :class="{ 'display-as-column': width < 750 }">
                    <div class="min-max-wrapper">
                        <h2 class="comparison-component-title">Your Listening Habits</h2>
                        <ul class="attribute-list">
                            <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                <span style="color: #76e8fe" class="worldwyde-country-name">Your Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}</span>: <span :style="{ 
                                    color: 
                                        (userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) > (countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) 
                                        ? '#56fa9a'
                                        : (userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) < (countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number)
                                        ? '#ff9090'
                                        : '#f7fa56'
                                    }" class="worldwyde-country-percentage">{{ handlePercentages(ArrayOfSongStatistics[index-1], userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) }}</span>
                            </li></h3>
                        </ul>
                    </div>
                    <div class="min-max-wrapper">
                        <div :id="country.country" class="min-max-wrapper country">
                            <h2 class="comparison-component-title">{{ handleCountryName(country.country) }}&nbsp;&nbsp;{{ getCountryEmoji(country.country) }}</h2>
                            <ul class="attribute-list">
                                <h3><li v-for="index in ArrayOfSongStatistics.length" :key="index">
                                    <span class="worldwyde-country-percentage" style="color: #43e0fe">Average {{ ArrayOfSongStatistics[index-1] === 'duration_ms' ? 'Duration' : (ArrayOfSongStatistics[index-1].slice(0,1).toUpperCase() + ArrayOfSongStatistics[index-1].slice(1)) }}</span>: <span :style="{
                                        color:
                                            (userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) > (countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) 
                                            ? '#ff9090'
                                            : (userStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) < (countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number)
                                            ? '#56fa9a'
                                            : '#f7fa56'
                                    }" class="worldwyde-country-name">{{ handlePercentages(ArrayOfSongStatistics[index-1], countryStatistics[ArrayOfSongStatistics[index-1] as keyof songStatistics] as number) }}</span>
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
import * as htmlToImage from 'html-to-image';
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
        const country = ref({ country: "United States of America", id: "37i9dQZEVXbLRQDuF5jeBp" }) as Ref<countryPlaylist>;
        const countryStatistics = ref({}) as Ref<songStatistics>;
        const countryTopSongs = ref({}) as Ref<Top50PlaylistContainer>;
        const played_countries = ref([]) as Ref<Array<countryPlaylist>>;
        const dropdown = ref(false);
        const loadingComparison = ref(false);
        const hideDropdown = ref(false);

        // handle share color board
        const shareColorBoard = () => {
            // need to reset margins to left due to quirk of library reading element from page left to elem width instead of elem left to elem right
            // ex: elem width 100 and margin 20 10 will have 10px background and 90px elem in final image instead
            const image = document.getElementById("analytics-wrapper") as HTMLElement;
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

        // handles dropdown
        const handleDropdown = (nation?: { country: string, id: string }) => {
            dropdown.value = !dropdown.value;
            if (!dropdown.value && nation) {
                country.value = nation;
                loadingComparison.value = true;
                hideDropdown.value = true;
                fetchCountryStatistics();
            }
        }

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

        // fetch all countries from backend
        const fetchCountryList = async () => {
            const url = 'https://spotifyve-backend.herokuapp.com/country_playlists';
            const country_json = await (await fetch(url)).json();
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
            const url = "https://spotifyve-backend.herokuapp.com/user_analytics?limit=50&offset=0&access_token=" + localStorage.access_token + "&time_range=" + time_frame.value;
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
            const id = played_countries.value.filter(nation => {
                return nation.country === country.value.country;
            });
            const url = "https://spotifyve-backend.herokuapp.com/country_analytics?access_token=" + localStorage.access_token + "&id=" + id[0].id;
            const country_analysis_json = await (await fetch(url)).json();
            if (Object.keys(country_analysis_json).length === 1) {
                handleLogIn();
            }
            else {
                countryStatistics.value = country_analysis_json.average_statistics;
                countryTopSongs.value = country_analysis_json.top_songs;
                loadingComparison.value = false;
                hideDropdown.value = false;
            }
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

        return { shareColorBoard, hideDropdown, loadingComparison, width, time_frame, dropdown, userStatistics, userTopSongs, countryStatistics, countryTopSongs, showComparisonComponent, ArrayOfSongStatistics, country, played_countries, swapDisplayOfStatistics, handleCountryName, getCountryEmoji, handlePercentages, handleDropdown };
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
.dropdown-container {
    margin-bottom: 40px;
}
.analytics-title {
    font-size: 40px;
}
@media (max-width: 750px) {
    .analytics-title {
        font-size: 32px;
    }
}
</style>