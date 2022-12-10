export const handleLogIn = async () => {
    await fetch('http://localhost:3000/getURL')
    .then(res => {
        return res.json();
    })
        .then((data: Record<string, URL>) => { window.open(data.url as string | URL, '_self') })
        .catch(err => console.log(err))
    .catch(err => console.log(err)); 
};