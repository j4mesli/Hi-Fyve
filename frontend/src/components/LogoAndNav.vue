<template>
    <header id="navbar">
        <div class="logo">
            <router-link to="/"><img src="../../public/logo.png"></router-link>
        </div>
        <nav v-if="(width > 1250)" id="big-router">
            <router-link to="/">Home</router-link>
            <router-link to="/About">About</router-link>
            <router-link to="/MyHiFyve">Hi-Fyve!</router-link>
            <router-link to="/Analytics">Analytics</router-link>
            <router-link to="/Synesthesia">Synesthesia</router-link>
            <!-- <router-link to="/Worldwyde">Worldwyde</router-link> -->
        </nav>
        <span v-else class="material-symbols-outlined" @click="updateMenu" :class="{ active: hideShowMenu }">{{menuOpenClose}}</span>
        <span v-if="(width > 1250)" class="material-symbols-outlined" @click="updateMenu" :class="{ active: hideShowMenu }">{{navOpenClose}}</span>
    </header>
    <div class="slideInMenu" v-if="(hideShowMenu && width < 1250)" @click="updateMenu">
        <ul id="little-router">
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/"><li>Home</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/About"><li>About</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/MyHiFyve"><li>Hi-Fyve!</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/Analytics"><li>Analytics</li></router-link></div>
            <div class="menuEntry"><router-link style="text-decoration: none;" to="/Synesthesia"><li>Synesthesia</li></router-link></div>
            <!-- <div class="menuEntry"><router-link style="text-decoration: none;" to="/Worldwyde"><li>Worldwyde</li></router-link></div> -->
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
            width.value = window.innerWidth;
        })
        
        // hide or show nav
        const showNav = ref(true);

        // hide or show side menu
        const hideShowMenu = ref(false);
        const menuOpenClose = ref('menu');
        const navOpenClose = ref('close');
        const updateMenu = () => {
            if (window.innerWidth > 1250) {
                showNav.value = !showNav.value; 
                navOpenClose.value = showNav.value ? 'close' : 'menu';
                document.querySelector('nav')?.classList.toggle('fade');
            }
            else {
                hideShowMenu.value = !hideShowMenu.value;
                menuOpenClose.value = hideShowMenu.value ? 'close' : 'menu';
            }
        }

        return { width, hideShowMenu, menuOpenClose, navOpenClose, updateMenu, showNav };
    },
})
</script>

<style scoped>
.slideInMenu{
    width: 100%;
    position: absolute;
    height: 110%;
    left: 50%;
    transform: translate(-50%);
    margin-top: 8px;
    background: #212121;
    z-index: 999;
}
.fade {
    opacity: 0%;
}
header {
    opacity: 80%;
    background-color: #313131;
    color: white;
    font-size: 15px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
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
    transition: .25s ease-in-out;
    opacity: 80%;
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
    transition: .05s ease-in-out;
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