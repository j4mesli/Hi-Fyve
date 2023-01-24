export const refreshAccessToken = async (refresh_token: string) => {
    await fetch('https://spotifyve-backend.herokuapp.com/refresh?refresh_token=' + ((localStorage && localStorage.refresh_token !== 'undefined') ? localStorage.refresh_token : refresh_token))
    .then(res => { return res.json() })
        .then(res => { 
            localStorage.setItem('access_token', res.access_token as string);
            localStorage.setItem('refresh_token', res.refresh_token as string);
        })
        .catch(err => console.log(err))
    .catch(err => console.log(err));
};