<template>
    <header>
        <div class="logo">
            <router-link to="/"><img src="../../public/powered_by_spotify.png"></router-link>
        </div>
        <nav v-if="(width > 1250)">
            <router-link to="/">Home</router-link>
            <router-link to="/About">About</router-link>
            <router-link to="/MyHiFyve">Hi-Fyve!</router-link>
            <router-link to="/Recommendations">Recommendations</router-link>
            <router-link to="/Synesthesia">Synesthesia</router-link>
            <router-link to="/Worldwyde">Worldwyde</router-link>
        </nav>
        <span v-else class="material-symbols-outlined" @click="updateMenu" :class="{ active: hideShowMenu }">{{menuOpenClose}}</span>
    </header>
    <div class="slideInMenu" v-if="(hideShowMenu && width < 1250)" @click="(hideShowMenu = !hideShowMenu)">
        <ul>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/"><li>Home</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/About"><li>About</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/MyHiFyve"><li>Hi-Fyve!</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/Recommendations"><li>Recommendations</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/Synesthesia"><li>Synesthesia</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/Worldwyde"><li>Worldwyde</li></router-link></div>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        // resize window
        const width = ref(window.innerWidth);
        window.addEventListener('resize', () => {
            width.value = window.innerWidth
        })
        
        // hide or show side menu
        const hideShowMenu = ref(false);
        const menuOpenClose = ref('menu');
        const updateMenu = () => {
            hideShowMenu.value = !hideShowMenu.value;
            menuOpenClose.value = hideShowMenu.value ? 'close' : 'menu';
        }

        return { width, hideShowMenu, menuOpenClose, updateMenu };
    },
})
</script>

<style scoped>
.slideInMenu{
    width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    margin-top: -16px;
}
header {
    opacity: 80%;
    background-color: #313131;
    color: white;
    font-size: 15px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-around;
    border-radius: 20px;
}
.logo {
    max-width: 166px;
    max-height: 50px;
}
img {
    width: 100%;
    height: 100%;
}
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40%;
}
nav a, li, span {
    text-decoration: none;
    color: #acacac;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 20px;
    transition: .15s ease-in-out;
    background-color: rgba(89,89,89,0);
}
li {
    min-width: 20%;
    max-width: 40%;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 40px;
}
span{
    font-weight: normal;
    transition: 1s ease-in-out;
}
nav a:hover, nav a.router-link-active, .active, span:hover, li:hover, div.menuEntry a.router-link-active {
    color: white;
    background-color: rgba(89,89,89,0.7);
}
ul {
    padding: 0;
    list-style: none;
}
.menuEntry {
    background-color: #212121;
    text-align: center;
}
</style>