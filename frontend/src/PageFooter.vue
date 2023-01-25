<template>
    <div class="footer">
        <label for="big-logo-visualizer"><p>All songs, artists, user data, and metadata is provided by</p></label>
        <img id="big-logo-visualizer" class="big-logo-visualizer" src="../public/big_spotify_logo.png"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {  };
    },
})
</script>

<style scoped>
.big-logo-visualizer {
    margin: 0 auto 20px;
    width: 175px;
    height: 60px;
}
.footer {
    margin: 20px auto;
    width: 100%;
}
</style>