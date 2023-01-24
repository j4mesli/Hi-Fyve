// packages
import express from "express";
import morgan from "morgan";
import spotifyWebApi from "spotify-web-api-node";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import cors from "cors";
import invert, { Color } from "invert-color";
import { readFileSync } from "fs";
const __dirname = path.resolve();
// import * as ntc from 'ntc-ts'; // primary import
import * as ntc from './functions/ntc-ts/index.js'; // alternate import

// types/interfaces/components
import { scopes } from "./components/scopes.js";
import { credentials } from "./types/credentials";
import { getTopXQuery } from "./types/getTopXQuery";
import { getMyInfo } from "./types/getMyInfo";
import { songStatistics } from "./types/songStatistics.js";
import { Top50PlaylistContainer } from "./types/Top50PlaylistContainer.js";
import { Top50Playlist } from "./types/Top50Playlist.js";
import { rgbToHex } from "./functions/RGBtoHex.js";
const colors = JSON.parse(readFileSync(path.join(__dirname, "/src/json/genre-color.json")).toString());
const colorToName = JSON.parse(readFileSync(path.join(__dirname, "/src/json/color-name.json")).toString());
const country_playlists = JSON.parse(readFileSync(path.join(__dirname, "/src/json/country-playlists.json")).toString());
import { shuffleArray } from "./functions/shuffleArray.js";

// init server
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 5000);

// middleware
app.use(morgan('dev'));
ntc.initColors(ntc.ORIGINAL_COLORS);

// init spotify access
var config = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'json', 'access.json'), 'utf8'));
const state = crypto.randomBytes(16).toString('hex');;
let creds: credentials = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
};
const spotifyApi = new spotifyWebApi(creds);

// routes
//// gets authorization URL for frontend to open
app.get('/getURL', (req, res) => {
    let obj = {};
    obj = Object.assign({'url': spotifyApi.createAuthorizeURL(scopes, state)}, obj);
    res.send(obj);
});

//// callback route
app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
    // parse error
    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    };
    // output obj
    let obj = {
        'request': req.query,
        'error': error,
        'state': state,
        'code': code
    }; 

    if (typeof code === 'string') {
        spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            const access_token: string = data.body['access_token'];
            const refresh_token: string = data.body['refresh_token'];
            const expires_in: number = data.body['expires_in'];
    
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            obj = Object.assign({'access_token': access_token}, obj);
            obj = Object.assign({'refresh_token': refresh_token}, obj);
            obj = Object.assign({'expires_in': expires_in}, obj);
            obj = Object.assign({'data': data}, obj);

            const query: string = '?access_token=' + access_token + '&refresh_token=' + refresh_token;
            res.redirect('https://hi-fyve.herokuapp.com/' + query);
        })
        .catch(error => {
            obj = Object.assign({'Error getting Tokens': error}, obj);
            res.send(obj);
        });   
    };
});

//// refresh user token
app.get('/refresh', async (req, res) => {
    const firstRes = res;
    if (req.query.refresh_token) {
        const refresh_token = req.query.refresh_token;
        try {
            const refreshCall = new spotifyWebApi({ clientId: creds.clientId, clientSecret: creds.clientSecret });
            refreshCall.setRefreshToken(req.query.refresh_token as string);
            await spotifyApi.refreshAccessToken()
                .then((res: any) => {
                    const data: Object = {
                        access_token: res.body.access_token,
                        refresh_token: refresh_token,
                    };
                    firstRes.send(data);
                })
                .catch(err => firstRes.send(err));
        }
        catch(err) {
            res.send(err);
        }
    }
});

//// get user info
app.get('/me', async (req, res) => {
    const firstRes = res;
    if (req.query.access_token) {
        try {
            const params: getMyInfo = {
                access_token: req.query.access_token as string,
            }
            const headers = { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token, 
            };
            const url = 'https://api.spotify.com/v1/me';
            await fetch(url, { headers: headers })
                .then(res => res.json())
                    .then(data => firstRes.send(data))
                    .catch(err => res.send(err))
                .catch(err => res.send(err));
        }
        catch(err) {
            res.send(err);
        }
    }
});

