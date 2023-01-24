var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// packages
import express from "express";
import morgan from "morgan";
import spotifyWebApi from "spotify-web-api-node";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import cors from "cors";
import invert from "invert-color";
import { readFileSync } from "fs";
const __dirname = path.resolve();
// import * as ntc from 'ntc-ts'; // primary import
import * as ntc from './functions/ntc-ts/index.js'; // alternate import
// types/interfaces/components
import { scopes } from "./components/scopes.js";
import { rgbToHex } from "./functions/RGBtoHex.js";
const colors = JSON.parse(readFileSync(path.join(__dirname, "/src/json/genre-color.json")).toString());
const colorToName = JSON.parse(readFileSync(path.join(__dirname, "/src/json/color-name.json")).toString());
const country_playlists = JSON.parse(readFileSync(path.join(__dirname, "/src/json/country-playlists.json")).toString());
const genre_colors = JSON.parse(readFileSync(path.join(__dirname, "/src/json/genre-color.json")).toString());
// init server
const app = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));
const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 5000);
// middleware
app.use(morgan('dev'));
ntc.initColors(ntc.ORIGINAL_COLORS);
// init spotify access
var config = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'json', 'access.json'), 'utf8'));
const state = crypto.randomBytes(16).toString('hex');
;
let creds = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
};
const spotifyApi = new spotifyWebApi(creds);
// routes
//// gets authorization URL for frontend to open
app.get('/getURL', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let obj = {};
    obj = Object.assign({ 'url': spotifyApi.createAuthorizeURL(scopes, state) }, obj);
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
    }
    ;
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
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            obj = Object.assign({ 'access_token': access_token }, obj);
            obj = Object.assign({ 'refresh_token': refresh_token }, obj);
            obj = Object.assign({ 'expires_in': expires_in }, obj);
            obj = Object.assign({ 'data': data }, obj);
            const query = '?access_token=' + access_token + '&refresh_token=' + refresh_token;
            res.redirect('https://hi-fyve.herokuapp.com/' + query);
        })
            .catch(error => {
            obj = Object.assign({ 'Error getting Tokens': error }, obj);
            res.send(obj);
        });
    }
    ;
});
//// refresh user token
app.get('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = res;
    if (req.query.refresh_token) {
        const refresh_token = req.query.refresh_token;
        try {
            const refreshCall = new spotifyWebApi({ clientId: creds.clientId, clientSecret: creds.clientSecret });
            refreshCall.setRefreshToken(req.query.refresh_token);
            yield spotifyApi.refreshAccessToken()
                .then((res) => {
                const data = {
                    access_token: res.body.access_token,
                    refresh_token: refresh_token,
                };
                firstRes.send(data);
            })
                .catch(err => firstRes.send(err));
        }
        catch (err) {
            res.send(err);
        }
    }
}));
//// get user info
app.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = res;
    if (req.query.access_token) {
        try {
            const params = {
                access_token: req.query.access_token,
            };
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token,
            };
            const url = 'https://api.spotify.com/v1/me';
            yield fetch(url, { headers: headers })
                .then(res => res.json())
                .then(data => firstRes.send(data))
                .catch(err => res.send(err))
                .catch(err => res.send(err));
        }
        catch (err) {
            res.send(err);
        }
    }
}));
//// get top x route
app.get('/gettopx', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = res;
    if (req.query.access_token && req.query.request_type && req.query.time_range && req.query.limit && req.query.offset) {
        try {
            const params = {
                access_token: req.query.access_token,
                request_type: req.query.request_type,
                time_range: req.query.time_range,
                limit: req.query.limit,
                offset: req.query.offset,
            };
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token,
            };
            const url = 'https://api.spotify.com/v1/me/top/' + params.request_type + '?time_range=' + params.time_range + '&limit=' + params.limit + '&offset=' + params.offset;
            yield fetch(url, { headers: headers })
                .then(res => res.json())
                .then(data => firstRes.send(data))
                .catch(err => res.send(err))
                .catch(err => res.send(err));
        }
        catch (err) {
            res.send(err);
        }
    }
    else {
        res.send({ "code": "400", "error": "Invalid Request" });
    }
}));
//// get artist tracks
app.get('/getTopTracks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id && req.query.access_token) {
        const firstRes = res;
        const url = 'https://api.spotify.com/v1/artists/' + req.query.id + '/top-tracks?market=US';
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token,
        };
        yield fetch(url, { headers: headers })
            .then(res => res.json())
            .then(data => firstRes.send(data))
            .catch(err => res.send(err))
            .catch(err => res.send(err));
    }
}));
//// get track features
app.get('/getTrackFeatures', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.access_token && req.query.id) {
        const firstRes = res;
        const url = 'https://api.spotify.com/v1/audio-features/' + req.query.id;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token,
        };
        yield fetch(url, { headers: headers })
            .then(res => res.json())
            .then(data => firstRes.send(data))
            .catch(err => res.send(err))
            .catch(err => res.send(err));
    }
}));
//// get genre: color .json
app.get('/colors', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.genre) {
        const genre = req.query.genre;
        res.send({ color: colors[genre] });
    }
    else {
        try {
            res.send(genre_colors);
        }
        catch (err) {
            const error = {
                "error": err,
                "code": 404,
            };
            res.send(error);
        }
    }
}));
//// get color: name .json HEX ONLY
app.get('/nameForColor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.color) {
        const color = req.query.color;
        res.send({ name: colorToName[color] });
    }
    else {
        try {
            res.send(genre_colors);
        }
        catch (err) {
            const error = {
                "error": err,
                "code": 404,
            };
            res.send(error);
        }
    }
}));
//// get song obj for Synesthesia
app.get('/synesthesia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = res;
    if (req.query.access_token && req.query.request_type && req.query.time_range && req.query.limit && req.query.offset) {
        try {
            const params = {
                access_token: req.query.access_token,
                request_type: req.query.request_type,
                time_range: req.query.time_range,
                limit: req.query.limit,
                offset: req.query.offset,
            };
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + params.access_token,
            };
            const url = 'https://api.spotify.com/v1/me/top/' + params.request_type + '?time_range=' + params.time_range + '&limit=' + params.limit + '&offset=' + params.offset;
            yield fetch(url, { headers: headers })
                .then(res => res.json())
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const output = {
                    top_x_songs: [],
                    top_name: data.items[0].name,
                    top_artists: [],
                    top_image: data.items[0].album.images[0].url,
                    top_mp3: data.items[0].preview_url,
                    color1: [0, 0, 0],
                    color1_hex: '',
                    color1_name: '',
                    color2: [0, 0, 0],
                    color2_hex: '',
                    color2_name: '',
                };
                data.items[0].artists.forEach((el) => {
                    output.top_artists.push(el.name);
                });
                for (let item of data.items) {
                    if (item.preview_url !== null) {
                        output.top_artists.length = 0;
                        item.artists.forEach((el) => {
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
                        output.color1 = invert.asRgbArray(output.color2);
                        output.color1_hex = rgbToHex(output.color1);
                        output.color1_name = ntc.getColorName(output.color1_hex).name;
                        firstRes.send(output);
                    }
                    else {
                        output.top_x_songs.push({
                            name: data.items[i].name,
                            artists: data.items[i].artists.map((el) => { return el.name; }),
                            image: data.items[i].album.images[0].url,
                            mp3: data.items[i].preview_url
                        });
                        yield fetch('https://spotifyve-backend.herokuapp.com/trackAnalysis?access_token=' + params.access_token + '&id=' + data.items[i.toString()].id)
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
            }))
                .catch(err => firstRes.send(err))
                .catch(err => firstRes.send(err));
        }
        catch (err) {
            firstRes.send(err);
        }
    }
    else {
        res.send('CHECK TOKEN');
    }
}));
//// detailed track analysis
app.get('/trackAnalysis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.access_token && req.query.id) {
        const firstRes = res;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token,
        };
        const url = 'https://api.spotify.com/v1/audio-features/' + req.query.id;
        yield fetch(url, { headers: headers })
            .then(res => res.json())
            .then(data => res.send(data))
            .catch(err => firstRes.send(err))
            .catch(err => firstRes.send(err));
    }
    else {
        res.send({ "code": "400", "error": "Invalid Request, check your request parameters!" });
    }
}));
//// country_playlist pairs
app.get('/country_playlists', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.type) {
        const type = req.query.type;
        const obj = country_playlists[type];
        res.send(obj);
    }
    else {
        try {
            res.send(country_playlists);
        }
        catch (err) {
            const error = {
                "error": err,
                "code": 404,
            };
            res.send(error);
        }
    }
}));
//// get tracks from playlist
app.get('/tracks_from_playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id && req.query.access_token) {
        const firstres = res;
        const playlist_url = 'https://api.spotify.com/v1/playlists/' + req.query.id;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + req.query.access_token,
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
}));
//// forumate average statistics from user item
const formulateUserAverageStatistics = (obj, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const output = {
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
        explicit: 0,
        popularity: 0,
    };
    for (let i = 0; i < Object.keys(obj).length; i++) {
        const track = obj[i];
        const url = "https://spotifyve-backend.herokuapp.com/trackAnalysis?access_token=" + access_token + "&id=" + track.id;
        // parse rest of values
        const track_stats = yield (yield fetch(url)).json();
        // add explicit and popularity values
        output.popularity += (track.popularity / 100);
        if (track.explicit) {
            output.explicit++;
        }
        try {
            Object.keys(output).forEach(key => {
                if (key !== "explicit" && key !== "popularity")
                    output[key] += track_stats[key];
            });
        }
        catch (err) {
            console.error(err.message, `at item #${i + 1} of 50 (index ${i}).`);
        }
        finally {
            if (i === Object.keys(obj).length - 1) {
                Object.keys(output).forEach((el) => {
                    const value = output[el];
                    const final_value = (el !== 'tempo' && el !== 'duration_ms' && el !== 'loudness') ? +((value / 50) * 100).toFixed(2) : +(value / 50).toFixed(2);
                    output[el] = final_value;
                });
            }
        }
    }
    return output;
});
//// get user analytics
app.get('/user_analytics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstres = res;
    if (req.query.access_token && req.query.time_range && req.query.limit && req.query.offset) {
        const url = "https://spotifyve-backend.herokuapp.com/gettopx?request_type=tracks&access_token=" + req.query.access_token + "&time_range=" + req.query.time_range + "&limit=50&offset=0";
        const user_top_songs_json = (yield (yield fetch(url)).json()).items;
        const user_item = { top_songs: user_top_songs_json, };
        user_item["average_statistics"] = yield formulateUserAverageStatistics(user_top_songs_json, req.query.access_token);
        firstres.send(user_item);
    }
    else {
        firstres.send({ "code": "400" });
    }
}));
//// get country analytics
app.get('/country_analytics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstres = res;
    if (req.query.id && req.query.access_token) {
        const url = "https://spotifyve-backend.herokuapp.com/tracks_from_playlist?access_token=" + req.query.access_token + "&id=" + req.query.id;
        const country_top_songs_json = yield (yield fetch(url)).json();
        if (country_top_songs_json) {
            const country_top_songs = {};
            for (let i = 0; i < Object.keys(country_top_songs_json).length; i++) {
                country_top_songs[i] = country_top_songs_json[i].track;
            }
            const country_item = { top_songs: country_top_songs, };
            country_item["average_statistics"] = yield formulateUserAverageStatistics(country_top_songs, req.query.access_token);
            firstres.send(country_item);
        }
        else {
            firstres.send({ "code": "403" });
        }
    }
    else {
        firstres.send({ "code": "400" });
    }
}));
