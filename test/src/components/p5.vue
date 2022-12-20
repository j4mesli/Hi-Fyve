<template>
    <div>
        <div id="p5-container" class="p5-container"></div>
    </div>
</template>

<script>
// https://www.youtube.com/watch?v=uk96O7N1Yo0&list=PLwUlLzAS3RYow0T9ZXB0IomwB-DyBRTfm&index=17
import { ref } from 'vue';

export default {
    setup() {
        // properties
        const c1 = ref(null);
        const c2 = ref(null);
        const play_pause = ref(true);
        const songString = ref('');
        const url = ref('https://p.scdn.co/mp3-preview/17db57aa271a379b59c6dea23a4946db314afd5f?cid=774b29d4f13844c495f206cafdad9c86');
        let myp5 = null;

        // gets audio from url asyncronously w/ mpeg blob -> x-wav blob
        fetch(url.value)
            .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = () => {
                        songString.value = reader.result.replace('mpeg','x-wav');
                        c1.value = ([192, 131, 33]);
                        c2.value = ([141, 44, 21]);
                        if (myp5 === null) myp5 = new p5(sketch, 'p5-container');
                    }
                })
            .catch(err => console.log(err))
        .catch(err => console.log(err));

        // instantiate new p5 with function
        let sketch = (p) => {
            class Particle {
                constructor() {
                    // 250 is max-radius - min-radius, or 350-150
                    this.pos = p5.Vector.random2D().mult(250);
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
                update(cond) {
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
            const width = 750;
            const height = 750;
            let song;
            let fft;
            let amp;
            let particles = [];

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
                p.background([c2.value[0], c2.value[1], c2.value[2]]);
                p.stroke([
                    p.random((c1.value[0]-30 >= 0 ? c1.value[0]-30 : 0), (c1.value[0]+30 <= 255 ? c1.value[0]+30 : 255)), 
                    p.random((c1.value[1]-30 >= 0 ? c1.value[1]-30 : 0), (c1.value[1]+30 <= 255 ? c1.value[1]+30 : 255)), 
                    p.random((c1.value[2]-30 >= 0 ? c1.value[2]-30 : 0), (c1.value[2]+30 <= 255 ? c1.value[2]+30 : 255))
                ]);
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

                // circular format O(n^2)
                for (let t = -1; t <= 1; t += 2) {
                    p.beginShape();
                    for (let i = 0; i <= 180; i += 0.5) {
                        const index = p.floor(p.map(i, 0, 180, 0, wave.length - 1));
                        // syntax: p.map(wave instance, min-distance, max-distance, min-radius, max-radius)
                        const r = p.map(wave[index], -1, 1, 150, 350);
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
                        particles[i].update(amp >= 225);
                        particles[i].show();
                    }
                    else {
                        particles.splice(i, 1);
                    }
                }
                if (!song.isPlaying() && play_pause.value) song.play();
            }

            p.mouseClicked = () => {
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

            p.mousePressed = (e) => {
                if (e.target.id === 'change-to-Canvas') { song.pause(); p.remove(); };
            }
        }

        return { songString };
    }
}
</script>

<style>
.p5-container {
    width: 750px;
    height: 750px;
    background-color: rgba(0,0,0,0.5);
    margin: auto;
}
</style>