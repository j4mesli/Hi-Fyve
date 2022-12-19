<template>
  <h1>Touchdown!</h1>
  <button @click="data">Get Tokens</button>
  <button v-if="vanilla" @click="vanilla = !vanilla">Vanilla</button>
  <button v-if="!vanilla" @click="vanilla = !vanilla">P5.js</button>
  <form @submit.prevent="getTop10">
    <label for="Request Type">Request Type:</label>
    <select id="Request Type" v-model="request_type" required>
      <option value="artists" name="artists" id="artists">Artists</option>
      <option value="tracks" name="tracks" id="tracks">Tracks</option>
    </select>
    <label for="Time Range">Time Range:</label>
    <select id="Time Range" v-model="time_range" required>
      <option value="short_term" name="short_term" id="short_term">Last Month</option>
      <option value="medium_term" name="medium_term" id="medium_term">Last 6 Months</option>
      <option value="long_term" name="long_term" id="long_term">All Time</option>
    </select>
    <label for="song_number">Number of songs to get(1-50):</label>
    <input v-model="song_number" type="number" id="song_number" name="song_number" min="1" max="50" required>
    <button v-if="(song_number >= 1 && song_number <= 50)">Submit</button>
  </form>
  <div id="data" v-if="hasData">
    {{obj}}
  </div>
  <div id="error" v-if="error">
    {{error}}
  </div>
  <div id="token" v-if="(refresh_token && access_token)">
    <h1>Access Token: </h1> <p>{{access_token}}</p>
    <br>
    <br>
    <h1>Refresh Token: </h1> <p>{{refresh_token}}</p>
  </div>
  <div v-if="top10">
    <ul v-for="(i, index) in top10" :key="i">
      <li>
        {{( index+1 )}}: {{ i.name }}
        <div>
          <p v-for="artist in i.artists" :key="artist">- {{ artist.name }} -</p>
        </div>
      </li>
    </ul>
  </div>
  <visualizer v-if="vanilla"/>
  <p5 v-else />
</template>

<script>
import { ref } from '@vue/reactivity';
import visualizer from './components/visualizer.vue';
import p5 from './components/p5.vue';

export default {
  name: 'App',
  components: {
    visualizer, 
    p5,
  },
  setup() {
    const hasData = ref(false);
    const error = ref(null);
    const obj = ref(null);
    const access_token = ref(null);
    const refresh_token = ref(null);
    const request_type = ref(null);
    const time_range = ref(null);
    const song_number = ref(null);
    const offset = ref(0);
    const top10 = ref(null);
    const vanilla = ref(true);
    const data = async () => {
      await fetch('http://localhost:3000/getURL')
        .then(res => {
          console.log(res);
          hasData.value = true;
          return res.json();
        })
          .then(data => {
            obj.value = data.url;
            window.open(data.url, '_self');
          })
          .catch(err => error.value = err)
        .catch(err => error.value = err); 
    };
    const getTop10 = async () => {
      console.log(access_token.value);
      if (access_token.value && refresh_token.value) {
        const url = 
          'http://localhost:3000/gettopx/?access_token=' 
            + access_token.value 
            + '&request_type=' + request_type.value
            + '&time_range=' + time_range.value 
            + '&limit=' + song_number.value
            + '&offset=' + offset.value;
        await fetch(url)
          .then(res => {return res.json()})
            .then(data => {
              top10.value = data.items;
              offset.value += 5;
            })
            .catch(err => console.log(JSON.parse(JSON.stringify(err))))
          .catch(err => console.log(JSON.parse(JSON.stringify(err))));
      }
    };

    // sets code and state refs from url query and clears url query
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    access_token.value = JSON.parse(JSON.stringify(params)).access_token;
    refresh_token.value = JSON.parse(JSON.stringify(params)).refresh_token;
    window.history.replaceState(null, null, window.location.pathname);

    return { hasData, data, obj, error, access_token, refresh_token, getTop10, request_type, time_range, song_number, offset, top10, vanilla };
  }, 
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
