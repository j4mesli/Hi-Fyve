export const handleLogIn = async () => {
    await fetch('https://spotifyve-backend.herokuapp.com/getURL')
    .then(res => {
        return res.json();
    })
        .then((data: Record<string, URL>) => { window.open(data.url as string | URL, '_self') })
        .catch(err => console.log(err))
    .catch(err => console.log(err)); 
};
