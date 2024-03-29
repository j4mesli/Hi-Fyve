<template>
    <h2 class="title">Let's take Fyve. 🔥</h2>
    <div class="panel">
        <LoadingSpinnerVue v-if="!loaded" />
        <h5 class="error" v-if="error">{{ error }}</h5>
        <h1 class="hello" v-if="hasTokens">Hello, {{ user.display_name }}!</h1>
        <h1 v-else>Let's Get Started<br><span>Log in with Spotify to continue!</span></h1>
        <button v-if="(!hasTokens && !spinner)" @click="login">
            <div class="logo">
                <img src="../../../public/spotify_logo.png">
            </div>
            <p class="button">Connect With Spotify</p>
        </button>
        <div class="profile" v-else-if="(hasTokens && !spinner)">
            <p>Image: </p>
            <p>{{ image !== '' ? image : '../../../public/Spotify_Icon_RGB_Green.png' }}</p>
            <div class="nested">
                <div class="logo" :style="`background-image: url(${image !== '' ? image : '../../../public/Spotify_Icon_RGB_Green.png'})`"></div>
            </div>
            <p>Logged in as <strong>{{ user.id }}</strong></p>
            <button @click="$router.push({ name: 'MyHiFyve' })"><h3>Hi-Fyve!</h3></button>
            <div class="nested">
                <p class="signout">Not you? <br><a @click="logout">Log out!</a></p>
            </div>
        </div>
        <LoadingSpinnerVue v-else/>
        <HomeInfoSectionVue />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { refreshAccessToken } from '../functions/refreshAccessToken';
import LoadingSpinnerVue from '@/components/LoadingSpinnerVue.vue';
import HomeInfoSectionVue from './HomeInfoSection.vue';

