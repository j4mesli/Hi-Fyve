<template>
    <div ref="container" class="visualization-wrapper">
        <canvas ref="canvas" id="canvas1">

        </canvas>
        <audio id="audio1" ref="audio1" controls @play.prevent="handleAudio" @pause.prevent="handleAudio" loop></audio>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    // https://www.youtube.com/watch?v=VXWvfrmpapI
    setup() {
        const url = 'https://p.scdn.co/mp3-preview/17db57aa271a379b59c6dea23a4946db314afd5f?cid=774b29d4f13844c495f206cafdad9c86';
        const audio1 = ref(null);
        const audioString = ref(null);
        const canvas = ref(null);
        const container = ref(null);
        const ctx = ref(null);
        const playing = ref(false);
        onMounted(async () => {
            canvas.value.width = window.innerWidth;
            canvas.value.height = window.innerHeight;
            ctx.value = canvas.value.getContext('2d');
        });

        // gets audio from url asyncronously w/ mpeg blob -> x-wav blob
        fetch(url)
            .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = () => {
                        audioString.value = reader.result.replace('mpeg','x-wav');
                        audio1.value.src = audioString.value;
                        audio1.value.volume = 0.2;
                    }
                })
            .catch(err => console.log(err))
        .catch(err => console.log(err));

        const audioCtx = new AudioContext();
        const audioSource = ref(null);
        const analyser = ref(null);

        // play and animate bars
        const handleAudio = () => {
            playing.value = !playing.value;
            switch (playing.value) {
                case false:
                    audio1.value.pause();
                    audio1.src = audioString.value;
                    audioSource.value = null;
                    analyser.value = null;
                    audioCtx.close();
                    break;
                case true:
                    audio1.value.play();
                    audioSource.value = audioCtx.createMediaElementSource(audio1.value);
                    analyser.value = audioCtx.createAnalyser();
                    audioSource.value.connect(analyser.value);
                    analyser.value.connect(audioCtx.destination);
                    analyser.value.fftSize = 2048;
                    const bufferLength = ref(analyser.value.frequencyBinCount);
                    const dataArray = ref(new Uint8Array(bufferLength.value));
                    // const barWidth = ref(canvas.value.width / 2 / bufferLength.value); FOR BAR GRAPH
                    const barWidth = ref(5);
                    const barHeight = ref(null);
                    const x = ref(0);
                    const animate = () => {
                        x.value = 0;
                        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
                        analyser.value.getByteFrequencyData(dataArray.value);

                        // two for loops lets us create two sets of bars
                        // for (let i = 0; i < bufferLength.value; i++) {
                        //     barHeight.value = dataArray.value[i]*2;
                        //     const red = barHeight.value;
                        //     const green = barHeight.value / 2;
                        //     const blue = i * barHeight.value / 20;
                        //     ctx.value.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
                        //     ctx.value.fillRect(canvas.value.width / 2 - x.value, canvas.value.height - barHeight.value, barWidth.value, barHeight.value);
                        //     x.value += barWidth.value;
                        // }
                        // for (let i = 0; i < bufferLength.value; i++) {
                        //     barHeight.value = dataArray.value[i]*2;
                        //     const red = barHeight.value;
                        //     const green = barHeight.value / 2;
                        //     const blue = i * barHeight.value / 20;
                        //     ctx.value.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
                        //     ctx.value.fillRect(x.value, canvas.value.height - barHeight.value, barWidth.value, barHeight.value);
                        //     x.value += barWidth.value;
                        // }

                        // one for loop for circle visualizer
                        for (let i = 0; i < bufferLength.value; i++) {
                            barHeight.value = dataArray.value[i]*1.5 + 10;
                            ctx.value.save();
                            ctx.value.translate(canvas.value.width/2, canvas.value.height/2);
                            // ROTATION ONLY WORKS IN RADIANS
                            ctx.value.rotate(i * Math.PI * 8 / bufferLength.value);
                            const hue = i * .5;
                            ctx.value.fillStyle = 'hsl(' + hue + ', 100%, ' + barHeight.value / 4.5 + '%)';
                            ctx.value.fillRect(0, 0, barWidth.value*2, barHeight.value);
                            x.value += barWidth.value;
                            ctx.value.restore();
                        }

                        requestAnimationFrame(animate);
                    }
                    animate();
                    break;
            }
        }
        return { canvas, container, handleAudio, audioString, audio1, playing };
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.visualization-wrapper {
    margin: auto;
    width: 700px;
    height: 700px;
}
#canvas1 {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://i.scdn.co/image/ab67616d0000b273c086023113fc322ffd962978');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; 
    overflow: auto;
    position: relative;
    /* filter: blur(1px) contrast(1); */
}
#audio1 {
    width: 50%;
    margin: auto auto 50px;
    display: block;
}
</style>