//// get top x route
app.get('/gettopx', async (req, res) => {
    const firstRes = res;
    if (req.query.access_token && req.query.request_type && req.query.time_range && req.query.limit && req.query.offset) {
        try {
            const params: getTopXQuery = {
                access_token: req.query.access_token as string,
                request_type: req.query.request_type as string,
                time_range: req.query.time_range as string,
                limit: req.query.limit as string, 
                offset: req.query.offset as string, 
            }
            const headers = { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token, 
            };
            const url = 'https://api.spotify.com/v1/me/top/' + params.request_type + '?time_range=' + params.time_range + '&limit=' + params.limit + '&offset=' + params.offset;
            await fetch(url, { headers: headers })
                .then(res => res.json())
                    .then(data => firstRes.send(data))
                    .catch(err => res.send(err))
                .catch(err => res.send(err));
        }
        catch(err) {
            res.send(err);
        }
    }
    else {
        res.send({ "code": "400", "error": "Invalid Request" });
    }
});

//// get artist tracks
app.get('/getTopTracks', async (req, res) => {
    if (req.query.id && req.query.access_token) {
        const firstRes = res;
        const url = 'https://api.spotify.com/v1/artists/' + req.query.id + '/top-tracks?market=US';
        const headers = { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token, 
        };
        await fetch(url, { headers: headers })
            .then(res => res.json())
                .then(data => firstRes.send(data))
                .catch(err => res.send(err))
            .catch(err => res.send(err));
    }
});

//// get track features
app.get('/getTrackFeatures', async (req, res) => {
    if (req.query.access_token && req.query.id) {
        const firstRes = res;
        const url = 'https://api.spotify.com/v1/audio-features/' + req.query.id;
        const headers = { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token, 
        };
        await fetch(url, { headers: headers })
            .then(res => res.json())
                .then(data => firstRes.send(data))
                .catch(err => res.send(err))
            .catch(err => res.send(err));
    }
});

//// get genre: color .json
app.get('/colors', async (req, res) => {
    if (req.query.genre) {
        const genre = req.query.genre as string;
        res.send({ color: colors[genre as keyof typeof colors] });
    }
    else {
        try {
            const location: string = path.join(__dirname, '..', 'json', 'genre-color.json');
            res.header("Content-Type",'application/json');
            res.sendFile(location);
        }
        catch(err) {
            const error: { error: string, code: number | string } = {
                "error": err as string, 
                "code": 404,
            } 
            res.send(error);
        }
    }
});

//// get color: name .json HEX ONLY
app.get('/nameForColor', async (req, res) => {
    if (req.query.color) {
        const color = req.query.color as string;
        res.send({ name: colorToName[color as keyof typeof colorToName] });
    }
    else {
        try {
            const location: string = path.join(__dirname, '..', 'json', 'color-name.json');
            res.header("Content-Type",'application/json');
            res.sendFile(location);
        }
        catch(err) {
            const error: { error: string, code: number | string } = {
                "error": err as string, 
                "code": 404,
            } 
            res.send(error);
        }
    }
});

