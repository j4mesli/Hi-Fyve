import { SpotifyAlbum } from "./SpotifyAlbum";
import { SpotifyArtist } from "./SpotifyArtist";

export interface Top50Playlist {
    album: SpotifyAlbum,
    attributes?: Array<Array<string>>,
    artists: Array<SpotifyArtist>,
    available_markets: Array<string>,
    disc_number: number,
    duration_ms: number,
    episode: boolean,
    explicit: boolean,
    external_ids: { isrc: string },
    external_urls: { spotify: string },
    href: string, 
    id: string,
    is_local: boolean,
    name: string,
    popularity: number,
    preview_url: string,
    track: boolean,
    track_number: number,
    type: string,
    uri: string,
}