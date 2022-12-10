export const refreshAccessToken = async (refresh_token: string) => {
    await fetch('http://localhost:3000/refresh?refresh_token=' + refresh_token)
    .then(res => { return res.json() })
        .then(res => { 
            sessionStorage.setItem('access_token', res.access_token as string);
            sessionStorage.setItem('refresh_token', res.refresh_token as string);
        })
        .catch(err => console.log(err))
    .catch(err => console.log(err));
};