//// get song obj for Synesthesia
app.get('/synesthesia', async (req, res) => {
    const firstRes = res;
    if (req.query.access_token && req.query.request_type && req.query.time_range && req.query.limit && req.query.offset) {
        try {
            const params: getTopXQuery = {
                access_token: req.query.access_token as string,
                request_type: req.query.request_type as string,
                time_range: req.query.time_range as string,
                limit: req.query.limit as string, 
                offset: req.query.offset as string, 
            }
            const headers = { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token, 
            };
            const url = 'https://api.spotify.com/v1/me/top/' + params.request_type + '?time_range=' + params.time_range + '&limit=' + params.limit + '&offset=' + params.offset;
            await fetch(url, { headers: headers })
                .then(res => res.json())
                    .then(async data => {
                        // const random_selection: number = Math.floor(Math.random() * data.items.length);
                        interface synesthesiaOutput {
                            top_x_songs: Array<{ name: string, artists: string[], image: string, mp3: string }>;
                            top_name: string;
                            top_artists: string[];
                            top_image: string;
                            top_mp3: string;
                            color1: number[];
                            color1_hex: string;
                            color1_name: string;
                            color2: number[];
                            color2_hex: string;
                            color2_name: string;
                        }
                        const output: synesthesiaOutput = {
                            top_x_songs: [] as Array<{ name: string, artists: string[], image: string, mp3: string }>,
                            top_name: data.items[0].name,
                            top_artists: [] as string[],
                            top_image: data.items[0].album.images[0].url,
                            top_mp3: data.items[0].preview_url,
                            color1: [0, 0, 0] as number[],
                            color1_hex: '',
                            color1_name: '',
                            color2: [0, 0, 0] as number[],
                            color2_hex: '',
                            color2_name: '',
                        };
                        data.items[0].artists.forEach((el: { name: string }) => {
                            output.top_artists.push(el.name);
                        });
                        for (let item of data.items) {
                            if (item.preview_url !== null) {
                                output.top_artists.length = 0;
                                item.artists.forEach((el: { name: string }) => {
                                    output.top_artists.push(el.name);
                                });
                                output.top_mp3 = item.preview_url;
                                output.top_name = item.name;
                                output.top_image = item.album.images[0].url;
                                break;
                            }
                        }
                        // loop through songs and get colors
                        // const masterData = data.items;
                        for (let i = 0; i <= Object.keys(data.items).length; i++) {
                            if (i === Object.keys(data.items).length) {
                                const color2_array = output.color2.map(x => Math.round(x / (Object.keys(data.items).length * 2) * 255));
                                output.color2 = color2_array;
                                output.color2_hex = rgbToHex(output.color2);
                                output.color2_name = ntc.getColorName(output.color2_hex).name;
                                output.color1 = invert.asRgbArray(output.color2 as Color);
                                output.color1_hex = rgbToHex(output.color1);
                                output.color1_name = ntc.getColorName(output.color1_hex).name;
                                firstRes.send(output);
                            }
                            else {
                                output.top_x_songs.push({ 
                                    name: data.items[i].name, 
                                    artists: data.items[i].artists.map((el: { name: string }) => { return el.name }), 
                                    image: data.items[i].album.images[0].url, 
                                    mp3: data.items[i].preview_url 
                                });
                                await fetch('https://spotifyve-backend.herokuapp.com//trackAnalysis?access_token=' + params.access_token + '&id=' + data.items[i.toString()].id)
                                    .then(res => res.json())
                                        .then(data => {
                                            // update color1 r,g,b
                                            output.color2[0] += data.valence + data.liveness;
                                            output.color2[1] += data.danceability + data.speechiness;
                                            output.color2[2] += data.energy + data.acousticness;
                                        })
                                        .catch(err => firstRes.send(err))
                                    .catch(err => firstRes.send(err));
                            }
                        }
                     })
                    .catch(err => firstRes.send(err))
                .catch(err => firstRes.send(err));
        }
        catch(err) {
            firstRes.send(err);
        }
    }
    else {
        res.send('CHECK TOKEN');
    }
});

//// detailed track analysis
app.get('/trackAnalysis', async (req, res) => {
    if (req.query.access_token && req.query.id) {
        const firstRes = res;
        const headers = { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token as string, 
        };
        const url = 'https://api.spotify.com/v1/audio-features/' + req.query.id as string;
        await fetch(url, { headers: headers })
            .then(res => res.json())
                .then(data => res.send(data))
                .catch(err => firstRes.send(err))
            .catch(err => firstRes.send(err));
    }
    else {
        res.send({ "code": "400", "error": "Invalid Request, check your request parameters!" });
    }
});

//// country_playlist pairs
app.get('/country_playlists', async (req, res) => {
    if (req.query.type) {
        const type = req.query.type as string;
        const obj: Array<{country: string, id: string}> = country_playlists[type as keyof typeof country_playlists];
        res.send(obj);
    }
    else {
        try {
            res.send(country_playlists);
        }
        catch(err) {
            const error: { error: string, code: number | string } = {
                "error": err as string, 
                "code": 404,
            } 
            res.send(error);
        }
    }
});

