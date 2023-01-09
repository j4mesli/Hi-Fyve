<template>
    <div class="about-wrapper">
        <div class="about-heading">
            <img src="../../public/logo.png">
            <h1>About</h1>
            <div class="about-content">
                <p class="text">
                    SpotiFyve was developed by <a class="my-link" title="My LinkedIn!" href="https://www.linkedin.com/in/j4meslii/" target="_blank">James Li</a> 
                    as a personal project for the express purpose of viewing one's Spotify stats at a greater depth. Utilizing the Spotify API,
                    SpotiFyve allows for a user to connect their Spotify accounts to the service and view detailed analytics about their listening habits.
                </p>
                <p class="text">
                    Upon parsing, the information is sent to the frontend for unique characteristics to be generated based off of various factors, including
                    but not limited to: <a href="/MyHiFyve" class="my-link" title="Hi-Fyve!" target="_blank"><span style="color: #e25822;">song</span> / <span style="color: rgba(255, 0, 255)">artist</span></a> characteristics, standard distribution of each individual song's statistics, and more!
                </p>
                <p class="text">
                    Additionally, SpotiFyve's <a href="/Synesthesia" class="my-link" title="Synesthesia!" target="_blank"><span style="color: rgb(231, 187, 43);">Synesthesia</span></a> service allows for users to
                    generate colors from their music taste utilizing statistics from their favorite songs and artists, and displays these colors as a downloadable image board and an animated
                    media visualizer which plays a user's top songs!
                </p>
                <p class="text">
                    Beyond beautification and visualization, SpotiFyve also provides detailed analytics regarding all aspects of music! Whether it be statistical analysis of a 
                    <a href="/Analytics" title="User Analytics!" target="_blank"><span style="color: rgb(250, 100, 100)">user's listening habits and trends</span></a>
                    or an analysis of <a href="/Worldwyde" title="Worldwyde Analytics!" target="_blank"><span style="color: rgb(29,200,120);">Worldwyde</span></a> listening habits, SpotiFyve analyzes it all!
                </p>
                <p class="text">
                    Still curious? Check out 
                    <a class="my-link" title="SpotiFyve's Repository!" href="https://github.com/j4mesli/Spotifyve" target="_blank">SpotiFyve's repo</a>
                    for more information about how the site works!
                </p>
            </div>
        </div>
        <div class="about-heading">
            <h1>Contact</h1>
            <div class="contact">
                <p class="text">
                    Have any questions, concerns, or simply want to contribute? You can reach out to me from these links below!
                </p>
                <a class="my-link" title="Email: jl11701@nyu.edu" href="mailto:jl11701@nyu.edu" target="_blank"><h3><i class="fa fa-envelope"></i> &nbsp;&nbsp;Send me an Email!</h3></a>
                <a class="my-link" title="My LinkedIn!" href="https://www.linkedin.com/in/j4meslii/" target="_blank"><h3><i class="fa fa-linkedin-square"></i> &nbsp;&nbsp;Connect with Me!</h3></a>
                <a class="my-link" title="My GitHub!" href="https://github.com/j4mesli/" target="_blank"><h3><i class="fa fa-github"></i> &nbsp;&nbsp;View My Portfolio!</h3></a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        
        return {  };
    },
})
</script>

<style scoped>
img {
    margin: auto auto 20px;
    transform: scale(0.75);
}
a {
    text-decoration: none;
    color: #f3f3f3;
}
.my-link {
    text-decoration: none;
    color: #00d9ff;
    transition: .2s ease-in-out;
}
.my-link:hover {
    color: #00b2e9;
}
.about-wrapper {
    width: 90%;
    padding: 20px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.about-content, .contact {
    width: 40%;
    padding: 20px;
    margin: auto;
    border-top: 1px solid white;
}
.about-heading {
    width: 100%;
    margin: auto;
}
@media (max-width: 1250px) {
    .about-content, .contact {
        width: 60%;
    }
}
@media (max-width: 750px) {
    .about-content, .contact {
        width: 80%;
    }
}
</style>