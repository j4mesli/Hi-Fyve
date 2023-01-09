<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
    <LoadingSpinnerVue v-if="songString === ''" />
    <div class="type-selector" v-if="songString !== ''">
        <span id="go-back" @click="!showVisualizer && songString !== '' ? handleCustomizationChange() : ''" class="material-symbols-outlined go-back" :class="{ off: showVisualizer || songString === '' }">chevron_left</span>
        <h3>{{ showVisualizer ? "Your Audio Visualizer" : "Your Color Board" }}</h3>
        <span id="go-forward" @click="showVisualizer && songString !== '' ? handleCustomizationChange() : ''" class="material-symbols-outlined go-forward" :class="{ off: !showVisualizer || songString === '' }">chevron_right</span>
    </div>
    <div class="canvas-buttons" v-if="(c1.length > 0 && c2.length > 0) && !showVisualizer">
        <a @mouseover="isHovering" @mouseout="isNotHovering" @click="shuffleColors()">Shuffle Palette</a>
        <a @mouseover="isHovering" @mouseout="isNotHovering" @click="shareColorBoard()">Share Your Colorboard</a>
    </div>
    <div id="polaroid-colors" class="polaroid-colors" v-if="(c1.length > 0 && c2.length > 0) && !showVisualizer">
        <strong><h1 class="chalk-writing">YOUR COLOR BOARD</h1></strong>
        <div class="polaroid-pictures" v-if="width > 700">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[0].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[0].name }}</h3>
                    <p>{{ gradient[0].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[1].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[1].name }}</h3>
                    <p>{{ gradient[1].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-3">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[2].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[2].name }}</h3>
                    <p>{{ gradient[2].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-4">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[3].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[3].name }}</h3>
                    <p>{{ gradient[3].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-5">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[4].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[4].name }}</h3>
                    <p>{{ gradient[4].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-6">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[5].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[5].name }}</h3>
                    <p>{{ gradient[5].hex }}</p>
                </div>
            </div>
        </div>
        <div class="polaroid-pictures" v-if="width <= 700 && width > 475">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[0].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[0].name }}</h3>
                    <p>{{ gradient[0].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[1].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[1].name }}</h3>
                    <p>{{ gradient[1].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-3">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[2].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[2].name }}</h3>
                    <p>{{ gradient[2].hex }}</p>
                </div>
            </div>
        </div>
        <div class="polaroid-pictures" v-if="width <= 700 && width > 475">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[3].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[3].name }}</h3>
                    <p>{{ gradient[3].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[4].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[4].name }}</h3>
                    <p>{{ gradient[4].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-3">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[5].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[5].name }}</h3>
                    <p>{{ gradient[5].hex }}</p>
                </div>
            </div>
        </div>
        <div class="polaroid-pictures" v-if="width <= 475">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[0].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[0].name }}</h3>
                    <p>{{ gradient[0].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[1].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[1].name }}</h3>
                    <p>{{ gradient[1].hex }}</p>
                </div>
            </div>
        </div>
        <div class="polaroid-pictures" v-if="width <= 475">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[2].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[2].name }}</h3>
                    <p>{{ gradient[2].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[3].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[3].name }}</h3>
                    <p>{{ gradient[3].hex }}</p>
                </div>
            </div>
        </div>
        <div class="polaroid-pictures" v-if="width <= 475">
            <div class="polaroid-color-wrapper" id="gradient-color-1">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[4].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[4].name }}</h3>
                    <p>{{ gradient[4].hex }}</p>
                </div>
            </div>
            <div class="polaroid-color-wrapper" id="gradient-color-2">
                <div class="thumbtack" :style="{ 'background-color': Math.ceil(Math.random()*2) === 2 ? 'rgb(225, 0, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(220, 220, 0)' : Math.ceil(Math.random()*2) === 2 ? 'rgb(0, 200, 100)' : 'rgb(0, 118, 225)'}"></div>
                <div class="polaroid-color" :style="{ 'background-color': gradient[5].hex }"></div>
                <div class="polaroid-caption">
                    <h3>{{ gradient[5].name }}</h3>
                    <p>{{ gradient[5].hex }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="canvas-buttons" v-if="songString !== '' && showVisualizer">
        <a @mouseover="isHovering" @mouseout="isNotHovering" @click="shuffleColors()">Shuffle Palette</a>
        <!-- <p class="synesthesia-dropdown-label">Choose a song:</p> -->
        <div class="dropdown-wrapper" :style="{ 
                transform: !toggleDropdown ? 'none' : 'translateY(40%)',
                'max-height': !toggleDropdown ? 'none' : '220px',
                'overflow-y': !toggleDropdown ? 'visible' : 'scroll',
            }">
            <span class="material-symbols-outlined show-more" :class="{ flipped: toggleDropdown }" v-if="width > 500">expand_more</span>
            <div class="dropdown-choice active" @click="handleDropdown()" style="border-radius: 10px;" v-if="!toggleDropdown">
                <p class="dropdown-p">{{ songTitle.length <= 25 ? songTitle : songTitle.slice(0,22) + '...' }} by {{ singer[0] }}</p>
            </div>
            <div :id="song.name === songTitle ? 'current-song' : ''" class="dropdown-choice" :class="{ off: song.mp3 === null, active: song.name === songTitle }" v-for="song in top_x_songs" :key="song.name" @click="song.mp3 === null ? '' : handleDropdown(song.name, song.artists, song.image, song.mp3)" v-if="toggleDropdown">
                <p class="dropdown-p">{{ song.name.length <= 25 ? song.name : song.name.slice(0,22) + '...' }} by {{ song.artists[0] }}</p>
            </div>
        </div>
        <a @mouseover="isHovering" @mouseout="isNotHovering" @click="swapColors()">Swap Color</a>
    </div>
    <div id="canvas-wrapper" class="canvas-wrapper" v-if="showVisualizer">
        
        <div class="canvas-overlay" v-if="songString !== ''">
            <span class="material-symbols-outlined overlay-symbols" v-if="!play_pause">pause</span>
            <div class="canvas-bottom-text">
                <div class="pfp-image-of-demo" :style="{ 'background-image': 'url(' + imageurl + ')' }"></div>
                <div class="canvas-song-desc-text">
                    <p id="song-title">{{ songTitle }}</p>
                    <p>
                        <span  v-for="(s, index) in singer" :key="s">{{ s }}<span v-if="index !== singer.length-1">, </span></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import LoadingSpinnerVue from '../LoadingSpinnerVue.vue';
import { defineComponent, ref, Ref, onMounted, onUnmounted   } from 'vue';
import { synesthesiaOutput } from '../interfaces/synesthesiaOutput';
import { refreshAccessToken } from '../functions/refreshAccessToken';
import { recursiveDFSofHTMLElemChildren } from '../functions/recursiveDFSofHTMLElemChildren';
import { shuffleArray } from '../functions/shuffleArray';
import * as ntcts from '../functions/ntc-ts/index';
import * as ColorLib from 'color';
import invert, { Color }  from "invert-color";
import * as htmlToImage from 'html-to-image';
// import html2canvas from 'html2canvas'; // deprecated, box-shadow doesn't work
import p5library from 'p5';
declare var p5: any;

export default defineComponent({
    components: {
        LoadingSpinnerVue,
    },
    props: {
        time_frame: String,
        type: String,
        range: Number,
    },
    setup(props) {
        // properties
        const showVisualizer = ref(true);
        const width = ref(window.innerWidth);
        const obj = ref({}) as Ref<synesthesiaOutput>;
        const top_x_songs = ref({}) as Ref<Array<{ name: string, artists: string[], image: string, mp3: string }>>;
        const c1 = ref([]) as Ref<number[]>;
        const c2 = ref([]) as Ref<number[]>;
        const gradient = ref([]) as Ref<Array<{ name: string, hex: string, }>>;
        const play_pause = ref(false);
        const songString = ref('');
        const url = ref('');
        const imageurl = ref('');
        const songTitle = ref('');
        const singer = ref([]) as Ref<string[]>;
        const toggleDropdown = ref(false);
        let myp5: unknown = null;
        let player: any = null;
        ntcts.initColors(ntcts.ORIGINAL_COLORS);

        // handle hovering effect over link
        const isHovering = (e: Event) => {
            const el = e.target as HTMLElement;
            el.classList.add("mark");
        };

        // handle not hovering effect over link
        const isNotHovering = (e: Event) => {
            const el = e.target as HTMLElement;
            el.classList.remove("mark");
        }

        // close dropdown
        document.addEventListener('click', (e) => {
            const el = e.target as HTMLElement;
            if (el.classList.length > 0) {
                if (el.classList[0] !== 'dropdown-p' && el.classList[0] !== 'dropdown-choice' && el.classList[0] !== 'dropdown-wrapper') {
                    toggleDropdown.value = false;
                }
            }
            else {
                toggleDropdown.value = false;
            }
        });

        // handles toggle of dropdown
        const handleDropdown = (name?: string, artists?: string[], image?: string, mp3?: string) => {
            toggleDropdown.value = !toggleDropdown.value;
            if (!toggleDropdown.value && name !== songTitle.value && artists !== singer.value && image !== imageurl.value) {
                songTitle.value = name!;
                singer.value = artists!;
                imageurl.value = image!;
                console.log(mp3);
                fetch(mp3!)
                    .then(res => res.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob); 
                            reader.onloadend = () => {
                                songString.value = (reader.result as string).replace("data:text/html;base64","data:audio/mpeg;base64");
                                player.deleteVisualizer();
                                shuffleColors();
                                myp5 = new p5(sketch, document.getElementById('canvas-wrapper') as HTMLElement);
                            }
                        })
                    .catch(err => console.log(err))
                .catch(err => console.log(err));
            }
        } 

        // handles synesthesia swap
        const handleCustomizationChange = () => {
            showVisualizer.value = !showVisualizer.value;
            if (showVisualizer.value) setTimeout(() => myp5 = new p5(sketch, document.getElementById('canvas-wrapper') as HTMLElement), 100);
            else player.remove(); 
        }

        // handle share color board
        const shareColorBoard = () => {
            // need to reset margins to left due to quirk of library reading element from page left to elem width instead of elem left to elem right
            // ex: elem width 100 and margin 20 10 will have 10px background and 90px elem in final image instead
            const image = document.getElementById("polaroid-colors")!;
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
            
            // uses alternate html2canvas library, box shadow doesn't work so it looks very weird

            // html2canvas(image).then(canvas => {
            //     canvas.style.height = Math.floor(parseInt(getComputedStyle(canvas).height)).toString();
            //     canvas.style.width = Math.floor(parseInt(getComputedStyle(canvas).height)).toString();
            //     const tab = window.open('','_blank') as Window;
            //     const link = document.createElement('a');
            //     link.download = 'mycolorboard.jpeg';
            //     link.href = canvas.toDataURL("image/jpeg");
            //     link.style.margin = '20px auto';
            //     link.style.width = '100%';
            //     link.style.height = '10%';
            //     link.innerHTML = `<h1 style="margin-left: auto; margin-right: auto">Click Here To Download Your Color Board</h1>`;
            //     tab.document.body.appendChild(canvas);
            //     tab.document.body.appendChild(link);
            // });
        }

        // handle shuffle color palette
        const shuffleColors = () => {
            const coin = Math.ceil(Math.random()*2);
            switch (coin) {
                case 1:
                    c1.value = shuffleArray(c1.value, false);
                    c2.value = invert.asRgbArray(c1.value as Color);
                    break;
                case 2:
                    c2.value = shuffleArray(c2.value, false);
                    c1.value = invert.asRgbArray(c2.value as Color);
                    break;
            }
            gradient.value.length = 0;
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c1.value).hsl().saturate(2).hex()).name, hex: ColorLib.rgb(c1.value).hsl().saturate(2).hex() });
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c1.value).hsl().saturate(1).hex()).name, hex: ColorLib.rgb(c1.value).hsl().saturate(1).hex() });
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c1.value).hex()).name, hex: ColorLib.rgb(c1.value).hex() });
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c2.value).hex()).name, hex: ColorLib.rgb(c2.value).hex() });
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c2.value).hsl().saturate(1).hex()).name, hex: ColorLib.rgb(c2.value).hsl().saturate(1).hex() });
            gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c2.value).hsl().saturate(2).hex()).name, hex: ColorLib.rgb(c2.value).hsl().saturate(2).hex() });
        }
        
        // handle swap color position in visualizer
        const swapColors = () => {
            const temp = c1.value;
            c1.value = c2.value;
            c2.value = temp;
        }

        // update width value
        window.addEventListener('resize', () => {
            width.value = window.innerWidth;
        });

        // get the synesthesia construction object from backend
        refreshAccessToken((localStorage.refresh_token as string))
        .then(async () => {
            console.log('refreshed')
            const synesthesia_url = 'http://localhost:3000/synesthesia?access_token='
            + localStorage.access_token
            + '&offset=0&limit=' 
            + props.range
            + '&time_range='
            + props.time_frame
            + '&request_type='
            + props.type;

            await fetch(synesthesia_url)
                .then(res => res.json())
                    .then((data: synesthesiaOutput) => {
                        obj.value = data;
                        top_x_songs.value = data.top_x_songs;
                        console.table(top_x_songs.value)
                        url.value = data.top_mp3;
                        imageurl.value = data.top_image;
                        singer.value = data.top_artists;
                        songTitle.value = data.top_name;
                        c1.value = data.color1;
                        c2.value = data.color2;
                        gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c1.value).hsl().saturate(2).hex()).name, hex: ColorLib.rgb(c1.value).hsl().saturate(2).hex() });
                        gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c1.value).hsl().saturate(1).hex()).name, hex: ColorLib.rgb(c1.value).hsl().saturate(1).hex() });
                        gradient.value.push({ name: data.color1_name, hex: data.color1_hex });
                        gradient.value.push({ name: data.color2_name, hex: data.color2_hex });
                        gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c2.value).hsl().saturate(1).hex()).name, hex: ColorLib.rgb(c2.value).hsl().saturate(1).hex() });
                        gradient.value.push({ name: ntcts.getColorName(ColorLib.rgb(c2.value).hsl().saturate(2).hex()).name, hex: ColorLib.rgb(c2.value).hsl().saturate(2).hex() });
                        console.table(gradient.value);
                        fetch(url.value)
                            .then(res => res.blob())
                                .then(blob => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(blob); 
                                    reader.onloadend = () => {
                                        songString.value = (reader.result as string).replace("data:text/html;base64","data:audio/mpeg;base64");
                                        if (myp5 === null) myp5 = new p5(sketch, document.getElementById('canvas-wrapper') as HTMLElement);
                                    }
                                })
                            .catch(err => console.log(err))
                        .catch(err => console.log(err));
                    })
                    .catch(err => console.table(err))
                .catch(err => console.table(err));
        });

        // on hover show cover art of song js
        onMounted(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const overlay = (canvas.parentElement as HTMLElement).children[0] as HTMLElement;
                window.addEventListener('resize', () => {
                    if ((canvas as HTMLElement).style.width !== overlay.style.width) {
                        overlay.style.width = (canvas as HTMLElement).style.width;
                        overlay.style.height = (canvas as HTMLElement).style.height;
                    }
                });
            }
            document.addEventListener('mousemove', e => {
                const elem = document.elementFromPoint(e.clientX, e.clientY);
                let wrapper = document.querySelector('div.canvas-overlay');
                if (elem && wrapper) {
                    //   if user hovers the canvas itself        OR  if user hovers the canvas-overlay parent elem    OR  if user hovers over a child elem of the wrapper
                    if (elem.nodeName.toLowerCase() === 'canvas' || elem.className.toLowerCase() === 'canvas-overlay' || recursiveDFSofHTMLElemChildren(wrapper.children, elem, wrapper)) {
                        const overlay = wrapper as HTMLElement;
                        overlay.style.opacity = '1';
                    }
                    else {
                        if (play_pause.value) (wrapper as HTMLElement).style.opacity = '0';
                    }
                }
            });
        });

        // instantiate new p5 with function
        let sketch = (p: any) => {
            player = p;
            class Particle {
                pos: p5library.Vector;
                vel: any;
                acc: p5library.Vector;
                width: any;
                color: any[];
                constructor() {
                    // 250 is max-radius - min-radius, or 350-150
                    this.pos = p5.Vector.random2D().mult(width*.36);
                    this.vel = p.createVector(0,0);
                    this.acc = this.pos.copy().mult(p.random(0.0001, 0.00001));

                    this.width = p.random(3,5);
                    // this.color = [p.random(200, 255), p.random(200, 255), p.random(200, 255)];
                    this.color = [
                        p.random((c1.value[0]-30 >= 0 ? c1.value[0]-30 : 0), (c1.value[0]+30 <= 255 ? c1.value[0]+30 : 255)), 
                        p.random((c1.value[1]-30 >= 0 ? c1.value[1]-30 : 0), (c1.value[1]+30 <= 255 ? c1.value[1]+30 : 255)), 
                        p.random((c1.value[2]-30 >= 0 ? c1.value[2]-30 : 0), (c1.value[2]+30 <= 255 ? c1.value[2]+30 : 255))
                    ];
                }
                update(cond: any) {
                    this.vel.add(this.acc);
                    this.pos.add(this.vel);
                    if (cond) {
                        this.pos.add(this.vel);
                        this.pos.add(this.vel);
                        this.pos.add(this.vel);                        
                    }
                }
                edges() {
                    return (this.pos.x < -width / 2 || this.pos.x > width / 2) || (this.pos.y < -height / 2 || this.pos.y > height / 2);
                }
                show() {
                    p.noStroke();
                    p.fill(this.color);
                    p.ellipse(this.pos.x, this.pos.y, this.width);
                }
            }
            let width = 800;
            let height = 800;
            let song: any;
            let fft: any;
            let amp: number;
            let particles: Particle[] = [];

            p.preload = () => {
                song = p.loadSound(songString.value);
            }

            p.setup = () => {
                p.createCanvas(width, height);
                // change from radians to degrees
                p.angleMode(p.DEGREES);
                fft = new p5.FFT();
            }

            p.draw = () => {
                p.redrawCanvas(window.innerWidth);
                p.background(c2.value);
                p.stroke(c1.value);
                p.strokeWeight(3);
                p.noFill();
                const wave = fft.waveform();
                // translates pattern to center of canvas, remove for linear
                p.translate(width/2, height/2);

                // makes particles respond & move from low frequency audio emissions
                fft.analyze();
                amp = fft.getEnergy(20, 200);

                // linear format
                // p.beginShape();
                // for (let i = 0; i < width; i++) {
                //     const index = p.floor(p.map(i, 0, width, 0, wave.length));
                //     const x = i;
                //     const y = wave[index] * 300 + height/2;
                //     p.vertex(x,y);
                // }
                // p.endShape();

                // circular format
                for (let t = -1; t <= 1; t += 2) {
                    p.beginShape();
                    for (let i = 0; i <= 180; i += 0.5) {
                        const index = p.floor(p.map(i, 0, 180, 0, wave.length - 1));
                        // syntax: p.map(wave instance, min-distance, max-distance, min-radius, max-radius)
                        const r = p.map(wave[index], -1, 1, width*.36 - 50, width*.36 + 50);
                        const x = r * p.sin(i) * t;
                        const y = r * p.cos(i);
                        p.vertex(x,y);
                    }
                    p.endShape();
                }

                // draw particles if song is playing
                if (song.isPlaying()) {
                    const par = new Particle();
                    particles.push(par);
                }
                // ITERATE THROUGH THIS ARRAY BACKWARDS AS P5 HAS A QUIRK WHERE ALL VISIBLE PARTICLES FLICKER WHEN THE CONTAINER ARRAY IS MODIFIED
                for (let i = particles.length - 1; i >= 0; i--) {
                    if (!particles[i].edges()) {
                        particles[i].update(amp >= 235);
                        particles[i].show();
                    }
                    else {
                        particles.splice(i, 1);
                    }
                }
                if (!song.isPlaying() && play_pause.value) song.play();
            }

            p.mouseClicked = (e: Event) => {
                // if user clicked on canvas
                if ((e.target as HTMLElement).nodeName.toLowerCase() === 'canvas' 
                // elif user clicked on the canvas-overlay
                || ((e.target as HTMLElement).classList.length >= 1 && (e.target as HTMLElement).classList[0].toLowerCase() === 'canvas-overlay')
                // elif the elem user clicked on is a child of the canvas-overlay (recursive DFS of multi-dimensional collection of HTMLElements)
                || recursiveDFSofHTMLElemChildren((document.querySelector('div.canvas-overlay') as HTMLElement).children, e.target as HTMLElement)) {
                    if (song.isPlaying()) {
                        play_pause.value = false;
                        song.pause();
                        p.noLoop();
                    }
                    else {
                        play_pause.value = true;
                        song.play();
                        p.loop();
                    }
                }
            }

            p.mousePressed = (e: Event) => {
                const bignav = document.querySelector('#big-router') as HTMLElement;
                const littlenav = document.querySelector('#little-router') as HTMLElement;
                const inBigNav: boolean = bignav !== null ? recursiveDFSofHTMLElemChildren(bignav.children, e.target as HTMLElement) : false;
                const inLittleNav: boolean = littlenav !== null ? recursiveDFSofHTMLElemChildren(littlenav.children, e.target as HTMLElement) : false;
                if (inBigNav || inLittleNav || ((e.target as HTMLElement).id === "go-forward") && showVisualizer.value) { 
                    song.pause(); 
                    p.remove(); 
                }
            }

            p.redrawCanvas = (innerWidth: number) => {
                if (innerWidth > 900) {
                    p.resizeCanvas(800, 800);
                    width = 800;
                    height = 800;
                    p.resizeOverlay(800);
                }
                else if (innerWidth > 500) {
                    p.resizeCanvas(500, 500);
                    width = 500;
                    height = 500;
                    p.resizeOverlay(500);
                }
                else if (innerWidth > 300) {
                    p.resizeCanvas(300, 300);
                    width = 300;
                    height = 300;
                    p.resizeOverlay(300);
                }
                else if (innerWidth > 200) {
                    p.resizeCanvas(200, 200);
                    width = 200;
                    height = 200;
                    p.resizeOverlay(200);
                }
            }

            p.resizeOverlay = (num: number) => {
                const overlay = document.querySelector('div.canvas-overlay') as HTMLElement;
                overlay.style.width = num.toString() + 'px';
                overlay.style.height = num.toString() + 'px';
            }

            p.deleteVisualizer = () => {
                song.pause(); 
                p.remove(); 
            }

            // on DOM unmount delete canvas
            onUnmounted(() => {
                song.pause(); 
                p.remove(); 
            });
        }
        
        return { props, showVisualizer, width, handleCustomizationChange, songString, myp5, play_pause, isHovering, isNotHovering, top_x_songs, imageurl, songTitle, singer, c1, c2, ColorLib, gradient, toggleDropdown, handleDropdown, shuffleColors, swapColors, shareColorBoard };
    },
})
</script>

