import { SpotifyArtist } from "./SpotifyArtist";

export interface SpotifyAlbum {
    album_type: string,
    artists: Array<SpotifyArtist>,
    images: Array<{
        height: number,
        width: number,
        url: string,
    }>,
    available_markets: Array<string>,
    external_urls: { spotify: string },
    href: string,
    id: string,
    release_date: string,
    release_date_precision: string,
    total_tracks: number,
    name: string,
    type: string,
    uri: string,
}