<template>
    <div class="top-artists-wrapper">
        <div class="artist-card top open" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[0]">
            <div class="body-paragraph">
                <h2 class="title">#1. {{ (top5 as any[])[0].name }} <a target="_blank" :href="(top5 as any[])[0].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[0] }}</span></h4>
                <h4>Genre(s): 
                    <span v-if="(top5 as any[])[0].genres.length >= 1">{{ (top5 as any[])[0].genres[0] }}</span>
                    <span v-if="(top5 as any[])[0].genres.length >= 2">, {{ (top5 as any[])[0].genres[1] }}</span>
                </h4>                
                <h4>Popularity: <span>{{ (top5 as any[])[0].popularity }} / 100</span></h4>
                <h4>Followers: <span>{{ addCommas((top5 as any[])[0].followers.total) }}</span></h4>
            </div>
            <div class="pfp" :style="{ 'background-image': `url(${(top5 as any[])[0].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[1]">
            <div class="body-paragraph closed">
                <h2 class="title">#2. {{ (top5 as any[])[1].name }} <a target="_blank" :href="(top5 as any[])[1].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[1] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[1].genres.length >= 1">{{ (top5 as any[])[1].genres[0] }}</span>
                    <span v-if="(top5 as any[])[1].genres.length >= 2">, {{ (top5 as any[])[1].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[1].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[1].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[1].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[2]">
            <div class="body-paragraph closed">
                <h2 class="title">#3. {{ (top5 as any[])[2].name }} <a target="_blank" :href="(top5 as any[])[2].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[2] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[2].genres.length >= 1">{{ (top5 as any[])[2].genres[0] }}</span>
                    <span v-if="(top5 as any[])[2].genres.length >= 2">, {{ (top5 as any[])[2].genres[1] }}</span>
                </h4>                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[2].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[2].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[2].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[3]">
            <div class="body-paragraph closed">
                <h2 class="title">#4. {{ (top5 as any[])[3].name }} <a target="_blank" :href="(top5 as any[])[3].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[3] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[3].genres.length >= 1">{{ (top5 as any[])[3].genres[0] }}</span>
                    <span v-if="(top5 as any[])[3].genres.length >= 2">, {{ (top5 as any[])[3].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[3].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[3].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[3].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
        <div class="artist-card bottom" @click="e => closeHere(e)" v-if="(top5 as Array<Object>)[4]">
            <div class="body-paragraph closed">
                <h2 class="title">#5. {{ (top5 as any[])[4].name }} <a target="_blank" :href="(top5 as any[])[4].external_urls.spotify"><span id="hyperlink" class="material-symbols-outlined">launch</span></a></h2>
                <h4>Most Popular Track: <span>{{ topTracks[4] }}</span></h4>
                <h4 class="hide-child-element">Genre(s): 
                    <span v-if="(top5 as any[])[4].genres.length >= 1">{{ (top5 as any[])[4].genres[0] }}</span>
                    <span v-if="(top5 as any[])[4].genres.length >= 2">, {{ (top5 as any[])[4].genres[1] }}</span>
                </h4>
                <h4 class="hide-child-element">Popularity: <span>{{ (top5 as any[])[4].popularity }} / 100</span></h4>
                <h4 class="hide-child-element">Followers: <span>{{ addCommas((top5 as any[])[4].followers.total) }}</span></h4>
            </div>
            <div class="pfp minimized" :style="{ 'background-image': `url(${(top5 as any[])[4].images[0].url})`, 'opacity': '0.9' }"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from 'vue';
import { addCommasToNumber } from '../functions/addCommasToNumber';

export default defineComponent({
    setup() {
        const top5 = ref([
            {"external_urls":{"spotify":"https://open.spotify.com/artist/4LLpKhyESsyAXpc4laK94U"},"followers":{"href":null,"total":8311881},"genres":["hip hop","pittsburgh rap","rap"],"href":"https://api.spotify.com/v1/artists/4LLpKhyESsyAXpc4laK94U","id":"4LLpKhyESsyAXpc4laK94U","images":[{"height":640,"url":"https://i.scdn.co/image/ab6761610000e5ebed3b89aa602145fde71a163a","width":640},{"height":320,"url":"https://i.scdn.co/image/ab67616100005174ed3b89aa602145fde71a163a","width":320},{"height":160,"url":"https://i.scdn.co/image/ab6761610000f178ed3b89aa602145fde71a163a","width":160}],"name":"Mac Miller","popularity":84,"type":"artist","uri":"spotify:artist:4LLpKhyESsyAXpc4laK94U"},
            {"external_urls":{"spotify":"https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x"},"followers":{"href":null,"total":18881836},"genres":["chicago rap","rap"],"href":"https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x","id":"5K4W6rqBFWDnAN6FQUkS6x","images":[{"height":640,"url":"https://i.scdn.co/image/ab6761610000e5eb867008a971fae0f4d913f63a","width":640},{"height":320,"url":"https://i.scdn.co/image/ab67616100005174867008a971fae0f4d913f63a","width":320},{"height":160,"url":"https://i.scdn.co/image/ab6761610000f178867008a971fae0f4d913f63a","width":160}],"name":"Kanye West","popularity":91,"type":"artist","uri":"spotify:artist:5K4W6rqBFWDnAN6FQUkS6x"},
            {"external_urls":{"spotify":"https://open.spotify.com/artist/2IDLDx25HU1nQMKde4n61a"},"followers":{"href":null,"total":2108198},"genres":["indonesian hip hop"],"href":"https://api.spotify.com/v1/artists/2IDLDx25HU1nQMKde4n61a","id":"2IDLDx25HU1nQMKde4n61a","images":[{"height":640,"url":"https://i.scdn.co/image/ab6761610000e5eb39d2db28841d007ee7f8d782","width":640},{"height":320,"url":"https://i.scdn.co/image/ab6761610000517439d2db28841d007ee7f8d782","width":320},{"height":160,"url":"https://i.scdn.co/image/ab6761610000f17839d2db28841d007ee7f8d782","width":160}],"name":"Rich Brian","popularity":71,"type":"artist","uri":"spotify:artist:2IDLDx25HU1nQMKde4n61a"},
            {"external_urls":{"spotify":"https://open.spotify.com/artist/6U3ybJ9UHNKEdsH7ktGBZ7"},"followers":{"href":null,"total":1081097},"genres":["hip hop","rap"],"href":"https://api.spotify.com/v1/artists/6U3ybJ9UHNKEdsH7ktGBZ7","id":"6U3ybJ9UHNKEdsH7ktGBZ7","images":[{"height":640,"url":"https://i.scdn.co/image/ab6761610000e5eb8f0270ec23a53f3c1fe91849","width":640},{"height":320,"url":"https://i.scdn.co/image/ab676161000051748f0270ec23a53f3c1fe91849","width":320},{"height":160,"url":"https://i.scdn.co/image/ab6761610000f1788f0270ec23a53f3c1fe91849","width":160}],"name":"JID","popularity":79,"type":"artist","uri":"spotify:artist:6U3ybJ9UHNKEdsH7ktGBZ7"},
            {"external_urls":{"spotify":"https://open.spotify.com/artist/70NcAr4ZtA3FAqU16iQZSb"},"followers":{"href":null,"total":394422},"genres":["chill r&b","nyc pop","pop"],"href":"https://api.spotify.com/v1/artists/70NcAr4ZtA3FAqU16iQZSb","id":"70NcAr4ZtA3FAqU16iQZSb","images":[{"height":640,"url":"https://i.scdn.co/image/ab6761610000e5eb9d9fb46b69bfb485f8872d02","width":640},{"height":320,"url":"https://i.scdn.co/image/ab676161000051749d9fb46b69bfb485f8872d02","width":320},{"height":160,"url":"https://i.scdn.co/image/ab6761610000f1789d9fb46b69bfb485f8872d02","width":160}],"name":"dhruv","popularity":69,"type":"artist","uri":"spotify:artist:70NcAr4ZtA3FAqU16iQZSb"},
        ]) as Ref<Array<unknown>>;
        const topTracks = ref(['The Spins', 'Bound 2', 'edamame (feat. Rich Brian)', 'Enemy (with JID) - from the series Arc...', 'double take']) as Ref<Array<string>>;

        const addCommas = (x: string | number) => {
            return typeof x === 'string' ? addCommasToNumber(parseInt(x)) : addCommasToNumber(x);
        }
        const closeHere = (e: MouseEvent) => {
            // CURRENTTARGET ONLY TARGETS THE ELEM WITH LISTENER
            if ((e.target as Element).id !== 'hyperlink') {
                const elem: Element = e.currentTarget as Element;
                if (elem.classList.contains('open')) {
                    for (let i = 2; i < elem.children[0].children.length; i++) {
                        elem.children[0].children[i].classList.toggle('hide-child-element');
                        elem.children[0].classList.toggle('closed');
                    }
                    elem.children[1].classList.toggle('minimized');
                }
                else {
                    setTimeout(() => {
                        elem.children[1].classList.toggle('minimized');
                        for (let i = 2; i < elem.children[0].children.length; i++) {
                            elem.children[0].children[i].classList.toggle('hide-child-element');
                            elem.children[0].classList.toggle('closed');
                        }
                    }, 300);
                }
                elem.classList.toggle('open');
            }
        }
        return { top5, topTracks, closeHere, addCommas };
    },
})
</script>

<style>

</style>