<style scoped>
.synesthesia-dropdown-label {
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
}
.dropdown-wrapper {
    width: 40%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height: 220px;
    z-index: 11;
    overflow-x: hidden;
    cursor: pointer;
    position: relative;
    scroll-behavior: smooth;
}
.dropdown-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    background-color: #aaa;
    margin-right: 20px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
}
.dropdown-wrapper::-webkit-scrollbar-thumb {
    background-color: #C25900;
    border-radius: 40px;
}
.active {
    background-color: #01a2d3;
    color: white;
}
.dropdown-choice:hover {
    background-color: #0069c2;
    color: #f3f3f3;
}
span.go-back.off, span.go-forward.off, .off { 
    opacity: .5;
    cursor: not-allowed;
    transition: .1s ease-in-out;
}
.dropdown-choice.off {
    opacity: 1;
    background-color: rgba(110, 110, 110);
    text-decoration: line-through;
    color: black;
}
span.go-back:hover, span.go-forward:hover {
    transform: translateY(1px);
    box-shadow: 0 0 8px #ddd;
}
span.go-back.off:hover, span.go-forward.off:hover, .off:hover {
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
    margin: -10px auto 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-width: 40%;
    height: 10%;
}
.chalk-writing {
    transform: translateY(-48px) rotate(-2deg);
    font-size: 64px;
    font-family: 'Caveat';
}
.thumbtack {
    height: 16px;
    width: 16px;
    border-radius: 20px;
    margin: -12px auto 8px;
    box-shadow: 2px 2px rgba(0,0,0,0.5);
}
.polaroid-caption p {
    margin: 4px auto 0;
}
.polaroid-caption h3 {
    margin: 10px auto 0;
}
.polaroid-caption {
    padding: 0;
    margin: 0;
    color: rgb(60, 60, 60);
    max-width: 200px;
}
.polaroid-color {
    width: 200px;
    height: 180px;
}
.polaroid-color-wrapper {
    transition: .32s ease-in-out;
    border-radius: 1px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f3f3f3;
    padding: 20px 16px 16px;
    transform: translateY(-18%) rotate(5deg);
    box-shadow: 6px 5px 3px rgba(0,0,0,0.5);
    transform-origin: top;
    max-width: 200px;
}
.polaroid-color-wrapper:nth-child(even) {
    transform: translateY(18%) rotate(-5deg);
}
.polaroid-color-wrapper:nth-child(2n+2) {
    box-shadow: 6px 7px 3px rgba(0,0,0,0.5);
}
.polaroid-color-wrapper:nth-child(2) {
    box-shadow: 6px 6px 3px rgba(0,0,0,0.5);
}
.polaroid-color-wrapper:hover {
    transform: translateY(-18%) rotate(0deg);
    box-shadow: 5px 5px 3px rgba(0,0,0,0.5);
}
.polaroid-color-wrapper:nth-child(even):hover {
    transform: translateY(18%) rotate(0deg);
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
    top: -.7em;
    transform: rotate(-2deg) translateY(2px);
}
.polaroid-pictures {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    transform: translateY(-32px);
}
.polaroid-colors {
    width: 95%;
    height: 640px;
    margin: auto auto 40px auto;
    transition: .2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-image: linear-gradient(to bottom right, #c19a6b, #c18a6b, #ce9f6f);
    border: 16px solid #8b6944;
}
.synesthesia-gradient:hover {
    opacity: 1;
}
.synesthesia-gradient {
    opacity: 0.9;
    animation: bg-animation 30s infinite alternate;
    background-size: 400%;
    background-position: left;
    width: 1200px;
    height: 600px;
    border-radius: 20px;
    box-shadow: 0 0 8px #ddd;
    margin: auto auto 40px auto;
    transition: .2s ease-in-out;
}
.canvas-buttons {
    margin: 20px auto 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    width: 60%;
    max-height: 40px;
    position: relative;
}
.canvas-buttons a {
    position: relative;
    transition: color .1s linear;
    cursor: pointer;
}
.canvas-buttons a:before {
    padding: 5px 10px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    left: -8%;
    bottom: -40%;
    z-index: -1;
    transform: rotate(-1deg);
    content: "";
    position: absolute;
    transition: .2s ease-in-out;
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
@media(max-width: 1700px) {
    .thumbtack {
        margin: -8px auto 4px;
    }
    .polaroid-color-wrapper {
        padding: 12px;
        transform: translateY(-18%) rotate(3deg);
        max-width: 160px;
    }
    .polaroid-color-wrapper:nth-child(even) {
        transform: translateY(18%) rotate(-3deg);
    }
    .polaroid-pictures {
        justify-content: space-around;
    }
    .polaroid-color {
        width: 160px;
        height: 140px;
    }
    .polaroid-caption {
        max-width: 160px;
    }
}
@media(max-width: 1200px) {
    .thumbtack {
        height: 14px;
        width: 14px;
    }
    .polaroid-colors {
        border: 12px solid #8b6944;
        height: 400px;
    }
    .chalk-writing {
        transform: translateY(-32px) rotate(-2deg);
        font-size: 48px;
    }
    .polaroid-color {
        width: 120px;
        height: 100px;
    }
    .polaroid-color-wrapper {
        padding: 8px;
        transform: translateY(-18%) rotate(2deg);
        max-width: 120px;
    }
    .polaroid-color-wrapper:nth-child(even) {
        transform: translateY(18%) rotate(-2deg);
    }
    .polaroid-caption p {
        margin: 4px auto 0;
        font-size: 12px;
    }
    .polaroid-caption h3 {
        margin: 10px auto 0;
        font-size: 16px;
    }
    .polaroid-caption {
        max-width: 120px;
    }
    .dropdown-wrapper {
        width: 60%;
    }
    .canvas-buttons {
        width: 60%;
    }
}
@media(max-width: 900px) {
    .polaroid-color {
        width: 100px;
        height: 80px;
    }
    .polaroid-color-wrapper {
        padding: 4px 6px 6px;
        max-width: 100px;
    }
    .thumbtack {
        height: 10px;
        width: 10px;
        margin: -3px auto 3px;
    }
    .polaroid-caption {
        max-width: 100px;
    }
    .canvas-buttons {
        width: 80%;
    }
}
@media(max-width: 700px) {
    .polaroid-colors {
        border: 12px solid #8b6944;
        height: 800px;
    }
    .thumbtack {
        height: 14px;
        width: 14px;
        margin: -5px auto 3px;
    }
    .polaroid-color {
        width: 150px;
        height: 125px;
    }
    .polaroid-color-wrapper {
        padding: 8px;
        transform: translateY(-18%) rotate(3deg);
        max-width: 150px;
    }
    .polaroid-color-wrapper:nth-child(even) {
        transform: translateY(18%) rotate(-3deg);
    }
    .polaroid-caption p {
        margin: 4px auto 0;
        font-size: 12px;
    }
    .polaroid-caption h3 {
        margin: 10px auto 0;
        font-size: 16px;
    }
    .polaroid-caption {
        max-width: 150px;
    }
    .dropdown-wrapper {
        width: 75%;
    }
    .canvas-buttons {
        width: 100%;
    }
}
@media(max-width: 550px) {
    .polaroid-color {
        width: 126px;
        height: 100px;
    }
    .polaroid-colors {
        border: 8px solid #8b6944;
        height: 650px;
    }
    .polaroid-color-wrapper {
        transform: translateY(-18%) rotate(2deg);
        max-width: 126px;
    }
    .polaroid-color-wrapper:nth-child(even) {
        transform: translateY(18%) rotate(-2deg);
    }
    .polaroid-caption {
        max-width: 126px;
    }
}
@media(max-width: 475px) {
    .polaroid-color-wrapper {
        padding: 6px 8px;
        transform: translateY(-5%) rotate(3deg);
    }
    .polaroid-color-wrapper:nth-child(even) {
        transform: translateY(5%) rotate(-3deg);
    }
    .polaroid-color-wrapper:hover {
        transform: translateY(-5%) rotate(0deg);
    }
    .polaroid-color-wrapper:nth-child(even):hover {
        transform: translateY(5%) rotate(0deg);
    }
    .polaroid-colors {
        border: 8px solid #8b6944;
        height: 800px;
    }
    .chalk-writing {
        transform: translateY(-16px) rotate(-2deg);
        font-size: 10vw;
    }
    .thumbtack {
        height: 10px;
        width: 10px;
        margin: -2px auto 4px;
    }
    .dropdown-p {
        font-size: 12px;
    }
}
@media(max-width: 425px) {
    .polaroid-color {
        width: 100px;
        height: 84px;
    }
    .polaroid-color-wrapper {
        padding: 4px 6px;
        transform: translateY(-5%) rotate(3deg);
        max-width: 100px;
    }
    .polaroid-caption p {
        margin: 4px auto 0;
        font-size: 12px;
    }
    .polaroid-caption h3 {
        margin: 8px auto 0;
        font-size: 14px;
    }
    .polaroid-caption {
        max-width: 100px;
    }
    .polaroid-colors {
        border: 6px solid #8b6944;
        height: 700px;
    }
}
@media(max-width: 300px) {
    .polaroid-color {
        width: 90px;
        height: 80px;
    }
    .polaroid-color-wrapper {
        max-width: 90px;
        padding: 2px 4px;
        transform: translateY(-5%) rotate(3deg);
    }
    .polaroid-caption p {
        margin: 2px auto 0;
        font-size: 10px;
    }
    .polaroid-caption h3 {
        margin: 6px auto 0;
        font-size: 12px;
    }
    .polaroid-caption {
        max-width: 90px;
    }
}
@media(max-width: 250px) {
    .polaroid-color {
        width: 80px;
        height: 70px;
    }
    .polaroid-color-wrapper {
        max-width: 80px;
        justify-content: center;
    }
    .polaroid-caption {
        max-width: 80px;
    }
}
</style>