//// get tracks from playlist
app.get('/tracks_from_playlist', async (req, res) => {
    if (req.query.id && req.query.access_token) {
        const firstres = res;
        const playlist_url = 'https://api.spotify.com/v1/playlists/' + req.query.id as string;
        const headers = { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token as string, 
        };
        fetch(playlist_url, { headers: headers })
        .then(res => res.json())
            .then(data => firstres.send(data.tracks.items))
            .catch(err => firstres.send(err))
        .catch(err => firstres.send(err));
    }
    else {
        res.send({ "code": "400", "error": "Invalid Request, check your request parameters!" });
    }
});

//// forumate average statistics from user item
const formulateUserAverageStatistics = async (obj: Top50PlaylistContainer, access_token: string) => {
    const output: songStatistics = {
        danceability: 0,
        energy: 0,
        loudness: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0,
        duration_ms: 0,
        explicit: 0 as number,
        popularity: 0 as number,
    };
    for (let i = 0; i < Object.keys(obj).length; i++) {
        const track = obj[i];
        const url = "https://spotifyve-backend.herokuapp.com//trackAnalysis?access_token=" + access_token + "&id=" + track.id;
        // parse rest of values
        const track_stats = await (await fetch(url)).json();
        // add explicit and popularity values
        output.popularity += (track.popularity / 100);
        if (track.explicit) {
            output.explicit++;
        }
        try {
            Object.keys(output).forEach(key => {
                if (key !== "explicit" && key !== "popularity") output[key as keyof songStatistics] += track_stats[key];
            });
        }
        catch(err) {
            console.error((err as Error).message, `at item #${i+1} of 50 (index ${i}).`);
        }
        finally {
            if (i === Object.keys(obj).length-1) {
                Object.keys(output).forEach((el: string) => {
                    const value = output[el as keyof songStatistics] as number;
                    const final_value = (el !== 'tempo' && el !== 'duration_ms' && el !== 'loudness') ? +((value / 50)*100).toFixed(2) : +(value / 50).toFixed(2);
                    output[el as keyof songStatistics] = final_value;
                });
            }
        }
    }
    return output;
}

//// get user analytics
app.get('/user_analytics', async (req, res) => {
    const firstres = res;
    if (req.query.access_token && req.query.time_range && req.query.limit && req.query.offset) {
        const url = "https://spotifyve-backend.herokuapp.com//gettopx?request_type=tracks&access_token=" + req.query.access_token as string + "&time_range=" + req.query.time_range as string + "&limit=50&offset=0";
        const user_top_songs_json: Top50PlaylistContainer = (await (await fetch(url)).json()).items;
        const user_item = { top_songs: user_top_songs_json, } as { average_statistics: songStatistics, top_songs: Top50PlaylistContainer };
        user_item["average_statistics"] = await formulateUserAverageStatistics(user_top_songs_json, req.query.access_token as string);
        firstres.send(user_item);
    }
    else {
        firstres.send({ "code": "400" });
    }
});

//// get country analytics
app.get('/country_analytics', async (req, res) => {
    const firstres = res;
    if (req.query.id && req.query.access_token) {
        const url = "https://spotifyve-backend.herokuapp.com//tracks_from_playlist?access_token=" + req.query.access_token as string + "&id=" + req.query.id as string;
        const country_top_songs_json = await (await fetch(url)).json();
        if (country_top_songs_json) {
            const country_top_songs = {} as Top50PlaylistContainer;
            for (let i = 0; i < Object.keys(country_top_songs_json).length; i++) {
                country_top_songs[i] = country_top_songs_json[i].track;
            }
            const country_item = { top_songs: country_top_songs, } as { average_statistics: songStatistics, top_songs: Top50PlaylistContainer };
            country_item["average_statistics"] = await formulateUserAverageStatistics(country_top_songs, req.query.access_token as string);
            firstres.send(country_item);
        }
        else {
            firstres.send({ "code": "403" });
        }
    }
    else {
        firstres.send({ "code": "400" });
    }
})
