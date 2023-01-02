<template>
    <LoadingSpinnerVue v-if="songString === ''" />
    <div class="canvas-buttons" v-if="songString !== ''">
        
    </div>
    <div class="synesthesia-gradient" :style="{ 'background-image': `linear-gradient(to top right, ${gradient[0].hex}, ${gradient[1].hex}, ${gradient[2].hex}, ${gradient[3].hex}, ${gradient[4].hex}, ${gradient[5].hex})` }" v-if="c1.length > 0 && c2.length > 0"></div>
    <div id="canvas-wrapper" class="canvas-wrapper">
        
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
import { defineComponent, ref, Ref, onMounted, onUnmounted } from 'vue';
import { synesthesiaOutput } from '../interfaces/synesthesiaOutput';
import { refreshAccessToken } from '../functions/refreshAccessToken';
import { recursiveDFSofHTMLElemChildren } from '../functions/recursiveDFSofHTMLElemChildren';
import * as ntcts from '../functions/ntc-ts/index';
import p5library from 'p5';
import * as Color from 'color';
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
        const obj = ref({}) as Ref<synesthesiaOutput>;
        const c1 = ref([]) as Ref<number[]>;
        const c2 = ref([]) as Ref<number[]>;
        const gradient = ref([]) as Ref<Array<{ name: string, hex: string, }>>;
        const play_pause = ref(false);
        const songString = ref('');
        const url = ref('');
        const imageurl = ref('');
        const songTitle = ref('');
        const singer = ref([]) as Ref<string[]>;
        let myp5: unknown = null;
        ntcts.initColors(ntcts.ORIGINAL_COLORS);

        // get the synesthesia construction object from backend
        refreshAccessToken((sessionStorage.refresh_token as string))
        .then(async () => {
            console.log('refreshed')
            const synesthesia_url = 'http://localhost:3000/synesthesia?access_token='
            + sessionStorage.access_token
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
                        url.value = data.top_mp3;
                        imageurl.value = data.top_image;
                        singer.value = data.top_artists;
                        songTitle.value = data.top_name;
                        c1.value = data.color1;
                        c2.value = data.color2;
                        gradient.value.push({ name: ntcts.getColorName(Color.rgb(c1.value).hsl().saturate(2).hex()).name, hex: Color.rgb(c1.value).hsl().saturate(2).hex() });
                        gradient.value.push({ name: ntcts.getColorName(Color.rgb(c1.value).hsl().saturate(1).hex()).name, hex: Color.rgb(c1.value).hsl().saturate(1).hex() });
                        gradient.value.push({ name: data.color1_name, hex: data.color1_hex });
                        gradient.value.push({ name: data.color2_name, hex: data.color2_hex });
                        gradient.value.push({ name: ntcts.getColorName(Color.rgb(c2.value).hsl().saturate(1).hex()).name, hex: Color.rgb(c2.value).hsl().saturate(1).hex() });
                        gradient.value.push({ name: ntcts.getColorName(Color.rgb(c2.value).hsl().saturate(2).hex()).name, hex: Color.rgb(c2.value).hsl().saturate(2).hex() });
                        console.table(gradient.value);
                        console.table(obj.value);
                        fetch(url.value)
                            .then(res => res.blob())
                                .then(blob => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(blob); 
                                    reader.onloadend = () => {
                                        songString.value = (reader.result as string).replace('mpeg','x-wav');
                                        console.log(document.getElementById('canvas-wrapper') as HTMLElement);
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
                let parent: HTMLElement = document.querySelector('div.canvas-wrapper') as HTMLElement;
                if (elem && parent) {
                    if (parent.children.length > 0) {
                        if (
                            // if user hovers the canvas itself
                            (elem as HTMLElement).nodeName.toLowerCase() === 'canvas' 
                            // if user hovers the canvas-overlay parent elem
                            || (elem.classList.length >= 1 && (elem as HTMLElement).classList[0].toLowerCase() === 'canvas-overlay')
                            // if user hovers an element of the overlay (recursive DFS to see if elem is part of canvas-overlay children)
                            || recursiveDFSofHTMLElemChildren((document.querySelector('div.canvas-overlay') as HTMLElement).children, e.target as HTMLElement)) {
                            const overlay = parent.children[0] as HTMLElement;
                            overlay.style.opacity = '1';
                        }
                        else {
                            if (play_pause.value) ((parent as HTMLElement).children[0] as HTMLElement).style.opacity = '0';
                        }
                    }
                }
            });
        });

        // instantiate new p5 with function
        let sketch = (p: any) => {
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
                if (inBigNav || inLittleNav) { 
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

            // on DOM unmount delete canvas
            onUnmounted(() => {
                song.pause(); 
                p.remove(); 
            });
        }
        
        return { props, songString, myp5, play_pause, imageurl, songTitle, singer, c1, c2, Color, gradient };
    },
})
</script>

<style>
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
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    width: 60%;
}
</style>