export default defineComponent({
    components: {
        LoadingSpinnerVue,
        HomeInfoSectionVue,
    },
    setup() {
        // property refs
        const loaded = ref(false);
        const error = ref(null);
        const spinner = ref(false);
        const colors = ref(null);
        const image = ref(localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user') as string).images[0].url : '../../../public/Spotify_Icon_RGB_Green.png');
        const access_token: Ref<string | null> = ref(localStorage.access_token as string ?? null);
        const refresh_token: Ref<string | null> = ref(localStorage.refresh_token as string ?? null);
        try {
            // try catch needs to be accessible outside of this block
            var user = ref(JSON.parse(localStorage.user));
        }
        catch {
            user = ref({ images: [{ url: '' }] });
        }

        // show/hide login button
        const hasTokens = ref(false);
        if (localStorage.length !== 0) {
            hasTokens.value = true;
        }
        else {
            hasTokens.value = false;
        }

        // login function
        const login = async () => {
            spinner.value = true;
            await fetch('https://spotifyve-backend.herokuapp.com/getURL')
            .then(res => {
                return res.json();
            })
                .then(data => {
                    window.open(data.url, '_self');
                })
                .catch(err => error.value = err)
            .catch(err => error.value = err); 
        };

        // get user info function
        const getUserInfo = async () => {
            await fetch('https://spotifyve-backend.herokuapp.com/me?access_token=' + localStorage.access_token)
                .then(res => { return res.json(); })
                    .then(data => {
                        user.value = data;
                        try {
                            image.value = data.images[0].url;
                        }
                        catch(err) {
                            console.log("no user image found!");
                            image.value = '../../../public/Spotify_Icon_RGB_Green.png';
                        }
                        localStorage.setItem("user", JSON.stringify(user.value));
                    })
                    .catch(err => error.value = err)
                .catch(err => {
                    if (err.body.status === 401 as number | string) {
                        refreshAccessToken(localStorage.refresh_token);
                        getUserInfo();
                    }
                    else {
                        error.value = err;
                    }
                });
        };

        // get genre: color pairs
        const getColors = async () => {
            // get all color pairs
            await fetch('https://spotifyve-backend.herokuapp.com/colors')
                .then(res => { return res.json() })
                    .then(data => {
                        colors.value = data;
                        localStorage.setItem("colors", JSON.stringify(user.value));
                    })
                    .catch(err => console.log(err))
                .catch(err => console.log(err));
        }

        onMounted(async () => {
            loaded.value = true;
            // check for headers
            if (window.location.search) {
                // if query found, sets code and state refs from url query and clears url query
                const params = Object.fromEntries(new URLSearchParams(window.location.search));
                access_token.value = JSON.parse(JSON.stringify(params)).access_token;
                refresh_token.value = JSON.parse(JSON.stringify(params)).refresh_token;
                let currentUrl = window.location.href;
                let newUrl = currentUrl.replace(window.location.search, "");
                history.replaceState({}, document.title, newUrl);

                // sets both token values in the session
                if (access_token.value && refresh_token.value) {
                    localStorage.setItem("access_token", access_token.value);
                    localStorage.setItem("refresh_token", refresh_token.value);
                    await getUserInfo();
                    await getColors();
                    hasTokens.value = true;
                    spinner.value = false;
                }
            }
            
            // sets user's image on mount
            try {
                console.log('here');
                const userObjString = localStorage.getItem('user');
                if (!userObjString) {
                    image.value = '../../../public/Spotify_Icon_RGB_Green.png';
                }
                else {
                    const userObj: { images: [{ url: string }] } = JSON.parse(userObjString);
                    image.value = userObj.images[0].url;
                }
            }
            catch(err) {
                console.log('here error');
                image.value = '../../../public/Spotify_Icon_RGB_Green.png';
            }
        });

        // logout user
        const logout = () => {
            localStorage.clear();
            hasTokens.value = false;
            access_token.value = null;
            refresh_token.value = null;
            user.value = { images: [{ url: '' }] };

            // this signs the user out of Spotify, may not be necessary to implement
            // const spotifyLogoutWindow = window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
            // setTimeout(() => spotifyLogoutWindow?.close(), 1000);
        };
        
        // sets user's image on mount
        try {
            console.log('there');
            const userObjString = localStorage.getItem('user');
            if (!userObjString) {
                image.value = '../../../public/Spotify_Icon_RGB_Green.png';
            }
            else {
                const userObj: { images: [{ url: string }] } = JSON.parse(userObjString);
                image.value = userObj.images[0].url;
            }
        }
        catch(err) {
            console.log('there error');
            image.value = '../../../public/Spotify_Icon_RGB_Green.png';
        }

        return { error, hasTokens, image, login, logout, getUserInfo, access_token, refresh_token, user, spinner, loaded };
    },
})
</script>

<style scoped>

.synced {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    margin: 60px auto auto auto;
    padding: 10px 30px;
    width: 300px;
    height: 90px;
    border-radius: 40px;
}
h1.hello {
    margin-top: 80px;
}
h2.title {
    color: #e47d41;
    font-size: 28px;
    margin: 20px;
}
span {
    font-size: 16px;
    font-weight: 500;
}
.profile button {
    padding: 0 40px;
    color: #f3f3f3;
    border-radius: 30px;
    border: 1px solid #ddd;
    transition: .2s ease-in-out;
    background-color: transparent;
    cursor: pointer;
}
.profile button:hover {
    transform: none;
    padding: 0 48px;
    background-color: #ddd;
    color: rgb(33,33,33);    
}
.profile {
    color: #f3f3f3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 30%;
    padding: 10px 20px; 
    border-radius: 20px;
}
.profile a {
    text-decoration: underline;
    cursor: pointer;
    color: #ddd;
}
p.email {
    color: #bbb;
    margin-top: -15px;
    font-size: 14px;
}
p.signout {
    color: #bbb;
    font-size: 14px;
}
.nested {
    width: 100%;
    display: inherit;
    justify-content: center;
    align-items: center;
}
.nested .logo {
    border: 1px solid #aaa;
    border-radius: 80px;
    background-position: center; 
    background: no-repeat;
    background-size: 100% 100%;
    width: 150px;
    height: 150px;
    flex-shrink: 0;
}
.logo {
    width: 1.5rem;
    height: 1.5rem;
    display: inherit;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
}
img {
    width: 100%;
    height: 100%;
}
button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 30px;
    background-color: rgba(29,185,84,0.9);
    border-radius: 20px;
    border: 0;
    transition: .1s ease-in-out;
}
button:hover {
    background-color: rgba(29,185,84,0.8);
    transform: translateY(1px);
}
p.button {
    font-family: 'Avenir', sans-serif;
    background-image: var(--home-panel-sync-button);
    background-clip: text;
    color: transparent;
    background-size: 400%;
    animation: bg-animation 30s infinite alternate;
    font-size: 1rem;
}
p.button:hover {
    background-image: var(--home-panel-sync-button-hover);
}
.error {
    color: #cc3300;
}
.panel h1 {
    font-size: 40px;
}
.panel {
    background-image: var(--home-panel);
    margin: auto auto 40px auto;
    width: 94%;
    min-height: 600px;
    border-radius: 40px;
    background-position: left;
    transition: 0.5s ease-in-out;
    animation: bg-animation 30s infinite alternate;
    background-size: 400%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}
.panel:hover{ 
    width: 94%;
    background-image: var(--home-panel-hover);
    box-shadow: 0 -2px 10px 10px rgb(58, 58, 58);
}
@media (max-width: 1800px) { 
    .panel {
        width: 90%;
    }
}
@media (max-width: 1250px) {
    .panel {
        width: 94%;
        animation: bg-animation 30s infinite alternate;
    }
    .panel:hover{
        width: 98%;
        animation: bg-animation 30s infinite alternate;
    }
}
@media (max-width: 450px) {
    .panel {
        width: 98%;
        animation: bg-animation 30s infinite alternate;
    }
    .panel:hover{
        width: 100%;
        animation: bg-animation 30s infinite alternate;
    }
}
</style>
