<template>
    <div id="canvas-wrapper" class="canvas-wrapper">
        
        <div class="canvas-overlay" v-if="songString !== ''">
            <span class="material-symbols-outlined overlay-symbols" v-if="!play_pause">pause</span>
            <div class="canvas-bottom-text">
                <div class="pfp-image-of-demo" :style="{ 'background-image': 'url(' + imageurl + ')' }"></div>
                <div class="canvas-song-desc-text">
                    <p id="song-title">{{ songTitle }}</p>
                    <p>{{ singer }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { recursiveDFSofHTMLElemChildren } from '../functions/recursiveDFSofHTMLElemChildren';
import p5library from 'p5';
declare var p5: any;

export default defineComponent({
    setup() {
        // properties
        const c1 = ref([]) as Ref<number[]>;
        const c2 = ref([]) as Ref<number[]>;
        const play_pause = ref(false);
        const songString = ref('');
        const url = ref('https://p.scdn.co/mp3-preview/17db57aa271a379b59c6dea23a4946db314afd5f?cid=774b29d4f13844c495f206cafdad9c86');
        const imageurl = ref('https://i.scdn.co/image/ab67616d0000b273c086023113fc322ffd962978');
        const songTitle = ref('スカー');
        const singer = ref('キタニタツヤ');
        let myp5: unknown = null;
        let player;

        // gets audio from url asyncronously w/ mpeg blob -> x-wav blob
        fetch(url.value)
            .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = () => {
                        songString.value = (reader.result as string).replace('mpeg','x-wav');
                        c1.value = [171,149,127];
                        c2.value = [84,106,128];
                        if (myp5 === null) myp5 = new p5(sketch, document.getElementById('canvas-wrapper') as HTMLElement);
                    }
                })
            .catch(err => console.log(err))
        .catch(err => console.log(err));

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
                if (!song.isPlaying() && play_pause.value) {
                    song.play();
                }
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
                        // p.saveGif('mySketch', 5);
                    }
                }
            }

            p.mousePressed = (e: Event) => {
                if (e.target instanceof Element) { 
                    if (recursiveDFSofHTMLElemChildren(document.getElementById("navbar")!.children, e.target) && e.target.className !== "material-symbols-outlined") {
                        song.pause(); 
                        p.remove(); 
                    }
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
        }

        return { songString, myp5, play_pause, imageurl, songTitle, singer };
    },
})
</script>

<style>
.canvas-song-desc-text p#song-title {
    font-size: 1.5rem;
}
.canvas-song-desc-text {
    flex-direction: column;
}
.pfp-image-of-demo {
    width: 120px;
    height: 120px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; 
    overflow: auto;
}
.canvas-bottom-text {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    padding: 30px 0 40px;
    margin: auto auto 0%;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 0 -1px 1px rgba(255,255,255,0.4);
    
}
.overlay-symbols {
    z-index: 10;
    color: #bbb;
    font-size: 64px;
}
.canvas-overlay {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(0,0,0,0.2);
    z-index: 10;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: .2s ease-in-out;
}
canvas.p5Canvas {
    box-shadow: 0 0 8px #ddd;
    border-radius: 10px;
}
.canvas-wrapper {
    margin: auto;
}
span.material-symbols-outlined.overlay-symbols {
    margin-top: 45%;
}
@media (max-width: 900px) {
    .pfp-image-of-demo {
        width: 100px;
        height: 100px;
    }
    .canvas-bottom-text {
        padding: 10px 0 20px;
    }
    .canvas-song-desc-text p {
        font-size: 1rem;
    }
    .canvas-song-desc-text p#song-title {
        font-size: 1.25rem;
    }
}
@media (max-width: 500px) {
    .pfp-image-of-demo {
        width: 660px;
        height: 660px;
    }
    .canvas-bottom-text {
        padding: 5px 0 10px;
    }
    .canvas-song-desc-text p {
        font-size: .8rem;
    }
    .canvas-song-desc-text p#song-title {
        font-size: 1rem;
    }
}
@media (max-width: 500px) {
    .pfp-image-of-demo {
        width: 50px;
        height: 50px;
    }
    .canvas-bottom-text {
        padding: 2px 0 5px;
    }
    .canvas-song-desc-text p {
        font-size: .6rem;
    }
    .canvas-song-desc-text p#song-title {
        font-size: .8rem;
    }
}
@media (max-width: 300px) {
    .pfp-image-of-demo {
        width: 40px;
        height: 40px;
    }
}
</style>