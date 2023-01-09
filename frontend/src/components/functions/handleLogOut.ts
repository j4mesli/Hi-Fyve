export const handleLogOut = () => {
    // logs user out of system
    localStorage.clear();
    const spotifyLogoutWindow = window.open('https://accounts.spotify.com/en/logout', 'Spotify Logout', 'width=700,height=500,top=40,left=40') as Window;
    setTimeout(() => {
        // vanilla JS method to redirect to home page after logout
        window.location.href = "/";
        spotifyLogoutWindow.close();
    }, 1000);
}