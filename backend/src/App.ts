// packages
import express from "express";
import morgan from "morgan";
import spotifyWebApi from "spotify-web-api-node";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import cors from "cors";

// types/interfaces
import { credentials } from "./types/credentials";
import { scopes } from "./components/scopes";

// init server
const app = express();
app.use(cors());
app.listen(3000, 'localhost', () => {
    console.log("It's alive on http://localhost:3000");
});

// middleware
app.use(morgan('dev'));

// init spotify access
var config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json', 'access.json'), 'utf8'));
const state = crypto.randomBytes(16).toString('hex');;
let creds: credentials = {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
};
let spotifyApi = new spotifyWebApi(creds);

// routes
//// login route, send back url that gets access and refresh tokens
app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>');
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

app.get('/getKey', (req, res) => {
    let obj = {};
    obj = Object.assign({'url': spotifyApi.createAuthorizeURL(scopes, state)}, obj);
    res.send(obj);
    // res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
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
    
            // refreshes token, may be impractical to implement
        //   setInterval(async () => {
        //     const data = await spotifyApi.refreshAccessToken();
        //     const access_token = data.body['access_token'];
    
        //     console.log('The access token has been refreshed!');
        //     console.log('access_token:', access_token);
        //     spotifyApi.setAccessToken(access_token);
        //     res.send(obj);
        //   }, expires_in / 2 * 1000);

            const query: string = '?access_token=' + access_token + '&refresh_token=' + refresh_token;
            res.redirect('http://localhost:8080/' + query);
        })
        .catch(error => {
            obj = Object.assign({'Error getting Tokens': error}, obj);
            res.send(obj);
        });   
    };
});