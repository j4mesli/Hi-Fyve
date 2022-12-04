<template>
  <h1>Touchdown!</h1>
  <button @click="data">Get Tokens</button>
  <button @click="getTop10Artists">Get Top 10 Artists</button>
  <button @click="getTop10Tracks">Get Top 10 Tracks</button>
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
  <div id="top10artists" v-if="top10artists">
    <h3>Top 10 artists</h3>
    <ul v-for="(artist, index) in top10artists" :key="artist">
      <li>{{(index+1)}}: {{artist.name}}</li>
    </ul>
  </div>
  <div id="top10tracks" v-if="top10tracks">
    <h3>Top 10 tracks</h3>
    <ul v-for="(track, index) in top10tracks" :key="track">
      <li>{{(index+1)}}: {{track.name}}<div v-for="artist in track.artists" :key="artist">- {{artist.name}} -</div></li>
    </ul>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
  name: 'App',
  components: {
    
  },
  setup() {
    const hasData = ref(false);
    const error = ref(null);
    const obj = ref(null);
    const access_token = ref(null);
    const refresh_token = ref(null);
    const top10artists = ref(null);
    const top10tracks = ref(null);
    const data = async () => {
      await fetch('http://localhost:3000/getKey')
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
    const getTop10Artists = async () => {
      count.value = 0;
      console.log(access_token.value);
      if (access_token.value && refresh_token.value) {
        await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=0', {
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token.value, 'Accept': 'application/json' },
          json: true,
        })
          .then(res => {
            console.log(res);
            return res.json();
          })
            .then(res => {
              console.log(res.items);
              top10artists.value = res.items;
            })
            .catch(err => console.log(JSON.parse(JSON.stringify(err))))
          .catch(err => console.log(JSON.parse(JSON.stringify(err))))
      }
    };
    const getTop10Tracks = async () => {
      count.value = 0;
      console.log(access_token.value);
      if (access_token.value && refresh_token.value) {
        await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=0', {
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token.value, 'Accept': 'application/json' },
          json: true,
        })
        .then(res => {
            console.log(res);
            return res.json();
          })
            .then(res => {
              console.log(res.items);
              top10tracks.value = res.items;
            })
            .catch(err => console.log(JSON.parse(JSON.stringify(err))))
          .catch(err => console.log(JSON.parse(JSON.stringify(err))))
      }
    }

    // sets code and state refs from url query and clears url query
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    access_token.value = JSON.parse(JSON.stringify(params)).access_token;
    refresh_token.value = JSON.parse(JSON.stringify(params)).refresh_token;
    window.history.replaceState(null, null, window.location.pathname);

    return { hasData, data, obj, error, access_token, refresh_token, getTop10Artists, getTop10Tracks, top10artists: Object, top10tracks: Object, };
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
